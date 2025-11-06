# Exam Timer - Test Suite

This directory contains the automated test suite for the Exam Timer application using Playwright.

## Test Structure

The test suite is organized into four main files:

1. **settings.spec.js** - Tests for settings and persistence

   - Centre information save/load
   - Color customization
   - Max exams configuration
   - Demo data loading
   - Settings reset functionality

2. **exam-management.spec.js** - Tests for exam CRUD operations

   - Adding new exams
   - Editing existing exams
   - Deleting individual exams
   - Deleting all exams
   - Exam persistence across reloads
   - Exam sorting by start time
   - Extra time handling
   - Maximum exam limits

3. **ui-controls.spec.js** - Tests for UI controls and features

   - Fullscreen mode
   - TV safe area mode
   - Zoom controls (in, out, reset)
   - Button hide/show functionality
   - Wake lock
   - Download exam schedule
   - External links (website, GitHub)
   - Changelog modal
   - Date/time display
   - Keyboard shortcuts
   - Responsive design

4. **timer-display.spec.js** - Tests for timer calculations and display
   - Duration calculations
   - Extra time display
   - Time status colors
   - Countdown for upcoming exams
   - Progress bars for running exams
   - 24-hour time formatting
   - Timer updates

## Running Tests

### Prerequisites

```bash
npm install
```

### Run all tests (headless)

```bash
npm test
```

### Run tests with browser UI visible

```bash
npm run test:headed
```

### Run tests with Playwright UI (interactive mode)

```bash
npm run test:ui
```

### Debug tests

```bash
npm run test:debug
```

### View last test report

```bash
npm run test:report
```

## Continuous Integration

Tests automatically run on:

- Every push to `main` branch
- Every pull request to `main` branch

See `.github/workflows/test.yml` for CI configuration.

## Test Coverage

The test suite covers:

- ✅ Settings persistence (localStorage)
- ✅ All CRUD operations for exams
- ✅ UI controls and interactions
- ✅ Timer calculations and display
- ✅ Color customization
- ✅ Exam sorting
- ✅ Extra time calculations
- ✅ Modal dialogs
- ✅ External links
- ✅ Data import/export
- ✅ Responsive behavior

## Writing New Tests

When adding new features, follow these guidelines:

1. Add tests to the appropriate spec file based on functionality
2. Use descriptive test names that explain what is being tested
3. Clean localStorage before each test to ensure isolation
4. Use data-testid attributes in HTML for more reliable selectors
5. Test both success and error paths
6. Verify persistence across page reloads where applicable

## Best Practices

- Each test should be independent and not rely on other tests
- Use `test.beforeEach()` to set up common state
- Clean up after tests (localStorage, etc.)
- Use meaningful assertions with clear error messages
- Test user workflows, not implementation details

## Troubleshooting

### Tests failing locally but passing in CI (or vice versa)

- Check viewport sizes - CI may use different default sizes
- Verify timing - CI may be slower, adjust timeouts if needed
- Check browser versions - ensure local Playwright is up to date

### Flaky tests

- Add explicit waits for elements to be visible/ready
- Use Playwright's auto-waiting features
- Avoid hard-coded timeouts where possible

### Test not finding elements

- Use `await expect(locator).toBeVisible()` before interactions
- Check that modals/elements are actually rendered
- Verify selectors match the actual HTML structure
