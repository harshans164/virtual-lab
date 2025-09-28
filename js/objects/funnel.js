class Funnel {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = null;
    }

    loadImage(path) {
        this.image = loadImage(path);
    }

    display() {
        if (this.image) {
            image(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Basic funnel shape if no image is loaded
            fill(200);
            beginShape();
            vertex(this.x, this.y);
            vertex(this.x + this.width, this.y);
            vertex(this.x + (this.width * 0.6), this.y + this.height);
            vertex(this.x + (this.width * 0.4), this.y + this.height);
            endShape(CLOSE);
        }
    }

    checkCollision(ball) {
        // Basic collision detection
        return (ball.x > this.x && 
                ball.x < this.x + this.width &&
                ball.y > this.y && 
                ball.y < this.y + this.height);
    }
}