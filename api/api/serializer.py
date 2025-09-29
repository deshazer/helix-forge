from custom_user.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ("id", "title", "content", "owner", "created_at", "updated_at")


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
        )

    def create(self, validated_data):
        user = get_user_model()(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class GetUserSerializer(serializers.ModelSerializer):
    has_schwab_token = serializers.SerializerMethodField()
    refresh_token_expires_at = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_superuser",
            "is_staff",
            "date_joined",
            "is_active",
            "has_schwab_token",
            "refresh_token_expires_at",
        )
        read_only_fields = (
            "id",
            "is_superuser",
            "is_staff",
            "has_schwab_token",
            "refresh_token_expires_at",
        )

    def get_has_schwab_token(self, obj):
        return bool(obj.schwab_token)

    def get_refresh_token_expires_at(self, obj):
        if hasattr(obj, "schwab_token") and obj.schwab_token:
            return obj.schwab_token.refresh_token_expires_at
        return None
