from django.http import JsonResponse
from django.conf import settings
from .models import Random

def random_list(request):
    data = list(Random.objects.values('titulo', 'descripcion', 'imagen'))
    for item in data:
        if item['imagen']:
            # Construir la URL correcta para los archivos de medios
            item['imagen'] = f"{request.scheme}://{request.get_host()}{settings.MEDIA_URL}{item['imagen']}"
    response = JsonResponse(data, safe=False)
    response['Content-Type'] = 'application/json; charset=utf-8'
    return response