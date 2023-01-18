const fs = require("fs");
const file = __dirname + '/../../frontend/dist/index.html'
const {Op} = require("sequelize");

module.exports = function (app) {
    const {db} = app.locals;
    app.get('/api/build-date', (req, res) => {
        fs.stat(file, (err, stats) => {
            res.send(stats)
        })
    })

    app.get('/api/departments/list', (req, res) => {
        db.swdepartments.findAll({where: {departmenttype: 'public'}})
            .then(list => {
                res.send(list.map(d => d.title))
            })
    })

    app.get('/api/organisation/list', (req, res) => {
        db.swuserorganizations.findAll({
            attributes: ['userorganizationid', 'organizationname'],
            order: [['organizationname', 'ASC']],
            include: [
                {
                    model: db.swusers, attributes: ['userid', 'fullname', 'phone'],
                    include: [{model: db.swuseremails, attributes: ['email'],}]
                }
                ]
        })
            .then(list => {
                res.send(list)
            })
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

    app.get('/api/article/list', (req, res) => {
        db.swkbarticles.findAll({
            attributes: ['kbarticleid', 'subject', 'dateline', 'views'],
            order: [['dateline', 'DESC']],
        })
            .then(list => {
                res.send(list)
            })
    })

    app.get('/api/article/view/:id', (req, res) => {
        db.swkbarticles.findByPk(req.params.id, {
            attributes: ['kbarticleid', 'subject', 'dateline', 'views'],
            include:[{model:db.swkbarticledata}],
            order: [['dateline', 'DESC']],
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

    app.post('/api/search', async (req, res) => {
        console.time('search')
        res.send(await search2(req.body))
        console.timeEnd('search')
    })


    async function search2({model, ticketid, text, email, department, textAttach}) {
        const rules1 = []
        const include = []
        if (model) {
            include.push({
                model: db.swcustomfieldvalues,
                attributes: ['fieldvalue'],
                where: {customfieldid: 12, fieldvalue: {[Op.like]: `%${model}%`}}
            })
        }
        if (ticketid) rules1.push({ticketid})
        if (textAttach) {
            const attach = await db.swattachments.findAll({
                attributes: ['ticketid'],
                where: {filename: {[Op.like]: `%${textAttach}%`}}
            })
            rules1.push({ticketid: {[Op.in]: attach.map(d => d.ticketid)}})
        }
        if (text) {
            const posts = await db.swticketposts.findAll({
                attributes: ['ticketid'],
                where: {contents: {[Op.like]: `%${text}%`}}
            })
            rules1.push({[Op.or]: [{subject: {[Op.like]: `%${text}%`}}, {ticketid: {[Op.in]: posts.map(d => d.ticketid)}}]})
        }
        if (email) rules1.push({email: {[Op.like]: `%${email}%`}})
        if (department) rules1.push({departmenttitle: {[Op.like]: `%${department}%`}})
        return db.swtickets.findAll({
            attributes: ['ticketid', 'departmenttitle', 'email', 'subject', 'fullname', 'dateline', 'ownerstaffname'],
            include,
            where: {
                [Op.and]: rules1
            },
            //logging: console.log
        })
    }

    app.get('/api/ticket/view/:id', async (req, res) => {
        const {user} = res.locals;
        const ticket = await db.swtickets.findByPk(req.params.id, {
            include: [
                {model: db.swticketposts, include: [{model: db.swusers}]},
                {model: db.swdepartments},
                {model: db.swattachments},
                {model: db.swtickettypes},
                {
                    model: db.swcustomfieldvalues,
                    attributes: ['fieldvalue'],
                    where: {customfieldid: 12},
                    required: false
                },
                {model: db.swticketstatus},
                {model: db.swticketpriorities},
                {model: db.swusers}
            ],
            order: [
                [db.swticketposts, 'dateline', 'ASC']
            ]
        })
        res.send(ticket)
    })
}