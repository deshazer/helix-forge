from datetime import datetime

from django.conf import settings
from django.utils import timezone

from .models import SchwabToken


def create_schwab_client(user):
    token_obj = SchwabToken.objects.get(user=user)

    def token_write_func(new_token, **kwargs):
        # Update token in database when refreshed
        token = new_token["token"]

        SchwabToken.objects.filter(user=user).update(
            access_token=token["access_token"],
            refresh_token=token["refresh_token"],
            id_token=token["id_token"],
            token_type=token.get("token_type", "Bearer"),
            expires_in=token.get("expires_in"),
            expires_at=timezone.make_aware(
                datetime.fromtimestamp(token.get("expires_at"))
            ),
            scope=token.get("scope", "api"),
        )

    def token_read_func():
        return {
            "creation_timestamp": int(token_obj.created_at.timestamp()),
            "token": {
                "access_token": token_obj.access_token,
                "refresh_token": token_obj.refresh_token,
                "token_type": token_obj.token_type,
                "expires_in": token_obj.expires_in,
                "scope": token_obj.scope,
                "expires_at": int(
                    token_obj.refresh_token_expires_at.timestamp() / 1000
                ),
            },
        }

    # Create client using stored tokens
    from schwab.auth import client_from_access_functions

    client = client_from_access_functions(
        api_key=settings.SCHWAB_API_KEY,
        app_secret=settings.SCHWAB_APP_SECRET,
        token_read_func=token_read_func,
        token_write_func=token_write_func,
    )

    return client


def get_schwab_transactions(user):
    client = create_schwab_client(user)
    return client.get_transactions(settings.SCHWAB_ACCOUNT_HASH).json()
