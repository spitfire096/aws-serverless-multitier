// src/pages/page-sold-items.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { fetchUserProducts } from '../services/apiService';
import './page-sold-items.css';

const SoldItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    const getUserProducts = async () => {
      if (!auth.isAuthenticated) {
        auth.signinRedirect();
        return;
      }

      try {
        // Use Cognito sub as sellerSub
        const sellerSub = auth.user?.profile?.sub;
        if (!sellerSub) {
          throw new Error("Seller information is missing.");
        }

        const data = await fetchUserProducts(sellerSub);
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error fetching your products');
      } finally {
        setLoading(false);
      }
    };

    getUserProducts();
  }, [auth]);

  if (loading) return <div>Loading your products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sold-items-container">
      <h2>My Listings</h2>
      {products.length === 0 ? (
        <p>You have no listings.</p>
      ) : (
        <div className="sold-items-grid">
          {products.map(product => (
            <div key={product.id} className="sold-item-card">
              <img src={product.image_url} alt={product.title} />
              <div className="sold-item-info">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>Status: {product.status}</p>
                {product.status === 'available' && (
                  <button className="edit-button">
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoldItems;
