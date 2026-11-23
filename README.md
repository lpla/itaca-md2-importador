# Importador de qualificacions per a ITACA MD2

Este repositori conté un únic script per a facilitar la importació de **notes** i **observacions** en **ITACA MD2** des d'un fitxer Excel.

Està pensat per a professorat que vol estalviar temps en passar dades a ITACA sense haver d'escriure-les una a una.

[Llegir en castellà](#castellano)

> [!IMPORTANT]
> **Importar archivo preparado** pot substituir notes i observacions existents i intenta guardar l'avaluació automàticament. La vista prèvia mostra les primeres files de l'Excel. Les coincidències amb l'alumnat es calculen en importar.

---

## Instal·lació

La instal·lació es fa en **dos passos**.

### Pas 1: instal·lar Tampermonkey

**Tampermonkey** és una extensió del navegador necessària per a poder instal·lar este script.

Tria el teu navegador i fes clic en l'enllaç corresponent:

- **Google Chrome:** [Instal·lar Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Microsoft Edge:** [Instal·lar Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd)
- **Mozilla Firefox:** [Instal·lar Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Opera:** [Instal·lar Tampermonkey](https://addons.opera.com/en/extensions/details/tampermonkey-beta/)
- **Safari (Mac):** [Instal·lar Tampermonkey](https://apps.apple.com/es/app/tampermonkey/id6738342400)  
  Si utilitzes una versió anterior de Safari o macOS, és possible que necessites esta altra versió: [Tampermonkey Classic](https://apps.apple.com/es/app/tampermonkey-classic/id1482490089?mt=12)

Quan s'òbriga la botiga d'extensions del navegador, prem **Instal·lar**, **Afegir** o **Obtindre**, segons el cas.

En **Chrome i Edge**, obri **Gestiona l'extensió** de Tampermonkey i activa **Permet els scripts d'usuari** si apareix. Si el teu navegador mostra una altra opció, consulta la [guia de permisos de Tampermonkey](https://www.tampermonkey.net/faq.php?locale=es&q=Q209). Si el centre gestiona el navegador i l'opció està blocada, consulta la persona responsable d'informàtica.

En **Safari**, activa Tampermonkey en **Safari → Configuració → Extensions** i permet que l'extensió funcione en `docent.edu.gva.es`.

---

### Pas 2: instal·lar l'script d'ITACA

Amb Tampermonkey ja instal·lat, fes clic ací:

## **[Instal·lar l'script d'ITACA MD2](https://raw.githubusercontent.com/lpla/itaca-md2-importador/main/itaca.user.js)**

S'obrirà una pantalla de Tampermonkey amb l'script carregat.

Prem **Instal·lar**.

---

## Com s'utilitza

1. Entra en [ITACA MD2](https://docent.edu.gva.es/md-front/www/) i obri les **qualificacions** del grup, la matèria i l'avaluació corresponents. Si canvies de grup, matèria o avaluació, recarrega la pàgina i selecciona de nou l'Excel corresponent.
2. Selecciona el fitxer Excel en el panell de l'importador, en el cantó superior esquerre.
3. Revisa el nom del fitxer, el de la primera pestanya i les columnes en la **vista prèvia**. Compara també la llista completa de l'Excel amb l'alumnat que apareix en ITACA. L'script relaciona les files pel nom i pot acceptar coincidències aproximades. Si hi ha homònims o coincidències dubtoses, exclou eixes files de l'Excel i introduïx eixes dades manualment en ITACA.
4. Prem **Importar archivo preparado** quan hages comprovat les dades. Espera que aparega l'informe i revisa les coincidències aproximades, les files omeses i les incidències abans de continuar.
5. Comprova en ITACA les notes i observacions i que l'avaluació s'ha guardat. **Guardado lanzado: sí** indica que l'importador ha premut el botó de guardar d'ITACA.

---

## Quin tipus de fitxer necessites

L'script treballa amb fitxers Excel:

- `.xlsx`
- `.xls`

L'script llig només la **primera pestanya** i reserva la primera fila per a les capçaleres. Comença en la columna A i posa una fila per alumne.

Prepara una columna amb el **nom complet** (preferiblement `Cognoms, Nom`, tal com apareix en ITACA), una amb la **nota numèrica** i, si cal, una amb l'**observació**. Una fila amb la nota buida s'omet encara que continga una observació. Si només vols importar notes, deixa buit el camp **Columna de observaciones** del panell.

L'script intenta detectar estes columnes automàticament, però convé revisar sempre la vista prèvia abans d'importar.

---

## Privacitat i tractament de dades

### Què fa l'script amb les teues dades

El navegador llig l'Excel localment amb la biblioteca SheetJS que descarrega Tampermonkey. En importar, l'script ompli els camps de la pàgina oficial d'ITACA. En guardar l'avaluació, ITACA rep les dades a través de la teua sessió.

### Què guarda en el navegador

L'script pot recordar únicament una configuració molt simple:

- quina columna conté els noms;
- quina columna conté les notes;
- quina columna conté les observacions.

Això es guarda de manera local en el navegador per a no haver d'indicar-ho cada vegada.

### Recomanació important

Encara que el tractament és local en el navegador, estàs treballant amb dades acadèmiques i possiblement amb informació sensible.

Per això convé:

- revisar sempre el fitxer abans d'importar-lo;
- fer la primera prova amb dades fictícies si disposes d'un entorn autoritzat de proves;
- comprovar el resultat final en ITACA abans de donar-lo per bo;
- no compartir captures de pantalla ni fitxers reals quan informes d'un error.

---

## Problemes freqüents

### He premut l'enllaç d'instal·lació i no passa res
Comprova que **Tampermonkey** està actiu en el navegador on has obert l'enllaç. Si veus el codi de l'script en lloc de la pantalla d'instal·lació, revisa els permisos del pas 1 i torna a obrir l'enllaç.

### L'script no apareix en ITACA
Comprova en el tauler de Tampermonkey que l'script està instal·lat i activat. Recarrega ITACA MD2 i obri les **qualificacions** d'un grup i una avaluació concreta. Si veus el panell amb un missatge d'instruccions, l'script està actiu i espera que òbrigues la pantalla de qualificacions.

### Les columnes no són correctes
Revisa-les manualment en el panell abans d'importar. La detecció automàtica ajuda, però no sempre encerta.

### Algun alumne no coincidix bé
Revisa com apareix escrit el nom en l'Excel i com apareix en ITACA. Si hi ha diferències grans, és possible que no trobe correctament la coincidència.

---

## Informar d'un problema

Si alguna cosa no funciona, pots obrir una incidència ací:

## **[Informar d'un problema](https://github.com/lpla/itaca-md2-importador/issues)**

Indica el navegador, la versió de Tampermonkey i la de l'script (visible en el tauler de Tampermonkey). Descriu el pas que falla i, si cal, les capçaleres de l'Excel o els recomptes de l'informe. Si aportes un exemple o una captura, recrea'ls amb dades fictícies. Mantín els fitxers, captures i informes reals dins de l'entorn del centre.

---

## Avís

Este script intenta estalviar temps, però no substituïx la revisió final per part del professorat.

Abans de tancar o donar per acabada una avaluació, convé comprovar que les qualificacions i observacions importades en ITACA són correctes.

---

## Llicència

Este repositori es distribuïx amb llicència **MIT**.

---

# Castellano

# Importador de calificaciones para ITACA MD2

Este repositorio contiene un único script para facilitar la importación de **notas** y **observaciones** en **ITACA MD2** desde un archivo Excel.

Está pensado para profesorado que quiere ahorrar tiempo al pasar datos a ITACA sin tener que escribirlos uno a uno.

> [!IMPORTANT]
> **Importar archivo preparado** puede sustituir notas y observaciones existentes e intenta guardar la evaluación automáticamente. La vista previa muestra las primeras filas del Excel. Las coincidencias con el alumnado se calculan al importar.

---

## Instalación

La instalación se hace en **dos pasos**.

### Paso 1: instalar Tampermonkey

**Tampermonkey** es una extensión del navegador necesaria para poder instalar este script.

Elige tu navegador y pulsa en el enlace correspondiente:

- **Google Chrome:** [Instalar Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Microsoft Edge:** [Instalar Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd)
- **Mozilla Firefox:** [Instalar Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Opera:** [Instalar Tampermonkey](https://addons.opera.com/en/extensions/details/tampermonkey-beta/)
- **Safari (Mac):** [Instalar Tampermonkey](https://apps.apple.com/es/app/tampermonkey/id6738342400)  
  Si usas una versión anterior de Safari o macOS, puede que necesites esta otra versión: [Tampermonkey Classic](https://apps.apple.com/es/app/tampermonkey-classic/id1482490089?mt=12)

Cuando se abra la tienda de extensiones de tu navegador, pulsa **Instalar**, **Añadir** o **Obtener**, según el caso.

En **Chrome y Edge**, abre **Gestionar extensión** de Tampermonkey y activa **Permitir secuencias de comandos de usuario** o **Permitir Userscripts** si aparece. Si tu navegador muestra otra opción, consulta la [guía de permisos de Tampermonkey](https://www.tampermonkey.net/faq.php?locale=es&q=Q209). Si el centro gestiona el navegador y la opción está bloqueada, consulta a la persona responsable de informática.

En **Safari**, activa Tampermonkey en **Safari → Ajustes → Extensiones** y permite que la extensión funcione en `docent.edu.gva.es`.

---

### Paso 2: instalar el script de ITACA

Con Tampermonkey ya instalado, pulsa aquí:

## **[Instalar el script de ITACA MD2](https://raw.githubusercontent.com/lpla/itaca-md2-importador/main/itaca.user.js)**

Se abrirá una pantalla de Tampermonkey con el script cargado.

Pulsa **Instalar**.

---

## Cómo usarlo

1. Entra en [ITACA MD2](https://docent.edu.gva.es/md-front/www/) y abre las **calificaciones** del grupo, la materia y la evaluación correspondientes. Si cambias de grupo, materia o evaluación, recarga la página y selecciona de nuevo el Excel correspondiente.
2. Selecciona el archivo Excel en el panel del importador, en la esquina superior izquierda.
3. Revisa el nombre del archivo, el de la primera pestaña y las columnas en la **vista previa**. Compara también la lista completa del Excel con el alumnado que aparece en ITACA. El script empareja las filas por nombre y puede aceptar coincidencias aproximadas. Si hay homónimos o coincidencias dudosas, excluye esas filas del Excel e introduce esos datos a mano en ITACA.
4. Pulsa **Importar archivo preparado** cuando hayas comprobado los datos. Espera a que aparezca el informe y revisa las coincidencias aproximadas, las filas omitidas y las incidencias antes de continuar.
5. Comprueba en ITACA las notas y observaciones y que la evaluación se ha guardado. **Guardado lanzado: sí** indica que el importador ha pulsado el botón de guardar de ITACA.

---

## Qué tipo de archivo necesitas

El script trabaja con archivos Excel:

- `.xlsx`
- `.xls`

El script lee solo la **primera pestaña** y reserva la primera fila para las cabeceras. Empieza en la columna A y pon una fila por alumno.

Prepara una columna con el **nombre completo** (preferiblemente `Apellidos, Nombre`, tal como aparece en ITACA), otra con la **nota numérica** y, si procede, otra con la **observación**. Una fila con la nota vacía se omite aunque contenga una observación. Si solo quieres importar notas, deja vacío el campo **Columna de observaciones** del panel.

El script intenta detectar esas columnas automáticamente, pero conviene revisar siempre la vista previa antes de importar.

---

## Privacidad y tratamiento de datos

### Qué hace el script con tus datos

El navegador lee el Excel localmente con la biblioteca SheetJS que descarga Tampermonkey. Al importar, el script rellena los campos de la página oficial de ITACA. Al guardar la evaluación, ITACA recibe los datos a través de tu sesión.

### Qué guarda en tu navegador

El script puede recordar únicamente una configuración muy simple:

- qué columna contiene los nombres;
- qué columna contiene las notas;
- qué columna contiene las observaciones.

Eso se guarda de forma local en el navegador para no tener que indicarlo cada vez.

### Recomendación importante

Aunque el tratamiento es local en el navegador, estás trabajando con datos académicos y posiblemente con información sensible.

Por eso conviene:

- revisar siempre el archivo antes de importarlo;
- hacer la primera prueba con datos ficticios si dispones de un entorno de pruebas autorizado;
- comprobar el resultado final en ITACA antes de darlo por bueno;
- no compartir capturas de pantalla o archivos reales al reportar errores.

---

## Problemas frecuentes

### He pulsado el enlace de instalación y no pasa nada
Comprueba que **Tampermonkey** está activo en el navegador donde has abierto el enlace. Si ves el código del script en lugar de la pantalla de instalación, revisa los permisos del paso 1 y vuelve a abrir el enlace.

### El script no aparece en ITACA
Comprueba en el panel de Tampermonkey que el script está instalado y activado. Recarga ITACA MD2 y abre las **calificaciones** de un grupo y una evaluación concreta. Si ves el panel con un mensaje de instrucciones, el script está activo y espera a que abras la pantalla de calificaciones.

### Las columnas no son correctas
Revísalas manualmente en el panel antes de importar. La detección automática ayuda, pero no siempre acierta.

### Algún alumno no coincide bien
Revisa cómo aparece escrito el nombre en el Excel y cómo aparece en ITACA. Si hay diferencias grandes, puede no encontrar la coincidencia correctamente.

---

## Reportar un problema

Si algo no funciona, puedes abrir una incidencia aquí:

## **[Reportar un problema](https://github.com/lpla/itaca-md2-importador/issues)**

Indica el navegador, la versión de Tampermonkey y la del script (visible en el panel de Tampermonkey). Describe el paso que falla y, si hace falta, las cabeceras del Excel o los recuentos del informe. Si aportas un ejemplo o una captura, recréalos con datos ficticios. Mantén los archivos, capturas e informes reales dentro del entorno del centro.

---

## Aviso

Este script intenta ahorrar tiempo, pero no sustituye la revisión final por parte del profesor.

Antes de cerrar o dar por terminada una evaluación, conviene comprobar que las calificaciones y observaciones importadas en ITACA son correctas.

---

## Licencia

Este repositorio se distribuye bajo licencia **MIT**.
