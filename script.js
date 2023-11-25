const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const skin = document.getElementById("skin");

const grid = 16;

ctx.imageSmoothingEnabled = false;

/*function updateSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

updateSize();

window.addEventListener("resize", updateSize);*/

canvas.width = 960;
canvas.height = 540;

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

class Game_Board {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = grid * 10;
        this.height = grid * 20;
    }

    show(){
        ctx.fillStyle = "black"
        ctx.fillRect(this.x,this.y,this.width,this.height);
     }
}

class Next_Box {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = grid * 4;
        this.height = grid * 4;
    }

    show(){
        ctx.fillStyle = "black"
        ctx.fillRect(this.x,this.y,this.width,this.height); 
    }
}

class Block {
    constructor(x,y,color, game_board){
      this.x = x;
      this.y = y;
      this.color = color;
      this.game_board = game_board;
      this.level_color = level - Math.floor(level/10)*10;
    }

    show() {
        //ctx.fillStyle = "white"
        //ctx.fillRect(this.x, this.y, grid, grid);
        ctx.drawImage(skin,this.color*grid,this.level_color*grid,grid,grid,this.x,this.y,grid,grid);
    }

    can_move(future_x, future_y){
        if(this.x + future_x >= this.game_board.x && this.x + future_x < this.game_board.x + this.game_board.width && this.y + future_y < this.game_board.y + this.game_board.height) {
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

class Next_Piece {
    constructor(next_box,type,game_board) {
        this.next_box = next_box;
        this.type = type;
        this.game_board = game_board;
        this.x = this.next_box.x;
        this.y = this.next_box.y;

        this.color = [0,2,1,0,2,1,0];

        this.shape = [
            [[0.5, 1.0],[1.5, 1.0],[2.5, 1.0],[1.5, 2.0]], // T
            [[0.5, 1.0],[1.5, 1.0],[2.5, 1.0],[2.5, 2.0]], // J
            [[0.5, 1.0],[1.5, 1.0],[1.5, 2.0],[2.5, 2.0]], // Z
            [[1.0, 1.0],[2.0, 1.0],[1.0, 2.0],[2.0, 2.0]], // O
            [[0.5, 2.0],[1.5, 2.0],[1.5, 1.0],[2.5, 1.0]], // S
            [[0.5, 1.0],[1.5, 1.0],[2.5, 1.0],[0.5, 2.0]], // L
            [[0.0, 1.5],[1.0, 1.5],[2.0, 1.5],[3.0, 1.5]]  // I
        ];

        this.blocks = [
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board)
        ];
    }

    show() {
        for(let i=0; i < this.blocks.length; i++) {
            this.blocks[i].color = this.color[this.type];
            this.blocks[i].x = this.next_box.x + this.shape[this.type][i][0] * grid;
            this.blocks[i].y = this.next_box.y + this.shape[this.type][i][1] * grid;
            this.blocks[i].show();
        }
    }
}


class Piece {
    constructor(x,y,type,pos,game_board,next_box){
        this.x = x;
        this.y = y;
        this.type = type;
        this.pos = pos;
        this.game_board = game_board;
        this.next_box = next_box;

        this.next = getRandomInt(7);

        this.shape = [T,J,Z,O,S,L,I];
        this.color = [0,2,1,0,2,1,0];

        this.blocks = [
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board)
        ];

        this.next_piece = new Next_Piece(this.next_box, this.next, this.game_board);

        this.landing_height = 0;
    }

    reset() {
        this.x = this.game_board.x + grid*3;
        this.y = this.game_board.y - grid*1;

        this.type = this.next;
        this.pos = 0;
        
        this.blocks = [
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board),
            new Block(this.x, this.y, this.color[this.type],this.game_board)
        ];

        this.next = getRandomInt(7);

        this.next_piece.type = this.next;
    }

    set_blocks() {
        for(let i=0; i < this.blocks.length; i++){
            blocks.push(this.blocks[i]);
        }

        for(let i=0; i < board.length; i++){
            board[i] = [0,0,0,0,0,0,0,0,0,0];
        }

        for(let i=0; i < blocks.length; i++){
            board[(blocks[i].y - this.game_board.y) / grid][(blocks[i].x - this.game_board.x) / grid] = i+1;
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
        this.next_piece.show();
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
                    if(this.x + grid*k < this.game_board.x || this.x + grid*k == this.game_board.x + this.game_board.width || this.y + grid*i == this.game_board.y + this.game_board.height) {
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
        this.kb_move_left = 37;
        this.kb_move_right = 39;
        this.kb_rot_left = 90;
        this.kb_rot_right = 88;
        this.kb_soft_drop = 40;

        this.gp_move_left = 14;
        this.gp_move_right = 15;
        this.gp_rot_left = 2;
        this.gp_rot_right = 0;
        this.gp_soft_drop = 13;
    }

    input_just_press(key,gp){
        if(kb_key_pressed[key]){
            kb_key_press[key]++;
            if(kb_key_press[key] == 1){
                return true;
            }
        } else {
            kb_key_press[key] = 0;
        }

        if(game_pad != 0){
            if(game_pad.buttons[gp].pressed) {
                game_pad_press[gp]++;
                if(game_pad_press[gp] == 1){
                return true;
                }
            } else {
                game_pad_press[gp] = 0;
            }
        }
        return false;
    }

    inpunt_pressed(key,gp){
        if(game_pad != 0){
            return kb_key_pressed[key] || game_pad.buttons[gp].pressed;
        } else {
            return kb_key_pressed[key];
        }
        
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

window.addEventListener("keydown", kb_input_down);
window.addEventListener("keyup", kb_input_up);

let kb_key_pressed = {};
let kb_key_press = {};

function kb_input_down(e) {
    if(!e.repeat){
        kb_key_pressed[e.keyCode] = true;
        kb_key_press[e.keyCode] = 0;
    }    
}

function kb_input_up(e) {
    kb_key_pressed[e.keyCode] = false;
}

window.addEventListener("gamepadconnected", gp_tester);
window.addEventListener("gamepaddisconnected", gp_off);

let game_pad = 0;
let game_pad_press = {};
let game_pad_id;

function gp_tester(e) {
    game_pad = e.gamepad
    game_pad_id = e.gamepad.index;
}

function gp_off() {
    game_pad = 0;
    delete game_pad_id;
}

let blocks = [];
let level = 15;
let game_board = new Game_Board(336,96);
let next_box = new Next_Box(game_board.x + grid * 11, game_board.y + grid * 0);

let p = new Piece(game_board.x + grid*3,game_board.y - grid*1,getRandomInt(7),0,game_board,next_box);
let c = new Controller();

const speeds = [48,43,38,33,28,23,18,13,8,6,5,5,5,4,4,4,3,3,3,2,2,2,2,2,2,2,2,2,2,1];
let speed = speeds[level];
let soft_drop = 2;
let count = 64;

let line_clear = 0;
let lines = [];

let das_max = 15;
let das_min = 10;
let das_counter = 0;

const deleter_start_a = 4;
const deleter_start_b = 5;

let deleter_a = deleter_start_a;
let deleter_b = deleter_start_b;

let delay_amount = 2;
let delay = delay_amount;

let frames = 0;

const scoring = [0,40,100,300,1200];
let score = 0;
let push_down_point = 0;

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game_board.show();
    next_box.show();
    p.show_next();
    //text.innerHTML = score;

    if(game_pad != 0) {
        game_pad = navigator.getGamepads()[game_pad_id];
    }
    
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
                    //board[blocks[i].y / grid][blocks[i].x / grid] = i+1;
                    board[(blocks[i].y - game_board.y) / grid][(blocks[i].x - game_board.x) / grid] = i+1;
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
            score += scoring[line_clear] * (level + 1);
            line_clear = 0;
        }
        delay = delay_amount;
        requestAnimationFrame(draw);
        return;
    }
    
    p.show();
    count--;

    if(count > soft_drop && c.input_just_press(c.kb_soft_drop, c.gp_soft_drop)){
        count = soft_drop;
    }

    /* i never */ let /* you */ down = 0;

    if(count == 0) {
        if(p.can_move(0,grid)){
            p.y += grid;
            down = grid;
            if(c.inpunt_pressed(c.kb_soft_drop, c.gp_soft_drop)){
                push_down_point++;
            }
        } else {
            kb_key_pressed[c.kb_soft_drop] = false;
            p.set_blocks();
            for(let i=0; i < blocks.length; i++){
                if(blocks[i].y <= game_board.y) {
                    console.log("game over kid");
                    return;
                }
            }
            p.reset();
            delay = 18 - Math.floor((p.landing_height / grid)/4)*2;
            count = speed;
            score += push_down_point;
            push_down_point = 0;
            requestAnimationFrame(draw);
            return;
        }
        if(c.inpunt_pressed(c.kb_soft_drop, c.gp_soft_drop)){
            count = soft_drop;
        } else {
            count = speed;
        }
    }

    if(c.input_just_press(c.kb_move_left, c.gp_move_left)){
        if(p.can_move(-grid, down)){
            p.x -= grid;
            das_counter = 0;
        } else {
            das_counter = das_max;
        }
    } else if(c.input_just_press(c.kb_move_right, c.gp_move_right)){
        if(p.can_move(grid, down)){
            p.x += grid;
            das_counter = 0;
        } else {
            das_counter = das_max;
        }
    }

    if(c.inpunt_pressed(c.kb_move_left, c.gp_move_left)){
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
    } else if(c.inpunt_pressed(c.kb_move_right, c.gp_move_right)){
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

    if(c.input_just_press(c.kb_rot_left, c.gp_rot_left) && p.can_rotate(-1)){
        p.pos--;
    } else if(c.input_just_press(c.kb_rot_right, c.gp_rot_right) && p.can_rotate(+1)){
        p.pos++;
    }
   
    requestAnimationFrame(draw);
}

draw();
