function activatePeer() {
    const peer = new Peer();

    peer.on("open", (id) => {
        events.onactivate = async function () { 
            Object.keys(players).forEach((key) => {
                const player = players[key];

                if (key != myPlayer.name) {
                    if (player.online) {
                        call(player, peer);
                    }
                }
            })
            events.onactivate = () => {};
        }

        openSocket(id);
    });

    peer.on("call", async (call) => {
        Object.keys(players).forEach(async (key) => {
            if (players[key].id == call.peer) {
                call.answer(await getMedia());

                call.on("stream", (stream) => {
                addStream(stream, players[key]);
            });
            }
        });
    });
}

function getMedia() {
    return new Promise((st) => {
        navigator.mediaDevices.getUserMedia({"audio": true, "video": false})
        .then((stream) => {
            st(stream);
        })
        .catch((error) => {
            alert(error);
    
            if (error == "NotAllowedError") {
                alert("Please reload the page and acept the mic request!")
            }
        })
    })
}

function addStream(stream, player) {
    const audio = document.createElement("audio");
    audio.srcObject = stream;
    audio.volume = Math.min(1 / distance(myPlayer.pos, player.pos), 1);

    player.audio = audio;
}

async function call (player, peer) {
    const media = await getMedia();
    const call = peer.call(player.id, media);

    call.on("stream", (stream) => {
        addStream(stream, player);
    });
}