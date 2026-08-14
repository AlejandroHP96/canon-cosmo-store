/** Marcas diacríticas sueltas que deja NFD al separarlas de su letra. */
const DIACRITICOS = /[\u0300-\u036f]/g;

/**
 * Deja un texto listo para comparar en una búsqueda: sin tildes y en
 * minúsculas. Así "Fabian" encuentra a "Fabián" y al revés, que es lo que
 * espera quien teclea deprisa o no sabe cómo lo escribió el cliente.
 *
 * NFD separa cada letra de su acento, y el reemplazo borra los acentos ya
 * sueltos. Ojo: esto convierte también la eñe en ene, así que "canon"
 * encuentra "Cañón". Para buscar es lo deseable; no lo uses para guardar
 * ni para mostrar.
 */
export function normalizarBusqueda(texto: string): string {
    return texto.normalize('NFD').replace(DIACRITICOS, '').toLowerCase();
}
