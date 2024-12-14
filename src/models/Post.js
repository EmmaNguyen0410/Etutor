module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Post',{
        title: { type: Sequelize.STRING },
        content: { type: Sequelize.STRING }
    })
}