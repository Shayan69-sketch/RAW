import { useState } from 'react';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../../services/productApi';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-toastify';
import { FiTrash2, FiEdit, FiPlus } from 'react-icons/fi';

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProductsQuery({ page, limit: 20 });
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id).unwrap(); toast.success('Product deleted'); } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">Products ({data?.pagination?.total || 0})</h2>
        <button className="btn btn-primary text-sm py-2" onClick={() => toast.info('Product creation form — implement with a modal or separate page')}>
          <FiPlus className="mr-1" /> Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white" />)}</div>
      ) : (
        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Product</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Price</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hidden md:table-cell">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hidden md:table-cell">Sold</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((product) => (
                <tr key={product._id} className="border-b border-border hover:bg-bg-alt">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.variants?.[0]?.images?.[0]?.url || ''} alt="" className="w-10 h-12 object-cover" />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        {product.isSale && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 font-bold">SALE</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {product.isSale && product.salePrice ? (
                      <><span className="text-red-600 font-semibold">{formatPrice(product.salePrice)}</span> <span className="line-through text-text-muted text-xs">{formatPrice(product.basePrice)}</span></>
                    ) : formatPrice(product.basePrice)}
                  </td>
                  <td className="px-4 py-3 capitalize hidden md:table-cell">{product.gender}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{product.totalSold}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-600"><FiEdit size={14} /></button>
                      <button onClick={() => handleDelete(product._id, product.name)} className="p-2 hover:bg-red-50 text-red-600"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
