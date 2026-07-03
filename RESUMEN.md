## Proyecto: Cañón Cosmo Store
Tienda online TCG (React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Firebase Firestore/Auth)

## Estado actual del proyecto

### Sistema de Reservas — Implementado

#### 1. Header (`src/components/Header/Header.tsx`)
- Añadido link "Reservas" (`/reservas`) al lado de "Torneos"
- Traducciones: `header.reservas` en `es.json` y `en.json`

#### 2. Routing (`src/App.tsx`)
- Ruta `/reservas` → `Reservas.tsx`
- Ruta `/cosmos-admin/panel` con pestaña "Reservas"

#### 3. Types (`src/types/index.ts`)
- Añadido campo `reservable?: boolean` a `Product`

#### 4. Admin — Formulario de producto (`src/components/admin/ProductFormModal.tsx`)
- Añadido checkbox "Producto reservable" (borde dashed, con subtítulo explicativo)
- Se guarda en el campo `reservable` del producto en Firestore
- `EMPTY_FORM` incluye `reservable: false`

#### 5. Service — Products (`src/services/productsService.ts`)
- Nueva función `getReservableProducts()` que hace query `where('reservable', '==', true)`
- Filtra `visible !== false` y ordena alfabéticamente

#### 6. Página pública (`src/pages/Reservas.tsx`)
- Carga productos de `products` con `reservable === true` mediante `getReservableProducts()`
- Grid de productos con `ProductImage`, nombre, set/tcg, precio y botón "Reservar"
- Al pulsar "Reservar": scroll al formulario con el producto preseleccionado (no se usa modal)
- Formulario: Nombre, Email (req), Teléfono, Cantidad, Notas
- Al enviar: `addReserva()` guarda en colección `reservas` con fecha ISO y estado `pendiente`
- Estados: éxito con mensaje y botón "Nueva reserva", error con detalle del mensaje

#### 7. Service — Reservas (`src/services/reservasService.ts`)
- Colección Firestore: `reservas`
- Tipo `SolicitudReserva`: id, productoId, productoNombre, seccion, cliente, email, telefono, cantidad, notas, fecha (ISO string), estado ('pendiente'|'confirmada'|'cancelada')
- `getReservas()` — ordenado por fecha descendente
- `addReserva(data)` — añade con fecha actual y estado `pendiente`
- `updateReservaEstado(id, estado)` — cambia estado

#### 8. Admin — Gestión de reservas (`src/components/admin/ReservasManager.tsx`)
- Pestaña "Reservas" en AdminPanelPage (icono `event_upcoming`)
- Muestra lista de solicitudes entrantes con: cliente, producto, sección, cantidad, email, teléfono, fecha
- Badge de estado: Pendiente (amarillo), Confirmada (verde), Cancelada (rojo)
- Botones para cambiar estado (ej. si está pendiente, muestra botones "Confirmada" y "Cancelada")

#### 9. Panel Admin (`src/pages/admin/AdminPanelPage.tsx`)
- `AdminView` incluye `'reservas'`
- Tabs incluye `{ id: 'reservas', label: 'Reservas', icon: 'event_upcoming' }`

### Problema conocido — Firestore Rules
El envío del formulario público falla porque las reglas de Firestore bloquearían escrituras sin auth. Se creó `firestore.rules` en la raíz:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservas/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**PENDIENTE**: Desplegar estas reglas en Firebase Console (https://console.firebase.google.com/project/canon-cosmo-store/firestore/rules) o mediante Firebase CLI.

### Datos de Firebase
- Project ID: `canon-cosmo-store`
- Auth está configurado con persistencia de sesión (`browserSessionPersistence`)
- Admin login en `/cosmos-admin`, panel en `/cosmos-admin/panel`

### Archivos a conocer
- `src/components/admin/ProductFormModal.tsx` — checkbox reservable línea ~410
- `src/pages/Reservas.tsx` — página pública con grid + formulario
- `src/components/admin/ReservasManager.tsx` — gestión admin de solicitudes
- `src/services/reservasService.ts` — CRUD colección `reservas`
- `src/services/productsService.ts` — función `getReservableProducts()`
- `firestore.rules` — reglas pendientes de desplegar
