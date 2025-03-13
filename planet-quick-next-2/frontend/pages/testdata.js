import { useState } from 'react';

export default function TestDataPage() {
  const [message, setMessage] = useState('Click to populate test data');
  const STRAPI_API_TOKEN = '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';
  const STRAPI_API_URL = 'http://localhost:1337/api';

  const handlePopulate = async () => {
    setMessage('Populating data...');
    const now = new Date();
    const expirationDate = new Date(now.setMonth(now.getMonth() + 1)).toISOString();

    const sampleStores = [
      { pqstorename: 'Walmart', pqstoreaddress: '123 Main St, San Francisco', pqstorelocation: { lat: 37.7749, lng: -122.4194 }, pqplaceid: 'ChIJ_test_walmart' },
      { pqstorename: 'Target', pqstoreaddress: '456 Oak Ave, San Francisco', pqstorelocation: { lat: 37.7849, lng: -122.4094 }, pqplaceid: 'ChIJ_test_target' },
      { pqstorename: 'Safeway', pqstoreaddress: '789 Pine Rd, San Francisco', pqstorelocation: { lat: 37.7949, lng: -122.3994 }, pqplaceid: 'ChIJ_test_safeway' },
      { pqstorename: "Raley's", pqstoreaddress: '101 Cedar Ln, Sacramento', pqstorelocation: { lat: 38.5816, lng: -121.4944 }, pqplaceid: 'ChIJ_test_raleys' },
    ];

    const sampleProducts = [
      { pqproductname: 'Doritos Nacho Cheese', pqproductprice: 3.99, pqproductimage: 'https://via.placeholder.com/200', pqproductavailability: 'In Stock', pqstore_id: 'ChIJ_test_walmart', expirationDate },
      { pqproductname: 'Coke 12 Pack', pqproductprice: 5.98, pqproductimage: 'https://via.placeholder.com/200', pqproductavailability: 'Pick up today', pqstore_id: 'ChIJ_test_target', expirationDate },
      { pqproductname: 'Sprite 12 Pack', pqproductprice: 5.49, pqproductimage: 'https://via.placeholder.com/200', pqproductavailability: 'In Stock', pqstore_id: 'ChIJ_test_safeway', expirationDate },
      { pqproductname: 'Lay’s Classic', pqproductprice: 3.29, pqproductimage: 'https://via.placeholder.com/200', pqproductavailability: 'Pick up today', pqstore_id: 'ChIJ_test_raleys', expirationDate },
    ];

    try {
      // Test Strapi connection
      const testResponse = await fetch(`${STRAPI_API_URL}/pqstores`, { method: 'GET', headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } });
      if (!testResponse.ok) {
        throw new Error(`Strapi connection test failed: ${testResponse.statusText} (Status: ${testResponse.status})`);
      }

      // Add stores
      for (const store of sampleStores) {
        const response = await fetch(`${STRAPI_API_URL}/pqstores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_API_TOKEN}` },
          body: JSON.stringify({ data: store }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Store import failed for ${store.pqstorename}: ${errorData.error?.message || response.statusText}`);
        }
      }

      // Add products
      for (const product of sampleProducts) {
        const response = await fetch(`${STRAPI_API_URL}/pqproducts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_API_TOKEN}` },
          body: JSON.stringify({ data: product }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Product import failed for ${product.pqproductname}: ${errorData.error?.message || response.statusText}`);
        }
      }

      setMessage('Test data populated successfully! Check Strapi admin.');
    } catch (error) {
      console.error('Error populating data:', error);
      setMessage(`Error populating data: ${error.message}. Check console for details.`);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test Data Population</h1>
      <p>{message}</p>
      <button onClick={handlePopulate} style={{ padding: '10px 20px', fontSize: '16px' }}>Populate Data</button>
    </div>
  );
}