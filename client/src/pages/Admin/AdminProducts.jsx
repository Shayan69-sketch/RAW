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
import { FiTrash2, FiEdit, FiPlus, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
  name: '',
  slug: '',
  description: '',
  details: '',
  careInstructions: '',
  category: '',
  gender: 'men',
  sportType: [],
  tags: '',
  basePrice: '',
  salePrice: '',
  isSale: false,
  isFeatured: false,
  isTrending: false,
  isBestSeller: false,
  variants: [emptyVariant()],
});

const ProductModal = ({ product, categories, onClose, onSave, isCreating }) => {
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

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleSportType = (type) => {
    setForm((f) => ({
      ...f,
      sportType: f.sportType.includes(type)
        ? f.sportType.filter((t) => t !== type)
        : [...f.sportType, type],
    }));
  };

  // Variant helpers
  const setVariant = (vi, field, value) => {
    setForm((f) => {
      const variants = [...f.variants];
      variants[vi] = { ...variants[vi], [field]: value };
      return { ...f, variants };
    });
  };

  const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }));

  const removeVariant = (vi) =>
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== vi) }));

  // Size helpers
  const setSize = (vi, si, field, value) => {
    setForm((f) => {
      const variants = [...f.variants];
      const sizes = [...variants[vi].sizes];
      sizes[si] = { ...sizes[si], [field]: value };
      variants[vi] = { ...variants[vi], sizes };
      return { ...f, variants };
    });
  };

  const addSize = (vi) =>
    setForm((f) => {
      const variants = [...f.variants];
      variants[vi] = {
        ...variants[vi],
        sizes: [...variants[vi].sizes, { size: 'M', sku: '', stock: 0 }],
      };
      return { ...f, variants };
    });

  const removeSize = (vi, si) =>
    setForm((f) => {
      const variants = [...f.variants];
      variants[vi] = {
        ...variants[vi],
        sizes: variants[vi].sizes.filter((_, i) => i !== si),
      };
      return { ...f, variants };
    });

  // Image helpers
  const setImage = (vi, ii, field, value) => {
    setForm((f) => {
      const variants = [...f.variants];
      const images = [...variants[vi].images];
      images[ii] = { ...images[ii], [field]: value };
      variants[vi] = { ...variants[vi], images };
      return { ...f, variants };
    });
  };

  const addImage = (vi) =>
    setForm((f) => {
      const variants = [...f.variants];
      variants[vi] = {
        ...variants[vi],
        images: [...variants[vi].images, { url: '', altText: '', isPrimary: false }],
      };
      return { ...f, variants };
    });

  const removeImage = (vi, ii) =>
    setForm((f) => {
      const variants = [...f.variants];
      variants[vi] = {
        ...variants[vi],
        images: variants[vi].images.filter((_, i) => i !== ii),
      };
      return { ...f, variants };
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === 'string'
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : form.tags,
        basePrice: Number(form.basePrice),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      };

      if (isCreating) {
        await createProduct(payload).unwrap();
        toast.success('Product created!');
      } else {
        await updateProduct({ id: product._id, ...payload }).unwrap();
        toast.success('Product updated!');
      }
      onSave();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto p-4">
      <div className="bg-white w-full max-w-4xl my-8 rounded-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold uppercase tracking-wider">
            {isCreating ? 'Add New Product' : 'Edit Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-bg-alt rounded-sm">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Product Name *</label>
                <input className="input w-full" value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Slug *</label>
                <input className="input w-full" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1">Description *</label>
                <textarea className="input w-full h-24 resize-none" value={form.description} onChange={(e) => set('description', e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Details</label>
                <textarea className="input w-full h-20 resize-none" value={form.details} onChange={(e) => set('details', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Care Instructions</label>
                <textarea className="input w-full h-20 resize-none" value={form.careInstructions} onChange={(e) => set('careInstructions', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Category & Classification */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Category *</label>
                <select className="input w-full" value={form.category} onChange={(e) => set('category', e.target.value)} required>
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Gender *</label>
                <select className="input w-full" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Tags (comma separated)</label>
                <input className="input w-full" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="seamless, performance" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold mb-2">Sport Types</label>
              <div className="flex flex-wrap gap-2">
                {SPORT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleSportType(type)}
                    className={`px-3 py-1 text-xs font-semibold border transition-colors ${
                      form.sportType.includes(type)
                        ? 'bg-black text-white border-black'
                        : 'border-border text-text-muted hover:border-black'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Pricing</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Base Price *</label>
                <input type="number" min="0" step="0.01" className="input w-full" value={form.basePrice} onChange={(e) => set('basePrice', e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Sale Price</label>
                <input type="number" min="0" step="0.01" className="input w-full" value={form.salePrice || ''} onChange={(e) => set('salePrice', e.target.value)} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isSale} onChange={(e) => set('isSale', e.target.checked)} className="w-4 h-4" />
                  <span className="text-xs font-semibold">On Sale</span>
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {[['isFeatured', 'Featured'], ['isTrending', 'Trending'], ['isBestSeller', 'Best Seller']].map(([field, label]) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[field]} onChange={(e) => set(field, e.target.checked)} className="w-4 h-4" />
                  <span className="text-xs font-semibold">{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Variants */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Variants</h3>
              <button type="button" onClick={addVariant} className="text-xs font-semibold flex items-center gap-1 hover:underline">
                <FiPlus size={12} /> Add Variant
              </button>
            </div>

            <div className="space-y-6">
              {form.variants.map((variant, vi) => (
                <div key={vi} className="border border-border p-4 rounded-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase">Variant {vi + 1}</span>
                    {form.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(vi)} className="text-red-500 hover:text-red-700">
                        <FiX size={14} />
                      </button>
                    )}
                  </div>

                  {/* Color */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Color Name *</label>
                      <input className="input w-full" value={variant.color} onChange={(e) => setVariant(vi, 'color', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Color Hex *</label>
                      <div className="flex gap-2">
                        <input type="color" className="h-10 w-12 border border-border cursor-pointer" value={variant.colorHex} onChange={(e) => setVariant(vi, 'colorHex', e.target.value)} />
                        <input className="input flex-1" value={variant.colorHex} onChange={(e) => setVariant(vi, 'colorHex', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold">Images</label>
                      <button type="button" onClick={() => addImage(vi)} className="text-xs hover:underline flex items-center gap-1">
                        <FiPlus size={10} /> Add Image
                      </button>
                    </div>
                    <div className="space-y-2">
                      {variant.images.map((img, ii) => (
                        <div key={ii} className="flex gap-2 items-center">
                          <input className="input flex-1 text-xs" placeholder="Image URL" value={img.url} onChange={(e) => setImage(vi, ii, 'url', e.target.value)} />
                          <input className="input w-32 text-xs" placeholder="Alt text" value={img.altText} onChange={(e) => setImage(vi, ii, 'altText', e.target.value)} />
                          <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                            <input type="checkbox" checked={img.isPrimary} onChange={(e) => setImage(vi, ii, 'isPrimary', e.target.checked)} />
                            Primary
                          </label>
                          {variant.images.length > 1 && (
                            <button type="button" onClick={() => removeImage(vi, ii)} className="text-red-500"><FiX size={12} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold">Sizes & Stock</label>
                      <button type="button" onClick={() => addSize(vi)} className="text-xs hover:underline flex items-center gap-1">
                        <FiPlus size={10} /> Add Size
                      </button>
                    </div>
                    <div className="space-y-2">
                      {variant.sizes.map((sz, si) => (
                        <div key={si} className="flex gap-2 items-center">
                          <select className="input w-28 text-xs" value={sz.size} onChange={(e) => setSize(vi, si, 'size', e.target.value)}>
                            {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <input className="input flex-1 text-xs" placeholder="SKU" value={sz.sku} onChange={(e) => setSize(vi, si, 'sku', e.target.value)} />
                          <input type="number" min="0" className="input w-24 text-xs" placeholder="Stock" value={sz.stock} onChange={(e) => setSize(vi, si, 'stock', Number(e.target.value))} />
                          {variant.sizes.length > 1 && (
                            <button type="button" onClick={() => removeSize(vi, si)} className="text-red-500"><FiX size={12} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="btn btn-outline text-sm py-2 px-6">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary text-sm py-2 px-6">
              {loading ? 'Saving...' : isCreating ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProductsQuery({ page, limit: 20 });
  const { data: categoriesData } = useGetCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const categories = categoriesData?.categories || [];

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleModalClose = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const totalPages = data?.pagination?.pages || 1;

  return (
    <div>
      {/* Modal */}
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">
          Products ({data?.pagination?.total || 0})
        </h2>
        <button
          className="btn btn-primary text-sm py-2 flex items-center gap-1"
          onClick={() => setIsCreating(true)}
        >
          <FiPlus size={14} /> Add Product
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white" />)}
        </div>
      ) : (
        <>
          <div className="bg-white border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-alt border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hidden md:table-cell">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hidden md:table-cell">Sold</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((product) => (
                  <tr key={product._id} className="border-b border-border hover:bg-bg-alt">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.variants?.[0]?.images?.[0]?.url || ''}
                          alt=""
                          className="w-10 h-12 object-cover bg-bg-alt"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {product.isSale && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 font-bold">SALE</span>}
                            {product.isFeatured && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 font-bold">FEATURED</span>}
                            {product.isTrending && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 font-bold">TRENDING</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.isSale && product.salePrice ? (
                        <>
                          <span className="text-red-600 font-semibold">{formatPrice(product.salePrice)}</span>{' '}
                          <span className="line-through text-text-muted text-xs">{formatPrice(product.basePrice)}</span>
                        </>
                      ) : formatPrice(product.basePrice)}
                    </td>
                    <td className="px-4 py-3 capitalize hidden md:table-cell">{product.gender}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {product.variants?.reduce((acc, v) => acc + v.sizes?.reduce((a, s) => a + s.stock, 0), 0) || 0}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{product.totalSold}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 hover:bg-blue-50 text-blue-600"
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2 hover:bg-red-50 text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-border hover:bg-bg-alt disabled:opacity-40"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-border hover:bg-bg-alt disabled:opacity-40"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;