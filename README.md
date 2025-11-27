# Contentful Products API

API para gestión de productos desde Contentful con endpoints públicos y privados protegidos por JWT.

## 📋 Descripción

Esta aplicación implementa una API RESTful que:
- Sincroniza productos desde Contentful cada hora automáticamente
- Proporciona endpoints públicos para consultar y eliminar productos
- Ofrece endpoints privados protegidos por JWT para reportes analíticos
- Utiliza soft delete para mantener integridad de datos históricos
- Incluye documentación interactiva con Swagger

## 🏗️ Stack Tecnológico

- **Node.js**: v20.x LTS
- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL
- **ORM**: TypeORM
- **Documentación**: Swagger
- **Containerización**: Docker & Docker Compose
- **Testing**: Jest
- **CI/CD**: GitHub Actions

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js v20.x LTS
- Docker y Docker Compose
- Git

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd contentful-products-api
```

### 2. Configurar Variables de Entorno

Copiar el archivo de ejemplo y ajustar según sea necesario:

```bash
cp .env.example .env
```

Variables de entorno requeridas:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=contentful_products

# Contentful (proporcionadas por Apply Digital)
CONTENTFUL_SPACE_ID=bbd24zg4yngm
CONTENTFUL_ACCESS_TOKEN=wXfbqDOLix1ksxVH8NcRX1oE4KYytPW-ULqpXCxx3RU
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_CONTENT_TYPE=product

# JWT
JWT_SECRET=e3bf76123ac0c41cf6b0e94bf932a6d747f6d27ee28f3df1f07f8a61cbb845ff5bd8c4f867ac234de808ed72f8a28f7cc61bb1c26a762a8fd5588c043bda41b2
JWT_EXPIRATION=24h

# Application
PORT=3000
NODE_ENV=development
```

### 3. Iniciar con Docker Compose

**Opción recomendada** - Levanta toda la infraestructura:

```bash
docker-compose up --build
```

Esto iniciará:
- PostgreSQL en puerto 5432
- API en puerto 3000

### 4. Instalación Local (Desarrollo)

Si prefieres ejecutar sin Docker:

```bash
# Instalar dependencias
npm install

# Asegúrate de tener PostgreSQL corriendo localmente
# Actualiza el .env con DB_HOST=localhost

# Ejecutar en modo desarrollo
npm run start:dev
```

## 📊 Sincronización Inicial de Datos

La aplicación sincroniza automáticamente los productos desde Contentful cada hora. Para realizar una sincronización manual inicial:

### Opción 1: Usando Swagger UI

1. Navega a `http://localhost:3000/api/docs`
2. Encuentra el endpoint `POST /products/sync`
3. Click en "Try it out" y "Execute"

### Opción 2: Usando cURL

```bash
curl -X POST http://localhost:3000/products/sync
```

### Opción 3: Esperar la sincronización automática

El cron job se ejecuta automáticamente cada hora en punto.

## 📚 Documentación de la API

### Swagger UI

La documentación interactiva está disponible en:

```
http://localhost:3000/api/docs
```

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
npm run test
```

### Ejecutar Tests con Cobertura

```bash
npm run test:cov
```
La aplicación mantiene mínimo 30% de cobertura de código (statements).

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Modo watch con hot-reload
npm run start:debug        # Modo debug

# Producción
npm run build              # Compilar TypeScript
npm run start:prod         # Iniciar versión compilada

# Testing
npm run test               # Tests unitarios
npm run test:watch         # Tests en modo watch
npm run test:cov           # Tests con cobertura
npm run test:e2e           # Tests end-to-end

# Code Quality
npm run lint               # Ejecutar ESLint
npm run format             # Formatear código con Prettier
```

## 🐳 Docker

### Construir Imagen

```bash
docker build -t contentful-api .
```

### Ejecutar con Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

## 🔄 CI/CD con GitHub Actions

El proyecto incluye un workflow de CI que:

1. ✅ Ejecuta el linter
2. ✅ Corre tests con cobertura
3. ✅ Verifica que la cobertura sea ≥ 30%
4. ✅ Construye la aplicación

## 🔐 Seguridad

- Los endpoints de reportes están protegidos con JWT
- Soft delete asegura que los datos eliminados persisten
- Variables sensibles se manejan mediante variables de entorno
- **Importante**: Cambiar `JWT_SECRET` en producción

### Base de Datos

El proyecto usa TypeORM con PostgreSQL. La estructura incluye:

**Tabla `products`:**
- `id` (PK): ID de Contentful
- `name`: Nombre del producto
- `category`: Categoría
- `price`: Precio (decimal)
- `description`: Descripción
- `metadata`: JSON con datos adicionales
- `created_at`: Fecha de creación en DB
- `updated_at`: Última actualización
- `deleted_at`: Soft delete timestamp
- `contentful_created_at`: Fecha de creación en Contentful
- `contentful_updated_at`: Última actualización en Contentful

## 🤔 Suposiciones y Decisiones de Diseño

1. **Soft Delete**: Los productos eliminados se marcan como eliminados pero persisten en la base de datos para mantener datos históricos y reportes precisos.

2. **Sincronización Automática**: El sistema respeta los productos eliminados localmente y no los restaura en sincronizaciones posteriores.

3. **Autenticación Simple**: Para propósitos de testing, cualquier username genera un token válido. En producción, esto debería conectarse a un sistema de usuarios real.

4. **Paginación Fija**: El límite máximo por página es 5 según los requisitos.

5. **Reporte Personalizado**: Se eligió un reporte de productos por categoría con estadísticas de precios, útil para análisis de inventario.

6. **TypeORM Synchronize**: Está activado para desarrollo. En producción debe usarse migrations.

## 📦 Dependencias Principales

```json
{
  "@nestjs/core": "^10.3.0",
  "@nestjs/typeorm": "^10.0.1",
  "@nestjs/schedule": "^4.0.0",
  "@nestjs/swagger": "^7.1.17",
  "@nestjs/jwt": "^10.2.0",
  "contentful": "^10.6.21",
  "pg": "^8.11.3",
  "typeorm": "^0.3.19"
}
```
## 📄 Licencia

MIT

## 👤 Autor

Rodrigo Rozas Vásquez - Desarrollador Full-Stack

## 🙏 Agradecimientos

- Apply Digital por la oportunidad
- Contentful por la API de productos