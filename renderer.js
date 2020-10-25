/**
 * A canvas based renderer for the particle filtering demo.
 */
class Renderer {
    /**
     * @constructor
     * @param {HTML5Canvas} canvas - The canvas element.
     * @param {int} width - The desired canvas width.
     * @param {int} height - The desired canvas height.
     */
    constructor(canvas, width, height) {
        this.canvas = canvas
        this.canvas.width = width
        this.canvas.height = height
        this.context = canvas.getContext('2d')
        this.width = this.canvas.width
        this.height = this.canvas.height
    }

    /**
     * Draw the particles.
     * 
     * @param {Array} particles - The Array of particles.
     */
    drawParticles(particles) {
        this.context.fillStyle = "rgba(0,0,255,0.2)"
        for (let i = 0; i < particles.length; i++) {
            this.context.beginPath()
            this.context.arc(particles[i][0], this.height - particles[i][1], 2, 0, 2 * Math.PI)
            this.context.fill()
        }
    }

    /**
     * Draw the world terrain.
     * 
     * @param {World} world 
     */
    drawWorld(world) {
        this.context.strokeStyle = "white"
        this.context.lineWidth = 1
        this.context.setLineDash([])
        this.context.beginPath()
        this.context.moveTo(0, this.height - world.terrain[0][1])
        for (let i = 1; i < world.terrain.length - 1; i++) {
            this.context.lineTo(world.terrain[i][0], this.height - world.terrain[i][1])
        }
        this.context.lineTo(this.width, this.height - world.terrain[world.terrain.length - 1][1])
        this.context.stroke()
    }

    /**
     * Draw the lander and radar value, if provided.
     * 
     * @param {Lander} lander - The lander object.
     * @param {Array<Radar>} radars - The radar sensors.
     * @param {Array<number>} measurements - The radar distances.
     */
    drawLander(lander, radars, measurements) {
        this.context.fillStyle = "white"
        this.context.fillRect(lander.pos[0] - 5, this.height - lander.pos[1] - 5, 10, 10)
        this.context.strokeStyle = "yellow"
        for (let i = 0; i < radars.length; i++) {
            this.context.setLineDash([5, 5])
            this.context.lineDashOffset = -(Math.floor(window.performance.now()) % 1000) / 50
            this.context.beginPath()
            this.context.moveTo(lander.pos[0], this.height - lander.pos[1])
            this.context.lineTo(
                lander.pos[0] + Math.cos(radars[i].angle) * measurements[i], 
                this.height - (lander.pos[1] + Math.sin(radars[i].angle) * measurements[i])
            )
            this.context.stroke()
        }
    }

    /**
     * Draw the black void of space.
     */
    drawBackground() {
        this.context.fillStyle = "black"
        this.context.fillRect(0, 0, this.width, this.height)
    }
}