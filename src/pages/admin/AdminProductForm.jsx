import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiX, FiUpload, FiArrowLeft } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';

const SIZES = ['28', '30', '32', '34', '36', '38'];
const ACCESSORY_SUBCATEGORIES = ['earrings', 'nose-rings', 'rings', 'minimal-jewellery'];

export default function AdminProductForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Pre-select category if coming from Women section
  const defaultCategory = searchParams.get('category') || 'jeans';

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: defaultCategory, subcategory: '', fitType: 'straight',
    tags: '', isFeatured: false, isActive: true,
  });
  const [sizes, setSizes] = useState(SIZES.map((s) => ({ size: s, stock: 0 })));
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then((r) => {
        const p = r.data.product;
        setForm({
          name: p.name, description: p.description, price: p.price,
          discountPrice: p.discountPrice || '', fitType: p.fitType || 'straight',
          category: p.category || 'jeans', subcategory: p.subcategory || '',
          tags: p.tags?.join(', ') || '', isFeatured: p.isFeatured, isActive: p.isActive,
        });
        setSizes(SIZES.map((s) => {
          const found = p.sizes.find((ps) => ps.size === s);
          return { size: s, stock: found?.stock || 0 };
        }));
        setExistingImages(p.images || []);
      });
    }
  }, [id, isEdit]);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    if (form.category === 'jeans' && !form.fitType) {
      toast.error('Fit type is required for jeans');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
      formData.append('sizes', JSON.stringify(sizes));
      files.forEach((f) => formData.append('images', f));

      if (isEdit) {
        await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created — now visible in store!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (publicId) => {
    try {
      await api.delete(`/products/${id}/image/${encodeURIComponent(publicId)}`);
      setExistingImages((imgs) => imgs.filter((i) => i.public_id !== publicId));
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const displayPrice = form.discountPrice > 0 ? Number(form.discountPrice) : Number(form.price);
  const totalStock = sizes.reduce((a, s) => a + Number(s.stock), 0);

  return (
    <div className="p-8">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
        <FiArrowLeft size={16} /> Back to Products
      </button>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">

          {/* Basic Info */}
          <div className="bg-white border rounded p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Basic Info</h2>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Product Name *"
              required
              className="input-field"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description *"
              required
              rows={4}
              className="input-field resize-none"
            />
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="Tags (comma separated, e.g. denim, casual, streetwear)"
              className="input-field"
            />
          </div>

          {/* Pricing */}
          <div className="bg-white border rounded p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">MRP Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 1499"
                  required
                  min="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Sale Price (₹) — optional</label>
                <input
                  type="number"
                  value={form.discountPrice}
                  onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
                  placeholder="e.g. 1199"
                  min="0"
                  className="input-field"
                />
              </div>
            </div>
            {form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
              <p className="text-green-600 text-sm">
                Discount: {Math.round(((form.price - form.discountPrice) / form.price) * 100)}% off
              </p>
            )}
          </div>

          {/* Category */}
          <div className="bg-white border rounded p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Category</h2>
            <div className="grid grid-cols-2 gap-3">
              {['jeans', 'women-accessories'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: cat, subcategory: '' }))}
                  className={`py-2 text-sm border capitalize transition-colors ${
                    form.category === cat ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'
                  }`}
                >
                  {cat === 'jeans' ? 'Jeans' : 'Women Accessories'}
                </button>
              ))}
            </div>
            {form.category === 'women-accessories' && (
              <div>
                <label className="text-xs text-zinc-500 block mb-2">Subcategory</label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCESSORY_SUBCATEGORIES.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, subcategory: sub }))}
                      className={`py-2 text-sm border capitalize transition-colors ${
                        form.subcategory === sub ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'
                      }`}
                    >
                      {sub.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fit Type — only for jeans */}
          {form.category === 'jeans' && (
            <div className="bg-white border rounded p-5 space-y-4">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Fit Type</h2>
              <div className="grid grid-cols-4 gap-3">
                {['straight', 'baggy', 'slim', 'regular'].map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, fitType: fit }))}
                    className={`py-2 text-sm border capitalize transition-colors ${
                      form.fitType === fit ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes & Stock */}
          <div className="bg-white border rounded p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Sizes & Stock</h2>
              <span className="text-xs text-zinc-400">Total stock: {totalStock}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((s, i) => (
                <div key={s.size} className="flex items-center gap-2 border p-2">
                  <span className="text-sm font-bold w-8 text-center">{s.size}</span>
                  <input
                    type="number"
                    min="0"
                    value={s.stock}
                    onChange={(e) => setSizes((prev) => prev.map((ps, pi) => pi === i ? { ...ps, stock: Number(e.target.value) } : ps))}
                    className="flex-1 text-sm border-0 focus:outline-none text-center"
                    placeholder="0"
                  />
                  <span className="text-xs text-zinc-400">pcs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border rounded p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Product Images</h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {existingImages.map((img) => (
                  <div key={img.public_id} className="relative group">
                    <img src={img.url} alt="" className="w-20 h-24 object-cover bg-zinc-100" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.public_id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 p-8 cursor-pointer hover:border-zinc-900 transition-colors">
              <FiUpload size={24} className="text-zinc-400 mb-2" />
              <span className="text-sm text-zinc-500">Click to upload images (max 5)</span>
              <span className="text-xs text-zinc-400 mt-1">JPG, PNG, WEBP up to 5MB each</span>
              <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
            </label>

            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-20 h-24 object-cover bg-zinc-100" />
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white border rounded p-5">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-500 mb-4">Settings</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="accent-zinc-900 w-4 h-4"
                />
                <span>Featured on homepage</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="accent-zinc-900 w-4 h-4"
                />
                <span>Active (visible in store)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : isEdit ? 'Update Product' : '+ Publish Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline px-6">
              Cancel
            </button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="hidden lg:block">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-500 mb-4">Live Preview</h2>
          <div className="sticky top-8">
            <div className="border rounded overflow-hidden">
              <div className="aspect-[3/4] bg-zinc-100 relative">
                {previews[0] || existingImages[0]?.url ? (
                  <img
                    src={previews[0] || existingImages[0]?.url}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 text-sm">
                    No image
                  </div>
                )}
                {form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5">
                    -{Math.round(((form.price - form.discountPrice) / form.price) * 100)}%
                  </span>
                )}
                {totalStock === 0 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="text-sm font-medium tracking-wider uppercase">Sold Out</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{form.fitType} fit</p>
                <h3 className="text-sm font-medium mt-0.5">{form.name || 'Product Name'}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-sm">
                    {displayPrice ? formatPrice(displayPrice) : '₹0'}
                  </span>
                  {form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                    <span className="text-xs text-zinc-400 line-through">{formatPrice(Number(form.price))}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-zinc-50 border rounded text-xs space-y-1 text-zinc-500">
              <p>✓ Active: <span className={form.isActive ? 'text-green-600 font-medium' : 'text-red-500'}>{form.isActive ? 'Visible in store' : 'Hidden'}</span></p>
              <p>✓ Featured: <span className={form.isFeatured ? 'text-green-600 font-medium' : 'text-zinc-400'}>{form.isFeatured ? 'On homepage' : 'No'}</span></p>
              <p>✓ Total stock: <span className="font-medium text-zinc-700">{totalStock} pcs</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
