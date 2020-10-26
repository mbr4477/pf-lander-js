/**
 * A simple lander affected by gravity.
 */
class Lander {
    /**
     * @constructor
     * @param {float} x - The starting horizontal position. 
     * @param {float} y - The starting vertical position.
     */
    constructor(x, y) {
        this.pos = [x, y]
        this.vel = [0, 0]
        this.gravity = [0, -10]
        this.thrusterState = {
            "up": false,
            "left": false,
            "right": false
        }
    }

    /**
     * Update the lander state.
     * 
     * @param {number} deltaTime - Time step of update in seconds.
     */
    update(deltaTime) {
        const thrust = math.zeros(2)
        if (this.thrusterState["up"]) {
            thrust[1] += 30
        }
        if (this.thrusterState["left"]) {
            thrust[0] -= 30
        }
        if (this.thrusterState["right"]) {
            thrust[0] += 30
        }

        const acc = math.add(this.gravity, thrust)
        this.vel[0] += acc[0] * deltaTime
        this.vel[1] += acc[1] * deltaTime
        this.pos[0] += this.vel[0] * deltaTime
        this.pos[1] += this.vel[1] * deltaTime
    }

    /**
     * @param {boolean} on - Whether this thruster is on
     */
    setUpThruster(on) {
        this.thrusterState["up"] = on
    }

    /**
     * @param {boolean} on - Whether this thruster is on
     */
    setRightThruster(on) {
        this.thrusterState["right"] = on
    }
    
    /**
     * @param {boolean} on - Whether this thruster is on
     */
    setLeftThruster(on) {
        this.thrusterState["left"] = on
    }
    
}

/**
 * A vertical radar sensor.
 */
class Radar {
    /**
     * @constructor
     * @param {number} angle - The mounting angle of the radar in radians.
     */
    constructor(angle) {
        this.angle = angle
    }

    /**
     * Measure the distance from the given point to the ground in the world.
     * 
     * Note that this sensor is currently "perfect" without measurement noise.
     * 
     * @param {number} x - Horizontal position of sensor.
     * @param {number} y - Verticle position of sensor.
     * @param {World} world - The world to use as reference.
     */
    measure(x, y, world) {
        return distanceToWorld([x, y], this.angle, world) || -1
    }
}