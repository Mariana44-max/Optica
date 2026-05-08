# Proyecto Final - Optica

Aplicacion full-stack para una optica con arquitectura de microservicios, JWT, roles, dos bases de datos distintas y despliegue en la nube.

## Arquitectura

```
+-----------+      +------------------+      +--------------+
|  React    | ---> |  auth-service    | ---> |  MySQL       |
|  (Vite)   |      |  (Node + Express)|      |  optica_auth |
|           |      +------------------+      +--------------+
|           |
|           |      +------------------+      +-------------------+
|           | ---> |  product-service | ---> |  PostgreSQL       |
|           |      |  (Node + Express)|      |  optica_products  |
+-----------+      +------------------+      +-------------------+
```

- **auth-service**: registro, login, JWT, roles ADMIN/USER. BD: MySQL.
- **product-service**: CRUD de productos opticos y consulta por categoria. BD: PostgreSQL.
- **frontend**: React + Vite con vistas distintas para ADMIN y USER.

## Tecnologias

| Capa | Tech |
|---|---|
| Backend | Node.js 20, Express, Sequelize, JWT, bcryptjs |
| BD 1 | MySQL 8 |
| BD 2 | PostgreSQL 16 |
| Frontend | React 18, Vite, React Router, Axios |
| Contenedores | Docker, docker-compose, Nginx |

---

## PASO 11 - Comandos para ejecutar el proyecto localmente

### Opcion A (recomendada): Todo con Docker

Requisito: tener instalado **Docker Desktop**.

```bash
docker compose up --build
```

Esto levanta:
- MySQL en `localhost:3306`
- PostgreSQL en `localhost:5432`
- auth-service en `http://localhost:4001`
- product-service en `http://localhost:4002`
- frontend en `http://localhost:5173`

Para detener:
```bash
docker compose down
```

Para borrar tambien las bases de datos:
```bash
docker compose down -v
```

### Opcion B: Sin Docker (modo desarrollo)

1. Tener MySQL y PostgreSQL corriendo localmente y crear las BDs:
   - `optica_auth` (MySQL)
   - `optica_products` (PostgreSQL)
2. Copiar los `.env.example` a `.env` en cada servicio y ajustar credenciales.
3. Levantar cada parte:

```bash
# auth-service
cd backend/auth-service
npm install
npm run dev

# product-service (en otra terminal)
cd backend/product-service
npm install
npm run dev

# frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

### Probar manualmente la API

```bash
# Registrar admin
curl -X POST http://localhost:4001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@optica.com","password":"123456","role":"ADMIN"}'

# Login
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@optica.com","password":"123456"}'

# Listar productos (con el token devuelto)
curl http://localhost:4002/api/products -H "Authorization: Bearer <TOKEN>"
```

---

## PASO 12 - Subir a GitHub

```bash
cd Optica
git init
git add .
git commit -m "Proyecto final - Optica con microservicios, JWT y Docker"
git branch -M main
git remote add origin https://github.com/<TU_USUARIO>/optica.git
git push -u origin main
```

> Verifica que `.env` NO se suba (esta en `.gitignore`). Solo se sube `.env.example`.

---

## PASO 13 - Desplegar en la nube

### Opcion recomendada: Render (gratis y sencillo)

**1. Crear las bases de datos en Render**
- En el dashboard de Render, crea un servicio **PostgreSQL** (gratis). Anota el `Internal Database URL` y los datos: host, user, password, dbname, port.
- Para **MySQL** Render no ofrece gratis: usa **Railway**, **Aiven** o **Clever Cloud** (todos tienen plan gratuito). Crea una BD MySQL y anota las credenciales.

**2. Desplegar `auth-service`**
- En Render: New > Web Service > conecta tu repo de GitHub.
- Root Directory: `backend/auth-service`
- Build Command: `npm install`
- Start Command: `node src/server.js`
- Environment Variables:
  - `PORT=4001`
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (de tu MySQL en la nube)
  - `JWT_SECRET=<una clave larga y aleatoria>`
  - `JWT_EXPIRES_IN=2h`
- Deploy. Anota la URL publica, ej: `https://optica-auth.onrender.com`.

**3. Desplegar `product-service`**
- New > Web Service > mismo repo.
- Root Directory: `backend/product-service`
- Build Command: `npm install`
- Start Command: `node src/server.js`
- Environment Variables: las del PostgreSQL de Render + el **mismo** `JWT_SECRET` que en auth.
- Deploy. Anota la URL: `https://optica-products.onrender.com`.

**4. Desplegar el frontend**

Recomendado **Vercel** o **Netlify** para frontend (mas rapido):

En Vercel:
- Importa el repo, raiz del proyecto = `frontend`.
- Framework: Vite. Build command: `npm run build`. Output: `dist`.
- Variables de entorno:
  - `VITE_AUTH_URL=https://optica-auth.onrender.com`
  - `VITE_PRODUCT_URL=https://optica-products.onrender.com`
- Deploy. URL: `https://optica.vercel.app`.

> El frontend desplegado consume las URLs publicas del backend, NO localhost.

**Importante (CORS):** ya esta habilitado con `cors()` en ambos servicios, asi que el frontend desplegado podra consumir el backend desplegado sin problema.

### Alternativa todo en Railway

Railway permite levantar MySQL, PostgreSQL y dos servicios Node + frontend en el mismo proyecto. El `docker-compose.yml` sirve como referencia: cada servicio se crea con "Deploy from Repo" indicando el subfolder y las variables de entorno equivalentes.

---

## PASO 14 - Que subir a Moodle

Sube en la entrega un **PDF** o documento de texto con:

1. **Nombre del estudiante** y curso.
2. **URL del repositorio en GitHub** (publico).
3. **URL publica del backend** (las dos):
   - auth-service: `https://...`
   - product-service: `https://...`
4. **URL publica del frontend**: `https://...`
5. **Credenciales de prueba** que ya creaste:
   - Admin: `admin@optica.com` / `123456`
   - User: `user@optica.com` / `123456`
6. **Capturas de pantalla** (opcional pero recomendado):
   - Login funcionando.
   - Vista de admin creando un producto.
   - Vista de user filtrando por categoria.
   - Postman/Thunder Client probando un endpoint con JWT.
7. **Diagrama de arquitectura** (puedes copiar el ASCII de arriba o hacerlo en draw.io).

---

## PASO 15 - Como explicar el proyecto el dia de la sustentacion

Sigue este guion (10 a 15 min):

1. **Contexto (1 min):** "Es una aplicacion para una optica que permite gestionar productos. Hay dos roles: el administrador hace CRUD y el usuario solo consulta y filtra por categoria."
2. **Arquitectura (2 min):** "Esta dividida en dos microservicios independientes: uno se encarga de la autenticacion con MySQL y JWT, y el otro de la gestion de productos con PostgreSQL. Los dos microservicios y el frontend corren en contenedores Docker, y se levantan con `docker compose up`. En la nube cada uno tiene su propio servicio."
3. **Capas (2 min):** "Cada microservicio sigue arquitectura en capas: las rutas reciben la peticion, los **controllers** la validan, los **services** ejecutan la logica de negocio, los **repositories** hablan con la base de datos a traves de Sequelize, y los **DTOs** serializan la respuesta para no exponer datos sensibles como el hash de la contrasena."
4. **Seguridad (2 min):** "El login genera un JWT firmado con un secreto compartido entre los dos servicios. Los dos microservicios tienen un middleware `authenticate` que valida el token, y un middleware `authorize('ADMIN')` que protege las rutas que solo pueden ejecutar administradores. Las contrasenas se guardan con bcrypt, nunca en claro."
5. **Demo en vivo (5 min):**
   - Abro el frontend desplegado.
   - Me registro como ADMIN, hago login, creo un producto, lo edito y lo elimino.
   - Cierro sesion, entro como USER, veo el catalogo y filtro por categoria.
   - Muestro en Postman que sin token devuelve 401 y con token de USER intentando crear producto devuelve 403 (rol insuficiente).
6. **Docker (1 min):** "Cada servicio tiene su propio Dockerfile y todo se orquesta con docker-compose: dos bases de datos, dos microservicios y el frontend con Nginx sirviendo el build de Vite."
7. **Despliegue (1 min):** "El backend esta desplegado en Render (auth y products como servicios separados), el frontend en Vercel. El frontend consume las URLs publicas del backend mediante variables de entorno, no localhost."
8. **Cierre:** "Cumple los 5 puntos: backend con microservicios, dos BDs distintas, JWT con roles, frontend desplegado y consumiendo el backend en la nube, y todo dockerizado."

### Posibles preguntas del profesor

- **Por que microservicios?** Permiten escalar cada parte independiente, usar BDs distintas (MySQL para identidad relacional simple, PostgreSQL para productos con tipos y consultas mas ricas) y desplegarlos por separado.
- **Por que JWT y no sesiones?** Es stateless, perfecto para arquitecturas de microservicios donde varios servicios deben validar el mismo token sin compartir sesion.
- **Que pasa si el token expira?** El usuario debe loguearse de nuevo. Se podria implementar refresh token como mejora.
- **Como protegen las rutas de ADMIN?** Con dos middlewares en cadena: `authenticate` valida el JWT y rellena `req.user`; `authorize('ADMIN')` revisa que `req.user.role === 'ADMIN'`.
- **Como se comunican los microservicios?** En este proyecto no necesitan llamarse entre si: comparten el `JWT_SECRET` para validar el mismo token de forma independiente, lo cual es un patron comun (token-based auth descentralizada).

---

## Resumen de calificacion (5.0)

| Item | Puntos | Donde se ve |
|---|---|---|
| Backend con microservicios, JWT, roles, 2 BDs, Docker | 3.0 | `backend/auth-service`, `backend/product-service`, `docker-compose.yml` |
| Frontend integrado y desplegado | 2.0 | `frontend/`, URL publica + consumo del backend en la nube |

Listo para entregar.
