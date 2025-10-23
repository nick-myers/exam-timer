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
- **Automatic time calculations** - Calculates finish times including extra time allowances
- **Screen wake lock** - Prevents the screen from going to sleep or showing screensaver
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
  - `localStorage` for saving exam data between sessions
  - Screen Wake Lock API (optional, for preventing screensaver)

### Data Storage

All exam information (references, subjects, times) is stored in the browser's localStorage on the device. This means:

- Data never leaves the device
- Data is specific to that browser on that device
- Clearing browser data will reset the application
- No server, database, or cloud storage is involved

### Permissions

The application may request one optional permission:

- **Screen Wake Lock** - Prevents the screen from sleeping during exams. This is requested automatically when the page loads but can be toggled off by the user.

## How to Use

### First Time Setup

1. Download or copy the `index.html` file to your device
2. Open it in a web browser (double-click the file, or right-click > Open With > Browser)
3. The application will load with default settings for Marlborough Science Academy

### Configuring Settings

1. Click the **gear icon** (⚙️) in the bottom left corner
2. Update the following if needed:
   - **Centre Name** - Your school/exam centre name
   - **Centre Number** - Your exam centre number
   - **Primary Color** - Main color for headers
   - **Secondary Color** - Color for extra time information
3. Click **Save Settings**

### Adding Exams

1. Click the **+ button** in the bottom left corner
2. Fill in the exam details:
   - **Reference** - Exam board reference (e.g., "EF18/3/81")
   - **Subject** - Exam name (e.g., "MATHS (F)")
   - **Start Time** - When the exam starts (automatically populated after the first exam)
   - **Finish Time** - When the exam ends
   - **Extra Time** - Tick if extra time is allowed, specify minutes if different from 25%
3. Click **Save Exam**

**Note:** After adding your first exam, subsequent exams will automatically use the same start time (since most exams in a room start together). You can change this if needed.

### During Exams

- The main screen displays:
  - Current date and time (top)
  - Centre name and number (top)
  - Table of exams with reference, subject, start time, and finish time
  - Extra time information is shown in color (default: orange/red)
- The screen will stay awake automatically (green 💡 icon indicates this is active)

### Managing Exams

- **Edit an exam** - Click on any row in the table
- **Delete an exam** - Click on a row, then click the Delete button in the edit form
- **Delete all exams** - Click the 🗑️ icon in the bottom left corner
- **Download/backup** - Click the 💾 icon to download your exam schedule as a JSON file

### Display Controls

The application includes several controls in the bottom left corner to help you optimize the display:

#### Wake Lock Feature

The application automatically prevents your screen from going to sleep or showing a screensaver:

- **Green 💡 icon** = Screen will stay awake
- **Gray 💡 icon** = Screen sleep prevention is off
- Click the icon to toggle this feature on/off

#### Fullscreen Mode

Use the fullscreen button (⛶) to expand the display to fill your entire screen:

- **Gray ⛶ icon** = Normal windowed mode
- **Blue ⛶ icon** = Fullscreen mode is active
- Click the icon to toggle fullscreen on/off
- Press ESC key to exit fullscreen mode at any time

#### Text Size Controls

Adjust the text size to suit your screen and viewing distance:

- **− button** = Decrease text size
- **100% button** = Shows current zoom level; click to reset to default size
- **+ button** = Increase text size
- Changes apply to all text on the screen for better readability

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

- The text size is responsive and adjusts to screen size automatically
- Try full-screen mode (usually F11 key) or adjust your browser zoom (Ctrl/Cmd +/-)

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
