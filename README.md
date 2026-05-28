# Cañón Cosmo — Tienda TCG

Tienda online para la venta de productos de Trading Card Games (TCG), Funko Pop y accesorios. Diseño con estética retro/táctica inspirada en los RPGs clásicos.

## Stack

| Tecnología | Versión |
|---|---|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 8 |
| Tailwind CSS | 4 |
| Firebase Firestore | 12 |
| React Router | 6 |

## Funcionalidades

### Tienda pública
- Navegación lateral dinámica cargada desde Firestore
- Páginas de sección generadas automáticamente para cualquier entrada del nav (`/tcgs/pokemon`, `/funko-pop`, `/accesorios-tcgs/fundas`, etc.)
- Filtrado de productos por categoría
- Producto destacado con vista ampliada
- Indicador visual de producto agotado (imagen en gris + badge AGOTADO)

### Panel de administración (`/cosmos-admin`)
- Acceso protegido con autenticación Firebase
- CRUD completo de productos
- Gestión de categorías por sección
- Editor de navegación lateral (añadir/editar/eliminar entradas y subitems)
- El campo Set/Expansión solo aparece en secciones TCG

## Estructura Firestore

| Colección | Descripción |
|---|---|
| `products` | Productos con campos: `tcg`, `name`, `set`, `price`, `category`, `inStock`, `badge`, `badgeColor`, `image`, `featured` |
| `nav_config/sidebar` | Configuración del sidebar: `{ items: NavItem[] }` |
| `tcg_categories/{sectionId}` | Categorías por sección: `{ categories: string[] }` |

El campo `tcg` es el ID de sección en Firestore. Se deriva del path de la URL:
- `/tcgs/pokemon` → `pokemon`
- `/tcgs/final-fantasy` → `finalfantasy` (legacy mapping)
- `/funko-pop` → `funko-pop`
- `/accesorios-tcgs/fundas` → `accesorios-tcgs__fundas`

## Instalación

```bash
# Instalar dependencias
yarn install

# Arrancar en desarrollo (http://localhost:3000)
yarn dev

# Build de producción
yarn build
```

## Variables de entorno

Crea un fichero `.env.local` en la raíz con las credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Despliegue

El proyecto está configurado para Vercel. El fichero `vercel.json` incluye el rewrite necesario para que React Router funcione en producción:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## Estructura del proyecto

```
src/
├── components/
│   ├── Header/          # Header con nav principal
│   ├── SideNav/         # Sidebar dinámico desde Firestore
│   ├── Layout/          # Layout general (Header + SideNav + main)
│   ├── Footer/
│   ├── ProductImage.tsx # Imagen con soporte de estado agotado
│   └── admin/           # ProtectedRoute
├── contexts/
│   └── AuthContext.tsx  # Autenticación Firebase
├── hooks/
│   ├── useTcgCategories.ts
│   └── useTcgOptions.ts
├── lib/
│   ├── firebase.ts
│   └── tcgUtils.ts      # pathToSectionId, slugToTcgId, toSlug
├── pages/
│   ├── Home.tsx
│   ├── AboutUs.tsx
│   ├── tcgs/TcgPage.tsx # Página dinámica de sección (catch-all)
│   └── admin/
│       ├── AdminLoginPage.tsx
│       └── AdminPanelPage.tsx
├── services/
│   ├── productsService.ts
│   ├── categoriesService.ts
│   └── navService.ts
└── types/
    └── index.ts
```
