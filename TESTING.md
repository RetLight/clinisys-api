# Testing de APIs - Módulo 1 (Servicios de Salud)

## Prerequisitos para testing

- El servidor debe estar ejecutándose en `http://localhost:3000`
- Base de datos PostgreSQL debe estar conectada
- Haber ejecutado las migraciones: `npx prisma migrate dev`

## URLs base de las APIs

```
Base URL: http://localhost:3000
Rutas del Módulo 1: /citas, /atenciones, /procedimientos
```

## Ejemplos de requests usando cURL

### 1. Crear una Cita

```bash
curl -X POST http://localhost:3000/citas \
  -H "Content-Type: application/json" \
  -d '{
    "fecha": "2025-12-20T14:30:00Z",
    "motivo": "Consulta general",
    "pacienteId": "550e8400-e29b-41d4-a716-446655440000",
    "medicoId": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

### 2. Listar todas las Citas

```bash
curl -X GET http://localhost:3000/citas
```

### 3. Obtener una Cita por ID

```bash
curl -X GET http://localhost:3000/citas/{citaId}
```

### 4. Actualizar una Cita

```bash
curl -X PATCH http://localhost:3000/citas/{citaId} \
  -H "Content-Type: application/json" \
  -d '{
    "motivo": "Consulta actualizada",
    "estado": "confirmada"
  }'
```

### 5. Eliminar una Cita

```bash
curl -X DELETE http://localhost:3000/citas/{citaId}
```

### 6. Crear una Atención Médica

```bash
curl -X POST http://localhost:3000/atenciones \
  -H "Content-Type: application/json" \
  -d '{
    "citaId": "{citaId}",
    "diagnostico": "Gripe común",
    "fecha": "2025-12-20T14:45:00Z",
    "observaciones": {
      "presion": "120/80",
      "temperatura": 37.5
    }
  }'
```

### 7. Listar Atenciones Médicas

```bash
curl -X GET http://localhost:3000/atenciones
```

### 8. Obtener Atención por ID

```bash
curl -X GET http://localhost:3000/atenciones/{atencionId}
```

### 9. Actualizar Atención

```bash
curl -X PATCH http://localhost:3000/atenciones/{atencionId} \
  -H "Content-Type: application/json" \
  -d '{
    "diagnostico": "Gripe común - mejorado",
    "observaciones": {
      "presion": "118/78",
      "temperatura": 37.2
    }
  }'
```

### 10. Eliminar Atención

```bash
curl -X DELETE http://localhost:3000/atenciones/{atencionId}
```

### 11. Crear un Procedimiento

```bash
curl -X POST http://localhost:3000/procedimientos \
  -H "Content-Type: application/json" \
  -d '{
    "atencionId": "{atencionId}",
    "descripcion": "Inyección de antibiótico",
    "insumoId": "{insumoId}",
    "cantidad": 2
  }'
```

### 12. Listar Procedimientos

```bash
curl -X GET http://localhost:3000/procedimientos
```

### 13. Obtener Procedimiento por ID

```bash
curl -X GET http://localhost:3000/procedimientos/{procedimientoId}
```

## Usando Postman

### Colección de Postman

1. Abre Postman
2. Crea una nueva colección "ClinisysAPI"
3. Agrega las siguientes variables en Collection Variables:
   - `baseUrl`: `http://localhost:3000`
   - `citaId`: `{valor que obtengas al crear una cita}`
   - `atencionId`: `{valor que obtengas al crear una atención}`
   - `procedimientoId`: `{valor que obtengas al crear un procedimiento}`

### Requests de ejemplo en Postman

#### POST - Crear Cita
```
Method: POST
URL: {{baseUrl}}/citas
Body (JSON):
{
  "fecha": "2025-12-20T14:30:00Z",
  "motivo": "Consulta general",
  "pacienteId": "550e8400-e29b-41d4-a716-446655440000",
  "medicoId": "550e8400-e29b-41d4-a716-446655440001"
}
```

## Validaciones a tener en cuenta

### Citas
- La fecha debe ser futura
- La hora debe estar entre 08:00 y 20:00
- El paciente y médico deben existir en la BD
- No pueden haber conflictos de horario para el médico o paciente

### Atenciones
- La cita debe existir
- Solo puede haber una atención por cita
- La fecha de atención no puede ser anterior a la fecha de la cita

### Procedimientos
- La atención debe existir
- El insumo debe existir
- Debe haber stock suficiente del insumo

## Posibles respuestas de error

### 400 - Bad Request
```json
{
  "success": false,
  "message": "La fecha debe ser futura.",
  "timestamp": "2025-12-20T10:30:00.000Z",
  "statusCode": 400
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Cita no encontrada.",
  "timestamp": "2025-12-20T10:30:00.000Z",
  "statusCode": 404
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "El médico ya tiene una cita en ese horario.",
  "timestamp": "2025-12-20T10:30:00.000Z",
  "statusCode": 409
}
```

## Pruebas automatizadas

Para ejecutar tests:

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests E2E
npm run test:e2e
```

## Debugging

### Ver logs de Prisma

En `.env`, agrega:
```env
# Prisma logging
DATABASE_LOGGING=true
```

### Habilitar debugging de NestJS

```bash
npm run start:debug
```

Luego en VS Code: F5 o Debug > Start Debugging
