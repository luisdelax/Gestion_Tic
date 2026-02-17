# AGENTS.md - Guía para Agentes IA

## Proyecto: Dinamiz TIC
Sistema de gestión integral para área de tecnología - Next.js Full Stack

## Estructura del Proyecto

```
/home/ldelacruz/Dinamiz_Tic/
├── app/                    # Next.js App Router
│   ├── api/               # Backend (API Routes)
│   │   ├── auth/         # Autenticación
│   │   ├── tareas/       # Gestión tareas
│   │   ├── equipos/      # Equipos cómputo
│   │   └── ...
│   ├── dashboard/         # Página principal
│   ├── tareas/            # Módulo tareas
│   └── login/             # Login
├── components/
│   └── CRUDBase.jsx     # Componente base CRUD
├── prisma/
│   └── schema.prisma    # Schema BD
└── .env                  # Variables entorno
```

## Reglas Importantes

### 1. Next.js 15+ params
Siempre usar await con params en rutas API:
```javascript
export async function GET(request, { params }) {
  const { id } = await params  // ✅ Correcto
  // params.id  // ❌ Incorrecto
}
```

### 2. Tipos de datos Prisma
- Strings vacíos → convertir a null o parsear a Int
- Fechas → usar `new Date()` o ISO string

### 3. Frontend
- Usar CRUDBase como wrapper
- fetch con `credentials: 'include'`
- Estados: useState, efectos: useEffect

### 4. Rutas EC2 Production
- Host: 18.222.197.227
- Key: `/home/ldelacruz/Documentos/Personales/Luis/PROYECTOS_DE_DESARROLLO/DINAMIZ_TIC-KEY_SSH/dinamiz-tic-key.pem`
- Usuario: ubuntu
- Directorio: `/var/www/dinamiz-tic/`
- Puerto: 3000

### 5. Workflow typical
```bash
# 1. Hacer cambios en local
# 2. Probar localmente (npm run dev)
# 3. Sincronizar a EC2
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  -e "ssh -i /ruta/key.pem" /local/dir/ ubuntu@18.222.197.227:/var/www/dinamiz-tic/

# 4. Build y restart en EC2
ssh -i /ruta/key.pem ubuntu@18.222.197.227 "cd /var/www/dinamiz-tic && npm run build && pm2 restart dinamiz-tic"
```

## Commands Útiles

```bash
# Probar API desde EC2
TOKEN=$(curl -s -X POST http://18.222.197.227:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@dinamiz.com","password":"admin123"}' \
  -c - | grep token | awk '{print $7}')

curl http://18.222.197.227:3000/api/tareas -H "Cookie: token=$TOKEN"

# Ver errores
pm2 logs dinamiz-tic --err --lines 10
```

## Credenciales
- Admin: admin@dinamiz.com / admin123
- DB: PostgreSQL en Neon

## Dependencies Key
- next
- @prisma/client
- prisma
- jsonwebtoken
- bcryptjs
- lucide-react
- tailwindcss
