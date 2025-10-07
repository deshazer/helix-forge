from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializer import GetUserSerializer, UserRegistrationSerializer


# Create your views here.
@method_decorator(csrf_protect, name="dispatch")
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            if response.status_code == 200:
                tokens = response.data
                access_token = tokens["access"]
                refresh_token = tokens["refresh"]

                response = Response()
                response.data = {
                    "success": True,
                }
                response.set_cookie(
                    key="access_token",
                    value=access_token,
                    httponly=True,
                    secure=True,
                    samesite="None",
                    path="/",
                )

                response.set_cookie(
                    key="refresh_token",
                    value=refresh_token,
                    httponly=True,
                    secure=True,
                    samesite="None",
                    path="/",
                )

                return response

        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=400)


@method_decorator(csrf_protect, name="dispatch")
class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")

            if not refresh_token:
                return Response({"success": False}, status=401)

            request.data["refresh"] = refresh_token
            response = super().post(request, *args, **kwargs)

            if response.status_code == 200:
                tokens = response.data
                access_token = tokens["access"]
                response = Response()
                response.data = {
                    "success": True,
                }

                response.set_cookie(
                    key="access_token",
                    value=access_token,
                    httponly=True,
                    secure=True,
                    samesite="None",
                    path="/",
                )

                return response

        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=401)


@ensure_csrf_cookie
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def get_csrf_cookie(request):
    get_token(request)
    return Response({"success": True})


@api_view(["POST"])
def logout(request):
    try:
        response = Response()
        response.data = {"success": True}
        response.delete_cookie("access_token", path="/", samesite="None")
        response.delete_cookie("refresh_token", path="/", samesite="None")
        return response
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["POST"])
def is_authenticated(request):
    return Response({"success": True})


@csrf_protect
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
def get_auth_user(request):
    user = request.user
    serializer = GetUserSerializer(user)

    return Response(serializer.data)
