let loadingIcon =
    player =
    launchpad =
    null;

let fft = new p5.FFT();

const stats = {
    loadingSong: false
}

class LoadIcon {
    constructor() {
        this.size = 35;

        this.y = height / 2 - this.size / 2;
        this.x = width / 2 - this.size / 2;
        this.speed = 110;
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
        this.songProcess = false;

        const player = loadSound(song, () => {
            this.loadingSong = false;
            this.song = player;
            player.play();
            this.songProcess = true;
        });

        player.amp(0.2);
    }
}

class LaunchPad { // It's not a real launchpad. The user cannot click on a different buttons to play sounds.
    constructor() {
        this.playStack = [];
        this.pads = [ // sensitivity // min: 1000, max: 10000
            [ 7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500 ],
            [ 7500, 3000, 2500, 2500, 2500, 2500, 3000, 7500 ],
            [ 7500, 5000, 2500, 2500, 2500, 2500, 5000, 7500 ],
            [ 7500, 5000, 2500, 1000, 1000, 2500, 5000, 7500 ],
            [ 7500, 5000, 2500, 1000, 1000, 2500, 5000, 7500 ],
            [ 7500, 5000, 2500, 1000, 1000, 2500, 5000, 7500 ],
            [ 7500, 3000, 2500, 2500, 2500, 2500, 3000, 7500 ],
            [ 7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500 ]
        ];
    }

    render() {
        const padding = 15,
              margin = 5,
              bsize = 45;

        this.pads.forEach((io, ma) => {
            io.forEach((ia, mk) => {
                // Get pad power
                let a = this.playStack[ io.length * ma + mk ];
                if(a) {
                    let b = a * ia,
                        c = [0, 0, 0];

                    if(b < 30) {
                        c = [255, 255, 255];
                    } else if(b < 75) {
                        c = [255, 0, 255];
                    } else if(b < 100) {
                        c = [0, 0, 255];
                    } else {
                        c = [255, 0, 0];
                    }
                    fill(c[0], c[1], c[2], b);
                } else {
                    fill(50);
                }

                rect(
                    bsize * mk + padding + margin * mk,
                    bsize * ma + padding + margin * ma,
                    bsize,
                    bsize
                );
            });
        });

        return this;
    }

    color() {
        const fftdata = fft.waveform();
        const eqdata = [];
        const split = floor(fftdata.length / (this.pads.length * this.pads[0].length));

        // pads = stacks
        for(let ma = 0; ma < floor(fftdata.length / split); ma++) {
            // Get stack
            let a = fftdata.slice(ma * split, ma * split + split);

            // Get avg
            let b = abs(a.reduce((a, b) => a + b) / a.length);

            // Push avg
            eqdata.push(b);
        }

        this.playStack = eqdata;

        return this;
    }

    draw() {
        if(player.songProcess) this.color();
        this.render();
    }
}

function setup() {
    const csi = 425;
    createCanvas(csi, csi);
    frameRate(30);

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

    // TODO: Blink buttons instead of icon
    if(player.loadingSong) {
        loadingIcon.draw();
    }

    launchpad.draw();
}