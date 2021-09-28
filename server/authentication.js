// Because of course we will want some cryptonite :p
//const crypto = require('crypto');
import crypto from 'crypto';

// module.exports = function(passport, LocalStrategy, db) {
export default function auth(passport, LocalStrategy, db) {

    function hashPassword(password, salt) {
        var hash = crypto.createHash('sha256');
        hash.update(password);
        hash.update(salt);
        return hash.digest('hex');
    }
        
    passport.serializeUser(function(user, done) {
        // Convert user object to user id for saving into session cookie
        done(null, user.userid);
    });
      
    passport.deserializeUser(function(userid, done) {
        // Convert user id (from session cookie) to user object. Will be attached to req.user
        const stmt = db.prepare("SELECT * FROM users WHERE userid=?");
        const row = stmt.get(userid);
        if (! row) { return done(null, false); }
        return done(null, row);
    });
    
    // Defines how a user is authenticated
    // Is called by passport.authenticate() in the /login route
    passport.use( new LocalStrategy( 
      { // Specify the fields to find within req.body
        usernameField: 'userid',
        passwordField: 'passwd'
      }, 
      // Handling function
      function(userid, passwd, done) {
        console.log(`Login request for ${userid}...`);
        const stmt = db.prepare("SELECT * FROM users WHERE userid=?");
        const row = stmt.get(userid);
        console.log("row",row);
        // If there is no record matching the username, abort
        if (!row) return done(null, false); 
        // Check the password, if it doesn't match, abort
        let hash = hashPassword(passwd, row['salt'])
        console.log("hash = ",hash);
        if (hash !== row['password']) return done(null, false);
        // If we're still ok, return the data for saving into the session
        return done(null, row);
    }));
    
}
