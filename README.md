# Proyecto Final - Optica

Aplicacion full-stack para una optica con arquitectura de microservicios en **Spring Boot**, JWT, roles, dos bases de datos distintas (MySQL + PostgreSQL) y despliegue en la nube.

## Arquitectura

```
+-----------+      +---------------------+      +--------------+
|  React    | ---> |  auth-service       | ---> |  MySQL       |
|  (Vite)   |      |  (Spring Boot 3)    |      |  optica_auth |
|           |      +---------------------+      +--------------+
|           |
|           |      +---------------------+      +-------------------+
|           | ---> |  product-service    | ---> |  PostgreSQL       |
|           |      |  (Spring Boot 3)    |      |  optica_products  |
+-----------+      +---------------------+      +-------------------+
```

- **auth-service**: registro, login, JWT, roles ADMIN/USER. BD: MySQL.
- **product-service**: CRUD de productos opticos y consulta por categoria. BD: PostgreSQL.
- **frontend**: React + Vite con vistas distintas para ADMIN y USER.

## Tecnologias

| Capa | Tech |
|---|---|
| Backend | **Java 17, Spring Boot 3.3.4, Spring Security, Spring Data JPA, jjwt 0.12** |
| Build | Maven |
| BD 1 | MySQL 8 |
| BD 2 | PostgreSQL 16 |
| Frontend | React 18, Vite, React Router, Axios |
| Contenedores | Docker, docker-compose, Nginx |

## Arquitectura en capas (cada microservicio)

```
backend/<servicio>/src/main/java/com/optica/<servicio>/
├── controller/   <- recibe HTTP, valida con @Valid, devuelve ResponseEntity
├── service/      <- logica de negocio (transacciones, reglas)
├── repository/   <- interfaces JpaRepository (Spring Data)
├── model/        <- entidades JPA (@Entity)
├── dto/          <- request y response (con validaciones)
├── security/     <- JwtUtil, JwtAuthFilter, SecurityConfig
├── exception/    <- ApiException + GlobalExceptionHandler (@RestControllerAdvice)
└── config/       <- DataInitializer (carga roles/categorias por defecto)
```

---

## Endpoints

### auth-service (puerto 4001)

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| POST | `/api/auth/register` | publico | Registra usuario `{name,email,password,role?}` |
| POST | `/api/auth/login` | publico | Login -> devuelve `{token, user}` |
| GET | `/api/auth/me` | JWT | Datos del usuario autenticado |
| GET | `/api/auth/validate` | JWT | Verifica si el token es valido |
| GET | `/health` | publico | Health check |

### product-service (puerto 4002)

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| GET | `/api/categories` | JWT | Lista categorias |
| POST | `/api/categories` | JWT + ADMIN | Crea categoria |
| GET | `/api/products` | JWT | Lista productos (`?category_id=N` para filtrar) |
| GET | `/api/products/{id}` | JWT | Detalle |
| POST | `/api/products` | JWT + ADMIN | Crea producto |
| PUT | `/api/products/{id}` | JWT + ADMIN | Edita producto |
| DELETE | `/api/products/{id}` | JWT + ADMIN | Elimina producto |
| GET | `/health` | publico | Health check |

---

## PASO 11 - Comandos para ejecutar el proyecto localmente

### Opcion A (recomendada): Todo con Docker

```bash
docker compose up -d --build
```

Esto levanta:
- MySQL en `localhost:3306`
- PostgreSQL en `localhost:5432`
- auth-service en `http://localhost:4001`
- product-service en `http://localhost:4002`
- frontend en `http://localhost:5173`

> Spring Boot tarda ~30-60 segundos en arrancar. Si ves "Connection refused", espera un poco mas y recarga.

Para detener:
```bash
docker compose down
```

Para borrar tambien las bases de datos (esquema limpio):
```bash
docker compose down -v
```

### Opcion B: Sin Docker (modo desarrollo con Maven)

Requisitos: Java 17+ y Maven 3.9+ instalados, ademas de MySQL y PostgreSQL corriendo localmente con las BDs creadas.

```bash
# auth-service
cd backend/auth-service
mvn spring-boot:run

# product-service (en otra terminal)
cd backend/product-service
mvn spring-boot:run

# frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

> Si tienes Java 24 (muy reciente), la version de Lombok local puede no procesar bien las anotaciones. Usa Docker (Opcion A) que internamente usa Java 17 + Lombok 1.18.36 sin problemas.

### Probar la API con curl

```bash
# Registrar admin
curl -X POST http://localhost:4001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@optica.com","password":"123456","role":"ADMIN"}'

# Login (devuelve token)
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@optica.com","password":"123456"}'

# Listar productos con el token
curl http://localhost:4002/api/products -H "Authorization: Bearer <TOKEN>"
```

---

## PASO 12 - Subir a GitHub

```bash
git init -b main
git add .
git commit -m "Proyecto final Optica con Spring Boot"
git remote add origin https://github.com/<TU_USUARIO>/optica.git
git push -u origin main
```

---

## PASO 13 - Despliegue en la nube

### Stack recomendado (todo gratis)

| Componente | Plataforma |
|---|---|
| MySQL | **Railway** (con Public Networking habilitado) |
| PostgreSQL | **Render** (servicio nativo) |
| auth-service y product-service | **Render** (Web Service Docker) |
| Frontend | **Vercel** |

### A) MySQL en Railway

1. [https://railway.com/](https://railway.com/) -> Login con GitHub.
2. **+ New Project** -> **Deploy MySQL**.
3. En el bloque MySQL -> **Settings** -> **Networking** -> **Generate Domain** (Public Networking).
4. Pestana **Variables** -> copia `MYSQL_PUBLIC_URL`. Tendra esta forma:
   ```
   mysql://root:PASSWORD@HOST.proxy.rlwy.net:PORT/railway
   ```
5. Convierte esa URL a JDBC para Spring Boot. Si tu `MYSQL_PUBLIC_URL` es:
   ```
   mysql://root:abc123@turntable.proxy.rlwy.net:45694/railway
   ```
   Entonces:
   - `SPRING_DATASOURCE_URL = jdbc:mysql://turntable.proxy.rlwy.net:45694/railway?useSSL=false&allowPublicKeyRetrieval=true`
   - `SPRING_DATASOURCE_USERNAME = root`
   - `SPRING_DATASOURCE_PASSWORD = abc123`

### B) PostgreSQL en Render

1. [https://render.com/](https://render.com/) -> Login con GitHub.
2. **+ New** -> **PostgreSQL**.
3. Plan **Free**. Espera ~1 min.
4. En la pagina del Postgres, copia la **External Database URL** (algo como):
   ```
   postgresql://USER:PASSWORD@HOST.oregon-postgres.render.com/optica_products
   ```
5. Para Spring Boot, conviertelo a JDBC con SSL:
   - `SPRING_DATASOURCE_URL = jdbc:postgresql://HOST.oregon-postgres.render.com/optica_products?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME = USER`
   - `SPRING_DATASOURCE_PASSWORD = PASSWORD`

### C) auth-service en Render (Docker)

1. **+ New** -> **Web Service** -> conecta el repo `Mariana44-max/Optica`.
2. Configuracion:
   - **Name**: `optica-auth-service`
   - **Branch**: `main`
   - **Root Directory**: `backend/auth-service`
   - **Runtime**: **Docker** (Render detecta el Dockerfile)
   - **Plan**: Free
3. Variables de entorno:
   ```
   SPRING_DATASOURCE_URL       = jdbc:mysql://turntable.proxy.rlwy.net:PORT/railway?useSSL=false&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME  = root
   SPRING_DATASOURCE_PASSWORD  = (la password de Railway)
   JWT_SECRET                  = optica-jwt-secret-mariana-2026-cadena-larga-aleatoria-12345
   JWT_EXPIRATION_MS           = 7200000
   ```
4. **Create Web Service**. La primera vez tarda ~5 min (compila con Maven dentro del contenedor). Anota la URL: `https://optica-auth-service.onrender.com`.

### D) product-service en Render (Docker)

1. **+ New** -> **Web Service** -> mismo repo.
2. Configuracion:
   - **Name**: `optica-product-service`
   - **Branch**: `main`
   - **Root Directory**: `backend/product-service`
   - **Runtime**: **Docker**
   - **Plan**: Free
3. Variables:
   ```
   SPRING_DATASOURCE_URL       = jdbc:postgresql://HOST.oregon-postgres.render.com/optica_products?sslmode=require
   SPRING_DATASOURCE_USERNAME  = (user del Postgres)
   SPRING_DATASOURCE_PASSWORD  = (password del Postgres)
   JWT_SECRET                  = optica-jwt-secret-mariana-2026-cadena-larga-aleatoria-12345
   ```
   > **CRITICO**: el `JWT_SECRET` debe ser EXACTAMENTE el mismo en los dos servicios.
4. **Create Web Service**. URL: `https://optica-product-service.onrender.com`.

### E) Frontend en Vercel

1. [https://vercel.com/](https://vercel.com/) -> Login con GitHub.
2. **Add New** -> **Project** -> importa el repo.
3. Configuracion:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
4. Variables de entorno:
   ```
   VITE_AUTH_URL     = https://optica-auth-service.onrender.com
   VITE_PRODUCT_URL  = https://optica-product-service.onrender.com
   ```
5. **Deploy**. URL: `https://optica-mariana.vercel.app`.

### F) Probar en produccion

1. Abre la URL de Vercel.
2. Registra un usuario admin: `admin@optica.com` / `123456` con rol `ADMIN`.
3. Crea, edita y borra productos.
4. Cierra sesion, registra un USER y verifica que solo ve el catalogo.

---

## PASO 14 - Que subir a Moodle

Sube un PDF con:

1. Nombre del estudiante y curso.
2. URL del repositorio en GitHub (publico).
3. URL publica del backend (las dos):
   - auth-service: `https://...`
   - product-service: `https://...`
4. URL publica del frontend: `https://...`
5. Credenciales de prueba:
   - Admin: `admin@optica.com` / `123456`
   - User: `user@optica.com` / `123456`
6. Capturas de pantalla (recomendado):
   - Login funcionando.
   - Vista de admin creando un producto.
   - Vista de user filtrando por categoria.
   - Postman/Thunder Client probando un endpoint con JWT.
7. Diagrama de arquitectura (puedes copiar el ASCII de arriba o hacerlo en draw.io).

---

## PASO 15 - Como explicar el proyecto el dia de la sustentacion

Sigue este guion (10 a 15 min):

1. **Contexto (1 min):** "Es una aplicacion para una optica que permite gestionar productos. Hay dos roles: el administrador hace CRUD y el usuario solo consulta y filtra por categoria."

2. **Arquitectura (2 min):** "Esta dividida en dos microservicios independientes en Spring Boot 3: uno se encarga de la autenticacion con MySQL y JWT, y el otro de la gestion de productos con PostgreSQL. Los dos microservicios y el frontend corren en contenedores Docker, y se levantan con `docker compose up`. En la nube cada uno tiene su propio servicio."

3. **Capas (2 min):** "Cada microservicio sigue arquitectura en capas:
   - **Controller** (`@RestController`): recibe la peticion HTTP y valida los DTOs con `@Valid`.
   - **Service** (`@Service`): contiene la logica de negocio.
   - **Repository** (`JpaRepository`): habla con la base de datos a traves de Spring Data JPA, sin escribir SQL manual.
   - **Model** (`@Entity`): mapea las tablas con Hibernate.
   - **DTO**: serializa la respuesta para no exponer datos sensibles como el hash de la contrasena."

4. **Seguridad (2 min):** "El login genera un JWT firmado con HS384 usando un secreto compartido entre los dos servicios. Cada microservicio tiene un `JwtAuthFilter` (extiende `OncePerRequestFilter`) que valida el token y carga el rol como una autoridad de Spring Security (`ROLE_ADMIN` o `ROLE_USER`). En el `SecurityConfig` uso `hasRole('ADMIN')` para restringir las rutas de creacion/edicion/eliminacion de productos. Las contrasenas se guardan con `BCryptPasswordEncoder`, nunca en claro."

5. **Demo en vivo (5 min):**
   - Abro el frontend desplegado.
   - Me registro como ADMIN, hago login, creo un producto, lo edito y lo elimino.
   - Cierro sesion, entro como USER, veo el catalogo y filtro por categoria.
   - Muestro en Postman que sin token devuelve 401 y con token de USER intentando crear producto devuelve 403 (rol insuficiente).

6. **Docker (1 min):** "Cada servicio tiene su propio Dockerfile multi-stage: primero compila con Maven 3.9 + JDK 17, luego empaqueta el JAR en una imagen JRE 17 alpine ligera. Todo se orquesta con docker-compose: dos bases de datos, dos microservicios y el frontend con Nginx sirviendo el build de Vite."

7. **Despliegue (1 min):** "El backend esta desplegado en Render como dos Web Services con runtime Docker, el MySQL en Railway, el PostgreSQL en Render y el frontend en Vercel. El frontend consume las URLs publicas del backend mediante variables de entorno (`VITE_AUTH_URL` y `VITE_PRODUCT_URL`), no localhost."

8. **Cierre:** "Cumple los 5 puntos: backend Spring Boot con microservicios, dos BDs distintas, JWT con roles, frontend desplegado y consumiendo el backend en la nube, y todo dockerizado."

### Posibles preguntas del profesor

- **Por que microservicios?** Permiten escalar cada parte independiente, usar BDs distintas (MySQL para identidad relacional simple, PostgreSQL para productos con tipos NUMERIC, TEXT y consultas mas ricas) y desplegarlos por separado.
- **Por que Spring Boot?** Es el estandar de la industria para Java en backend, trae soporte para JPA, Security, validacion y starters listos para usar. Reduce mucha configuracion gracias a la convencion sobre configuracion.
- **Por que JWT y no sesiones?** Es stateless, perfecto para microservicios donde varios servicios deben validar el mismo token sin compartir sesion.
- **Que pasa si el token expira?** El usuario debe loguearse de nuevo. Se podria implementar refresh token como mejora.
- **Como protegen las rutas de ADMIN?** Con `SecurityFilterChain.authorizeHttpRequests` declarando `hasRole("ADMIN")` para los metodos POST, PUT, DELETE de `/api/products`.
- **Como se comunican los microservicios?** En este proyecto no necesitan llamarse entre si: comparten el `JWT_SECRET` para validar el mismo token de forma independiente, lo cual es un patron comun (token-based auth descentralizada).
- **Por que JPA en vez de JDBC plano?** Productividad: definimos entidades con `@Entity` y obtenemos CRUD automatico via `JpaRepository`, sin escribir SQL repetitivo. Hibernate genera el SQL optimizado y maneja transacciones.

---

## Resumen de calificacion (5.0)

| Item | Puntos | Donde se ve |
|---|---|---|
| Backend con microservicios Spring Boot, JWT, roles, 2 BDs, Docker | 3.0 | `backend/auth-service`, `backend/product-service`, `docker-compose.yml` |
| Frontend integrado y desplegado | 2.0 | `frontend/`, URL publica + consumo del backend en la nube |

Listo para entregar.
