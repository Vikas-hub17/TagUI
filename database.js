// database.js
const { Client } = require('pg');
const fs = require('fs');
const { google } = require('googleapis');

// PostgreSQL connection setup
const client = new Client({
    user: 'postgres',       // Replace with your PostgreSQL username
    host: 'localhost',           // Replace with your host, usually 'localhost'
    database: 'Actuals',   // Replace with your PostgreSQL database name
    password: 'admin',   // Replace with your PostgreSQL password
    port: 5432,                  // Default PostgreSQL port
});

// Connect to PostgreSQL
client.connect();

// Google Sheets API setup
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const { client_secret, client_id, redirect_uris } = credentials.web;
const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Read token and authenticate
const tokenPath = 'token.json';
auth.setCredentials(JSON.parse(fs.readFileSync(tokenPath)));
const sheets = google.sheets({ version: 'v4', auth });

// Function to read data from Sheet 1 and save to PostgreSQL
function saveToDatabase() {
    const spreadsheetId = '18kSw9Y6k-z1yjtzfzHykGYHJf8qlohs1Fp1RvSQv7TY'; // Replace with your Google Spreadsheet ID

    // Read data from Sheet 1
    sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1',
    }, (err, res) => {
        if (err) return console.log('API Error: ' + err);

        const rows = res.data.values;

        if (rows.length) {
            console.log('Saving data to PostgreSQL...');
            
            // Iterate through rows and insert into PostgreSQL
            rows.forEach((row) => {
                // Assuming the Google Sheet has 3 columns: name, age, and city
                const query = 'INSERT INTO info (name, age, city) VALUES ($1, $2, $3)';
                const values = [row[0], row[1], row[2]]; // Adjust according to your table structure

                client.query(query, values, (err, res) => {
                    if (err) {
                        console.log('Error inserting data:', err.stack);
                    } else {
                        console.log('Data inserted successfully:', res.command);
                    }
                });
            });
        } else {
            console.log('No data found in Sheet 1.');
        }
    });
}

// Run the function
saveToDatabase();
