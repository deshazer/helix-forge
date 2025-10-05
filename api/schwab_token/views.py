import base64
import datetime
import urllib.parse

import requests
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SchwabToken
from .services import create_schwab_client


class SchwabAuthInitView(APIView):
    def get(self, request):
        """Generate Schwab authorization URL"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Schwab OAuth parameters
        params = {
            "response_type": "code",
            "client_id": settings.SCHWAB_API_KEY,
            "redirect_uri": settings.SCHWAB_CALLBACK_URL,
        }

        auth_url = (
            "https://api.schwabapi.com/v1/oauth/authorize?"
            + urllib.parse.urlencode(params)
        )
        return Response({"auth_url": auth_url})


class SchwabCallbackView(APIView):
    @csrf_exempt
    def get(self, request):
        """Handle Schwab OAuth callback"""
        try:
            auth_code = request.GET.get("code")

            if not auth_code:
                return Response(
                    {"error": "No authorization code provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            headers = {
                "Authorization": f'Basic {base64.b64encode(bytes(f"{settings.SCHWAB_API_KEY}:{settings.SCHWAB_APP_SECRET}", "utf-8")).decode("utf-8")}',
                "Content-Type": "application/x-www-form-urlencoded",
            }

            res = requests.post(
                "https://api.schwabapi.com/v1/oauth/token",
                headers=headers,
                data={
                    "grant_type": "authorization_code",
                    "code": auth_code,
                    "redirect_uri": settings.SCHWAB_CALLBACK_URL,
                },
            )

            token_info = res.json()

            token_info["refresh_token_expires_at"] = (
                timezone.now() + datetime.timedelta(days=7)
            )
            token_info["expires_at"] = timezone.now() + datetime.timedelta(minutes=30)

            # Save or update token for current user
            SchwabToken.objects.update_or_create(user=request.user, defaults=token_info)

            # Redirect to frontend success page
            # from django.shortcuts import redirect

            # TODO: Redirect to frontend success page
            return Response()

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SchwabAccountsView(APIView):
    """View to get a list of Schwab accounts"""

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            client = create_schwab_client(request.user)

            # Test the connection
            account_info = client.get_account_numbers()

            if account_info.status_code == 401:
                return Response(
                    {"message": "You need to re-authenticate "},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response({"success": True, "account_info": account_info.json()})

        except SchwabToken.DoesNotExist:
            return Response(
                {"error": "Schwab account not connected"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SchwabTransactionsView(APIView):
    """View to get a list of Schwab transactions"""

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            client = create_schwab_client(request.user)

            transactions = client.get_transactions(settings.SCHWAB_ACCOUNT_HASH)

            return Response({"success": True, "transactions": transactions.json()})

        except SchwabToken.DoesNotExist:
            return Response(
                {"error": "Schwab account not connected"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
