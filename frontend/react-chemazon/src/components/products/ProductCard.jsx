import React from 'react'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const {
    title,
    img,
    discount,
    dealType,
    description,
    rating,
    numColors,
    claimedPercent
  } = product

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
      </div>
    </div>
  )
}

export default ProductCard
