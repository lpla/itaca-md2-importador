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

## **[Instalar el script de ITACA MD2](https://raw.githubusercontent.com/lpla/userscripts/main/itaca.user.js)**

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

## **[Reportar un problema](https://github.com/lpla/userscripts/issues)**

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
