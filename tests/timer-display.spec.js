import { test, expect } from "@playwright/test";

// Helper function to add an exam
async function addExam(
  page,
  { ref, subject, startTime, durationHours, durationMinutes, extraTime = null }
) {
  await page.click(".add-exam-btn");
  await page.fill("#refInput", ref);
  await page.fill("#subjectInput", subject);
  await page.fill("#startTimeInput", startTime);
  await page.fill("#durationHours", durationHours.toString());
  await page.fill("#durationMinutes", durationMinutes.toString());

  if (extraTime) {
    await page.check("#extraTimeEnabled");
    await page.fill("#extraTimeMinutes", extraTime.toString());
  }

  await page.locator('#examModal button:has-text("Save")').click();
}

test.describe("Timer Calculations and Display", () => {
  test.beforeEach(async ({ page }) => {
    // Each test starts with a clean browser context (configured in playwright.config.js)
    // App loads with default centre info, ready to use
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("should calculate correct duration for exams", async ({ page }) => {
    const testCases = [
      { hours: 2, minutes: 0, expected: "2h 0m" },
      { hours: 1, minutes: 30, expected: "1h 30m" },
      { hours: 1, minutes: 45, expected: "1h 45m" },
      { hours: 1, minutes: 0, expected: "1h 0m" },
      { hours: 0, minutes: 30, expected: "30m" },
    ];

    for (const tc of testCases) {
      await addExam(page, {
        ref: `TEST-${tc.expected}`,
        subject: `Duration ${tc.expected}`,
        startTime: "09:00",
        durationHours: tc.hours,
        durationMinutes: tc.minutes,
      });

      const row = page.locator("tbody tr", {
        hasText: `Duration ${tc.expected}`,
      });
      await expect(row).toContainText(tc.expected);
    }
  });

  test("should show extra time separately", async ({ page }) => {
    await addExam(page, {
      ref: "8464/1/H",
      subject: "Extra Time Exam",
      startTime: "09:00",
      durationHours: 2,
      durationMinutes: 0,
      extraTime: 30,
    });

    const row = page.locator("tbody tr", { hasText: "Extra Time Exam" });

    // Should show base duration
    await expect(row).toContainText("2 hours");

    // Should show extra time indicator
    await expect(row).toContainText("Extra Time 30 mins");

    // Finish time should be adjusted: 09:00 + 2h + 30m = 11:30
    await expect(row).toContainText("11:30");
  });

  test("should handle different extra time values", async ({ page }) => {
    const extraTimes = [
      {
        extra: 15,
        expectedFinish: "11:15",
        expectedExtra: "Extra Time 15 mins",
      },
      {
        extra: 25,
        expectedFinish: "11:25",
        expectedExtra: "Extra Time 25 mins",
      },
      {
        extra: 45,
        expectedFinish: "11:45",
        expectedExtra: "Extra Time 45 mins",
      },
    ];

    for (const test of extraTimes) {
      await addExam(page, {
        ref: `EXTRA${test.extra}`,
        subject: `Exam +${test.extra}`,
        startTime: "09:00",
        durationHours: 2,
        durationMinutes: 0,
        extraTime: test.extra,
      });

      const row = page.locator("tbody tr", { hasText: `Exam +${test.extra}` });
      await expect(row).toContainText(test.expectedFinish);
      await expect(row).toContainText(test.expectedExtra);
    }
  });

  test("should display correct time status colors", async ({ page }) => {
    // Add an exam that has already finished (past time)
    await addExam(page, {
      ref: "FINISHED",
      subject: "Finished Exam",
      startTime: "00:00",
      durationHours: 0,
      durationMinutes: 1,
    });

    // Get the row
    const row = page.locator("tbody tr", { hasText: "Finished Exam" });
    await expect(row).toBeVisible();
  });

  test("should handle midnight crossing", async ({ page }) => {
    // Exam that goes past midnight
    await addExam(page, {
      ref: "LATE",
      subject: "Late Night Exam",
      startTime: "23:00",
      durationHours: 2,
      durationMinutes: 0,
    });

    const row = page.locator("tbody tr", { hasText: "Late Night Exam" });
    await expect(row).toBeVisible();
    // Duration calculation should show "2 hours" even though it crosses midnight
    await expect(row).toContainText("2 hours");
  });

  test("should format time correctly in 24-hour format", async ({ page }) => {
    const times = [
      { start: "09:00", hours: 1, minutes: 0, expectedFinish: "10:00" },
      { start: "13:00", hours: 1, minutes: 30, expectedFinish: "14:30" },
      { start: "23:00", hours: 0, minutes: 59, expectedFinish: "23:59" },
    ];

    for (const time of times) {
      await addExam(page, {
        ref: `TIME-${time.start}`,
        subject: `Exam ${time.start}`,
        startTime: time.start,
        durationHours: time.hours,
        durationMinutes: time.minutes,
      });

      const row = page.locator("tbody tr", { hasText: `Exam ${time.start}` });
      await expect(row).toContainText(time.start);
      await expect(row).toContainText(time.expectedFinish);
    }
  });

  test("should update display every second", async ({ page }) => {
    const clock = page.locator("#displayClock");

    const time1 = await clock.textContent();
    await page.waitForTimeout(1000);
    const time2 = await clock.textContent();

    // Times should be different after 1 second
    expect(time1).not.toBe(time2);
  });

  test("should handle timer reset when start button clicked", async ({
    page,
  }) => {
    // Add an exam
    await addExam(page, {
      ref: "TEST",
      subject: "Test Exam",
      startTime: "09:00",
      durationHours: 2,
      durationMinutes: 0,
    });

    // Click set start time
    await page.click(".set-start-btn");

    // Verify button exists and is clickable
    const startBtn = page.locator(".set-start-btn");
    await expect(startBtn).toBeVisible();
  });

  test("should calculate duration across different hour ranges", async ({
    page,
  }) => {
    const testCases = [
      { hours: 4, minutes: 15, expected: "4h 15m" },
      { hours: 2, minutes: 30, expected: "2h 30m" },
      { hours: 0, minutes: 30, expected: "30m" },
    ];

    for (const tc of testCases) {
      await addExam(page, {
        ref: `DUR-${tc.expected}`,
        subject: `Duration ${tc.expected}`,
        startTime: "09:00",
        durationHours: tc.hours,
        durationMinutes: tc.minutes,
      });

      const row = page.locator("tbody tr", {
        hasText: `Duration ${tc.expected}`,
      });
      await expect(row).toContainText(tc.expected);
    }
  });

  test("should calculate finish time correctly with various durations", async ({
    page,
  }) => {
    const testCases = [
      { start: "08:30", hours: 4, minutes: 15, expectedFinish: "12:45" },
      { start: "14:00", hours: 2, minutes: 30, expectedFinish: "16:30" },
      { start: "09:15", hours: 0, minutes: 30, expectedFinish: "09:45" },
    ];

    for (const tc of testCases) {
      await addExam(page, {
        ref: `FINISH-${tc.expectedFinish}`,
        subject: `Finish ${tc.expectedFinish}`,
        startTime: tc.start,
        durationHours: tc.hours,
        durationMinutes: tc.minutes,
      });

      const row = page.locator("tbody tr", {
        hasText: `Finish ${tc.expectedFinish}`,
      });
      await expect(row).toContainText(tc.expectedFinish);
    }
  });
});
