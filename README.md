# 🏔️ Sierra Alta — Software Ganadero

Software profesional para administración de fincas ganaderas.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Deploy:** Vercel

---

## Configuración Rápida

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo.
2. Copia el **Project URL** y la **anon public key** desde Settings → API.

### 2. Ejecutar la migración

En el SQL Editor de Supabase, pega y ejecuta el contenido de:

```
supabase/migrations/001_initial_schema.sql
```

Esto crea todas las tablas, índices, RLS policies, triggers y el bucket de storage.

### 3. Variables de entorno

```bash
cp .env.example .env
```

Llena `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con tus valores.

### 4. Instalar y ejecutar

```bash
npm install
npm run dev
```

---

## Deploy en Vercel

1. Conecta tu repositorio en [vercel.com](https://vercel.com).
2. Agrega las variables de entorno en Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático en cada push.

---

## Estructura de Archivos

```
sierra-alta/
├── .env.example                    # Variables de entorno
├── vercel.json                     # Config de deploy
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema completo
├── src/
│   ├── lib/
│   │   └── supabase.js            # Cliente Supabase
│   └── services/
│       ├── auth.js                 # Autenticación
│       └── data.js                 # CRUD de datos
```

## Base de Datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Usuarios (extiende auth.users) |
| `fincas` | Fincas registradas |
| `finca_members` | Usuarios por finca con roles |
| `animales` | Registro de animales |
| `reproducciones` | Historial reproductivo |
| `produccion` | Producción de leche |
| `sanidad` | Vacunas, medicamentos, tratamientos |
| `eventos` | Ventas, nacimientos, muertes |
| `fotografias` | Fotos de animales |
| `lotes` | Grupos de animales |
| `finanzas` | Ingresos y gastos |
| `audit_log` | Historial de cambios |

### Seguridad (RLS)

- Todos los datos están protegidos por Row Level Security.
- Los usuarios solo ven datos de las fincas a las que pertenecen.
- Solo los administradores pueden eliminar registros.
- Cada cambio queda registrado en `audit_log`.

### Roles

| Rol | Permisos |
|-----|----------|
| `admin` | Todo: crear, leer, editar, eliminar |
| `empleado` | Crear, leer, editar |
| `veterinario` | Crear, leer, editar |

---

## Funcionalidades

- Dashboard con indicadores en tiempo real
- Inventario con búsqueda inteligente y filtros
- Ficha individual por animal (datos, reproducción, producción, sanidad, eventos, familia)
- Cálculo automático de fecha de parto y días de gestación
- Registro de producción de leche con gráficos
- Árbol genealógico (padres, crías, hermanos)
- Modo claro y oscuro
- Diseño mobile-first
- Sincronización en tiempo real entre dispositivos
- Auditoría de cambios
