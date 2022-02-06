window.onload = function (){
    let audio = document.getElementById("audio");
    audio.play();
    audio.style.left = -100000;
    // Creating a canvas variable and adding context to it.
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    let startGame = document.querySelector("#start");
    let menu = document.querySelector("#menu");
    let p = document.querySelector("h1");

    // Setting the canvas width and heigt to the same width and height of the device.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background = "black";

    // Creating player class to allow for different players.
    class Player{
        // Constructor for player class with the parameters of x position, y position, width, height, and color.
        constructor (x,y,w,h, color){
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.color = color;
        }
        // Creating a draw function to draw each player.
        draw() {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x,this.y,this.w,this.h);
        }
        // Adding movement to the player.
        moveUp(){
            // Clearing the previous object to draw a new one. Decreasing its y position, and redrawing it.
            ctx.clearRect(this.x,this.y,this.w,this.h);
            if (this.y < 0){
                this.y = canvas.height;
                this.draw();
            }
            else {
                this.y -= 30;
                this.draw;
            }
		}
        moveDown(){
            // Clearing the previous object to draw a new one. Increasing its y position, and redrawing it.
            ctx.clearRect(this.x,this.y,this.w,this.h);
            if (this.y > canvas.height){
                this.y = 0;
                this.draw();
            }
            else {
                this.y += 30;
                this.draw;
            }
		}
        moveRight(){
            // Clearing the previous object to draw a new one. Increasing its x position, and redrawing it.
            ctx.clearRect(this.x,this.y,this.w,this.h);
		    if (this.x < canvas.width-60){
                this.x += 20;
                this.draw();
            }
		}
        moveLeft(){
            // Clearing the previous object to draw a new one. Decreasing its x position, and redrawing it.
            ctx.clearRect(this.x,this.y,this.w,this.h);
		    if (this.x>0){
                this.x -= 20; 
                this.draw();
            }
            
		}
    }

    // Creating a projectile class for all futur projectiles.
    class Projectile{
        // Constructor with the parameters x position, y position, radius, and color.
        constructor(x,y,h,w,color, speed){
            this.x = x;
            this.y = y;
            this.h = h;
            this.w = w;
            this.color = color;
            this.speed = speed;
        }
        // Creating a draw function to draw each projectile.
        draw(){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x,this.y,this.w,this.h);
            ctx.fill();
        }
        // Adding movement to the projectile.
        move(){
            //ctx.clearRect(this.x,this.y, this.r*2, this.r*2);
            this.draw();
            this.x += 50;
             
        }
    }
    class Enemy{
        // Constructor with the parameters x position, y position, radius, and color.
        constructor(x,y,w,h,color, speed){
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.color = color;
            this.speed = speed;
        }
        // Creating a draw function to draw each Enemy.
        draw(){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w,this.h);
            ctx.fill();
        }
        // Adding movement to the Enemy.
        move(){
            //ctx.clearRect(this.x,this.y, this.r*2, this.r*2);
            this.draw();
            this.x -= 10;
        }
    }
    
    // Creating instances of the classes.
    let player = new Player(20,20,50,50, 'red');
    let projectile = new Projectile(player.x + player.w + 10,player.y + 10, 10, 10, "yellow", 10);

    // Arrays that will hold instances of enemy and projectile.
    let projectiles = [];
    let enemies = []
    
    function init(){
        if(!running)return
        projectiles = [];
        enemies = []
        enemies.length = 0;
        projectiles.length = 0;
        player = new Player(20,20,50,50, 'red');
        projectile = new Projectile(player.x + player.w + 10,player.y + 10, 10, 10, "yellow", 10);
    }


    // Event listeners to add movement to the player.
    window.addEventListener("keydown", (event) => {
        switch (event.key){
            case "ArrowUp": 
                player.moveUp();
                break;

            case "ArrowDown":
                player.moveDown();
                break;
            
            case "ArrowRight": 
                player.moveRight();
                break;

            case "ArrowLeft": 
                player.moveLeft();
                break;
            
        }
    });
    // Event listeners to create a projectiles.
    window.addEventListener("keydown", (event) => {
        switch (event.code){
            case "Space": 
                    projectiles.push(new Projectile(player.x + player.w + 10,player.y + 10, 10, 10, "yellow", 10));
                    projectile.x = player.x;
                    projectile.y = player.y;
                    break;
        }
    });
    
    //Creating Enemies.
    function spawnEnemy(){
        setInterval( () => {
            if(!running)return
            let size = Math.random()* (60-40) + 40;
            enemies.push(new Enemy(innerWidth, Math.random()*(canvas.height-100) + 50 , size, size, randomColor(), 20));
        }, 1500);
    }
    let score = 0;
    let animateId;
    let running = true;

    //Animating the game.
    function animate(){
        animateId = requestAnimationFrame(animate); 
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        //Removing projectiles if they leave the canvas.
        projectiles.forEach((projectile, i) => {
            projectile.move();
            if (projectile.x - projectile.w > canvas.width){
                projectiles.splice(i, 1);
            }
        })

        //Displaying the score.
        ctx.beginPath();
        ctx.font = "32px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score "+ score, (canvas.width/2)-50, 50);
        ctx.fill();
        player.draw();

        //Collision detection between enemy and player.
        enemies.forEach((enemy) => {
            enemy.move();
            let enemyDistance = getDistance(enemy, player);
            if (enemyDistance <= 40){
                let enemyIndex = enemies.indexOf(enemy);
                enemies.splice(enemyIndex, 1);

                //Displaying the menu.
                menu.style.display = "flex";
                p.innerHTML = score;
                running = false;
                score = 0;

                //Stoping the animation.
                cancelAnimationFrame(animateId);
            } 
            //Detecting if enemy leaves the canvas.
            if (enemy.x == 0){
                //Displaying the menu
                menu.style.display = "flex";
                p.innerHTML = score;
                score = 0;

                //Stoping the animation.
                cancelAnimationFrame(animateId);
            }
            
            //Collision detection for projectiles and enemy.
            projectiles.forEach((projectile) => {
                    let distance = getDistance(enemy, projectile);
                    if (distance <= enemy.h){
                        let indexEnemy = enemies.indexOf(enemy);
                        let indexProject = projectiles.indexOf(projectile);
                        enemies.splice(indexEnemy, 1);
                        projectiles.splice(indexProject, 1);

                        //Increasing the score if they collide.
                        score +=1;
                    }
                
            })
        });
        
    }
    //Spawning the enemies.
    spawnEnemy();

    //Function to generate random colors.
    function randomColor(){
        return `rgb(${Math.random()*256},${Math.random()*256},${Math.random()*256})`;
    }

    //Function that calculates the distance between two objects.
    function getDistance(a, b){
        let x_distance = a.x - b.x;
        let y_distance = a.y - b.y;
        let distance_ = Math.sqrt(Math.pow(x_distance, 2)+Math.pow(y_distance, 2));
    
        return distance_;
    }

    //Starting the game once the button is clicked.
    startGame.onclick = function (){
        running = false;
        projectiles = [];
        enemies = []
        enemies.length = 0;
        projectiles.length = 0;
        running = true;
        init();
        animate();
        menu.style.display = "none";
    }
}