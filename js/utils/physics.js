class Physics {
    static gravity;
    
    static initialize() {
        this.gravity = createVector(0, 0.2);
    }
    
    static applyGravity(object) {
        if (!this.gravity) {
            this.initialize();
        }
        object.applyForce(this.gravity);
    }
}