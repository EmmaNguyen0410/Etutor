const { File } = require('../../config/sequelize')
const http = require('http');
const formidable = require('formidable');
const fs = require('fs')
const path = require('path')

class FileController{
    getFile(req, res){
        res.send({path: "/uploads/CTest.docx"})
    }
    upload(req, res){
        let userId = req.session.user.userId
        let form = formidable({multiples: true})
        let createdFileList = []

        form.parse(req, function(err, fields, files){
            if(err) res.send({status: false, message: "Cannot upload the files!"})
            else{
                if(files.uploadedFiles){
                    let uploadedFiles = files.uploadedFiles
                    let uploadedFilesLength = uploadedFiles.length
                    let fileList = []

                    if(uploadedFilesLength == undefined){
                        fileList.push(uploadedFiles)
                    }else{
                        for(let i = 0; i < uploadedFilesLength; i++){
                            fileList.push(uploadedFiles[i])
                        }                    
                    }

                    fileList.forEach(file => {
                        let oldPath = file.path;
                        let newPath = path.join(__dirname,'../../../',`assets/uploads/${file.name}`)

                        console.log('oldPath', oldPath)
                        console.log('dirname',__dirname)
                        console.log('newPath', newPath)

                        // fs.renameSync(oldPath, newPath, (err) => {
                        //     if(err){
                        //         console.log(err)
                        //     }
                        // })

                        fs.copyFile(oldPath, newPath, (err) => {
                            if (err) throw err;
                            console.log('file copied to new dir');
                        });

                        createdFileList.push({
                            path: `/uploads/${file.name}`,
                            UserId: userId
                        })
                    })
                    File.bulkCreate(createdFileList).then(files => {
                        res.send({status: true, files})
                    })
                }
            }
        })
    }
    updateClassIdAndPostId(req, res){
        let {updatedFiles}= req.body

        File.bulkCreate(updatedFiles, { updateOnDuplicate: ['ClassRoomId', 'PostId', 'UserId', 'path']}).then(() => {
            res.send({status: true})
        })
        

    }
}
module.exports = new FileController()