# Lazy FSRS Scheduler

A modified FSRS4Anki scheduler that gives longer intervals to cards you consistently recall correctly, reducing daily review burden.

## Problem

Standard FSRS calculates optimal intervals based on memory science, but sometimes you want to review "easy" cards less frequently—especially when you've answered them correctly multiple times in a row.

## Solution

This scheduler tracks a **streak counter** for consecutive correct answers and enforces **minimum intervals** based on that streak:

| Streak | Minimum Interval | Triggered By               |
| ------ | ---------------- | -------------------------- |
| 0-1    | 1 day (default)  | New card or recent failure |
| 2      | 3 days           | 2 consecutive Good/Easy    |
| 3+     | 5 days           | 3+ consecutive Good/Easy   |

## How Streak Works

- **Good / Easy**: Streak increments by 1 (confident recall)
- **Again / Hard**: Streak resets to 0 (failure or hesitation counts as breaking the streak)

This means:

- Pressing "Hard" is treated as uncertainty, not confident recall
- Only truly confident answers (Good/Easy) build the streak
- One slip-up resets the minimum interval back to normal FSRS behavior

## Installation

1. Open Anki
2. Go to **Tools** → **Deck Options**
3. Scroll to the **FSRS** section
4. Open [`lazy_fsrs_scheduler.js`](./lazy_fsrs_scheduler.js), copy all the code, and paste into the **Custom scheduling** box
5. Click **Save**

## Verification

To verify the scheduler is working:

1. Set `display_memory_state = true` in the configuration section
2. Review a card—you should see "Lazy FSRS enabled" and streak info
3. After 3+ consecutive Good/Easy answers, the interval should be at least 5 days
4. Press "Again" and verify the streak resets to 0

## Configuration

The scheduler inherits all standard FSRS4Anki configuration options:

- `deckParams`: Per-deck FSRS parameters (w, requestRetention, maximumInterval)
- `skip_decks`: Decks where the scheduler is disabled
- `enable_fuzz`: Random delay to prevent cards bunching on the same day
- `display_memory_state`: Debug mode to show memory states

## Version

`lazy-v1.0.0` - Based on FSRS4Anki v6.1.1
