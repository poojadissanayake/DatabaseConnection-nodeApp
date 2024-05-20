let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('iceCreamDB');

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS Feedback (Id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, icecreamtype TEXT, rating INT, feedback TEXT)")
}); 
db.close(); 