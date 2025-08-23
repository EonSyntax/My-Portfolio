from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from cloudinary.models import CloudinaryField



# Create your models here.
class Review_Section(models.Model):
    review = models.TextField(max_length=100)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=100)
    photo = CloudinaryField('image')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating (1 to 5 stars)"
    )
    project = models.ForeignKey('Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')

    def __str__(self):
        return self.first_name + ' ' + self.last_name
    

    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'



#Hero Section Background Images 
class HeroBackgroundImage(models.Model):
    image = CloudinaryField('image')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Hero Image {self.pk}"




#Project Section
class Project(models.Model):
    CATEGORY_CHOICES = [
        ('Web Application', 'Web Applications'),
        ('Mobile Application', 'Mobile Applications'),
        ('API & Backend Service', 'APIs & Backend Services'),
        ('OS & Low-Level Programming', 'OS & Low-Level Programming'),
    ]

    project_name = models.CharField(max_length=200)
    short_description = models.TextField(max_length=200)
    full_description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    launch_date = models.DateField()
    project_url = models.URLField()

    client_name = models.CharField(max_length=100)
    client_brand = models.CharField(max_length=100)

    def __str__(self):
        return self.project_name


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image')

    def __str__(self):
        return f"Image for {self.project.project_name}"