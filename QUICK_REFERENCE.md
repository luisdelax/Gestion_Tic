# 📖 REFERENCIA RÁPIDA - DINAMIZ TIC

## Información Essential para Mantenimiento

### 🏗️ Arquitectura
- **Frontend + Backend**: Next.js (App Router) en un mismo proyecto
- **Base de datos**: PostgreSQL (Neon cloud)
- **ORM**: Prisma
- **Estilos**: Tailwind CSS

### 📁 Estructura Clave
```
app/
├── api/                    # Backend (Next.js API Routes)
│   ├── auth/              # Login, register
│   ├── tareas/            # CRUD tareas + check vencimiento
│   ├── equipos/computo/  # Equipos + hojadevida PDF
│   └── prestamos/        # Préstamos
├── componentes/CRUDBase.jsx  # Componente base (sidebar, tabla, modal)
└── *.jsx                 # Páginas
```

### 🔑 Concepts Importants
- **CRUDBase**: Componente wrapper que incluye sidebar, notificaciones, logout
- **useUpperCase**: Hook para inputs en mayúsculas
- **verifyAuth**: Función que extrae y verifica JWT del cookie
- **Prisma Client**: Instanciado en cada route como `new PrismaClient()`

### ⚙️ Rutas API dinámicas
En Next.js 15+, `params` es Promise:
```javascript
export async function GET(request, { params }) {
  const { id } = await params  // ← Importante!
}
```

### 🔧 Comandos Frecuentes
```bash
# Desarrollo
npm run dev

# Producción (EC2)
npm run build
pm2 restart dinamiz-tic

# Sincronizar local→EC2
rsync -avz --exclude='node_modules' --exclude='.next' -e "ssh -i key.pem" local/ ubuntu@IP:/var/www/

# Ver errores
pm2 logs dinamiz-tic --err --lines 10

# Regenerar Prisma
npx prisma generate
npx prisma db push
```

### 📝 Agregar Nuevo Módulo
1. Añadir modelo en `prisma/schema.prisma`
2. `npx prisma db push`
3. Crear `app/api/nuevo-modulo/route.js`
4. Crear `app/nuevo-modulo/page.jsx` (usar CRUDBase)
5. Añadir al menú en `components/CRUDBase.jsx`

### 🐛 Debuggear Errores
1. Ver logs: `pm2 logs dinamiz-tic --err`
2. Probar API directo:
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@dinamiz.com","password":"admin123"}' \
  -c - | grep token | awk '{print $7}')

curl -s http://localhost:3000/api/tareas -H "Cookie: token=$TOKEN"
```

### 🔐 Credenciales (EC2)
- Email: `admin@dinamiz.com`
- Contraseña: `admin123`

### 🌐 URL Producción
- EC2: http://18.222.197.227
- GitHub: https://github.com/luisdelax/Gestion_Tic
