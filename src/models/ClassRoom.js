module.exports = (sequelize, Sequelize) => {
    return sequelize.define('ClassRoom',{
        name: { type: Sequelize.STRING }
    })
}