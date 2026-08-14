# SaveWise v5 — Date & Time Foundation

This version adds the first Date & Time / Monthly History foundation while preserving the existing SaveWise storage key (`savewise_v2`).

Included:
- Automatic current month/year detection
- Days elapsed and remaining for the current month
- Previous-month browsing
- Current-month navigation with next-month protection
- Monthly income/expense totals based on the selected month
- Transaction date and time stored with each new transaction
- Optional date/time selection when adding a transaction
- Transaction list shows date and time
- Service-worker cache bumped to v5

Important:
- Do not delete browser/site storage when updating, because SaveWise currently stores user data locally.
- Existing transaction records are retained; records without a date are handled safely using the current date for display/filtering.
- This is a foundation update. Charts, yearly history, backup/restore, and advanced comparisons will be added later.
