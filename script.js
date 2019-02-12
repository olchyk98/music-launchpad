let loadingIcon =
    player =
    launchpad =
    null;

// var radgrad = ctx.createRadialGradient(20,30,0,20,20,20);
//         radgrad.addColorStop(0, 'rgba(255,0,0,1)');
//         radgrad.addColorStop(0.8, 'rgba(228,0,0,.9)');
//         radgrad.addColorStop(1, 'rgba(228,0,0,0)');

const stats = {
    loadingSong: false
}

class LoadIcon {
    constructor() {
        this.size = 35;

        this.y = height / 2 - this.size / 2;
        this.x = width / 2 - this.size / 2;
        this.speed = 100;
    }

    render() {
        fill('white');
        rect(
            this.x,
            this.y,
            this.size,
            this.size
        );

        return this;
    }

    move() {
        this.x += this.speed;
        if(this.x > width) {
            this.x = -this.size - 50;
            this.y = random(height - this.size);
        }

        return this;
    }

    draw() {
        this.render().move();
    }
}

class Player {
    constructor() {
        this.song = null;
        this.songProcess = false;
        this.loadingSong = false;
    }

    playSong(song) {
        if(song.type !== "audio") {
            console.error(`Expected type: audio, received: ${ song.type }`);
            return alert("Invalid file format.");
        }

        this.loadingSong = true;

        const player = loadSound(this.song, () => {
            this.loadingSong = false;
            this.song = player;
            player.play();
            this.songProcess = true;
        });
    }
}

class LaunchPad { // It's not a real launchpad. The user cannot click on a different buttons to play sounds.
    render() {
        const padding = 15,
              margin = 5,
              bsize = 45,
              buttonsX = floor((width - padding * 2) / bsize),
              buttonsY = floor((height - padding * 2) / bsize);

        for(let ma = 0; ma < buttonsY; ma++) {
            for(let mk = 0; mk < buttonsX; mk++) {
                fill('red');
                rect(
                    bsize * mk + padding + margin * mk,
                    bsize * ma + padding + margin * ma,
                    bsize,
                    bsize
                );
            }
        }

        return this;
    }

    draw() {
        this.render();
    }
}

function setup() {
    const csi = 425;
    createCanvas(csi, csi);

    player = new Player();
    loadingIcon = new LoadIcon();
    launchpad = new LaunchPad();

    // WARNING: I cannot use 'fast callback', because createFileInput APPLIES callback function.
    createFileInput((file) => {
        player.playSong(file);
    });
}

function draw() {
    background('black');

    if(player.loadingSong) {
        loadingIcon.draw();
    }

    launchpad.draw();
}