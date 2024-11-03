const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// Load client secrets from the downloaded credentials file
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const { client_secret, client_id, redirect_uris } =  credentials.web;

// Use http://localhost:3000 as the redirect URI
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3000');

// Google Sheets API scope
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

// Generate a URL for authentication
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});
console.log('Authorize this app by visiting this URL:', authUrl);

// Start a local web server to handle the redirect
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const query = url.parse(req.url, true).query;
  const code = query.code;

  if (code) {
    // Close the server after receiving the code
    res.end('Authentication successful! You can close this window.');
    server.close();

    // Exchange the code for tokens
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
      // Store the token for future use
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);
    });
  } else {
    res.end('No code found. Please try again.');
  }
}).listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
