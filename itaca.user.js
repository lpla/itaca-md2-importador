// ==UserScript==
// @name         ITACA MD2 docent.edu.gva.es - Importador de Calificaciones y Observaciones
// @namespace    https://lpla.github.io/
// @version      0.4.2
// @description  Importa calificaciones y observaciones desde un archivo Excel a la plataforma "mòdul docent 2" (MD2) de ITACA.
// @author       lpla
// @match        https://docent.edu.gva.es/md-front/www/*
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @grant        none
// @updateURL    https://raw.githubusercontent.com/lpla/userscripts/main/itaca.user.js
// @downloadURL  https://raw.githubusercontent.com/lpla/userscripts/main/itaca.user.js
// @supportURL   https://github.com/lpla/userscripts/issues
// ==/UserScript==

(function() {
    'use strict';

    if (window.__itacaImportadorLoaded) {
        return;
    }
    window.__itacaImportadorLoaded = true;

    const STORAGE_KEY = 'itaca-import-config';

    let currentFileData = null;
    let statusTimeoutId = null;

    const pluginStyle = document.createElement('style');
    pluginStyle.textContent = `
        #pluginContainer input[type="number"] {
            width: 60px;
            appearance: auto !important;
            -moz-appearance: auto !important;
        }

        #pluginContainer input[type="number"]::-webkit-outer-spin-button,
        #pluginContainer input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: auto !important;
            margin: 0;
            opacity: 1 !important;
        }

        #pluginContainer button {
            font-family: inherit;
            appearance: none;
            -webkit-appearance: none;
            border: 1px solid rgba(255,255,255,0.45);
            background: #19afe0;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
        }

        #pluginContainer button:hover:not(:disabled) {
            filter: brightness(1.05);
        }

        #pluginContainer button:disabled {
            background: #7f8c94;
            border-color: rgba(255,255,255,0.25);
            color: rgba(255,255,255,0.8);
            cursor: not-allowed;
            opacity: 1;
        }

        #pluginContainer .plugin-box {
            margin-top: 8px;
            padding: 6px;
            border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.08);
            font-size: 0.85em;
        }

        #pluginContainer .plugin-box h4 {
            margin: 0 0 6px 0;
            font-size: 1em;
        }

        #pluginContainer table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 0.8em;
        }

        #pluginContainer th,
        #pluginContainer td {
            border: 1px solid rgba(255,255,255,0.2);
            padding: 4px;
            vertical-align: top;
            word-break: break-word;
        }

        #pluginContainer ul {
            margin: 6px 0 0 18px;
            padding: 0;
        }

        #pluginContainer .muted {
            opacity: 0.85;
            font-size: 0.8em;
        }

        #pluginContainer .compact {
            margin: 4px 0;
        }
    `;
    document.head.appendChild(pluginStyle);

    function isInClassroom() {
        const hash = window.location.hash;
        const regex = /^#centre\/\d+\/grup\/\d+\/avaluacio\/\d+\/dades\/[\d;A-Z,]+$/;
        return regex.test(hash);
    }

    function getDisclaimerElement() {
        const disclaimer = document.createElement('p');
        disclaimer.style.fontSize = '0.6em';
        disclaimer.style.margin = '10px 0';
        disclaimer.style.color = 'white';
        disclaimer.textContent = 'Todos los datos introducidos se procesan en este ordenador y no se mandan ni se procesan en ningún servidor externo.';
        return disclaimer;
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalizeName(name) {
        return String(name ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/-/g, ' ')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ');
    }

    function normalizeHeaderText(value) {
        return normalizeName(value).replace(/[^\p{L}\p{N}\s]/gu, ' ');
    }

    function extractMark(mark) {
        if (mark == null || mark === '') return '';

        if (typeof mark === 'number') {
            return String(mark);
        }

        const text = String(mark)
            .trim()
            .replace(/\s+/g, ' ')
            .replace(',', '.');

        const match = text.match(/^(\d+(?:\.\d+)?)/);
        return match ? match[1] : '';
    }

    function levenshtein(a, b) {
        const tmp = [];
        if (a.length === 0) { return b.length; }
        if (b.length === 0) { return a.length; }
        for (let i = 0; i <= b.length; i++) { tmp[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { tmp[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                tmp[i][j] = b[i - 1] === a[j - 1]
                    ? tmp[i - 1][j - 1]
                    : Math.min(
                        tmp[i - 1][j - 1] + 1,
                        Math.min(tmp[i][j - 1] + 1, tmp[i - 1][j] + 1)
                    );
            }
        }
        return tmp[b.length][a.length];
    }

    function formatExcelName(name) {
        const parts = String(name).trim().split(/\s+/);
        if (parts.length > 2) {
            const firstName = parts.slice(0, parts.length - 2).join(' ');
            const lastNames = parts.slice(parts.length - 2).join(' ');
            return `${lastNames}, ${firstName}`;
        } else {
            const firstName = parts[0] || '';
            const lastNames = parts.slice(1).join(' ');
            return `${lastNames}, ${firstName}`.trim();
        }
    }

    function formatAlternativeExcelName(name) {
        const parts = String(name).trim().split(/\s+/);
        const firstName = parts.slice(0, -1).join(' ');
        const lastName = parts.slice(-1).join(' ');
        return `${lastName}, ${firstName}`.trim();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isElementVisible(el) {
        return !!el && window.getComputedStyle(el).display !== 'none';
    }

    async function waitForVisibleElement(selector, timeout = 3000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (isElementVisible(el)) {
                return el;
            }
            await sleep(100);
        }
        return null;
    }

    async function waitForHiddenElement(selector, timeout = 3000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (!isElementVisible(el)) {
                return true;
            }
            await sleep(100);
        }
        return false;
    }

    function isReasonableMatch(a, b, distance) {
        const maxLen = Math.max(a.length, b.length);
        return distance <= Math.max(2, Math.floor(maxLen * 0.2));
    }

    function findColumnByRules(normalizedHeaders, rules) {
        for (const rule of rules) {
            const idx = normalizedHeaders.findIndex(h => rule.test(h));
            if (idx !== -1) return idx;
        }
        return null;
    }

    function detectColumnsFromHeader(headers) {
        const normalizedHeaders = headers.map(h => normalizeHeaderText(h));

        const nameRules = [
            /\bapellidos?\s+y\s+nombres?\b/,
            /\bcognoms?\s+i\s+nom\b/,
            /\bapellido(?:s)?\b.*\bnombre(?:s)?\b/,
            /\bnombre(?:s)?\s+y\s+apellido(?:s)?\b/,
            /\bnombre(?:s)?\s+completo(?:s)?\b/,
            /\balumno(?:s)?\b/,
            /\balumne(?:s)?\b/,
            /\bestudiante(?:s)?\b/,
            /\bnombre(?:s)?\b/,
            /\bnom(?:s)?\b/
        ];

        const markRules = [
            /\bcalificacion(?:es)?\b/,
            /\bqualificacio(?:ns)?\b/,
            /\bnota(?:s)?\b/,
            /\bnota\s+final\b/,
            /\bresultado(?:s)?\b/
        ];

        const observationRules = [
            /\bobservaciones?\b/,
            /\bobservacions?\b/,
            /\bcomentarios?\b/,
            /\bcomentaris?\b/,
            /\bobs\b/
        ];

        return {
            name: findColumnByRules(normalizedHeaders, nameRules),
            mark: findColumnByRules(normalizedHeaders, markRules),
            observation: findColumnByRules(normalizedHeaders, observationRules)
        };
    }

    function findBestStudentMatch(studentEntries, normalizedPrimary, normalizedAlternative = '') {
        for (const entry of studentEntries) {
            if (entry.normalized === normalizedPrimary) {
                return {
                    match: entry.nameElement,
                    distance: 0,
                    exact: true,
                    matchedSource: normalizedPrimary,
                    normalizedTarget: entry.normalized
                };
            }
        }

        if (normalizedAlternative) {
            for (const entry of studentEntries) {
                if (entry.normalized === normalizedAlternative) {
                    return {
                        match: entry.nameElement,
                        distance: 0,
                        exact: true,
                        matchedSource: normalizedAlternative,
                        normalizedTarget: entry.normalized
                    };
                }
            }
        }

        let bestEntry = null;
        let bestDistance = Infinity;
        let bestSource = normalizedPrimary;

        for (const entry of studentEntries) {
            let chosenSource = normalizedPrimary;
            let distance = levenshtein(normalizedPrimary, entry.normalized);

            if (normalizedAlternative) {
                const alternativeDistance = levenshtein(normalizedAlternative, entry.normalized);
                if (alternativeDistance < distance) {
                    distance = alternativeDistance;
                    chosenSource = normalizedAlternative;
                }
            }

            if (distance < bestDistance) {
                bestDistance = distance;
                bestEntry = entry;
                bestSource = chosenSource;
            }
        }

        return {
            match: bestEntry ? bestEntry.nameElement : null,
            distance: bestDistance,
            exact: false,
            matchedSource: bestSource,
            normalizedTarget: bestEntry ? bestEntry.normalized : ''
        };
    }

    const pluginContainer = document.createElement('div');
    pluginContainer.id = 'pluginContainer';
    pluginContainer.style.position = 'fixed';
    pluginContainer.style.top = '10px';
    pluginContainer.style.left = '10px';
    pluginContainer.style.zIndex = '10000';
    pluginContainer.style.background = '#576670';
    pluginContainer.style.color = 'white';
    pluginContainer.style.border = '1px solid #ccc';
    pluginContainer.style.fontFamily = 'sans-serif';
    pluginContainer.style.width = '380px';

    const pluginHeader = document.createElement('div');
    pluginHeader.id = 'pluginHeader';
    pluginHeader.style.background = '#576670';
    pluginHeader.style.cursor = 'pointer';
    pluginHeader.style.padding = '5px';
    pluginHeader.style.display = 'flex';
    pluginHeader.style.justifyContent = 'space-between';
    pluginHeader.style.alignItems = 'center';

    const headerTitle = document.createElement('span');
    headerTitle.textContent = 'Importador de Calificaciones';
    pluginHeader.appendChild(headerTitle);

    const devCredit = document.createElement('div');
    devCredit.style.fontSize = '0.6em';
    devCredit.style.margin = '10px 0';
    devCredit.style.textAlign = 'center';
    devCredit.innerHTML = 'Desarrollado por <a href="https://github.com/lpla" target="_blank" style="color: white; text-decoration: underline;">lpla</a>; soporte Excel por <a href="https://docs.sheetjs.com" target="_blank" style="color: white; text-decoration: underline;">SheetJS</a>';

    const minimizeButton = document.createElement('button');
    minimizeButton.id = 'minimizeButton';
    minimizeButton.textContent = '–';
    minimizeButton.style.background = 'transparent';
    minimizeButton.style.color = 'white';
    minimizeButton.style.border = 'none';
    minimizeButton.style.cursor = 'pointer';
    minimizeButton.style.fontSize = '16px';
    pluginHeader.appendChild(minimizeButton);

    pluginContainer.appendChild(pluginHeader);
    pluginContainer.appendChild(devCredit);

    const pluginContent = document.createElement('div');
    pluginContent.id = 'pluginContent';
    pluginContent.style.padding = '5px';
    pluginContent.style.background = '#576670';
    pluginContainer.appendChild(pluginContent);
    document.body.appendChild(pluginContainer);

    const controlsContainer = document.createElement('div');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.style.width = '100%';
    controlsContainer.appendChild(fileInput);

    const importButton = document.createElement('button');
    importButton.textContent = 'Importar archivo preparado';
    importButton.disabled = true;
    importButton.style.width = '100%';
    importButton.style.marginTop = '6px';
    importButton.style.padding = '6px';
    importButton.style.cursor = 'pointer';
    importButton.style.background = '#19afe0';
    importButton.style.color = 'white';
    importButton.style.border = '1px solid rgba(255,255,255,0.45)';
    importButton.style.borderRadius = '4px';
    importButton.style.fontWeight = 'bold';
    importButton.style.boxShadow = '0 1px 2px rgba(0,0,0,0.25)';
    controlsContainer.appendChild(importButton);

    const configDiv = document.createElement('div');
    configDiv.style.marginTop = '5px';
    configDiv.innerHTML = `
        <label style="display:block; margin-bottom:5px;">
            Columna de nombres:
            <input type="number" id="col-name" min="1" step="1" value="1" inputmode="numeric" style="width:60px;">
        </label>
        <label style="display:block; margin-bottom:5px;">
            Columna de notas:
            <input type="number" id="col-mark" min="1" step="1" value="2" inputmode="numeric" style="width:60px;">
        </label>
        <label style="display:block; margin-bottom:5px;">
            Columna de observaciones:
            <input type="number" id="col-observation" min="1" step="1" value="3" inputmode="numeric" style="width:60px;">
        </label>
        <div id="statusMsg" style="margin-top:5px; font-weight:bold;"></div>
    `;
    controlsContainer.appendChild(configDiv);

    const colNameInput = configDiv.querySelector('#col-name');
    const colMarkInput = configDiv.querySelector('#col-mark');
    const colObservationInput = configDiv.querySelector('#col-observation');
    const statusMsg = configDiv.querySelector('#statusMsg');

    const previewContainer = document.createElement('div');
    previewContainer.className = 'plugin-box';
    previewContainer.style.display = 'none';
    controlsContainer.appendChild(previewContainer);

    const reportContainer = document.createElement('div');
    reportContainer.className = 'plugin-box';
    reportContainer.style.display = 'none';
    controlsContainer.appendChild(reportContainer);

    function saveConfig() {
        const config = {
            colName: colNameInput.value,
            colMark: colMarkInput.value,
            colObservation: colObservationInput.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    function loadConfig() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const config = JSON.parse(raw);
            if (config.colName) colNameInput.value = config.colName;
            if (config.colMark) colMarkInput.value = config.colMark;
            if (config.colObservation) colObservationInput.value = config.colObservation;
        } catch (error) {
            console.warn('No se pudo cargar la configuración guardada:', error);
        }
    }

    function getConfiguredColumns() {
        const colName = parseInt(colNameInput.value, 10) - 1;
        const colMark = parseInt(colMarkInput.value, 10) - 1;
        const colObservation = parseInt(colObservationInput.value, 10) - 1;

        if (Number.isNaN(colName) || colName < 0 || Number.isNaN(colMark) || colMark < 0) {
            return null;
        }

        return {
            colName,
            colMark,
            colObservation: Number.isNaN(colObservation) || colObservation < 0 ? null : colObservation
        };
    }

    function validateConfiguredColumns() {
        const configured = getConfiguredColumns();

        if (!configured) {
            return {
                valid: false,
                message: 'La configuración de columnas no es válida.',
                configured: null
            };
        }

        if (!currentFileData) {
            return {
                valid: true,
                configured
            };
        }

        const maxColumns = currentFileData.maxColumnCount || 0;

        if (configured.colName >= maxColumns || configured.colMark >= maxColumns) {
            return {
                valid: false,
                message: 'La columna de nombres o la de notas no existe en el archivo.',
                configured: null
            };
        }

        if (configured.colName === configured.colMark) {
            return {
                valid: false,
                message: 'La columna de nombres y la de notas no pueden ser la misma.',
                configured: null
            };
        }

        const effectiveConfigured = { ...configured };

        if (effectiveConfigured.colObservation != null && effectiveConfigured.colObservation >= maxColumns) {
            effectiveConfigured.colObservation = null;
        }

        if (
            effectiveConfigured.colObservation != null &&
            (
                effectiveConfigured.colObservation === effectiveConfigured.colName ||
                effectiveConfigured.colObservation === effectiveConfigured.colMark
            )
        ) {
            return {
                valid: false,
                message: 'La columna de observaciones no puede coincidir con la de nombres o la de notas.',
                configured: null
            };
        }

        return {
            valid: true,
            configured: effectiveConfigured
        };
    }

    function setControlsDisabled(disabled) {
        fileInput.disabled = disabled;
        colNameInput.disabled = disabled;
        colMarkInput.disabled = disabled;
        colObservationInput.disabled = disabled;
        importButton.disabled = disabled || !currentFileData;
        importButton.style.cursor = importButton.disabled ? 'not-allowed' : 'pointer';
    }

    function showStatus(message, isError = false) {
        if (!statusMsg) return;

        statusMsg.textContent = message;
        statusMsg.style.backgroundColor = isError ? '#d1a16d' : '#19afe0';
        statusMsg.style.color = 'white';
        statusMsg.style.padding = '3px';

        if (statusTimeoutId) {
            clearTimeout(statusTimeoutId);
        }

        statusTimeoutId = setTimeout(() => {
            statusMsg.textContent = '';
            statusMsg.style.backgroundColor = 'transparent';
            statusMsg.style.padding = '0';
        }, 5000);
    }

    function trimWords(value, maxWords = 10) {
        const text = String(value ?? '').trim();
        if (!text) return '';

        const words = text.split(/\s+/);
        if (words.length <= maxWords) {
            return text;
        }

        return `${words.slice(0, maxWords).join(' ')}…`;
    }

    function renderPreview() {
        if (!currentFileData) {
            previewContainer.style.display = 'none';
            previewContainer.innerHTML = '';
            return;
        }

        const configured = getConfiguredColumns();
        if (!configured) {
            previewContainer.style.display = 'block';
            previewContainer.innerHTML = '<h4>Vista previa</h4><div>La configuración de columnas no es válida.</div>';
            return;
        }

        const { headerRow, studentData, fileName, sheetName, maxColumnCount } = currentFileData;
        const rows = studentData.slice(0, 3);

        const previewColumns = [
            { label: 'Nombres', index: configured.colName, trimPreviewWords: null },
            { label: 'Notas', index: configured.colMark, trimPreviewWords: null },
            { label: 'Observaciones', index: configured.colObservation, trimPreviewWords: 10 }
        ];

        const tableHead = previewColumns.map(col => {
            const columnExists = col.index != null && col.index >= 0 && col.index < maxColumnCount;
            const headerValue = columnExists ? (headerRow[col.index] ?? `Columna ${col.index + 1}`) : '(sin columna)';
            const number = columnExists ? `C${col.index + 1}` : '—';
            return `<th>${escapeHtml(col.label)}<br><span class="muted">${escapeHtml(number)} · ${escapeHtml(headerValue)}</span></th>`;
        }).join('');

        const tableRows = rows.length
            ? rows.map(row => {
                const tds = previewColumns.map(col => {
                    const columnExists = col.index != null && col.index >= 0 && col.index < maxColumnCount;
                    const rawValue = columnExists ? (row[col.index] ?? '') : '';
                    const previewValue = col.trimPreviewWords
                        ? trimWords(rawValue, col.trimPreviewWords)
                        : rawValue;
                    return `<td>${escapeHtml(previewValue)}</td>`;
                }).join('');
                return `<tr>${tds}</tr>`;
            }).join('')
            : '<tr><td colspan="3">No hay filas de datos en la hoja.</td></tr>';

        previewContainer.style.display = 'block';
        previewContainer.innerHTML = `
            <h4>Vista previa</h4>
            <div class="compact"><strong>Archivo:</strong> ${escapeHtml(fileName)}</div>
            <div class="compact"><strong>Hoja:</strong> ${escapeHtml(sheetName)}</div>
            <div class="compact muted">Se muestran las primeras ${rows.length} filas de datos con la configuración actual.</div>
            <table style="margin-top:6px;">
                <thead><tr>${tableHead}</tr></thead>
                <tbody>${tableRows}</tbody>
            </table>
        `;
    }

    function renderReport(report) {
        if (!report) {
            reportContainer.style.display = 'none';
            reportContainer.innerHTML = '';
            return;
        }

        const unmatchedHtml = report.unmatched.length
            ? `<div class="compact"><strong>No encontrados (${report.unmatched.length}):</strong></div>
               <ul>${report.unmatched.slice(0, 10).map(name => `<li>${escapeHtml(name)}</li>`).join('')}</ul>
               ${report.unmatched.length > 10 ? `<div class="muted">Y ${report.unmatched.length - 10} más.</div>` : ''}`
            : '';

        const invalidMarksHtml = report.invalidMarks.length
            ? `<div class="compact" style="margin-top:8px;"><strong>Filas con nota no interpretable (${report.invalidMarks.length}):</strong></div>
               <ul>${report.invalidMarks.slice(0, 10).map(name => `<li>${escapeHtml(name)}</li>`).join('')}</ul>
               ${report.invalidMarks.length > 10 ? `<div class="muted">Y ${report.invalidMarks.length - 10} más.</div>` : ''}`
            : '';

        const errorsHtml = report.errors.length
            ? `<div class="compact" style="margin-top:8px;"><strong>Incidencias (${report.errors.length}):</strong></div>
               <ul>${report.errors.slice(0, 10).map(err => `<li>${escapeHtml(err)}</li>`).join('')}</ul>
               ${report.errors.length > 10 ? `<div class="muted">Y ${report.errors.length - 10} más.</div>` : ''}`
            : '';

        reportContainer.style.display = 'block';
        reportContainer.innerHTML = `
            <h4>Informe de importación</h4>
            <div class="compact"><strong>Filas leídas:</strong> ${report.totalRows}</div>
            <div class="compact"><strong>Filas procesables:</strong> ${report.rowsConsidered}</div>
            <div class="compact"><strong>Filas omitidas:</strong> ${report.rowsSkipped}</div>
            <div class="compact"><strong>Coincidencias exactas:</strong> ${report.exactMatches}</div>
            <div class="compact"><strong>Coincidencias aproximadas:</strong> ${report.fuzzyMatches}</div>
            <div class="compact"><strong>Notas actualizadas:</strong> ${report.marksUpdated}</div>
            <div class="compact"><strong>Observaciones actualizadas:</strong> ${report.observationsUpdated}</div>
            <div class="compact"><strong>Guardado lanzado:</strong> ${report.saveTriggered ? 'sí' : 'no'}</div>
            ${report.saveButtonMissing ? `<div class="compact" style="margin-top:6px;"><strong>Aviso:</strong> no se encontró el botón de guardar evaluación.</div>` : ''}
            ${unmatchedHtml}
            ${invalidMarksHtml}
            ${errorsHtml}
        `;
    }

    function applyDetectedColumns(detectedColumns) {
        let changed = false;

        if (detectedColumns.name != null) {
            colNameInput.value = String(detectedColumns.name + 1);
            changed = true;
        }
        if (detectedColumns.mark != null) {
            colMarkInput.value = String(detectedColumns.mark + 1);
            changed = true;
        }
        if (detectedColumns.observation != null) {
            colObservationInput.value = String(detectedColumns.observation + 1);
            changed = true;
        }

        if (changed) {
            saveConfig();
        }

        return changed;
    }

    async function handleFileSelection(e) {
        const file = e.target.files[0];
        renderReport(null);
        currentFileData = null;
        importButton.disabled = true;

        if (!file) {
            showStatus('No se ha seleccionado ningún archivo.', true);
            return;
        }

        const reader = new FileReader();

        reader.onload = function(evt) {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];

                if (!firstSheetName) {
                    throw new Error('El archivo no contiene hojas.');
                }

                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (!jsonData.length) {
                    throw new Error('La hoja está vacía.');
                }

                const headerRow = Array.isArray(jsonData[0]) ? jsonData[0] : [];
                const studentData = jsonData.slice(1);
                const maxColumnCount = jsonData.reduce((max, row) => {
                    return Math.max(max, Array.isArray(row) ? row.length : 0);
                }, 0);

                currentFileData = {
                    fileName: file.name,
                    sheetName: firstSheetName,
                    headerRow,
                    studentData,
                    maxColumnCount
                };

                const detectedColumns = detectColumnsFromHeader(headerRow);
                const autoDetected = applyDetectedColumns(detectedColumns);

                renderPreview();
                setControlsDisabled(false);

                if (studentData.length === 0) {
                    showStatus('Archivo cargado, pero la hoja no contiene filas de datos.', true);
                    return;
                }

                if (autoDetected) {
                    showStatus('Archivo preparado y columnas autodetectadas. Revise la vista previa antes de importar.');
                } else {
                    showStatus('Archivo preparado. Revise las columnas y la vista previa antes de importar.');
                }
            } catch (error) {
                console.error('Error al procesar el archivo:', error);
                currentFileData = null;
                renderPreview();
                renderReport(null);
                setControlsDisabled(false);
                showStatus(`Error al procesar el archivo: ${error.message}`, true);
            } finally {
                fileInput.value = '';
            }
        };

        reader.onerror = function(err) {
            console.error('Error al leer el archivo:', err);
            currentFileData = null;
            renderPreview();
            renderReport(null);
            setControlsDisabled(false);
            fileInput.value = '';
            showStatus('Error al leer el archivo.', true);
        };

        reader.readAsArrayBuffer(file);
    }

    async function fillMarksAndObservations(studentData, colName, colMark, colObservation) {
        const stats = {
            totalRows: studentData.length,
            rowsConsidered: 0,
            rowsSkipped: 0,
            exactMatches: 0,
            fuzzyMatches: 0,
            marksUpdated: 0,
            observationsUpdated: 0,
            unmatched: [],
            invalidMarks: [],
            errors: [],
            saveTriggered: false,
            saveButtonMissing: false
        };

        const studentEntries = Array.from(document.querySelectorAll('div.imc-nom > p')).map(nameElement => ({
            nameElement,
            normalized: normalizeName(nameElement.textContent)
        }));

        if (!studentEntries.length) {
            throw new Error('No se encontraron alumnos en la página de ITACA.');
        }

        for (const row of studentData) {
            const name = row[colName];
            const mark = row[colMark];
            const observation = colObservation != null ? row[colObservation] : '';

            if (name == null || name === '' || mark == null || mark === '') {
                stats.rowsSkipped++;
                continue;
            }

            stats.rowsConsidered++;

            if (stats.rowsConsidered % 5 === 0) {
                showStatus(`Procesando ${stats.rowsConsidered}/${studentData.length}...`);
            }

            const rawName = String(name).trim();
            const isAlreadyFormatted = rawName.includes(',');
            const formattedName = isAlreadyFormatted ? rawName : formatExcelName(rawName);
            const normalizedExcelName = normalizeName(formattedName);
            const normalizedAlternativeExcelName = !isAlreadyFormatted
                ? normalizeName(formatAlternativeExcelName(rawName))
                : '';

            const extractedMark = extractMark(mark);
            if (extractedMark === '') {
                stats.invalidMarks.push(formattedName);
                continue;
            }

            const matchResult = findBestStudentMatch(
                studentEntries,
                normalizedExcelName,
                normalizedAlternativeExcelName
            );

            const acceptable = matchResult.match && (
                matchResult.exact ||
                isReasonableMatch(
                    matchResult.matchedSource,
                    matchResult.normalizedTarget,
                    matchResult.distance
                )
            );

            if (!acceptable) {
                stats.unmatched.push(formattedName);
                continue;
            }

            if (matchResult.exact) {
                stats.exactMatches++;
            } else {
                stats.fuzzyMatches++;
            }

            const bestMatch = matchResult.match;
            const studentRow = bestMatch.closest('li');

            try {
                const markInputElement = bestMatch.parentNode.nextElementSibling?.querySelector('input');
                if (markInputElement) {
                    markInputElement.value = extractedMark;
                    markInputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    markInputElement.dispatchEvent(new Event('change', { bubbles: true }));
                    markInputElement.dispatchEvent(new Event('blur', { bubbles: true }));
                    stats.marksUpdated++;
                } else {
                    stats.errors.push(`No se encontró el input de nota para: ${formattedName}`);
                }

                if (observation != null && String(observation).trim() !== '') {
                    if (!studentRow) {
                        stats.errors.push(`No se encontró la fila del alumno para las observaciones: ${formattedName}`);
                        continue;
                    }

                    const obsButton = studentRow.querySelector('div.imc-qualificacio > a');
                    if (!obsButton) {
                        stats.errors.push(`No se encontró el botón de observaciones para: ${formattedName}`);
                        continue;
                    }

                    obsButton.click();

                    const modal = await waitForVisibleElement('#imc-modul-observacions-avanzada');
                    if (!modal) {
                        stats.errors.push(`El modal de observaciones no se abrió para: ${formattedName}`);
                        continue;
                    }

                    const textarea = modal.querySelector('textarea.imc-f-observacions-avanzada');
                    if (!textarea) {
                        stats.errors.push(`No se encontró el textarea de observaciones para: ${formattedName}`);
                        continue;
                    }

                    textarea.value = String(observation);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                    textarea.dispatchEvent(new Event('blur', { bubbles: true }));

                    const finalizeButton = modal.querySelector('a.imc-bt-finalitza');
                    if (!finalizeButton) {
                        stats.errors.push(`No se encontró el botón "Finaliza" para: ${formattedName}`);
                        continue;
                    }

                    finalizeButton.click();

                    const closed = await waitForHiddenElement('#imc-modul-observacions-avanzada');
                    if (!closed) {
                        stats.errors.push(`El modal de observaciones no se cerró a tiempo para: ${formattedName}`);
                        continue;
                    }

                    stats.observationsUpdated++;
                }
            } catch (error) {
                console.error(`Error procesando al alumno ${formattedName}:`, error);
                stats.errors.push(`Error procesando ${formattedName}: ${error.message}`);
            }
        }

        const updateButton = document.getElementById('imc-bt-guarda-avaluacio');
        if (updateButton) {
            updateButton.disabled = false;
            updateButton.click();
            stats.saveTriggered = true;
        } else {
            stats.saveButtonMissing = true;
            console.warn('No se encontró el botón de guardar evaluación.');
        }

        return stats;
    }

    async function handleImport() {
        if (!currentFileData) {
            showStatus('Primero seleccione un archivo.', true);
            return;
        }

        const validation = validateConfiguredColumns();
        if (!validation.valid) {
            showStatus(validation.message, true);
            return;
        }

        const configured = validation.configured;

        saveConfig();
        setControlsDisabled(true);
        importButton.textContent = 'Importando...';
        showStatus('Procesando datos...');

        try {
            const report = await fillMarksAndObservations(
                currentFileData.studentData,
                configured.colName,
                configured.colMark,
                configured.colObservation
            );

            renderReport(report);
            showStatus('Proceso completado.');
            console.log('Resumen importación:', report);
        } catch (error) {
            console.error('Error durante la importación:', error);
            renderReport({
                totalRows: currentFileData.studentData.length,
                rowsConsidered: 0,
                rowsSkipped: 0,
                exactMatches: 0,
                fuzzyMatches: 0,
                marksUpdated: 0,
                observationsUpdated: 0,
                unmatched: [],
                invalidMarks: [],
                errors: [error.message],
                saveTriggered: false,
                saveButtonMissing: false
            });
            showStatus(`Error durante la importación: ${error.message}`, true);
        } finally {
            importButton.textContent = 'Importar archivo preparado';
            setControlsDisabled(false);
        }
    }

    function updatePluginUI() {
        if (!isInClassroom()) {
            if (pluginContent.getAttribute('data-mode') !== 'instructions') {
                pluginContent.innerHTML = '';
                const instructions = document.createElement('p');
                instructions.style.padding = '5px';
                instructions.style.color = 'white';
                instructions.textContent = 'Primero, acceda a la pantalla de las calificaciones de un grupo en una evaluación concreta para usar esta herramienta.';
                pluginContent.appendChild(instructions);
                pluginContent.appendChild(getDisclaimerElement());
                pluginContent.setAttribute('data-mode', 'instructions');
            }
        } else {
            if (pluginContent.getAttribute('data-mode') !== 'controls') {
                pluginContent.innerHTML = '';
                pluginContent.appendChild(controlsContainer);
                pluginContent.appendChild(getDisclaimerElement());
                pluginContent.setAttribute('data-mode', 'controls');
                renderPreview();
                renderReport(null);
                setControlsDisabled(false);
            }
        }
    }

    fileInput.addEventListener('change', handleFileSelection, false);
    importButton.addEventListener('click', handleImport);

    [colNameInput, colMarkInput, colObservationInput].forEach(input => {
        input.addEventListener('change', () => {
            saveConfig();
            renderPreview();
        });
    });

    loadConfig();

    window.addEventListener('hashchange', updatePluginUI);
    updatePluginUI();

    minimizeButton.addEventListener('click', function() {
        if (pluginContent.style.display === 'none') {
            pluginContent.style.display = 'block';
            minimizeButton.textContent = '–';
        } else {
            pluginContent.style.display = 'none';
            minimizeButton.textContent = '+';
        }
    });
})();
