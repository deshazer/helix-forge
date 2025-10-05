import json

from account.models import Account
from django.utils import timezone
from glom import glom
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from schwab_token.services import create_schwab_client

from .models import Transaction
from .serializer import TransactionSerializer

# Create your views here.


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return self.queryset.filter(user_id=self.request.user.id).order_by("-time")

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)


# Create your views here.
@api_view(["POST"])
def import_transactions(request):
    try:

        body = json.loads(request.body)
        account_id = body.get("accountId")

        if not account_id:
            return Response(
                {"success": False, "message": "Account ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        account = Account.objects.get(id=account_id)

        if not account:
            return Response(
                {"success": False, "message": "Account does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if account.user_id != request.user.id:
            return Response(
                {"success": False, "message": "Account does not belong to user"},
                status=status.HTTP_403_FORBIDDEN,
            )

        client = create_schwab_client(request.user)

        transactions = client.get_transactions(account.hash_value).json()

        num_created = 0
        for transaction in transactions:

            transfer_items = glom(transaction, "transferItems", default=[])
            final_item = transfer_items[-1] or {}
            final_instrument = final_item.get("instrument", {})

            _, created = Transaction.objects.update_or_create(
                activity_id=transaction["activityId"],
                defaults={
                    # Foreign Keys
                    "user": request.user,
                    "account": account,
                    # Raw fields from the API response
                    "activity_id": transaction.get("activityId"),
                    "time": transaction.get("time"),
                    "description": transaction.get("description", ""),
                    "account_number": transaction.get("accountNumber", ""),
                    "type": transaction.get("type", ""),
                    "status": transaction.get("status", ""),
                    "sub_account": transaction.get("subAccount"),
                    "trade_date": transaction.get("tradeDate"),
                    "settlement_date": transaction.get("settlementDate"),
                    "position_id": transaction.get("positionId"),
                    "order_id": transaction.get("orderId"),
                    "net_amount": transaction.get("netAmount"),
                    # Nested/Calculated Fields
                    "asset_type": final_instrument.get("assetType"),
                    "symbol": final_instrument.get("symbol"),
                    "underlying_symbol": final_instrument.get("underlyingSymbol")
                    or final_instrument.get("symbol"),
                    "asset_description": final_instrument.get("description"),
                    "action": final_item.get("amount") <= 0 and "SELL" or "BUY",
                    "effect": final_item.get("positionEffect", ""),
                    "expiration_date": final_instrument.get("expirationDate"),
                    "quantity": final_item.get("amount", 0),
                    "price": final_item.get("price"),
                    "strike_price": final_instrument.get("strikePrice"),
                    "put_call": final_instrument.get("putCall"),
                    "options_multiplier": final_instrument.get(
                        "optionPremiumMultiplier"
                    ),
                    "total_fees": sum(
                        i.get("cost") for i in transfer_items if i.get("feeType")
                    ),
                },
            )

            if created:
                num_created += 1

        request.user.transaction_sync_at = timezone.now()
        request.user.save()
        return Response(
            {"success": True, "transactions": transactions, "imported": num_created}
        )

    except Exception as e:
        return Response({"error": repr(e)}, status=status.HTTP_400_BAD_REQUEST)
