export const SIZE_GUIDE_TEMPLATES = {
  'mens-shirts': {
    dimensions: ['chest', 'waist', 'length'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    defaultMeasurements: [
      { size: 'S', chest: 91, waist: 81, length: 71 },
      { size: 'M', chest: 97, waist: 86, length: 73 },
      { size: 'L', chest: 102, waist: 91, length: 76 },
      { size: 'XL', chest: 107, waist: 97, length: 78 },
      { size: 'XXL', chest: 112, waist: 102, length: 81 },
    ]
  },
  'womens-jeans': {
    dimensions: ['waist', 'hip', 'length'],
    sizes: ['26', '28', '30', '32', '34', '36'],
    defaultMeasurements: [
      { size: '26', waist: 66, hip: 91, length: 97 },
      { size: '28', waist: 71, hip: 97, length: 99 },
      { size: '30', waist: 76, hip: 102, length: 102 },
      { size: '32', waist: 81, hip: 107, length: 104 },
      { size: '34', waist: 86, hip: 112, length: 107 },
      { size: '36', waist: 91, hip: 117, length: 109 },
    ]
  },
  'girls-kurti': {
    dimensions: ['chest', 'waist', 'length'],
    sizes: ['S', 'M', 'L', 'XL'],
    defaultMeasurements: [
      { size: 'S', chest: 86, waist: 76, length: 91 },
      { size: 'M', chest: 91, waist: 81, length: 94 },
      { size: 'L', chest: 97, waist: 86, length: 97 },
      { size: 'XL', chest: 102, waist: 91, length: 99 },
    ]
  },
  'girls-jeans': {
    dimensions: ['waist', 'hip', 'length'],
    sizes: ['26', '28', '30', '32', '34'],
    defaultMeasurements: [
      { size: '26', waist: 66, hip: 91, length: 97 },
      { size: '28', waist: 71, hip: 97, length: 99 },
      { size: '30', waist: 76, hip: 102, length: 102 },
      { size: '32', waist: 81, hip: 107, length: 104 },
      { size: '34', waist: 86, hip: 112, length: 107 },
    ]
  },
  'womens-accessories': {
    dimensions: [],
    sizes: ['one-size', 'free-size'],
    defaultMeasurements: []
  }
};

export const convertToInches = (cm) => {
  return (cm / 2.54).toFixed(1);
};

export const convertToCm = (inches) => {
  return (inches * 2.54).toFixed(1);
};

export const getSizeGuideForCategory = (category) => {
  return SIZE_GUIDE_TEMPLATES[category] || null;
};
