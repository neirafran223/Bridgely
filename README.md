# Bridgely

Plataforma marketplace que conecta clientes (que publican ideas de software) con developers (que postulan para construirlas), con sistema de equipos, chat en tiempo real, pagos con escrow y calificaciones.

## Stack Tecnologico

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4
- **Backend:** Express 5 + TypeScript + Prisma ORM
- **Base de datos:** PostgreSQL
- **Tiempo real:** Socket.IO
- **Auth:** JWT + bcrypt

## Inicio Rapido

### Requisitos

- Node.js 20+
- PostgreSQL 16+
- npm

### Instalacion

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd bridgely

# Instalar dependencias del backend
cd backend
cp .env.example .env  # Configurar variables de entorno
npm install
npx prisma migrate dev
npm run dev

# En otra terminal - instalar dependencias del frontend
cd frontend
npm install
npm run dev
```

### Con Docker

```bash
docker compose up -d
```

La aplicacion estara disponible en:
- Frontend: http://localhost:80
- Backend API: http://localhost:4000

## Estructura del Proyecto

```
bridgely/
├── backend/          # API REST con Express + Prisma
│   ├── src/
│   │   ├── auth/         # Autenticacion y autorizacion
│   │   ├── ideas/        # CRUD de ideas de proyectos
│   │   ├── postulaciones/ # Aplicaciones de developers
│   │   ├── chat/         # Mensajeria en tiempo real
│   │   ├── developers/   # Perfiles de developers
│   │   ├── equipos/      # Gestion de equipos
│   │   ├── transacciones/ # Sistema de escrow
│   │   ├── calificaciones/ # Ratings y reputacion
│   │   ├── notificaciones/ # Notificaciones in-app
│   │   └── admin/        # Panel de administracion
│   └── prisma/       # Schema y migraciones
├── frontend/         # SPA con React + Vite
│   └── src/
│       ├── pages/        # 13 paginas
│       ├── components/   # Componentes UI
│       ├── context/      # AuthContext
│       └── services/     # Servicios API
└── docker-compose.yml
```

## Flujo de Negocio

1. **Registro** como cliente o developer
2. **Cliente crea una idea** (con sugerencia automatica de dificultad)
3. **Developers postulan** (individual o en equipo)
4. **Cliente acepta** una postulacion
5. **Chat en tiempo real** se abre
6. **Transaccion** con escrow (10% comision)
7. **Cliente califica** al developer

## Scripts Disponibles

### Backend

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm run start        # Ejecutar en produccion
npm run lint         # Verificar linting
npm run test         # Ejecutar tests
```

### Frontend

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para produccion
npm run preview      # Vista previa de produccion
npm run lint         # Verificar linting
npm run test         # Ejecutar tests
```

## Variables de Entorno

### Backend (.env)

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 4000 |
| `DATABASE_URL` | URL de conexion a PostgreSQL | - |
| `JWT_SECRET` | Secreto para firmar JWT | - |

### Frontend (.env)

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API | http://localhost:4000 |

## API Endpoints

Ver `backend/README.md` para documentacion completa de la API.

## Licencia

ISC
