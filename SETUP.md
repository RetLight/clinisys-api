# ClinisysAPI - Setup Instructions

## Requisitos previos

- Node.js 18+ instalado
- PostgreSQL 12+ instalado y ejecutándose
- npm o yarn como gestor de paquetes

## Pasos de instalación

### 1. Instalar dependencias

```bash
npm install
```

**IMPORTANTE**: Necesitas instalar `@nestjs/mapped-types` que fue agregado recientemente:

```bash
npm install @nestjs/mapped-types
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/clinisys"
JWT_SECRET="tu-super-secret-key-aqui-cambialo-en-produccion"
JWT_EXPIRES_IN="24h"
```

### 3. Generar el cliente de Prisma

Después de actualizar el schema o la primera vez, genera el cliente:

```bash
npx prisma generate
```

### 4. Ejecutar las migraciones

Para crear las tablas en la base de datos:

```bash
npx prisma migrate dev --name init
```

O si ya existe la migración inicial:

```bash
npx prisma migrate deploy
```

### 5. Ejecutar el proyecto

#### En modo desarrollo (con watch):
```bash
npm run start:dev
```

#### En modo debug:
```bash
npm run start:debug
```

#### En modo producción:
```bash
npm run build
npm run start:prod
```

## Estructura del proyecto

### Módulo 1 - Servicios de Salud (M1)
- **Ruta base**: `/api/m1/`
- **Endpoints**:
  - `POST /citas` - Crear una nueva cita
  - `GET /citas` - Listar todas las citas
  - `GET /citas/:id` - Obtener cita por ID
  - `PATCH /citas/:id` - Actualizar cita
  - `DELETE /citas/:id` - Eliminar cita
  
  - `POST /atenciones` - Registrar atención médica
  - `GET /atenciones` - Listar atenciones
  - `GET /atenciones/:id` - Obtener atención por ID
  - `PATCH /atenciones/:id` - Actualizar atención
  - `DELETE /atenciones/:id` - Eliminar atención
  
  - `POST /procedimientos` - Registrar procedimiento
  - `GET /procedimientos` - Listar procedimientos
  - `GET /procedimientos/:id` - Obtener procedimiento por ID
  - `PATCH /procedimientos/:id` - Actualizar procedimiento
  - `DELETE /procedimientos/:id` - Eliminar procedimiento

## Scripts disponibles

```bash
npm run build           # Compilar el proyecto
npm run start           # Ejecutar en modo producción
npm run start:dev       # Ejecutar en modo desarrollo con watch
npm run start:debug     # Ejecutar en modo debug
npm run lint            # Ejecutar ESLint
npm run format          # Formatear código con Prettier
npm run test            # Ejecutar tests unitarios
npm run test:watch      # Ejecutar tests en modo watch
npm run test:cov        # Ejecutar tests con coverage
npm run test:e2e        # Ejecutar tests E2E
```

## Troubleshooting

### Error: Cannot find module '@nestjs/mapped-types'
Solución: Ejecuta `npm install @nestjs/mapped-types`

### Error de base de datos
- Verifica que PostgreSQL está ejecutándose
- Verifica la conexión en `.env`
- Ejecuta `npx prisma db push` para sincronizar el schema

### Error: Decorators are not valid
- Asegúrate de que `experimentalDecorators` está en `true` en `tsconfig.json`
- Asegúrate de que `emitDecoratorMetadata` está en `true`

## Información adicional

- El puerto por defecto es **3000**
- La base de datos es **PostgreSQL**
- Usamos **Prisma** como ORM
- Usamos **NestJS** como framework
