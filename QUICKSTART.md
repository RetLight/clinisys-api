# 🚀 QUICK START - Clinisys API

## ¡Comienza aquí en 5 minutos!

### 1️⃣ Instalar
```bash
npm install
```

### 2️⃣ Configurar BD
```bash
cp .env.example .env
# Edita .env con tus credenciales PostgreSQL
```

### 3️⃣ Base de datos
```bash
npx prisma generate
npx prisma migrate dev
```

### 4️⃣ ¡Ejecutar!
```bash
npm run start:dev
```

**✅ Listo en:** `http://localhost:3000`

---

## 📌 Ejemplos rápidos

### Crear una cita
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

### Listar citas
```bash
curl http://localhost:3000/citas
```

---

## 📚 Documentos disponibles

- **SETUP.md** - Guía completa de instalación
- **TESTING.md** - Todos los ejemplos de API
- **CORRECTIONS.md** - Detalles de las correcciones
- **RESUMEN_CORRECCIONES.md** - Resumen ejecutivo

---

## ⚠️ Requisitos

- Node.js 18+
- PostgreSQL 12+
- npm o yarn

---

**¡Listo para usar! 🎉**
