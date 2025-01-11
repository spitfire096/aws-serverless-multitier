// pages/PurchasesPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import Navbar from '../components/navbar/navbar';
import { fetchPurchases } from '../services/apiService';
import './page-purchases.css';

const PurchasesPage = () => {
  const auth = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPurchases = async () => {
      if (!auth.isAuthenticated) {
        // Optionally, redirect to sign-in if not authenticated
        auth.signinRedirect();
        return;
      }

      // Retrieve the actual sub from the OIDC user profile
      const userSub = auth.user?.profile?.sub;
      if (!userSub) {
        // If for some reason there's no sub, handle it (e.g., sign in again).
        console.error("No 'sub' found in OIDC profile.");
        return;
      }

      try {
        // Pass the userSub to fetchPurchases
        const data = await fetchPurchases(userSub);
        setPurchases(data);
      } catch (err) {
        setError(err.message || 'Error fetching purchases');
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [auth]);

  if (loading) return <div>Loading purchases...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="purchases-container">
        <h1>My Purchases</h1>
        {purchases.length === 0 ? (
          <p>You have not purchased any products yet.</p>
        ) : (
          <div className="purchases-list">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="purchase-card">
                <img src={purchase.image_url} alt={purchase.title} />
                <div className="purchase-details">
                  <h3>{purchase.title}</h3>
                  <p>{purchase.description}</p>
                  <p>Price: ${purchase.price}</p>
                  <p>
                    Purchased on:{' '}
                    {new Date(purchase.purchased_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasesPage;
