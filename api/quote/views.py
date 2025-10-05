from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from schwab_token.services import create_schwab_client


def fetch_price_history(request, symbol):
    symbol = symbol.upper()

    if not symbol:
        raise Exception("Symbol is required")

    client = create_schwab_client(request.user)

    price_history = request.GET.get("price_history", "").lower()

    if not price_history:
        raise Exception("price_history is required")

    start_datetime = parse_datetime(request.GET.get("start_datetime", ""))
    end_datetime = parse_datetime(request.GET.get("end_datetime", ""))

    print("price_history", price_history)
    print("start_datetime", start_datetime)
    print("end_datetime", end_datetime)

    fetch_history = None

    match price_history:
        case "1m":
            fetch_history = client.get_price_history_every_minute
        case "5m":
            fetch_history = client.get_price_history_every_five_minutes
        case "10m":
            fetch_history = client.get_price_history_every_ten_minutes
        case "15m":
            fetch_history = client.get_price_history_every_fifteen_minutes
        case "30m":
            fetch_history = client.get_price_history_every_thirty_minutes
        case "1d":
            fetch_history = client.get_price_history_every_day
        case "1w":
            fetch_history = client.get_price_history_every_week
        case _:
            raise Exception(f"Invalid price_history value: {price_history}")

    history = []
    if fetch_history:
        history = fetch_history(
            symbol,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            need_extended_hours_data=True,
        ).json()

    return history


# Create your views here.


@api_view(["GET"])
def get_quote(request, symbol):

    try:
        if not symbol:
            raise Exception("Symbol is required")

        symbol = symbol.upper()

        client = create_schwab_client(request.user)

        response = {
            "quote": client.get_quote(symbol).json(),
        }

        price_history = request.GET.get("price_history", "").lower()

        if price_history:
            response["price_history"] = fetch_price_history(
                request,
                symbol,
            )

        return Response(
            response,
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_price_history(request, symbol):

    try:
        if not symbol:
            raise Exception("Symbol is required")

        return Response(fetch_price_history(request, symbol), status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
