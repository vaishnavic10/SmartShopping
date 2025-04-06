import React from 'react'
import './ProductCard.css'

interface ProductCardProps {
  brand: string
  category: string
  subcategory: string
  similarity?: number
  rating?: number
  reason: string
  imageUrl: string
  price: string
}

const ProductCard: React.FC<ProductCardProps> = ({
  brand,
  category,
  subcategory,
  rating,
  reason,
  imageUrl,
  price,
}) => {
  return (
    <div className="product-card">
      <img
  src={imageUrl}
  alt={`${brand} ${subcategory}`}
  style={{ width: '180px', height: '160px', objectFit: 'cover', borderRadius: '10px' }}
/>


      <div className="product-info">
        <h3>{brand}</h3>
        <p>{category} - {subcategory}</p>
        <p className="price">₹{price}</p>
        {rating && <p>⭐ {rating.toFixed(1)}</p>}
        <small>{reason}</small>
      </div>
    </div>
  )
}

export default ProductCard
