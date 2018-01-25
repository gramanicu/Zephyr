//Headers

var express = require('express');
var socket = require('socket.io');
var path = require('path');
var ngrok = require('ngrok');
var fs = require('fs');
var bodyParser = require('body-parser');
var sleep = require('system-sleep');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var expressValidator = require('express-validator');
var nodemailer = require('nodemailer');

//Settings & Important variables

var config = require(path.join(__dirname, '/private/Setting Files/Server.json'));
var port = config.port;
var tunnelUrl;
var app = express();
var io;




//Console color formatting

var chalk = require('chalk');

var texterror = chalk.bold.red;
var textwarning = chalk.keyword('orange');
var textlogo = chalk.green;
var textlogobold = chalk.green.bold;
var textlogoline = chalk.green.underline;
var textplain = chalk.white;




//Headers

console.clear();
console.log(textlogo("--------------------------------------------------------------------------------------"));
console.log(textlogobold(" Zephyr Server"));
console.log("");
console.log(textplain(" Grama Nicolae - 2018"));
console.log(textlogo("--------------------------------------------------------------------------------------"));
console.log("");
sleep(1000);




//View engine

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/private/views'));




//Body Parser Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));




//Express validator
app.use(expressValidator()); //Check for the new versions





//Static files 

app.use('/static', express.static(path.join(__dirname, 'public')));




//Global vars

app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
});





//Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.lenght) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


//Express Routing

app.get('/', function (req, res) {
    console.log(textwarning(req.connection.remoteAddress + " - accesed /home"));
    console.log('');
    res.sendFile(path.join(__dirname, 'private/pages/index.html'));
});

app.get('/signin', function (req, res) {
    console.log(textwarning(req.connection.remoteAddress + " - accesed /signin"));
    console.log('');
    res.render('signin');
});

app.get('/signup', function (req, res) {
    console.log(textwarning(req.connection.remoteAddress + " - accesed /signup"));
    console.log('');
    res.render('signup');
});

app.get('/about', function (req, res) {
    console.log(textwarning(req.connection.remoteAddress + " - accesed /about"));
    console.log('');
    res.sendFile((path.join(__dirname, 'private/pages/about.html')));
});

app.get('/guestlog', function (req, res) {
    console.log(textwarning(req.connection.remoteAddress + " - accesed /guestlog"));
    console.log('');
    res.sendFile((path.join(__dirname, 'private/pages/guestlog.html')));
});

app.post('/signup', function (req, res) {
    console.log(textlogo('/signup Post'));

    var newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    var passlenght = newUser.password;
    if (passlenght.length < 6) {
        console.log("Failed signup: password not long enough");
        console.log('');
        res.render('signup', {
            errors: "password"
        });
    } else {
        db.users.insert(newUser, function (err, response) {
            if (err) {
                console.log(texterror(err));
                console.log('');
                var emailerror = err.toString().search("email dup key");
                var usernameerror = err.toString().search("username dup key");
                if (emailerror != -1) {
                    console.log("Failed signup: email already registered");
                    console.log('');
                    res.render('signup', {
                        errors: "email"
                    });
                } else if (usernameerror != -1) {
                    console.log("Failed signup: username already existing");
                    console.log('');
                    res.render('signup', {
                        errors: "username"
                    });
                } else {
                    res.render('signup', {
                        errors: "database"
                    });
                }
            } else {
                res.redirect('/');

                console.log(textwarning(newUser.username));
                console.log(newUser.email);
                console.log(newUser.password);
                console.log('');
            }
        })
    }
});

app.post('/signin', function (req, res) {
    console.log(textlogo('/signin authentification'));
    db.users.findOne({
        $or: [{
                username: req.body.username,
                password: req.body.password
            },
            {
                email: req.body.username,
                password: req.body.password
            }
        ]
    }, function (err, result) {
        if (err) {
            console.log(texterror(err));
        }
        if (result) {
            console.log(textwarning(result._id + " logged in"));
            res.send("Logged In");
        } else {
            res.render('signin', {
                errors: "general"
            });
        }
    });
});



//Databases initialization and connection

var uri = "mongodb+srv://gramanicu:<nicg9991>@maincluster-ujn0l.mongodb.net/Zephyr";
mongoose.connect(uri); //at a later date, replacing the mongojs with mongoose.When i will figure out how it works.
var atlasdb = mongoose.connection;

atlasdb.once('open', function () {
    console.log(textlogo("Connected to the Atlas database"));
    console.log("");
});

var db = mongojs('Zephyr', ['users']);

db.users.find(function (err, docs) {
    console.log(textlogo('Connected to the local MongoDB'));
    console.log('');
    console.log(docs);
    console.log('');
});


//Servers start

console.time("Server started in "); //starting to count time it took to start the server
console.log(textwarning("Starting Server ..."));


var server = app.listen(port, function () {

    console.log("");
    console.log(textwarning('Server is now running. Go to localhost:' + port + ' on your browser'));
    console.timeEnd('Server started in ');
    console.log("");

    ngrok.connect(port, function (err, url) {
        tunnelUrl = url;
        startSocket();

        console.log(textwarning('Ngrok started on port ' + port));
        console.log('To access the webpage from outside, go to ' + chalk.green.underline.bold(url));
        console.log("");
        console.log(textlogo("--------------------------------------------------------------------------------------"));
        console.log("");
    });
});




//Socket Functions

function startSocket() {
    io = socket(server);
    io.on('connection', connected);
}

function connected(socket) {
    console.log(textlogo('User connected : ' + textwarning(socket.id)) + " (ip adress= " + socket.handshake.address + " )");
    socket.emit("serverMessage", tunnelUrl);
    console.log('Sent tunnel url (' + chalk.green.underline.bold(tunnelUrl) + ') to ' + textwarning(socket.id));
    socket.on('disconnect', function () {
        console.log(textlogo('User disconnected : ' + textwarning(socket.id)));
        console.log("");
    });

}