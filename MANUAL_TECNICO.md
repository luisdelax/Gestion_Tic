# 📋 MANUAL TÉCNICO - DINAMIZ TIC

## 1. VISIÓN GENERAL

**Dinamiz TIC** es un sistema de gestión integral para el área de tecnología de una organización, permitiendo administrar:
- Equipos de cómputo
- Funcionarios
- Préstamos de equipos
- Tickets de soporte
- Reservas de auditoría
- Tareas con prioridades
- Informes y estadísticas

---

## 2. ARQUITECTURA DE LA APLICACIÓN

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Dashboard │  │Equipos   │  │Préstamos│  │ Tareas   │     │
│  │ page.jsx │  │ page.jsx │  │ page.jsx│  │ page.jsx │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              COMPONENTES REUTILIZABLES                    │   │
│  │  CRUDBase.jsx (sidebar, modal, tabla, formularios)      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Next.js API Routes)                  │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ /api/auth   │  │/api/equipos│  │ /api/tareas │             │
│  │  /login     │  │ /computo   │  │ /[id]      │             │
│  │  /register  │  │ /[id]      │  │ /check     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS (Prisma)                      │
│                        PostgreSQL (Neon)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. ESTRUCTURA DEL PROYECTO

```
dinamiz-tic/
├── app/                          # Aplicación Next.js (App Router)
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Autenticación
│   │   │   ├── login/           # POST - Iniciar sesión
│   │   │   ├── register/        # POST - Registrar usuario
│   │   │   ├── me/              # GET - Obtener usuario actual
│   │   │   ├── perfil # PUT - Actual/        izar perfil
│   │   │   ├── password/        # PUT - Cambiar contraseña
│   │   │   └── tecnicos/        # GET - Listar técnicos
│   │   │
│   │   ├── equipos/
│   │   │   ├── computo/         # Equipos de cómputo
│   │   │   │   ├── route.js     # GET, POST
│   │   │   │   ├── [id]/       # GET, PUT, DELETE
│   │   │   │   └── hojadevida/  # Subir PDF
│   │   │   └── telecom/         # Equipos telecom
│   │   │
│   │   ├── tareas/             # Gestión de tareas
│   │   │   ├── route.js         # GET, POST
│   │   │   ├── [id]/           # GET, PUT, DELETE
│   │   │   └── check/           # Verificar vencidas
│   │   │
│   │   ├── prestamos/          # Préstamos de equipos
│   │   ├── funcionarios/        # Funcionarios
│   │   ├── tickets/             # Tickets de soporte
│   │   ├── notificaciones/      # Notificaciones
│   │   ├── dashboard/          # Estadísticas
│   │   └── informes/           # Informes
│   │
│   ├── dashboard/               # Página principal
│   ├── equipos/computo/       # Módulo equipos
│   ├── tareas/                # Módulo tareas
│   ├── prestamos/             # Módulo préstamos
│   ├── login/                 # Página de login
│   └── ...
│
├── components/                  # Componentes reutilizables
│   └── CRUDBase.jsx           # Componente base para CRUD
│
├── lib/
│   └── constantes.js           # Constantes globales
│
├── prisma/
│   └── schema.prisma           # Schema de base de datos
│
└── .env                       # Variables de entorno
```

---

## 4. ESTRUCTURA DE LA BASE DE DATOS

### Modelo Entidad-Relación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USUARIOS (User)                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│  │ id (PK)    │    │ nombre      │    │ email      │                │
│  │ nombre     │    │ apellido    │    │ password   │                │
│  │ rol        │    │ (Enum)      │    │            │                │
│  └─────────────┘    └─────────────┘    └─────────────┘                │
│         │                                                        │      │
│         │ 1:N                                                   │      │
│         ▼                                                        ▼      │
│  ┌─────────────┐                                         ┌──────────┐ │
│  │ Tarea      │                                         │Notificac.│ │
│  │ - titulo   │                                         │ - titulo │ │
│  │ - prioridad│                                         │ - mensaje│ │
│  │ - estado  │                                         │ - leida  │ │
│  │ - asignadoAId◄────── N:1                           │ - tareaId│ │
│  └─────────────┘                                         └──────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    PRÉSTAMOS (Prestamo)                     │    │
│  │  ┌───────────┐  ┌───────────────┐  ┌───────────────────┐   │    │
│  │  │ id (PK)   │  │ usuarioId (FK)│  │ equipoComputoId(FK)│   │    │
│  │  │ estado    │◄─────── N:1      │◄──────── N:1          │   │    │
│  │  │ fechaPres│  │ Funcionario   │  │ EquipoComputo     │   │    │
│  │  │ fechaDev │  └───────────────┘  └───────────────────┘   │    │
│  │  │ bolso    │                                             │    │
│  │  │ cargador │  ┌───────────────┐  ┌───────────────────┐   │    │
│  │  └─────────┘  │ perifericoId │  │ audiovisualId(FK) │   │    │
│  │              └───────────────┘  └───────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      TICKETS                                 │    │
│  │  - titulo, descripcion, estado, prioridad                   │    │
│  │  - creadoPorId (FK→User), asignadoAId (FK→User)          │    │
│  │  - equipoId (FK→EquipoComputo)                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ENUMS DEFINIDOS                                                │
│  ┌─────────────────┬────────────────────────────────────────┐ │
│  │ Rol             │ Administrador, Superusuario, TecnicoN1   │ │
│  │ EstadoEquipo    │ Disponible, Asignado, EnReparacion,      │ │
│  │                 │ DadoDeBaja, Prestado                     │ │
│  │ PrioridadTarea   │ Baja, Media, Alta, Urgente              │ │
│  │ EstadoTarea     │ Pendiente, EnProceso, Completada,        │ │
│  │                 │ Cancelada                                 │ │
│  │ EstadoTicket    │ Abierto, EnProceso, Resuelto, Cerrado    │ │
│  │ EstadoPrestamo  │ Pendiente, Aprobado, Rechazado, Devuelto│ │
│  └─────────────────┴────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `User` | Usuarios del sistema (admin, técnicos) |
| `Funcionario` | Funcionarios de la organización |
| `EquipoComputo` | Equipos de cómputo (laptops, desktops) |
| `EquipoTelecom` | Equipos de telecomunicaciones |
| `Periferico` | Periféricos (mouse, teclado, etc.) |
| `EquipoAudiovisual` | Equipos audiovisuales (video beam, etc.) |
| `Prestamo` | Préstamos de equipos |
| `Tarea` | Tareas con prioridades y asignaciones |
| `Ticket` | Tickets de soporte técnico |
| `Notificacion` | Notificaciones del sistema |
| `ReservaAuditorio` | Reservas del auditório |
| `Ubicacion` | Ubicaciones físicas |

---

## 5. FLUJO DE DATOS

### Login
```
Usuario → Login Page → API /auth/login → JWT → Cookie → Redirect /dashboard
```

### Crear Tarea
```
Página Tareas → Formulario → POST /api/tareas → 
Prisma → PostgreSQL → Notificación (si asignada) → Refresh lista
```

### Préstamo de Equipo
```
Página Préstamos → Seleccionar Funcionario + Equipo → POST /api/prestamos →
Actualizar estado equipo a "Prestado" → Notificación (opcional)
```

### Cambio Estado Tarea
```
Dashboard (gadget) / Página Tareas → Select estado → PUT /api/tareas/:id →
Actualizar BD → Si "Completada" → Notificar creador
```

---

## 6. COMPONENTES CLAVE

### CRUDBase.jsx
Componente reutilizable que incluye:
- Sidebar con menú
- Header con notificaciones
- Tabla de datos (DataTable)
- Modal para formularios
- Integración con API

### useUpperCase Hook
Hook personalizado para convertir inputs a mayúsculas automáticamente.

---

## 7. VARIABLES DE ENTORNO (.env)

```env
# Base de datos
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# JWT
JWT_SECRET=tu_secret_jwt

# Cloudflare R2 (archivos)
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_ACCOUNT_ID=...
R2_PUBLIC_URL=...
```

---

## 8. COMANDOS ÚTILES

### Desarrollo local
```bash
npm run dev          # Iniciar servidor desarrollo
npm run build       # Compilar producción
npm run start       # Iniciar producción
npx prisma studio   # Visualizar base de datos
```

### Producción (EC2)
```bash
# Construir
cd /var/www/dinamiz-tic
npm run build

# Gestionar PM2
pm2 status                    # Ver estado
pm2 restart dinamiz-tic       # Reiniciar
pm2 logs dinamiz-tic          # Ver logs
pm2 logs dinamiz-tic --err   # Ver errores
pm2 flush                     # Limpiar logs

# Sincronizar desde local
rsync -avz --exclude='node_modules' --exclude='.next' \
  -e "ssh -i /ruta/key.pem" /local/dir/ ubuntu@IP:/var/www/dinamiz-tic/
```

---

## 9. ENDPOINTS API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |
| GET | `/api/auth/me` | Datos usuario actual |
| GET/POST | `/api/tareas` | Listar/Crear tareas |
| GET/PUT/DELETE | `/api/tareas/[id]` | CRUD tarea |
| GET/POST | `/api/equipos/computo` | Listar/Crear equipo |
| GET/PUT/DELETE | `/api/equipos/computo/[id]` | CRUD equipo |
| POST | `/api/equipos/computo/hojadevida` | Subir PDF |
| GET/POST | `/api/prestamos` | Listar/Crear préstamo |
| GET/PUT/DELETE | `/api/prestamos/[id]` | CRUD préstamo |
| GET | `/api/notificaciones` | Listar notificaciones |
| GET | `/api/dashboard` | Estadísticas |

---

## 10. MANTENIMIENTO

### Actualizar producción
1. Hacer cambios en local
2. Probar localmente
3. Sincronizar: `rsync -avz ...`
4. Build: `npm run build`
5. Reiniciar: `pm2 restart dinamiz-tic`

### Agregar nuevo módulo
1. Crear tabla en `prisma/schema.prisma`
2. Ejecutar `npx prisma db push`
3. Crear API en `app/api/nuevo-modulo/`
4. Crear página en `app/nuevo-modulo/`
5. Agregar al menú en `components/CRUDBase.jsx`

### Respaldar base de datos
Neon (PostgreSQL cloud) maneja backups automáticamente.
Para exportar: usar pg_dump o panel de Neon.

---

## 11. TROUBLESHOOTING

### Error 500 en API
```bash
pm2 logs dinamiz-tic --err --lines 20
```

### Error de autenticación
- Verificar JWT_SECRET en .env
- Verificar cookie token

### Error de base de datos
- Verificar DATABASE_URL
- Ejecutar `npx prisma db push`

### Error de build
- Limpiar cache: `rm -rf .next`
- Regenerar Prisma: `npx prisma generate`

---

*Documento generado automáticamente - Dinamiz TIC v2.0*
