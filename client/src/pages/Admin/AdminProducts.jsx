import { useState } from 'react';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
} from '../../services/productApi';
import { useGetCategoriesQuery } from '../../services/categoryApi';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-toastify';
import {
  FiTrash2, FiEdit, FiPlus, FiX, FiChevronLeft,
  FiChevronRight, FiPackage, FiTag, FiDollarSign,
  FiLayers, FiImage, FiCheck
} from 'react-icons/fi';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];
const GENDERS = ['men', 'women', 'unisex'];
const SPORT_TYPES = ['lifting', 'running', 'yoga', 'training', 'everyday'];

const emptyVariant = () => ({
  color: '',
  colorHex: '#000000',
  images: [{ url: '', altText: '', isPrimary: true }],
  sizes: [{ size: 'M', sku: '', stock: 0 }],
});

const emptyProduct = () => ({
  name: '', slug: '', description: '', details: '', careInstructions: '',
  category: '', gender: 'men', sportType: [], tags: '',
  basePrice: '', salePrice: '', isSale: false,
  isFeatured: false, isTrending: false, isBestSeller: false,
  variants: [emptyVariant()],
});

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all ${className}`}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all resize-none ${className}`}
  />
);

const Select = ({ children, className = '', ...props }) => (
  <select
    {...props}
    className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900
      focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all ${className}`}
  >
    {children}
  </select>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2.5 cursor-pointer select-none group">
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-black' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
    <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">{label}</span>
  </label>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
    <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
      <Icon size={13} className="text-white" />
    </div>
    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-800">{title}</h3>
  </div>
);

const ProductModal = ({ product, categories, onClose, onSave, isCreating }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState(() => {
    if (product) {
      return {
        ...product,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        category: product.category?._id || product.category || '',
        sportType: product.sportType || [],
      };
    }
    return emptyProduct();
  });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [createProduct, { isLoading: isCreatingLoading }] = useCreateProductMutation();
  const loading = isUpdating || isCreatingLoading;

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const toggleSportType = (type) => setForm(f => ({
    ...f,
    sportType: f.sportType.includes(type) ? f.sportType.filter(t => t !== type) : [...f.sportType, type],
  }));

  const setVariant = (vi, field, value) => setForm(f => {
    const variants = [...f.variants];
    variants[vi] = { ...variants[vi], [field]: value };
    return { ...f, variants };
  });
  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, emptyVariant()] }));
  const removeVariant = (vi) => setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== vi) }));

  const setSize = (vi, si, field, value) => setForm(f => {
    const variants = [...f.variants];
    const sizes = [...variants[vi].sizes];
    sizes[si] = { ...sizes[si], [field]: value };
    variants[vi] = { ...variants[vi], sizes };
    return { ...f, variants };
  });
  const addSize = (vi) => setForm(f => {
    const variants = [...f.variants];
    variants[vi] = { ...variants[vi], sizes: [...variants[vi].sizes, { size: 'M', sku: '', stock: 0 }] };
    return { ...f, variants };
  });
  const removeSize = (vi, si) => setForm(f => {
    const variants = [...f.variants];
    variants[vi] = { ...variants[vi], sizes: variants[vi].sizes.filter((_, i) => i !== si) };
    return { ...f, variants };
  });

  const setImage = (vi, ii, field, value) => setForm(f => {
    const variants = [...f.variants];
    const images = [...variants[vi].images];
    images[ii] = { ...images[ii], [field]: value };
    variants[vi] = { ...variants[vi], images };
    return { ...f, variants };
  });
  const addImage = (vi) => setForm(f => {
    const variants = [...f.variants];
    variants[vi] = { ...variants[vi], images: [...variants[vi].images, { url: '', altText: '', isPrimary: false }] };
    return { ...f, variants };
  });
  const removeImage = (vi, ii) => setForm(f => {
    const variants = [...f.variants];
    variants[vi] = { ...variants[vi], images: variants[vi].images.filter((_, i) => i !== ii) };
    return { ...f, variants };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
        basePrice: Number(form.basePrice),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      };
      if (isCreating) {
        await createProduct(payload).unwrap();
        toast.success('Product created successfully');
      } else {
        await updateProduct({ id: product._id, ...payload }).unwrap();
        toast.success('Product updated successfully');
      }
      onSave();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save product');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiPackage },
    { id: 'classify', label: 'Classification', icon: FiTag },
    { id: 'pricing', label: 'Pricing', icon: FiDollarSign },
    { id: 'variants', label: `Variants (${form.variants.length})`, icon: FiLayers },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isCreating ? 'Add New Product' : 'Edit Product'}
            </h2>
            {!isCreating && <p className="text-xs text-gray-400 mt-0.5">{product?.name}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <FiX size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white shrink-0 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all -mb-px ${
                activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6">

            {activeTab === 'basic' && (
              <div className="space-y-4">
                <SectionHeader icon={FiPackage} title="Product Details" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Product Name" required>
                    <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Apex Seamless T-Shirt" required />
                  </Field>
                  <Field label="URL Slug" required>
                    <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. apex-seamless-tshirt" required />
                  </Field>
                </div>
                <Field label="Description" required>
                  <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Short product description..." required />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Product Details">
                    <Textarea value={form.details} onChange={e => set('details', e.target.value)} rows={4} placeholder="• Bullet point features&#10;• Material info" />
                  </Field>
                  <Field label="Care Instructions">
                    <Textarea value={form.careInstructions} onChange={e => set('careInstructions', e.target.value)} rows={4} placeholder="Machine wash 30°C..." />
                  </Field>
                </div>
              </div>
            )}

            {activeTab === 'classify' && (
              <div className="space-y-5">
                <SectionHeader icon={FiTag} title="Classification" />
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Category" required>
                    <Select value={form.category} onChange={e => set('category', e.target.value)} required>
                      <option value="">Select...</option>
                      {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </Select>
                  </Field>
                  <Field label="Gender" required>
                    <Select value={form.gender} onChange={e => set('gender', e.target.value)}>
                      {GENDERS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                    </Select>
                  </Field>
                  <Field label="Tags">
                    <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="seamless, performance" />
                  </Field>
                </div>
                <Field label="Sport Types">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SPORT_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleSportType(type)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                          form.sportType.includes(type)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {form.sportType.includes(type) && <FiCheck size={10} />}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <SectionHeader icon={FiDollarSign} title="Pricing & Visibility" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Base Price" required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <Input type="number" min="0" step="0.01" value={form.basePrice} onChange={e => set('basePrice', e.target.value)} className="pl-7" placeholder="0.00" required />
                    </div>
                  </Field>
                  <Field label="Sale Price">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <Input type="number" min="0" step="0.01" value={form.salePrice || ''} onChange={e => set('salePrice', e.target.value)} className="pl-7" placeholder="0.00" />
                    </div>
                  </Field>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Visibility Flags</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Toggle checked={form.isSale} onChange={v => set('isSale', v)} label="On Sale" />
                    <Toggle checked={form.isFeatured} onChange={v => set('isFeatured', v)} label="Featured" />
                    <Toggle checked={form.isTrending} onChange={v => set('isTrending', v)} label="Trending" />
                    <Toggle checked={form.isBestSeller} onChange={v => set('isBestSeller', v)} label="Best Seller" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
                      <FiLayers size={13} className="text-white" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-800">Variants</h3>
                  </div>
                  <button type="button" onClick={addVariant} className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                    <FiPlus size={11} /> Add Variant
                  </button>
                </div>

                {form.variants.map((variant, vi) => (
                  <div key={vi} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: variant.colorHex }} />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                          Variant {vi + 1}{variant.color ? ` — ${variant.color}` : ''}
                        </span>
                      </div>
                      {form.variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(vi)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 text-red-500 transition-colors">
                          <FiX size={12} />
                        </button>
                      )}
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Color Name">
                          <Input value={variant.color} onChange={e => setVariant(vi, 'color', e.target.value)} placeholder="e.g. Midnight Black" />
                        </Field>
                        <Field label="Color">
                          <div className="flex gap-2">
                            <input type="color" value={variant.colorHex} onChange={e => setVariant(vi, 'colorHex', e.target.value)} className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-gray-50" />
                            <Input value={variant.colorHex} onChange={e => setVariant(vi, 'colorHex', e.target.value)} placeholder="#000000" />
                          </div>
                        </Field>
                      </div>

                      {/* Images */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                            <FiImage size={10} /> Images
                          </label>
                          <button type="button" onClick={() => addImage(vi)} className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                            <FiPlus size={10} /> Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {variant.images.map((img, ii) => (
                            <div key={ii} className="flex gap-2 items-center bg-gray-50 rounded-lg p-2">
                              {img.url && (
                                <img src={img.url} alt="" className="w-8 h-10 object-cover rounded shrink-0 border border-gray-200" onError={e => e.target.style.display = 'none'} />
                              )}
                              <Input value={img.url} onChange={e => setImage(vi, ii, 'url', e.target.value)} placeholder="https://..." className="flex-1 text-xs bg-white" />
                              <Input value={img.altText} onChange={e => setImage(vi, ii, 'altText', e.target.value)} placeholder="Alt text" className="w-28 text-xs bg-white" />
                              <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap cursor-pointer">
                                <input type="checkbox" checked={img.isPrimary} onChange={e => setImage(vi, ii, 'isPrimary', e.target.checked)} className="rounded" />
                                Primary
                              </label>
                              {variant.images.length > 1 && (
                                <button type="button" onClick={() => removeImage(vi, ii)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 text-red-400 transition-colors shrink-0">
                                  <FiX size={10} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sizes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Sizes & Stock</label>
                          <button type="button" onClick={() => addSize(vi)} className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                            <FiPlus size={10} /> Add Size
                          </button>
                        </div>
                        <div className="space-y-2">
                          {variant.sizes.map((sz, si) => (
                            <div key={si} className="flex gap-2 items-center bg-gray-50 rounded-lg p-2">
                              <Select value={sz.size} onChange={e => setSize(vi, si, 'size', e.target.value)} className="w-28 text-xs bg-white">
                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                              </Select>
                              <Input value={sz.sku} onChange={e => setSize(vi, si, 'sku', e.target.value)} placeholder="SKU code" className="flex-1 text-xs bg-white" />
                              <div className="relative w-24">
                                <Input type="number" min="0" value={sz.stock} onChange={e => setSize(vi, si, 'stock', Number(e.target.value))} className="text-xs bg-white pr-8" />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">qty</span>
                              </div>
                              {variant.sizes.length > 1 && (
                                <button type="button" onClick={() => removeSize(vi, si)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 text-red-400 transition-colors shrink-0">
                                  <FiX size={10} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white shrink-0">
            <div className="flex gap-1">
              {tabs.map(tab => (
                <div key={tab.id} className={`w-1.5 h-1.5 rounded-full transition-colors ${activeTab === tab.id ? 'bg-black' : 'bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-black border border-gray-200 rounded-xl hover:border-gray-400 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2">
                {loading ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><FiCheck size={14} /> {isCreating ? 'Create Product' : 'Save Changes'}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProductsQuery({ page, limit: 20 });
  const { data: categoriesData } = useGetCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const categories = categoriesData?.categories || [];
  const totalPages = data?.pagination?.pages || 1;

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id).unwrap(); toast.success('Product deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const handleModalClose = () => { setEditingProduct(null); setIsCreating(false); };

  const getBadges = (product) => {
    const badges = [];
    if (product.isSale) badges.push({ label: 'Sale', color: 'bg-red-50 text-red-600 border-red-100' });
    if (product.isFeatured) badges.push({ label: 'Featured', color: 'bg-blue-50 text-blue-600 border-blue-100' });
    if (product.isTrending) badges.push({ label: 'Trending', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' });
    if (product.isBestSeller) badges.push({ label: 'Best Seller', color: 'bg-amber-50 text-amber-600 border-amber-100' });
    return badges;
  };

  const getTotalStock = (product) =>
    product.variants?.reduce((acc, v) => acc + (v.sizes?.reduce((a, s) => a + (s.stock || 0), 0) || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {(editingProduct || isCreating) && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={handleModalClose}
          onSave={handleModalClose}
          isCreating={isCreating}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{data?.pagination?.total || 0} total products</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm"
        >
          <FiPlus size={15} /> Add Product
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 animate-pulse">
              <div className="w-10 h-12 bg-gray-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-48" />
                <div className="h-2 bg-gray-50 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 hidden lg:table-cell">Gender</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 hidden lg:table-cell">Stock</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">Sold</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.products?.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={product.variants?.[0]?.images?.[0]?.url || ''} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate max-w-[200px]">{product.name}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {getBadges(product).map(b => (
                            <span key={b.label} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${b.color}`}>{b.label}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {product.isSale && product.salePrice ? (
                      <div>
                        <span className="font-bold text-sm text-red-600">{formatPrice(product.salePrice)}</span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">{formatPrice(product.basePrice)}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-sm text-gray-900">{formatPrice(product.basePrice)}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs font-medium text-gray-600 capitalize">{product.gender}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTotalStock(product) < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                      {getTotalStock(product)} units
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-600">{product.totalSold?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingProduct(product)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all" title="Edit">
                        <FiEdit size={14} />
                      </button>
                      <button onClick={() => handleDelete(product._id, product.name)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all" title="Delete">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 disabled:opacity-30 transition-all">
                  <FiChevronLeft size={14} />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 disabled:opacity-30 transition-all">
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;