module.exports = (sequelize, Sequelize) => {
    return sequelize.define('GroupChat',{
        name: { type: Sequelize.STRING }
    })
}