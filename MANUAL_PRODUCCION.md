# MANUAL DE PRODUCCIÓN - DINAMIZ TIC

## Infraestructura Completa con Neon + Cloudflare R2 + AWS EC2

---

## ÍNDICE

1. [Arquitectura General](#1-arquitectura-general)
2. [Prerrequisitos](#2-prerrequisitos)
3. [Crear Cuenta en Neon (Base de Datos)](#3-crear-cuenta-en-neon-base-de-datos)
4. [Crear Cuenta en Cloudflare R2 (Archivos)](#4-crear-cuenta-en-cloudflare-r2-archivos)
5. [Crear Instancia EC2 en AWS](#5-crear-instancia-ec2-en-aws)
6. [Configurar Neon en el Proyecto](#6-configurar-neon-en-el-proyecto)
7. [Configurar Cloudflare R2 para Evidencias](#7-configurar-cloudflare-r2-para-evidencias)
8. [Preparar el Servidor EC2](#8-preparar-el-servidor-ec2)
9. [Desplegar la Aplicación](#9-desplegar-la-aplicación)
10. [Configurar Dominio (Opcional)](#10-configurar-dominio-opcional)
11. [Mantenimiento y Monitoreo](#11-mantenimiento-y-monitoreo)

---

## 1. ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET (Usuarios)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS EC2 (Ubuntu 22.04 LTS)                   │
│                   (t2.micro - Free Tier)                       │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐ │
│  │   Next.js (Frontend)│  │   Node.js + Prisma (Backend)     │ │
│  │   Puerto: 80, 443   │  │   Puerto: 3000                   │ │
│  └─────────────────────┘  └──────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌─────────────────────────┐    ┌─────────────────────────────────┐
│   NEON (PostgreSQL)     │    │   CLOUDFLARE R2 (Archivos)     │
│   3 GB Storage FREE      │    │   10 GB Storage + CDN FREE      │
│   Branch: main           │    │   Bucket: evidencias-dinamiz    │
└─────────────────────────┘    └─────────────────────────────────┘
```

---

## 2. PRERREQUISITOS

### 2.1 Cuentas Necesarias (TODAS SIN TARJETA DE CRÉDITO)

| Servicio | URL | Gratuito |
|----------|-----|----------|
| AWS | aws.amazon.com | 12 meses t2.micro |
| Neon | neon.tech | Siempre 3 GB |
| Cloudflare | cloudflare.com | Siempre 10 GB + CDN |

### 2.2 Herramientas Locales

```bash
# Instalar en tu computadora:
# 1. Git
sudo apt-get install git

# 2. Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 4. PM2 (para mantener la app corriendo)
sudo npm install -g pm2
```

---

## 3. CREAR CUENTA EN NEON (BASE DE DATOS)

### Paso 3.1: Registrarse

1. Abre **neon.tech**
2. Click en **"Sign Up"**
3. Elige **"GitHub"** (más rápido) o email
4. Completa tu perfil

### Paso 3.2: Crear Proyecto

1. Click **"Create a project"**
2. Nombre: `dinamiz-tic`
3. Región: **Oregon (us-west-2)** o la más cercana a tu ubicación
4. Click **"Create project"**

### Paso 3.3: Obtener URL de Conexión

1. Una vez creado, click en **"Connection Details"**
2. Selecciona **"Pooled connection"** (recomendado para Serverless)
3. Copia la URL que aparece:

```
postgresql://username:password@ep-xxx.us-west-2.aws.neon.tech/dinamiz-tic?sslmode=require
```

**NOTA:** Guarda esta URL, la necesitarás después. El formato típico es:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### Paso 3.4: Probar Conexión Local (Opcional)

```bash
# Desde tu computadora, instalar cliente PostgreSQL
sudo apt-get install postgresql-client

# Probar conexión
psql "postgresql://tu-usuario:tu-password@ep-xxx.us-west-2.aws.neon.tech/dinamiz-tic?sslmode=require"

# Si conecta, verás: dinami_z_tic=>
```

---

## 4. CREAR CUENTA EN CLOUDFLARE R2 (ARCHIVOS)

### Paso 4.1: Registrarse

1. Ve a **cloudflare.com**
2. Click **"Sign up"**
3. Usa tu email y crea contraseña
4. Verifica tu email

### Paso 4.2: Crear Bucket R2

1. En el dashboard, busca **"R2"** en el menú izquierda
2. Click **"Create bucket"**
3. Nombre: `evidencias-dinamiz-tic` (todo minúsculas, guiones)
4. Click **"Create bucket"**

### Paso 4.3: Configurar Permisos

1. Click en el bucket creado
2. Ve a **"Settings"** → **"Permissions"**
3. Click **"Edit"**
4. En **"Public access"**, selecciona **"Grant public access to this bucket"**
5. Click **"Save changes"**

### Paso 4.4: Obtener Credenciales API

1. Ve a **"Manage API Tokens"** (está en la página principal de R2, arriba)
2. Click **"Create API token"**
3. Configura:
   - **Token name**: `dinamiz-tic`
   - **Permissions**: 
     - Object Read and Write
     - Bucket Read and Write
   - **TTL**: Unlimited
4. Click **"Create API Token"**
5. **IMPORTANTE:** Copia y guarda:
   - `Access Key ID`
   - `Secret Access Key` (solo se muestra UNA vez)

### Paso 4.5: Configurar CORS (Opcional para evidencias)

En el bucket, ve a **Settings** → **CORS Policy** y agrega:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"]
  }
]
```

---

## 5. CREAR INSTANCIA EC2 EN AWS

### Paso 5.1: Iniciar Sesión en AWS

1. Ve a **console.aws.amazon.com**
2. Inicia sesión con tu cuenta

### Paso 5.2: Crear Clave SSH (SI NO LA TIENES)

1. Ve a **Services** → **EC2**
2. En el menú lateral: **Key Pairs**
3. Click **"Create key pair"**
4. Configura:
   - **Name**: `dinamiz-tic-key`
   - **Key pair type**: `RSA`
   - **Private key file format**: `.pem` (para Linux/Mac) o `.ppk` (Windows)
5. Click **"Create key pair"**
6. **DESCARGA** el archivo .pem y guárdalo en lugar seguro
7. En Mac/Linux, dale permisos:
   ```bash
   chmod 400 ~/Downloads/dinamiz-tic-key.pem
   ```

### Paso 5.3: Lanzar Instancia

1. En EC2 Dashboard, click **"Launch Instances"**
2. Configura:

| Campo | Valor |
|-------|-------|
| **Name** | dinamiz-tic-server |
| **Amazon Machine Image (AMI)** | Ubuntu Server 22.04 LTS (Free Tier) |
| **Instance type** | t2.micro (o t3.micro si t2 no disponible) |
| **Key pair** | Select `dinamiz-tic-key` |
| **Network settings** | |
| - VPC | Default |
| - Subnet | Any public subnet |
| - Auto-assign public IP | Enable |
| - Security group | Create new |
| - SSH | My IP |
| - HTTP | Anywhere (0.0.0.0/0) |
| - HTTPS | Anywhere (0.0.0.0/0) |
| - Custom TCP 3000 | Anywhere (0.0.0.0/0) |

3. Click **"Launch Instance"**
4. Espera 2-3 minutos hasta que diga "2/2 checks passed"

### Paso 5.4: Obtener IP Pública

1. En EC2 Dashboard, click en tu instancia
2. Copia la **Public IPv4 address** (ej: `3.234.56.78`)
3. Anota también el **Public IPv4 DNS** (ej: `ec2-3-234-56-78.compute.amazonaws.com`)

---

## 6. CONFIGURAR NEON EN EL PROYECTO

### Paso 6.1: Actualizar .env

Edita el archivo `.env` en tu proyecto:

```env
# NEON DATABASE (reemplaza con tu URL de Neon)
DATABASE_URL="postgresql://username:password@ep-xxx.us-west-2.aws.neon.tech/dinamiz-tic?sslmode=require"

# JWT Secret (genera uno nuevo)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudflare R2
R2_ACCESS_KEY_ID=tu_access_key_id
R2_SECRET_ACCESS_KEY=tu_secret_access_key
R2_BUCKET_NAME=evidencias-dinamiz-tic
R2_ACCOUNT_ID=tu_account_id
R2_PUBLIC_URL=https://pub-xxx.r2.dev  # Ver paso 4.6
```

### Paso 6.6: Obtener R2 Public URL

1. En Cloudflare, ve a tu bucket
2. Settings → Domain
3. Si configuraste un dominio personalizado, usa esa URL
4. Si no, usa el endpoint público que te da Cloudflare

---

## 7. CONFIGURAR CLOUDFLARE R2 PARA EVIDENCIAS

### Paso 7.1: Crear Helper para R2

Crea el archivo `lib/r2.js`:

```javascript
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export async function uploadFile(file, key) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: file.type,
  })
  
  await s3Client.send(command)
  return `${process.env.R2_PUBLIC_URL}/${key}`
}

export async function deleteFile(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  })
  
  await s3Client.send(command)
}

export default s3Client
```

### Paso 7.2: Instalar AWS SDK

```bash
npm install @aws-sdk/client-s3
```

---

## 8. PREPARAR EL SERVIDOR EC2

### Paso 8.1: Conectar al Servidor

```bash
# Reemplaza con tu IP pública
ssh -i ~/Downloads/dinamiz-tic-key.pem ubuntu@3.234.56.78
```

### Paso 8.2: Actualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Paso 8.3: Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node --version  # debe ser v18.x
npm --version
```

### Paso 8.4: Instalar PM2

```bash
sudo npm install -g pm2
```

### Paso 8.5: Instalar Git

```bash
sudo apt-get install -y git
```

### Paso 8.6: Configurar Firewall

```bash
# Permitir SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 3000/tcp
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

### Paso 8.7: Crear Directorio para la App

```bash
sudo mkdir -p /var/www/dinamiz-tic
sudo chown -R $USER:$USER /var/www/dinamiz-tic
cd /var/www/dinamiz-tic
```

---

## 9. DESPLEGAR LA APLICACIÓN

### Opción A: Clonar desde GitHub (Recomendado)

#### Paso 9A.1: Subir Código a GitHub

1. Crea un repositorio en GitHub: `dinamiz-tic`
2. En tu máquina local:
   ```bash
   cd /home/ldelacruz/Dinamiz_Tic
   git init
   git add .
   git commit -m "Production deploy"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/dinamiz-tic.git
   git push -u origin main
   ```

**IMPORTANTE:** Antes de hacer push, asegúrate de que `.env` NO esté en el repositorio (debería estar en `.gitignore`).

#### Paso 9A.2: Clonar en el Servidor

```bash
cd /var/www/dinamiz-tic
git clone https://github.com/tu-usuario/dinamiz-tic.git .
```

#### Paso 9A.3: Configurar Variables de Entorno

```bash
# Crea el archivo .env
nano .env
```

Pega el contenido de tu `.env` local (recuerda usar las URLs de Neon y credenciales de R2):

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-west-2.aws.neon.tech/dinamiz-tic?sslmode=require"
JWT_SECRET=tu-jwt-secret-muy-largo-y-seguro
R2_ACCESS_KEY_ID=tu_access_key_id
R2_SECRET_ACCESS_KEY=tu_secret_access_key
R2_BUCKET_NAME=evidencias-dinamiz-tic
R2_ACCOUNT_ID=tu_account_id
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

Guarda con `Ctrl+O`, Enter, `Ctrl+X`

#### Paso 9A.4: Instalar Dependencias

```bash
npm install
```

#### Paso 9A.5: Generar Prisma Client y Push a BD

```bash
npx prisma generate
npx prisma db push
```

#### Paso 9A.6: Compilar la Aplicación

```bash
npm run build
```

#### Paso 9A.7: Iniciar con PM2

```bash
# Crear archivo ecosystem para PM2
nano ecosystem.config.js
```

Contenido:

```javascript
module.exports = {
  apps: [{
    name: 'dinamiz-tic',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/dinamiz-tic',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Iniciar:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Opción B: Subir Archivos Directamente (Sin GitHub)

```bash
# En tu servidor
cd /var/www/dinamiz-tic

# Si ya tienes los archivos localmente, usa scp desde tu computadora:
# scp -i ~/Downloads/dinamiz-tic-key.pem -r /home/ldelacruz/Dinamiz_Tic/* ubuntu@3.234.56.78:/var/www/dinamiz-tic/

# O zip y transferir:
# (En tu local) zip -r dinamiz-tic.zip . -x "node_modules/*" ".git/*"
# (En servidor) unzip dinamiz-tic.zip

# Luego sigue desde paso 9A.3
```

---

## 10. VERIFICAR FUNCIONAMIENTO

### Paso 10.1: Verificar que la App está Corriendo

```bash
pm2 status
pm2 logs dinamiz-tic
```

### Paso 10.2: Probar desde el Navegador

```
http://3.234.56.78:3000
```

Deberías ver la página de login.

### Paso 10.3: Configurar Nginx como Proxy Inverso (Recomendado)

```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/dinamiz-tic
```

Contenido:

```nginx
server {
    listen 80;
    server_name 3.234.56.78;  # Tu IP o dominio

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar:

```bash
sudo ln -s /etc/nginx/sites-available/dinamiz-tic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Ahora accede con:

```
http://3.234.56.78
```

---

## 11. CONFIGURAR DOMINIO (OPCIONAL)

### Opción A: Usar Subdominio Gratis (Cloudflare)

1. Ve a **cloudflare.com**
2. Añade tu dominio (si tienes uno) o crea un subdomain
3. Crea un registro **CNAME**:
   - Name: `dinamiz` (quedaría `dinamiz.tudominio.com`)
   - Value: `tu-ip-ec2` (ej: `3.234.56.78`)
   - Proxy: **Proxied** (activado)

### Opción B: Configurar SSL/HTTPS

Con Cloudflare, es automático si usas Proxy.

Si usas Nginx local:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

Sigue las instrucciones. Certbot renovará automáticamente.

---

## 12. MANTENIMIENTO Y MONITOREO

### Comandos Útiles PM2

```bash
# Ver logs en tiempo real
pm2 logs dinamiz-tic

# Reiniciar app
pm2 restart dinamiz-tic

# Ver uso de recursos
pm2 monit

# Ver estado
pm2 status
```

### Respaldos

1. **Neon**: Tiene respaldos automáticos. Para restaurar:
   ```bash
   # En Neon console: Branching → Restore
   ```

2. **R2**: Configura Lifecycle rules en Cloudflare para archivar después de X días.

### Actualizar la App

```bash
cd /var/www/dinamiz-tic
git pull  # Si usas GitHub
# O sube archivos nuevos
npm install
npm run build
pm2 restart dinamiz-tic
```

### Monitoreo Básico

```bash
# Ver uso de recursos
free -h
df -h
```

---

## RESUMEN DE COSTOS

| Servicio | Uso | Costo |
|----------|-----|-------|
| AWS EC2 t2.micro | 1 instancia | **$0.00/mes** (12 meses) |
| AWS Data Transfer | ~1 GB/mes | **$0.00/mes** (dentro de free tier) |
| Neon | 3 GB PostgreSQL | **$0.00/mes** |
| Cloudflare R2 | 10 GB + Egress | **$0.00/mes** |
| Cloudflare CDN | SSL + CDN | **$0.00/mes** |
| **TOTAL** | | **$0.00/mes** |

---

## TROUBLESHOOTING

### Error: "Connection refused" en EC2
- Verificar que el security group permita el tráfico
- Verificar que PM2 esté corriendo: `pm2 status`

### Error: "Database connection failed"
- Verificar URL de Neon en `.env`
- Verificar que la base de datos exista en Neon

### Error: "R2 Access Denied"
- Verificar credenciales de R2
- Verificar nombre del bucket
- Verificar permisos del bucket

### Reinstalación Completa

```bash
cd /var/www/dinamiz-tic
pm2 stop all
pm2 delete all
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 start ecosystem.config.js
```

---

**Documento creado para Dinamiz TIC**
**Por: Luis E De La Cruz Fajardo**
**Versión: 1.0**
