// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.init();
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};
// 初始化敌人坐标和移动速度
Enemy.prototype.init = function() {
    // 初始速度加上随机速度变化
    this.enemy_speed = config.speed + Math.random() * config.incrspeed;
    // 恢复横坐标至起始位置
    this.x = -100;
    // 敌人随机出现的纵坐标
    this.y = randomy();
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += this.enemy_speed * dt;
    // 敌人超出画面重置
    if (this.x > 510) {
        this.init();        
    }
    // 如果碰撞则初始化玩家
    if (this.collision(player)) {
        player.init();
        // 玩家减少生命
        player.lives--;
        gamestatus.render(player.lives,player.level)
    }
};
// 敌人碰撞玩家的范围检查
Enemy.prototype.collision=function(player) {
    var border = 50;
    var check = (Math.abs(player.x - this.x) < border &&  Math.abs(player.y - this.y)< border)
    return check
    //return Math.abs(player.x - this.x) < threshold
    //    && Math.abs(player.y - this.y) < threshold;
};
// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// 这是游戏中随机产生的石头
var Rock = function() {
    // 初始化位置
    this.init();
    this.sprite = 'images/Rock.png';
};
// 初始化石头位置
Rock.prototype.init = function() {
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = randomy();
};
// 在屏幕上画出石头
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 游戏状态 ----------------------------------------
var Status = function() {
    // 初始化位置
    this.init();
    this.sprite = 'images/Heart.png';
};
// 状态初始化
Status.prototype.init = function() {
    this.x = 5;
    this.y = 540;
};
// 在屏幕上绘制状态
Status.prototype.render = function(lives,level) {
    // 状态栏
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 540, 505, 50);
    ctx.globalAlpha = 1;
    // 用图形心形表示的生命数量
    var newx=this.x;
    for (var i=lives;i>0;i--){
        newx+=13;
        ctx.drawImage(Resources.get(this.sprite), newx , this.y,25,43);
    }
    // 显示游戏关卡数    
    ctx.font = '16pt Helvetica';
    ctx.fillStyle = 'white';
    ctx.fillText('Level: ', 390, 570);
    ctx.fillStyle = 'yellow';
    ctx.fillText(level, 460, 570);
};



// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
// 玩家类
// 把玩家对象放进一个叫 player 的变量里面
var Player = function() {

    // 初始化玩家位置
    this.init();
    // 玩家生命
    this.lives = config.totallives;

    // 级别
    this.level = 1;

    // 玩家的图片
    this.sprite = 'images/char-cat-girl.png';
};
// 初始化玩家位置
Player.prototype.init = function() {
    // 随机选择玩家坐标
    this.x = Math.floor(Math.random() * 5 ) * 101;
    this.y = 380;
};
// 更新玩家的位置
Player.prototype.update = function() {
    // 如果成功通过，则重置玩家
    if (this.pass()) {
        this.levelup();
        this.init();
    }
};

// 接收按键并响应
Player.prototype.handleInput = function(code) {
    if (code == 'up') {        
        var tmpy = this.y - config.move_constant.verticle;
        if (this.y > 0 && !this.rockstop(this.x, tmpy)) {
            this.y = tmpy;
        }
    } else if (code == 'down') {
        var tmpy = this.y + config.move_constant.verticle;
        if (tmpy < 460 && !this.rockstop(this.x, tmpy)) {
            this.y = tmpy;
        }
    } else if (code == 'left') {        
        var tmpx = this.x - config.move_constant.horizontal;
        if (this.x > 0 && !this.rockstop(tmpx, this.y)) {
            this.x = tmpx;
        }
    } else if (code == 'right') {        
        var tmpx = this.x + config.move_constant.horizontal;
        if (this.x < 400 && !this.rockstop(tmpx, this.y)) {
            this.x = tmpx;
        }
    } else if (code == 'space' && player.finished() ){
        restart();
    }
};
// 有石头的位置不允许移动
Player.prototype.rockstop = function(x, y) {
    return allRocks.some(function(rock) {
        return Math.abs(rock.x - x) < 50 && Math.abs(rock.y - y) < 50;
    });
};
// 过关
Player.prototype.pass = function() {
    return this.y < 0;
};
// 下一关
Player.prototype.levelup = function() {
    this.level++;
    config.incrspeed += 100;
    // 敌人数量增加
    allEnemies.push(new Enemy());
    // 石头数量增加
    if ( allRocks.length < 4 ){
        allRocks.push(new Rock());
    }
    
};
// 游戏结束
Player.prototype.finished = function() {
    return this.lives === 0 || this.level === config.totallevel;
};
// 渲染玩家
Player.prototype.render = function() {
    if ( player.level === 3 ){
        this.sprite = 'images/char-horn-girl.png';
    }else if ( player.level === 5 ){
        this.sprite = 'images/char-princess-girl.png';
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    gamestatus.render(player.lives, player.level)
};


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
var allEnemies = [];
// 把所有石头的对象都放进一个叫 allRocks 的数组里面
var allRocks = [];
// 初始化玩家
var player;
// 初始化游戏状态
var gamestatus=new Status;
// 游戏初始设置以及基本参数
var config={
    // 初始速度
    speed : 50,
    // 速度递增基数
    incrspeed : 50,
    // 初始敌人数
    enemynum : 3,
    // 关卡总数
    totallevel : 7,
    // 生命数
    totallives : 5,
    // 按键位移量
    move_constant : {
        horizontal : 101,
        verticle : 82,        
    }
}
// Y轴3个位置随机选择
function randomy(){
    return [60, 145, 230][Math.floor(Math.random() * 3)];
}
// 重置所有游戏参数至原始状态
var restart = function() {
    allEnemies = [];
    config.incrspeed=50;
    for (var i = 0; i < config.enemynum; i++) {
        var enemy = new Enemy();
        allEnemies.push(enemy);
    }
    allRocks = [];
    allRocks.push(new Rock);
    player = new Player();
}

restart();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
