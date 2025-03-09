const puppeteer = require('puppeteer');

async function scrapeProducts(query) {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://www.walmart.com/search/?query=${encodeURIComponent(query)}`, { waitUntil: 'networkidle2', timeout: 30000 });

    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[data-automation-id="product-title"]'));
      return items.map(item => {
        const fullName = item.innerText || 'N/A';
        const name = fullName.replace(/walmart/i, '').trim();
        const priceElement = item.closest('.mb1')?.querySelector('[data-automation-id="product-price"] .w_iUH7');
        const price = priceElement ? parseFloat(priceElement.innerText.replace(/[^0-9.]/g, '')) || 0 : 0;
        const sizeElement = item.closest('.mb1')?.querySelector('.f6');
        const size = sizeElement?.innerText.match(/\d+\.?\d*\s*(oz|pack|mini)/i)?.[0] || 'N/A';
        const imageElement = item.closest('.mb1')?.querySelector('img');
        const image = imageElement?.src || '';
        return { name, price, size, image };
      }).filter(p => p.name !== 'N/A' && p.price > 0 && p.size !== 'N/A');
    });

    await browser.close();
    return products.length > 0 ? products : [{ name: 'No products found', price: 0, size: 'N/A', image: '' }];
  } catch (error) {
    console.error('Scraping error:', error.message);
    return [{ name: 'Error fetching products', price: 0, size: 'N/A', image: '' }];
  }
}

module.exports = { scrapeProducts };