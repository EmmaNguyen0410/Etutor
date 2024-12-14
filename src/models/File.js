module.exports = (sequelize, Sequelize) => {
    return sequelize.define('File',{
        type: { type: Sequelize.STRING },
        path: { type: Sequelize.STRING }
    })
}