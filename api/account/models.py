from django.contrib.auth import get_user_model
from django.db import models


# Create your models here.
class Account(models.Model):
    id = models.AutoField(primary_key=True)
    number = models.CharField(max_length=255)
    user_id = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    hash_value = models.CharField(max_length=255)
    tokens = models.JSONField(default=None)
    type = models.CharField(max_length=255)

    def __str__(self):
        return str(self.number)
