from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from schwab_token.services import create_schwab_client

# Create your views here.


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_quote(request, symbol):

    try:
        if not symbol:
            return Response(
                {"error": "Symbol is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        symbol = symbol.upper()

        client = create_schwab_client(request.user)

        price_history = request.GET.get("price_history", "").lower()

        print("price_history", price_history)

        fetch_history = None

        match price_history:
            case "1m":
                fetch_history = client.get_price_history_every_minute
            case "5m":
                fetch_history = client.get_price_history_every_5_minutes
            case "10m":
                fetch_history = client.get_price_history_every_10_minutes
            case "15m":
                fetch_history = client.get_price_history_every_15_minutes
            case "30m":
                fetch_history = client.get_price_history_every_30_minutes
            case "1d":
                fetch_history = client.get_price_history_every_day
            case "1w":
                fetch_history = client.get_price_history_every_week

        history = []
        if fetch_history:
            history = fetch_history(symbol).json()

        return Response(
            {"quote": client.get_quote(symbol).json(), "price_history": history}
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_price_history(request, symbol):

    try:
        if not symbol:
            return Response(
                {"error": "Symbol is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        client = create_schwab_client(request.user)

        filters = request.GET.get("filters")

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
