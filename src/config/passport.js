const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy

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

//강의 내용과 다르게 이메일을 더는 권한을 주지 않고 들어가보면 에러가 발생한다.
// 그래도 강의를 남겼고 이거 또한 학습이니 코드는 남겨둘 것이다.
// const kakaoStrategyConfig = new KakaoStrategy({
//     clientID: process.env.kAKAO_CLIENT_ID,
//     callbackURL: '/auth/kakao/callback',
//     scope: ['profile_nickname']
// },
//     async (accessToken, refreshToken, profile_nickname, done) => {
//         try{
//             const existingUser = await User.findOne({ kakaoId: profile.id});

//             if (existingUser) {
//                 return done(null, existingUser);
//             } else {
//                 const user = new User();
//                 user.kakaoId = profile.id;
//                 await user.save();
//                 done(null, user);
//                 }
//         } catch(arr) {
//             return done(err);
//         }
//     }
// )
// passport.use('kakao',kakaoStrategyConfig);