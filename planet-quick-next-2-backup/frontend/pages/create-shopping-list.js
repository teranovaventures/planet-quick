import React, { useState } from 'react'
// Remove: import Navbar from '../components/navbar'

export default function CreateShoppingListPage() {
  // State for the shopping list title
  const [listTitle, setListTitle] = useState('')
  // Items: each with itemDescription, totalcost, and quantity
  const [items, setItems] = useState([{ itemDescription: '', totalcost: '', quantity: '' }])

  // Example state for an autocomplete input
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

  // Strapi endpoint & API key
  const API_URL = 'http://localhost:1337/api/shoppinglists'
  const STRAPI_API_KEY = '4e9b6205a6b8f924b043b6e0a63069a9974e3ea8f33a3e7df211a88dd47373dfdf34eea19d91fe105a6d2a46eb228cb71ad4e84171eb0b393fcbc51f339fb0b37bc63103572d0c03af860efeb820cc5ba6793634b5773b48d86508932d21a7b32576292a60d12cda6f3aa95b9f1cc005a980f6f19242cc74a58b7b26a7f2649fERE'

  // (A) Autocomplete Handling
  const handleSearchChange = async (e) => {
    const query = e.target.value
    setSearchValue(query)
    if (query.length > 2) {
      // Dummy suggestions for illustration
      const dummy = [
        { name: 'Coke 12 pack', price: '5.99' },
        { name: 'Coke Zero 6 pack', price: '4.49' },
        { name: 'Diet Coke 12 pack', price: '6.49' }
      ]
      const filtered = dummy.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (product) => {
    const newItem = {
      itemDescription: product.name,
      totalcost: product.price,
      quantity: '1'
    }
    setItems((prev) => [...prev, newItem])
    // Clear the search
    setSearchValue('')
    setSuggestions([])
  }

  // (B) Items Handling
  const handleAddItem = () => {
    setItems([...items, { itemDescription: '', totalcost: '', quantity: '' }])
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  // (C) Submit to Strapi
  const handleSubmit = async (e) => {
    e.preventDefault()
    const itemsFormatted = items.map((item) => ({
      itemDescription: item.itemDescription,
      totalcost: item.totalcost.trim() === '' ? 0 : parseFloat(item.totalcost),
      quantity: item.quantity.trim() === '' ? 0 : parseInt(item.quantity, 10)
    }))
    const computedTotalCost = itemsFormatted.reduce(
      (acc, curr) => acc + curr.totalcost,
      0
    )
    const listData = {
      data: {
        title: listTitle,
        totalcost: computedTotalCost,
        state: 'pending',
        items: itemsFormatted
      }
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_KEY}`
        },
        body: JSON.stringify(listData)
      })
      const json = await res.json()
      if (res.ok) {
        alert('Shopping list created successfully!')
        console.log('Shopping list response:', json)
        // Reset
        setListTitle('')
        setItems([{ itemDescription: '', totalcost: '', quantity: '' }])
        setSearchValue('')
        setSuggestions([])
      } else {
        console.error('Error creating shopping list:', json)
        alert('Failed to create shopping list. Check console for details.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating shopping list. See console for details.')
    }
  }

  // (D) Render
  return (
    <>
      {/* No <Navbar> here; rely on the global one in _app.js */}
      <div className="create-shoppinglist-container">
        <div className="page-background">
          <div className="createevents-accent2-bg">
            <div className="createevents-accent1-bg">
              <div className="createevents-container2">
                <div className="createevents-content">
                  <h2 className="thq-heading-2">Create Shopping List</h2>
                  <p className="thq-body-large">
                    Add items by searching or add them manually below:
                  </p>

                  {/* (A) Autocomplete search input */}
                  <div className="autocomplete-section">
                    <input
                      type="text"
                      className="search-bar"
                      placeholder="Type to search..."
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                    {suggestions.length > 0 && (
                      <div className="suggestions-container">
                        {suggestions.map((product, i) => (
                          <div
                            key={i}
                            className="suggestion-item"
                            onClick={() => handleSelectSuggestion(product)}
                          >
                            {product.name} — ${product.price}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* The main form */}
                  <form onSubmit={handleSubmit} className="shoppinglist-form">
                    <label>Name Your List</label>
                    <input
                      type="text"
                      value={listTitle}
                      onChange={(e) => setListTitle(e.target.value)}
                      required
                    />

                    <h3 className="manual-entry-heading">Add Items Manually</h3>
                    {items.map((item, index) => (
                      <div key={index} className="single-item">
                        <label>Describe Item</label>
                        <input
                          type="text"
                          value={item.itemDescription}
                          onChange={(e) =>
                            handleItemChange(index, 'itemDescription', e.target.value)
                          }
                          required
                        />

                        <label>Total Cost</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.totalcost}
                          onChange={(e) =>
                            handleItemChange(index, 'totalcost', e.target.value)
                          }
                          required
                        />

                        <label>Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', e.target.value)
                          }
                          required
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="remove-item-button"
                        >
                          Remove Item
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="add-item-button"
                    >
                      + Add Another Item
                    </button>

                    <button type="submit" className="thq-button-filled">
                      Create Shopping List
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-shoppinglist-container {
          width: 100%;
          display: flex;
          flex-direction:row;
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
          border-radius: var(--dl-radius-radius-cardradius);
          justify-content: space-between;
          background-color: var(--dl-color-theme-accent2);
        }
        .createevents-accent2-bg:hover {
          transform: scale(1.02);
        }
        .createevents-accent1-bg {
          width: 100%;
          display: flex;
          align-items: center;
          border-radius: var(--dl-radius-radius-cardradius);
          justify-content: space-between;
          background-color: var(--dl-color-theme-accent1);
        }
        .createevents-container2 {
          gap: var(--dl-space-space-threeunits);
          width: 100%;
          display: flex;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
          transition: 0.3s;
          align-items: center;
          padding: var(--dl-space-space-sixunits) var(--dl-space-space-fourunits);
          border-radius: var(--dl-radius-radius-cardradius);
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
        }
        .search-bar {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: var(--dl-radius-radius-buttonradius);
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
        .shoppinglist-form label {
          font-weight: bold;
        }
        .shoppinglist-form input,
        .shoppinglist-form select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: var(--dl-radius-radius-buttonradius);
          font-size: 16px;
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
          background-color: var(--dl-color-theme-primary1, #c02425);
          color: #fff;
          border: none;
          cursor: pointer;
        }
        .thq-button-filled:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  )
}