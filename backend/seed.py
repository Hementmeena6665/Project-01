import os
import django
from django.core.files import File

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Category, Product
from django.utils.text import slugify

def populate():
    # Clear existing data to avoid duplicates with broken placeholders
    Product.objects.all().delete()
    Category.objects.all().delete()

    # Create Categories
    categories = ['Electronics', 'Fashion', 'Home & Living', 'Accessories']
    cat_objs = {}
    for cat_name in categories:
        cat, created = Category.objects.get_or_create(name=cat_name, slug=slugify(cat_name))
        cat_objs[cat_name] = cat
        print(f"Category {cat_name} created.")

    # Create Products with local images
    products = [
        {
            'name': 'Aura Gaming Headset',
            'description': 'High-fidelity audio with spatial sound and reactive RGB lighting. Ultra-soft memory foam earcups for all-day comfort.',
            'price': 129.99,
            'category': cat_objs['Electronics'],
            'image_path': 'media/product/headset.png'
        },
        {
            'name': 'Zenith Smart Watch',
            'description': 'AMOLED display with titanium case. 14-day battery life and advanced health tracking features.',
            'price': 249.50,
            'category': cat_objs['Electronics'],
            'image_path': 'media/product/watch.png'
        },
        {
            'name': 'Lumina Floor Lamp',
            'description': 'Modern minimalist design with voice-controlled smart dimming and adjustable color temperature.',
            'price': 89.00,
            'category': cat_objs['Home & Living'],
            'image_path': 'media/product/lamp.png'
        }
    ]

    for p_data in products:
        image_path = p_data.pop('image_path')
        product = Product.objects.create(**p_data)
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                product.image.save(os.path.basename(image_path), File(f))
        print(f"Product {product.name} created with image.")

if __name__ == '__main__':
    populate()
