const { Post, User, ClassRoom, Comment, File } = require('../../config/sequelize')

class PostController {
    createNewPost(req, res){
        let userId = req.session.user.userId
        let { title, content, classId } = req.body

        Post.create({
            title,
            content,
            ClassRoomId: classId,
            UserId: userId
        }).then(newPost => {
            if(newPost){
                res.send({status: true, post: newPost})
            }else{
                res.send({status: false, message: "Cannot not add new post!"})
            }
        })
        
    }
    getPostsByClassId(req, res){
        let { classId } = req.body

        Post.findAll({
            where: { ClassRoomId: classId },
            include: [{ model: User }, { model: Comment, include: [{ model: User }] }, {model: File}],
            order: [['createdAt', 'ASC']]
        }).then(posts => {
            let postsDetail = []

            posts.forEach(post => {
                postsDetail.push({
                    postId: post.id,
                    postTitle: post.title,
                    postContent: post.content,
                    postCreatedAt: post.createdAt,
                    postUpdatedAt: post.updatedAt,
                    postAuthor: post.User.name,
                    filesData: post.Files,
                    postComments: post.Comments
                })
            })

            res.send({status: true, posts: postsDetail})
        })
    }
}
module.exports = new PostController()