var express = require('express')
var app = express()
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var usersSchema = new Schema({ username: String, name: String, surname: String, password: String, type: String, data: { users: Array, records: Array, doctors: Array } }, { versionKey: false })
var usersModel = mongoose.model("users", usersSchema)
var clientRandoms = []
var clientSessions = []

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
mongoose.connect("mongodb://localhost/netsec")

function deleteClientRandoms(ip) {
    console.log("deleteClientRandoms()")
    console.log(ip)
    for (var i = clientRandoms.length - 1; i >= 0; i--) {
        if (clientRandoms[i].ip == ip) {
            clientRandoms.splice(i, 1)
        }
    }
}
function deleteClientSessions(ip) {
    console.log("deleteClientSessions()")
    console.log(ip)
    for (var i = clientSessions.length - 1; i >= 0; i--) {
        if (clientSessions[i].ip == ip) {
            clientSessions.splice(i, 1)
        }
    }
}

function checkRandom(ip, random) {
    var flag;
    flag = false
    for (var i = clientRandoms.length - 1; i >= 0; i--) {
        if (clientRandoms[i].ip == ip && clientRandoms[i].random == random) {
            flag = true
        }
    }
    console.log("checkRandom() " + flag)
    return flag

}
function checkSession(ip, sessionId) {
    var flag;
    flag = false
    console.log(sessionId)
    console.log(clientSessions)
    for (var i = clientSessions.length - 1; i >= 0; i--) {
        if (clientSessions[i].ip == ip && clientSessions[i].sessionId == sessionId) {
            flag = true
        }
    }
    console.log("checkSession() " + flag)
    return flag
}
function getUserId(sessionId) {
    console.log("getUserId()")
    console.log(sessionId)
    console.log(clientSessions)
    for (var i = clientSessions.length - 1; i >= 0; i--) {
        if (clientSessions[i].sessionId == sessionId) {
            return clientSessions[i].userId
        }
    }
}
function getUserType(userId) {
    return new Promise(function (resolve, reject) { // resolve(p) reject(p) 
        usersModel.findById(userId)
            .then(function (user) {
                if (user) {
                    console.log("USERTYPE =>>> " + user.type)
                    resolve(user.type)
                }
                else {
                    console.log(userId)
                    reject("no such user")
                }
            })
            .catch(function (err) {
                reject(err)
            })
    })
}


app.post("/get-random", function (req, res) {
    console.log(req.body)
    console.log("=======")
    console.log(req.ip)
    console.log("=======")
    var max = 1000
    var random = Math.floor(Math.random() * Math.floor(max))
    var validIntervalMinutes = 10
    var clientData = {
        ip: req.ip,
        random: random
    }
    setTimeout(function () {
        clientRandoms.splice(clientRandoms.indexOf(clientData), 1)
    }, 1000 * 60 * validIntervalMinutes);
    deleteClientRandoms(req.ip)
    console.log(clientData)
    console.log(clientRandoms)
    clientRandoms.push(clientData)
    res.send({ random: random })
})

app.get('/', function (req, res) {
    res.sendFile('client/index.html', { root: __dirname })
})
app.post('/login', function (req, res) {
    //kontrolEt,
    //username ve password escape (password hashlenmemiş olabilir kodubozduysa)
    //password 256 character kontrol et
    if (checkRandom(req.ip, req.body.random)) {
        console.log(req.body)
        usersModel.findOne({ username: req.body.username, password: req.body.password }, function (err, user) {
            if(user){
                var max = 1000
                var sessionId = Math.floor(Math.random() * Math.floor(max))
                var clientData = {
                    ip: req.ip,
                    sessionId: sessionId,
                    userId: user._id
                }
                deleteClientSessions(req.ip)
                console.log(clientData)
                console.log(clientRandoms)
                clientSessions.push(clientData)
    
    
                console.log(user)
                var routeName = ''
                console.log(user.type)
                if (user.type == "admin") {
                    routeName = 'adminlogged'
                } else if (user.type == "doctor") {
                    routeName = 'doctorlogged'
                } else if (user.type == "nurse") {
                    routeName = 'nurselogged'
                } else if (user.type == "user") {
                    routeName = 'userlogged'
                }
                console.log(routeName)
                res.send({ routeName: routeName, _id: user._id, sessionId: sessionId })
            }
            else{
                res.send("YOUR REQUEST IS NOT VALID!")
            }
        })
    }
    else {
        res.send("YOUR REQUEST IS NOT VALID!")
    }
})

function getUsers(type) {
    return new Promise(function (resolve, reject) { // resolve(p) reject(p) 
        usersModel.find({ type: type })
            .then(function (users) {
                resolve(users)
            }).catch(function (err) {
                console.log("Getting users with type " + type + " from mongodb failed.")
                console.log(err)
                reject(err)
            })
    })
}
function getRecords(userId) {
    return new Promise(function (resolve, reject) { // resolve(p) reject(p) 
        usersModel.findById(userId)
            .then(function (user) {
                console.log(user.data)
                console.log(user.data.records)
                resolve(user.data.records)
            }).catch(function (err) {
                console.log("Getting records from user(" + userId + ") from mongodb failed.")
                console.log(err)
                reject(err)
            })
    })
}
function getDoctorUsers(doctorId) {
    return new Promise(function (resolve, reject) { // resolve(p) reject(p) 
        //CHECK IF INPUT IS VALID
        usersModel.findById(doctorId, function (err, doctor) {
            var promises = []
            for (i = 0; i < doctor.data.users.length; i++) {
                promises.push(usersModel.findById(doctor.data.users[i]))
            }
            Promise.all(promises)

                .then(function (users) {
                    resolve(users)
                    // var usersToSend = []
                    // for (i = 0; i < users.length; i++) {
                    //     usersToSend.push({
                    //         _id: users[i]._id,
                    //         name: users[i].name
                    //     })
                    // }
                }).catch(function (err) {
                    console.log("getDoctorUsers(" + doctorId + ") failed.")
                    console.log(err)
                    reject(err)
                })
        })
    })
}
function getUser(userId) {
    return new Promise(function (resolve, reject) { // resolve(p) reject(p) 
        usersModel.findById(userId)
            .then(function (user) {
                resolve(user)
            })
            .catch(function (err) {
                reject(err)
            })

    })
}

// app.get('/doctors', function (req, res) {
//     usersModel.find({ type: "doctor" }, function (err, user) {
//         res.send(user)
//     })
// })
// app.get('/nurses', function (req, res) {
//     usersModel.find({ type: "nurse" }, function (err, user) {
//         res.send(user)
//     })
// })
// app.get('/users', function (req, res) {
//     usersModel.find({ type: "user" }, function (err, user) {
//         res.send(user)
//     })
// })



app.post("/deleteuser", function (req, res) {
    if (checkSession(req.ip, req.body.sessionId)) {
        getUserType(getUserId(req.body.sessionId)).then(function (type) {
            if (type == "admin") {
                console.log(req.body)
                res.send("123")
                usersModel.deleteOne({ _id: req.body._id }, function (err) {
                    if (err) return handleError(err);
                });
            }
        })
    }
})

app.post("/userekle", function (req, res) {
    if (checkSession(req.ip, req.body.sessionId)) {
        getUserType(getUserId(req.body.sessionId)).then(function (type) {
            if (type == "admin") {
                console.log("test")
                generateUser(req.body.username, req.body.username, req.body.surname, "123", req.body.type, { dummyData: "dummy" });
            }
        })
    }
})

app.post("/useredit", function (req, res) {
    //CHECK IF INPUT IS VALID
    console.log(req.body)
    getUserType(getUserId(req.body.sessionId)).then(function (type) {
        if (checkSession(req.ip, req.body.sessionId) && type == "admin") {
            switch (req.body.opno) {
                case 0: //username,
                    usersModel.findById(req.body.userId, function (err, user) {
                        user.username = req.body.username
                        user.save(function (err, savedUser) {
                            res.send("saved done")
                        })
                    })
                    break;
                case 1: //password
                    usersModel.findById(req.body.userId, function (err, user) {
                        user.password = req.body.password
                        user.save(function (err, savedUser) {
                            res.send("saved done")
                        })
                    })
                    break;
                case 2: //name
                    usersModel.findById(req.body.userId, function (err, user) {
                        user.name = req.body.name
                        user.save(function (err, savedUser) {
                            res.send("saved done")
                        })
                    })
                    break;
                case 3: //surname
                    usersModel.findById(req.body.userId, function (err, user) {
                        user.surname = req.body.surname
                        user.save(function (err, savedUser) {
                            res.send("saved done")
                        })
                    })
                    break;
                case 4: //type
                    usersModel.findById(req.body.userId, function (err, user) {
                        user.type = req.body.usertype
                        user.save(function (err, savedUser) {
                            res.send("saved done")
                        })
                    })
                    break;
                default:
            }
        }
    })
})

app.post("/userdoctorrequest", function (req, res) {
    console.log(req.body)
    console.log("USER REQUESTED DOCTOR")
    getUserType(getUserId(req.body.sessionId)).then(function (type) {
        if (checkSession(req.ip, req.body.sessionId) && type == "user") {
            usersModel.findById(req.body.senderId, function (err, sender) {
                if (sender.type == "user") {
                    usersModel.findById(req.body.doctorId, function (err, doctorP) {
                        if (doctorP.type == "doctor") {
                            //ADD DOCTOR TO SENDER's DOCTORLIST
                            var senderData = sender.data
                            if (senderData.doctors == undefined) {
                                senderData.doctors = []
                            }
                            senderData.doctors.push({
                                _id: req.body.doctorId,
                            })
                            sender.set({ data: senderData })
                            var promises = []
                            sender.save(function (err, updatedSender) {
                                if (err) return handleError(err);
                                console.log(updatedSender)


                                //ADD SENDER TO DOCTOR's USER LIST
                                usersModel.findById(req.body.doctorId, function (err, doctor) {
                                    var doctorData = doctor.data
                                    if (doctorData.users == undefined) {
                                        doctorData.users = []
                                    }
                                    doctorData.users.push({
                                        _id: req.body.senderId,
                                        doctorId: req.body.doctorId
                                    })
                                    doctor.set({ data: doctorData })
                                    doctor.save(function (err, updatedDoctor) {
                                        if (err) return handleError(err);
                                        console.log(updatedDoctor)
                                        res.send("userdoctorrequest done!")
                                    });
                                })
                            })
                        }
                    })
                }
                else {

                }
            })
        }

    })

})

app.post("/addpatienttodoctor", function (req, res) {
    console.log(req.body)
    console.log("DOCTOR SHARE DOCTOR")
    getUserType(getUserId(req.body.sessionId)).then(function (type) {
        if (checkSession(req.ip, req.body.sessionId) && type == "doctor") {
            usersModel.findById(req.body.doctorId, function (err, doctor) {
                console.log(doctor)
                var doctorData = doctor.data
                if (doctorData.users == undefined) {
                    doctorData.users = []
                }
                doctorData.users.push({
                    _id: req.body.patientId,
                    doctorId: req.body.senderId
                })
                doctor.set({ data: doctorData })
                doctor.save(function (err, updatedDoctor) {
                    if (err) return handleError(err);
                    console.log(updatedDoctor)
                    res.send("Patient is added to doctor's patient list.")
                });
            })
        }
    })
})

app.post("/addpatienttonurse", function (req, res) {
    getUserType(getUserId(req.body.sessionId)).then(function (type) {
        if (checkSession(req.ip, req.body.sessionId) && type == "doctor") {
            console.log(req.body)
            console.log("DOCTOR SHARE NURSE")
            usersModel.findById(req.body.nurseId, function (err, nurse) {
                var nurseData = nurse.data
                if (nurseData.users == undefined) {
                    nurseData.users = []
                }
                nurseData.users.push({
                    _id: req.body.patientId,
                    doctorId: req.body.senderId
                })
                nurse.set({ data: nurseData })
                nurse.save(function (err, updatedNurse) {
                    if (err) return handleError(err);
                    console.log(updatedNurse)
                    res.send("Patient is added to nurse's patient list.")
                });
            })
        }
    })
})

function minimizeUser(userp) {
    var user = {}
    user.name = userp.name
    user.surname = userp.surname
    user.type = userp.type
    user._id = userp._id
    return user
}
function minimizeUserArray(usersp) {
    var users = []
    for (var i = 0; i < usersp.length; i++) {
        users.push(minimizeUser(usersp[i]))
    }
    return users
}

app.post("/get-records", function (req, res) {
    console.log(req.body)
    if (checkSession(req.ip, req.body.sessionId)) {
        getUserType(getUserId(req.body.sessionId)).then(function (type) {
            if (type == "user") {
                getRecords(req.body.requesterId)
                    .then(function (records) {
                        var data = {
                            list: records
                        }
                        console.log(data)
                        res.send(data)
                    })
            }
            if (type == "doctor" || type == "nurse") {
                getRecords(req.body.userId)
                    .then(function (records) {
                        var data = {
                            list: records
                        }
                        console.log(data)
                        res.send(data)
                    })
            }
        })
    }
})

app.post("/get-users", function (req, res) {
    console.log(req.body)
    if (checkSession(req.ip, req.body.sessionId)) {
        getUserType(getUserId(req.body.sessionId))
            .then(function (type) {
                if (type == "doctor") {
                    promises = []
                    promises.push(getUsers("doctor"))
                    promises.push(getUsers("nurse"))
                    promises.push(getDoctorUsers(req.body.requesterId))
                    Promise.all(promises)
                        .then(function (promiseReturns) {
                            var data = {
                                doctors: minimizeUserArray(promiseReturns[0]),
                                nurses: minimizeUserArray(promiseReturns[1]),
                                users: minimizeUserArray(promiseReturns[2]),
                            }
                            console.log(data)
                            res.send(data)
                        })
                }
                else if (type == "nurse") {
                    getDoctorUsers(req.body.requesterId)
                        .then(function (users) {
                            var data = {
                                users: minimizeUserArray(users),
                            }
                            console.log(data)
                            res.send(data)
                        })
                }
                else if (type == "admin") {
                    promises = []
                    promises.push(getUsers("doctor"))
                    promises.push(getUsers("nurse"))
                    promises.push(getUsers("user"))
                    Promise.all(promises)
                        .then(function (promiseReturns) {
                            var data = {
                                doctors: minimizeUserArray(promiseReturns[0]),
                                nurses: minimizeUserArray(promiseReturns[1]),
                                users: minimizeUserArray(promiseReturns[2]),
                            }
                            console.log(data)
                            res.send(data)
                        })
                }
                else if (type == "user") {
                    promises = []
                    promises.push(getUsers("doctor"))
                    promises.push(getUser(req.body.requesterId))
                    Promise.all(promises)
                        .then(function (promiseReturns) {
                            var data = {
                                doctors: minimizeUserArray(promiseReturns[0]),
                                user: promiseReturns[1],
                            }
                            console.log(data)
                            res.send(data)
                        })
                }

            })
    }
})

app.use("/", express.static("client"))
app.listen(80)
console.log('Listening port 80...')
console.log('http://localhost')

// GET USER FROM DATABASE
// usersModel.find({username: "admin"}, function(err, user){
//     res.send(user)
// })

// INSERT USER TO DATABASE
// usersModel.create({username: "guest", password: "4", type:"guest", data:{dummy: ""}}, function(err, user){
//     res.send(user)
// })


function generateUser(username, name, surname, password, type, data) {
    usersModel.create({ username: username, name: name, surname: surname, password: password, type: type, data: data }, function (err, user) {
    })
}
