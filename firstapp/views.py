from django.shortcuts import render, get_object_or_404
from .models import Review_Section, HeroBackgroundImage, Project
from django.http import HttpResponse
from django.db import connection



def index(request):
    reviewss = Review_Section.objects.all()
    images = HeroBackgroundImage.objects.all()
    projects = Project.objects.prefetch_related('images').all()

    # Generate secure URLs
    hero_image_urls = [img.image.build_url(secure=True) for img in images]

    # pass the CATEGORY_CHOICES into template
    categories = Project.CATEGORY_CHOICES

    return render(request, 'firstapp/index.html', {
        'reviewss': reviewss,
        'hero_images': hero_image_urls,  # Pass only the URLs
        'projects': projects,
        'categories':   categories,
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


def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    reviews = project.reviews.all()  # thanks to related_name='reviews'
    return render(request, 'firstapp/project_detail.html', {
        'project': project,
        'reviews': reviews,
    })