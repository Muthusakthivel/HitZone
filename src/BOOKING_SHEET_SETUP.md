# 📝 Booking Form - Google Sheets Setup

## உங்கள் Google Sheet-ல் Booking Data Save பண்ண

### Step 1: Google Apps Script Setup
1. உங்கள் Google Sheet-ல் போங்கள்
2. **Extensions → Apps Script** click பண்ணுங்கள்
3. Default code-ஐ delete பண்ணி இந்த code-ஐ paste பண்ணுங்கள்:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.name,
      data.phone,
      data.date,
      data.time,
      data.players,
      data.timestamp,
      data.formattedDate,
      data.formattedTime,
      data.rate
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 2: Deploy as Web App
1. **Deploy → New deployment** click பண்ணுங்கள்
2. **Web app** select பண்ணுங்கள்
3. **Execute as**: "Me" select பண்ணுங்கள்
4. **Who has access**: "Anyone" select பண்ணுங்கள்
5. **Deploy** click பண்ணுங்கள்
6. Web app URL-ஐ copy பண்ணுங்கள்

### Step 3: Website Code Update
1. `src/script.js` file-ஐ open பண்ணுங்கள்
2. Line 245-ல் உள்ள URL-ஐ replace பண்ணுங்கள்:
   ```javascript
   const GOOGLE_SHEETS_URL = 'YOUR_WEB_APP_URL_HERE';
   ```

### Step 4: Test
1. Website-ல் booking form fill பண்ணுங்கள்
2. Submit பண்ணுங்கள்
3. உங்கள் Google Sheet-ல் new row add ஆகியிருக்கும்

## 📋 Data Fields

| Column | Description |
|--------|-------------|
| A | Name |
| B | Phone |
| C | Date |
| D | Time |
| E | Players |
| F | Timestamp |
| G | Formatted Date |
| H | Formatted Time |
| I | Rate |

## ✅ Ready!
இப்போது booking form submit பண்ணும்போது automatically Google Sheet-ல் data save ஆகும்!
