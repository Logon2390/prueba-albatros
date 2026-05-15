# prueba-albatros

Prueba tecnica para Albatros Services. Aplicacion web para publicacion y manejo de posts y comentarios usando NestJS, AngularJS y MongoDB.

## Requisitos

- Docker y Docker Compose

## Setup (con Docker)

1. Crear el archivo `.env` para el backend en la carpeta del API.
2. Usar este ejemplo y ajustar los valores si es necesario:

```env
FRONTEND_URL=http://localhost:8080
PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_keys
DATABASE_URL=mongodb://mongo:27017/prueba-albatros
```

3. Levantar los servicios desde el root del proyecto:

```bash
docker-compose up --build
```

Esto levanta 3 servicios:

1. MongoDB
2. API NestJS
3. Nginx para el frontend

## Setup (sin Docker)

Requisitos:

- Node.js y npm
- MongoDB local (o una URL remota)

1. Backend

```bash
cd backend
npm install
```

Crear `.env` en `backend` (ejemplo):

```env
FRONTEND_URL=http://localhost:8080
PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_keys
DATABASE_URL=mongodb://localhost:27017/prueba-albatros
```

Levantar API en modo desarrollo:

```bash
npm run start:dev
```

2. Frontend

```bash
cd frontend
npm install
npm start
```

## URLs

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:8080`

## Autenticacion (JWT)

El API usa JWT para acceder a los endpoints de `POST` y `COMMENTS`.

Endpoint:

`POST /auth/login`

Body:

```json
{
  "name": "Test",
  "email": "test@example.com"
}
```

Respuesta:

- `accessToken`: usarlo como header `Authorization: Bearer <token>`
- `refreshToken`: usado por el cliente para refrescar el `accessToken`

El `accessToken` expira en 10 minutos por defecto.

## Testing en Postman

En la carpeta `./postman` hay una coleccion con los endpoints de la API (Post, Comment y Auth).

Pasos:

1. Consumir `POST /auth/login` para obtener el `accessToken`.
2. Copiar el valor de `accessToken`.
3. En Postman, abrir la tab **Authorization**, configurar **Type** como **Bearer Token** y pegar el token.

Luego todos los endpoints deberian responder correctamente.

## Carga masiva de posts

Endpoint:

`POST http://localhost:3000/posts/bulk`

En `./postman/Post-example.json` hay un ejemplo con 15 posts listo para copiar y pegar.
