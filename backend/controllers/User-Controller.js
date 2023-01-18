const passport = require('../passport');
const md5 = require("md5");
const moment = require("moment/moment");
const mailer = require('../mailer');

module.exports = function (app) {
    const {db} = app.locals;

    async function createUsers() {
        const found = await db.swuseremails.findOne({where:{email:'user@test.com'}})
        found.isAdmin = true;
        found.save()

    }

    createUsers()

    app.post('/api/auth/login', passport.authenticate)

    app.post('/api/auth/logout', passport.logout);

    app.get('/api/auth/user', passport.isLogged, async (req, res) => {
        const {user} = res.locals;
        res.send(passport.adaptUser(user))
    })

    app.post('/api/auth/refresh', async (req, res) => {
        try {
            const {refresh_token} = req.body;
            //console.log('Auth Refresh called', req.body)
            const token = await db.tokens.findOne({where: {refresh_token}})
            if(!token) res.sendStatus(403)
            token.access_token = md5(Math.random())
            await token.save()
            res.send(token.access_token)
        } catch (e) {
            app.locals.errorLogger(e, res)
        }
    })

    app.get('/api/user/confirm-reset/:code', async (req, res) => {
        try {
            const user = await db.user.findOne({resetCode: req.params.code})
            if (!user) throw {message: 'Wrong reset code'}
            const passwd = user.password = md5(moment().unix()).substr(0, 5)
            user.save()
            user.resetCode = '';
            mailer.sendMail({
                from: process.env.MAIL_USER,
                to: user.email,
                subject: 'New password',
                text: passwd
            })
            res.redirect('/user/reset-password-done')
        } catch (e) {
            app.locals.errorLogger(e, res)
        }
    })

    app.post('/api/user/reset-password', async (req, res) => {
        const {email} = req.body;
        try {
            const found = await db.user.findOne({email})
            if (!found) throw {message: 'Wrong email'}
            found.resetCode = md5(moment().unix());
            found.save()
            const site = 'https://' + req.get('host') + '/api/user/confirm-reset/' + found.resetCode
            mailer.sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: 'Reset password',
                text: `To confirm password reset please visit: ${site}`
            })
            const {user} = res.locals;
            res.sendStatus(200)
        } catch (e) {
            app.locals.errorLogger(e, res)
        }
    })

    app.post('/api/user/update', passport.isLogged, async (req, res) => {
        const {user} = res.locals;
        const {username, password, passwordConfirm} = req.body;
        user.fullname = username;
        if (password && passwordConfirm === password) {
            user.password = password
        }
        await user.save()
        res.sendStatus(200);
    })

}
