import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RocketAnimation from '../components/RocketAnimation';

export default function CreateShoppingListPage({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const API_URL = 'http://localhost:1337/api/shoppinglists';
  const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMessage('Please log in to create a shopping list.');
      router.push('/sign-in');
    }
  }, [user, router]);

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    setErrorMessage('');

    try {
      const response = await fetch(`/api/redcircle?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setSuggestions(data.products || data);
      if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Fetch Error:', error.message);
      setSuggestions([{ name: 'Error fetching products', price: 0, image: '/placeholder.png', size: 'N/A', quantity: 1 }]);
      setErrorMessage(`Failed to fetch suggestions: ${error.message}`);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleSelectSuggestion = (product) => {
    // Directly add the selected item to the shopping list
    const existingItem = selectedItems.find(item => item.name === product.name && item.size === product.size);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item =>
        item.name === product.name && item.size === product.size ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
    }
    setSuggestions([]);
    setSearchQuery('');
  };

  const incrementQuantity = (index) => {
    setSelectedItems(selectedItems.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQuantity = (index) => {
    setSelectedItems(selectedItems.map((item, i) =>
      i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeFromList = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleManualAdd = () => {
    const name = prompt('Enter item name:');
    const price = prompt('Enter item price:');
    if (name && price) {
      setSelectedItems([...selectedItems, { name, price: parseFloat(price) || 0, size: 'N/A', image: '/placeholder.png', quantity: 1 }]);
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCreateShoppingList = async () => {
    if (selectedItems.length === 0) {
      setErrorMessage('Please add at least one item.');
      return;
    }

    const itemsFormatted = selectedItems.map(item => ({
      itemDescription: item.name,
      totalcost: item.price,
      quantity: item.quantity,
    }));

    const computedTotalCost = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const listData = {
      data: {
        title: `Shopping List ${new Date().toISOString().split('T')[0]}`,
        totalcost: computedTotalCost,
        state: 'pending',
        items: itemsFormatted,
        pqcoordinator: user?.id || 1,
      },
    };

    try {
      console.log('Sending data to Strapi:', listData);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(listData),
      });

      if (!res.ok) {
        const json = await res.json();
        console.error('Strapi Error Response:', json);
        setErrorMessage(json.error?.message || 'Failed to create shopping list.');
        return;
      }

      const responseData = await res.json();
      console.log('Strapi Success Response:', responseData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Strapi Request Error:', error.message);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  const handleRedirect = (destination) => {
    setShowSuccessModal(false);
    setTimeout(() => {
      if (destination === '/') {
        const currentNotifications = parseInt(localStorage.getItem('notificationCount') || '0');
        localStorage.setItem('notificationCount', (currentNotifications + 1).toString());
        localStorage.setItem('notification', 'You have a pending shopping list!');
      }
      router.push(destination);
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(90deg, rgb(192, 36, 37) 0%, rgba(240, 134, 53, 0.04) 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', width: '90%', maxWidth: '1200px', gap: '20px' }}>
        {/* Left Section (Search and Suggestions) */}
        <div style={{ flex: 2, padding: '40px', backgroundColor: '#F5D1B0', borderRadius: '46px', transition: '0.3s', position: 'relative' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
          <div style={{ padding: '48px 32px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transition: '0.3s', minHeight: '600px' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(0deg)')}>
            <h2 style={{ fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>Create Shopping List</h2>
            {errorMessage && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'STIX Two Text' }}>{errorMessage}</div>}

            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); debouncedFetchSuggestions(e.target.value); }}
                placeholder="Search products (e.g., Coke)"
                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '300px', height: '40px', fontFamily: 'STIX Two Text' }}
              />
              <button
                style={{ padding: '0.5rem 1.5rem', borderRadius: '46px', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', fontWeight: '700', border: 'none', cursor: 'pointer', height: '40px', fontFamily: 'STIX Two Text' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
              >
                Search
              </button>
            </div>

            <div style={{ minHeight: '400px', marginTop: '2rem', position: 'relative' }}>
              {suggestions.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '1rem' }}>
                  {suggestions.map((suggestion, index) => (
                    <div key={index} onClick={() => handleSelectSuggestion(suggestion)} style={{ cursor: 'pointer', textAlign: 'center', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
                      <img src={suggestion.image} alt={suggestion.name} style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                      <p style={{ fontFamily: 'STIX Two Text', margin: '5px 0', fontWeight: '600', fontSize: '0.9rem' }}>{suggestion.name}</p>
                      <p style={{ fontFamily: 'STIX Two Text', color: '#FFAD61', fontSize: '0.9rem' }}>${suggestion.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button
                onClick={handleCreateShoppingList}
                style={{ padding: '0.75rem 2rem', borderRadius: '46px', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', fontWeight: '700', border: 'none', cursor: 'pointer', height: '50px', fontFamily: 'STIX Two Text', width: '200px' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
              >
                Create List
              </button>
              <button
                onClick={handleManualAdd}
                style={{ padding: '0.75rem 2rem', borderRadius: '46px', background: '#FFFFFF', color: '#FFAD61', fontWeight: '700', border: '1px solid #FFAD61', cursor: 'pointer', height: '50px', fontFamily: 'STIX Two Text', width: '200px' }}
              >
                Add Manually
              </button>
            </div>
          </div>
        </div>

        {/* Right Section (Selected Items List) */}
        <div style={{ flex: 1, padding: '40px', backgroundColor: '#F5D1B0', borderRadius: '46px', transition: '0.3s', minHeight: '600px' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
          <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', minHeight: '100%' }}>
            <h3 style={{ fontSize: '25px', fontFamily: 'STIX Two Text', fontWeight: 600, margin: '0 0 1rem' }}>Shopping List</h3>
            {selectedItems.length > 0 ? (
              <div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedItems.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', fontFamily: 'STIX Two Text', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }} />
                      <div style={{ flex: 1 }}>
                        <span>{item.name} ({item.size}) - ${item.price.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button onClick={() => decrementQuantity(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => incrementQuantity(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>+</button>
                        <button onClick={() => removeFromList(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}>🗑️</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '2rem' }}>
                  <p style={{ fontFamily: 'STIX Two Text', fontWeight: '700', marginBottom: '1rem' }}>Grand Total: ${calculateTotal()}</p>
                  <button
                    onClick={handleCreateShoppingList}
                    style={{ padding: '0.75rem 2rem', borderRadius: '46px', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', fontWeight: '700', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'STIX Two Text' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ fontFamily: 'STIX Two Text', color: '#666' }}>No items selected yet.</p>
            )}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'url(/space-background.jpg)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ padding: '24px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', textAlign: 'center' }}>
              <RocketAnimation />
              <button onClick={() => handleRedirect('/')} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'black' }}>✕</button>
              <h2 style={{ fontFamily: 'STIX Two Text', fontWeight: '700', marginBottom: '1rem' }}>Shopping List Created! 🚀</h2>
              <p style={{ fontFamily: 'STIX Two Text', fontWeight: '700' }}>Grand Total: ${calculateTotal()}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                {selectedItems.map((item, index) => (
                  <li key={index} style={{ fontFamily: 'STIX Two Text' }}>{item.name} ({item.size}) - ${item.price.toFixed(2)} x {item.quantity}</li>
                ))}
              </ul>
              <button onClick={() => handleRedirect('/create-group')} style={{ margin: '0.5rem', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', fontFamily: 'STIX Two Text', fontWeight: '700' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}>Create Group</button>
              <button onClick={() => handleRedirect('/')} style={{ margin: '0.5rem', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', fontFamily: 'STIX Two Text', fontWeight: '700' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}