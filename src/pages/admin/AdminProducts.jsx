import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    api.get('/products?limit=100').then((r) => setProducts(r.data.products)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Fit</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Stock</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || 'https://placehold.co/40x53?text=RMNA'} alt={p.name} className="w-10 h-13 object-cover bg-zinc-100 flex-shrink-0" />
                      <span className="font-medium line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-zinc-600">{p.fitType}</td>
                  <td className="px-4 py-3">
                    {p.discountPrice > 0 ? (
                      <div>
                        <span className="font-semibold">{formatPrice(p.discountPrice)}</span>
                        <span className="text-zinc-400 line-through text-xs ml-1">{formatPrice(p.price)}</span>
                      </div>
                    ) : formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.totalStock === 0 ? 'text-red-500' : p.totalStock <= 10 ? 'text-yellow-600' : 'text-green-600'}>
                      {p.totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/admin/products/${p._id}/edit`} className="p-1.5 hover:bg-zinc-100 rounded text-zinc-600">
                        <FiEdit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 hover:bg-red-50 rounded text-zinc-400 hover:text-red-500">
                        <FiTrash2 size={15} />
                      </button>
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
}
