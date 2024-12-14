const Peer = require('simple-peer')
const openStream = require('./open-stream.js')
const playVideo = require('./play-video')
let calling_socket = io.connect('/calling')

const $stopCallBtn = document.getElementById('et-stop-call-btn')
const $endCallMsg = document.getElementById('et-end-call-msg')

calling_socket.emit('joinCallRoom', ({ userId: localStorage.getItem('userId')}))

openStream(function (stream) {

    playVideo(stream, 'localStream')

    const p = new Peer({
        initiator: location.hash === '#1',
        trickle: false,
        stream: stream,
        config: {
            iceServers: [
                {
                    urls: "stun:ss-turn2.xirsys.com"
                },
                {
                    username: "k3sjhrG8bf_JtVATzpMHsd2TAWTuBIxDbJXchEdP7e_4LYMCen7TlZJkxE2PRjrCAAAAAF6G4D90aGFvZ3Vt",
                    urls: "turns:ss-turn2.xirsys.com:443?transport=tcp",
                    credential: "841f7188-7579-11ea-8dfd-12fa47b8f761"
                },
                {
                    username: "k3sjhrG8bf_JtVATzpMHsd2TAWTuBIxDbJXchEdP7e_4LYMCen7TlZJkxE2PRjrCAAAAAF6G4D90aGFvZ3Vt",
                    urls: "turns:ss-turn2.xirsys.com:5349?transport=tcp",
                    credential: "841f7188-7579-11ea-8dfd-12fa47b8f761"
                }
            ]
        }
    })

    p.on('signal', token => {
        console.log('my token', token)
        calling_socket.emit('sendToken', { myUserId: localStorage.getItem('userId'), token: JSON.stringify(token)})
    })

    p.on('connect', () => {
        console.log('connected')
    })

    calling_socket.on('friendToken', ({ userId, friendToken }) => {
        console.log(userId, friendToken)
        if(userId == localStorage.getItem('userId')){
            console.log('my friend token', friendToken)
            p.signal(JSON.parse(friendToken))
        }
    })

    p.on('stream', friendStream => {
        playVideo(friendStream, 'friendStream')
        myFriendStream = friendStream
    })

    $stopCallBtn.addEventListener('click', () => {
        calling_socket.emit('stop-call', { userId: localStorage.getItem('userId') }, () => {
            p.destroy()
            let $friendStream = document.getElementById('friendStream')
            let $myStream =  document.getElementById('localStream')

            $friendStream.style.display = 'none'
            $myStream.style.display = 'none'
            $stopCallBtn.style.display = 'none'
            $endCallMsg.style.display = 'block'
        })
    })
    
    calling_socket.on('stopped-call', ({ callerId, answererId }) => {
        let myUserId = localStorage.getItem('userId')
        if(callerId == myUserId || answererId == myUserId) {
            let $friendStream = document.getElementById('friendStream')
            let $myStream =  document.getElementById('localStream')

            $friendStream.style.display = 'none'
            $myStream.style.display = 'none'
            $stopCallBtn.style.display = 'none'
            $endCallMsg.style.display = 'block'
        }
    })

})
