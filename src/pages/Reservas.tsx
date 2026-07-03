import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getReservableProducts } from '../services/productsService';
import { addReserva } from '../services/reservasService';
import type { Product } from '../types';
import SEO from '../components/SEO';
import ProductImage from '../components/ProductImage';

type FormData = {
    productoId: string;
    productoNombre: string;
    seccion: string;
    cliente: string;
    email: string;
    telefono: string;
    cantidad: number;
    notas: string;
};

const EMPTY_FORM: FormData = {
    productoId: '',
    productoNombre: '',
    seccion: '',
    cliente: '',
    email: '',
    telefono: '',
    cantidad: 1,
    notas: '',
};

const Reservas = () => {
    const { t } = useTranslation();
    const [productos, setProductos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState('');
    const [seccionFiltro, setSeccionFiltro] = useState<string | null>(null);

    useEffect(() => {
        getReservableProducts()
            .then(setProductos)
            .catch(() => setError('Error al cargar productos disponibles.'))
            .finally(() => setLoading(false));
    }, []);

    const secciones = useMemo(
        () => [...new Set(productos.map((p) => p.tcg))].sort(),
        [productos],
    );

    const productosFiltrados = useMemo(() => {
        const q = search.trim().toLowerCase();
        return productos.filter((p) => {
            if (seccionFiltro && p.tcg !== seccionFiltro) return false;
            if (!q) return true;
            return (
                p.name.toLowerCase().includes(q) ||
                p.set?.toLowerCase().includes(q) ||
                p.tcg.toLowerCase().includes(q)
            );
        });
    }, [productos, search, seccionFiltro]);

    const setField = <K extends keyof FormData>(
        key: K,
        value: FormData[K],
    ) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleReservarClick = (producto: Product) => {
        setSelectedProduct(producto);
        setForm((prev) => ({
            ...prev,
            productoId: producto.id,
            productoNombre: producto.name,
            seccion: producto.tcg,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.productoId || !form.cliente.trim() || !form.email.trim()) return;
        setSaving(true);
        setError(null);
        try {
            await addReserva({
                productoId: form.productoId,
                productoNombre: form.productoNombre,
                seccion: form.seccion,
                cliente: form.cliente.trim(),
                email: form.email.trim(),
                telefono: form.telefono.trim(),
                cantidad: form.cantidad,
                notas: form.notas.trim(),
            });
            setSuccess(true);
            setForm(EMPTY_FORM);
            setSelectedProduct(null);
        } catch (e) {
            setError(`Error: ${e instanceof Error ? e.message : 'Inténtalo de nuevo.'}`);
        } finally {
            setSaving(false);
        }
    };

    const cancelReserva = () => {
        setSelectedProduct(null);
        setForm(EMPTY_FORM);
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface pt-20 px-6 pb-12">
            <SEO
                title="Reservas"
                description="Reserva tus productos en Cañón Cosmo Store."
                path="/reservas"
            />
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-1">
                        CAÑÓN COSMO STORE
                    </p>
                    <h1 className="font-headline font-bold text-2xl md:text-3xl uppercase tracking-widest text-on-surface">
                        {t('header.reservas')}
                    </h1>
                    <div className="h-px bg-primary/30 mt-4" />
                </div>

                {error && (
                    <div className="flex items-center gap-2 border border-error bg-error-container/20 px-3 py-2.5 mb-6">
                        <span className="material-symbols-outlined text-error text-base shrink-0">error</span>
                        <p className="text-sm font-body text-error flex-1">{error}</p>
                        <button onClick={() => setError(null)} className="text-error/60 hover:text-error shrink-0">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                {!loading && productos.length > 0 && (
                    <div className="mb-6">
                        <div className="relative max-w-xs mb-3">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                                search
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar producto..."
                                className="w-full bg-surface border border-outline-variant/60 pl-9 pr-8 py-2 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            )}
                        </div>
                        {secciones.length > 1 && (
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    onClick={() => setSeccionFiltro(null)}
                                    className={`px-3 py-1.5 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                                        seccionFiltro === null
                                            ? 'border-primary text-primary bg-surface-bright'
                                            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                    }`}>
                                    Todas
                                </button>
                                {secciones.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSeccionFiltro(s)}
                                        className={`px-3 py-1.5 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                                            seccionFiltro === s
                                                ? 'border-primary text-primary bg-surface-bright'
                                                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                        }`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-16">
                        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                            progress_activity
                        </span>
                    </div>
                ) : productos.length === 0 ? (
                    <div className="tactical-frame p-10 text-center text-on-surface-variant font-body text-sm">
                        No hay productos disponibles para reservar por ahora.
                    </div>
                ) : productosFiltrados.length === 0 ? (
                    <div className="tactical-frame p-10 text-center text-on-surface-variant font-body text-sm">
                        Ningún producto coincide con el filtro.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productosFiltrados.map((producto) => (
                            <div
                                key={producto.id}
                                className="tactical-frame p-4 flex flex-col gap-3 hover:bg-surface-bright transition-colors group">
                                <ProductImage src={producto.image} inStock={producto.inStock} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-headline text-primary/60 tracking-widest uppercase truncate">
                                        {producto.set || producto.tcg}
                                    </p>
                                    <p className="text-sm font-headline font-bold text-on-surface uppercase leading-tight mt-0.5">
                                        {producto.name}
                                    </p>
                                    <p className="font-headline text-sm text-primary mt-1">
                                        {producto.price}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleReservarClick(producto)}
                                    className="w-full border border-primary text-primary font-headline text-[10px] uppercase tracking-widest py-2 hover:bg-primary hover:text-surface transition-colors">
                                    Reservar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {(selectedProduct || success) && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    onClick={() => (success ? setSuccess(false) : cancelReserva())}>
                    <div className="tactical-frame p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        {success ? (
                            <div className="text-center py-4">
                                <span className="material-symbols-outlined text-primary text-4xl mb-3">
                                    check_circle
                                </span>
                                <p className="font-headline font-bold text-base uppercase tracking-widest text-on-surface mb-1">
                                    Solicitud enviada
                                </p>
                                <p className="font-body text-sm text-on-surface-variant">
                                    Te contactaremos pronto para confirmar tu reserva.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 border border-primary text-primary font-headline text-xs uppercase tracking-widest px-6 py-2 hover:bg-primary hover:text-surface transition-colors">
                                    Cerrar
                                </button>
                            </div>
                        ) : selectedProduct && (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60">
                                        RESERVAR: {selectedProduct.name.toUpperCase()}
                                    </p>
                                    <button onClick={cancelReserva} className="text-on-surface-variant hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-headline text-[10px] uppercase tracking-widest text-primary/60 mb-1">
                                                Nombre completo *
                                            </label>
                                            <input
                                                required
                                                value={form.cliente}
                                                onChange={(e) => setField('cliente', e.target.value)}
                                                placeholder="Tu nombre"
                                                className="w-full bg-surface border border-outline-variant/60 px-3 py-2 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-headline text-[10px] uppercase tracking-widest text-primary/60 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setField('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                className="w-full bg-surface border border-outline-variant/60 px-3 py-2 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-headline text-[10px] uppercase tracking-widest text-primary/60 mb-1">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={form.telefono}
                                                onChange={(e) => setField('telefono', e.target.value)}
                                                placeholder="+34 600 000 000"
                                                className="w-full bg-surface border border-outline-variant/60 px-3 py-2 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-headline text-[10px] uppercase tracking-widest text-primary/60 mb-1">
                                                Cantidad
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={form.cantidad}
                                                onChange={(e) => setField('cantidad', Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-full bg-surface border border-outline-variant/60 px-3 py-2 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-headline text-[10px] uppercase tracking-widest text-primary/60 mb-1">
                                            Notas
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={form.notas}
                                            onChange={(e) => setField('notas', e.target.value)}
                                            placeholder="Algo que debamos saber..."
                                            className="w-full bg-surface border border-outline-variant/60 px-3 py-2 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors resize-none"
                                        />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-8 py-2.5 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                                            {saving ? 'Enviando...' : 'Solicitar reserva'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservas;
