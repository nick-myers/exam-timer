import { test, expect } from '@playwright/test';

test.describe('Settings and Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Each test starts with a clean browser context (configured in playwright.config.js)
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should load with default centre information', async ({ page }) => {
    // App loads with default centre info, not settings screen
    await expect(page.locator('#mainApp')).toBeVisible();
    await expect(page.locator('#displayCentre')).toContainText('The Marlborough Science Academy');
    await expect(page.locator('#displayCentre')).toContainText('17533');
  });

  test('should save and persist centre information', async ({ page }) => {
    const centreName = 'Test Exam Centre';
    const centreNumber = '12345';

    // Open settings
    await page.click('.settings-btn');

    // Fill in centre information
    await page.fill('#centreNameInput', centreName);
    await page.fill('#centreNumberInput', centreNumber);

    // Click Save Centre Details button (this closes settings automatically)
    await page.click('button:has-text("Save Centre Details")');

    // Wait for settings to close
    await expect(page.locator('#settingsScreen')).not.toBeVisible();

    // Verify updated info is displayed
    await expect(page.locator('#displayCentre')).toContainText(centreName);
    await expect(page.locator('#displayCentre')).toContainText(centreNumber);

    // Reload and verify persistence
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('#displayCentre')).toContainText(centreName);
    await expect(page.locator('#displayCentre')).toContainText(centreNumber);
  });

  test('should open settings from main app', async ({ page }) => {
    await page.click('.settings-btn');
    await expect(page.locator('#settingsScreen')).toBeVisible();
  });

  test('should close settings with X button', async ({ page }) => {
    await page.click('.settings-btn');
    await expect(page.locator('#settingsScreen')).toBeVisible();

    await page.click('.close-settings-btn');
    await expect(page.locator('#mainApp')).toBeVisible();
    await expect(page.locator('#settingsScreen')).not.toBeVisible();
  });

  test('should save and persist custom colors', async ({ page }) => {

    await page.click('.settings-btn');

    // Change colors
    const primaryColor = '#ff0000';
    const secondaryColor = '#00ff00';
    const accentColor = '#0000ff';

    await page.fill('#primaryColorInput', primaryColor);
    await page.fill('#secondaryColorInput', secondaryColor);
    await page.fill('#accentColorInput', accentColor);

    // Close settings
    await page.click('.close-settings-btn');

    // Check CSS variables are applied
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        primary: getComputedStyle(root).getPropertyValue('--primary-color').trim(),
        secondary: getComputedStyle(root).getPropertyValue('--secondary-color').trim(),
        accent: getComputedStyle(root).getPropertyValue('--accent-color').trim(),
      };
    });

    expect(rootStyles.primary).toBe(primaryColor);
    expect(rootStyles.secondary).toBe(secondaryColor);
    expect(rootStyles.accent).toBe(accentColor);

    // Reload and verify persistence
    await page.reload();
    const reloadedStyles = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        primary: getComputedStyle(root).getPropertyValue('--primary-color').trim(),
        secondary: getComputedStyle(root).getPropertyValue('--secondary-color').trim(),
        accent: getComputedStyle(root).getPropertyValue('--accent-color').trim(),
      };
    });

    expect(reloadedStyles.primary).toBe(primaryColor);
    expect(reloadedStyles.secondary).toBe(secondaryColor);
    expect(reloadedStyles.accent).toBe(accentColor);
  });

  test('should reset colors to default', async ({ page }) => {

    await page.click('.settings-btn');

    // Change colors first
    await page.fill('#primaryColorInput', '#ff0000');
    await page.click('button:has-text("Reset Colors")');

    // Verify default colors are restored
    const primaryValue = await page.inputValue('#primaryColorInput');
    expect(primaryValue).toBe('#990000');
  });

  test('should save and persist max exams setting', async ({ page }) => {

    await page.click('.settings-btn');

    // Change max exams to a valid value (max is 12)
    await page.fill('#maxExamsInput', '10');

    // Click Save Maximum Exams button (this closes settings automatically)
    await page.click('button:has-text("Save Maximum Exams")');

    // Wait for settings to close
    await expect(page.locator('#settingsScreen')).not.toBeVisible();

    // Reload and verify persistence
    await page.reload();
    await page.click('.settings-btn');
    const maxExams = await page.inputValue('#maxExamsInput');
    expect(maxExams).toBe('10');
  });

  test('should load demo data', async ({ page }) => {

    await page.click('.settings-btn');
    await page.click('button:has-text("Load Demo Data")');

    // Wait for settings to close automatically
    await expect(page.locator('#settingsScreen')).not.toBeVisible();

    // Verify demo exams are loaded
    const rows = page.locator('tbody tr');
    await expect(rows).not.toHaveCount(1); // Should be more than just "No exams scheduled"
  });

  test('should reset centre information', async ({ page }) => {
    // Open settings, change values, then reset
    await page.click('.settings-btn');
    await page.fill('#centreNameInput', 'Test Centre');
    await page.fill('#centreNumberInput', '12345');

    // Reset to defaults
    await page.click('button:has-text("Reset to Default")');

    // Verify fields are reset to defaults
    await expect(page.locator('#centreNameInput')).toHaveValue('The Marlborough Science Academy');
    await expect(page.locator('#centreNumberInput')).toHaveValue('17533');
  });

  test('should reset max exams to default', async ({ page }) => {

    await page.click('.settings-btn');

    // First save a non-default value
    await page.fill('#maxExamsInput', '10');
    await page.click('button:has-text("Save Maximum Exams")');

    // Wait for settings to close
    await expect(page.locator('#settingsScreen')).not.toBeVisible();

    // Reopen settings
    await page.click('.settings-btn');

    // Now reset to default - find the reset button that's near the max exams input
    // There are two "Reset to Default" buttons, so we need to be specific
    await page.locator('button:has-text("Reset to Default")').nth(1).click();

    // Wait for settings to close
    await expect(page.locator('#settingsScreen')).not.toBeVisible();

    // Reopen settings to verify the value
    await page.click('.settings-btn');
    const maxExams = await page.inputValue('#maxExamsInput');
    expect(maxExams).toBe('6');
  });
});
