import { useEffect, useState, useMemo } from 'react';
import { getAllProducts, deleteProducts, updateProduct } from '../../../services/productsService';
import { getSidebarConfig, type NavItem } from '../../../services/navService';
import { useSelection } from '../../../hooks/useSelection';
import type { Product } from '../../../types';
import {
    availableCategories,
    filterProducts,
    menuSectionIds,
    type SectionFilter,
} from './productQuery';
import ProductFilters from './ProductFilters';
import ProductSearchBar from './ProductSearchBar';
import CategoryChips from './CategoryChips';
import ProductSelectionBar from './ProductSelectionBar';
import ProductRow from './ProductRow';
import Pagination from './Pagination';
import ProductFormModal from '../productForm/ProductFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import BulkDeleteModal from './BulkDeleteModal';

const PAGE_SIZE = 25;

const ProductsView = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [navItems, setNavItems] = useState<NavItem[]>([]);

    const [menuIdx, setMenuIdx] = useState<number | null>(null);
    const [sectionId, setSectionId] = useState('all');
    const [search, setSearch] = useState('');
    const [reservableOnly, setReservableOnly] = useState(false);
    const [category, setCategory] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [duplicating, setDuplicating] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const selection = useSelection();

    const refresh = async () => {
        setLoading(true);
        setProducts(await getAllProducts());
        setLoading(false);
    };

    useEffect(() => {
        refresh();
        getSidebarConfig().then((cfg) => setNavItems(cfg.items));
    }, []);

    const selectedMenu = menuIdx !== null ? navItems[menuIdx] : null;

    const section: SectionFilter = useMemo(
        () => (selectedMenu ? { menuSectionIds: menuSectionIds(selectedMenu), sectionId } : null),
        [selectedMenu, sectionId],
    );

    const categories = useMemo(() => availableCategories(products, section), [products, section]);

    const visible = useMemo(
        () => filterProducts(products, { section, search, reservableOnly, category }),
        [products, section, search, reservableOnly, category],
    );

    const totalPages = Math.ceil(visible.length / PAGE_SIZE);
    const paginated = visible.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const visibleIds = visible.map((p) => p.id);

    const handleBulkDelete = async () => {
        setBulkDeleting(true);
        try {
            await deleteProducts([...selection.selected]);
            selection.clear();
            setShowBulkConfirm(false);
            refresh();
        } finally {
            setBulkDeleting(false);
        }
    };

    const openForm = (product: Product | null, isDuplicate = false) => {
        setEditingProduct(product);
        setDuplicating(isDuplicate);
        setShowForm(true);
    };

    return (
        <>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <ProductFilters
                    navItems={navItems}
                    filterMenuIdx={menuIdx}
                    filterSectionId={sectionId}
                    selectedMenu={selectedMenu}
                    onMenuChange={(idx) => {
                        setMenuIdx(idx);
                        setSectionId('all');
                        setCategory(null);
                        setPage(0);
                    }}
                    onSectionChange={(id) => {
                        setSectionId(id);
                        setCategory(null);
                        setPage(0);
                    }}
                />
                <button
                    onClick={() => openForm(null)}
                    className="flex items-center gap-2 border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Nuevo producto
                </button>
            </div>

            <ProductSearchBar
                search={search}
                reservableOnly={reservableOnly}
                onSearchChange={(v) => {
                    setSearch(v);
                    setPage(0);
                }}
                onToggleReservable={() => {
                    setReservableOnly((v) => !v);
                    setPage(0);
                }}
            />

            <CategoryChips
                categories={categories}
                selected={category}
                onSelect={(cat) => {
                    setCategory(cat);
                    setPage(0);
                }}
            />

            <ProductSelectionBar
                visibleCount={visible.length}
                selectedCount={selection.selected.size}
                allSelected={selection.areAllSelected(visibleIds)}
                onToggleAll={() => selection.toggleAll(visibleIds)}
                onClearSelection={selection.clear}
                onBulkDelete={() => setShowBulkConfirm(true)}
            />

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                        progress_activity
                    </span>
                </div>
            ) : visible.length === 0 ? (
                <div className="tactical-frame p-8 text-center text-on-surface-variant font-body text-sm">
                    No hay productos.
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-3">
                        {paginated.map((product) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                isSelected={selection.selected.has(product.id)}
                                onToggleSelect={() => selection.toggle(product.id)}
                                onEdit={() => openForm(product)}
                                onDuplicate={() =>
                                    openForm({ ...product, name: `${product.name} (copia)` }, true)
                                }
                                onDelete={() => setDeleteTarget(product)}
                                onToggleVisible={async () => {
                                    await updateProduct(product.id, {
                                        visible: product.visible === false,
                                    });
                                    refresh();
                                }}
                            />
                        ))}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={visible.length}
                        pageSize={PAGE_SIZE}
                        onChange={setPage}
                    />
                </>
            )}

            {showForm && (
                <ProductFormModal
                    initial={editingProduct}
                    forceCreate={duplicating}
                    onClose={() => setShowForm(false)}
                    onSaved={() => {
                        setShowForm(false);
                        refresh();
                    }}
                    onSavedContinue={() => refresh()}
                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    product={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={() => {
                        selection.remove(deleteTarget.id);
                        setDeleteTarget(null);
                        refresh();
                    }}
                />
            )}

            {showBulkConfirm && (
                <BulkDeleteModal
                    count={selection.selected.size}
                    deleting={bulkDeleting}
                    onClose={() => setShowBulkConfirm(false)}
                    onConfirm={handleBulkDelete}
                />
            )}
        </>
    );
};

export default ProductsView;
