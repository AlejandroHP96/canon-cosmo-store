import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getReservableProducts } from '../services/productsService';
import { addReserva } from '../services/reservasService';
import type { Product } from '../types';
import SEO from '../components/SEO';
import ErrorBanner from '../components/ErrorBanner';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import ReservaCard from '../components/reservas/ReservaCard';
import ReservaFilters from '../components/reservas/ReservaFilters';
import ReservaSuccess from '../components/reservas/ReservaSuccess';
import ReservaFormModal from '../components/reservas/ReservaFormModal';
import {
    EMPTY_RESERVA_FORM,
    NOMBRE_COMPLETO,
    type ReservaForm,
} from '../components/reservas/reservaForm';
import { filtrarReservables, seccionesDisponibles } from '../components/reservas/reservaQuery';

const Reservas = () => {
    const { t } = useTranslation();
    const [productos, setProductos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorKey, setErrorKey] = useState<string | null>(null);
    const [errorTexto, setErrorTexto] = useState<string | null>(null);
    const [form, setForm] = useState<ReservaForm>(EMPTY_RESERVA_FORM);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState('');
    const [seccionFiltro, setSeccionFiltro] = useState<string | null>(null);

    // Solo la clave: el mensaje se traduce al pintarlo, así cambiar de idioma
    // con un error en pantalla lo actualiza en vez de dejarlo congelado
    useEffect(() => {
        getReservableProducts()
            .then(setProductos)
            .catch(() => setErrorKey('reservas.loadError'))
            .finally(() => setLoading(false));
    }, []);

    const secciones = useMemo(() => seccionesDisponibles(productos), [productos]);

    const productosFiltrados = useMemo(
        () => filtrarReservables(productos, search, seccionFiltro),
        [productos, search, seccionFiltro],
    );

    const cerrarModal = () => {
        setSelectedProduct(null);
        setForm(EMPTY_RESERVA_FORM);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cliente = form.cliente.trim();
        if (!selectedProduct || !NOMBRE_COMPLETO.test(cliente)) return;
        setSaving(true);
        setErrorTexto(null);
        setErrorKey(null);
        try {
            await addReserva({
                productoId: selectedProduct.id,
                productoNombre: selectedProduct.name,
                seccion: selectedProduct.tcg,
                cliente,
                cantidad: form.cantidad,
                notas: form.notas.trim(),
            });
            setSuccess(true);
            cerrarModal();
        } catch (err) {
            setErrorTexto(
                `${t('reservas.submitError')}: ${err instanceof Error ? err.message : t('reservas.retry')}`,
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-surface text-on-surface pb-12">
            <SEO
                title="Reservas"
                description={t('reservas.seo')}
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

                <ErrorBanner
                    message={errorTexto ?? (errorKey && t(errorKey))}
                    onDismiss={() => {
                        setErrorKey(null);
                        setErrorTexto(null);
                    }}
                />

                {!loading && productos.length > 0 && (
                    <ReservaFilters
                        search={search}
                        secciones={secciones}
                        seccionSeleccionada={seccionFiltro}
                        onSearchChange={setSearch}
                        onSeccionChange={setSeccionFiltro}
                    />
                )}

                {loading ? (
                    <Spinner size="lg" className="py-16" />
                ) : productos.length === 0 ? (
                    <div className="tactical-frame p-10 text-center text-on-surface-variant font-body text-sm">
                        {t('reservas.empty')}
                    </div>
                ) : productosFiltrados.length === 0 ? (
                    <div className="tactical-frame p-10 text-center text-on-surface-variant font-body text-sm">
                        {t('reservas.noMatch')}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productosFiltrados.map((producto) => (
                            <ReservaCard
                                key={producto.id}
                                producto={producto}
                                onReservar={() => setSelectedProduct(producto)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {(selectedProduct || success) && (
                <Modal
                    onClose={() => (success ? setSuccess(false) : cerrarModal())}
                    title={
                        success
                            ? t('reservas.success.title')
                            : `${t('reservas.form.heading')}: ${selectedProduct?.name ?? ''}`
                    }
                    disableBackdropClose={saving}>
                    {success ? (
                        <ReservaSuccess onClose={() => setSuccess(false)} />
                    ) : (
                        selectedProduct && (
                            <ReservaFormModal
                                producto={selectedProduct}
                                form={form}
                                saving={saving}
                                onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
                                onSubmit={handleSubmit}
                                onClose={cerrarModal}
                            />
                        )
                    )}
                </Modal>
            )}
        </div>
    );
};

export default Reservas;
