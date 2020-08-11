"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from api import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("admin/trigger/<slug:time_period>", views.TriggerTimePeriodView.as_view()),
    path("user/", views.UserDetailView.as_view()),
    path("user/profile/", views.ProfileDetailView.as_view()),
    path("user/playlists/", views.PlaylistListCreateView.as_view()),
    path("user/options/", views.PlaylistOptionsDetailView.as_view()),
    path("user/spotify-authentication/", views.SpotifyAuthenticationView.as_view()),
    path("token/request/", views.TokenRequestView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("healthcheck", views.HealthCheckView.as_view()),
]
