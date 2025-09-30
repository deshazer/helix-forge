from django.db import models
from django_use_email_as_username.models import BaseUser, BaseUserManager


class User(BaseUser):
    objects = BaseUserManager()

    account_sync_at = models.DateTimeField(null=True)
    transaction_sync_at = models.DateTimeField(null=True)
