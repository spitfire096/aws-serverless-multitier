// ProductListing.jsx
import React, { useEffect, useState } from 'react'
import './ProductListing.css'
import ProductCard from './ProductCard'
import { fetchProducts, buyProduct } from '../../services/apiService'
import { useAuth } from 'react-oidc-context'

const ProductListing = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const auth = useAuth()

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (err) {
        setError(err.message || 'Error fetching products')
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [])

  const handleBuy = async (productId) => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect()
      return
    }

    try {
      await buyProduct(productId)
      // Update the product's status locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, status: 'sold' } : product
        )
      )
      alert('Purchase successful!')
    } catch (err) {
      alert(err.response?.data?.message || 'Error purchasing product')
    }
  }

  if (loading) return <div>Loading products...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="product-listing-container">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onBuy={handleBuy}
        />
      ))}
    </div>
  )
}

export default ProductListing
