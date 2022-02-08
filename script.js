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
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.background = "black";

    window.addEventListener("resize", () =>{
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    })

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
            this.x -= 5;
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
    // Event listeners to create projectiles (Desktop).
    window.addEventListener("keydown", (event) => {
        switch (event.code){
            case "Space": 
                    projectiles.push(new Projectile(player.x + player.w + 10,player.y + 10, 10, 10, "yellow", 10));
                    projectile.x = player.x;
                    projectile.y = player.y;
                    break;
        }
    });

    // Event listeners to create projectiles (Mobile).
    window.addEventListener("touchstart", () => {
        projectiles.push(new Projectile(player.x + player.w + 10,player.y + 10, 10, 10, "yellow", 10));
        projectile.x = player.x;
        projectile.y = player.y;
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

        //Mobile responsiveness
        if (canvas.width <= 600){
            //js.style.display = "flex";
            //elem.style.display = "inline";
            //Drawing the joystick
            ctx.beginPath();
            ctx.arc(player.x,player.y,10,0,2*Math.PI);
            ctx.fill();

            //Joystick mechanics
            player.x += 7*js.x;  
            player.y += 7*js.y;

            //Player boundaries for mobile
            if(player.x >= canvas.width-player.w){player.x = canvas.width-player.w;}
            if(player.x <= 0){player.x = 0;}
            if(player.y >= canvas.height-player.h){player.y = canvas.height-player.h;}
            if(player.y <= 0){player.y = 0;}
        }
        

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

    /*
    ===================================================================================================================================
                                                            JOYSTICK
    ===================================================================================================================================
    */

    /*++++++++++++++++++++++
    + Joystick constructor +
    ++++++++++++++++++++++*/
    
    var Joystick = function(opts){ 
    
        opts = opts || {};
        
        this.x = 0; 
        this.y = 0;
        this.isPressed = false;
        
        var elem = document.createElement("div");
        
        elem.style.position = "fixed";
        elem.style.margin  = "auto";
        elem.style.background = "rgba(0,0,0,0.1)";
        elem.style.boxShadow = "2px 3px 5px rgba(0,0,0,0.25)";
        elem.style.borderRadius = "5px";
        elem.style.zIndex = "100";
        elem.style.width = opts.width || "100px";
        elem.style.height = opts.height || "100px";
        elem.style.top = opts.top || "auto";
        elem.style.bottom = opts.bottom || "10px";
        elem.style.left = opts.left || "0";
        elem.style.right = opts.right || "0";
        //elem.style.display = "none";

        document.body.appendChild(elem);
        
        var rect = elem.getBoundingClientRect();
        
        var stick = document.createElement("div");
        
        if(rect.width <= rect.height){
        stick.style.width = Math.round(0.8*rect.width)+"px";
        stick.style.height = Math.round(0.8*rect.width)+"px";
        }else{
        stick.style.width = Math.round(0.8*rect.height)+"px";
        stick.style.height = Math.round(0.8*rect.height)+"px";
        }
        
        stick.style.borderRadius = "50%";
        stick.style.background = "rgba(0,0,0,0.5)";
        
        stick.style.boxShadow = "2px 3px 5px rgba(0,0,0,0.45), inset 5px 5px 15px lightgray, inset -5px -5px 15px rgba(0,0,0,0.75)";
        
        stick.style.margin = "auto"
        stick.style.position = "fixed";
        stick.style.top = Math.round(rect.top+(0.1*rect.height))+"px";
        stick.style.bottom = "auto";
        stick.style.left = Math.round(rect.left+(0.1*rect.width))+"px";
        stick.style.right = "auto";
        stick.style.zIndex = "12";
        //stick.style.display = "none";
        
        elem.appendChild(stick);
        
        var srect = stick.getBoundingClientRect();
        
        
        elem.addEventListener("touchstart",(e)=>{
        e.preventDefault();
        
        stick.style.top = Math.round(e.targetTouches[0].clientY-(srect.height/2))+"px";
        stick.style.left = Math.round(e.targetTouches[0].clientX-(srect.width/2))+"px";
        
        var tempX = (e.targetTouches[0].clientX-rect.left-(rect.width/2))/(rect.width/2);
        var tempY = (e.targetTouches[0].clientY-rect.top-(rect.height/2))/(rect.height/2);
        
        this.x = (opts.limitX && Math.abs(tempX) > opts.limitX)?Math.sign(tempX)*opts.limitX : tempX;
        this.y = (opts.limitY && Math.abs(tempY) > opts.limitY)?Math.sign(tempY)*opts.limitY : tempY;
        this.isPressed = true;
        
        if(opts.cbStart){opts.cbStart();}
        
        },false);
        
        
        elem.addEventListener("touchmove",(e)=>{
        e.preventDefault();
        
        stick.style.top = Math.round(e.targetTouches[0].clientY-(srect.height/2))+"px";
        stick.style.left = Math.round(e.targetTouches[0].clientX-(srect.width/2))+"px";
        
        var tempX = (e.targetTouches[0].clientX-rect.left-(rect.width/2))/(rect.width/2);
        var tempY = (e.targetTouches[0].clientY-rect.top-(rect.height/2))/(rect.height/2);
        
        this.x = (opts.limitX && Math.abs(tempX) > opts.limitX)?Math.sign(tempX)*opts.limitX : tempX;
        this.y = (opts.limitY && Math.abs(tempY) > opts.limitY)?Math.sign(tempY)*opts.limitY : tempY;
        
        if(opts.cbMove){opts.cbMove();}
        
        },false);
        
        
        elem.addEventListener("touchend",(e)=>{
        e.preventDefault();
        
        stick.style.top = Math.round(rect.top+(0.1*rect.height))+"px";
        stick.style.left = Math.round(rect.left+(0.1*rect.width))+"px";
        
        this.isPressed = false;
        this.x = 0;
        this.y = 0;
        
        if(opts.cbEnd){opts.cbEnd();}
        
        },false);
        
        }
        
        /*++++++++++++++++++++++
        +	End constructor   +
        ++++++++++++++++++++++*/
        
    //define options if you want, all are optional
    var options = {
        width: "80px", // css width
        height: "80px", // css height
        left: "20px", // css left
        right: "auto", // css right
        top: "auto", // css top
        bottom: "20px", // css bottom
        limitX: 0.5, // limit the magnitude of X
        limitY: 0.5 // limit the magnitude of Y
        //,cbStart: loop // function that will fire when touchstart event fires. Can also define cbMove and cbEnd for touchmove and touchend events.
    }
    // create a new joystick object with or without options
    js = new Joystick(options);
}