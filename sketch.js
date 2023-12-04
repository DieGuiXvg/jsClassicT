const skin_grid = 8;

let grid = 16;

const T = [[
    [0,1],[1,1],[2,1],[1,2]
],[
    [1,0],[0,1],[1,1],[1,2]
],[
    [1,0],[0,1],[1,1],[2,1]
],[
    [1,0],[1,1],[1,2],[2,1]
]];

const J = [[
    [0,1],[1,1],[2,1],[2,2]
],[
    [1,0],[1,1],[1,2],[0,2]
],[
    [0,0],[0,1],[1,1],[2,1]
],[
    [1,0],[2,0],[1,1],[1,2]
]];

const Z = [[
    [0,1],[1,1],[1,2],[2,2]
],[
    [2,0],[1,1],[2,1],[1,2]
]];

const O = [[
    [1,1],[2,1],[1,2],[2,2]
]];

const S = [[
    [0,2],[1,2],[1,1],[2,1]
],[
    [1,0],[1,1],[2,1],[2,2]
]];

const L = [[
    [0,1],[1,1],[2,1],[0,2]
],[
    [0,0],[1,0],[1,1],[1,2]
],[
    [2,0],[0,1],[1,1],[2,1]
],[
    [1,0],[1,1],[1,2],[2,2]
]];

const I = [[
    [0,1],[1,1],[2,1],[3,1]
],[
    [2,0],[2,1],[2,2],[2,3]
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
    	fill(0);
    	noStroke();
    	rect(this.x,this.y,this.width,this.height);
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
        fill(0);
    	noStroke();
    	rect(this.x,this.y,this.width,this.height);
    }
}

function preload() {
    skin = loadImage("img/skin8.png");
}

class Block {
    constructor(x,y,color, game_board){
      this.x = x;
      this.y = y;
      this.color = color;
      this.game_board = game_board;
      this.level_color = level - floor(level/10)*10;
    }

    show() {
        noSmooth();
        image(skin,this.x,this.y,grid,grid,this.color*skin_grid,this.level_color*skin_grid,skin_grid,skin_grid);
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

        this.next = random([0,1,2,3,4,5,6]);

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

        this.next = random([0,1,2,3,4,5,6]);

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
            let _line = 0;
            for(let k=0; k < board[i].length; k++){
                if(board[i][k] != 0){
                    _line++
                }
            }
            if(_line == 10){
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

        for(let i=0; i < this.shape[this.type][this.pos].length; i++){
            this.blocks[i].x = this.x + this.shape[this.type][this.pos][i][0] * grid; 
            this.blocks[i].y = this.y + this.shape[this.type][this.pos][i][1] * grid;
            this.blocks[i].show();
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
            if(this.x + grid*this.shape[this.type][rot_dir][i][0] < this.game_board.x || this.x + grid*this.shape[this.type][rot_dir][i][0] == this.game_board.x + this.game_board.width || this.y + grid*this.shape[this.type][rot_dir][i][1] == this.game_board.y + this.game_board.height) {
                return false;
            }
            for(let j=0; j < blocks.length; j++) {
                if(this.x + grid*this.shape[this.type][rot_dir][i][0] == blocks[j].x && this.y + grid*this.shape[this.type][rot_dir][i][1] == blocks[j].y){
                    return false;
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

    input_pressed(key,gp){
        if(game_pad != 0){
            return kb_key_pressed[key] || game_pad.buttons[gp].pressed;
        } else {
            return kb_key_pressed[key];
        }
        
    }
}

let kb_key_pressed = {};
let kb_key_press = {};
let game_pad = 0;

function keyPressed() {
	kb_key_pressed[keyCode] = true;
	kb_key_press[keyCode] = 0;
}

function keyReleased() {
	kb_key_pressed[keyCode] = false;
}

let blocks = [];
let level = 8;
const speeds = [48,43,38,33,28,23,18,13,8,6,5,5,5,4,4,4,3,3,3,2,2,2,2,2,2,2,2,2,2,1];

const deleter_start_a = 4;
const deleter_start_b = 5;

const scoring = [0,40,100,300,1200];

function setup() {
	createCanvas(400, 400);
	game_board = new Game_Board(grid, grid);
	next_box = new Next_Box(game_board.x + grid * 10 + grid, game_board.y + grid * 5);
	c = new Controller();

	speed = speeds[level];
	soft_drop = 2;
	count = 64;

    soft_drop = 2;
    count = 64;

    line_clear = 0;
    lines = [];

    das_max = 15;
    das_min = 10;
    das_counter = 0;

    deleter_a = deleter_start_a;
    deleter_b = deleter_start_b;

    delay_amount = 2;
    delay = delay_amount;

    score = 0;
    push_down_point = 0;

	p = new Piece(game_board.x + grid*3,game_board.y - grid*1,random([0,1,2,3,4,5,6]),0,game_board,next_box);
}

function deviceTurned() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(220);
	game_board.show();
	next_box.show();
	p.show_next();
 
    text(windowWidth, 300, 16);
    text(windowHeight, 300, 32);
    text(deviceOrientation, 300, 48);
    
    for(let i=0; i < blocks.length; i++){
        if(blocks[i] != 0){
            blocks[i].show();
        }
    }

    if(delay != 0){
        delay--;
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
            
            let _line = 0;

            for(let i = board.length-1; i >= 0; i--){
                let space = 0;
                for(let k = 0; k < board[i].length; k++){
                    if(board[i][k] == 0){
                        space++;
                    }
                }
                if(space == 10){
                    _line++;
                } else {
                    for(let k = 0; k < board[i].length; k++){
                        if(board[i][k] != 0){
                            blocks[board[i][k]-1].y += grid*_line;
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
            if(c.input_pressed(c.kb_soft_drop, c.gp_soft_drop)){
                push_down_point++;
            }
        } else {
            kb_key_pressed[c.kb_soft_drop] = false;
            p.set_blocks();
            for(let i=0; i < blocks.length; i++){
                if(blocks[i].y <= game_board.y) {
                    console.log("game over kid");
                    noLoop();
                    return;
                }
            }
            p.reset();
            delay = 18 - Math.floor((p.landing_height / grid)/4)*2;
            count = speed;
            score += push_down_point;
            push_down_point = 0;
            return;
        }
        if(c.input_pressed(c.kb_soft_drop, c.gp_soft_drop)){
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

    if(c.input_pressed(c.kb_move_left, c.gp_move_left)){
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
    } else if(c.input_pressed(c.kb_move_right, c.gp_move_right)){
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
   
}
