function playVideo(stream, idVideo){
    const video = document.getElementById(idVideo)
    video.srcObject = stream
    video.onloadedmetadata = function(){
        video.play()
    }
}
module.exports = playVideo