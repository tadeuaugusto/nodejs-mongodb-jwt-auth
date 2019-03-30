const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const connUri = process.env.MONGO_LOCAL_CONN_URL;

// const environment = process.env.NODE_ENV;
// const stage = require('./config')[environment];

module.exports = {
    /**
     * POST: http://localhost:3000/api/v1/users ({ "name": 'tadeuaugusto', "password": '123'} - Creates a new record
     * POST: http://localhost:3000/api/v1/users ({ "name": 'tadeuaugusto', "password": null} - Checks nullable values
     * POST: http://localhost:3000/api/v1/users ({ "name": 'tadeuaugusto', "password": '123'} - Checks duplicate user
     * POST: http://localhost:3000/api/v1/login ({ "name": 'tadeuaugusto', "password": '123'} - Logs the user in
     */
    signup: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 201;

            if (!err) {
                const name = req.body.name;
                const password = req.body.password;
                
                let user = new User();
                user.name = name;
                user.password = password;

                // TODO: We can hash the password here before we insert instead of in the model
                /*
                bcrypt.hash(user.password, stage.saltingRounds, function(err, hash) {
                    if (err) {
                        console.log('Error hashing password for user', user.name);
                    } else {
                        user.password = hash;
                    }
                });
                */

                user.save((err, user) => {
                    if (!err) {
                        result.status = status;
                        result.result = user;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    login: (req, res) => {

        const { name, password } = req.body

        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;

            if (!err) {
                User.findOne({name}, (err, user) => {
                    if (!err && user) {
                        bcrypt.compare(password, user.password).then(match => {
                            if (match) {
                                result.status = status;
                                result.result = user;
                            } else {
                                status = 401;
                                result.status = status;
                                result.error = 'Authentication Error';
                            }
                        }).catch(err => {
                            status = 500;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        });
                    } else {
                        status = 404;
                        result.status = status;
                        result.error = err;
                        res.status(status).send(result);
                    }
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    }
}