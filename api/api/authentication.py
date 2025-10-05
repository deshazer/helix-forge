from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication

SAFE_METHODS = ("GET", "HEAD", "OPTIONS")


def enforce_csrf(request):
    """
    Mirror DRF's SessionAuthentication CSRF enforcement.
    Requires csrftoken cookie + X-CSRFToken header on unsafe methods.
    """

    # DRF wraps the Django request; CSRFCheck needs the real django.http.HttpRequest
    django_request = getattr(request, "_request", request)

    # CsrfViewMiddleware requires a get_response callable
    def dummy_get_response(_req):
        return None

    check = CSRFCheck(dummy_get_response)
    check.process_request(django_request)
    reason = check.process_view(django_request, None, (), {})

    if reason:
        raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")


class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")
        if not access_token:
            return None

        validated_token = self.get_validated_token(access_token)
        try:
            user = self.get_user(validated_token)
        except:
            return None

        if request.method not in SAFE_METHODS:
            enforce_csrf(request)

        return (user, validated_token)
