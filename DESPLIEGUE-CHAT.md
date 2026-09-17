# Conectar el asistente de chat a la landing

La landing ya tiene el widget de chat listo (botón flotante abajo a la
derecha, y los botones "Hablar con el asistente" / "Preguntarle al
asistente..."). Hoy, si lo abrís, muestra un mensaje de "en preparación" —
eso es porque el bot (la carpeta `ChatBotEquilimpiaWpp`) todavía corre solo
en tu computadora, no en un servidor público. Mientras sea así, **ningún
visitante de la web puede hablarle**, aunque vos lo veas andar perfecto en
tu propia máquina.

Para que funcione de verdad hacen falta dos cosas, en este orden:

## 1. Publicar el bot en un servidor real (una sola vez)

El propio proyecto del bot ya trae todo preparado para esto — ver
`PRODUCCION.md` en la carpeta `ChatBotEquilimpiaWpp`, sección "HTTPS /
reverse proxy". En resumen:

1. Conseguir un servidor (VPS). La opción recomendada ahí mismo es **Oracle
   Cloud Free Tier** (gratis de por vida, alcanza de sobra para este bot).
2. Comprar un dominio (o subdominio) y apuntarlo por DNS a la IP del
   servidor — por ejemplo `asistente.sincmaquinarias.com.ar`.
3. En el servidor: clonar el repo del bot, completar el `.env` (las mismas
   claves que usás en tu compu) y correr `docker compose up -d --build`
   (ver `docker-compose.yml` y `docker-compose.proxy.yml`).
4. Con el dominio apuntando y `BOT_DOMAIN` configurado, Caddy (ya incluido)
   consigue el certificado HTTPS solo — no hay que hacer nada manual ahí.
5. Confirmar que anda entrando a `https://asistente.tu-dominio.com/chat`
   desde el celular (con datos móviles, no en la wifi del servidor) — si
   carga el chat, ya está online para cualquiera.

Este paso requiere crear vos la cuenta del VPS (tarjeta para validar
identidad, aunque el free tier no cobra) y elegir/comprar el dominio —
son decisiones y datos de pago que me corresponde pedirte a vos, no
puedo hacerlos por vos.

## 2. Conectar la landing a esa dirección

Una vez que el bot esté online en su propio dominio, son dos cambios
chicos:

**A) En el bot** (`ChatBotEquilimpiaWpp`, ya preparado en el código, falta
que lo actives): agregar en el `.env` del servidor el dominio real de la
landing, para que el navegador del visitante pueda llamarlo (si no, el
chat se queda "pensando" sin responder, por CORS):

```
CHAT_WIDGET_ORIGENES_PERMITIDOS=https://santigiaveno26.github.io
```

(o el dominio propio de la landing si en ese momento ya se compró uno, en
vez de `.github.io`).

**B) En la landing** (este repo): abrir `assets/content.json`, buscar el
bloque `"chat"` al final, y completar `bot_url` con la dirección del bot
(sin `/` al final):

```json
"bot_url": "https://asistente.sincmaquinarias.com.ar",
```

Guardar, "Commit changes" en GitHub (igual que cualquier otro texto — ver
`COMO-EDITAR-TEXTOS.md`), esperar un minuto y listo: el botón de chat ya
abre el asistente de verdad para cualquiera que entre a la página.

## Si en el medio querés probarlo vos sin publicar nada todavía

Se puede probar en tu propia compu (nadie más lo va a poder usar, pero
sirve para verlo funcionar):

1. Iniciar el bot local como siempre (`iniciar_bot.bat`, o
   `uvicorn main:app --port 8000` en `ChatBotEquilimpiaWpp/app`).
2. En `assets/content.json`, poner `"bot_url": "http://localhost:8000"`.
3. Abrir la landing en tu compu (por ejemplo con
   `python3 -m http.server 8080` en esta carpeta) y probar el botón de
   chat — debería abrir tu bot local dentro del panel.
4. Importante: dejar `bot_url` en `""` (vacío) otra vez antes de subir el
   cambio a GitHub — si no, cuando lo suban, otros visitantes van a
   intentar hablarle a tu `localhost`, que no existe para ellos, y el chat
   va a quedar roto para todo el mundo (no solo mostrando el aviso de
   "en preparación").
