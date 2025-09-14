# 🏆 Tournament Data Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet or upload your Excel file
3. Set up columns exactly like this:

| A | B | C | D | E |
|---|---|---|---|---|
| EVENT NAME | DATE | TIME | LOCATION | COLOR |
| Beginner Tournament | Jan 15 | 10:00 AM | Salem | purple |
| Advanced Championship | Jan 20 | 2:00 PM | Erode | blue |
| Mixed Doubles League | Jan 25 | 9:00 AM | Coimbatore | green |

### Step 2: Publish Sheet
1. Click **File → Share → Publish to web**
2. Select **"Entire document"**
3. Choose **"Comma-separated values (.csv)"**
4. Click **"Publish"**
5. Copy the URL (looks like: `https://docs.google.com/spreadsheets/d/1ABC123.../export?format=csv&gid=0`)

### Step 3: Update Code
1. Open `src/script.js`
2. Find line 307: `const SHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0';`
3. Replace `YOUR_SHEET_ID` with your actual sheet ID from the URL
4. Save the file

### Step 4: Test
1. Open your website
2. Check browser console (F12) for success/error messages
3. Tournament table should update automatically

## 📋 Column Guidelines

### Required Columns:
- **EVENT NAME**: Tournament title
- **DATE**: Format like "Jan 15", "Feb 20", etc.
- **TIME**: Format like "10:00 AM", "2:00 PM", etc.
- **LOCATION**: City or venue name

### Optional Column:
- **COLOR**: purple, blue, green (auto-assigned if empty)

## 🔄 How It Works

1. **You update Excel/Google Sheets** → Tournament data changes
2. **Website automatically fetches** → New data from published CSV
3. **Table updates instantly** → No manual website updates needed

## 🛠️ Troubleshooting

### If tournaments don't show:
1. Check browser console (F12) for error messages
2. Verify sheet is published as CSV
3. Ensure sheet URL is correct in code
4. Make sure sheet is publicly accessible

### If you see "Using fallback tournament data":
- The Google Sheets API failed
- Check your internet connection
- Verify the sheet URL is correct
- Make sure the sheet is published

## 📱 Mobile Friendly
- Works on all devices
- Responsive table design
- Fast loading

## 🎨 Color Options
- **purple**: Primary brand color
- **blue**: Secondary orange
- **green**: Accent orange
- **auto**: System assigns colors if not specified

---

**Need help?** Check the browser console (F12) for detailed error messages.
