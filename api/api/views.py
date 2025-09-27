from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Note
from .serializer import NoteSerializer, UserRegistrationSerializer


# Create your views here.
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


class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
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
            return Response({"success": False, "error": str(e)}, status=400)


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
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({"success": True})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notes(request):
    user = request.user
    notes = Note.objects.filter(owner=user)
    serializer = NoteSerializer(notes, many=True)

    return Response(serializer.data)
