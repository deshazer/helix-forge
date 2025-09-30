from django.utils.timezone import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from schwab_token.services import create_schwab_client

from .models import Account
from .serializer import AccountSerializer

# Create your views here.


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user_id=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def import_accounts(request):
    try:
        client = create_schwab_client(request.user)

        acct_numbers_resp = client.get_account_numbers()

        account_numbers = acct_numbers_resp.json()

        user_pref_resp = client.get_user_preferences()

        user_accounts = user_pref_resp.json()["accounts"]

        imported = 0

        for account_number in account_numbers:
            acct_pref = next(
                (
                    acct
                    for acct in user_accounts
                    if acct["accountNumber"] == account_number["accountNumber"]
                ),
                {},
            )

            _, created = Account.objects.update_or_create(
                user_id=request.user.id,
                number=account_number["accountNumber"],
                hash_value=account_number["hashValue"],
                defaults={
                    "name": f"{acct_pref["nickName"]}{acct_pref['displayAcctId']}",
                    "type": acct_pref["type"],
                    "is_default": acct_pref["primaryAccount"],
                },
            )

            if created:
                imported += 1

            request.user.account_sync_at = timezone.now()
            request.user.save()
        return Response({"success": True, "imported": imported})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
