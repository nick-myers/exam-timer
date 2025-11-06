import { test, expect } from '@playwright/test';

test.describe('UI Controls and Features', () => {
  test.beforeEach(async ({ page }) => {
    // Each test starts with a clean browser context (configured in playwright.config.js)
    // App loads with default centre info, ready to use
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should toggle fullscreen mode', async ({ page }) => {
    const fullscreenBtn = page.locator('.fullscreen-btn');

    // Check initial state
    await expect(fullscreenBtn).toContainText('⛶');

    // Note: Actual fullscreen API may not work in headless mode
    // We test the button functionality exists
    await fullscreenBtn.click();

    // The button should still be present and clickable
    await expect(fullscreenBtn).toBeVisible();
  });

  test('should toggle safe area mode', async ({ page }) => {
    const safeAreaBtn = page.locator('.safe-area-btn');
    const container = page.locator('.container');

    // Initially not in safe area mode
    await expect(container).not.toHaveClass(/safe-area-mode/);

    // Toggle on
    await safeAreaBtn.click();
    await expect(container).toHaveClass(/safe-area-mode/);
    await expect(page.locator('body')).toHaveClass(/safe-area-active/);

    // Toggle off
    await safeAreaBtn.click();
    await expect(container).not.toHaveClass(/safe-area-mode/);
    await expect(page.locator('body')).not.toHaveClass(/safe-area-active/);
  });

  test('should persist safe area mode after reload', async ({ page }) => {
    await page.click('.safe-area-btn');
    await expect(page.locator('.container')).toHaveClass(/safe-area-mode/);

    await page.reload();
    await expect(page.locator('.container')).toHaveClass(/safe-area-mode/);
  });

  test('should zoom in', async ({ page }) => {
    const zoomInBtn = page.locator('.zoom-in-btn');
    const resetBtn = page.locator('#zoomResetBtn');

    // Get initial zoom from button text
    const initialText = await resetBtn.textContent();
    const initialZoom = parseInt(initialText || '100%');

    // Zoom in
    await zoomInBtn.click();

    // Check new zoom level
    const newText = await resetBtn.textContent();
    const newZoom = parseInt(newText || '100%');

    // Zoom should have increased by 10
    expect(newZoom).toBe(initialZoom + 10);
  });

  test('should zoom out', async ({ page }) => {
    const zoomInBtn = page.locator('.zoom-in-btn');
    const zoomOutBtn = page.locator('.zoom-out-btn');
    const resetBtn = page.locator('#zoomResetBtn');

    // Zoom in first
    await zoomInBtn.click();
    const zoomedInText = await resetBtn.textContent();
    const zoomedIn = parseInt(zoomedInText || '100%');

    // Zoom out
    await zoomOutBtn.click();
    const zoomedOutText = await resetBtn.textContent();
    const zoomedOut = parseInt(zoomedOutText || '100%');

    // Zoom should have decreased by 10
    expect(zoomedOut).toBe(zoomedIn - 10);
  });

  test('should zoom reset', async ({ page }) => {
    const zoomInBtn = page.locator('.zoom-in-btn');
    const resetZoomBtn = page.locator('.zoom-reset-btn');
    const resetBtn = page.locator('#zoomResetBtn');

    // Zoom in multiple times
    await zoomInBtn.click();
    await zoomInBtn.click();

    // Reset zoom
    await resetZoomBtn.click();

    const zoomText = await resetBtn.textContent();
    expect(zoomText).toBe('100%');
  });


  test('should hide and show buttons', async ({ page }) => {
    const toggleBtn = page.locator('.hide-buttons-btn');
    const buttonContainer = page.locator('#buttonContainer');

    // Initially visible (not hidden)
    await expect(buttonContainer).not.toHaveClass(/hidden/);
    await expect(toggleBtn).toContainText('◀');

    // Hide buttons
    await toggleBtn.click();
    await expect(buttonContainer).toHaveClass(/hidden/);
    await expect(toggleBtn).toContainText('▶');

    // Show buttons again
    await toggleBtn.click();
    await expect(buttonContainer).not.toHaveClass(/hidden/);
    await expect(toggleBtn).toContainText('◀');
  });

  test('should toggle wake lock', async ({ page }) => {
    const wakeLockBtn = page.locator('.wake-lock-btn');

    // Button should be present
    await expect(wakeLockBtn).toBeVisible();

    // Click to toggle (may not actually work in test environment)
    await wakeLockBtn.click();

    // Button should still be clickable
    await expect(wakeLockBtn).toBeVisible();
  });

  test('should download HTML file', async ({ page }) => {
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    await page.click('.download-btn');
    const download = await downloadPromise;

    // Verify download occurred and filename is correct
    expect(download.suggestedFilename()).toBe('exam-timer.html');
  });

  test('should open website link', async ({ page }) => {
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('.website-btn')
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('nick-myers.github.io/exam-timer');
    await newPage.close();
  });

  test('should open GitHub link', async ({ page }) => {
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('.github-btn')
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('github.com/nick-myers/exam-timer');
    await newPage.close();
  });

  test('should show changelog modal', async ({ page }) => {
    await page.click('.changelog-btn');

    const modal = page.locator('#changelogModal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Changelog');

    // Close modal by clicking outside or using Escape key
    await page.keyboard.press('Escape');
    // Alternative: Wait a bit and verify modal closed
    await page.waitForTimeout(500);
  });

  test('should display current date', async ({ page }) => {
    const dateDisplay = page.locator('#displayDate');
    await expect(dateDisplay).toBeVisible();

    // Should contain a date
    const dateText = await dateDisplay.textContent();
    expect(dateText).toBeTruthy();
    expect(dateText?.length).toBeGreaterThan(0);
  });

  test('should display current time and update', async ({ page }) => {
    const clockDisplay = page.locator('#displayClock');
    await expect(clockDisplay).toBeVisible();

    // Should show time format HH:MM:SS
    const initialTime = await clockDisplay.textContent();
    expect(initialTime).toMatch(/\d{2}:\d{2}:\d{2}/);

    // Wait and verify time updates
    await page.waitForTimeout(2000);
    const updatedTime = await clockDisplay.textContent();
    expect(updatedTime).not.toBe(initialTime);
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Test Escape to close modals
    await page.click('.add-exam-btn');
    await expect(page.locator('#examModal')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#examModal')).not.toBeVisible();
  });

  test('should be responsive to window resize', async ({ page }) => {
    // Test at different viewport sizes
    const sizes = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1024, height: 768 },
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);

      // Verify main elements are still visible
      await expect(page.locator('.header')).toBeVisible();
      await expect(page.locator('.table-container')).toBeVisible();
      await expect(page.locator('.button-container')).toBeVisible();
    }
  });

  test('should handle rapid button clicks', async ({ page }) => {
    const safeAreaBtn = page.locator('.safe-area-btn');

    // Click rapidly
    for (let i = 0; i < 5; i++) {
      await safeAreaBtn.click({ delay: 50 });
    }

    // Should still be in valid state (odd number of clicks = on)
    await expect(page.locator('.container')).toHaveClass(/safe-area-mode/);
  });

});
