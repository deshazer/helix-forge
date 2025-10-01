from django.urls import path

from . import views

urlpatterns = [
    path(
        "quotes/<str:symbol>/",
        views.get_quote,
        name="get-quote",
    ),
    path(
        "price_history/<str:symbol>/",
        views.get_price_history,
        name="get-price-history",
    ),
]
