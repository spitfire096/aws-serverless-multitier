import React from 'react'
import './ProductListing.css'
import ProductCard from './ProductCard'

const ProductListing = () => {
  // Create some placeholder product data
  const products = [
    {
      id: 1,
      title: 'Lorem Ipsum Item 1',
      img: 'https://via.placeholder.com/200x200',
      discount: '46% off',
      dealType: 'Limited time deal',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      rating: 4.5,
      numColors: 3,
      claimedPercent: 25
    },
    {
      id: 2,
      title: 'Lorem Ipsum Item 2',
      img: 'https://via.placeholder.com/200x200',
      discount: '51% off',
      dealType: 'Limited time deal',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      rating: 4.0,
      numColors: 2,
      claimedPercent: 40
    },
    // Add as many items as you like
  ]

  return (
    <div className="product-listing-container">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}

export default ProductListing
