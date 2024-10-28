// tagui_script.tag

// Step 1: Open the Google Spreadsheet
// Replace YOUR_SPREADSHEET_ID with your actual spreadsheet ID.
https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit

// Step 2: Copy data from Sheet1
live // Activate live mode to interact with Google Sheets
click `//*[@id="sheet-button-Sheet1"]` // Click on Sheet1 tab

// Wait until the content is fully loaded
wait 2

// Highlight the data in Sheet1, from A1 to the end of data in column D
click `//*[@id="t-name-box"]/input` // Focus on the name box
type `//*[@id="t-name-box"]/input` as 'A1:D' + [enter] // Select range A1:D
keyboard [ctrl] + "c" // Copy data

// Step 3: Paste data into Sheet2
click `//*[@id="sheet-button-Sheet2"]` // Click on Sheet2 tab
wait 2
click `//*[@id="t-name-box"]/input` // Focus on the name box
type `//*[@id="t-name-box"]/input` as 'A1' + [enter] // Move to cell A1
keyboard [ctrl] + "v" // Paste data

// Step 4: Confirmation of data paste
echo "Data successfully copied from Sheet1 to Sheet2"

// Step 5 (Bonus): Save data to PostgreSQL database
// This step is optional and requires a PostgreSQL setup.

load postgres library
postgres connect "host=localhost dbname=yourdb user=youruser password=yourpassword"
postgres execute "COPY yourtable FROM 'path_to_your_csv_file.csv' DELIMITER ',' CSV HEADER;"
postgres close

// End of script
