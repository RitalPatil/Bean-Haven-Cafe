// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const con = require('./DB_Conn.js'); // Your database connection module

// const app = express();
// const publicpath = path.join(__dirname, 'public');

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(publicpath)); // Serve static files (CSS, JS, images, etc.)

// // Routes
// app.get('/Home', (req, res) => {
//     res.sendFile(path.join(publicpath, 'home.html'));
// });

// app.get('/Login', (req, res) => {
//     res.sendFile(path.join(publicpath, 'Login.html'));
// });

// app.get('/Registration', (req, res) => {
//     res.sendFile(path.join(publicpath, 'Registration.html'));
// });

// app.post('/RegistrationValidation', (req, res) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     const password = req.body.psw;
//     const cpass = req.body.cpass;
//     const address = req.body.address;
//     const gender = req.body.gender;
//     const hobbies = Array.isArray(req.body.hobbies) ? req.body.hobbies.join(',') : req.body.hobbies;

//     // Check if password and confirm password match
//     if (password !== cpass) {
//         return res.status(400).send('Passwords do not match');
//     }

//     // Hash the password
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//             console.error('Hashing error:', err);
//             return res.status(500).send('Encryption error');
//         }

//         // Insert data into the database
//         const sql = "INSERT INTO user (name, email, password, address, gender, hobbies) VALUES (?, ?, ?, ?, ?, ?)";
//         const values = [name, email, hashedPassword, address, gender, hobbies];

//         con.query(sql, values, (err, result) => {
//             if (err) {
//                 console.error("Error executing query:", err);
//                 return res.status(500).send('Database error');
//             }
//             console.log("Data inserted successfully:", result);
//             res.redirect('/Home'); // Redirect to the home page after successful registration
//         });
//     });
// });

// app.post('/LoginValidation', (req, res) => {
//     const uname = req.body.username;
//     const pass = req.body.password;

//     const sql = 'SELECT * FROM user WHERE email = ?';
//     con.query(sql, [uname], function (err, result) {
//         if (err) {
//             console.error('Login error:', err);
//             return res.status(500).send('Database error');
//         }

//         if (result.length === 0) {
//             return res.status(401).send('Invalid email or password');
//         }

//         const storedHash = result[0].password;
//         bcrypt.compare(pass, storedHash, function (err, isMatch) {
//             if (err) {
//                 console.error('Compare error:', err);
//                 return res.status(500).send('Encryption error');
//             }

//             if (isMatch) {
//                 res.sendFile(path.join(publicpath, 'vedio.html')); // Successful login
//             } else {
//                 res.status(401).send('Invalid email or password');
//             }
//         });
//     });
// });

// // Fallback route for unmatched paths
// app.get('*', (req, res) => {
//     res.sendFile(path.join(publicpath, 'Pagenotfound.html'));
// });

// // Start the server
// app.listen(6600, () => {
//     console.log('Server is running on port 6600');
// });
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Make sure bcrypt is installed
const con = require('./DB_Conn.js'); // Your DB connection

const app = express();
const publicPath = path.join(__dirname, 'public');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicPath));

// Serve HTML pages
app.get('/Home', (req, res) => res.sendFile(path.join(publicPath, 'home.html')));
app.get('/Login', (req, res) => res.sendFile(path.join(publicPath, 'login.html')));
app.get('/Registration', (req, res) => res.sendFile(path.join(publicPath, 'registration.html')));

// Registration Validation
app.post('/RegistrationValidation', (req, res) => {
    const { name, email, psw, address, gender } = req.body;

    console.log("Received:", { name, email, psw, address, gender }); // DEBUG

    bcrypt.hash(psw, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Hashing error:', err);
            return res.status(500).send('Encryption error');
        }

        const sql = "INSERT INTO user (username, email, password, gender, address) VALUES (?, ?, ?, ?, ?)";
        const values = [name, email, hashedPassword, gender, address];

        con.query(sql, values, (err, result) => {
            if (err) {
                console.error("DB insert error:", err); // Full error in terminal
                return res.status(500).send(err.sqlMessage); // Show real error in browser
            }

            console.log("User registered:", result);
            res.redirect('/Login');
        });
    });
});


// Login Validation
app.post('/LoginValidation', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM user WHERE email = ?';
    con.query(sql, [username], (err, result) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const storedHash = result[0].password;
        bcrypt.compare(password, storedHash, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).send('Encryption error');
            }

            if (isMatch) {
                res.sendFile(path.join(publicPath, 'code.html'));
            } else {
                res.status(401).send('Invalid email or password');
            }
        });
    });
});

// Fallback route
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'home.html'));
});

// Start server
app.listen(6600, () => {
    console.log('Server running on http://localhost:6600');
});
