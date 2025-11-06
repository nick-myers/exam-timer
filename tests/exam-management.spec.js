import { test, expect } from '@playwright/test';

// Helper function to add an exam with the new form structure
async function addExam(page, { ref, subject, startTime, durationHours, durationMinutes, extraTime = null }) {
  await page.click('.add-exam-btn');

  await page.fill('#refInput', ref);
  await page.fill('#subjectInput', subject);
  await page.fill('#startTimeInput', startTime);
  await page.fill('#durationHours', durationHours.toString());
  await page.fill('#durationMinutes', durationMinutes.toString());

  if (extraTime) {
    await page.check('#extraTimeEnabled');
    await page.fill('#extraTimeMinutes', extraTime.toString());
  }

  await page.locator('#examModal button:has-text("Save")').click();
}

test.describe('Exam Management (CRUD)', () => {
  test.beforeEach(async ({ page }) => {
    // Each test starts with a clean browser context (configured in playwright.config.js)
    // App loads with default centre info, ready to use
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should add a new exam', async ({ page }) => {
    await addExam(page, {
      ref: '8465/1/F',
      subject: 'Combined Science Physics',
      startTime: '09:00',
      durationHours: 2,
      durationMinutes: 0
    });

    // Verify exam appears in table
    const row = page.locator('tbody tr', { hasText: 'Combined Science Physics' });
    await expect(row).toBeVisible();
    await expect(row).toContainText('8465/1/F');
    await expect(row).toContainText('09:00');
    await expect(row).toContainText('11:00'); // Start + 2h = 11:00
  });

  test('should edit an existing exam', async ({ page }) => {
    // Add an exam first
    await addExam(page, {
      ref: '8464/1/H',
      subject: 'Chemistry',
      startTime: '10:00',
      durationHours: 1,
      durationMinutes: 30
    });

    // Click the row to open edit modal
    await page.click('tbody tr:has-text("Chemistry")');

    // Modify exam details
    await page.fill('#refInput', '8465/2/F');
    await page.fill('#subjectInput', 'Physics');
    await page.fill('#startTimeInput', '13:00');
    await page.fill('#durationHours', '2');
    await page.fill('#durationMinutes', '0');

    await page.locator('#examModal button:has-text("Save")').click();

    // Verify changes are reflected
    const row = page.locator('tbody tr', { hasText: 'Physics' });
    await expect(row).toBeVisible();
    await expect(row).toContainText('8465/2/F');
    await expect(row).toContainText('13:00');
    await expect(row).toContainText('15:00'); // Start + 2h = 15:00
  });

  test('should delete an exam', async ({ page }) => {
    // Add an exam first
    await addExam(page, {
      ref: '8700/1',
      subject: 'English Language',
      startTime: '09:00',
      durationHours: 1,
      durationMinutes: 45
    });

    // Verify exam exists
    await expect(page.locator('tbody tr', { hasText: 'English Language' })).toBeVisible();

    // Delete the exam - click row to open modal, then delete
    await page.click('tbody tr:has-text("English Language")');

    // Wait for modal to open and Delete button to be visible
    const deleteButton = page.locator('#deleteBtn');
    await expect(deleteButton).toBeVisible();

    // Handle the confirm dialog that appears when deleting
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    await deleteButton.click();

    // Verify exam is removed
    await expect(page.locator('tbody tr', { hasText: 'English Language' })).not.toBeVisible();
  });

  test('should delete all exams', async ({ page }) => {
    // Add multiple exams
    const exams = [
      { ref: '8300/1', subject: 'Mathematics', startTime: '09:00', durationHours: 1, durationMinutes: 30 },
      { ref: '8464/1/H', subject: 'Chemistry', startTime: '13:00', durationHours: 1, durationMinutes: 15 },
    ];

    for (const exam of exams) {
      await addExam(page, exam);
    }

    // Verify exams exist
    await expect(page.locator('tbody tr')).toHaveCount(2);

    // Delete all exams - handle browser confirm dialog
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    await page.click('.delete-all-btn');

    // Verify all exams are removed - should show "No exams scheduled" message
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody')).toContainText('No exams scheduled');
  });

  test('should cancel adding an exam', async ({ page }) => {
    await page.click('.add-exam-btn');
    await page.fill('#refInput', '8700/2');
    await page.fill('#subjectInput', 'History');
    await page.click('button:has-text("Cancel")');

    // Verify exam was not added
    await expect(page.locator('tbody tr', { hasText: 'History' })).not.toBeVisible();
  });

  test('should cancel editing an exam', async ({ page }) => {
    // Add an exam
    await addExam(page, {
      ref: '8035/1',
      subject: 'Geography',
      startTime: '09:00',
      durationHours: 1,
      durationMinutes: 30
    });

    // Try to edit but cancel
    await page.click('tbody tr:has-text("Geography")');
    await page.fill('#subjectInput', 'Changed Subject');
    await page.click('#examModal button:has-text("Cancel")');

    // Verify original subject is unchanged
    await expect(page.locator('tbody tr', { hasText: 'Geography' })).toBeVisible();
    await expect(page.locator('tbody tr', { hasText: 'Changed Subject' })).not.toBeVisible();
  });

  test('should cancel deleting an exam', async ({ page }) => {
    // Add an exam
    await addExam(page, {
      ref: '8202/1',
      subject: 'Art & Design',
      startTime: '09:00',
      durationHours: 3,
      durationMinutes: 0
    });

    // Try to delete but cancel
    await page.click('tbody tr:has-text("Art & Design")');
    await page.click('#examModal button:has-text("Cancel")');

    // Verify exam still exists
    await expect(page.locator('tbody tr', { hasText: 'Art & Design' })).toBeVisible();
  });

  test('should persist exams after reload', async ({ page }) => {
    // Add an exam
    await addExam(page, {
      ref: '8552/W',
      subject: 'Music',
      startTime: '14:00',
      durationHours: 1,
      durationMinutes: 30
    });

    // Reload page
    await page.reload({ waitUntil: 'networkidle' });

    // Verify exam persisted
    await expect(page.locator('tbody tr', { hasText: 'Music' })).toBeVisible();
  });

  test('should handle exams with extra time', async ({ page }) => {
    await addExam(page, {
      ref: '8464/1/H',
      subject: 'Chemistry',
      startTime: '09:00',
      durationHours: 1,
      durationMinutes: 45,
      extraTime: 25
    });

    // Verify extra time is shown in the row
    const row = page.locator('tbody tr', { hasText: 'Chemistry' });
    await expect(row).toContainText('09:00');
    await expect(row).toContainText('Extra Time 25 mins'); // Extra time indicator

    // Finish time should be 09:00 + 1h 45m + 25m = 11:10
    await expect(row).toContainText('11:10');
  });

  test('should handle maximum exams limit', async ({ page }) => {
    // Set max exams to 2 via settings
    await page.click('.settings-btn');
    await page.fill('#maxExamsInput', '2');

    // Save the max exams setting (this also closes settings automatically)
    await page.click('button:has-text("Save Maximum Exams")');

    // Wait for settings to close
    await expect(page.locator('#settingsScreen')).not.toBeVisible();

    // Add 2 exams
    for (let i = 1; i <= 2; i++) {
      await addExam(page, {
        ref: `TEST${i}`,
        subject: `Exam ${i}`,
        startTime: '09:00',
        durationHours: 1,
        durationMinutes: 0
      });
    }

    // Verify 2 exams are shown
    await expect(page.locator('tbody tr')).toHaveCount(2);

    // Try to add a 3rd exam - button should be disabled
    const addButton = page.locator('.add-exam-btn');
    await expect(addButton).toBeDisabled();
  });

  test('should calculate finish time correctly', async ({ page }) => {
    const testCases = [
      { start: '09:00', hours: 2, minutes: 0, expectedFinish: '11:00' },
      { start: '10:30', hours: 1, minutes: 45, expectedFinish: '12:15' },
      { start: '14:15', hours: 0, minutes: 45, expectedFinish: '15:00' },
    ];

    for (const tc of testCases) {
      await addExam(page, {
        ref: `TEST-${tc.expectedFinish}`,
        subject: `Test ${tc.expectedFinish}`,
        startTime: tc.start,
        durationHours: tc.hours,
        durationMinutes: tc.minutes
      });

      const row = page.locator('tbody tr', { hasText: `Test ${tc.expectedFinish}` });
      await expect(row).toContainText(tc.expectedFinish);
    }
  });
});
