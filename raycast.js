/**
 * Calculate the distance to a wall along a ray.
 * 
 * @param {Array<number>} start - Start point (x,y). 
 * @param {number} angle - Angle of ray in radians. 
 * @param {Array<number>} wallStart - Wall start point (x,y).
 * @param {Array<number>} wallEnd - Wall end point (x,y).
 */
function raycast(start, angle, wallStart, wallEnd) {
    const intersectionT = ((start[0] - wallStart[0]) * Math.tan(angle) - (start[1] - wallStart[1])) / ((wallEnd[0] - wallStart[0]) * Math.tan(angle) - (wallEnd[1] - wallStart[1]))
    if (intersectionT >= 0 && intersectionT < 1) {
        // there is an intersection
        const point = [
            wallStart[0] + (wallEnd[0] - wallStart[0]) * intersectionT,
            wallStart[1] + (wallEnd[1] - wallStart[1]) * intersectionT
        ]
        const dx = point[0] - start[0]
        const dy = point[1] - start[1]
        return Math.sqrt(dx*dx + dy*dy)
    }
    return undefined
}

/**
 * Compute the distance to the world terrain.
 * 
 * @param {Array<number>} start 
 * @param {number} angle 
 * @param {World} world 
 */
function distanceToWorld(start, angle, world) {
    let minDistance = undefined
    for (let i = 0; i < world.terrain.length-1; i++) {
        const dist = raycast(start, angle, world.terrain[i], world.terrain[i+1])
        if (dist && (dist < minDistance || minDistance === undefined)) {
            minDistance = dist
        }
    }
    return minDistance
}