const express = require('express');
const passport = require('passport');
const User = require('../models/user.model');
const sendEMail = require('../mail/mail');
const usersRouter = express.Router();

usersRouter.post('/login', (req, res, next) => {
    passport.authenticate("local",(err, user,info)=> {
        if(err) {
            return next(err);
        }

        if(!user) {
            return res. json({msg: info});
        }
        req.logIn(user, function(err) {
            if(err) {return next(err); }
            res.redirect('/') 
        })
    })(req, res, next)
})

usersRouter.post('/logout', (req, res, next)=>{
    req.logOut(function(err){
        if(err){return next(err);}
        res.redirect('/login');
    })
})

usersRouter.post('/signup', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        //이메일 보내기
        sendEMail('받는 사람 이메일','받는 사람 이름', 'welcome');
        res.redirect('/login'); 
        // return res.status(200).json({
        //     success:true,
        // })

    } catch (error) {
        console.error(error);
    }
})

usersRouter.get('/google', passport.authenticate('google'));

usersRouter.get('/google/callback', passport.authenticate('google',{
    successReturnToOrRedirect:'/',
    failureRedirect:'/login'
}))

// usersRouter.get('/kakao', passport.authenticate('kakao'))

// usersRouter.get('/kakao/callback',passport.authenticate('kakao',{
//     successReturnToOrRedirect:'/',
//     failureRedirect:'/login'
// }));


module.exports = usersRouter;