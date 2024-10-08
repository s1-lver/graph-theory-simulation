const coords = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 2],
]

const startPos = 0;
const endPos = 4;
let current = startPos;


let points = []
let lines = []

let connections = {} // Number of adjacent points
let adjacents = {} // The index of adjacent points

class Point {
    constructor(pos) {
        this.pos = pos;

        this.draw = function () {
            game.ctx.beginPath();
            game.ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
            game.ctx.fillStyle = "orange";
            game.ctx.fill();
        };
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;

        this.draw = function () {
            game.ctx.beginPath();
            game.ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
            game.ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
            game.ctx.stroke();
        }
    }
}

function removeDuplicatesFromDictionary(adjacent) {
    const cleanedDictionary = {};

    Object.keys(adjacent).forEach(key => {
        const array = adjacent[key];       
        const uniqueArray = Array.from(new Set(array));
        
        cleanedDictionary[key] = uniqueArray;
    });

    return cleanedDictionary;
}


let game = {
    start: function() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

    //     this.canvas.height = window.innerHeight;
    //     this.canvas.width = window.innerWidth;
        this.canvas.height = 600;
        this.canvas.width = 600;

        for (let i = 0; i < coords.length; i++) {
            points.push(new Point(new Vector2D((coords[i][0]*100)+100, this.canvas.height-((coords[i][1]*100)+100))))
        }

        
        for (let i = 0; i < coords.length; i++){
            for (let j = 0; j < coords.length; j++){
                if (i !== j) {
                    if (Math.abs(coords[i][0] - coords[j][0]) <= 1 && Math.abs(coords[i][1] - coords[j][1]) <= 1 || Math.abs(coords[i][1] - coords[j][1]) <= 1 && Math.abs(coords[i][0] - coords[j][0]) <= 1) {
                        lines.push(new Line(points[i], points[j]));
                        
                        if (i in connections) {
                            connections[i] += 1

                            if (i in adjacents) {
                                adjacents[i].push(points[j])
                            } else {
                                adjacents[i] = [points[j]]
                            }
                        } else {
                            connections[i] = 1
                            
                            if (i in adjacents) {
                                adjacents[i].push(points[j])
                            } else {
                                adjacents[i] = [points[j]]
                            }
                        }

                        if (j in connections) {
                            connections[j] += 1
                            
                            if (j in adjacents) {
                                adjacents[j].push(points[i])
                            } else {
                                adjacents[j] = [points[i]]
                            }
                        } else {
                            connections[j] = 1
                            
                            if (j in adjacents) {
                                adjacents[j].push(points[i])
                            } else {
                                adjacents[j] = [points[i]]
                            }
                        }
                    }
                }
            }
        }

        adjacents = removeDuplicatesFromDictionary(adjacents);

        let odd = 0;
        let even = 0;

        for (let key in connections) {
            connections[key] /= 2;

            if (connections[key] % 2 == 0) {
                even += 1;
            } else {
                odd += 1;
            }
        }

        if (odd > 2 || odd == 1) {
            console.log("IMPOSSIBLE")
        } else {
            console.log("POSSIBLE")
        }

        console.log(connections);



        // while (current !== endPos) {

        // }

        // console.log(adjacents[1][0].pos.x/100-1, (game.canvas.height-(adjacents[current][0].pos.y))/100-1)
        // console.log(adjacents[1][1].pos.x/100-1, (game.canvas.height-(adjacents[current][1].pos.y))/100-1)
        // console.log(adjacents[1][2].pos.x/100-1, (game.canvas.height-(adjacents[current][2].pos.y))/100-1)
    },
    stop: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}


function animate(){
    window.requestAnimationFrame(animate);

    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    

    for (let l = 0; l < lines.length; l++) {
        lines[l].draw();
    }

    for (let p = 0; p < points.length; p++) {
        points[p].draw();

        game.ctx.font = "16px Arial";
        game.ctx.fillText(`${connections[p]}`, points[p].pos.x+5, points[p].pos.y+15)
    }
}

game.start();
animate()