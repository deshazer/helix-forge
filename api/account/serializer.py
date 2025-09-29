from rest_framework import serializers

from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            "id",
            "number",
            "name",
            "is_default",
            "hash_value",
            "type",
            "created_at",
            "updated_at",
        )
