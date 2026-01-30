# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FSRS4Anki is a spaced repetition scheduler for Anki based on the Free Spaced Repetition Scheduler algorithm. This fork adds a "Lazy FSRS" variant with streak-based minimum intervals.

**Key directories:**
- `lazy_fsrs/` - Custom scheduler with streak tracking (the main work in this fork)
- `original_algorithm/` - Upstream FSRS4Anki v6.1.1 reference
- `archive/` - Research notebooks and experimental algorithms

## Testing and Verification

There's no automated test suite. Testing is done manually in Anki:

1. Set `display_memory_state = true` in the scheduler configuration
2. Paste scheduler code into Anki: Tools → Deck Options → FSRS → Custom scheduling
3. Review cards and verify memory state display shows D, S, R values and streak info
4. Test streak behavior: 3+ consecutive Good/Easy should show minimum 5-day intervals

For algorithm validation, use Jupyter notebooks in `original_algorithm/`:
- `fsrs4anki_optimizer.ipynb` - Parameter optimization
- `fsrs4anki_simulator.ipynb` - Algorithm simulation

## Architecture

The scheduler is a single JavaScript file that runs inside Anki's card scheduler. Key functions:

- `next_interval(stability, streak)` - Calculates review interval with streak-based minimums
- `next_difficulty()` / `next_recall_stability()` / `next_forget_stability()` - Core FSRS algorithm
- `init_states()` / `convert_states()` - Initialize card custom data
- `forgetting_curve()` - Memory retention probability model

**Data storage:** Card state is stored in `customData` per rating (again/hard/good/easy) with fields: `d` (difficulty), `s` (stability), `streak`, `seed`, `version`

**Streak logic:**
- Good/Easy increments streak, Again/Hard resets to 0
- Minimum intervals: streak 0-1 = 1 day, streak 2 = 3 days, streak 3+ = 5 days
- Minimums only increase intervals, never reduce them

## Configuration

The `deckParams` array at the top of the scheduler holds per-deck settings:
- `w` - 21-element array of learned FSRS parameters (user-specific from optimizer)
- `requestRetention` - Target recall probability (e.g., 0.9)
- `maximumInterval` - Hard cap on intervals in days

## Version Compatibility

- Requires Anki 23.10+ for native FSRS support
- Qt5 variant (`fsrs4anki_scheduler_qt5.js`) for older Anki versions
- Current version: `lazy-v1.0.0` based on FSRS4Anki v6.1.1
