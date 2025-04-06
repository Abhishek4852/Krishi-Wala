from django.urls import path
from . import views  # Import views from the current app
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.Registration, name='Registration'),
    path('login/',views.login, name="login") , # Home page route
    path("token_validation/",views.token_validation, name="token_validation"),
    path("post_land/",views.post_land, name="post_land"),
    path("filter_land/",views.filter_land,name="filter_land"),
    path("labour_registration/", views.labour_registration, name="labour_registration"),
    path("machine_registration/", views.machine_registration, name="machine_registration"),
    path("search_machine/", views.search_machine, name="search_machine"),
    path("search_labour/", views.search_labour, name="search_labour"),
    path("labour_request/", views.labour_request, name="labour_request"),
    path("land_request/", views.land_request, name="land_request"),
    path("machine_request/", views.machine_request, name="machine_request"),
    path("recieved_request/", views.recieved_request, name="recieved_request"),
    path("sent_request/", views.sent_request, name="sent_request"),
    path("preview_request/", views.preview_request, name="preview_request"),
     # About page route
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)