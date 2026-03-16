from store.models import Category

def run():
    categories = Category.objects.all()
    for c in categories:
        print(f"ID: {c.id}, Name: {c.name}, Slug: {c.slug}")

if __name__ == "__main__":
    import os
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    run()
