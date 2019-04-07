const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwtConvert = require('../helpers/jwtConvert');
const googleSignin = require('../helpers/googleSignIn')

class UserController {
    static findUser (req,res) {
        let findMe = {}
        User
            .find(findMe)
            .then(users => {
                res.status(200).json(users)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }

    static register (req,res) {
        console.log("masuk ke register", req.body)
        User
            .create({
                email: req.body.email,
                password: req.body.password
            })
            .then(newUser => {
              res.status(201).json(newUser);
            })
            .catch(err => {
              console.log("terjadi error add users", err)  
              if (err.errors.email) {
                    res.status(409).json(err);
                } else if(err.errors.phone) {
                    res.status(409).json(err);
                } else {
                    res.status(500).json(err);
                }
            }) 
    }

    static login (req,res) {
        if (req.body.loginVia == 'website') {
          console.log("masuk ke login", req.body)  
          User
                .findOne({
                    email: req.body.email
                })
                .then(user => {
                    if(!user) {
                        res.status(403).json({
                            message: `Wrong Email/Password`
                        })
                    } else {
                        console.log("User berhasil ditemukan ====>", user)
                        let isValid = bcrypt.compareSync(req.body.password, user.password)
                        console.log("Cek validity==>", isValid)
                        if(isValid) {
                            let token = jwtConvert.sign({id: user._id, email: user.email}, process.env.JWT_SECRET)
                            console.log("Token dihasilkan token", token)
                            res.status(200).json({
                                token: token
                            })
                        } else {
                            res.status(403).json({
                                message: 'Wrong Email/Password'
                            })
                        }
                    }
                })
        } else if (req.body.loginVia == 'googleSignIn') {
            googleSignin(req.body.id_token)
            .then(user => {
              User
                .findOne({
                  email: user.email
                })
                .then(findUser => {
                  if(!findUser) {
                    User
                      .create({
                        email: user.email,
                        password: process.env.GOOGLE_DEFAULT_PASSWORD
                      })
                      .then(registerUser => {
                        let token = jwtConvert.sign({
                          email: registerUser.email
                        })
                        res.status(201).json({
                          token: token
                        })
                      })
                  } else {
                    let token = jwtConvert.sign({
                      email: user.email
                    })
                    res.status(200).json({
                      token: token
                    })
                  }
                })
            })
        }
    }

    static getUserDetail (req,res) {
        User.findOne({
            email: req.loggedInUser.email
        }).populate('listTodo')
          .then(user =>{
            console.log("hasil getuserdetail: ", user)
            res.status(200).json({
                msg: `Detail of user ${user.name}`,
                userid: user._id,
                name: user.name,
                email: user.email,
                listTodo: user.listTodo,
                group: user.group
            })
          })
          .catch(error =>{
            res.status(500).json({
                msg: 'ERROR: ',error
            })
          })
    } 
}

module.exports = UserController;