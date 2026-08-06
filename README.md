# Cañón Cosmo — Tienda TCG

Tienda online para la venta de productos de Trading Card Games (TCG), Funko Pop y accesorios. Diseño con estética retro/táctica inspirada en los RPGs clásicos.

## Stack

| Tecnología | Versión |
|---|---|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 8 |
| Tailwind CSS | 4 |
| Firebase Firestore / Auth | 12 |
| React Router | 6 |
| i18next | es / en |

## Funcionalidades

### Tienda pública
- Navegación lateral dinámica cargada desde Firestore
- Páginas de sección generadas automáticamente para cualquier entrada del nav (`/tcgs/pokemon`, `/funko-pop`, `/accesorios-tcgs/fundas`, etc.)
- Filtrado de productos por categoría y búsqueda
- Producto destacado con vista ampliada
- Indicador visual de producto agotado (imagen en gris + badge AGOTADO)
- `/torneos` — calendario de torneos por juego
- `/reservas` — reserva de productos marcados como `reservable`, sin necesidad de cuenta
- `/aboutus` — el equipo, en formato carta
- `/gold-saucer` y easter egg del código Konami

### Panel de administración (`/cosmos-admin`)
Acceso protegido con autenticación Firebase (`browserSessionPersistence`: la sesión
se cierra al cerrar la pestaña). El panel vive en `/cosmos-admin/panel`.

- CRUD completo de productos, con selección múltiple y borrado en lote
- Gestión de categorías por sección
- Editor de la navegación lateral: entradas, subitems, color, imagen y reordenación por drag & drop
- Gestión de torneos
- Bandeja de solicitudes de reserva, con cambio de estado

## Estructura Firestore

| Colección | Descripción |
|---|---|
| `products` | Productos. Campos: `tcg`, `name`, `set`, `price`, `salePrice`, `category`, `description`, `inStock`, `badge`, `badgeColor`, `badgeText`, `image`, `featured`, `visible`, `reservable` |
| `nav_config/sidebar` | Configuración del sidebar: `{ items: NavItem[] }` |
| `tcg_categories/{sectionId}` | Categorías por sección: `{ categories: string[] }` |
| `torneosJuegos` | Torneos por juego |
| `reservas` | Solicitudes de reserva entrantes |

`price` y `salePrice` se guardan como **number** (euros). El formateo vive en
`src/lib/price.ts`; la vista nunca imprime el valor crudo. Los documentos antiguos
guardaban strings ya formateados (`"4,99 €"`) y `productsService.toProduct()` sigue
normalizándolos al leer, por si aparece alguno sin migrar.

El campo `tcg` es el ID de sección en Firestore. Se deriva del path de la URL:
- `/tcgs/pokemon` → `pokemon`
- `/tcgs/final-fantasy` → `finalfantasy` (legacy mapping)
- `/funko-pop` → `funko-pop`
- `/accesorios-tcgs/fundas` → `accesorios-tcgs__fundas`

## Entornos

Hay dos proyectos Firebase. **El código no nombra ninguno**: la base de datos la
eligen las variables de entorno, que Vite incrusta en el bundle al construir.

| Proyecto | Uso | De dónde salen las variables |
|---|---|---|
| `canon-cosmo-store-dev` | desarrollo local | `.env.local` |
| `canon-cosmo-store` | producción | scope *Production* de Vercel |

Los datos no viajan entre proyectos solos: `npm run sync:dev-db` copia prod → dev,
y no existe el camino inverso. Lo que crees en el admin de dev hay que recrearlo
en prod.

## Instalación

```bash
npm install          # npm es el gestor; no añadas yarn.lock
npm run dev          # http://localhost:3000
npm run build
npm run lint
npm test             # Vitest, una pasada
npm run test:watch
```

Crea un `.env.local` en la raíz apuntando al proyecto de desarrollo:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Scripts de mantenimiento

Necesitan service account keys en `.keys/` — ver [`.keys/README.md`](.keys/README.md).

| Comando | Qué hace |
|---|---|
| `npm run sync:dev-db` | Copia las colecciones de prod a dev (excluye `reservas`) |
| `npm run migrate:price <dev\|prod>` | Migra `price`/`salePrice` de string a number. Dry-run por defecto; añade `-- --apply` para escribir. Hace backup en `.backups/` |

## Tests

Vitest, en entorno `node`. Solo cubren **funciones puras**: nada de DOM, Firebase ni
navegador, así que la suite entera tarda menos de medio segundo. Los ficheros
`*.test.ts` viven junto al código que prueban.

| Módulo | Qué protege |
|---|---|
| `lib/price.ts` | El parseo y formateo de importes, incluido el viaje input → number → input del admin |
| `lib/tcgUtils.ts` | La derivación del ID de sección desde la URL, con el mapeo legacy |
| `admin/nav/navMutations.ts` | Que editar el nav conserve los `path` y no mute el estado |
| `admin/productForm/productPayload.ts` | Qué campos se guardan, cuáles se omiten y cuáles se borran con `deleteField()` |
| `admin/productList/productQuery.ts` | El filtrado del listado: sección, búsqueda, reservables y categoría |
| `admin/reservas/reservasQuery.ts` | El orden y el filtrado de la bandeja de reservas |
| `admin/categories/categoryRules.ts` | Validación de nombres duplicados y vacíos |
| `components/reservas/reservaQuery.ts` | El filtrado de la página pública de reservas |
| `components/goldSaucer/slotMachine.ts` | La tabla de premios de la tragaperras |

El criterio para añadir un test aquí: que un fallo sea **silencioso** (corrompe datos
o desvincula productos sin error visible). La lógica de render y las reglas de
seguridad no están cubiertas todavía.

## Reglas de seguridad

`firestore.rules` es la fuente de verdad. Catálogo, navegación y torneos son de
lectura pública y escritura solo autenticada. En `reservas` un anónimo únicamente
puede **crear**, y el documento debe traer exactamente los 8 campos esperados,
con límites de tamaño, `estado` forzado a `'pendiente'` y `fecha == request.time`.
Leer o modificar reservas requiere estar autenticado.

Desplegar a cada entorno:

```bash
firebase deploy --only firestore:rules -P dev
firebase deploy --only firestore:rules -P prod
```

## Despliegue

Vercel, con deploy automático desde `main`. `vercel.json` incluye el rewrite que
necesita React Router:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Al cambiar el formato de los datos, **despliega el código antes de migrar**: si no,
la web en producción queda leyendo datos que su versión no sabe interpretar.

## Estructura del proyecto

```
src/
├── assets/              # Imágenes importadas (Vite les añade hash → cache-busting)
├── components/
│   ├── ErrorBanner.tsx  # Aviso de error descartable
│   ├── Spinner.tsx      # Indicador de carga
│   ├── FilterChips.tsx  # Fila de chips excluyentes
│   ├── ProductImage.tsx
│   ├── SEO.tsx
│   ├── Header/          # Header y sprite animado de Cait Sith
│   ├── SideNav/         # Sidebar dinámico desde Firestore
│   ├── Layout/  Footer/
│   ├── home/            # Hero, grid de TCGs, banner de torneos
│   ├── tcg/             # Grid, modal, filtros y PriceTag
│   ├── reservas/        # Tarjeta, filtros y formulario de la página pública
│   ├── aboutUs/         # Cartas del equipo
│   ├── goldSaucer/      # Tragaperras del easter egg
│   └── admin/
│       ├── nav/         # Editor de navegación
│       ├── productForm/ # Formulario de producto
│       ├── productList/ # Listado, filtros y paginación
│       ├── categories/  # Categorías por sección
│       ├── juegos/      # Juegos de torneos
│       └── reservas/    # Bandeja de solicitudes
├── contexts/            # AuthProvider y su contexto
├── hooks/               # useSidebarConfig, useSectionSelector, useDragReorder,
│                        # useSelection, useSecretCode, useProductFilter, …
├── i18n/                # es.json, en.json
├── lib/
│   ├── firebase.ts
│   ├── price.ts         # toPrice, parsePriceInput, formatPrice
│   └── tcgUtils.ts      # pathToSectionId, slugToTcgId, toSlug
├── pages/
│   ├── Home.tsx, AboutUs.tsx, Torneos.tsx, Reservas.tsx, GoldSaucer.tsx
│   ├── tcgs/TcgPage.tsx # Página dinámica de sección (catch-all)
│   └── admin/           # AdminLoginPage, AdminPanelPage
├── services/            # products, categories, nav, reservas, torneos
└── types/index.ts
```

Cada área tiene su carpeta, y dentro conviven los componentes de vista con
un módulo de lógica pura (`productQuery.ts`, `reservasQuery.ts`,
`navMutations.ts`, `categoryRules.ts`, `productPayload.ts`, `slotMachine.ts`)
y su fichero de tests al lado. Los componentes que se repetían en varias
áreas viven en la raíz de `components/`.

`public/` solo contiene `_redirects`. Cualquier imagen nueva va en `src/assets/` e
importada, para que el nombre lleve hash y un cambio invalide la caché del navegador.
