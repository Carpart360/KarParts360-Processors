// File: db.js
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// Initialize lowdb using users.json for storing user accounts
const adapter = new FileSync(path.join(__dirname, 'users.json'));
const db = low(adapter);

db.defaults({ users: [] }).write();

module.exports = db;
