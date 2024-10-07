function openSocket(id) {
    const socket = new WebSocket("ws://toni.nextfight.net:54294");
    
    socket.onopen = () => {
        socket.send(JSON.stringify({"type": "activate", "token": token, "body": {"id": id}}));
    };
    
    socket.onmessage = (message) => {
        msg = message;

        const response = JSON.parse(message.data);
        const body = response.body;
    
        if (response.result == "success") {
            switch (response.type) {
                case "room" : {
                    room = body;
                    rm = room;

                    players = {};
                    allowedIds = [];
    

                    room.players.forEach(player => {
                        if (player.online) allowedIds.push(player.id);

                        players[player.name] = player;
                        delete players[player.name].name;
                    });

                    drawPlayers(players);
                    events.onresize = drawPlayers(players);
                    
                    break;
                }
    
                case "activate": {
                    myPlayer = body;
                    events.onactivate();
                    break;
                }

                case "position": {
                    const player = players[body.name];
                    player.position = body.position;

                    if ("audio" in player) {
                        const audio = player.audio;

                        audio.volume = Math.min(1 / distance(myPlayer.position, player.position), 1);
                    }

                    break;
                }
    
                default: {
                }
            }
        } else {
            alert(response.message);
        }
    };
}

function distance(pos, otherPos) {
    return Math.hypot(pos.x - otherPos.x, pos.y - otherPos.y, pos.z - otherPos.z);
}