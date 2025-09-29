from django.contrib.auth import get_user_model
from django.db import models
from encrypted_model_fields.fields import EncryptedCharField


# Create your models here.
class SchwabToken(models.Model):
    user = models.OneToOneField(
        get_user_model(), on_delete=models.CASCADE, related_name="schwab_token"
    )
    access_token = EncryptedCharField(max_length=500)
    refresh_token = EncryptedCharField(max_length=500)
    token_type = models.CharField(max_length=50, blank=True)
    expires_in = models.IntegerField(null=True)
    scope = models.TextField(blank=True)
    refresh_token_expires_at = models.DateTimeField(auto_now=False)
    expires_at = models.DateTimeField(auto_now=False)
    id_token = EncryptedCharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Schwab Token - {self.user.email}"
