import json
import random
from datetime import datetime

# Generate stores
stores = [
    {"pqstorename": random.choice(["Walmart", "Target", "Safeway", "Raley's"]),
     "pqstoreaddress": f"{random.randint(100, 999)} {random.choice(['Main', 'Oak', 'Pine', 'Cedar'])} St, {random.choice(['San Francisco', 'Los Angeles', 'Chicago', 'New York'])}",
     "pqstorelocation": {"lat": random.uniform(33.0, 42.0), "lng": random.uniform(-122.0, -87.0)},
     "pqplaceid": f"ChIJ_{i}"}
    for i in range(100)
]

# Save stores to a separate file
with open('stores.json', 'w') as f:
    json.dump(stores, f)

# Product categories and names
categories = ["Beverages", "Snacks", "Household", "Personal Care", "Frozen"]
product_names = {
    "Beverages": ["Coke 12 Pack", "Pepsi 12 Pack", "Sprite 12 Pack", "Water 24 Pack", "Orange Juice 1L", "Gatorade 32 oz", "Milk 1 Gallon", "Coffee Grounds 12 oz"],
    "Snacks": ["Doritos Nacho Cheese", "Lay’s Classic", "Cheetos Puffs", "Pringles Original", "Oreo Cookies", "Goldfish Crackers", "Pretzels 16 oz", "Popcorn 8 oz"],
    "Household": ["Paper Towels 6 Pack", "Dish Soap 20 oz", "Trash Bags 50 ct", "Laundry Detergent 50 oz", "Clorox Wipes", "Sponges 3 Pack", "Batteries AA 8 Pack", "Light Bulbs 4 Pack"],
    "Personal Care": ["Toothpaste 6 oz", "Shampoo 12 oz", "Deodorant 2.6 oz", "Body Wash 16 oz", "Hand Soap 12 oz", "Toilet Paper 12 Rolls", "Facial Tissue Box", "Razor Blades 4 Pack"],
    "Frozen": ["Pizza 14 inch", "Ice Cream 1.5 qt", "Frozen Veggies 16 oz", "Chicken Nuggets 32 oz", "Waffles 10 Pack", "French Fries 2 lb", "Burritos 6 Pack", "Ice Pops 12 Pack"]
}

# Generate 100,000 products
all_products = []
for i in range(100000):
    product = {
        "pqproductname": random.choice(product_names[random.choice(list(categories))]),
        "pqproductprice": round(random.uniform(1.99, 19.99), 2),
        "pqproductavailability": random.choice(["In Stock", "Pick up today", "Out of Stock"]),
        "pqstore_id": random.randint(1, 100)
    }
    all_products.append(product)

# Split into 10 chunks of 10,000
for chunk_num in range(10):
    start_idx = chunk_num * 10000
    end_idx = (chunk_num + 1) * 10000
    chunk = all_products[start_idx:end_idx]
    with open(f'products_chunk_{chunk_num + 1}.txt', 'w') as f:
        f.write('[' + ','.join(json.dumps(item) for item in chunk) + ']')

print("10 chunks of 10,000 products each generated as .txt files.")
print("Stores saved to stores.json.")