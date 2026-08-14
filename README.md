# Cañón Cosmo — Tienda TCG

Tienda online para la venta de productos de Trading Card Games (TCG), Funko Pop y accesorios. Diseño con estética retro/táctica inspirada en los RPGs clásicos.

## Stack

| Tecnología                | Versión |
| ------------------------- | ------- |
| React                     | 19      |
| TypeScript                | 5.9     |
| Vite                      | 8       |
| Tailwind CSS              | 4       |
| Firebase Firestore / Auth | 12      |
| React Router              | 7       |
| i18next                   | es / en |

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
- Easter egg del código Konami

### Panel de administración (`/cosmos-admin`)

Acceso protegido con autenticación Firebase (`browserSessionPersistence`: la sesión
se cierra al cerrar la pestaña). El panel vive en `/cosmos-admin/panel`.

Iniciar sesión no basta: la cuenta necesita el **custom claim `admin`**, que es lo
que exigen las reglas de Firestore. Ver [Reglas de seguridad](#reglas-de-seguridad).

- CRUD completo de productos, con selección múltiple y borrado en lote
- Gestión de categorías por sección
- Editor de la navegación lateral: entradas, subitems, color, imagen y reordenación por drag & drop
- Gestión de torneos
- Bandeja de solicitudes de reserva, con cambio de estado

## Estructura Firestore

| Colección                    | Descripción                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `products`                   | Productos. Campos: `tcg`, `name`, `set`, `price`, `salePrice`, `category`, `description`, `inStock`, `badge`, `badgeColor`, `badgeText`, `image`, `featured`, `visible`, `reservable` |
| `nav_config/sidebar`         | Configuración del sidebar: `{ items: NavItem[] }`                                                                                                                                     |
| `tcg_categories/{sectionId}` | Categorías por sección: `{ categories: string[] }`                                                                                                                                    |
| `torneosJuegos`              | Torneos por juego                                                                                                                                                                     |
| `reservas`                   | Solicitudes de reserva entrantes                                                                                                                                                      |

### Firestore Lite

Los servicios importan de **`firebase/firestore/lite`**, no de `firebase/firestore`.
La app no tiene tiempo real en ningún sitio —cero `onSnapshot`: cada pantalla lee
una vez con `getDoc`/`getDocs` al montarse—, así que el motor de listeners y la
persistencia offline del SDK completo eran 152 kB de más en la carga inicial.

Lite soporta todo lo que se usa, `writeBatch` y `serverTimestamp()` incluidos.
Lo que **no** trae es `onSnapshot` ni caché offline: si algún día hace falta una
vista que se actualice sola, ese fichero vuelve a `firebase/firestore` y el
bundler se encarga del resto. No mezcles los dos imports en el mismo módulo.

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

| Proyecto                | Uso              | De dónde salen las variables |
| ----------------------- | ---------------- | ---------------------------- |
| `canon-cosmo-store-dev` | desarrollo local | `.env.local`                 |
| `canon-cosmo-store`     | producción       | scope _Production_ de Vercel |

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

`VITE_SITE_URL` es opcional: fija el dominio canónico que usan las etiquetas
`canonical` y `og:url`. Si no se define se usa el origen desde el que se sirve
la página, que es lo correcto en local y en los previews. **En producción sí
conviene definirla**, para que un visitante que llegue por la URL de Vercel no
haga que Google indexe ese dominio en vez del bueno.

## Scripts de mantenimiento

Necesitan service account keys en `.keys/` — ver [`.keys/README.md`](.keys/README.md).

| Comando                             | Qué hace                                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `npm run sync:dev-db`               | Copia las colecciones de prod a dev (excluye `reservas`)                                                                        |
| `npm run migrate:price <dev\|prod>` | Migra `price`/`salePrice` de string a number. Dry-run por defecto; añade `-- --apply` para escribir. Hace backup en `.backups/` |
| `npm run admin:claim <dev\|prod>`   | Lista cuentas y su claim `admin`, e informa de si el alta autoservicio está abierta. Sin `--grant`/`--revoke` no escribe nada   |

## Integración continua

`.github/workflows/ci.yml` ejecuta lint, tests y build en cada push a `develop`
o `main` y en cada pull request. Usa `npm ci`, que respeta el lockfile exacto y
falla si se ha desincronizado de `package.json`. El build incluye `tsc -b`, así
que la comprobación de tipos también entra.

## Tests

Vitest en entorno `jsdom`. Los ficheros `*.test.ts` y `*.test.tsx` viven junto al
código que prueban. Firebase no se toca nunca: los servicios se doblan con
`vi.mock`, así que si un test llega a la red es que falta un doble.

| Módulo                                | Qué protege                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| `lib/price.ts`                        | El parseo y formateo de importes, incluido el viaje input → number → input del admin |
| `lib/tcgUtils.ts`                     | La derivación del ID de sección desde la URL, con el mapeo legacy                    |
| `admin/nav/navMutations.ts`           | Que editar el nav conserve los `path` y no mute el estado                            |
| `admin/productForm/productPayload.ts` | Qué campos se guardan, cuáles se omiten y cuáles se borran con `deleteField()`       |
| `admin/productList/productQuery.ts`   | El filtrado del listado: sección, búsqueda, reservables y categoría                  |
| `admin/reservas/reservasQuery.ts`     | El orden y el filtrado de la bandeja de reservas                                     |
| `admin/categories/categoryRules.ts`   | Validación de nombres duplicados y vacíos                                            |
| `components/reservas/reservaQuery.ts` | El filtrado de la página pública de reservas                                         |
| `components/reservas/reservaForm.ts`  | Qué se admite en el campo de cantidad y cómo se recorta al tope                      |

### Componentes

Los `*.test.tsx` prueban flujos completos con `@testing-library/react`, sin montar
el router ni Firebase de verdad.

| Fichero                          | Qué protege                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `pages/Reservas.tsx`             | El alta de reserva de punta a punta: normalización de la cantidad, recorte del nombre, error visible        |
| `pages/admin/AdminLoginPage.tsx` | El mapeo de códigos de Firebase a mensajes, el rechazo de cuentas sin claim y la guarda de `ProtectedRoute` |
| `pages/tcgs/TcgPage.tsx`         | Que una ruta fuera del nav dé 404 en vez de una sección vacía indexable                                     |

El caso del formulario de reserva es el que más justifica el entorno: valida el
nombre con una regla que **debe coincidir con `firestore.rules`**
(`cliente.matches('^\\S+(\\s+\\S+)+$')`). Si alguien toca una de las dos y no la
otra, el cliente rellena el formulario para que Firestore lo rechace al final.

El criterio para añadir un test: que un fallo sea **silencioso** (corrompe datos,
desvincula productos o deja pasar a quien no debe, sin error visible). Las reglas
de Firestore en sí no están cubiertas: eso pide el emulador.

## Reglas de seguridad

`firestore.rules` es la fuente de verdad. Catálogo, navegación y torneos son de
lectura pública y escritura solo para el admin. En `reservas` un anónimo únicamente
puede **crear**, y el documento debe traer exactamente los 8 campos esperados,
con límites de tamaño, `estado` forzado a `'pendiente'` y `fecha == request.time`.
Leer o modificar reservas es solo del admin.

### Quién es admin

Estar autenticado **no** da acceso. La `apiKey` de Firebase viaja en el bundle
público — es normal y no es un fallo, pero implica que, si el alta autoservicio
está abierta en la consola, cualquiera puede crearse una cuenta. Por eso las
reglas no miran `request.auth != null` sino el custom claim `admin`:

```
function isAdmin() {
  return request.auth != null && request.auth.token.admin == true;
}
```

El claim solo se pone desde el Admin SDK, nunca desde el navegador:

```bash
npm run admin:claim prod                        # lista cuentas y quién es admin
npm run admin:claim prod -- --grant a@b.com     # concede
npm run admin:claim prod -- --revoke a@b.com    # retira
npm run admin:claim prod -- --lock-signup       # cierra el alta libre de cuentas
```

El script también informa de por dónde se puede entrar al proyecto: si el alta
autoservicio está abierta y si el acceso anónimo está activo. El alta se cierra
con `--lock-signup`, que mueve `client.permissions.disabledUserSignup` — el
mismo campo que la casilla _Enable create (sign-up)_ de la consola. El acceso
anónimo sí hay que desactivarlo a mano en _Authentication -> Sign-in method_.

El claim viaja dentro del ID token, así que **no surte efecto hasta que la sesión
se renueva**: hay que cerrar sesión en el panel y volver a entrar.

El cliente comprueba el mismo claim (`AuthContext` lo lee con `getIdTokenResult`,
`ProtectedRoute` lo exige y el login rechaza la cuenta sin él), pero eso es solo
comodidad: la barrera real son las reglas.

### Desplegar las reglas

**Concede el claim antes de desplegar**, o te quedas fuera de tu propio panel.

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
│   └── admin/
│       ├── nav/         # Editor de navegación
│       ├── productForm/ # Formulario de producto
│       ├── productList/ # Listado, filtros y paginación
│       ├── categories/  # Categorías por sección
│       ├── juegos/      # Juegos de torneos
│       └── reservas/    # Bandeja de solicitudes
├── contexts/            # AuthProvider y su contexto
├── hooks/               # useSidebarConfig, useSectionSelector, useDragReorder,
│                        # useSelection, useProductFilter, …
├── i18n/                # es.json, en.json
├── lib/
│   ├── firebase.ts
│   ├── price.ts         # toPrice, parsePriceInput, formatPrice
│   └── tcgUtils.ts      # pathToSectionId, slugToTcgId, toSlug
├── pages/
│   ├── Home.tsx, AboutUs.tsx, Torneos.tsx, Reservas.tsx
│   ├── tcgs/TcgPage.tsx # Página dinámica de sección (catch-all)
│   └── admin/           # AdminLoginPage, AdminPanelPage
├── services/            # products, categories, nav, reservas, torneos
└── types/index.ts
```

Cada área tiene su carpeta, y dentro conviven los componentes de vista con
un módulo de lógica pura (`productQuery.ts`, `reservasQuery.ts`,
`navMutations.ts`, `categoryRules.ts`, `productPayload.ts`)
y su fichero de tests al lado. Los componentes que se repetían en varias
áreas viven en la raíz de `components/`.

`public/` solo contiene `_redirects`. Cualquier imagen nueva va en `src/assets/` e
importada, para que el nombre lleve hash y un cambio invalide la caché del navegador.

## Layout y scroll

La tienda pública es un shell fijo: header arriba, footer abajo, sidebar a la
izquierda y un único scroller, el `<main>`. Solo scrollea ese elemento.

Sus alturas salen de dos variables CSS declaradas en `index.css`, `--header-h` y
`--footer-h`. Header y footer **fijan su alto con ellas**, así que no son una
estimación del alto real: son el alto real. Antes cada pieza llevaba su propio
número a ojo (`mt-16`, `100px`, `104px`, `64px`) y ya no cuadraban entre sí — el
sidebar de escritorio se metía por debajo del footer.

El shell usa `dvh`, no `vh`. En móvil `100vh` es el viewport _grande_: incluye la
franja que tapa la barra de direcciones retráctil. Con `vh` el shell medía más
que lo visible, el documento scrolleaba por su cuenta y se sentían **dos
scrolls** superpuestos, el del navegador y el de `<main>`. `dvh` sigue al
viewport visible. El `overscroll-contain` de `<main>` completa el arreglo: evita
que el scroll encadene al documento al llegar a los extremos.

De ahí sale una regla: **ninguna página dentro del Layout debe llevar
`min-h-screen`**. Es un hijo de `100dvh` dentro de un contenedor de
`100dvh - chrome`, así que sobra siempre y obliga a `<main>` a scrollear aunque
la página esté vacía. Tampoco hace falta su propio padding superior: el `p-4
md:p-8` de `<main>` ya lo pone. Las páginas del admin sí usan `min-h-screen`:
van fuera del Layout y scrollean el documento.

En pantallas táctiles los campos de formulario se fuerzan a 16px desde
`index.css`. Safari en iOS amplía la página al enfocar un campo con letra más
pequeña y no la devuelve, y los campos van en `text-sm`. La regla se aplica una
vez a `input`, `textarea` y `select` en lugar de campo a campo, y va **fuera de
`@layer`** a propósito: las utilidades de Tailwind sí van en capa, y lo que no
está en ninguna gana, que es como se impone a `text-sm`.

Los modales se renderizan dentro de `<main>` y se posicionan sobre todo lo
demás. Header y footer están en `z-50`; el fondo de los modales, en `z-60`. Con
el mismo z-index ganaba el footer, por venir después en el DOM, y tapaba la
parte baja del diálogo.

## Configuración del nav

`nav_config/sidebar` lo piden seis sitios del código, y hasta tres coinciden en
la misma navegación. `getSidebarConfig()` lo lee **una vez por sesión**: cachea
en memoria y comparte la petición en vuelo, así montar varios consumidores no
multiplica lecturas de Firestore. También guarda copia en `localStorage`, que es
con lo que `useNavItems` pinta el sidebar antes de que conteste la red.

`getSidebarConfig()` no escribe. Si el documento falta o está en el formato
antiguo (`tcgItems`/`navEntries`) devuelve `DEFAULT_SIDEBAR` y ya está. Antes
esta rama hacía un `setDoc` de los valores por defecto: para un visitante
anónimo las reglas lo rechazaban, pero **si quien cargaba la web estaba
autenticado, la escritura pasaba y le machacaba la configuración real**.

## Modales

`components/Modal.tsx` es la base de todos los diálogos: pone `role="dialog"`,
`aria-modal` y el nombre accesible, atrapa el foco mientras está abierto, cierra
con Escape y devuelve el foco al elemento que lo abrió. Antes cada modal
repetía el fondo y el panel sin nada de eso.

El overlay del código Konami no lo usa a propósito: es decorativo, se cierra con
cualquier tecla y atraparle el foco sería peor.

## Manejo de errores

Una excepción durante el render, si nadie la captura, deja el árbol de React
vacío: pantalla en blanco sin mensaje. `components/ErrorBoundary.tsx` lo evita
en dos niveles:

- En `main.tsx`, envolviendo la app entera. Red de seguridad final.
- En el `<main>` del Layout, envolviendo el `<Outlet />`. Un fallo en una página
  deja en pie header, sidebar y footer, así que se puede navegar a otra sección.

El detalle del error solo se muestra en desarrollo. No captura errores de
`async`/`await`, de manejadores de eventos ni de `setTimeout`: esos no ocurren
durante el render.

## Previsualizaciones al compartir

Los rastreadores de WhatsApp, Discord, Twitter y Telegram **no ejecutan
JavaScript**: leen el HTML que devuelve el servidor y se van. Las etiquetas que
inyecta `react-helmet-async` desde `SEO.tsx` llegan demasiado tarde para ellos.

Por eso `index.html` lleva un juego de etiquetas por defecto, apuntando a la
home. Van marcadas con `data-rh="true"`, que es el atributo de
`react-helmet-async`: al hidratar, Helmet las **sustituye** por las de la ruta
concreta en lugar de añadir duplicados. Así el rastreador ve la tarjeta genérica
y el navegador y Google ven la específica.

El `__SITE_URL__` de esas etiquetas lo resuelve `vite.config.ts` en el build,
a partir de `VITE_SITE_URL` o del dominio de respaldo.

Consecuencia: compartir la URL de una sección concreta muestra la tarjeta
genérica de la tienda, no la de esa sección. Para tarjetas por ruta haría falta
prerenderizar el HTML de cada una en el build.

## Imagen para compartir

`public/og-image.jpg` (1200×630) es la miniatura que usan WhatsApp, Discord,
Twitter y demás al pegar un enlace. Va en `public/` **a propósito**, no en
`src/assets/`: esas plataformas cachean la URL, y el hash que Vite añade a los
assets importados la rompería en cada build.

Se genera a partir de `src/assets/logo.png` centrado sobre el fondo de la marca.
Si cambias el logo, regénerala.
