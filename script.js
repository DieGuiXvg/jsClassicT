const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const skin = document.getElementById("skin");

const next = document.getElementById("next");
const next_ctx = next.getContext("2d");

const grid = 16;

ctx.imageSmoothingEnabled = false;

canvas.width = grid * 10;
canvas.height = grid * 20;

next.width = grid * 4;
next.height = grid * 4;

const T = [[
    [0,0,0,0],
    [1,1,1,0],
    [0,1,0,0],
    [0,0,0,0]
],[
    [0,1,0,0],
    [1,1,0,0],
    [0,1,0,0],
    [0,0,0,0]
],[
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
],[
    [0,1,0,0],
    [0,1,1,0],
    [0,1,0,0],
    [0,0,0,0]
]];

const J = [[
    [0,0,0,0],
    [1,1,1,0],
    [0,0,1,0],
    [0,0,0,0]
],[
    [0,1,0,0],
    [0,1,0,0],
    [1,1,0,0],
    [0,0,0,0]
],[
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
],[
    [0,1,1,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,0,0,0]
]];

const Z = [[
    [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
],[
    [0,0,1,0],
    [0,1,1,0],
    [0,1,0,0],
    [0,0,0,0]
]];

const O = [[
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
]];

const S = [[
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0]
],[
    [0,1,0,0],
    [0,1,1,0],
    [0,0,1,0],
    [0,0,0,0]
]];

const L = [[
    [0,0,0,0],
    [1,1,1,0],
    [1,0,0,0],
    [0,0,0,0]
],[
    [1,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,0,0,0]
],[
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
],[
    [0,1,0,0],
    [0,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
]];

const I = [[
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
],[
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0]
]];

let board = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];

class Block {
    constructor(x,y,color){
      this.x = x;
      this.y = y;
      this.color = color;
      this.level_color = level;
    }

    show() {
        //ctx.fillStyle = "white"
        //ctx.fillRect(this.x, this.y, grid, grid);
        ctx.drawImage(skin,this.color*grid,this.level_color*grid,grid,grid,this.x,this.y,grid,grid);
    }

    show_next() {
        next_ctx.drawImage(skin,this.color*grid,this.level_color*grid,grid,grid,this.x,this.y,grid,grid);
    }

    can_move(future_x, future_y){
        if(this.x + future_x >= 0 && this.x + future_x < canvas.width && this.y + future_y < canvas.height) {
            for(let i=0; i < blocks.length; i++){
                if(this.x + future_x == blocks[i].x && this.y + future_y == blocks[i].y){
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}


class Piece {
    constructor(x,y,type,pos){
        this.x = x;
        this.y = y;
        this.type = type;
        this.pos = pos;

        this.next = getRandomInt(7);

        this.shape = [T,J,Z,O,S,L,I];
        this.color = [0,2,1,0,2,1,0];

        this.blocks = [
            new Block(this.x, this.y, this.color[this.type]),
            new Block(this.x, this.y, this.color[this.type]),
            new Block(this.x, this.y, this.color[this.type]),
            new Block(this.x, this.y, this.color[this.type])
        ];

        this.next_blocks = [
            new Block(0, 0, this.color[this.next]),
            new Block(0, 0, this.color[this.next]),
            new Block(0, 0, this.color[this.next]),
            new Block(0, 0, this.color[this.next])
        ];

        this.landing_height = 0;
    }

    reset() {
        this.x = grid*3;
        this.y = -grid*1;

        this.type = this.next;
        this.pos = 0;
        
        this.blocks = [
            new Block(this.x, this.y, this.color[this.type]),
            new Block(this.x, this.y, this.color[this.type]),
            new Block(this.x, this.y, this.color[this.type]),
            new Block(this.x, this.y, this.color[this.type])
        ];

        this.next = getRandomInt(7);

        for(let i=0; i < this.next_blocks.length; i++){
            this.next_blocks[i].color = this.color[this.next];
        }
    }

    set_blocks() {
        for(let i=0; i < this.blocks.length; i++){
            blocks.push(this.blocks[i]);
        }

        for(let i=0; i < board.length; i++){
            board[i] = [0,0,0,0,0,0,0,0,0,0];
        }

        for(let i=0; i < blocks.length; i++){
            board[blocks[i].y / grid][blocks[i].x / grid] = i+1;
        }

        for(let i=0; i < board.length; i++){
            let line = 0;
            for(let k=0; k < board[i].length; k++){
                if(board[i][k] != 0){
                    line++
                }
            }
            if(line == 10){
                lines.push(board[i]);
                line_clear++;
            }
        }
    }

    show() {
        if(this.pos > this.shape[this.type].length-1){
            this.pos = 0;
        }

        if(this.pos < 0) {
            this.pos = this.shape[this.type].length-1;
        }

        let count = 0;

        for(let i=0; i < this.shape[this.type][this.pos].length; i++){
            for(let k=0; k < this.shape[this.type][this.pos][i].length; k++){
                if(this.shape[this.type][this.pos][i][k]){
                    this.blocks[count].x = this.x+grid*k;
                    this.blocks[count].y = this.y+grid*i;
                    this.blocks[count].show();
                    count++;
                }
            }
        }
    }

    show_next() {

        let count = 0;

        for(let i=0; i < this.shape[this.next][0].length; i++){
            for(let k=0; k < this.shape[this.next][0][i].length; k++){
                if(this.shape[this.next][0][i][k]){
                    this.next_blocks[count].x = grid*k;
                    this.next_blocks[count].y = grid*i;
                    this.next_blocks[count].show_next();
                    count++;
                }
            }
        }
    }

    can_move(future_x, future_y) {
        for(let i=0; i < this.blocks.length; i++){
            if(!this.blocks[i].can_move(future_x, future_y)){
                this.landing_height = this.blocks[i].y;
                return false;
            }
        }
        return true;
    }

    can_rotate(dir) {
        let rot_dir = this.pos + dir;

        if(rot_dir > this.shape[this.type].length-1){
            rot_dir = 0;
        }

        if(rot_dir < 0) {
            rot_dir = this.shape[this.type].length-1;
        }

        for(let i=0; i < this.shape[this.type][rot_dir].length; i++){
            for(let k=0; k < this.shape[this.type][rot_dir][i].length; k++){
                if(this.shape[this.type][rot_dir][i][k]){
                    if(this.x + grid*k < 0 || this.x + grid*k == canvas.width || this.y + grid*i == canvas.height) {
                        return false;
                    }
                    for(let j=0; j < blocks.length; j++) {
                        if(this.x + grid*k == blocks[j].x && this.y + grid*i == blocks[j].y){
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

}

class Controller {
    constructor() {
        this.kc_move_left = 37;
        this.kc_move_right = 39;
        this.kc_rot_left = 90;
        this.kc_rot_right = 88;
        this.kc_soft_drop = 40;

        this.key_pressed = {};
        this.key_press = {};
    }

    register() {
        const that = this;

        window.addEventListener("keydown", (e) => {that.input_down(e);});
        window.addEventListener("keyup", (e) => {that.input_up(e);});
    }

    input_down(e) {
        if(!e.repeat){
            this.key_pressed[e.keyCode] = true;
            this.key_press[e.keyCode] = 0;
        }        
    }
    
    input_up(e) {
        this.key_pressed[e.keyCode] = false;
    }

    input_just_press(key){
        if(this.key_pressed[key]){
            this.key_press[key]++;
            if(this.key_press[key] == 1){
                return true;
            }
        } else {
            this.key_press[key] = 0;
        }
        return false;
    }

    inpunt_pressed(key){
        return this.key_pressed[key];
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let blocks = [];
let level = 5;

let p = new Piece(grid*3,-grid*1,getRandomInt(7),0);
let c = new Controller();
c.register();

let speed = 4;
let soft_drop = 2;
let count = 64;

let line_clear = 0;
let lines = [];

let das_max = 16;
let das_min = 11;
let das_counter = 0;

const deleter_start_a = 4;
const deleter_start_b = 5;

let deleter_a = deleter_start_a;
let deleter_b = deleter_start_b;

let delay_amount = 2;
let delay = delay_amount;

let frames = 0;


function draw(){
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let i=0; i < blocks.length; i++){
        if(blocks[i] != 0){
            blocks[i].show();
        }
    }

    if(delay != 0){
        delay--;
        requestAnimationFrame(draw);
        return;
    }

    if(line_clear != 0){

        for(let i=0; i < lines.length; i++){
            blocks[lines[i][deleter_a]-1] = 0;
            blocks[lines[i][deleter_b]-1] = 0;
        }

        deleter_a--;
        deleter_b++;

        if(deleter_a == -1){

            for(let i=0; i < board.length; i++){
                board[i] = [0,0,0,0,0,0,0,0,0,0];
            }
    
            for(let i=0; i < blocks.length; i++){
                if(blocks[i] != 0) {
                    board[blocks[i].y / grid][blocks[i].x / grid] = i+1;
                }
            }
            
            let line = 0;

            for(let i = board.length-1; i >= 0; i--){
                let space = 0;
                for(let k = 0; k < board[i].length; k++){
                    if(board[i][k] == 0){
                        space++;
                    }
                }
                if(space == 10){
                    line++;
                } else {
                    for(let k = 0; k < board[i].length; k++){
                        if(board[i][k] != 0){
                            blocks[board[i][k]-1].y += grid*line;
                        }
                    }
                }
            }

            let temp = blocks;
            blocks = [];
            
            for(let i=0; i < temp.length; i++){
                if(temp[i] != 0) {
                    blocks.push(temp[i]);
                }
            }

            deleter_a = deleter_start_a;
            deleter_b = deleter_start_b;
            lines = [];
            line_clear = 0;
        }
        delay = delay_amount;
        requestAnimationFrame(draw);
        return;
    }
    
    p.show();
    draw_next();
    count--;

    if(count > soft_drop && c.input_just_press(c.kc_soft_drop)){
        count = soft_drop;
    }

    let down = 0;

    if(count == 0) {
        if(p.can_move(0,grid)){
            p.y += grid;
            down = grid;
        } else {
            c.key_pressed[c.kc_soft_drop] = false;
            p.set_blocks();
            for(let i=0; i < blocks.length; i++){
                if(blocks[i].y <= 0) {
                    console.log("game over kid");
                    return;
                }
            }
            p.reset();
            delay = 18 - Math.floor((p.landing_height / grid)/4)*2;
            count = speed;
            requestAnimationFrame(draw);
            return;
        }
        if(c.inpunt_pressed(c.kc_soft_drop)){
            count = soft_drop;
        } else {
            count = speed;
        }
    }

    if(c.input_just_press(c.kc_move_left)){
        if(p.can_move(-grid, down)){
            p.x -= grid;
            das_counter = 0;
        } else {
            das_counter = das_max;
        }
    } else if(c.input_just_press(c.kc_move_right)){
        if(p.can_move(grid, down)){
            p.x += grid;
            das_counter = 0;
        } else {
            das_counter = das_max;
        }
    }

    if(c.inpunt_pressed(c.kc_move_left)){
        if(p.can_move(-grid, down)){
            if(das_counter == das_max){
                p.x -= grid;
                das_counter = das_min;
            } else {
                das_counter++
            }
        } else {
            das_counter = das_max;
        }
    } else if(c.inpunt_pressed(c.kc_move_right)){
        if(p.can_move(grid, down)){
            if(das_counter == das_max){
                p.x += grid;
                das_counter = das_min;
            } else {
                das_counter++
            }
        } else {
            das_counter = das_max;
        }
    }

    //console.log(das_counter);
   

    if(c.input_just_press(c.kc_rot_left) && p.can_rotate(-1)){
        p.pos--;
    } else if(c.input_just_press(c.kc_rot_right) && p.can_rotate(+1)){
        p.pos++;
    }
   
    requestAnimationFrame(draw);
}

function draw_next() {
    next_ctx.clearRect(0, 0, next.width, next.height);
    p.show_next();
}

setInterval(() => {
    console.log(frames)
  }, 1000)

draw();
draw_next();
