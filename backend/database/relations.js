module.exports = (db) => {
  db.swusers.hasMany(db.swuseremails, {foreignKey: 'linktypeid', as: 'emails'})
  db.swuseremails.belongsTo(db.swusers, {foreignKey: 'linktypeid'})
  /*db.swuseremails.findOne({
    where: {email: 'techsup@hikom.ru'},
    include: [{model: db.swusers}],
    logging: console.log
  })
    .then(email => {
      console.log(email.swuser)
    })*/

}
