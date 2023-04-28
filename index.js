
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const passport = require('passport') 
const LocalStrategy = require('passport-local').Strategy

const session = require('express-session')
app.use(session({ secret: 'I am Damnkid.', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy((username, password, done) => {
    if(username =="admin" && password=="1234") {
        let user = {    
            _id : 1,
            fname : "Damnkid "
        }
        console.log('Correct Password.')
        return done(null,user)
    } else {
        console.log('Incorrect password.')
        return done(null, false, { message: 'Incorrect password.' })
    }
}))
passport.serializeUser((user, done) => {
    console.log('SerializeUser')
    done(null, user) 
})
passport.deserializeUser((user, done) => {
    console.log('DeserializeUser')
    done(null, user) 
})

app.get('/', (req, res) =>  {
    res.render('login')
})

app.post('/login', passport.authenticate('local', { 
    successRedirect: '/home',
    failureRedirect: '/' 
}))

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/')
    }
}

app.get('/home',isLoggedIn,(req,res) => {
    res.render('/home',req.user)
})

app.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/')
})


let contact_page = require('./views/contact.ejs');
//import module ไว้ในตัวแปร contact_page

app.set("view engine","ejs"); //กำหนดให้ express js โดยใช้ ejs เป็น template engine

//ส่วนนี้กำหนดให้แสดงหน้าเว็บจาก views/index.ejs เมื่อเข้าหน้าเว็บ
app.get('./index', (req, res) => {
    res.render('index');
   
});

//ส่วนนี้กำหนดให้แสดงหน้าเว็บจาก views/about.ejs 
app.get('./about', (req, res) => {
    res.render('about');
});
//เปลี่ยน aboutเป็นmain


contact_page.contact(app);

app.listen(port);