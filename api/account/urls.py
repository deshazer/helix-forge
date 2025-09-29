from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AccountViewSet, import_accounts

router = DefaultRouter()
router.register("accounts", AccountViewSet)

urlpatterns = [
    path(
        "accounts/import/",
        import_accounts,
        name="import-schwab-accounts",
    ),
    path("", include(router.urls)),
]
