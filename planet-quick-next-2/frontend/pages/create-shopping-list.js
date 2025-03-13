import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RocketAnimation from '../components/RocketAnimation';
import confetti from 'canvas-confetti';
import axios from 'axios';

export default function CreateShoppingListPage({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showManualAddModal, setShowManualAddModal] = useState(false);
  const [manualItem, setManualItem] = useState({ name: '', price: '', description: '' });
  const router = useRouter();

  const STRAPI_API_TOKEN = '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';
  const STRAPI_API_URL = 'http://localhost:1337/api';

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMessage('Please log in to create a shopping list.');
      router.push('/sign-in');
    }
  }, [user, router]);

  useEffect(() => {
    if (searchQuery.length >= 4 && /^[a-zA-Z\s]+$/.test(searchQuery)) {
      handleSearch();
    } else {
      setCategories([]);
      setItems([]);
      setSelectedCategory(null);
    }
  }, [searchQuery]);

  const fetchFromStrapi = async (query, type) => {
    try {
      const params = { 'filters[pqproductname][$containsi]': query };
      if (type === 'items' && selectedCategory) {
        params['filters[variantOf][$eq]'] = selectedCategory.title;
      }

      const response = await axios.get(`${STRAPI_API_URL}/pqproducts`, {
        params,
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      });

      return response.data.data.map(item => ({
        id: item.id,
        title: item.attributes.pqproductname,
        description: item.attributes.description || 'No description available',
        price: item.attributes.pqproductprice || 0,
        image: item.attributes.pqproductimage || '/LogoPlanetQuick.png',
        variantOf: item.attributes.variantOf || null,
      }));
    } catch (error) {
      setErrorMessage(`Error fetching ${type}: ${error.message}`);
      console.error(error);
      return [];
    }
  };

  const handleSearch = async () => {
    setErrorMessage('');
    setSelectedCategory(null);
    setItems([]);

    const itemResults = await fetchFromStrapi(searchQuery, 'items');
    const exactMatch = itemResults.find(item => item.title.toLowerCase() === searchQuery.toLowerCase());
    
    if (exactMatch) {
      setItems([exactMatch]);
      setCategories([]);
    } else {
      const categoryResults = await fetchFromStrapi(searchQuery, 'categories');
      const uniqueCategories = [...new Map(categoryResults.filter(item => !item.variantOf).map(item => [item.title, item])).values()];
      setCategories(uniqueCategories);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    const itemResults = await fetchFromStrapi(category.title, 'items');
    setItems(itemResults);
  };

  const handleItemSelect = (item) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    if (existingItem) {
      setSelectedItems(selectedItems.map(selected =>
        selected.id === item.id ? { ...selected, quantity: selected.quantity + 1 } : selected
      ));
    } else {
      setSelectedItems([...selectedItems, {
        id: item.id,
        name: item.title,
        price: item.price,
        description: item.description,
        image: item.image,
        quantity: 1,
        isManual: false,
      }]);
    }
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

  const handleManualAddSubmit = () => {
    const { name, price, description } = manualItem;
    if (name && price) {
      const newItem = {
        id: Date.now(),
        name,
        price: parseFloat(price) || 0,
        description: description || 'No description',
        image: '/LogoPlanetQuick.png',
        quantity: 1,
        isManual: true,
      };
      setSelectedItems([...selectedItems, newItem]);
      setShowManualAddModal(false);
      setManualItem({ name: '', price: '', description: '' });
    } else {
      setErrorMessage('Please provide at least a name and price.');
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
    const listData = {
      data: {
        pqlistname: `Shopping List ${new Date().toISOString().split('T')[0]}`,
        pqitems: itemsFormatted,
        pqhashtag: `#shopping${Math.floor(Math.random() * 1000)}`,
        pqcoordinator: user.id, // Link the shopping list to the user
      },
    };
    try {
      console.log('📡 Sending shopping list data to Strapi:', JSON.stringify(listData, null, 2));
      const response = await fetch(`${STRAPI_API_URL}/pqshoppinglists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        body: JSON.stringify(listData),
      });
      const responseData = await response.json();
      console.log('Response from Strapi:', JSON.stringify(responseData, null, 2));
      
      if (!response.ok) throw new Error('Failed to create shopping list: ' + JSON.stringify(responseData));
      
      const shoppingListId = responseData.data.id;
      console.log('✅ Shopping List Created with ID:', shoppingListId);

      setShowSuccessModal(true);
      localStorage.setItem('lastCreatedShoppingListId', shoppingListId);
    } catch (error) {
      setErrorMessage('Server error: ' + error.message);
      console.error('Error creating shopping list:', error);
    }
  };

  const triggerCelebration = () => {
    console.log('Triggering celebration'); // Debug log
    const rocket = document.querySelector('.rocket-animation');
    if (rocket) rocket.style.display = 'block';
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      scalar: 1.5,
    });
  };

  const handleRedirect = (destination) => {
    setShowSuccessModal(false);
    triggerCelebration();
    setTimeout(() => {
      console.log('Redirecting to:', destination); // Debug log
      router.push(destination).then(() => {
        console.log('Navigation to', destination, 'completed'); // Debug log
        if (destination === '/') {
          const currentNotifications = parseInt(localStorage.getItem('notificationCount') || '0');
          localStorage.setItem('notificationCount', (currentNotifications + 1).toString());
          localStorage.setItem('notification', 'You have a pending shopping list!');
        }
      }).catch((err) => {
        console.error('Navigation error with router.push:', err);
        console.log('Falling back to window.location for:', destination);
        window.location.href = destination; // Fallback navigation
      });
    }, 1000); // Delay to allow animation to play
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCategories([]);
    setItems([]);
    setSelectedCategory(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(90deg, rgb(192, 36, 37) 0%, rgba(240, 134, 53, 0.04) 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', width: '90%', maxWidth: '1200px', gap: '24px', transform: 'rotateZ(1deg)', transition: '0.3s' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(1deg)')}>
        <div style={{ flex: 2, padding: '40px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
          <div style={{ padding: '48px 32px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transition: '0.3s', minHeight: '600px', transform: 'rotateZ(-2deg)' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
            <h2 style={{ fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: '1.5', margin: '0' }}>Create Shopping List</h2>
            {errorMessage && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'STIX Two Text' }}>{errorMessage}</div>}

            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products (e.g., soda, coke)"
                style={{ padding: '0.5rem', border: '2px solid #191818', borderRadius: '8px', width: '300px', height: '40px', fontFamily: 'STIX Two Text', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  style={{ padding: '0.5rem', border: '2px solid #191818', borderRadius: '8px', background: '#FFFFFF', cursor: 'pointer', fontSize: '16px' }}
                >
                  X
                </button>
              )}
            </div>

            <div style={{ minHeight: '400px', marginTop: '2rem', position: 'relative' }}>
              {categories.length > 0 && !selectedCategory && (
                <section style={{ marginBottom: '40px', marginLeft: '20px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px', color: 'black' }}>Categories</h2>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        style={{
                          width: '250px',
                          padding: '20px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '46px',
                          border: '2px solid #191818',
                          boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontFamily: 'STIX Two Text',
                          transition: '0.3s ease-in-out',
                        }}
                        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                      >
                        <img src={category.image} alt={category.title} style={{ width: '50px', height: '50px', objectFit: 'contain', marginBottom: '10px' }} />
                        <h3 style={{ color: 'black', fontSize: '16px' }}>{category.title}</h3>
                        <p style={{ color: 'black', fontSize: '14px' }}>{category.description.slice(0, 50)}...</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {items.length > 0 && (
                <section style={{ marginBottom: '40px', marginLeft: '20px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px', color: 'black' }}>Items</h2>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemSelect(item)}
                        style={{
                          width: '250px',
                          height: '200px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '46px',
                          border: '2px solid #191818',
                          boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                          padding: '20px',
                          textAlign: 'center',
                          fontFamily: 'STIX Two Text',
                          transition: '0.3s ease-in-out',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                      >
                        <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain', marginBottom: '10px' }} />
                        <h3 style={{ color: 'black', fontSize: '16px' }}>{item.title}</h3>
                        <p style={{ color: 'black', fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>
                        <p style={{ color: 'black', fontSize: '14px' }}>{item.description.slice(0, 50)}...</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => setShowManualAddModal(true)}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '46px',
                  background: '#FFFFFF',
                  color: '#FFAD61',
                  fontWeight: '700',
                  border: '2px solid #FFAD61',
                  cursor: 'pointer',
                  height: '50px',
                  fontFamily: 'STIX Two Text',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                }}
              >
                Add Manually
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '40px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
          <div
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '46px',
              boxShadow: '8px 8px 13px #2b2a2a',
              minHeight: '600px',
              transform: 'rotateZ(-2deg)',
              transition: '0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}
          >
            <h3 style={{ fontSize: '25px', fontFamily: 'STIX Two Text', fontWeight: '600', margin: '0 0 1rem' }}>Shopping List</h3>
            {selectedItems.length > 0 ? (
              <div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedItems.map((item, index) => (
                    <li
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        fontFamily: 'STIX Two Text',
                        border: '2px solid #191818',
                        borderRadius: '46px',
                        padding: '10px',
                        background: '#D4A373',
                        transform: 'rotate(-5deg)',
                        transition: '0.3s ease-in-out',
                        boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(5deg) scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(-5deg)')}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#FFFFFF',
                          padding: '10px',
                          borderRadius: '46px',
                          boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                          transform: 'rotate(2deg)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }} />
                        <div style={{ flex: 1 }}>
                          <span>
                            {item.name} - ${item.price.toFixed(2)}
                            {item.isManual && <span style={{ marginLeft: '5px', fontSize: '14px' }} title="Manually Added">✏️</span>}
                          </span>
                          <p style={{ fontSize: '0.8rem' }}>{item.description}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <button onClick={() => decrementQuantity(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => incrementQuantity(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>+</button>
                          <button onClick={() => removeFromList(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}>🗑️</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '2rem' }}>
                  <p style={{ fontFamily: 'STIX Two Text', fontWeight: '700', marginBottom: '1rem' }}>Grand Total: ${calculateTotal()}</p>
                  <button
                    onClick={handleCreateShoppingList}
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: '46px',
                      background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                      color: '#191818',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      fontFamily: 'STIX Two Text',
                      boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                    }}
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '46px', textAlign: 'center', width: '550px', height: 'auto', position: 'relative', boxShadow: '8px 8px 13px 0px #2b2a2a' }}>
            <button style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'black' }} onClick={() => handleRedirect('/')}>✕</button>
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5 }}>Shopping List Created! 🎉</h2>
            <p style={{ fontFamily: 'STIX Two Text', fontWeight: '700' }}>Grand Total: ${calculateTotal()}</p>
            <ul style={{ listStyle: 'none', padding: '0', margin: '1rem 0' }}>
              {selectedItems.map((item, index) => (
                <li key={item.id} style={{ fontFamily: 'STIX Two Text' }}>{item.name} - ${item.price.toFixed(2)} x {item.quantity}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '46px',
                  background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                  color: '#191818',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => handleRedirect('/create-event')}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
              >
                Create Event
              </button>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid #BF4408',
                  borderRadius: '46px',
                  backgroundColor: '#FFFFFF',
                  color: '#BF4408',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => handleRedirect('/create-group')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBFAF9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                🎟 Invite Guests to Event
              </button>
            </div>
          </div>
        </div>
      )}

      {showManualAddModal && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ padding: '24px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', textAlign: 'center' }}>
              <button onClick={() => setShowManualAddModal(false)} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#191818' }}>✕</button>
              <h2 style={{ fontFamily: 'STIX Two Text', fontWeight: '700', marginBottom: '1rem' }}>Add Item Manually</h2>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Item name"
                  value={manualItem.name}
                  onChange={(e) => setManualItem({ ...manualItem, name: e.target.value })}
                  style={{ padding: '0.5rem', border: '2px solid #191818', borderRadius: '8px', width: '200px', fontFamily: 'STIX Two Text', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="number"
                  placeholder="Price"
                  value={manualItem.price}
                  onChange={(e) => setManualItem({ ...manualItem, price: e.target.value })}
                  style={{ padding: '0.5rem', border: '2px solid #191818', borderRadius: '8px', width: '200px', fontFamily: 'STIX Two Text', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={manualItem.description}
                  onChange={(e) => setManualItem({ ...manualItem, description: e.target.value })}
                  style={{ padding: '0.5rem', border: '2px solid #191818', borderRadius: '8px', width: '200px', fontFamily: 'STIX Two Text', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}
                />
              </div>
              <button
                onClick={handleManualAddSubmit}
                style={{
                  margin: '0.5rem',
                  background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                  color: '#191818',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: 'STIX Two Text',
                  fontWeight: '700',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
              >
                Add Item
              </button>
              <button
                onClick={() => setShowManualAddModal(false)}
                style={{
                  margin: '0.5rem',
                  background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                  color: '#191818',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: 'STIX Two Text',
                  fontWeight: '700',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <RocketAnimation className="rocket-animation" style={{ display: 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3000 }} />
      <style jsx>{`
        @keyframes fadeIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}