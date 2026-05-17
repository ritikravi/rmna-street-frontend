export default function BrandFilter({ selectedBrands = [], onChange, availableBrands = [] }) {
  const handleToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      onChange(selectedBrands.filter(b => b !== brand));
    } else {
      onChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Brand</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {availableBrands.map((brand) => (
          <label
            key={brand}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleToggle(brand)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
            />
            <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
              {brand}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
