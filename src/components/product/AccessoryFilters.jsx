const SUBCATEGORIES = [
  { value: '', label: 'All' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'nose-rings', label: 'Nose Rings' },
  { value: 'rings', label: 'Rings' },
  { value: 'minimal-jewellery', label: 'Minimal Jewellery' },
];

export default function AccessoryFilters({ filters, onChange }) {
  return (
    <aside className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">Category</h3>
        <div className="space-y-2">
          {SUBCATEGORIES.map((s) => (
            <label key={s.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="subcategory"
                value={s.value}
                checked={filters.subcategory === s.value}
                onChange={() => onChange({ subcategory: s.value })}
                className="accent-zinc-900"
              />
              <span className="text-sm">{s.label}</span>
            </label>
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
        onClick={() => onChange({ subcategory: '', minPrice: '', maxPrice: '' })}
        className="text-sm text-zinc-500 underline hover:text-zinc-900"
      >
        Clear filters
      </button>
    </aside>
  );
}
