# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FSRS4Anki is a spaced repetition scheduler for Anki based on the Free Spaced Repetition Scheduler algorithm. This fork adds custom scheduler variants.

**Key directories:**
- `blackout_fsrs/` - Scheduler that skips holidays/blackout dates
- `lazy_fsrs/` - Scheduler with streak-based minimum intervals
- `original_algorithm/` - Upstream FSRS4Anki v6.1.1 reference
- `archive/` - Research notebooks and experimental algorithms

## Testing and Verification

**Manual testing in Anki:**
1. Set `display_memory_state = true` in the scheduler configuration
2. Paste scheduler code into Anki: Tools → Deck Options → FSRS → Custom scheduling
3. Review cards and verify memory state display shows D, S, R values
4. For blackout_fsrs: add tomorrow's date to `blackout_dates`, verify intervals skip it

**Algorithm validation notebooks** in `original_algorithm/`:
- `fsrs4anki_optimizer.ipynb` - Parameter optimization
- `fsrs4anki_simulator.ipynb` - Algorithm simulation

## Architecture

Each scheduler is a single JavaScript file that runs inside Anki's card scheduler. Core FSRS functions shared by all variants:

- `next_interval(stability)` - Calculates review interval
- `next_difficulty()` / `next_recall_stability()` / `next_forget_stability()` - Core FSRS algorithm
- `init_states()` / `convert_states()` - Initialize card custom data
- `forgetting_curve()` - Memory retention probability model

**Data storage:** Card state is stored in `customData` per rating (again/hard/good/easy) with fields: `d` (difficulty), `s` (stability), `seed`, `version`

### Blackout FSRS (`blackout_fsrs/`)

Skips holidays/blackout dates when scheduling. Additional functions:
- `is_blackout_date(date)` - Checks if date is in blackout list
- `adjust_for_blackouts(interval)` - Extends interval to skip blackout dates (max +7 days)

Config: `blackout_dates` array supports `"MM-DD"` (recurring) and `"YYYY-MM-DD"` (specific)

### Lazy FSRS (`lazy_fsrs/`)

Enforces minimum intervals based on consecutive correct answers. Adds `streak` field to customData.
- Good/Easy increments streak, Again/Hard resets to 0
- Minimum intervals: streak 0-1 = 1 day, streak 2 = 3 days, streak 3+ = 5 days

## Configuration

The `deckParams` array at the top of the scheduler holds per-deck settings:
- `w` - 21-element array of learned FSRS parameters (user-specific from optimizer)
- `requestRetention` - Target recall probability (e.g., 0.9)
- `maximumInterval` - Hard cap on intervals in days

## Version Compatibility

- Requires Anki 23.10+ for native FSRS support
- Qt5 variant (`original_algorithm/fsrs4anki_scheduler_qt5.js`) for older Anki versions
- Versions: `blackout-v1.0.0`, `lazy-v1.0.0` (both based on FSRS4Anki v6.1.1)
