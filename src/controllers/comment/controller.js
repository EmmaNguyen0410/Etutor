const { Comment } = require('../../config/sequelize')

class CommentController{
    add(req, res){
        let userId = req.session.user.userId
        let { postId, content } = req.body
        
        Comment.create({
            content,
            PostId: postId,
            UserId: userId
        }).then(newComment => {
            if(newComment) res.send({status: true})
            else res.send({status: false})
        })
    }
}
module.exports = new CommentController()