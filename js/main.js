const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext('2d')
const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const scoreModal = document.querySelector('#scoreModal')
const bigScoreEl = document.querySelector('#bigScoreEl')

// gaming variables to play with

const whiteBloodCellShootingSpeed = 3;
const enemySpeed = 2

class Player {
    constructor( x, y, radius, color ) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw () {
        c.beginPath(  )
        // this draws a circle with the x, y, radius, start angle, end angle and draw direction (a boolean, false for clockwise)
        c.arc(
            this.x, // x
            this.y, 
            this.radius, 
            0, // start angle - starts at 0
            Math.PI * 2, // end angle - Math.Pi * 2 is basically 360 degrees OR draw a full circle
            false
            )
        c.fillStyle = this.color;
        c.fill()
    }

}

class Projectile {
    constructor( x, y, radius, color, xVelocity, yVelocity ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;

    }

    draw () {
        c.beginPath(  )
        // this draws a circle with the x, y, radius, start angle, end angle and draw direction (a boolean, false for clockwise)
        c.arc(
            this.x, // x
            this.y, 
            this.radius, 
            0, // start angle - starts at 0
            Math.PI * 2, // end angle - Math.Pi * 2 is basically 360 degrees OR draw a full circle
            false
            )
        c.fillStyle = this.color;
        c.fill()
    }

    update () {

        this.draw()

        // by adding these together we will produce movement
        this.x = this.x + this.xVelocity
        this.y = this.y + this.yVelocity

    }

}

class Enemy {
    constructor( x, y, radius, color, xVelocity, yVelocity ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;

    }

    draw () {
        c.beginPath(  )
        // this draws a circle with the x, y, radius, start angle, end angle and draw direction (a boolean, false for clockwise)
        c.arc(
            this.x, // x
            this.y, 
            this.radius, 
            0, // start angle - starts at 0
            Math.PI * 2, // end angle - Math.Pi * 2 is basically 360 degrees OR draw a full circle
            false
            )
        c.fillStyle = this.color;
        c.fill()
    }

    update () {

        this.draw()

        // by adding these together we will produce movement
        this.x = this.x + this.xVelocity
        this.y = this.y + this.yVelocity

    }

}

// using this number to slow down particles on explosions
const friction = 0.96

class Particle {
    constructor( x, y, radius, color, xVelocity, yVelocity ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
        this.alpha = 1

    }

    draw () {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath(  )
        // this draws a circle with the x, y, radius, start angle, end angle and draw direction (a boolean, false for clockwise)
        c.arc(
            this.x, // x
            this.y, 
            this.radius, 
            0, // start angle - starts at 0
            Math.PI * 2, // end angle - Math.Pi * 2 is basically 360 degrees OR draw a full circle
            false
            )
        c.fillStyle = this.color;
        c.fill()
        c.restore()
    }

    update () {

        this.draw()

        this.xVelocity *= friction
        this.yVelocity *= friction

        // by adding these together we will produce movement
        this.x = this.x + this.xVelocity
        this.y = this.y + this.yVelocity

        this.alpha -= 0.01

    }

}

// this just helps me find the exact middle of the screen
const x = canvas.width / 2
const y = canvas.height / 2

// initialise a new player
let player = new Player ( x, y, 10, 'white' )

// multiple instances of the projectiles
let projectiles = [ ]

// holds each instance of enemy
let enemies = [ ]

// holds our particles
let particles = [ ]

// reset the game
function init () {

    player = new Player ( x, y, 10, 'white' );
    projectiles = [ ];
    enemies = [ ];
    particles = [ ];
    score = 0;
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score

}


function spawnEnemies () {
    setInterval( () => {

        const radius = Math.random() * (40 - 20) + 20;
        const greenHue = Math.random() * (175 - 90 + 1) + 90
        const color = `hsl( ${greenHue} , 50%, 50% )`

        let x;
        let y;

        if (Math.random() < 0.5) {

            // so basically what this ternary operator is doing is saying: X is going to be either FAR LEFT of the screen (0 - radius (because the radius of the circle makes it appear first just off screen)) OR THE FAR RIGHT (canvas.width + radius) and then the y co-ordinate is random between 0 and canvas height. Same logic for below, but for top and bottom of screens. If statement flicks randomly between the two.
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;

        } else {

            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;

        }

        // not here that I switched order of calculation here to height / 2 THEN - y = that is because instead of going away from our Covid Killing white blood cell, we want our enemies to be moving TOWARDS us
        const angle = Math.atan2( 
            canvas.height / 2 - y,
            canvas.width / 2 - x
            )
    
        // set enemy speed
        const xVelocity = Math.cos(angle) * enemySpeed
    
        const yVelocity = Math.sin(angle) * enemySpeed


        enemies.push(new Enemy ( x, y, radius, color, xVelocity, yVelocity ) )
    
    }, 1000 )
}

let animationId;
let score = 0;

function animate () {

    // by calling itself, it effectively loops over and over again until it is forced to stop
    // this allows us to consistently animate in different spots (emulating movement)
    animationId = requestAnimationFrame(animate);

    // by only adding the fill style 0.1 opacity at a time, it lets the shooting projectiles and enemies have a small tail
    c.fillStyle = 'rgba(166, 16, 30, 0.1)'

    // basically the long lines are still being draw, but this draws a big rectangle of clearing over the entire canvas (when you set the entire width and height) so you only see the individual circle being drawn at each iteration, giving it the look of a single circle moving across the screen
    c.fillRect( 0, 0, canvas.width, canvas.height)

    // seen as this draws over everything, we need to initialise our player after ever clearing loop
    player.draw()

    // for anything we want to put on the screen, we need to loop through it

    particles.forEach( (particle, index) => {

        if (particle.alpha <= 0) {
            particles.splice( index, 1 )
        } else {
            particle.update()
        }
    } )

    projectiles.forEach( (projectile, index) => {

        projectile.update();

        // if the projectile goes off screen, kill it
        if (projectile.x + projectile.radius < 0 
            || projectile.x - projectile.radius > canvas.width 
            || projectile.y + projectile.radius < 0
            || projectile.y - projectile.radius > canvas.height
            ) {

            // see explanation for Timeout later
            setTimeout(() => {

                    projectiles.splice( index, 1 )

                }, 0)

        }

    }
    )

    enemies.forEach( (enemy, index) => {

        enemy.update()

        const dist = Math.hypot(
            player.x - enemy.x,
            player.y - enemy.y
            )

            // end game if enemy collides with human TODO: Give myself 3 lives
            if (dist - enemy.radius - player.radius < 1) {

                cancelAnimationFrame(animationId);
                scoreModal.style.display = 'flex';
                bigScoreEl.innerHTML = score
            }

        projectiles.forEach( (projectile, projectileIndex) => {

            // hypot = the distance between two points
            // this function takes the x & y of our projectile and the x & y of the enemies to create a distance measurement between them
            const dist = Math.hypot(
                projectile.x - enemy.x,
                projectile.y - enemy.y
                )

                // when our enemy touches our projectile
                if (dist - enemy.radius - projectile.radius < 1) {

                    // increase our score
                    score += 100
                    scoreEl.innerHTML = score

                    // create explosions
                    for (let i = 0; i < (enemy.radius / 2); i++) {

                        particles.push(
                            new Particle (
                                projectile.x, 
                                projectile.y, 
                                Math.random() * 2, 
                                enemy.color, 
                                (Math.random() - 0.5) * (Math.random() * 6), 
                                (Math.random() - 0.5) * (Math.random() * 6)
                                ) )

                    }

                    // basically if you don't set a timeout (basically forcing it to wait until the next frame to remove the two objects) it looks like its flashing before it leaves the screen as it goes through the array one more time when drawing. The timeout basically just removes that flash

                    if ( enemy.radius > 20) {

                        // using green sock library here to just ease between current radius and defined radius
                        gsap.to(enemy, {
                            radius: enemy.radius-10
                        })
                        setTimeout(() => {
            
                                projectiles.splice( projectileIndex, 1 )
            
                            }, 0)

                    } else {

                        // when an enemy is totally destroyed
                        setTimeout(() => {

                            // foreach loops naturally have an index, so if you call it as a second variable you can use it in your foreach loops
                            // here what im doing is saying remove the SPECIFIC enemy at the index point named, and only remove ONE item (the item I've specified)
            
                                score += 250
                                scoreEl.innerHTML = score
                                enemies.splice( index, 1 )
                                projectiles.splice( projectileIndex, 1 )
            
                            }, 0)
                    }


            }

        })

    }
    )

}

addEventListener('click', function (e) {

    // we need to do some trig here. we need to understand x & y velocity through the following steps
    // 1. get the angle
    // 2. put it in an atan2() function to GET the above function e.g. atan( x, y )
    // 3. that function produces the angles in radians
    // 4. we can then get the x and y velocities by using sin ( angle ) and cos ( angle )
    // 5. They are just functions that produce ratios. Sin for example produces a ratio for how big the opposite side of my click distance is to the hypotenuse of the right triangle. Cos then produces a ratio of how big the x distance is to the hypotenuse. When used together we can then assign our x and y velocities to sin and cos which will produce the dot moving in the direction towards our mouse click!

    const angle = Math.atan2( 
        e.clientY - canvas.height / 2 , 
        e.clientX - canvas.width / 2 
        )

    // console.log(angle)

    const xVelocity = Math.cos(angle) * whiteBloodCellShootingSpeed

    const yVelocity = Math.sin(angle) * whiteBloodCellShootingSpeed

    projectiles.push(new Projectile (

        canvas.width / 2, 
        canvas.height / 2,
        5,
        'white',
        xVelocity,
        yVelocity

    ))


})

startGameBtn.addEventListener('click', function () {
    init()
    animate()
    spawnEnemies()
    scoreModal.style.display = 'none'
})