# Bridgely Backend

API REST para la plataforma Bridgely.

## Configuracion

```bash
cp .env.example .env
# Editar .env con tus variables de entorno
npm install
npx prisma migrate dev
npm run dev
```

## Endpoints

### Autenticacion

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `POST` | `/auth/registro` | No | Publico | Registrar usuario |
| `POST` | `/auth/login` | No | Publico | Iniciar sesion |
| `GET` | `/auth/perfil` | JWT | Cualquiera | Obtener perfil |

### Ideas

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `GET` | `/ideas/` | No | Publico | Listar ideas abiertas |
| `GET` | `/ideas/propias` | JWT | Cliente | Mis ideas |
| `GET` | `/ideas/:id` | No | Publico | Ver idea |
| `POST` | `/ideas/` | JWT | Cliente | Crear idea |
| `PATCH` | `/ideas/:id` | JWT | Cliente | Actualizar idea |
| `DELETE` | `/ideas/:id` | JWT | Cliente | Eliminar idea |

### Postulaciones

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `POST` | `/postulaciones/` | JWT | Developer | Crear postulacion |
| `GET` | `/postulaciones/propias` | JWT | Developer | Mis postulaciones |
| `GET` | `/postulaciones/idea/:ideaId` | JWT | Cliente | Postulaciones de una idea |
| `PATCH` | `/postulaciones/:id/aceptar` | JWT | Cliente | Aceptar postulacion |

### Chat

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `GET` | `/chat/postulacion/:postulacionId` | JWT | Cualquiera | Obtener conversacion |
| `GET` | `/chat/:conversacionId/mensajes` | JWT | Cualquiera | Historial de mensajes |

### Developers

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `GET` | `/developers/perfil` | JWT | Developer | Mi perfil |
| `PATCH` | `/developers/perfil` | JWT | Developer | Actualizar perfil |
| `POST` | `/developers/perfil/stacks` | JWT | Developer | Agregar stack |
| `DELETE` | `/developers/perfil/stacks/:stackId` | JWT | Developer | Quitar stack |
| `GET` | `/developers/:id/publico` | JWT | Cualquiera | Perfil publico |

### Equipos

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `POST` | `/equipos/` | JWT | Developer | Crear equipo |
| `POST` | `/equipos/:id/invitar` | JWT | Developer | Invitar miembro |
| `PATCH` | `/equipos/:id/miembros/:miembroId/responder` | JWT | Developer | Responder invitacion |
| `GET` | `/equipos/mis-equipos` | JWT | Developer | Mis equipos |

### Transacciones

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `POST` | `/transacciones/desde-postulacion/:postulacionId` | JWT | Cliente | Crear transaccion |
| `PATCH` | `/transacciones/:id/marcar-pagado` | JWT | Cliente | Marcar como pagada |
| `PATCH` | `/transacciones/:id/liberar` | JWT | Cliente | Liberar pago |
| `GET` | `/transacciones/mias` | JWT | Cualquiera | Mis transacciones |

### Calificaciones

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `POST` | `/calificaciones/` | JWT | Cliente | Calificar developer |
| `GET` | `/calificaciones/developer/:developerUserId` | JWT | Cualquiera | Ver calificaciones |

### Notificaciones

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `GET` | `/notificaciones/mias` | JWT | Cualquiera | Mis notificaciones |
| `PATCH` | `/notificaciones/:id/leer` | JWT | Cualquiera | Marcar como leida |
| `PATCH` | `/notificaciones/leer-todas` | JWT | Cualquiera | Marcar todas leidas |

### Admin

| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| `GET` | `/admin/usuarios` | JWT | Admin | Listar usuarios |
| `PATCH` | `/admin/usuarios/:id/suspender` | JWT | Admin | Suspender usuario |
| `GET` | `/admin/ideas` | JWT | Admin | Listar ideas |
| `DELETE` | `/admin/ideas/:id` | JWT | Admin | Eliminar idea |
| `GET` | `/admin/estadisticas` | JWT | Admin | Estadisticas |

## Socket.IO

Eventos soportados:

| Evento | Direccion | Payload | Descripcion |
|--------|-----------|---------|-------------|
| `unirse_conversacion` | Client -> Server | `conversacionId: string` | Unirse a sala de chat |
| `enviar_mensaje` | Client -> Server | `{ conversacionId, contenido }` | Enviar mensaje |
| `nuevo_mensaje` | Server -> Client | `Mensaje` object | Nuevo mensaje recibido |
| `notificacion` | Server -> Client | `{ tipo, contenido }` | Nueva notificacion |

## Testing

```bash
npm run test          # Ejecutar todos los tests
npm run test:watch    # Modo watch
```
