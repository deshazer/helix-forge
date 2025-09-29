from django.urls import path

from . import views

urlpatterns = [
    path("auth/init/", views.SchwabAuthInitView.as_view(), name="schwab-auth-init"),
    path("callback/", views.SchwabCallbackView.as_view(), name="schwab-callback"),
    path("client/", views.SchwabClientView.as_view(), name="schwab-client"),
]
