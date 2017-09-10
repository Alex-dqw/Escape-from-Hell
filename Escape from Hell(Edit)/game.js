window.onload = init;

// Переменные:
var gameWidth = 360;
var gameHeight = 180;
var size = 12; // Размер каждого игрового объекта

var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame || 
				 window.webkitRequestAnimationFrame ||
				 window.mozRequestAnimationFrame    ||
				 window.oRequestAnimationFrame      ||
				 window.msRequestAnimationFrame;

var map, ctxMap, player, door, diedseconds, audioHit, matrixmap;

var background = new Image();
background.src = "img/Background.png"; // Фоновое изображение
//-------------------------------------------------------
var playerImage = new Image();
playerImage.src = "img/Player.png"; 
var predied = false;
var died = false; // Мертв ли игрок
//------------------------------------
var doorImage = new Image();
doorImage.src = "img/Door.png";
var doorexit = false; // Вышел ли игрок из уровня
//------------------------------------
// Времени осталось
var time1;
var timeleftseconds = 30;
//-----------------------------------
var lavaImage = new Image();
lavaImage.src = "img/Lava.png";
var lava = [];
//-----------------------------------
var enemyImage = new Image();
enemyImage.src = "img/Enemie.png";
var enemies = [];
//----------------------------------
var leverImage = new Image();
leverImage.src = "img/Lever.png";
var lever = [];
var leverbridgeactivated = false;
//----------------------------------
var bridgeImage = new Image();
bridgeImage.src = "img/Bridge.png";
var bridge = [];
var bridgeactivated = false;
//----------------------------------
var doorImagePortal = new Image();
doorImagePortal.src = "img/DoorPortal.png";
var doorportal = [];
//----------------------------------
var doorImagePortal2 = new Image();
doorImagePortal2.src = "img/DoorPortalExit.png";
var doorportalexit = [];
//---------------------------------------------------

function init()
{
	// Игровая карта:
	map = document.getElementById("map");
	ctxMap = map.getContext("2d");
	map.width = gameWidth;
	map.height = gameHeight;
	//--------------------------------
	// Сообщения в игре:
	ctxMap.fillStyle = "#FFF";
    ctxMap.font = "bold 15pt Arial";
    //--------------------------------
    // Игрок
    died = false;
    //--------------------------------
    // Карта игровая  (30x15)
    // 0 - Пусто, 1 - Игрок, 2 - Лава, 3 - Враг, 4 - Дверь, 5 - Рычаг, 6 - Мостик/Лава, 7 - дверь-портал вход, 8 - Дверь-портал выход,
	matrixmap = new Array();
	for(var j = 0; j < 30; j++)
	{
		matrixmap[j] = new Array();
	}

	var playerspawn = false;
	var thedoorspawn = false;
	for(var i = 0; i < 30; i++)
	{
		for(var j = 0; j < 15; j++)
		{
			var a = Math.floor((Math.random() * 20) + 1);
			var b = 0;

			// Расположение игрока обязательное:
			if(playerspawn == false && Math.floor((Math.random() * 20) + 1) == 1)
			{
				matrixmap[j][i] = 1;
				playerspawn = true;
			} 
			else
			{
			  if(a >= 0 && a <= 12)
			  {
			   b = 0; // Пусто!
			  }
			  else if(a >= 12 && a <= 13)
			  {
				b = 2; // Лава!
			  }
			  else if(a == 14)
			  {
				b = 3; // Враг!
			  }
			  else if(a == 15)
			  {
				b = 5; // Рычаг!
			  }
			  else if(a == 16)
			  {
				b = 6; // Мостик-лава!
			  }
			  else if(a >= 17 && a <= 18)
			  {
				b = 7; // Вход в портал
			  }
			  else if(a >= 19 && a <= 20)
			  {
				b = 8; // Выход из портала
			  }
			  matrixmap[j][i] = b;

			  // Расположение двери обязательное:
			  if(thedoorspawn == false && i > 10 && j > 5 &&Math.floor((Math.random() * 20) + 1) == 20)
			  {
				matrixmap[j][i] = 4;
				thedoorspawn = true;
			  }
			}
		}
	}
	// Cчитывание и заполнение карты:
	var lavaindex = 0;
	var enemiesindex = 0;
	var leverindex = 0;
	var bridgeindex = 0;
	var portalindex = 0;
	var exitindex = 0;
	for(var y = 0; y < matrixmap.length; y++)
	{
		for(var x = 0; x < matrixmap[y].length; x++)
		{
			if(matrixmap[y][x] == 1) // Рисуем игрока
			{
   				player = new Player(x*12,y*12);
			}
			if(matrixmap[y][x] == 2) // Рисуем лаву
			{
   				lava[lavaindex] = new Lava(x*12,y*12);
   				lavaindex++;
			}
			if(matrixmap[y][x] == 3) // Рисуем врагов
			{
   				enemies[enemiesindex] = new Enemy(x*12,y*12);
   				enemiesindex++;
			}
			if(matrixmap[y][x] == 4) // Рисуем дверь выхода из уровня
			{
   				door = new Door(x*12,y*12);
			}
			if(matrixmap[y][x] == 5) // Рисуем рычаг на уровне
			{
				lever[leverindex] = new Lever(x*12,y*12);
				leverindex++;
			}
			if(matrixmap[y][x] == 6) // Рисуем мостик
			{
				bridge[bridgeindex] = new Bridge(x*12,y*12);
				bridgeindex++;
			}
			if(matrixmap[y][x] == 7) // Рисуем дверь портал
			{
				doorportal[portalindex] = new DoorPortal(x*12,y*12);
				portalindex++;
			}
			if(matrixmap[y][x] == 8) // Рисуем выход из портала
			{
				doorportalexit[exitindex] = new DoorExit(x*12,y*12);
				exitindex++;
			}
		}
	}
	//------------------------------------
	// Время в игре:
	time1 = new Date().getTime() / 1000;
    //---------------------------------
	// Звук в игре:
	audioHit = new Audio('audio/hit.wav');
    audioHit.loop = false;
 	//---------------------------------
    // События:
    document.addEventListener("keydown", checkKeyDown, false);
	document.addEventListener("keyup", checkKeyUp, false);

	// Запускаем методы
	startLoop();
}

function Player(x, y)
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = x;
	this.drawY = y;

	this.speed = 1; 
	//For keys
	this.isUp = false;
	this.isDown = false;
	this.isLeft = false;
	this.isRight = false;
}
Player.prototype.draw = function()
{
	ctxMap.clearRect(this.drawX,this.drawY, size, size);
	ctxMap.drawImage(playerImage, this.srcX,this.srcY,size,size,
		this.drawX,this.drawY,size, size);
}
Player.prototype.update = function()
{
	if(this.drawX < 0) this.drawX = 0;
	if(this.drawX > gameWidth - size) this.drawX = gameWidth - size;
	if(this.drawY < 0) this.drawY = 0;
	if(this.drawY > gameHeight - size) this.drawY = gameHeight - size;

	//=========================================================================================
	for(var i = 0; i < lava.length; i++) 
	{
		if(CollisionCheck(player, lava[i], 12))
		{
			if(died == false && predied == false)
			{
				diedseconds = new Date().getTime() / 1000;
				audioHit.play(); // Проигрываем звук.
				predied = true;	
			}
		}
	}
	for(var i = 0; i < enemies.length; i++) 
	{
		if(CollisionCheck(player, enemies[i], 12))
		{
			if(died == false && predied == false)
			{
				diedseconds = new Date().getTime() / 1000;
				audioHit.play(); // Проигрываем звук.
				predied = true;	
			}
		}
	}
	if(CollisionCheck(player, door, 12))
	{
			if(died == false && predied == false)
			{
				doorexit = true;
			}
	}
	for(var i = 0; i < lever.length; i++) 
	{
		if(CollisionCheck(player, lever[i], 12))
		{
			if(died == false && predied == false && leverbridgeactivated == false)
			{
				leverbridgeactivated = true;
			}
		}
	}
	for(var i = 0; i < bridge.length; i++) 
	{
		if(CollisionCheck(player, bridge[i], 12))
		{
			if(died == false && predied == false && leverbridgeactivated == false)
			{
				diedseconds = new Date().getTime() / 1000;
				audioHit.play(); // Проигрываем звук.
				predied = true;	
			}
		}
	}
	for(var i = 0; i < doorportal.length; i++) 
	{
		if(CollisionCheck(player, doorportal[i], 12))
		{
			this.drawX = doorportalexit[i].drawX;
			this.drawY = doorportalexit[i].drawY;
		}
	}

	if(predied == true)
	{
		var secondsamount = new Date().getTime() / 1000 - diedseconds;
		if(secondsamount >= 2)
		{
			died = true;
		}		
	}			


	if(doorexit == true)
	{
		winscr();
	}
	if(died == false && predied == false && doorexit == false)
	{
		this.chooseDir();
	}
	else if(died == true)
	{
		deadscr();
	}
} 
Player.prototype.chooseDir = function()
{
	if(this.isUp)
	   this.drawY -= this.speed;
	if(this.isDown)
	   this.drawY += this.speed;
    if(this.isLeft)
	   this.drawX -= this.speed;
    if(this.isRight)
	   this.drawX += this.speed;
}
//========================================================================================
function CollisionCheck(Obj1, Obj2, width)
{
    if(Obj1.drawX < Obj2.drawX + width && Obj1.drawX + width > Obj2.drawX && Obj1.drawY < Obj2.drawY + width && Obj1.drawY + width > Obj2.drawY)
    {
        colliding = true;
    }
    else
    {
        colliding = false;
    }
    return colliding;
}
//========================================================================================
function Lava(posX,posY)
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = posX;
	this.drawY = posY;
}
Lava.prototype.draw = function()
{
	ctxMap.clearRect(this.drawX,this.drawY, size, size);
	ctxMap.drawImage(lavaImage, this.srcX,this.srcY,size,size,
		this.drawX,this.drawY,size, size);
}
//=========================================================================================
function Enemy(posX,posY)
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = posX;
	this.drawY = posY;
	this.speed = 0.5;
	// Движения
	this.timestart = new Date().getTime() / 1000;
	this.time = 0;
	this.moveup = false;
	this.changedir = false;
}
Enemy.prototype.draw = function()
{
	ctxMap.clearRect(this.drawX,this.drawY, size, size);
	ctxMap.drawImage(enemyImage, this.srcX,this.srcY,size,size,
		this.drawX,this.drawY,size, size);
}
Enemy.prototype.update = function()
{
	this.time = new Date().getTime() / 1000;
	var timenow = this.time - this.timestart;
	if(timenow >= 0.2)
	{
	   this.timestart = new Date().getTime() / 1000;
	   this.changedir = false;
	}

	for(var i = 0; i < lava.length; i++) 
	{
		if(CollisionCheck(this, lava[i], 12))
		{
		   if(this.changedir == false)
		   {
		  	 this.moveup = !this.moveup;
		  	 this.changedir = true;
		   }
		}
	}

	if(this.drawY < 0 && this.changedir == false)
	{
		  	 this.moveup = !this.moveup;
		  	 this.changedir = true;
	}
	if(this.drawY > gameHeight && this.changedir == false)
	{
		  	 this.moveup = !this.moveup;
		  	 this.changedir = true;
	}

	if(this.moveup == true)
	{
		this.drawY -= this.speed;
	}
	else 
	{
		this.drawY += this.speed;
	}
}
//===========================================================================================
function Door(x, y)
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = x;
	this.drawY = y;
}
Door.prototype.draw = function()
{
	ctxMap.clearRect(this.drawX,this.drawY, size, size);
	ctxMap.drawImage(doorImage, this.srcX,this.srcY,size,size,
		this.drawX,this.drawY,size, size);
}
//===========================================================================================
function Bridge(x, y)
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = x;
	this.drawY = y;

	this.timestart = new Date().getTime() / 1000;
	this.time = 0;
}
Bridge.prototype.draw = function()
{
	ctxMap.clearRect(this.drawX,this.drawY, size, size);
	ctxMap.drawImage(bridgeImage, this.srcX,this.srcY,size,size,
		this.drawX,this.drawY,size, size);
}
Bridge.prototype.update = function()
{
    if(leverbridgeactivated == false)
    {
    	bridgeImage.src = "img/Lava.png";
    }
    if(leverbridgeactivated == true)
    {
		bridgeImage.src = "img/Bridge.png";
    }
    this.time = new Date().getTime() / 1000;
	var timenow = this.time - this.timestart;
	if(timenow >= 5)
	{
	   this.timestart = new Date().getTime() / 1000;
	   leverbridgeactivated = false;
	}
}
//===========================================================================================
function Lever(x, y)
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = x;
	this.drawY = y;
}
Lever.prototype.draw = function()
{
	ctxMap.clearRect(this.drawX,this.drawY, size, size);
	ctxMap.drawImage(leverImage, this.srcX,this.srcY,size,size,
		this.drawX,this.drawY,size, size);
}
//==========================================================================================
function DoorPortal(x, y)
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = x;
	this.drawY = y;
}
DoorPortal.prototype.draw = function()
{
	ctxMap.clearRect(this.drawX,this.drawY, size, size);
	ctxMap.drawImage(doorImagePortal, this.srcX,this.srcY,size,size,
		this.drawX,this.drawY,size, size);
}
//===========================================================================================
function DoorExit(x, y)
{
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = x;
	this.drawY = y;
}
DoorExit.prototype.draw = function()
{
	ctxMap.clearRect(this.drawX,this.drawY, size, size);
	ctxMap.drawImage(doorImagePortal2, this.srcX,this.srcY,size,size,
		this.drawX,this.drawY,size, size);
}
//===========================================================================================
function startLoop()
{
    loop();
}
function stopLoop()
{
	isPlaying = false;
}
function loop()
{
	update();
	requestAnimationFrame(loop);
}

function update()
{
	if(isPlaying == false) // Если мы не играем, то надпись соответствующая
	{
		ctxMap.clearRect(0,0, gameWidth, gameHeight);
		ctxMap.fillText("Press ENTER to start", 90, 90);
	}
	// Рисуем игру
	if(isPlaying == true)
	{
		drawBg(); // Рисуем игровой фон
		for(var i = 0; i < lava.length; i++) // Рисуем стены
		{
		  lava[i].draw(); 
		}
		door.draw(); // Рисуем дверь
		for(var i = 0; i < lever.length; i++) // Рисуем рычаги
		{
		  lever[i].draw(); 
		}
		for(var i = 0; i < bridge.length; i++) // Рисуем мосты
		{
		  bridge[i].draw(); 
		  bridge[i].update();
		}
		for(var i = 0; i < doorportal.length; i++) // Рисуем двери порталы
		{
		  doorportal[i].draw(); 
		}
		for(var i = 0; i < doorportalexit.length; i++) // Рисуем выходы из порталов
		{
		  doorportalexit[i].draw(); 
		}
		for(var i = 0; i < enemies.length; i++) // Рисуем врагов
		{
		  enemies[i].draw(); 
		  enemies[i].update();
		}

		player.draw();
		player.update();

		// Время истекает:
		if(died == false && predied == false && doorexit == false)
		{
		var time2 = new Date().getTime() / 1000;
		if((time2 - time1) > 1)
		{
			time1 = new Date().getTime() / 1000;
			if(timeleftseconds > 0)
			{
			  timeleftseconds -= 1;
			}
			else if(timeleftseconds == 0)
			{
				died = true;
			}
		}
		drawTime();
		}
	}
}


function checkKeyDown(e)
{
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);
	if(keyID == 13) // Нажимаем на Enter
	{
		if(isPlaying == false && died == false) { isPlaying = true; }
		else if(died == true || doorexit == true) { window.location.reload(true); } // Рестарт игры 
	}
	if(isPlaying == true)
	{
	if(keyChar == 'W') { player.isUp = true; e.preventDefault(); }
	if(keyChar == 'S') { player.isDown = true; e.preventDefault(); }
	if(keyChar == 'A') { player.isLeft = true; e.preventDefault(); }
	if(keyChar == 'D') { player.isRight = true;  e.preventDefault(); }  
	e.preventDefault();
	}
}

function checkKeyUp(e)
{
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);

	if(isPlaying == true)
	{
	if(keyChar == 'W') { player.isUp = false; e.preventDefault(); }
	if(keyChar == 'S') { player.isDown = false; e.preventDefault(); }
	if(keyChar == 'A') { player.isLeft = false; e.preventDefault(); }
	if(keyChar == 'D') { player.isRight = false; e.preventDefault(); }
	}
}

function deadscr()
{
	ctxMap.font = "bold 15pt Arial";
	ctxMap.clearRect(0,0, gameWidth, gameHeight);
	ctxMap.fillText("You died! Game over!", 90, 90);
}
function winscr()
{
	ctxMap.font = "bold 15pt Arial";
	ctxMap.clearRect(0,0, gameWidth, gameHeight);
	ctxMap.fillText("You win!", 150, 90);
}

function drawBg()
{
	ctxMap.clearRect(0,0, gameWidth, gameHeight);
	ctxMap.drawImage(background, 0,0,background.width,background.height,
		0,0,gameWidth, gameHeight);
}

function drawTime()
{
	ctxMap.font = "bold 8pt Arial";
	ctxMap.fillText("Time left: " + timeleftseconds, 0, 10);
}