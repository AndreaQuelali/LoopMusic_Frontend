# LoopMusic Frontend — Guía de instalación y uso

## Requisitos

- Node.js 18+
- NPM 9+
- Backend corriendo (por defecto en `http://localhost:3000`).

## Variables de entorno

Define la URL del backend con `REACT_APP_API_URL`.

```bash
cp .env.example .env
```

Edita `.env`:

```env
REACT_APP_API_URL=http://localhost:3000
```

Si el backend usa otro host/puerto, ajusta ese valor. El cliente HTTP está en `src/lib/api.ts` y utiliza esta variable para construir las URLs.

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
# Por defecto CRA usa el puerto 3000 (puede chocar con el backend)
PORT=3001 npm start
```

Abre http://localhost:3001 en tu navegador. La app recargará ante cambios.

## Flujos soportados

- Autenticación
  - Registro: formulario en `/register` que llama `POST {API}/auth/register`.
  - Login: formulario en `/login` que llama `POST {API}/auth/login`.
  - El token se guarda en `localStorage` y se envía en el header `Authorization: Bearer ...` desde `src/lib/api.ts`.

- Home (página principal)
  - Protegida: requiere estar autenticado.
  - Lista canciones llamando `GET {API}/songs`.

## Estructura relevante

- `src/lib/api.ts` — Cliente fetch con `REACT_APP_API_URL` y token.
- `src/features/auth/` — Vistas y API de registro/login.
- `src/features/home/pages/Home.tsx` — Página principal que consume `/songs`.
- `src/features/songs/api.ts` — Tipos y llamada a `GET /songs`.
- `src/App.tsx` — Rutas y protección básica.

## Comandos útiles

- `npm start` — Inicia en modo desarrollo (usa `PORT=3001` si el 3000 está ocupado).
- `npm run build` — Build de producción en `build/`.
- `npm test` — Ejecuta tests (si existiesen).

## Integración con el Backend

- Backend por defecto: `http://localhost:3000`.
- Recomendado ejecutar el frontend en `http://localhost:3001` para evitar conflicto de puertos con el backend.
- Repositorio: `https://github.com/AndreaQuelali/LoopMusic_Backend`

---


