const vars = document.location.search.split("&&");
vars[0] = vars[0].substring(1);
const token = getVar("token");
let myPlayer;
let players = {};
const ownPlayer = {"token": token};
const connect = document.querySelector('#connect');
const events = {"onactivate": () => {}, "onresize": () => {}};
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

window.onload = () => {

    if (getVar("autoconnect") == "true") activatePeer();
    else {
        connect.style = "display: block;";
        connect.addEventListener("click", () => {
            activatePeer();
            connect.style = "display: none;";
        });
    }

    initCanvas();
};

window.onresize = () => {
    initCanvas();
    drawPlayers(players);
}

function getVar(name) {
    let output = false;
    vars.forEach((nme) => {
        if (nme.startsWith(name)) {
            output = nme.substring(name.length + 1);
        }
    });

    return output;
}

function getPlayer(id) {
    let player;
    Object.keys(players).forEach((key) => {
        if (players[key].id == id) player = players[key];
    });

    return player;
}

async function getUrl(username) {
    const response = await fetch("https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/" + username);
    let json = await response.json();
        
    const textures = await fetch("https://corsproxy.io/?https://sessionserver.mojang.com/session/minecraft/profile/" + json.id);
    json = await textures.json();
    
    return JSON.parse(atob(json.properties[0].value)).textures.SKIN.url;
}

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.width = window.innerWidth;
    context.height = window.innerHeight;
    context.imageSmoothingEnabled = false;
}