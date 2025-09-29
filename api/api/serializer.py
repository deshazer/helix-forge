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
    class Meta:
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_superuser",
            "is_staff",
            "date_joined",
            "is_active",
        )
        read_only_fields = (
            "id",
            "is_superuser",
            "is_staff",
        )
        model = get_user_model()
