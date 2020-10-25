/**
 * Generate a random number from a zero-mean, unit-variance
 * Gaussian distribution.
 * 
 * Based on the Marsaglia polar method implementation from
 * https://en.wikipedia.org/wiki/Marsaglia_polar_method#Implementation
 * 
 * @returns {float} The random value
 */
function randn() {
    let u = 0.
    let v = 0.
    do {
        u = Math.random() * 2 - 1
        v = Math.random() * 2 - 1
        s = u * u + v * v
    } while (s >= 1 || s == 0)
    s = Math.sqrt(-2.0 * Math.log(s) / s)
    return u * s
}