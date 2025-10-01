import os

import pandas as pd
from dotenv import load_dotenv
from schwab.auth import easy_client, httpx

load_dotenv()


def get_client():
    print("Getting client...")
    return easy_client(
        os.getenv("SCHWAB_API_KEY"),
        os.getenv("SCHWAB_APP_SECRET"),
        os.getenv("SCHWAB_CALLBACK_URL"),
        os.getenv("SCHWAB_TOKEN_PATH"),
    )


def get_account_hash(client=None):
    if not client:
        client = get_client()

    account_hash = os.getenv("SCHWAB_ACCOUNT_HASH")
    if not account_hash:
        print("No account hash found in environment variables")
        acct_req = client.get_account_numbers()
        assert acct_req.status_code == httpx.codes.OK
        account_hash = acct_req.json()[0]["hashValue"]
        print(f"SCHWAB_ACCOUNT_HASH: {account_hash}")

    return account_hash


def get_transactions(client=None):
    print("Getting transactions...")
    if not client:
        client = get_client()

    return client.get_transactions(get_account_hash(client)).json()


def to_xlsx(data, filename=None):
    if not filename:
        filename = (
            f"xlsx/data_export_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        )

    print(f"Saved to {filename}")
    df = pd.DataFrame(data)
    df.to_excel(filename, index=False, sheet_name="Sheet1")
