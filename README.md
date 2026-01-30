# FSRS4Anki Custom Schedulers

A collection of custom FSRS4Anki schedulers with additional features built on top of the [Free Spaced Repetition Scheduler algorithm](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm).

**Upstream:** [open-spaced-repetition/fsrs4anki](https://github.com/open-spaced-repetition/fsrs4anki)

## Available Schedulers

| Scheduler | Description | Documentation |
|-----------|-------------|---------------|
| **Blackout FSRS** | Skips holidays and blackout dates when scheduling reviews | [blackout_fsrs/](./blackout_fsrs/) |
| **Lazy FSRS** | Enforces minimum intervals based on consecutive correct answers | [lazy_fsrs/](./lazy_fsrs/) |

## Quick Start

1. Open Anki (23.10+)
2. Go to **Tools** → **Deck Options**
3. Scroll to the **FSRS** section
4. Copy the scheduler code from one of the README files above
5. Paste into the **Custom scheduling** box
6. Click **Save**

## Original FSRS4Anki

The original unmodified FSRS4Anki v6.1.1 scheduler is preserved in [`original_algorithm/`](./original_algorithm/) for reference.

For details about how FSRS works, see:
- [The Algorithm](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)
- [Anki Manual - FSRS](https://docs.ankiweb.net/deck-options.html#fsrs)
