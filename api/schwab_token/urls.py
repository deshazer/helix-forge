from django.urls import path

from . import views

urlpatterns = [
    path("auth/init/", views.SchwabAuthInitView.as_view(), name="schwab-auth-init"),
    path("token/", views.SchwabCallbackView.as_view(), name="schwab-callback"),
    path("accounts/", views.SchwabAccountsView.as_view(), name="schwab-accounts"),
    path(
        "transactions/",
        views.SchwabTransactionsView.as_view(),
        name="schwab-transactions",
    ),
]
