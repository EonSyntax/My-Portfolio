from django.contrib import admin
from django.utils.html import format_html
from .models import Review_Section, HeroBackgroundImage, Project, ProjectImage

# Register your models here.

@admin.register(Review_Section)
class ReviewSectionAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'star_rating_display', 'project')
    list_filter = ('rating', 'project')
    search_fields = ('first_name', 'last_name', 'designation', 'review')


    def star_rating_display(self, obj):
        try:
            return "⭐" * int(obj.rating) if obj.rating else "No rating"
        except (TypeError, ValueError):
            return "Invalid rating"
    star_rating_display.short_description = "Rating"


# Register the HeroBackgroundImage model with a custom admin interface
@admin.register(HeroBackgroundImage)
class HeroBackgroundImageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'order', 'image')
    ordering = ['order']


# Register for Project model
class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

class ProjectAdmin(admin.ModelAdmin):
    inlines = [ProjectImageInline]
    list_display = ('project_name', 'category', 'launch_date', 'client_name')

admin.site.register(Project, ProjectAdmin)