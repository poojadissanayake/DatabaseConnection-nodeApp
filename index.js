const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

// Import sqlite3 library
const sqlite3 = require('sqlite3').verbose();
// Initialize database connection
const db = new sqlite3.Database('icecreamDB');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// //configuring express to use body-parser
// app.use(express.urlencoded({ extended: false }));
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Ice cream Review' });
});

app.post('/feedback', (req, res, next) => {
    let name = req.body.name;
    let favourite = req.body.icecreamtype;
    let rating = req.body.rating;
    let feedback = req.body.feedback;

    // db.run(`INSERT INTO Feedback VALUES ("${name}", "${favourite}", "${rating}", "${feedback}")`);
    db.run(`INSERT INTO Feedback VALUES (?,?, ?, ?, ?)`, [, name, favourite, rating, feedback]);
    res.status(200).redirect('/');
});

app.post('/search', (req, res, next) => {
    const icecreamType = req.body.searchBar;
    if (!icecreamType) {
        return res.status(400).send('Ice cream type is required');
    }

    // const query = `SELECT * FROM Comments WHERE icecreamtype LIKE '${searchtype}'`;
    // parameterized query to avoid SQL injection for best practices
    db.all('SELECT * FROM Feedback WHERE icecreamtype LIKE ?', [`%${icecreamType}%`], (err, rows) => {
        if (err) {
            return next(err);
        }
        if (rows.length == 0) {
            res.render('search', {
                title: 'Search Results for: ' + icecreamType,
                feedbackList: [],
                message: 'No results found 🙁'
            });
        }
        else {
            res.render('search', {
                title: 'Search Results for: ' + icecreamType,
                feedbackList: rows,
                message: ''
            });
        }
    });
});



app.get('/feedback', (req, res) => {

    // (err, rows) => {} arrow function that serves as a callback. 
    // This callback will be called when the asynchronous operation (in this case, a database query) completes.
    // rows: This parameter represents the result of the operation. 
    // For a database query, rows typically contains the rows returned by the query.

    db.get('SELECT * FROM Feedback ORDER BY Id DESC LIMIT 1', (err, row) => {
        if (err) {
            return next(err);
        }
        if (row.rating > 2) {
            res.render('thankyou', {
                title: 'Ice Cream Review',
                feedback: row,
                face: '😄', //smiley only unicode is working
                message: 'Fantastic! This is wonderful you liked the ' + row.icecreamtype + ' ice cream.',
                style: 'text-success'
            });
        }
        if (row.rating <= 2) {
            res.render('thankyou', {
                title: 'Ice Cream Review',
                feedback: row,
                face: '🥲',
                message: 'We are sorry you didn\'t like the ' + row.icecreamtype + ' ice cream',
                style: 'text-danger'
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});