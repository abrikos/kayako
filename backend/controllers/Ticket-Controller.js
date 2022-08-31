const passport = require('../passport');
const md5 = require("md5");
const moment = require("moment/moment");
const mailer = require('../mailer');

module.exports = function (app) {
    const {db} = app.locals;

    app.get('/api/ticket/list', passport.isLogged, async (req, res)=>{
        const {user} = res.locals;
        const list = await db.swtickets.findAll({where:{userid: user.linktypeid}})
        res.send(list)
    })
}