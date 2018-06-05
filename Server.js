//Headers

var express = require('express');
var expressValidator = require('express-validator');
var compression = require('compression');
var flash = require('express-flash');
var session = require('express-session');
var io = require('socket.io');
var ngrok = require('ngrok');
var mongojs = require('mongojs');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
var sleep = require('system-sleep');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var randomstring = require('randomstring');
var chalk = require('chalk');
var bcrypt = require('bcrypt');
var localip = require('local-ip');

//----- Settings & Important variables -----//
//#region  Settings and Var's

var config = require(path.join(__dirname, '/private/settings/general.json'));
var iface = config.serverSettings.adapter;
var serverIp = localip(iface);
var io;
var tunnelUrl;
var app = express();


var anonymUserLife = config.serverSettings.anonymUsersInactiveLife;

var port = config.serverSettings.port;
var transporter = nodemailer.createTransport(config.emailSettings);

var texterror = chalk.bold.red;
var textwarning = chalk.keyword('orange');
var textlogo = chalk.green;
var textlogobold = chalk.green.bold;
var textlogoline = chalk.green.underline;
var textplain = chalk.white;

//#endregion




//-------------- Middleware -----------------//
//#region Middleware

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/private/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(compression());
app.use(expressValidator());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images/logo/icon.png')));
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'aeolus',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use(flash());

app.use(function (req, res, next) {
    res.locals.errors = null;
    res.locals.success = null;
    res.locals.url = null;
    next();
});

app.use(function (req, res, next) {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

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

var sessionChecker = function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/chat');
    } else {
        next();
    }
};

//#endregion




//---------------- ROUTING -----------------//

//#region GET routes
app.get('/', sessionChecker, function (req, res) {
    optionalLog(req.connection.remoteAddress + " - accessed /home", "warning");
    optionalLog('');
    optionalLog('User connected : IP address = ' + req.connection.remoteAddress, "logo");
    res.render('index', {
        url: tunnelUrl
    });
});


app.get('/signin', function (req, res) {
    optionalLog(req.connection.remoteAddress + " - accessed /signin", "warning");
    optionalLog('');
    if (req.session.isAnonymous) {
        res.clearCookie('user_sid');
        res.render('signin');
    } else if (!req.session.isAnonymous) {
        res.render('signin');
    } else {
        res.redirect('/chat');
    }
});


app.get('/chat', function (req, res) {
    if (req.session.user) {
        optionalLog(req.connection.remoteAddress + " - accessed /chat", "warning");
        optionalLog('');
        res.render('chat', {
            myUsername: req.session.user
        });

    } else {
        return res.status(401).send();
    }
});

app.get('/signup', function (req, res) {
    optionalLog(req.connection.remoteAddress + " - accessed /signin", "warning");
    optionalLog('');
    res.render('signup');
});

app.get('/about', function (req, res) {
    optionalLog(req.connection.remoteAddress + " - accessed /about", "warning");
    optionalLog('');
    res.render('about');
});

app.get('/guestlog', function (req, res) {
    optionalLog(req.connection.remoteAddress + " - accessed /guestlog", "warning");
    optionalLog('');
    if (req.session.isAnonymous) {
        res.redirect('/chat');
    } else {
        res.clearCookie('user_sid');
        res.render('guestlog');
    }
});

app.get('/recover', function (req, res) {
    optionalLog(req.connection.remoteAddress + " - accessed /recover", "warning");
    optionalLog('');
    res.render('recover', {
        messages: req.flash('error')
    });
});

app.get('/change/:token', function (req, res) {
    optionalLog(req.connection.remoteAddress + " - accessed /change with token " + req.params.token, "warning");
    optionalLog('');
    db.users.findOne({ // Validates the token
        resetPasswordToken: req.params.token, // Checks if the token exist for the user
        resetPasswordDate: {
            $gt: Date.now() // Checks if the token has expired
        }
    }, function (err, user) {
        if (!user) { // If no user was found
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/recover');
        } else {
            res.render('change'); // Else shows the page to change the password
        }
    });
});


app.get('/logout', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        changeStatus(req.session.user,"Inactive");
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

//#endregion

//#region POST routes

app.post('/signup', function (req, res) {
    var pass = req.body.password.length;
    var vErrors = [];
    if (pass < 6) {
        vErrors.push("password");
    }

    db.users.findOne({
        email: req.body.email
    }, function (err, result) {
        if (result) {
            vErrors.push("email");
        }
    });

    db.users.findOne({
        username: req.body.username
    }, function (err, result) {
        if (result) {
            vErrors.push("username");
        }
    });


    sleep(500);
    if (vErrors.length > 0) {
        return res.render('signup', {
            errors: vErrors
        });
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

    var newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hash
    };

    db.users.insert(newUser, function (err, response) {
        if (err) {
            optionalLog(err, "error");
            return res.status(500).render('500');
        }
        req.session.user = response._id;
        req.session.isAnonymous = false;
        res.redirect('chat');
        optionalLog("Added a new user : " + newUser.username, "logo");
    });
});

app.post('/signin', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.render('signin', {
            errors: "alreadyLogged"
        });
    } else {
        var id;
        db.users.findOne({
            $or: [{
                    username: req.body.username
                },
                {
                    email: req.body.username
                }
            ]
        }, function (err, result) {
            if (err) {
                optionalLog(err, "error");
                return res.status(500).render('500');
            }
            if (result) {
                if (!bcrypt.compareSync(req.body.password, result.password)) {
                    return res.render('signin', {
                        errors: "general"
                    });
                }
                req.session.user = result.username;
                req.session.isAnonymous = false;
                addUser(true, result.username);
                res.redirect('chat');
            } else {
                res.render('signin', {
                    errors: "general"
                });
            }
        });
    }
});

app.post('/guestLog', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.render('guestlog', {
            errors: "alreadyLogged"
        });
    } else {
        var sentName;
        if (req.body.name == "") {
            sentName = "@beastmaster64";
        } else sentName = req.body.name;
         
            if (sentName[0] != "@") {
                sentName = "@" + sentName;
            }
            if (!checkForSameName(sentName))
            {
            req.session.user = sentName;
            req.session.isAnonymous = true;
            addUser(false, sentName);
            res.redirect('chat');
        } else {
            return res.render('guestlog', {
                errors: 'exist'
            });
        }
    }
});

app.post('/recover', function (req, res) {
    db.users.findOne({
        email: req.body.email
    }, function (err, result) {
        if (err) {
            optionalLog(err, "error");
            return res.status(500).render('500');
        }
        if (result) {

            var resetToken = randomstring.generate(config.serverSettings.token.length);
            var resetDate = Date.now() + Number(config.serverSettings.token.life);
            db.users.update({
                email: result.email
            }, {
                $set: {
                    resetPasswordToken: resetToken,
                    resetPasswordDate: resetDate
                }
            });

            var mailOptions;

            if (config.serverSettings.useNgrokTunneling) {
                mailOptions = {
                    from: 'Zephyr <' + config.emailSettings.auth.user +'>',
                    to: result.email,
                    subject: 'Zephyr password recovery',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        tunnelUrl + '/change/' + resetToken + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
            } else {
                if(config.serverSettings.hostname=="")
                {
                mailOptions = {
                    from: 'Zephyr <' + config.emailSettings.auth.user +'>',
                    to: result.email,
                    subject: 'Zephyr password recovery',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + serverIp + ":" + port + '/change/' + resetToken + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
            }
            else
            {
                mailOptions = {
                    from: 'Zephyr <' + config.emailSettings.auth.user +'>',
                    to: result.email,
                    subject: 'Zephyr password recovery',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        config.serverSettings.hostname + '/change/' + resetToken + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
            }
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    optionalLog(error, "error");
                    return res.status(500).render('500');
                } else {
                    optionalLog('Email with password sent to ' + result.email + ' . - ' + info.response, "warning");
                }
            });
            res.render('recover', {
                success: "An e-mail has been sent to " + result.email + " with further instructions."
            });
        } else {
            res.render('recover', {
                success: "An e-mail has been sent to " + req.body.email + " with further instructions."
            });
        }
    });
});

app.post('/change/:token', function (req, res) {
    var pass = req.body.password.length;
    var vErrors = [];
    if (pass < 6) {
        vErrors.push("password");
    }

    if (req.body.password != req.body.retype) {
        vErrors.push("notsame");
    }
    if (vErrors.length > 0) {
        return res.render('change', {
            errors: vErrors
        });
    } else {
        db.users.findOne({
            resetPasswordToken: req.params.token
        }, function (err, result) {
            if (err) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/recover');
            }
            if (result) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);
                db.users.update({
                    resetPasswordToken: result.resetPasswordToken
                }, {
                    $set: {
                        resetPasswordToken: undefined,
                        resetPasswordDate: 0,
                        password: hash
                    }
                });

                var mailOptions = {
                    to: result.email,
                    from: 'Zephyr <' + config.emailSettings.auth.user +'>',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account ' + result.email + ' has just been changed.\n'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        optionalLog(error, "error");
                    } else {
                        optionalLog('Email with password sent to ' + result.email + ' . - ' + info.response, "warning");
                    }
                });

                res.render('changeSuccess');

            } else {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/recover');
            }
        });
    }
});

//#endregion

//#region ERROR Status routes
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (req, res) {
    res.status(500);
    res.render('500');
});
//#endregion

//--------- HELPER FUNCTIONS -----------//
function optionalLog(string, type) {
    if (config.serverSettings.optionalLogs) {
        if (type == null) {
            console.log(string);
        } else if (type == "error") {
            console.log(texterror(string));
        } else if (type == "warning") {
            console.log(textwarning(string));
        } else if (type == "logo") {
            console.log(textlogo(string));
        }
    }
}

function getTime() {
    var d = new Date();
    if (d.getMinutes() < 10) {
        time = d.getHours() + ":0" + d.getMinutes();
    } else {
        time = d.getHours() + ":" + d.getMinutes();
    }
    return time;
}

//#region Server
console.clear();
console.log(textlogo("--------------------------------------------------------------------------------------"));
console.log(textlogobold(" Zephyr Server"));
console.log("");
console.log(textplain(" Grama Nicolae - 2018"));
console.log(textlogo("--------------------------------------------------------------------------------------"));
console.log("");
sleep(1000);
console.time("Server started in "); //starting to count time it took to start the server
console.log(textwarning("Starting Server ..."));


var server = app.listen(port, function () {
    console.log("");
    if (port != 80) {
        console.log(textwarning('Server is now running. Go to localhost:' + port + ' on your browser'));
    } else console.log(textwarning('Server is now running. Go to localhost on your browser'));
    console.timeEnd('Server started in ');
    console.log("");

    if (config.serverSettings.useNgrokTunneling) {
        ngrok.connect(port, function (err, url) {
            tunnelUrl = url;
            console.log(textwarning('Ngrok started on port ' + port));
            console.log('To access the webpage from outside, go to ' + chalk.green.underline.bold(url));
            console.log("");
            console.log(textlogo("--------------------------------------------------------------------------------------"));
            console.log("");
        });
    } else {
        tunnelUrl = "http://" + serverIp + ":" + config.serverSettings.port.toString();
    }

    setInterval(checkForExpiredUsers, anonymUserLife);

    io = require('socket.io')(server);

    io.on('connection', onSocketConnection);

});
//#endregion

//#region Sockets

function onSocketConnection(socket) {
    socket.emit('message', {
        type: 'text',
        sender: 'Zephyr',
        time: getTime(),
        message: "Hello! This is a test convesation"
    });

    socket.emit('username', "");

    socket.on('login', function (data) {
        addUserSocket(data.username, socket.id);
        changeStatus(findUserNameBySocketID(socket.id), "Active");
    });

    socket.on('userExist', function (name, fn) {
        var exist = userExists(name);
        fn(exist);
    });

    //not too safe code
    socket.on('disconnect', function () {
        var username = findUserNameBySocketID(socket.id);
        changeStatus(username, "Inactive");
        var status = {
            name : findUserNameBySocketID(socket.id),
            status: "Inactive"
        };
        socket.broadcast.emit('statusUpdate', status);
    });

    socket.on('message', function (data) {
        if (data.target == "Zephyr") {
            optionalLog(data.message, "logo");
        } else {
            var senderName = findUserNameBySocketID(socket.id);
            var index = findNormalUser(data.target);
            if (index != -1) {
                var socketID = normalUsers[index].socket;
                io.to(socketID).emit('message', {
                    type: data.type,
                    sender: senderName,
                    message: data.message,
                    time: data.time
                });
            } else {
                index = findAnonymousUser(data.target);
                if (index != -1) {
                    var socketID1 = anonymUsers[index].socket;
                    io.to(socketID1).emit('message', {
                        type: data.type,
                        sender: senderName,
                        message: data.message,
                        time: data.time
                    });
                }
            }
        }
    });
}

//#endregion

//#region ChatManagement


var normalUsers = [];
var anonymUsers = [];

function checkForSameName(name) {
    for (var i = 0, len = anonymUsers.length; i < len; i++) {
        if (name == anonymUsers[i].name) {
            return true;
        }
    }
    return false;
}

function addUserSocket(name, socket) {
    var index = findNormalUser(name);
    if (index != -1) {
        normalUsers[index].socket = socket;
    } else {
        index = findAnonymousUser(name);
        if (index != -1) {
            anonymUsers[index].socket = socket;
        }
    }

}

function userExists(name) {
    for (var i = 0, len = normalUsers.length; i < len; i++) {
        if (name == normalUsers[i].name) {
            return true;
        }
    }
    for (i = 0, len = anonymUsers.length; i < len; i++) {
        if (name == anonymUsers[i].name) {
            return true;
        }
    }
    return false;
}

function findNormalUser(name) {
    for (var i = 0, len = normalUsers.length; i < len; i++) {
        if (name == normalUsers[i].name) {
            return i;
        }
    }
    return -1;
}

function findAnonymousUser(name) {
    for (var i = 0, len = anonymUsers.length; i < len; i++) {
        if (name == anonymUsers[i].name) {
            return i;
        }
    }
    return -1;
}

function isNormal(name) {
    if (findAnonymousUser(name) == -1) {
        return true;
    }
}

function changeStatus(name, newStatus) {
    if (isNormal(name)) {
        var index = findNormalUser(name);
        if (index != -1) {
            normalUsers[index].status = newStatus;
        }
    } else {
        var index1 = findAnonymousUser(name);
        if (index1 != -1) {
            anonymUsers[index1].status = newStatus;
            if(newStatus=="Inactive")
            {
            anonymUsers[index1].date = Date.now() + anonymUserLife;}
            else
            {anonymUsers[index1].date = -1;}
        }
    }
}

function findUserNameBySocketID(socketID) {
    for (var i = 0, len = anonymUsers.length; i < len; i++) {
        if (socketID == anonymUsers[i].socket) {
            return anonymUsers[i].name;
        }
    }
    for (var i1 = 0, len1 = normalUsers.length; i1 < len1; i1++) {
        if (socketID == normalUsers[i1].socket) {
            return normalUsers[i1].name;
        }
    }
}

function removeUser(isNormal, name) {
    if (isNormal) {
        var index = -1;
        for (var i = 0, len = anonymUsers.length; i < len; i++) {
            if (name == anonymUsers[i].name) {
                index = i;
            }
        }
        if (index > -1) {
            normalUsers.splice(index, 1);
        }
    } else if (!isNormal) {
        var index1 = -1;
        for (var i1 = 0, len1 = anonymUsers.length; i1 < len1; i1++) {
            if (name == anonymUsers[i1].name) {
                index1 = i1;
            }
        }
        if (index1 > -1) {
            anonymUsers.splice(index1, 1);
        }
    }
}

function addUser(isNormal, name) {
    if (isNormal) {
        normalUsers.push({
            name: name,
            socket: "",
            status: "Active"
        });
    } else if (!isNormal) {
        anonymUsers.push({
            name: name,
            socket: "",
            date: -1,
            status: "Active"
        });
    }
}

function showNormalUsers() {
    for (var i = 0, len = normalUsers.length; i < len; i++) {
        console.log(normalUsers[i]);
    }
}

function showAnonymUsers() {
    for (var i = 0, len = anonymUsers.length; i < len; i++) {
        console.log(anonymUsers[i]);
    }
}

function showAllUsers() {
    showNormalUsers();
    showAnonymUsers();
}

function checkForExpiredUsers() {
    for (var i = 0, len = anonymUsers.length; i < len; i++) {
        if (anonymUsers[i])
        if(anonymUsers[i].date != -1) {
            if (anonymUsers[i].date < Date.now()) {
                var message = "user " + anonymUsers[i].name + " deleted";
                optionalLog(message,"warning") ;
                anonymUsers.splice(i, 1);
            }
        }
    }
}

//#endregion

//#region Databases

var db = mongojs('Zephyr', ['users']);

db.users.find(function (err, docs) {
    if (docs) {
        console.log(textlogo('Connected to the local MongoDB'));
    } else console.log(texterror("Couldn't connect to local MongoDB"));
});

//#endregion