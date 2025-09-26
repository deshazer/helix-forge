import json
import os

import pandas as pd
from dotenv import load_dotenv
from schwab.auth import easy_client, httpx

load_dotenv()

print("Creating client...")
c = easy_client(
    os.getenv("SCHWAB_API_KEY"),
    os.getenv("SCHWAB_APP_SECRET"),
    os.getenv("SCHWAB_CALLBACK_URL"),
    os.getenv("SCHWAB_TOKEN_PATH"),
)

print("Getting account number...")
acct_req = c.get_account_numbers()
assert acct_req.status_code == httpx.codes.OK
account_hash = acct_req.json()[0]["hashValue"]

print("Getting transactions...")
tran_req = c.get_transactions(account_hash)
assert tran_req.status_code == httpx.codes.OK

trans = sorted(tran_req.json(), key=lambda x: x["time"])

df = pd.DataFrame(trans)
# Export to Excel
output_filename = (
    f"xlsx/schwab_transactions_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
)
df.to_excel(output_filename, index=False, sheet_name="Transactions")
print(f"Successfully exported {len(df)} transactions to {output_filename}")

print(json.dumps(trans, indent=4))

# Display basic info about the data
print(f"\nDataFrame shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
