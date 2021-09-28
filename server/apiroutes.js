//const express = require('express');
//const uuid = require('uuid');
import express from 'express';
import { v4 as uuid4 } from 'uuid';

function routes(passport, db) {

    const router = express.Router();
    
    router.post('/newfolder', (req, res) => {
        if (! req.user) {
            console.log("Not logged in, sending to /login")
            return res.redirect("/login")
        }
        console.log(`/newfolder: user ${req.user.userid}, ip ${req.ip}`)
        let id = String(uuid4());
        const stmt = db.prepare("INSERT INTO folders (id, userid, title) VALUES (?,?,?)");
        const info = stmt.run(id, req.user.userid, req.body.title);
        if (info.changes !== 1) {
            res.status(400); // Bad request
            return res.json({error:`error creating folder '${req.body.title}'`})
        } else {
            return res.json({id:id, userid:req.user.userid, title:req.body.title})
        }
    })
    
    router.get('/getfolderlist', (req, res) => {
        if (! req.user) {
            console.log("Not logged in, sending to /login")
            return res.redirect("/login")
        }
        console.log(`/getfolderlist: user ${req.user.userid}, ip ${req.ip}`)

        const stmt = db.prepare("SELECT * FROM folders WHERE userid=? ORDER BY title")
        const rows = stmt.all(req.user.userid)
        if (rows.length === 0) { 
            res.status(400); // Bad request
            return res.json({error: `error fetching folder list for userid ${req.user.userid}`})
        }
        return res.json(rows);
    })
    
    router.get('/getnotelist', (req, res) => {
        if (! req.user) {
            console.log("Not logged in, sending to /login")
            return res.redirect("/login")
        }
        console.log(`/getnotelist: user ${req.user.userid}, ip ${req.ip}`)
        const stmt = db.prepare("SELECT id,title FROM notes WHERE userid=? AND folderid=? ORDER BY title")
        const rows = stmt.all(req.user.userid, req.query.folderid);
        if (rows.length === 0) {
            res.status(400); // Bad request
            return res.json({error: `error fetching note list for folderid ${req.query.folderid}`})
        }
        return res.json(rows);
    })
    
    router.get('/getnote', (req, res) => {
        if (! req.user) {
            console.log("Not logged in, sending to /login")
            return res.redirect("/login")
        }
        console.log(`/getnote: user ${req.user.userid}, ip ${req.ip}`)
        const stmt = db.prepare("SELECT * FROM notes WHERE id=? AND userid=? LIMIT 1");
        const rows = stmt.all(req.query.noteid, req.user.userid)
        if (rows.length === 0) { 
            res.status(400); // Bad request
            return res.json({error: `error fetching noteid ${req.query.noteid}`})
        }
        return res.json(rows[0]);
    })
    
    router.post('/setnote', (req, res) => {
        if (! req.user) {
            console.log("Not logged in, sending to /login")
            return res.redirect("/login")
        }
        console.log(`/setnote: noteid ${req.body.id} user ${req.user.userid}, ip ${req.ip}`)
        // If note is new, create a placeholder entry into the database
        const stmt = db.prepare("SELECT id,userid,folderid,title FROM notes WHERE id=? AND userid=? LIMIT 1");
        const rows = stmt.all(req.body.id, req.user.userid);
        console.log("rows.length",rows.length);
        if (rows.length === 0 ) { // New note
            const insert = db.prepare("INSERT INTO notes (id, userid, folderid, title, content) VALUES (?, ?, ?, '', '')")
            const ok = insert.run(req.body.id, req.user.userid, req.body.folderid);
            if (ok.changes !== 1) {
                console.log("error creating new note",ok)
                return res.status(400).json({error:"error creating new note"})
            } else {
                console.log("new note created with id ",req.body.id);
            }
        }
        if (req.body.title) { // Update existing note: title
            const upd = db.prepare("UPDATE notes SET title=? WHERE id=? AND userid=?")
            const ok = upd.run(req.body.title, req.body.id, req.user.userid)
            if (ok.changes !== 1) {
                console.log("error updating note title",ok)
                return res.status(400).json({error:"error updating note title"})
            }
        } else if (req.body.content) { // Update existing note: content
            const upd = db.prepare("UPDATE notes SET content=? WHERE id=? AND userid=?")
            const ok = upd.run(req.body.content, req.body.id, req.user.userid)
            if (ok.changes !== 1) {
                console.log("error updating note content",ok)
                return res.status(400).json({error:"error updating note content"})
            }
        }
        return res.status(200).json({ok:"ok"});
    })

    return router;
}

// module.exports = routes;
export default routes;

