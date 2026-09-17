# Bridgely Frontend

SPA construida con React 19, TypeScript, Vite y Tailwind CSS 4.

## Configuracion

```bash
npm install
npm run dev
```

El servidor de desarrollo estara disponible en http://localhost:5173.

## Estructura

```
src/
├── pages/                    # 13 paginas
│   ├── LandingPage.tsx       # Pagina principal marketing
│   ├── LoginPage.tsx         # Inicio de sesion
│   ├── RegistroPage.tsx      # Registro de usuarios
│   ├── DashboardPage.tsx     # Panel principal
│   ├── IdeaDetallePage.tsx   # Detalle de idea
│   ├── ChatPage.tsx          # Chat en tiempo real
│   ├── MisPostulacionesPage.tsx  # Postulaciones del developer
│   ├── MisEquiposPage.tsx    # Gestion de equipos
│   ├── MisTransaccionesPage.tsx  # Transacciones
│   ├── PerfilDeveloperPage.tsx   # Editar perfil developer
│   ├── PerfilPublicoDeveloperPage.tsx  # Perfil publico
│   ├── AdminDashboardPage.tsx    # Panel admin
│   └── NotFoundPage.tsx      # 404
├── components/               # Componentes UI
│   ├── DashboardLayout.tsx   # Layout con sidebar
│   ├── ProtectedRoute.tsx    # Guard de rutas
│   ├── PublicarIdeaModal.tsx # Modal publicar idea
│   ├── PostularModal.tsx     # Modal postular
│   ├── CalificarModal.tsx    # Modal calificar
│   ├── NotificacionesBell.tsx # Campana de notificaciones
│   ├── DificultadBadge.tsx   # Badge de dificultad
│   ├── landing/              # Secciones del landing
│   └── ...
├── context/
│   └── AuthContext.tsx       # Contexto de autenticacion
├── services/                 # Servicios API
│   ├── api.ts                # Axios instance con interceptor
│   ├── ideas.ts              # API de ideas
│   ├── postulaciones.ts      # API de postulaciones
│   ├── chat.ts               # API de chat
│   ├── developers.ts         # API de developers
│   ├── equipos.ts            # API de equipos
│   ├── transacciones.ts      # API de transacciones
│   ├── calificaciones.ts     # API de calificaciones
│   ├── notificaciones.ts     # API de notificaciones
│   ├── admin.ts              # API de admin
│   └── socket.ts             # Socket.IO client
└── index.css                 # Estilos globales + Tailwind
```

## Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para produccion
npm run preview      # Vista previa de produccion
npm run lint         # Verificar linting
npm run test         # Ejecutar tests
npm run test:watch   # Modo watch
npm run test:coverage # Con coverage
```

## Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Utility-first CSS
- **React Router 7** - Routing
- **Axios** - HTTP client
- **Socket.IO Client** - WebSocket
- **Lucide React** - Icons
- **jwt-decode** - JWT parsing

## Variables de Entorno

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API | http://localhost:4000 |

## Testing

```bash
npm run test          # Ejecutar tests
npm run test:watch    # Modo watch con Vitest
```

Tests escritos con Vitest + React Testing Library + jsdom.
