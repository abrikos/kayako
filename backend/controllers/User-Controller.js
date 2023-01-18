const passport = require('../passport');
const md5 = require("md5");
const moment = require("moment/moment");
const mailer = require('../mailer');

module.exports = function (app) {
    const {db} = app.locals;

    async function createUsers() {
        const users = JSON.parse(process.env.USERS)
        for (const user of users) {
            const found = await db.swuseremails.findOne({where:{email:user.name}})
            if(!found){
                db.swuseremails.create({email:user.name, userpassword: user.password, isAdmin: user.admin ? 1: 0})
            }
        }
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

}
