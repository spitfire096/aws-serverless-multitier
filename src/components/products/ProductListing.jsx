import React, { useEffect, useState } from 'react'
import './ProductListing.css'
import ProductCard from './ProductCard'
import { fetchProducts, buyProduct } from '../../services/apiService'
import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router-dom'

const ProductListing = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const auth = useAuth()
  const userSub = auth.user?.profile?.sub  

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

  const navigate = useNavigate()

  const handleBuy = async (productId) => {
    if (!userSub) {
      alert("You must be signed in to buy a product.")
      auth.signinRedirect()
      return
    }

    try {
      await buyProduct(productId, userSub)
      // Update status to 'sold' locally
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: 'sold' } : p))
      )
      alert('Purchase successful!')
      navigate('/purchases')
    } catch (err) {
      alert(err.message || 'Error purchasing product')
    }
  }

  if (loading) return <div>Loading products...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="product-listing-container">
      {products.map((product) => (
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
