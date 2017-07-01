/**
 * Created by Hitesh on 29-11-2016.
 */
var crypto = require('crypto');
var connection = require('./config');
module.exports = function(app) {

    // Post admin login method

    app.post('/adminlogin', function (req, res) {

        var hashnew = crypto.createHash('md5').update(req.body.pass).digest("hex");
        connection.query("select * from users where email = '" + req.body.email + "' and password = '" + hashnew + "'", function (err, rows) {
            numRows = rows.length;
            if (err)
                return done(err);
            if (numRows == 0) {
                // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                res.end('Please enter correct credentials.');
            }
            else {
                sess = req.session;
                sess.email = req.body.email;
                res.end('done');
            }
        });

    });

    // Post login method

    app.post('/login', function (req, res) {

        var hashnew = crypto.createHash('md5').update(req.body.pass).digest("hex");
        connection.query("select * from users where email = '" + req.body.email + "' and password = '" + hashnew + "'", function (err, rows) {
            numRows = rows.length;
            if (err)
                return done(err);
            if (numRows == 0) {
                res.end('Please enter correct credentials.');
            }
            else {
                sess = req.session;
                sess.email = req.body.email;
                if(rows.user_role == 'Student') {
                    res.end('student');
                } else {
                    res.end('professor');
                }
            }
        });
    });


    // Post Forgot password method

    app.post('/fpassword', function (req, res) {

        connection.query("select * from users where email = '" + req.body.email + "'", function (err, rows) {
            numRows = rows.length;
            if (err)
                return done(err);
            if (numRows == 0) {
                res.end('email does not exist');
            }
            else {
                res.end('done');
            }
        });
    });
    // Post signup method

    app.post('/signup', function (req, res) {

        connection.query("select * from  users where email = '" + req.body.email + "'", function (err, rows) {
            console.log(rows);
            // console.log("above row object");
            numRows = rows.length;
            if (err)
                return done(err);
            if (numRows == '1') {
                res.end('done');
            }
            else {
                var created = new Date();
                var hash = crypto.createHash('md5').update(req.body.pass).digest("hex");
                var queryString = "insert into users(name,user_role,dob,email,password,created) values('" + req.body.name + "','" + req.body.user_role + "','" + req.body.dob + "','" + req.body.email + "','" + hash + "','" + created + "')";
                console.log(queryString);
                connection.query(queryString, function (error, results) {
                    if (error) {
                        throw error;
                    }
                    else {
                        res.end('success');
                    }
                });
            }
        });
    });
    // post editinfo function for edit profile
    app.post('/editinfo', function (req, res) {
        var created = new Date();
        var queryString = "update users set name='" + req.body.name + "',dob='" + req.body.dob + "',organization='" + req.body.org + "',created='" + created + "' WHERE email='" + req.body.email + "'";
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else
            {
                res.end('success');
            }
        });
    });
    // load contact function
    app.post('/contacts', function (req, res) {
        var queryString = "insert into contactus(name,email,message) values('" + req.body.name + "','" + req.body.email + "','" + req.body.message + "')";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                        throw error;
                    }
                    else {
                        res.end('success');
                    }
                });
            });
    // load remove user function to maintain user list
    app.post('/removeuser', function (req, res) {
        var queryString = "DELETE FROM users WHERE id='" + req.body.id + "'";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else {
                res.end('success');
            }
        });
    });
    // load change password function for change user password
    app.post('/changePassword', function (req, res) {
        var hashnew = crypto.createHash('md5').update(req.body.password).digest("hex");
        var queryString = "UPDATE users SET password='" + hashnew + "' WHERE email='" + sess.email + "'";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else {
                res.type('text/plain');
                res.json(results);
            }
        });
    });
}