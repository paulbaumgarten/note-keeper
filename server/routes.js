// const express = require('express');
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

function routes(passport) {

    const router = express.Router();
    
    router.get('/', (req, res) => {
        console.log(`Visit from IP: ${req.ip}`);
        if (! req.user) {
            console.log("Not logged in, sending to /login")
            return res.redirect("/login")
        }
        console.log(`Logged in as: ${req.user.userid}`)
        return res.sendFile(join(__dirname,"/index.html"));
    })
    
    router.get('/login', (req, res)=> {
        return res.sendFile(join(__dirname,"/login.html"));
    })
    
    router.get('/loginfail', (req, res)=> {
        console.log("Login attempt failed, displaying login page");
        return res.sendFile(join(__dirname,"/login.html"));
    })
    
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/loginfail'
    }));
    
    router.get('/logout', function (req, res) {
        console.log('You should now (hopefully) be getting logged out. Ta. Thanks for your visit. Hope your life is now fulfilled.')
        req.logout(); // Passport provided function to end the user session
        return res.redirect('/login');
    })
    
    return router;
}

// module.exports = routes;
export default routes;

