function drawPlayers(players) {
    const names = Object.keys(players);
    

    const size = Math.min((window.innerHeight - 120) / names.length, 150);
    const padding = (window.innerHeight - (size * names.length + 20 * (names.length - 1))) / 2;


    context.fillStyle = "#1b1b1b";
    context.fillRect(0, 0, innerWidth, innerHeight);

    for (let index = 0; index < names.length; index++) {
        const name = names[index];
        
        const image = document.createElement("img");
        getUrl(name)
        .then((url) => {
            image.src = url;

            if (players[name].online){
                context.filter = "grayscale(0)";
            }
            else context.filter = "grayscale(1)"
            context.drawImage(image, 8, 8, 8, 8, 50, (size + 20) * index + padding, size, size);

        })
    }
}