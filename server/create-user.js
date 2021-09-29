/************************************
To install:
    npm install readline-sync uuid better-sqlite3 crypto

To run:
    node create-user.js
************************************/ 

import reader from 'readline-sync';
import { v4 as uuid4 } from 'uuid';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const databaseFilename = join(__dirname,"/notekeeper.db") 
const db = new Database( databaseFilename );

function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

function createUser(userid, passwd, name) {
    let salt = String(uuid4());
    let hash = hashPassword(passwd, salt);
    let stmt = db.prepare("INSERT INTO users (userid, password, salt, displayName) VALUES (?, ?, ?, ?)");
    let result = stmt.run(userid, hash, salt, name);
    return result;
}

console.log("== Create a new user account ==");
console.log("Target database: "+databaseFilename);
let username = reader.question("Username: ");
let password = reader.question("Password: ");
let displayName = reader.question("Display name: ");
let ok = createUser(username, password, displayName);
console.log(ok);

