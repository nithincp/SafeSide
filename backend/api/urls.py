from django.urls import path
from . import views
urlpatterns = [
    path('check_cve/', views.CVECheckView.as_view(), name='get_cves'),
    # path('health/', views.health_check, name='health_check'),
] 