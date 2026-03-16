import os
import django
from django.utils.text import slugify

# Setup Django environment
import sys
project_path = os.path.dirname(os.path.abspath(__file__))
sys.path.append(project_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Category, Product

def populate():
    # Create Categories
    categories_data = [
        {'name': 'Fashion', 'slug': 'fashion'},
        {'name': 'Electronics', 'slug': 'electronics'},
        {'name': 'Home', 'slug': 'home'},
    ]

    cats = {}
    for cat_data in categories_data:
        cat, created = Category.objects.get_or_create(slug=cat_data['slug'], defaults={'name': cat_data['name']})
        cats[cat_data['slug']] = cat
        if created:
            print(f"Created category: {cat.name}")
        else:
            print(f"Category already exists: {cat.name}")

    # Product Data
    products = [
        # Fashion
        ('Summer Floral Dress', 'fashion', 'Light and breathable summer dress with a vibrant floral pattern. Perfect for garden parties.', 49.99),
        ('Classic Leather Jacket', 'fashion', 'Geniune leather jacket with silver hardware and a tailored fit. A timeless wardrobe staple.', 129.50),
        ('Casual Canvas Sneakers', 'fashion', 'Hand-stitched canvas sneakers with cushioned insoles for all-day comfort.', 35.00),
        ('Artisan Silk Scarf', 'fashion', '100% pure silk scarf with hand-painted abstract designs.', 25.00),
        ('Premium Slim-Fit Jeans', 'fashion', 'Stretchy indigo denim with a modern slim cut and reinforced stitching.', 55.00),
        ('Merino Wool Sweater', 'fashion', 'Soft, warm, and lightweight sweater made from the finest merino wool.', 75.00),
        
        # Electronics
        ('Pro Wireless Headphones', 'electronics', 'Active noise-cancelling headphones with 40-hour battery life and spatial audio.', 89.99),
        ('Ultra Smart Watch', 'electronics', 'Waterproof fitness tracker with heart rate monitoring, GPS, and OLED display.', 199.00),
        ('Portable Boombox Speaker', 'electronics', 'Rugged, waterproof Bluetooth speaker with deep bass and a 20W output.', 45.00),
        ('Precision Gaming Mouse', 'electronics', '16,000 DPI optical sensor with customizable RGB lighting and 8 buttons.', 59.90),
        ('Mechanical RGB Keyboard', 'electronics', 'Tenkeyless design with mechanical blue switches and per-key illumination.', 120.00),
        ('4K Ultra HD Webcam', 'electronics', 'Crystal clear video for streaming and conferencing with dual noise-reducing mics.', 79.00),
        ('65W GaN Fast Charger', 'electronics', 'Compact universal charger for laptops, tablets, and phones with PD 3.0.', 29.00),
        
        # Home
        ('Lavender Soy Candle', 'home', 'Soothing lavender scented candle made from organic soy wax. Burns for 50 hours.', 15.00),
        ('Minimalist Mug Set', 'home', 'Set of 4 matte-finish ceramic mugs. Microwave and dishwasher safe.', 22.50),
        ('Geometric Velvet Pillow', 'home', 'Luxury velvet throw pillow with a modern gold-stamped geometric pattern.', 18.00),
        ('Modern LED Desk Lamp', 'home', 'Touch-controlled lamp with 5 color modes and a built-in USB charging port.', 35.00),
        ('Stainless Kitchen Knives', 'home', 'High-carbon stainless steel 5-piece set with ergonomic non-slip handles.', 85.00),
        ('Cotton Woven Basket', 'home', 'Decorative storage basket made from natural cotton rope. Ideal for linens.', 12.00),
        ('Silent Quartz Wall Clock', 'home', 'Non-ticking wall clock with a copper-plated frame and minimalist dial.', 28.00),
    ]

    for name, cat_slug, desc, price in products:
        p, created = Product.objects.get_or_create(
            name=name,
            defaults={
                'category': cats[cat_slug],
                'description': desc,
                'price': price
            }
        )
        if created:
            print(f"Added product: {name}")
        else:
            print(f"Product already exists: {name}")

if __name__ == "__main__":
    populate()
