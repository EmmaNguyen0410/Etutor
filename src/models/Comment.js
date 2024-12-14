module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Comment',{
        content: { type: Sequelize.STRING }
    })
}