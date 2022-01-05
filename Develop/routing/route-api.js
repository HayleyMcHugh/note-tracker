const notesData = require("../db/db.json");
const fs = require("fs");
const path = require("path")

module.exports = app => {
    app.get("/api/notes", (req, res) => {
        res.json(notesData)
    });

    app.post("/api/notes", (req, res) => {
        notesData.push(req.body)
        fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(notesData), (err) => {
            if (err) console.log(err)
        });
        return res.json(notesData);
    });

    app.delete("/api/notes/:id", (req, res) => {
        const requestId = req.params.id;

        let note = notesData.filter(note => {
            return note.id == requestId;
        })[0];

        const index = notesData.indexOf(note);

        notesData.splice(index, 1);

        fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(notesData), (err) => {
            if (err) console.log(err)
        });

        res.json({ message: `User ${requestId} deleted!`})
    })
}