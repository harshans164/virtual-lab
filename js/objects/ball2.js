class Ball2 {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.image = null;
    }

    loadImage(path) {
        this.image = loadImage(path);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.acceleration.mult(0);
    }

    display() {
        if (this.image) {
            image(this.image, this.x - this.radius, this.y - this.radius, 
                  this.radius * 2, this.radius * 2);
        } else {
            circle(this.x, this.y, this.radius * 2);
        }
    }
}
