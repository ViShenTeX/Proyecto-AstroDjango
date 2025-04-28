from django.db import models

class Random(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='random_images/')

    def __str__(self):
        return self.titulo

