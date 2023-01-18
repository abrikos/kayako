const passport = require('../passport');
const md5 = require("md5");
const moment = require("moment/moment");
const mailer = require('../mailer');

module.exports = function (app) {
    const {db} = app.locals;

    app.post('/api/ticket/create', passport.isLogged, async (req, res)=>{
        const {user} = res.locals;
        req.body.userid = user.linktypeid;
        req.body.dateline = moment().unix();
        //return res.sendStatus(200)
        const ticket = await db.swtickets.create(req.body)
        const post = await db.swticketposts.create({ticketid: ticket.ticketid, dateline: moment().unix(), contents: req.body.text})
        res.send(ticket)
    })

    app.get('/api/ticket/list', async (req, res)=>{
        const {user} = res.locals;
        const list = await db.swtickets.findAll({
            where:{userid: user.linktypeid},
            include: [
                {model: db.swticketposts},
                {model: db.swdepartments},
            ],
        })
        res.send(list)
    })


}