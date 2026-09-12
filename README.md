```text
██████╗ ██╗███╗   ██╗ ██████╗       ██████╗  ██████╗ ███╗   ██╗ ██████╗
██╔══██╗██║████╗  ██║██╔════╝       ██╔══██╗██╔═══██╗████╗  ██║██╔════╝
██████╔╝██║██╔██╗ ██║██║  ███╗█████╗██████╔╝██║   ██║██╔██╗ ██║██║  ███╗
██╔═══╝ ██║██║╚██╗██║██║   ██║╚════╝██╔═══╝ ██║   ██║██║╚██╗██║██║   ██║
██║     ██║██║ ╚████║╚██████╔╝      ██║     ╚██████╔╝██║ ╚████║╚██████╔╝
╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝       ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝
```

# 🟢 Ping Pong

Un pequeño **API connection checker** con estética Neo Matrix. Sirve para probar APIs con un botón, ver si responden y medir su tiempo de respuesta.

## Qué hace

- Ejecuta un `GET` contra el endpoint configurado.
- Informa si recibió `pong`, una respuesta inesperada o ningún response.
- Muestra latencia, código HTTP, hora del último check y estadísticas de sesión.
- Guarda las últimas 20 comprobaciones en memoria del navegador.
- Incluye un efecto Matrix al lanzar cada ping.

Actualmente apunta por defecto a:

```text
https://pong.leosecotaro.com.ar/api/ping
```

## Stack

- React
- Vite
- CSS vanilla
- Google Fonts: Space Grotesk + DM Mono

No hay backend en este repo: es una aplicación estática que llama APIs públicas desde el navegador.

## Correr localmente

```bash
npm install
npm run dev
```

Abrí la URL que indique Vite, normalmente:

```text
http://localhost:5173
```

Para validar el build de producción:

```bash
npm run build
npm run preview
```

## Configurar otra API

El endpoint se puede reemplazar sin modificar el código usando:

```bash
VITE_API_URL=https://example.com/api/ping npm run dev
```

En Render, agregá `VITE_API_URL` como variable de entorno durante el build.

## Deploy en Render

Este proyecto debe desplegarse como **Static Site**, no como Web Service.

1. En Render elegí **New → Static Site**.
2. Conectá el repositorio `lsecotaro/ping-pong`.
3. Configurá:

   ```text
   Branch: main
   Build Command: npm ci && npm run build
   Publish Directory: dist
   ```

4. Agregá la variable de entorno:

   ```text
   VITE_API_URL=https://pong.leosecotaro.com.ar/api/ping
   ```

5. Creá el Static Site.

Render va a hacer deploy automático cada vez que se publique un cambio en `main`. Los Static Sites se sirven desde CDN y no necesitan un proceso Node corriendo. [Guía oficial de Render](https://render.com/docs/your-first-deploy)

## CORS

Como el frontend llama al backend desde el navegador, el backend debe permitir el dominio generado por Render. En `pong-api`, configurá en Neo Server:

```bash
-e CORS_ORIGINS=https://tu-app.onrender.com
```

Si agregás un dominio propio para el frontend, reemplazá ese valor por el dominio final.

## Próximas mejoras

- Selector de endpoints.
- Historial persistente.
- Exportación de métricas.
- Checks periódicos.
- Headers y autenticación configurables.
