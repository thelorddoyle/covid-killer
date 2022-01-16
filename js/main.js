const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext('2d')

// this just helps me find the exact middle of the screen
const x = canvas.width / 2
const y = canvas.height / 2

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
    constructor( x, y, radius, color, velocity ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
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

        // by adding these together we will produce movement
        this.x = this.x + this.velocity
        this.y = this.y + this.velocity

    }

}

// initialise a new player
const player = new Player ( x, y, 30, 'white' )
player.draw()

// multiple instances of the projectiles
const projectiles = [  ]

const projectile = new Projectile (
    canvas.width / 2,
    canvas.height / 2,
    5,
    'hotpink',
    // we need to do some trig here. we need to understand x & y velocity through the following steps
    // 1. get the angle
    // 2. put it in an atan2() function to GET the above function e.g. atan( x, y )
    // 3. that function produces the angles in radians
    // 4. we can then get the x and y velocities by using sin ( angle ) and cos ( angle )
    // 5. They are just functions that produce ratios. Sin for example produces a ratio for how big the opposite side of my click distance is to the hypotenuse of the right triangle. Cos then produces a ratio of how big the x distance is to the hypotenuse. When used together we can then assign our x and y velocities to sin and cos which will produce the dot moving in the direction towards our mouse click!
    1,
)

function animate () {

    // by calling itself, it effectively loops over and over again until it is forced to stop
    // this allows us to consistently animate in different spots (emulating movement)
    requestAnimationFrame(animate);
    // console.log('go')
    projectile.draw();
    projectile.update();

}

addEventListener('click', function (e) {

    console.log( 'x-position of click: ', e.clientX);
    console.log( 'y-position of click: ', e.clientY);


})

animate()