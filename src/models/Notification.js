module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Notification',{
        content: { type: Sequelize.STRING },
        moreDetail: { type: Sequelize.STRING },
        href: { type: Sequelize.STRING },
        type: { type: Sequelize.STRING },
        seen: { type: Sequelize.BOOLEAN },
    })
}