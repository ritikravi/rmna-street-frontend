export default function ProductFilters({ filters, onChange }) {
  const sizes = ['28', '30', '32', '34', '36', '38'];
  const fits = ['straight', 'baggy', 'slim', 'regular'];

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Fit Type</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="fitType"
              value=""
              checked={!filters.fitType}
              onChange={() => onChange({ fitType: '' })}
              className="accent-zinc-900"
            />
            <span className="text-sm">All</span>
          </label>
          {fits.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="fitType"
                value={f}
                checked={filters.fitType === f}
                onChange={() => onChange({ fitType: f })}
                className="accent-zinc-900"
              />
              <span className="text-sm capitalize">{f}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ size: filters.size === s ? '' : s })}
              className={`w-10 h-10 text-sm border transition-colors ${
                filters.size === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 hover:border-zinc-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Price Range</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="input-field text-sm"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="input-field text-sm"
          />
        </div>
      </div>

      <button
        onClick={() => onChange({ fitType: '', size: '', minPrice: '', maxPrice: '' })}
        className="text-sm text-zinc-500 underline hover:text-zinc-900"
      >
        Clear filters
      </button>
    </aside>
  );
}
