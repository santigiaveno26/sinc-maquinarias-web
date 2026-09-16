# Cómo editar los textos de la página vos mismo

Todos los textos de la web (títulos, descripciones, beneficios, casos de
aplicación, etc.) están en un solo archivo: **`assets/content.json`**.

No hace falta instalar nada ni saber programar — se edita directamente
desde la web de GitHub.

## Pasos

1. Entrá a [github.com/santigiaveno26/sinc-maquinarias-web](https://github.com/santigiaveno26/sinc-maquinarias-web)
2. Abrí la carpeta `assets` y después el archivo `content.json`
3. Arriba a la derecha del archivo, hacé clic en el ícono del **lápiz** ("Edit this file")
4. Vas a ver algo así:

   ```json
   "hero": {
     "eyebrow": "Industria argentina · Las Parejas, Santa Fe",
     "titulo_1": "Maquinaria que transforma",
     "titulo_2": "residuo en resultado",
     "lead": "Diseñamos y fabricamos máquinas robustas para la gestión...",
   ```

   Cada línea es **"nombre del texto": "el texto que se ve en la página"**.
   Editá únicamente lo que está **entre comillas después de los dos puntos**
   (la parte en negrita en el ejemplo). No toques los nombres de la
   izquierda (`eyebrow`, `titulo_1`, etc.) ni las comas al final de línea.

5. Cuando termines, bajá hasta el final de la página y hacé clic en el
   botón verde **"Commit changes..."** y confirmá.
6. Esperá 1-2 minutos y volvé a cargar la página — el cambio ya va a estar
   publicado.

## Reglas para no romper nada

- Nunca borres las comillas `"` que rodean un texto.
- Si el texto termina en un `,` (coma) dejala — separa un texto del
  siguiente.
- Si tu texto necesita llevar comillas dentro (poco común), escribilas
  así: `\"` en vez de `"`.
- Podés editar un texto a la vez o varios juntos, no hay problema.

## Si algo sale mal

Tranquilo: si el archivo queda mal escrito (por ejemplo, te olvidaste una
coma o una comilla), **la página no se rompe** — simplemente va a seguir
mostrando el texto que tenía antes de tu edición, hasta que se corrija el
archivo. Avisame y lo arreglo en un momento.

## Qué NO está en este archivo (y por qué)

Los números de WhatsApp, el email, Instagram, la dirección, las fotos, los
videos, los colores y el orden de las secciones **no** están en
`content.json` porque tocarlos sin querer sí puede romper un link o el
diseño. Esos cambios seguí pidiéndomelos a mí.
