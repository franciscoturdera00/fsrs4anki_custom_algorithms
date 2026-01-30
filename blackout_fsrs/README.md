# Blackout FSRS Scheduler

A modified FSRS4Anki scheduler that skips blackout dates (holidays) when scheduling reviews.

## Problem

Standard FSRS may schedule reviews on holidays or days you know you won't study. This scheduler automatically pushes reviews to the next available day.

## Solution

Configure a list of blackout dates. When a review would land on one of these dates, the interval is extended to the next valid day.

**Example:** Today is Monday, tomorrow (Tuesday) is a holiday. If "Good" gives 1 day, it becomes 2 days instead, scheduling for Wednesday.

## Configuration

Add your blackout dates to the `blackout_dates` array:

```javascript
const blackout_dates = [
  "12-25", // Christmas (recurring every year)
  "01-01", // New Year's Day (recurring every year)
  "2025-07-04", // Specific one-time date
];
```

**Supported formats:**

- `"MM-DD"` - Recurring yearly (e.g., "12-25" for Christmas every year)
- `"YYYY-MM-DD"` - Specific date (e.g., "2025-12-25" for just that one day)

**Safety limit:** Maximum 7 extra days added to avoid extreme delays if many consecutive days are blackouts.

## Installation

1. Open Anki
2. Go to **Tools** → **Deck Options**
3. Scroll to the **FSRS** section
4. Open [`blackout_fsrs_scheduler.js`](./blackout_fsrs_scheduler.js), copy all the code, and paste into the **Custom scheduling** box
5. Customize the `blackout_dates` array with your dates
6. Click **Save**

## Verification

To verify the scheduler is working:

1. Set `display_memory_state = true` in the configuration section
2. Add tomorrow's date to `blackout_dates` (e.g., if today is Jan 30, add "01-31")
3. Review a card where "Good" would give 1 day interval
4. You should see "Blackout skip: 1 -> 2" in the debug display
5. The interval should show 2 days instead of 1

## Version

`blackout-v1.0.0` - Based on FSRS4Anki v6.1.1
