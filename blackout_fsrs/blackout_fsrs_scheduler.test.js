// Tests for Blackout FSRS Scheduler
// Run with: node blackout_fsrs_scheduler.test.js

// ============================================
// Mock Anki environment
// ============================================

global.document = {
  getElementById: () => null,
  createElement: () => ({
    style: {},
    remove: () => {},
  }),
  body: {
    appendChild: () => {},
  },
};

global.customData = {
  again: {},
  hard: {},
  good: {},
  easy: {},
};

global.states = {
  current: {
    normal: {
      new: null,
      learning: null,
      review: {
        scheduledDays: 10,
        elapsedDays: 10,
        easeFactor: 2.5,
      },
    },
  },
  good: { normal: { review: { scheduledDays: 0 } } },
  easy: { normal: { review: { scheduledDays: 0 } } },
  hard: { normal: { review: { scheduledDays: 0 } } },
};

global.ctx = {
  deckName: "TestDeck",
  seed: "test-seed-123",
};

// ============================================
// Extract functions to test (copy from scheduler)
// ============================================

// Configuration for tests
let blackout_dates = [];
let max_blackout_skip = 7;
let display_memory_state = false;

function is_blackout_date(date) {
  if (blackout_dates.length === 0) return false;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  const mmdd = `${month}-${day}`;
  const full = `${year}-${month}-${day}`;

  for (const blackout of blackout_dates) {
    if (blackout === mmdd || blackout === full) {
      return true;
    }
  }
  return false;
}

function adjust_for_blackouts(interval) {
  if (blackout_dates.length === 0) return interval;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let adjusted = interval;

  for (let extra = 0; extra <= max_blackout_skip; extra++) {
    const target = new Date(today);
    target.setDate(today.getDate() + adjusted);

    if (!is_blackout_date(target)) {
      return adjusted;
    }
    adjusted++;
  }

  return adjusted;
}

// ============================================
// Test utilities
// ============================================

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    testsPassed++;
    console.log(`  ✓ ${message}`);
  } else {
    testsFailed++;
    console.log(`  ✗ ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    testsPassed++;
    console.log(`  ✓ ${message}`);
  } else {
    testsFailed++;
    console.log(`  ✗ ${message}`);
    console.log(`    Expected: ${expected}, Got: ${actual}`);
  }
}

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}

// Helper to create a date N days from today
function daysFromNow(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

// Helper to format date as MM-DD
function toMMDD(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

// Helper to format date as YYYY-MM-DD
function toYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================
// Tests
// ============================================

describe('is_blackout_date', () => {
  // Reset blackout_dates before each test group
  blackout_dates = [];

  describe('  with empty blackout list', () => {
    blackout_dates = [];
    const today = new Date();
    assert(!is_blackout_date(today), 'returns false for any date');
  });

  describe('  with recurring MM-DD format', () => {
    const tomorrow = daysFromNow(1);
    blackout_dates = [toMMDD(tomorrow)];

    assert(is_blackout_date(tomorrow), 'matches tomorrow when in blackout list');

    const dayAfter = daysFromNow(2);
    assert(!is_blackout_date(dayAfter), 'does not match day not in list');
  });

  describe('  with specific YYYY-MM-DD format', () => {
    const tomorrow = daysFromNow(1);
    blackout_dates = [toYYYYMMDD(tomorrow)];

    assert(is_blackout_date(tomorrow), 'matches specific date');

    // Same MM-DD but different year should NOT match
    const sameMMDDNextYear = new Date(tomorrow);
    sameMMDDNextYear.setFullYear(sameMMDDNextYear.getFullYear() + 1);
    assert(!is_blackout_date(sameMMDDNextYear), 'does not match same MM-DD in different year');
  });

  describe('  with mixed formats', () => {
    const tomorrow = daysFromNow(1);
    const dayAfter = daysFromNow(2);
    blackout_dates = [toMMDD(tomorrow), toYYYYMMDD(dayAfter)];

    assert(is_blackout_date(tomorrow), 'matches recurring format');
    assert(is_blackout_date(dayAfter), 'matches specific format');
    assert(!is_blackout_date(daysFromNow(3)), 'does not match unlisted date');
  });
});

describe('adjust_for_blackouts', () => {
  describe('  with no blackouts', () => {
    blackout_dates = [];

    assertEqual(adjust_for_blackouts(1), 1, 'returns original interval of 1');
    assertEqual(adjust_for_blackouts(5), 5, 'returns original interval of 5');
    assertEqual(adjust_for_blackouts(30), 30, 'returns original interval of 30');
  });

  describe('  with single blackout tomorrow', () => {
    const tomorrow = daysFromNow(1);
    blackout_dates = [toMMDD(tomorrow)];

    assertEqual(adjust_for_blackouts(1), 2, 'skips tomorrow, returns 2');
    assertEqual(adjust_for_blackouts(2), 2, 'interval 2 is not affected');
  });

  describe('  with consecutive blackouts', () => {
    const day1 = daysFromNow(1);
    const day2 = daysFromNow(2);
    const day3 = daysFromNow(3);
    blackout_dates = [toMMDD(day1), toMMDD(day2), toMMDD(day3)];

    assertEqual(adjust_for_blackouts(1), 4, 'skips 3 blackouts, returns 4');
    assertEqual(adjust_for_blackouts(2), 4, 'skips 2 blackouts, returns 4');
    assertEqual(adjust_for_blackouts(3), 4, 'skips 1 blackout, returns 4');
    assertEqual(adjust_for_blackouts(4), 4, 'interval 4 is not affected');
  });

  describe('  with max skip limit', () => {
    // Create 10 consecutive blackout days (more than max_blackout_skip of 7)
    blackout_dates = [];
    for (let i = 1; i <= 10; i++) {
      blackout_dates.push(toMMDD(daysFromNow(i)));
    }

    // With interval 1, should try to skip but hit the limit
    // max_blackout_skip = 7, so it will add at most 7 days
    // interval 1 + 7 extra = 8
    const result = adjust_for_blackouts(1);
    assert(result <= 1 + max_blackout_skip + 1, `respects max skip limit (got ${result})`);
  });

  describe('  with blackout not affecting interval', () => {
    // Blackout on day 5, but we're scheduling for day 1
    const day5 = daysFromNow(5);
    blackout_dates = [toMMDD(day5)];

    assertEqual(adjust_for_blackouts(1), 1, 'interval 1 unaffected by day 5 blackout');
    assertEqual(adjust_for_blackouts(4), 4, 'interval 4 unaffected by day 5 blackout');
    assertEqual(adjust_for_blackouts(5), 6, 'interval 5 skips to 6');
    assertEqual(adjust_for_blackouts(6), 6, 'interval 6 unaffected');
  });
});

describe('edge cases', () => {
  describe('  leap year handling', () => {
    // Feb 29 in a leap year
    blackout_dates = ["02-29"];

    const leapYearFeb29 = new Date(2024, 1, 29); // Feb 29, 2024 (leap year)
    assert(is_blackout_date(leapYearFeb29), 'matches Feb 29 in leap year');

    // Feb 28 should not match
    const feb28 = new Date(2024, 1, 28);
    assert(!is_blackout_date(feb28), 'does not match Feb 28');
  });

  describe('  year boundary', () => {
    blackout_dates = ["01-01"]; // New Year's Day

    const newYear2025 = new Date(2025, 0, 1);
    const newYear2026 = new Date(2026, 0, 1);

    assert(is_blackout_date(newYear2025), 'matches Jan 1, 2025');
    assert(is_blackout_date(newYear2026), 'matches Jan 1, 2026');
  });

  describe('  interval of 0', () => {
    blackout_dates = [];
    assertEqual(adjust_for_blackouts(0), 0, 'handles interval 0');
  });
});

// ============================================
// Summary
// ============================================

console.log('\n' + '='.repeat(50));
console.log(`Tests: ${testsPassed} passed, ${testsFailed} failed`);
console.log('='.repeat(50));

if (testsFailed > 0) {
  process.exit(1);
}
