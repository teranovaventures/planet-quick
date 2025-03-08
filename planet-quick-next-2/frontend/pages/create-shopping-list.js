import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateShoppingListPage({ user }) {
  const router = useRouter();
  const [listTitle, setListTitle] = useState('');
  const [items, setItems] = useState([{ itemDescription: '', totalcost: '', quantity: '' }]);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'http://localhost:1337/api/shoppinglists';
  const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || 'YOUR_STRAPI_API_TOKEN';

  useEffect(() => {
    if (!user || !user.id) {
      router.push('/sign-in');
    }
  }, [user, router]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchValue(query);
    if (query.length > 2) {
      const dummy = [
        { name: 'Coke 12 pack', price: '5.99' },
        { name: 'Coke Zero 6 pack', price: '4.49' },
        { name: 'Diet Coke 12 pack', price: '6.49' },
      ];
      const filtered = dummy.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (product) => {
    const newItem = {
      itemDescription: product.name,
      totalcost: product.price,
      quantity: '1',
    };
    setItems((prev) => [...prev, newItem]);
    setSearchValue('');
    setSuggestions([]);
  };

  const handleAddItem = () => {
    setItems([...items, { itemDescription: '', totalcost: '', quantity: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!listTitle || items.some(item => !item.itemDescription || !item.totalcost || !item.quantity)) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const itemsFormatted = items.map((item) => ({
      itemDescription: item.itemDescription,
      totalcost: item.totalcost.trim() === '' ? 0 : parseFloat(item.totalcost),
      quantity: item.quantity.trim() === '' ? 0 : parseInt(item.quantity, 10),
    }));

    const computedTotalCost = itemsFormatted.reduce((acc, curr) => acc + curr.totalcost, 0);

    const listData = {
      data: {
        title: listTitle,
        totalcost: computedTotalCost,
        state: 'pending',
        items: itemsFormatted,
        pqcoordinator: user.id,
      },
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(listData),
      });

      const json = await res.json();
      if (res.ok) {
        console.log('✅ Shopping list created:', json);
        setListTitle('');
        setItems([{ itemDescription: '', totalcost: '', quantity: '' }]);
        setSearchValue('');
        setSuggestions([]);
        router.push('/pending-events');
      } else {
        console.error('🚨 Error creating shopping list:', json);
        setErrorMessage('Failed to create shopping list. Check console for details.');
      }
    } catch (error) {
      console.error('🚨 Error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="create-shoppinglist-container">
      <div className="page-background">
        <div className="createevents-accent2-bg">
          <div className="createevents-accent1-bg">
            <div className="createevents-container2">
              <div className="createevents-content">
                <h2 className="thq-heading-2" style={{ fontFamily: 'STIX Two Text, serif' }}>Create Shopping List</h2>
                <p className="thq-body-large" style={{ fontFamily: 'STIX Two Text, serif' }}>
                  Add items by searching or add them manually below:
                </p>

                {errorMessage && (
                  <div
                    style={{
                      color: 'red',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem',
                      textAlign: 'center',
                      fontFamily: 'STIX Two Text, serif',
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="autocomplete-section">
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Type to search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      marginBottom: '0.5rem',
                    }}
                  />
                  {suggestions.length > 0 && (
                    <div className="suggestions-container">
                      {suggestions.map((product, i) => (
                        <div
                          key={i}
                          className="suggestion-item"
                          onClick={() => handleSelectSuggestion(product)}
                          style={{
                            padding: '8px',
                            cursor: 'pointer',
                            background: '#fff',
                            borderBottom: '1px solid #ddd',
                          }}
                        >
                          {product.name} — ${product.price}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="shoppinglist-form">
                  <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'STIX Two Text, serif' }}>Name Your List</label>
                  <input
                    type="text"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    required
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      width: '100%',
                      marginBottom: '1rem',
                    }}
                  />

                  <h3 className="manual-entry-heading" style={{ fontFamily: 'STIX Two Text, serif', fontSize: '20px', marginBottom: '1rem' }}>Add Items Manually</h3>
                  {items.map((item, index) => (
                    <div key={index} className="single-item" style={{ marginBottom: '1rem' }}>
                      <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'STIX Two Text, serif' }}>Describe Item</label>
                      <input
                        type="text"
                        value={item.itemDescription}
                        onChange={(e) =>
                          handleItemChange(index, 'itemDescription', e.target.value)
                        }
                        required
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '16px',
                          width: '100%',
                          marginBottom: '0.5rem',
                        }}
                      />

                      <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'STIX Two Text, serif' }}>Total Cost</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.totalcost}
                        onChange={(e) =>
                          handleItemChange(index, 'totalcost', e.target.value)
                        }
                        required
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '16px',
                          width: '100%',
                          marginBottom: '0.5rem',
                        }}
                      />

                      <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'STIX Two Text, serif' }}>Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, 'quantity', e.target.value)
                        }
                        required
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '16px',
                          width: '100%',
                          marginBottom: '0.5rem',
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="remove-item-button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'red',
                          cursor: 'pointer',
                          fontSize: '14px',
                          marginTop: '0.5rem',
                        }}
                      >
                        Remove Item
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="add-item-button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1263a1',
                      cursor: 'pointer',
                      fontSize: '16px',
                      textAlign: 'left',
                      padding: 0,
                      marginBottom: '1rem',
                    }}
                  >
                    + Add Another Item
                  </button>

                  <button
                    type="submit"
                    className="thq-button-filled"
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '46px',
                      background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                      color: '#191818',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      width: '150px',
                      alignSelf: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
                  >
                    Create Shopping List
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-shoppinglist-container {
          width: 100%;
          display: flex;
          flex-direction: row;
        }
        .page-background {
          flex: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: cover;
          background-image: url("/dorritos.jpeg");
        }
        .createevents-accent2-bg {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          transition: 0.3s;
          align-items: center;
          border-radius: 46px;
          justify-content: space-between;
          background-color: #F5D1B0;
        }
        .createevents-accent2-bg:hover {
          transform: scale(1.02);
        }
        .createevents-accent1-bg {
          width: 100%;
          display: flex;
          align-items: center;
          border-radius: 46px;
          justify-content: space-between;
          background-color: #FFFFFF;
        }
        .createevents-container2 {
          gap: var(--dl-space-space-threeunits);
          width: 100%;
          display: flex;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
          transition: 0.3s;
          align-items: center;
          padding: var(--dl-space-space-sixunits) var(--dl-space-space-fourunits);
          border-radius: 46px;
        }
        .createevents-container2:hover {
          color: var(--dl-color-theme-neutral-light);
          background-color: var(--dl-color-theme-neutral-dark);
        }
        .createevents-content {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }
        .autocomplete-section {
          position: relative;
          width: 100%;
          margin-bottom: 1rem;
        }
        .search-bar {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          color: #666;
        }
        .suggestions-container {
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }
        .suggestion-item {
          padding: 8px;
          cursor: pointer;
        }
        .suggestion-item:hover {
          background-color: #f2f2f2;
        }
        .shoppinglist-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
          text-align: left;
          width: 100%;
        }
        .manual-entry-heading {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 20px;
          font-weight: bold;
        }
        .single-item {
          margin-bottom: 1rem;
        }
        .add-item-button {
          background: none;
          border: none;
          color: var(--dl-color-theme-primary1);
          cursor: pointer;
          font-size: 16px;
          text-align: left;
          padding: 0;
        }
        .remove-item-button {
          background: none;
          border: none;
          color: red;
          cursor: pointer;
          font-size: 14px;
          margin-top: 0.5rem;
        }
        .thq-button-filled {
          padding: 0.75rem 1.5rem;
          border-radius: 46px;
          background: linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%);
          color: #191818;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
        .thq-button-filled:hover {
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}