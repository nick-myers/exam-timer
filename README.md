# Exam Timer - Digital Whiteboard for Exam Rooms

A simple, safe, and offline-friendly exam timer designed for displaying exam schedules on screens in exam rooms.

## What is this?

This is a single HTML file that displays exam information (reference numbers, subject names, clock, start times, and finish times) in a large, easy-to-read format. It's designed to be displayed on a screen or projector in exam rooms so students and invigilators can quickly see when exams start and finish.

## How to use

- Access via <https://nick-myers.github.io/exam-timer/>
- Download the `index.html` and open it in a Web Browser
  - You can download this by accessing the file via <https://nick-myers.github.io/exam-timer/> and clicking the download button (💾), or,
  - Download it from this project by going to <https://github.com/nick-myers/exam-timer/blob/main/index.html> and clicking Download raw file

## Key Features

- **Large, readable text** - Designed to be visible from across a room
- **Adjustable text size** - Built-in zoom controls (50%-200%) with persistent settings
- **Fullscreen mode** - Maximize screen space for better visibility
- **Automatic time calculations** - Calculates finish times including extra time allowances (default 25%, customizable)
- **Screen wake lock** - Prevents the screen from going to sleep or showing screensaver
- **Collapsible controls** - Hide control buttons for a cleaner display during exams
- **Sticky table header** - Header remains visible when scrolling through exams
- **Demo data** - Load Harry Potter themed sample exams to test the application
- **Offline-first** - Works completely offline once loaded, no internet connection required
- **No installation needed** - Just open the HTML file in any modern web browser
- **Private and secure** - All data stays on your device, nothing is sent to external servers

## Safety & Privacy Information (For IT Staff)

### Security

- **Single self-contained file** - The entire application is in one HTML file with no external dependencies
- **No network requests** - After initial load, makes zero network requests
- **No data transmission** - All exam data is stored locally in the browser's localStorage only
- **No tracking or analytics** - Does not include any tracking, analytics, or telemetry code
- **Client-side only** - Pure HTML/CSS/JavaScript with no backend server required

### Browser Requirements

- Works in any modern browser (Chrome, Firefox, Safari, Edge)
- Requires JavaScript to be enabled
- Uses standard Web APIs:
  - `localStorage` for saving exam data, settings, and preferences between sessions
  - Screen Wake Lock API (optional, for preventing screensaver)
  - Fullscreen API (optional, for fullscreen mode)

### Data Storage

All information is stored in the browser's localStorage on the device, including:

- Exam data (references, subjects, times, extra time settings)
- Centre details (name and number)
- Color preferences
- Display preferences (zoom level, control panel visibility)

This means:

- Data never leaves the device
- Data is specific to that browser on that device
- Clearing browser data will reset the application
- No server, database, or cloud storage is involved
- Use the download button to backup your configuration

### Permissions

The application may request one optional permission:

- **Screen Wake Lock** - Prevents the screen from sleeping during exams. This is requested automatically when the page loads but can be toggled off by the user.

## How to Use

### First Time Setup

1. Download or copy the `index.html` file to your device
2. Open it in a web browser (double-click the file, or right-click > Open With > Browser)
3. The application will load with default settings for Marlborough Science Academy

### Configuring Settings

1. Click the **gear icon** (⚙️) in the control panel (bottom left corner)
2. Update the following if needed:
   - **Centre Name** - Your school/exam centre name
   - **Centre Number** - Your exam centre number
   - **Primary/Secondary/Accent Colors** - Customize the color scheme
   - **Demo Data** - Load sample exam data to test the application (only works when no exams exist)
3. Click **Save Centre Details** to save your changes
4. Click **Reset to Default** to restore default centre information

### Adding Exams

1. Click the **+ button** in the bottom right corner
2. Fill in the exam details:
   - **Reference** - Exam board reference (e.g., "EF18/3/81")
   - **Subject** - Exam name (e.g., "MATHS (F)")
   - **Start Time** - When the exam starts (automatically populated after the first exam)
   - **Duration** - Hours and minutes for the exam length (finish time calculated automatically)
   - **Extra Time** - Enable if extra time is allowed
     - Leave blank for automatic 25% calculation
     - Enter custom minutes (1-59) if different
     - Click "Reset to Auto" button to revert to automatic calculation
3. Click **Save Exam**

**Notes:**
- After adding your first exam, subsequent exams will automatically use the same start time (since most exams in a room start together)
- Maximum of 5 exams can be displayed at once
- Hover over the disabled + button to see why you can't add more exams

### During Exams

The main screen displays:

- **Live Clock** - Large, always-visible clock showing current time and date at the top of the screen
- **Centre Information** - Your exam centre name and number (if configured)
- **Exam Table** - All scheduled exams with:
  - Reference number
  - Subject name
  - Duration (with extra time highlighted in color)
  - Start time
  - Finish time (with extra time finish shown separately if applicable)
- **Color Coding** - Extra time information is highlighted in your configured accent color (default: red)
- **Auto Wake** - The screen will stay awake automatically (green 💡 icon indicates this is active)

### Managing Exams

- **Edit an exam** - Click on any row in the table
- **Delete an exam** - Click on a row, then click the Delete button in the edit form
- **Delete all exams** - Click the 🗑️ icon in the bottom left corner
- **Download/backup** - Click the 💾 icon to download the HTML file with your current exam data

### Display Controls

The application includes a control panel in the bottom left corner with several buttons to help you optimize the display:

#### Show/Hide Controls

- Click the **◀ button** on the right edge of the control panel to hide all buttons for a cleaner display
- Click the **▶ button** (when hidden) to show the controls again
- Control visibility state is saved and restored when you reload the page

#### Settings and Management

- **⚙ (Settings)** - Open settings to configure centre details, colors, and load demo data
- **🗑️ (Delete All)** - Remove all exams from the schedule (with confirmation)

#### Display Options

- **⛶ (Fullscreen)** - Expand the display to fill your entire screen
  - Gray icon = Normal windowed mode
  - Blue icon = Fullscreen mode active
  - Press ESC key to exit fullscreen at any time

#### Text Size Controls

Adjust the text size to suit your screen and viewing distance:

- **− button** - Decrease text size (minimum 50%)
- **100% button** - Shows current zoom level; click to reset to default size
- **+ button** - Increase text size (maximum 200%)
- Changes apply to all text and images on the screen
- Zoom level is saved and persists across page reloads
- Table header remains sticky when content scrolls

#### Keep Awake Feature

The application automatically prevents your screen from going to sleep:

- **Green 💡 icon** - Screen will stay awake
- **Gray 💡 icon** - Screen sleep prevention is off
- Click the icon to toggle this feature on/off

#### Quick Links

- **💾 (Download)** - Download the HTML file with your current exam data as backup
- **🌐 (Website)** - Open the hosted version at nick-myers.github.io/exam-timer
- **GitHub icon** - View the source code repository

## Troubleshooting

### Q: The screen is still going to sleep

- Check that the 💡 icon is green
- Try clicking it to turn it off and on again
- Some browsers or devices may not support the Wake Lock API - in this case, adjust your device's sleep settings manually

### Q: My exams disappeared

- Exams are saved in browser storage. If you clear your browser data/cookies, the exams will be deleted
- Use the download button (💾) to backup your exam schedule before clearing browser data
- Make sure you're using the same browser and not in private/incognito mode

### Q: The colors are wrong

- Click the gear icon (⚙️) and adjust the Primary and Secondary colors in settings

### Q: Text is too small/large

- Use the built-in zoom controls (− and + buttons) in the control panel
- The text size is also responsive and adjusts to screen size automatically
- Try fullscreen mode for a larger display area
- Your zoom preference is saved automatically

### Q: I can't add more exams

- The application supports a maximum of 5 exams at once
- Hover over the disabled + button to see the "Maximum 5 exams" message
- Delete one or more exams to add new ones

### Q: How do I try out the application without adding real exam data?

- Open Settings (⚙ icon)
- Click "Load Demo Data" button
- This will load 5 Harry Potter themed sample exams
- Demo data can only be loaded when no exams exist (delete all exams first if needed)

## Technical Details (For IT Staff)

### File Structure

- Single HTML file containing embedded CSS and JavaScript
- Includes base64-encoded logo image (Marlborough Science Academy logo)
- No external resources or dependencies

### Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Web Storage API (localStorage)
- Screen Wake Lock API (optional feature)

### Browser Compatibility

- Chrome/Edge: Fully supported
- Firefox: Fully supported
- Safari: Fully supported (Wake Lock may vary by version)
- Minimum requirements: Any browser released in the last 3-4 years

### Source Code Review

The entire application source code is visible by opening the HTML file in any text editor. It contains:

- No obfuscated or minified code
- No external script loading
- No data exfiltration
- No advertising or tracking code
- Clear, readable JavaScript functions

## License

This is a custom tool created for educational use. Feel free to modify the HTML file to suit your needs.

This project is released under [The Unlicense](https://unlicense.org/).
