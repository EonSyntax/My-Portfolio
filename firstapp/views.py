from django.shortcuts import render
from .models import Review_Section, HeroBackgroundImage
from django.http import HttpResponse
from django.db import connection



def index(request):
    reviewss = Review_Section.objects.all()
    images = HeroBackgroundImage.objects.all()

    # Generate secure URLs
    hero_image_urls = [img.image.build_url(secure=True) for img in images]

    return render(request, 'firstapp/index.html', {
        'reviewss': reviewss,
        'hero_images': hero_image_urls  # Pass only the URLs
    })

# Live webpage uptime update for render keep awake
def healthz(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        # database is up
        return HttpResponse("OK", status=200)
    except Exception:
        return HttpResponse("DB Error", status=500)


# hero-background-image
# def home(request):
#     images = HeroBackgroundImage.objects.all()
#     return render(request, 'templates/base.html', {'hero_images': images})