# Importador de qualificacions per a ITACA MD2

Este repositori conté un únic script per a facilitar la importació de **notes** i **observacions** en **ITACA MD2** des d'un fitxer Excel.

Està pensat per a professorat que vol estalviar temps en passar dades a ITACA sense haver d'escriure-les una a una.

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

---

### Pas 2: instal·lar l'script d'ITACA

Amb Tampermonkey ja instal·lat, fes clic ací:

## **[Instal·lar l'script d'ITACA MD2](https://raw.githubusercontent.com/lpla/itaca-md2-importador/main/itaca.user.js)**

S'obrirà una pantalla de Tampermonkey amb l'script carregat.

Prem **Instal·lar**.

---

## Com s'utilitza

1. Entra en **ITACA MD2**.
2. Ves a la pantalla de **qualificacions** del grup i de l'avaluació en què vols treballar.
3. Veuràs un xicotet panell de l'importador en el cantó superior esquerre.
4. Selecciona el fitxer Excel.
5. Revisa la **vista prèvia**.
6. Comprova que les columnes de:
   - noms,
   - notes,
   - observacions  
   són correctes.
7. Prem **Importar archivo preparado**.

---

## Quin tipus de fitxer necessites

L'script treballa amb fitxers Excel:

- `.xlsx`
- `.xls`

El més habitual és que el fitxer tinga una primera fila amb capçaleres i, després, una fila per alumne.

Exemple senzill:

- una columna amb el **nom de l'alumne**;
- una columna amb la **nota**;
- una columna amb l'**observació**.

L'script intenta detectar estes columnes automàticament, però convé revisar sempre la vista prèvia abans d'importar.

---

## Privacitat i tractament de dades

Este punt és especialment important perquè les dades no ixen del teu dispositiu i només s'escriuen en la web d'ITACA que tens oberta. Res més.

### Què fa l'script amb les teues dades

- El fitxer Excel es **llig en el teu propi navegador**, en el teu propi ordinador.
- L'script **no puja el fitxer Excel a servidors externs aliens a ITACA**.
- L'script treballa sobre la pàgina oficial d'**ITACA** que ja tens oberta en el navegador.
- Quan importes, les dades s'escriuen únicament en **ITACA**, perquè precisament esta és la finalitat de l'eina.
- L'script **no necessita enviar les dades a servicis de tercers** per a funcionar, ni per a obtindre estadístiques ni per a cap altra finalitat semblant.

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
- fer primer una prova amb un grup reduït o amb dades de prova;
- comprovar el resultat final en ITACA abans de donar-lo per bo;
- no compartir captures de pantalla ni fitxers reals quan informes d'un error.

---

## Problemes freqüents

### He premut l'enllaç d'instal·lació i no passa res
Assegura't d'haver instal·lat abans **Tampermonkey** en el navegador.

### L'script no apareix en ITACA
Comprova que estàs en la pantalla de **qualificacions** d'un grup i una avaluació concreta.

### Les columnes no són correctes
Revisa-les manualment en el panell abans d'importar. La detecció automàtica ajuda, però no sempre encerta.

### Algun alumne no coincidix bé
Revisa com apareix escrit el nom en l'Excel i com apareix en ITACA. Si hi ha diferències grans, és possible que no trobe correctament la coincidència.

---

## Informar d'un problema

Si alguna cosa no funciona, pots obrir una incidència ací:

## **[Informar d'un problema](https://github.com/lpla/itaca-md2-importador/issues)**

Perquè siga més fàcil ajudar-te, intenta indicar:

- quin navegador utilitzes;
- si tens Tampermonkey instal·lat;
- què estaves intentant fer;
- quin missatge ha aparegut;
- una captura de pantalla, si pots;
- i, si el problema està en l'Excel, descriu l'estructura del fitxer **sense incloure dades personals reals**.

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

---

### Paso 2: instalar el script de ITACA

Con Tampermonkey ya instalado, pulsa aquí:

## **[Instalar el script de ITACA MD2](https://raw.githubusercontent.com/lpla/itaca-md2-importador/main/itaca.user.js)**

Se abrirá una pantalla de Tampermonkey con el script cargado.

Pulsa **Instalar**.

---

## Cómo usarlo

1. Entra en **ITACA MD2**.
2. Ve a la pantalla de **calificaciones** del grupo y de la evaluación en la que quieres trabajar.
3. Verás un pequeño panel del importador en la esquina superior izquierda.
4. Selecciona tu archivo Excel.
5. Revisa la **vista previa**.
6. Comprueba que las columnas de:
   - nombres,
   - notas,
   - observaciones  
   son correctas.
7. Pulsa **Importar archivo preparado**.

---

## Qué tipo de archivo necesitas

El script trabaja con archivos Excel:

- `.xlsx`
- `.xls`

Lo normal es que el archivo tenga una primera fila con cabeceras y, después, una fila por alumno.

Ejemplo sencillo:

- una columna con el **nombre del alumno**
- una columna con la **nota**
- una columna con la **observación**

El script intenta detectar esas columnas automáticamente, pero conviene revisar siempre la vista previa antes de importar.

---

## Privacidad y tratamiento de datos

Este punto es especialmente importante porque los datos no salen de tu dispositivo, y sólo se escriben en la web de ITACA que tienes abierta. Nada más.

### Qué hace el script con tus datos

- El archivo Excel se **lee en tu propio navegador**, en tu propio ordenador.
- El script **no sube el archivo Excel a servidores externos ajenos a ITACA**.
- El script trabaja sobre la página oficial de **ITACA** que tú ya tienes abierta en el navegador.
- Cuando importas, los datos se escriben únicamente en **ITACA**, porque precisamente esa es la finalidad de la herramienta.
- El script **no necesita enviar los datos a servicios de terceros** para funcionar, ni para obtener estadísticas ni nada por el estilo.

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
- hacer una prueba primero con un grupo pequeño o con datos de prueba;
- comprobar el resultado final en ITACA antes de darlo por bueno;
- no compartir capturas de pantalla o archivos reales al reportar errores.

---

## Problemas frecuentes

### He pulsado el enlace de instalación y no pasa nada
Asegúrate de haber instalado antes **Tampermonkey** en el navegador.

### El script no aparece en ITACA
Comprueba que estás en la pantalla de **calificaciones** de un grupo y una evaluación concreta.

### Las columnas no son correctas
Revísalas manualmente en el panel antes de importar. La detección automática ayuda, pero no siempre acierta.

### Algún alumno no coincide bien
Revisa cómo aparece escrito el nombre en el Excel y cómo aparece en ITACA. Si hay diferencias grandes, puede no encontrar la coincidencia correctamente.

---

## Reportar un problema

Si algo no funciona, puedes abrir una incidencia aquí:

## **[Reportar un problema](https://github.com/lpla/itaca-md2-importador/issues)**

Para que sea más fácil ayudarte, intenta indicar:

- qué navegador usas;
- si tienes Tampermonkey instalado;
- qué estabas intentando hacer;
- qué mensaje apareció;
- una captura de pantalla, si puedes;
- y, si el problema está en el Excel, describe la estructura del archivo **sin incluir datos personales reales**.

---

## Aviso

Este script intenta ahorrar tiempo, pero no sustituye la revisión final por parte del profesor.

Antes de cerrar o dar por terminada una evaluación, conviene comprobar que las calificaciones y observaciones importadas en ITACA son correctas.

---

## Licencia

Este repositorio se distribuye bajo licencia **MIT**.