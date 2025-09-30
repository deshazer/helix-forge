import json
import os
from datetime import datetime, timedelta

import pandas as pd
from dotenv import load_dotenv
from schwab.auth import easy_client, httpx

# from utils import parse_trade_data

load_dotenv()

print("Creating client...")
c = easy_client(
    os.getenv("SCHWAB_API_KEY"),
    os.getenv("SCHWAB_APP_SECRET"),
    os.getenv("SCHWAB_CALLBACK_URL"),
    os.getenv("SCHWAB_TOKEN_PATH"),
)

print("Getting account number...")
account_hash = os.getenv("SCHWAB_ACCOUNT_HASH")
if not account_hash:
    print("No account hash found in environment variables")
    acct_req = c.get_account_numbers()
    assert acct_req.status_code == httpx.codes.OK
    account_hash = acct_req.json()[0]["hashValue"]

acct_req = c.get_account_numbers()
print(json.dumps(acct_req.json(), indent=2))

acct_req = c.get_accounts()
print(json.dumps(acct_req.json(), indent=2))


print("Getting transactions...")
# tran_req = c.get_transactions(account_hash)
# assert tran_req.status_code == httpx.codes.OK
#
# trans = sorted(tran_req.json(), key=lambda x: x["time"])
#
# df = pd.DataFrame(trans)
#
# new_columns = df.apply(parse_trade_data, axis=1)
# result_df = pd.concat([df, new_columns], axis=1)
# result_df["expirationDate"] = pd.to_datetime(
#     result_df["expirationDate"], format="%Y-%m-%dT%H:%M:%S%z"
# ).dt.tz_localize(None)
# result_df["time"] = pd.to_datetime(
#     result_df["time"], format="%Y-%m-%dT%H:%M:%S%z"
# ).dt.tz_localize(None)
# result_df["tradeDate"] = pd.to_datetime(
#     result_df["tradeDate"], format="%Y-%m-%dT%H:%M:%S%z"
# ).dt.tz_localize(None)
# result_df["settlementDate"] = pd.to_datetime(
#     result_df["settlementDate"], format="%Y-%m-%dT%H:%M:%S%z"
# ).dt.tz_localize(None)
#
# df = result_df
# df["orderId"] = df["orderId"].fillna("").astype(str)
# df["activityId"] = df["activityId"].fillna("").astype(str)
# df = df.drop("transferItems", axis=1)
#
# pd.set_option("display.max_columns", None)
# print(df)
#
# # # Export to Excel
# output_filename = (
#     f"xlsx/schwab_transactions_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
# )
# df.to_excel(output_filename, index=False, sheet_name="Transactions")
# print(f"Successfully exported {len(df)} transactions to {output_filename}")
#
#
# # Display basic info about the data
# print(f"\nDataFrame shape: {df.shape}")
# print(f"Columns: {list(df.columns)}")
#
# options_quote = c.get_option_chain(
#     "IWM",
#     contract_type=c.Options.ContractType.PUT,
#     strike_count=10,
#     include_underlying_quote=True,
#     from_date=datetime.now() + timedelta(days=3),
#     to_date=datetime.now() + timedelta(days=3),
# )
#
# print(json.dumps(options_quote.json(), indent=4))
