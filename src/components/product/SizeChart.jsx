import { convertToInches } from '../../constants/sizeGuides';

export default function SizeChart({ measurements, dimensions, unit = 'cm' }) {
  const formatValue = (value) => {
    if (!value) return '-';
    return unit === 'cm' ? value : convertToInches(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
            {dimensions.includes('chest') && (
              <th className="text-center py-3 px-4 font-semibold text-gray-900">
                Chest ({unit})
              </th>
            )}
            {dimensions.includes('waist') && (
              <th className="text-center py-3 px-4 font-semibold text-gray-900">
                Waist ({unit})
              </th>
            )}
            {dimensions.includes('hip') && (
              <th className="text-center py-3 px-4 font-semibold text-gray-900">
                Hip ({unit})
              </th>
            )}
            {dimensions.includes('length') && (
              <th className="text-center py-3 px-4 font-semibold text-gray-900">
                Length ({unit})
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement, idx) => (
            <tr 
              key={idx} 
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 font-medium text-gray-900">{measurement.size}</td>
              {dimensions.includes('chest') && (
                <td className="text-center py-3 px-4 text-gray-700">
                  {formatValue(measurement.chest)}
                </td>
              )}
              {dimensions.includes('waist') && (
                <td className="text-center py-3 px-4 text-gray-700">
                  {formatValue(measurement.waist)}
                </td>
              )}
              {dimensions.includes('hip') && (
                <td className="text-center py-3 px-4 text-gray-700">
                  {formatValue(measurement.hip)}
                </td>
              )}
              {dimensions.includes('length') && (
                <td className="text-center py-3 px-4 text-gray-700">
                  {formatValue(measurement.length)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
