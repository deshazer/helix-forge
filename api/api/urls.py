from django.urls import include, path

from .views import (
    CustomRefreshTokenView,
    CustomTokenObtainPairView,
    get_auth_user,
    is_authenticated,
    logout,
    register,
)

urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomRefreshTokenView.as_view(), name="token_refresh"),
    path("logout/", logout, name="logout"),
    path("authenticated/", is_authenticated, name="is_authenticated"),
    path("register/", register, name="register"),
    path("whoami/", get_auth_user, name="whoami"),
    path("", include("account.urls"), name="accounts"),
    path("schwab/", include("schwab_token.urls"), name="schwab"),
    path("", include("transaction.urls"), name="transactions"),
]
