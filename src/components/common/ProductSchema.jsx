import { useEffect } from 'react';

export default function ProductSchema({ product }) {
  useEffect(() => {
    if (!product) return;

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images?.map(img => img.url) || [],
      "description": product.description,
      "sku": product._id,
      "brand": {
        "@type": "Brand",
        "name": "RMNA Street"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://rmnastreet.com/products/${product._id}`,
        "priceCurrency": "INR",
        "price": product.discountPrice > 0 ? product.discountPrice : product.price,
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "RMNA Street"
        }
      }
    };

    // Add aggregateRating if reviews exist
    if (product.numReviews > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.numReviews
      };
    }

    // Add reviews if they exist
    if (product.reviews && product.reviews.length > 0) {
      schema.review = product.reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating
        },
        "author": {
          "@type": "Person",
          "name": review.name
        },
        "reviewBody": review.comment
      }));
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'product-schema';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('product-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [product]);

  return null;
}
