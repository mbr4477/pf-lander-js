/**
 * A class representing a 2D vertical world.
 */
class World {
    /**
     * @constructor
     * @param {number} width - The world width.
     * @param {number} height - The world height.
     */
    constructor(width, height) {
        let numPoints = 10
        let maxHeight = height * 0.25
        let minHeight = 0
        this.terrain = math.zeros([numPoints, 2])
        for (let i = 0; i < numPoints; i++) {
            this.terrain[i][0] = Math.round(Math.random() * width)
            this.terrain[i][1] = Math.round(Math.random() * (maxHeight - minHeight) + minHeight)
        }
        this.terrain[0][0] = 0
        this.terrain[numPoints - 1][0] = width
        this.terrain.sort((a, b) => a[0] - b[0])
    }
}