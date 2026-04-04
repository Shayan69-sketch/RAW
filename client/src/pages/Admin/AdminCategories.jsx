import { useGetCategoriesQuery, useDeleteCategoryMutation } from '../../services/categoryApi';
import { toast } from 'react-toastify';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const AdminCategories = () => {
  const { data, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try { await deleteCategory(id).unwrap(); toast.success('Category deleted'); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">Categories</h2>
        <button className="btn btn-primary text-sm py-2" onClick={() => toast.info('Category creation form')}><FiPlus className="mr-1" /> Add</button>
      </div>
      {isLoading ? (
        <div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white" />)}</div>
      ) : (
        <div className="bg-white border border-border">
          {data?.categories?.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-bg-alt">
              <div>
                <p className="font-semibold text-sm">{cat.name}</p>
                <p className="text-xs text-text-muted">/{cat.slug}</p>
              </div>
              <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 text-text-muted hover:text-red-600"><FiTrash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
