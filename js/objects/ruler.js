class Ruler {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = null;
        this.angle = 0;
    }

    loadImage(path) {
        this.image = loadImage(path);
    }

    display() {
        push();
        translate(this.x + this.width / 2, this.y + this.height / 2);
        rotate(this.angle);
        imageMode(CENTER);
        if (this.image) {
            image(this.image, 0, 0, this.width, this.height);
        } else {
            // Basic ruler visualization if no image
            stroke(0);
            strokeWeight(2);
            rect(0, 0, this.width, this.height);
            
            // Draw measurement marks
            for (let i = -this.height / 2; i <= this.height / 2; i += 10) {
                line(-this.width/2, i, -this.width/2 + 10, i);
            }
        }
        pop();
    }
}