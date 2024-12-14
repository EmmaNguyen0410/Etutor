module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Message',{
        content: { type: Sequelize.STRING }
    })
}