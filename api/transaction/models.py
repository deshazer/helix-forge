from account.models import Account
from django.contrib.auth import get_user_model
from django.db import models


# Create your models here.
class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    activity_id = models.CharField(max_length=255, db_index=True)
    time = models.DateTimeField(db_index=True)
    description = models.CharField(max_length=255)
    account_number = models.CharField(max_length=255)
    type = models.CharField(max_length=255, db_index=True)
    status = models.CharField(max_length=255)
    sub_account = models.CharField(max_length=255)
    trade_date = models.DateTimeField()
    settlement_date = models.DateTimeField(null=True)
    position_id = models.CharField(max_length=255, null=True)
    order_id = models.CharField(max_length=255, null=True)
    net_amount = models.FloatField()

    asset_type = models.CharField(max_length=255, db_index=True)
    symbol = models.CharField(max_length=255)
    underlying_symbol = models.CharField(max_length=255)
    asset_description = models.CharField(max_length=255, null=True, default="")
    quantity = models.FloatField()
    price = models.FloatField()
    strike_price = models.FloatField(null=True)
    put_call = models.CharField(max_length=64, null=True)
    action = models.CharField(max_length=255)
    effect = models.CharField(max_length=255)
    expiration_date = models.DateTimeField(null=True)
    options_multiplier = models.FloatField(null=True)
    total_fees = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
