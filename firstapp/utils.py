from django.contrib.auth import get_user_model

def create_admin_user():
    User = get_user_model()
    if not User.objects.filter(username="EonSyntax").exists():
        User.objects.create_superuser("EonSyntax", "eonsyntax@gmail.com", "qwerty@123")
        print("✅ Superuser EonSyntax created.")
    else:
        print("ℹ️ Superuser EonSyntax already exists.")