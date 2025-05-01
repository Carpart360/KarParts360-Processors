/************************************
 *  KarParts360-Processors.js
 ************************************/
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Set Cache-Control headers to prevent browsers from caching sensitive pages
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Configure express-session middleware
app.use(session({
  secret: 'your-secret-key', // Change this secret in production
  resave: false,
  saveUninitialized: false
}));

// Define path to users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// Initialize the users.json file with existing users if it doesn't exist
function initializeUsersFile() {
  if (!fs.existsSync(usersFilePath)) {
    const initialUsers = {
      "BlazingArcher": {
        name: "BlazingArcher",
        email: "blazing@example.com",
        password: "123456",
        createdAt: new Date().toISOString()
      },
      "DeadlyAssassin": {
        name: "DeadlyAssassin",
        email: "deadly@example.com",
        password: "246810",
        createdAt: new Date().toISOString()
      }
    };
    fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2), 'utf8');
    console.log('Created initial users.json file');
  }
}

// Call the initialize function when the server starts
initializeUsersFile();

// Helper function to read users from JSON file
function readUsers() {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(data);
    }
    return {}; // Return empty object if file doesn't exist yet
  } catch (err) {
    console.error('Error reading users file:', err);
    return {};
  }
}

// Helper function to write users to JSON file
function writeUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing users file:', err);
  }
}

// Main folder path - serving from the current directory
const mainFolderPath = __dirname;

// Allowed folders inside the main folder
const allowedFolders = [
  'Bundle Fitments',
  'Category',
  'Compatibility Fix',
  'Image Renaming',
  'KSI Processors',
  'LKQ Processors',
  'Partslink Finder',
  'Product Attributes',
  'Product Specifications',
  'Title Checker',
  'Tonsa Mopar Processors',
  'USAUTO SET Processors',
  'Other Processors'
];

// Serve static files from the main folder under the "/processors" route.
// Protected by the isAuthenticated middleware so users must be logged in.
app.use('/processors', isAuthenticated, express.static(mainFolderPath));

/************************************
 *  Middleware to check if user is authenticated
 ************************************/
function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

/************************************
 *  GET /login - Serve the login form
 ************************************/
app.get('/login', (req, res) => {
  const error = req.query.error ? 'Invalid username or password.' : '';
  const success = req.query.success || '';
  
  const loginForm = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>KarParts360 - Processor Portal Login</title>
      <!-- Favicon -->
      <link rel="icon" type="image/png" href="PUT BASE64 CODE HERE" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #DCDCDC;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: #212121;
        }
        .watermark {
          position: fixed;
          bottom: 10px;
          left: 10px;
          font-family: "Century Gothic", sans-serif;
          font-style: italic;
          font-size: 13px;
          color: #805E00;
          opacity: 0.8;
          transform: skewX(-10deg);
          z-index: 1000;
        }
        .header-container {
          text-align: center;
          margin-bottom: 20px;
        }
        .login-logo {
          width: 400px;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
          margin-bottom: 10px;
        }
        .main-header {
          font-family: "Arial Black", sans-serif;
          color: #FDB819;
          -webkit-text-stroke: 0.25px #212121;
          font-size: 2.65rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
          margin: 10px 0;
        }
        .login-container {
          background-color: #FAFAFA;
          border: 1px solid #212121;
          width: 350px;
          padding: 20px 30px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          text-align: center;
        }
        .login-header {
          font-family: "Century Gothic", sans-serif;
          font-size: 1.75rem;
          margin-bottom: 10px;
        }
        input[type="text"], input[type="password"] {
          font-family: "Century Gothic", sans-serif;
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          box-sizing: border-box;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 3px;
        }
        button {
          font-family: "Century Gothic", sans-serif;
          font-size: 1rem;
          background-color: #FDB819;
          color: #212121;
          border: 2px solid #212121;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 3px;
          margin-top: 10px;
        }
        button:hover {
          background-color: #FFD633;
        }
        .error {
          color: red;
          margin-bottom: 10px;
          font-family: "Century Gothic", sans-serif;
        }
        .success {
          color: green;
          margin-bottom: 10px;
          font-family: "Century Gothic", sans-serif;
        }
        .register-link {
          margin-top: 15px;
          font-family: "Century Gothic", sans-serif;
          text-align: center;
        }
        .register-link a {
          color: #212121;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header-container">
        <img src="PUT BASE64 CODE HERE" alt="KarParts360 Logo" class="login-logo" />
        <div class="main-header">PROCESSOR PORTAL</div>
      </div>
      <div class="login-container">
        <div class="login-header">LOGIN</div>
        <div class="error">${error}</div>
        <div class="success">${success}</div>
        <form method="POST" action="/login">
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">SUBMIT</button>
        </form>
        <div class="register-link">
          <a href="/register">New User? Register Now!</a>
        </div>
      </div>
      <div class="watermark">
        Developed by:<br>
        Marketing Department
      </div>
    </body>
    </html>
  `;
  res.send(loginForm);
});

/************************************
 *  POST /login - Process the login form
 ************************************/
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Read users from file
  const users = readUsers();
  
  // Check if user exists and password matches
  if (users[username] && users[username].password === password) {
    req.session.authenticated = true;
    req.session.username = username;
    return res.redirect('/');
  } else {
    return res.redirect('/login?error=1');
  }
});

/************************************
 *  GET /register - Serve the registration form
 ************************************/
app.get('/register', (req, res) => {
  const error = req.query.error ? req.query.error : '';
  
  const registerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KarParts360 Processor Portal — Register</title>
  <style>
    /* Use Century Gothic everywhere */
    body, input, button, label, h2, .footer {
      font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
    }

    /* Page background */
    body {
      margin: 0;
      padding: 0;
      background: #ddd;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      height: 100vh;
    }

    /* Logo with shadow */
    .logo {
      margin-top: 40px;
      /* match your existing logo shadow */
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
    }

    /* White container */
    .form-container {
      background: #fff;
      padding: 30px 40px;
      margin-top: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: 320px;
      box-sizing: border-box;
    }
    h2 {
      text-align: center;
      margin-top: 0;
      color: #333;
    }
    /* Form fields */
    .form-container label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-size: 14px;
    }
    .form-container input {
      width: 100%;
      padding: 8px 10px;
      margin-bottom: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    /* Submit button */
    .form-container button {
      width: 100%;
      background: #ffc107;
      color: #333;
      border: none;
      padding: 10px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
    }
    .form-container button:hover {
      background: #e0a800;
    }
    /* Password match message with extra top margin */
    .msg {
      font-size: 13px;
      margin-top: 12px;     /* added margin above */
      margin-bottom: 16px;  /* space before the button */
      height: 16px;
    }
    .msg.success { color: green; }
    .msg.error   { color: red;   }
    /* Footer link */
    .form-container .footer {
      text-align: center;
      font-size: 11px;
      margin-top: 10px;
    }
    .form-container .footer a {
      color: #007bff;
      text-decoration: none;
    }
    .form-container .footer a:hover {
      text-decoration: underline;
    }
    .error-message {
      color: red;
      margin-bottom: 15px;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- Logo -->
  <img class="logo" src="PUT BASE64 CODE HERE" alt="KarParts360 Logo" width="325">

  <!-- Registration Form -->
  <div class="form-container">
    <h2>Register</h2>
    ${error ? `<div class="error-message">${error}</div>` : ''}
    <form id="registerForm" method="POST" action="/register">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>

      <label for="name">Name</label>
      <input type="text" id="name" name="name" required>

      <label for="username">Username</label>
      <input type="text" id="username" name="username" required>

      <label for="password">Password</label>
      <input type="password" id="password" name="password" required>

      <label for="confirm">Confirm Password</label>
      <input type="password" id="confirm" name="confirm" required>

      <div id="passwordMsg" class="msg"></div>

      <button type="submit">Register</button>
    </form>

    <div class="footer">
      Already have an account? <a href="/login">Login here</a>
    </div>
  </div>

  <script>
    const pwd     = document.getElementById('password');
    const confirm = document.getElementById('confirm');
    const msg     = document.getElementById('passwordMsg');

    function checkMatch() {
      if (!confirm.value) {
        msg.textContent = '';
        msg.className = 'msg';
      } else if (pwd.value === confirm.value) {
        msg.textContent = 'Passwords match!';
        msg.className = 'msg success';
      } else {
        msg.textContent = 'Passwords do not match!';
        msg.className = 'msg error';
      }
    }

    pwd.addEventListener('input', checkMatch);
    confirm.addEventListener('input', checkMatch);

    // Form validation
    document.getElementById('registerForm').addEventListener('submit', function(e) {
      if (pwd.value !== confirm.value) {
        e.preventDefault();
        alert('Passwords do not match!');
      }
    });
  </script>

</body>
</html>`;

  res.send(registerHTML);
});

/************************************
 *  POST /register - Process the registration form
 ************************************/
app.post('/register', (req, res) => {
  const { email, name, username, password, confirm } = req.body;
  
  // Check if passwords match
  if (password !== confirm) {
    return res.redirect('/register?error=Passwords do not match');
  }
  
  // Get existing users
  const users = readUsers();
  
  // Check if username already exists
  if (users[username]) {
    return res.redirect('/register?error=Username already exists');
  }
  
  // Add the new user
  users[username] = {
    email,
    name,
    password,
    createdAt: new Date().toISOString()
  };
  
  // Save updated users
  writeUsers(users);
  
  // Redirect to login page with success message
  res.redirect('/login?success=Registration successful! You can now log in.');
});

/************************************
 *  GET /logout - Log out and destroy session
 ************************************/
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

/************************************
 *  Utility: Get all .html files from a folder
 ************************************/
function getHtmlFilesInFolder(folderPath) {
  let htmlFiles = [];
  try {
    const items = fs.readdirSync(folderPath, { withFileTypes: true });
    for (const item of items) {
      if (!item.isDirectory() && item.name.toLowerCase().endsWith('.html')) {
        htmlFiles.push(item.name);
      }
    }
  } catch (err) {
    console.error(`Error reading folder ${folderPath}:`, err);
  }
  return htmlFiles;
}

/************************************
 *  Generate dynamic sidebar HTML based on allowed folders and available HTML files.
 ************************************/
function generateSidebarHtml() {
  let sidebarHtml = '';
  allowedFolders.forEach(folderName => {
    const folderPath = path.join(mainFolderPath, folderName);
    if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
      const htmlFiles = getHtmlFilesInFolder(folderPath);
      let fileListHtml;
      if (htmlFiles.length === 0) {
        fileListHtml = `<li style="padding:8px; color:#999;">No Available Programs</li>`;
      } else {
        fileListHtml = htmlFiles.map(fileName => {
          const encodedFolder = encodeURIComponent(folderName);
          const encodedFile = encodeURIComponent(fileName);
          const displayName = fileName.replace('.html', '');
          return `
            <li>
              <a href="/processors/${encodedFolder}/${encodedFile}" 
                 data-folder="${folderName}" data-file="${fileName}">
                ${displayName}
              </a>
            </li>
          `;
        }).join('');
      }
      sidebarHtml += `
        <details>
          <summary>${folderName}</summary>
          <ul>
            ${fileListHtml}
          </ul>
        </details>
      `;
    }
  });
  return sidebarHtml;
}

/************************************
 *  GET / (Main route): Serve the processor portal if authenticated
 *  New UI includes:
 *    - Top Bar with three columns (social icons, logo with search bar, external store links)
 *    - Redesigned sidebar with updated "PROCESSOR LIST" header (outlined & shadowed)
 *    - Tab system for processor programs
 *    - Forced re-login on browser back/forward navigation
 *    - A footer with external links and logos
 ************************************/
app.get('/', isAuthenticated, (req, res) => {
  const sidebarHtml = generateSidebarHtml();
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>KarParts360 Processor Portal</title>
      <!-- Favicon -->
      <link rel="icon" type="image/png" href="PUT BASE64 CODE HERE" />
      <style>
        /* Global Base Styling */
        body {
          margin: 0;
          font-family: "Century Gothic", sans-serif;
          color: #212121;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: #EAEAEA;
        }
        /* Top Bar */
        .top-bar {
          display: flex;
          background: #909090;
          color: #FDB819;
          padding: 10px 20px;
          align-items: center;
          justify-content: space-between;
        }
        .top-bar-col {
          flex: 1;
          display: flex;
          align-items: center;
        }
        .left-col {
          justify-content: flex-start;
        }
        .middle-col {
          justify-content: center;
          display: flex;
          align-items: center;
        }
        .right-col {
          justify-content: flex-end;
        }
        /* Left Column: Social Icons */
        .left-col a {
          margin-right: 15px;
          text-decoration: none;
          color: inherit;
        }
        .left-col img {
          width: 32px;
          height: 32px;
        }
        /* Middle Column: Logo and Search Bar */
        .middle-col .logo {
          height: 20px;
          margin-right: 15px;
        }
        .middle-col .search-container {
          position: relative;
        }
        .middle-col .search-container input[type="text"] {
          width: 375px; /* Adjust this value as needed */
          padding: 5px 2.5em 5px 10px;
          border-radius: 3px;
          font-size: 1rem;
          border: none;
        }
        .middle-col .search-container img {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
        /* Right Column: Store/Website Links */
        .right-col a {
          margin-left: 15px;
          text-decoration: none;
          color: inherit;
        }
        .right-col img {
          width: 32px;
          height: 32px;
        }
        /* Container for Sidebar and Content */
        .container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        /* Sidebar Styling */
        .sidebar {
          width: 250px;
          background: #f3f3f3;
          overflow-y: auto;
          padding: 20px 10px;
          border-right: 1px solid #ccc;
        }
        .processor-list-header {
          font-family: Impact, sans-serif;
          font-size: 25px;
          color: #FDB819;
          text-align: center;
          margin-bottom: 15px;
          -webkit-text-stroke: 0.25px #212121;
          text-shadow: 1px 1px 1px #212121;
        }
        .nav details {
          border-bottom: 1px solid #212121;
          margin: 0 0 10px 0;
          padding: 0;
        }
        .nav summary {
          padding: 8px 10px;
          cursor: pointer;
          background: #ddd;
          outline: none;
          font-weight: bold;
        }
        .nav summary:hover {
          background: #ccc;
        }
        .nav ul {
          list-style: none;
          padding-left: 20px;
          margin: 5px 0;
          background: #eee;
        }
        .nav ul li a {
          display: block;
          padding: 6px 0;
          color: #000;
          text-decoration: none;
        }
        .nav ul li a:hover {
          background: #ddd;
        }
        .nav ul li a.active {
          font-weight: bold;
          text-shadow: 0 0 3px #ffbb00;
        }
        /* Content Area Styling */
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #C0C0C0;
        }
        /* Tab Bar Styling */
        .tab-bar {
          background: #ddd;
          padding: 5px 10px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #bbb;
          overflow-x: auto;
        }
        .tab {
          background: #f3f3f3;
          margin-right: 5px;
          padding: 5px 10px;
          border: 1px solid #aaa;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .tab.active {
          background: #FDB819;
          color: #212121;
        }
        .tab .close-btn {
          margin-left: 8px;
          color: red;
          font-weight: bold;
          cursor: pointer;
        }
        /* Iframe Container */
        .iframe-container {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        .iframe-container iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        /* Loading Screen Styling */
        .loading-screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .loading-screen img {
          max-width: 450px;
        }
        /* Default Content Styling */
        #defaultContent {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .welcome-text {
          font-family: Impact, sans-serif;
          font-size: 4rem;
          color: #FDB819;
          -webkit-text-stroke: 0.25px #212121;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          margin-bottom: 1em;
        }
        .portal-text {
          font-family: Impact, sans-serif;
          font-size: 3.5rem;
          color: #FDB819;
          -webkit-text-stroke: 0.25px #212121;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          margin-top: 1em;
        }
        .instruction-text {
          font-family: "Century Gothic", sans-serif;
          font-weight: bold;
          color: #4B4B4D;
          font-size: 1.1rem;
          margin: 1em 0;
        }
        .developer-text {
          font-family: "Century Gothic", sans-serif;
          color: #4B4B4D;
          font-size: 1rem;
          margin-top: 2em;
        }
        /* Footer Styling */
        .footer {
          background-color: #686868; /* Slightly darker background */
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          border-top: 1px solid #4B4B4D;
        }
        .footer a {
          text-decoration: none;
        }
        .footer img {
          width: 90px;
          height: 32px;
        }
      </style>
    </head>
    <body>
      <!-- Top Bar -->
      <div class="top-bar">
        <!-- Left Column: Social Icons -->
        <div class="top-bar-col left-col">
          <a href="https://www.facebook.com/karparts360/" target="_blank" title="Facebook">
            <img src="PUT BASE64 CODE HERE" alt="Facebook">
          </a>
          <a href="https://www.youtube.com/@karparts360" target="_blank" title="Youtube">
            <img src="PUT BASE64 CODE HERE" alt="YouTube">
          </a>
          <a href="https://www.instagram.com/concierge.karparts360/" target="_blank" title="Instagram">
            <img src="PUT BASE64 CODE HERE" alt="Instagram">
          </a>
        </div>
        <!-- Middle Column: Logo and Search Bar -->
        <div class="top-bar-col middle-col">
          <img class="logo" src="PUT BASE64 CODE HERE" alt="KarParts360 Logo">
          <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search processors...">
            <img src="PUT BASE64 CODE HERE" alt="Search Icon">
          </div>
        </div>
        <!-- Right Column: Store/Website Links -->
        <div class="top-bar-col right-col">
          <a href="https://www.karparts360.com/" target="_blank" title="Website">
            <img src="PUT BASE64 CODE HERE" alt="Website">
          </a>
          <a href="https://www.ebay.com/usr/carlights360" target="_blank" title="eBay">
            <img src="PUT BASE64 CODE HERE" alt="eBay">
          </a>
          <a href="https://www.amazon.com/stores/KarParts360/page/284D3AB5-415F-4A6B-8F88-B6C8A2CE365F" target="_blank" title="Amazon">
            <img src="PUT BASE64 CODE HERE" alt="Amazon">
          </a>
          <a href="https://www.walmart.com/c/brand/karparts360" target="_blank" title="Walmart">
            <img src="PUT BASE64 CODE HERE" alt="Walmart">
          </a>
        </div>
      </div>
      
      <!-- Container for Sidebar and Content -->
      <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="processor-list-header">- PROCESSOR LIST -</div>
          <div class="nav">
            ${sidebarHtml}
          </div>
          <p style="text-align:center; margin-top:15px;">
            <a href="/logout">Logout</a>
          </p>
        </div>
        <!-- Content Area -->
        <div class="content-area">
          <!-- Tab Bar for open processor programs -->
          <div id="tabBar" class="tab-bar"></div>
          <!-- Iframe Container: Opened processor content will appear here -->
          <div id="iframeContainer" class="iframe-container">
            <!-- Default content when no processor is open -->
            <div id="defaultContent">
              <div class="welcome-container">
                <h1 class="welcome-text">WELCOME TO</h1>
                <img src="PUT BASE 64 CODE HERE" alt="Logo" class="welcome-logo" style="width:650px; max-width:90%; filter: drop-shadow(3px 3px 6px rgba(0,0,0,0.5)); margin:0.5em;">
                <h2 class="portal-text">PROCESSOR PORTAL</h2>
                <p class="instruction-text">Please select a processor from the left sidebar</p>
                <p class="developer-text">Developed by:<br>Marketing Department</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer Section -->
      <div class="footer">
        <a href="https://www.carparts.com/" target="_blank" title="Footer Link 1">
          <img src="PUT BASE64 CODE HERE" alt="Footer Logo 1">
        </a>
        <a href="https://www.carid.com/" target="_blank" title="Footer Link 2">
          <img src="PUT BASE64 CODE HERE" alt="Footer Logo 2">
        </a>
	<a href="https://www.rockauto.com/" target="_blank" title="Footer Link 2">
          <img src="PUT BASE64 CODE HERE" alt="Footer Logo 2">
        </a>
	<a href="https://www.summitracing.com/" target="_blank" title="Footer Link 2">
          <img src="PUT BASE64 CODE HERE" alt="Footer Logo 2">
        </a>
	<a href="https://www.dropbox.com/official-teams-page?_tk=paid_sem_goog_biz_b&_camp=20551930309&_kw=dropbox%20com|e&_ad=718117649755||c&gad_source=1&gclid=CjwKCAjw5PK_BhBBEiwAL7GTPQDHIW-SWKAw9rBurYfMGg8hnS1B06uvwcjojmu33qmGRNxWnnI6nhoC_OIQAvD_BwE" target="_blank" title="Footer Link 2">
          <img src="PUT BASE64 CODE HERE" alt="Footer Logo 2">
        </a>
        <!-- Add more footer logos as needed -->
      </div>
      
      <script>
        // ********** Tab System Functions **********
        function openProgram(url, title) {
          // Check if a tab already exists for this URL
          let existingTab = document.querySelector(\`.tab[data-url="\${url}"]\`);
          if (existingTab) {
            activateTab(existingTab);
            return;
          }
          // Create a new tab element
          let tab = document.createElement('div');
          tab.classList.add('tab');
          tab.dataset.url = url;
          tab.innerHTML = \`\${title} <span class="close-btn">&times;</span>\`;
          tab.addEventListener('click', function() {
            activateTab(tab);
          });
          // Add native confirmation before closing the tab
          tab.querySelector('.close-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm("Are you sure you want to close this tab? Your progress might be lost.")) {
              closeTab(tab);
            }
          });
          document.getElementById('tabBar').appendChild(tab);
          
          // Create a new iframe for this program
          let iframe = document.createElement('iframe');
          iframe.dataset.url = url;
          iframe.src = url;
          iframe.style.display = 'none';
          
          // Create and show the loading overlay
          let loadingScreen = document.createElement('div');
          loadingScreen.classList.add('loading-screen');
          // Replace the following Base64 string with your own encoded GIF
          loadingScreen.innerHTML = '<img src="PUT BASE64 CODE HERE" alt="Loading..."/>';
          let iframeContainer = document.getElementById('iframeContainer');
          iframeContainer.appendChild(loadingScreen);
          
          // Record the time when loading starts
          const loadStartTime = Date.now();
          // Once the iframe loads
          iframe.onload = function () {
            const elapsed = Date.now() - loadStartTime;
            const minDelay = 500; // Minimum delay in milliseconds (adjust between 500 to 750 as needed)
            if (elapsed < minDelay) {
              setTimeout(function() {
                loadingScreen.style.display = 'none';
                iframe.style.display = 'block';
              }, minDelay - elapsed);
            } else {
              loadingScreen.style.display = 'none';
              iframe.style.display = 'block';
            }
          }
          
          // Append the iframe (remains hidden until onload fires)
          iframeContainer.appendChild(iframe);
          activateTab(tab);
        }

        function activateTab(tabToActivate) {
          document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
          document.querySelectorAll('#iframeContainer iframe').forEach(iframe => iframe.style.display = 'none');
          tabToActivate.classList.add('active');
          let url = tabToActivate.dataset.url;
          let iframe = document.querySelector(\`#iframeContainer iframe[data-url="\${url}"]\`);
          if (iframe) {
            iframe.style.display = 'block';
          }
        }

        function closeTab(tab) {
          let url = tab.dataset.url;
          tab.parentNode.removeChild(tab);
          let iframe = document.querySelector(\`#iframeContainer iframe[data-url="\${url}"]\`);
          if (iframe) {
            iframe.parentNode.removeChild(iframe);
          }
          if (document.querySelectorAll('.tab').length === 0) {
            document.getElementById('defaultContent').style.display = 'flex';
          } else {
            let remainingTabs = document.querySelectorAll('.tab');
            activateTab(remainingTabs[remainingTabs.length - 1]);
          }
        }
        // ********** End Tab System Functions **********

        // ********** Search Functionality **********
        function performSearch() {
          let query = document.getElementById('searchInput').value.toLowerCase().trim();
          const detailsElements = document.querySelectorAll('.nav details');
          detailsElements.forEach(detail => {
            const liItems = detail.querySelectorAll('ul li');
            let hasMatch = false;
            liItems.forEach(li => {
              if (li.textContent.toLowerCase().includes(query)) {
                li.style.display = "";
                hasMatch = true;
              } else {
                li.style.display = "none";
              }
            });
            if (query === "") {
              detail.style.display = "";
            } else {
              detail.style.display = hasMatch ? "" : "none";
            }
          });
        }
        // ********** End Search Functionality **********

        // Attach event listeners after DOM content is loaded
        document.addEventListener('DOMContentLoaded', function() {
          // Sidebar program links event listener
          const links = document.querySelectorAll('.nav ul li a');
          links.forEach(link => {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              links.forEach(l => l.classList.remove('active'));
              this.classList.add('active');
              document.getElementById('defaultContent').style.display = 'none';
              openProgram(this.getAttribute('href'), this.textContent.trim());
            });
          });
          
          // Search input: trigger search on Enter key
          document.getElementById('searchInput').addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
              performSearch();
            }
          });
          // Search icon: trigger search on click
          const searchIcon = document.querySelector('.search-container img');
          if (searchIcon) {
            searchIcon.addEventListener('click', performSearch);
          }
        });
        
        // ********** Forced Re-login on Browser Navigation **********
        history.pushState(null, null, location.href);
        window.onpopstate = function(event) {
          alert("Please log back in");
          window.location.href = '/login';
        };
        window.addEventListener('pageshow', function(event) {
          if (event.persisted || (performance.getEntriesByType("navigation")[0] &&
              performance.getEntriesByType("navigation")[0].type === "back_forward")) {
            alert("Please log back in");
            window.location.href = '/login';
          }
        });
        // ********** End Forced Re-login **********
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

/************************************
 *  Start the Server
 ************************************/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
