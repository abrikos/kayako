const passport = require('../passport');
const md5 = require("md5");
const moment = require("moment/moment");
const mailer = require('../mailer');
const {Op} = require("sequelize");

module.exports = function (app) {
    const {db} = app.locals;

    app.get('/api/ticket/view/:id', async (req, res) => {
        const {user} = res.locals;
        const ticket = await db.swtickets.findByPk(req.params.id, {
            attributes:['ticketid', 'subject', 'ownerstaffname', 'dateline'],
            include: [
                {model: db.swticketposts, attributes:['ticketpostid','dateline','fullname','email','subject','contents'],
                    //include: [{model: db.swusers}]
                },
                {model: db.swdepartments, attributes:['title']},
                {model: db.swattachments, attributes:['linktypeid', 'attachmentid', 'filetype', 'storefilename']},
                {model: db.swtickettypes, attributes:['title']},
                {
                    model: db.swcustomfieldvalues,
                    attributes: ['fieldvalue'],
                    where: {customfieldid: 12},
                    required: false
                },
                {model: db.swticketstatus, attributes:['title']},
                {model: db.swticketpriorities, attributes:['title']},
                //{model: db.swusers}
            ],
            order: [
                [db.swticketposts, 'dateline', 'ASC']
            ]
        })
        console.log(JSON.parse(JSON.stringify(ticket)))
        res.send(JSON.parse(JSON.stringify(ticket)))
    })

    app.get('/api/ticket/users/:id', (req, res) => {
        db.swtickets.findAll({
            attributes: ['ticketid', 'departmenttitle', 'email', 'subject', 'fullname', 'dateline', 'ownerstaffname'],
            where: {userid: req.params.id},
        })
            .then(list => {
                res.send(list)
            })
    })


    app.get('/api/ticket/organisation/:id', async (req, res) => {
        const users = await db.swusers.findAll({attributes: ['userid'], where: {userorganizationid: req.params.id}})
        const list = await db.swtickets.findAll({
            attributes: ['ticketid', 'departmenttitle', 'email', 'subject', 'fullname', 'dateline', 'ownerstaffname'],
            where: {userid: {[Op.in]: users.map(d => d.userid)}},
        })
        res.send(list)

    })


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