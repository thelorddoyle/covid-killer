const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext('2d')

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

// this just helps me find the exact middle of the screen
const x = canvas.width / 2
const y = canvas.height / 2

// initialise a new player
const player = new Player ( x, y, 30, 'white' )

// multiple instances of the projectiles
const projectiles = [ ]

// holds each instance of enemy
const enemies = [ ]

function spawnEnemies () {
    setInterval( () => {

        const radius = Math.random() * (30 - 10) + 10;
        const color = 'green';

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
    
        // console.log(angle)
    
        const xVelocity = Math.cos(angle)
    
        const yVelocity = Math.sin(angle)


        enemies.push(new Enemy ( x, y, radius, color, xVelocity, yVelocity ) )
    
    }, 1000 )
}

let animationId;

function animate () {

    // by calling itself, it effectively loops over and over again until it is forced to stop
    // this allows us to consistently animate in different spots (emulating movement)
    animationId = requestAnimationFrame(animate);

    // basically the long lines are still being draw, but this draws a big rectangle of clearing over the entire canvas (when you set the entire width and height) so you only see the individual circle being drawn at each iteration, giving it the look of a single circle moving across the screen
    c.clearRect( 0, 0, canvas.width, canvas.height)

    // seen as this draws over everything, we need to initialise our player after ever clearing loop
    player.draw()

    projectiles.forEach( projectile => {

        projectile.update();

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
                cancelAnimationFrame(animationId)
            }

        projectiles.forEach( (projectile, projectileIndex) => {

            // hypot = the distance between two points
            // this function takes the x & y of our projectile and the x & y of the enemies to create a distance measurement between them
            const dist = Math.hypot(
                projectile.x - enemy.x,
                projectile.y - enemy.y
                )

                // if objects touch
            if (dist - enemy.radius - projectile.radius < 1) {


                // basically if you don't set a timeout (basically forcing it to wait until the next frame to remove the two objects) it looks like its flashing before it leaves the screen as it goes through the array one more time when drawing. The timeout basically just removes that flash
                setTimeout(() => {

                // foreach loops naturally have an index, so if you call it as a second variable you can use it in your foreach loops
                // here what im doing is saying remove the SPECIFIC enemy at the index point named, and only remove ONE item (the item I've specified)

                    enemies.splice( index, 1 )
                    projectiles.splice( projectileIndex, 1 )

                }, 0)

            }

        })

    }
    )

}

addEventListener('click', function (e) {

    // console.log( 'x-position of click: ', e.clientX);
    // console.log( 'y-position of click: ', e.clientY);

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

    const xVelocity = Math.cos(angle)

    const yVelocity = Math.sin(angle)

    projectiles.push(new Projectile (

        canvas.width / 2, 
        canvas.height / 2,
        5,
        'white',
        xVelocity,
        yVelocity

    ))


})

animate()
spawnEnemies()