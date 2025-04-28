from django.urls import path
from .views import random_list

urlpatterns = [
    path('random/', random_list),
]
