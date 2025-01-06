// ProductCard.jsx
import React from 'react'
import './ProductCard.css'

const ProductCard = ({ product, onBuy }) => {
  const {
    title,
    img,
    discount,
    dealType,
    description,
    rating,
    numColors,
    claimedPercent,
    status
  } = product

  const handleBuy = () => {
    onBuy(product.id)
  }

  return (
    <div className="product-card">
      <img src={img} alt={title} />
      <div className="product-info">
        <div className="discount-deal">
          <span className="discount">{discount}</span>
          <span className="deal-type">{dealType}</span>
        </div>
        <h4 className="product-title">{title}</h4>
        <p className="description">{description}</p>
        <div className="rating">
          ★ {rating} | {numColors} colors
        </div>
        <div className="claimed">
          {claimedPercent}% claimed
          <div className="claimed-bar">
            <div
              className="claimed-progress"
              style={{ width: `${claimedPercent}%` }}
            />
          </div>
        </div>
        {status === 'available' && (
          <button className="buy-button" onClick={handleBuy}>
            Buy
          </button>
        )}
        {status === 'sold' && (
          <span className="sold-badge">Sold</span>
        )}
      </div>
    </div>
  )
}

export default ProductCard
