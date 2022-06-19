document.addEventListener("DOMContentLoaded", function(event) { 
	let hero = {
		x: 600,
		y: 500,
		power: true,
		life: 3
	};

	let enemies = [
		{x: 500, y:50, type: 1, bullet: false, speed: 1, life: 5, curLife: 3}, 
		{x: 600, y:50, type: 2, bullet: false, speed: 1.2, life:3, curLife: 3},
		{x: 700, y:450, type: 4, bullet: false, speed: 1.3, life: 3, curLife: 3}, 
		{x: 800, y:50, type: 2, bullet: false, speed: 1.2, life: 3, curLife: 3}, 
		{x: 900, y:50, type: 1, bullet: false, speed: 1, life: 5, curLife: 3}, 
		{x: 1000, y:50, type: 2, bullet: false, speed: 1.2, life: 3, curLife: 3}, 
		{x: 650, y:50, type: 1, bullet: false, speed: 1, life: 5, curLife: 3}, 
	];

	let power = [];
	let powerCount = 0;
	let bullets = [];
	let score = 0;
	let game = true;

	setInterval(function() {
		let type = Math.floor(Math.random()*2);
		console.log(type);
		let x =  Math.random() * 570 + 480;
		power.push({x: x, y:50, type: type});
	}, 3000)

	function displayHearts() {
		let output = '';
		let topVal = 50;

		for (let i=0; i<hero.life; i++) {
			output += "<div class='heart' style='top:"+topVal+"px; left:"+380+"px;'></div>";
			topVal+=80;
		}

		document.getElementById('hearts').innerHTML = output;
	}

	function displayPower() {
		let output = '';

		for (let i=0; i<power.length; i++) {

			if (power[i].type == 0) {
				output += "<div class='power' style='top:"+power[i].y+"px; left:"+power[i].x+"px;'></div>";
			}
			else if (power[i].type == 1) {
				output += "<div class='power2' style='top:"+power[i].y+"px; left:"+power[i].x+"px;'></div>";
			}
		}

		document.getElementById('powers').innerHTML = output;
	}

	function movePower() {
		for (let i=0; i<power.length; i++) {
			
			power[i].y +=2;

			if (power[i].y > 630) {
				power[i] = power[power.length -1];
				power.pop();
			}
		}
	}

	function displayEnemies() {
		let output = '';

		for (let i=0; i<enemies.length; i++) {
			let type = enemies[i].bullet == true?3:enemies[i].type;
			output += "<div class='enemy"+type+"' style='top:"+enemies[i].y+"px; left:"+enemies[i].x+"px;'></div>";
		}

		document.getElementById('enemies').innerHTML = output;
	}


	function displayHero() {

		if (hero.life == 0 && game) {
			alert('Gameover');
			location.reload();
			game =false;
		}

		document.getElementById('hero').style['top'] = hero.y+"px";
		document.getElementById('hero').style['left'] = hero.x+"px";
	}	

	function displayBullets() {

		let output ='';

		for (let i=0; i<bullets.length; i++) {
			output += "<div class='bullet' style='top:"+bullets[i].y+"px; left:"+bullets[i].x+"px;'></div>"
		}
		document.getElementById('bullets').innerHTML = output;
	}

	function moveEnemies() {

		for (let i=0; i<enemies.length; i++) {
			if (enemies[i].bullet == false) {
			enemies[i].y += (5 * enemies[i].speed);
			}

			if (enemies[i].y > 630) {
				enemies[i].curLife = enemies[i].life;
				enemies[i].y = 50;
				enemies[i].x = Math.random() * 570 + 480;
			}
		}
	}

	function moveBullets() {

		for (let i=0; i<bullets.length; i++) {
			bullets[i].y -= 5;

			if (bullets[i].y < 50) {
				bullets[i] = bullets[bullets.length -1];
				bullets.pop();
			}	
		}
	}

	function detectCollision() {

		function bulletDetect(j) {
			enemies[j].y = 50;
			enemies[j].x = Math.random() * 570 + 480;
			enemies[j].bullet = false;
		}

		for (let i=0; i<bullets.length; i++) {

			for (let j=0; j<enemies.length; j++) {

				if ((Math.abs(bullets[i].x - enemies[j].x) < 28) &&
					(Math.abs(bullets[i].y - enemies[j].y) < 28) &&
					(enemies[j].bullet == false)) {

					enemies[j].curLife --;
					bullets[i] = bullets[bullets.length -1];
					bullets.pop();	
					
					if (enemies[j].curLife <= 0) {
						enemies[j].curLife = enemies[j].life;
						enemies[j].bullet = true;
						new Audio('assets/explosion.mp3').play()
						setTimeout(bulletDetect, 1000, j)
						score+=50;
					}
				}
			}
		}

		for (let j=0; j<enemies.length; j++) {

			if (Math.abs(hero.x - enemies[j].x) < 28 &&
				Math.abs(hero.y - enemies[j].y) < 28 ) {
				enemies[j].y = 50;
				enemies[j].x = Math.random() * 600 + 450;
				new Audio('assets/hit.mp3').play()
				hero.life--;
				break;
			}
		}

		for (let j=0; j<power.length; j++) {
			if (Math.abs(hero.x - power[j].x) < 28 &&
				Math.abs(hero.y - power[j].y) < 28 ) {

				new Audio('assets/power.mp3').play();

				if (power[j].type == 0) {
					powerCount += 5;
				}
				else if (power[j].type == 1 && hero.life < 8) {
					hero.life++;
				}

				power[j] = power[power.length -1];
				power.pop();
				break;
			}
		}
	}

	setInterval(function() {
		if (powerCount>0) {
			hero.power = true;
			powerCount-= .2;
		}else{
			hero.power = false;
		}
		
	}, 200);

	function displayScore() {
		document.getElementById('score').innerHTML = "score: "+score;
	}

	document.onkeydown = function(e) {
		if (e.keyCode == 37 && hero.x > 470) {
			hero.x -= 20;

			if (hero.x < 470) {
				hero.x = 470;
			}
		}
		else if (e.keyCode == 39 && hero.x < 1020) {
			hero.x += 20;

			if (hero.x > 1020) {
				hero.x = 1020;
			}
		}

		if (e.keyCode == 38 && hero.y > 50) {
			hero.y -= 20;
		}
		else if (e.keyCode == 40 && hero.y < 600) {
			hero.y += 20;
		}

		displayHero();
	}
	
	setInterval(function() {
		if (!hero.power) {
			bullets.push({x: hero.x+18, y: hero.y-15})
		}
		else{
			bullets.push({x: hero.x+9, y: hero.y-15})
			bullets.push({x: hero.x+27, y: hero.y-15})
		}
	}, 200)

	function gameLoop() {
		detectCollision()
		let audioBG = document.getElementById('audioBG');
		audioBG.play();
		audioBG.loop = true;
		displayEnemies();
		moveEnemies();
		displayBullets();
		moveBullets();
		displayScore();
		displayPower();
		movePower();
		displayHearts();
		displayHero();
	}
	setInterval(gameLoop, 20);
});