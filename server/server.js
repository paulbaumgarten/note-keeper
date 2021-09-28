/***********************************************************
 * SETUP AND CONFIGURATION
 ***********************************************************/

// Express.js setup
import express from 'express';
const app = express()
const port = process.env.PORT || 8080;
console.log("Starting up");

// File, folder, path setup
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log("Running from "+__dirname)

// Define default parsing
app.use(express.json()) // Parse any application/json requests into req.body
app.use(express.urlencoded({ extended: true })) // Parse any application/x-www-form-urlencoded requests into req.body
app.use('/static', express.static(join(__dirname,'static'))); // Static files in the ./static folder
import expressSession from 'express-session';
app.use(expressSession({ secret: "shhh, it's a secret", resave: false, saveUninitialized: false })); // Session handler

// SQLite setup
// better-sqlite3 library docs @ https://github.com/JoshuaWise/better-sqlite3/blob/HEAD/docs/api.md
import Database from 'better-sqlite3';
const db = new Database(join(__dirname,"/notekeeper.db"));
console.log("db object: ")
console.log(db);

// Passport.js setup
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
app.use(passport.initialize());
app.use(passport.authenticate('session')); // Logins will remain valid for the current session (until user closes their browser) 

// Import passport authentication functions
// require('./authentication')(passport, LocalStrategy, db);
import auth from './authentication.js';
auth(passport, LocalStrategy, db);

/***********************************************************
 * ROUTES
 ***********************************************************/

// const routes = require('./routes')(passport);
// const apiRoutes = require('./apiroutes')(passport, db);
import routes from './routes.js';
import apiRoutes from './apiroutes.js';
app.use('/', routes(passport));
app.use('/api', apiRoutes(passport, db));

/***********************************************************
 * START THE SERVER
 ***********************************************************/

/* Start the server, listen to the specified port number, execute the paramter function when running */
app.listen(port, () => {
    console.log(`Notekeeper app @ http://localhost:${port}`)
})
