from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TransactionViewSet, import_transactions

router = DefaultRouter()
router.register("transactions", TransactionViewSet)

urlpatterns = [
    path("transactions/import/", import_transactions, name="import-transactions"),
    path("", include(router.urls)),
]
