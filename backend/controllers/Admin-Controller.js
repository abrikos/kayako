const passport = require('../passport');
const moment = require("moment");
module.exports = function (app) {
    const {db} = app.locals;

    app.get('/api/admin/users', passport.isAdmin, async (req, res) => {
        const users = await db.swuseremails.findAll({order: [['createdAt', 'DESC']]})
        res.send(users)
    })

    app.get('/api/admin/user/:id/block', passport.isAdmin, async (req, res) => {
        try {
            const user = await db.swuseremails.findByPk(req.params.id)
            user.blocked = !user.blocked
            await user.save()
            res.sendStatus(200)
        } catch (e) {
            app.locals.errorLogger(e, res)
        }
    })

    app.get('/api/admin/user/:id/delete', passport.isAdmin, async (req, res) => {
        try {
            const user = await db.swuseremails.findByPk(req.params.id)
            await user.destroy()
            res.sendStatus(200)
        } catch (e) {
            app.locals.errorLogger(e, res)
        }
    })

    app.get('/api/admin/switch-role/:id', passport.isAdmin, async (req, res) => {
        try {
            const user = await db.swuseremails.findByPk(req.params.id)
            const admins = await db.swuseremails.findAll({where:{isAdmin: true}})
            if (admins.length <= 2 && user.isAdmin) throw {error: 406, message: 'Невозможно снять привилегии т.к. количество оставшихся админов 2'}
            user.isAdmin = !user.isAdmin
            await user.save()
            res.sendStatus(200)
        } catch (e) {
            app.locals.errorLogger(e, res)
        }
    })

    app.post('/api/admin/user/create', async (req, res) => {
        try {
            const {email, password} = req.body
            const found = await db.swuseremails.findOne({where: {email}})
            console.log(found)
            if(found) throw {error: 406, message: 'User exists'}
            console.log(email, password)
            const user = await db.swuseremails.create({email, userpassword:password, createdAt:moment().format('YYYY-MM-DD HH:mm')})
            res.sendStatus(200);
        } catch (e) {
            app.locals.errorLogger(e, res)
        }
    })

    app.post('/api/admin/user/:id/change-password', async (req, res) => {
        try {
            const {password} = req.body
            const user = await db.swuseremails.findByPk(req.params.id)
            user.userpassword = password
            await user.save()
            res.sendStatus(200);
        } catch (e) {
            app.locals.errorLogger(e, res)
        }
    })
    //db.chassis.find().then(c=>console.log(c.map(cc=>cc.form)))
    //db.component.find({partNumber: '4 SATA - 1*SFF-8643'}).then(console.log)
    //db.chassis.find().then(console.log)


}
