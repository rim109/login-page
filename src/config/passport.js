const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
    User.findById(id)
        .then(user=>{
            done(null,user);
        })
})


const localStrategyConfig = new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                return done(null, false, { msg: `Email ${email} not found` });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) return done(err);

                if (isMatch) {
                    return done(null, user);
                }
                return done(null, false, { msg: 'Invalid email or password' });
            });
        } catch (err) {
            return done(err);
        }
    }
);
passport.use('local', localStrategyConfig);
 

// passport.use('google',new GoogleStategy({}))
const googleStrategyconfig = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENR_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['email','profile']
},
    async (accessToken, refreshToken, profile, done) => {
        try{
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                return done(null, existingUser);
            } else {
                const user = new User();
                user.email = profile.emails[0].value;
                user.googleId = profile.id;
                await user.save();
                done(null, user);
                }
        } catch(arr) {
            return done(err);
        }
    }
)
passport.use('google', googleStrategyconfig);