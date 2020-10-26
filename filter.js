/** A generic bootstrap particle filter implementation.
 * 
 * A particle filter which supports multiple state values with
 * associated process noise for each. The current implementation
 * assumes a single measurement noise.
 * 
 * The stateTransition property should be set with a function
 * that accepts a single particle and returns the propagated particle.
 * 
 * The measFunction property should be set with a function that
 * accepts a particle and returns an Array of one or more expected
 * measurements.
 */
class ParticleFilter {
    /** Create the particle filter
     * @constructor
     * @param {number} numParticles - The number of particles.
     * @param {number} numStates - The number of state values in each particle.
     * @param {Array<number>} stateNoiseVariance - An Array of process noise variances for each particle state.
     * @param {number} measNoiseVariance - The measurement noise variance
     */
    constructor(numParticles, numStates, stateNoiseVariance, measNoiseVariance) {
        this.numParticles = numParticles
        this.numStates = numStates
        this.particles = math.zeros([this.numParticles, this.numStates])
        this.weights = math.divide(math.ones(this.numParticles), this.numParticles)
        this.stateTransition = undefined
        this.measFunction = undefined
        this.stateNoiseVariance = stateNoiseVariance
        this.measNoiseVariance = measNoiseVariance
    }

    /**
     * Initialize the particle values
     * 
     * @param  {...Array<Array<float>>} ranges - A 2D array defining the start and end values of each particle's initialization range
     */
    initParticles(...ranges) {
        for (let i = 0; i < ranges.length; i++) {
            for (let j = 0; j < this.particles.length; j++) {
                // set the initial value of each state in each particle according
                // to the ranges provided
                this.particles[j][i] = Math.random() * (ranges[i][1] - ranges[i][0]) + ranges[i][0]
            }
        }
    }

    /**
     * Particle update.
     * 
     * Propagates the particles, then generates the expected observations.
     * Updates the particle weights using the measurements, and ends by resampling the particles.
     * 
     * @param {Array<float>} measurements - An Array of the observed measurements (actual data).
     */
    update(measurements) {
        // start by initializing an Array for the new, updated particles
        const newParticles = math.zeros([this.numParticles, this.numStates])

        // define these variables here so we don't reallocate every loop
        let predicted, error, noise

        // update the particles and weights
        for (let i = 0; i < this.particles.length; i++) {
            // generate the process noise according to the state noise variance
            noise = math.zeros(this.numStates)
            for (let j = 0; j < this.numStates; j++) {
                noise[j] = randn() * this.stateNoiseVariance[j]
            }

            // propagate the particle and add the process noise
            newParticles[i] = math.add(this.stateTransition(this.particles[i]), noise)

            // calculate the predicted observation
            predicted = this.measFunction(newParticles[i])

            // compute the sum of squared measurement error
            error = math.sum(math.square(math.subtract(measurements, predicted)))

            // reweight the particle assuming the measurement distribution is a Gaussian
            this.weights[i] = math.exp(-error / (2 * this.measNoiseVariance)) 
                / (math.sqrt(2 * math.PI * this.measNoiseVariance))
        }

        // renormalize the weights
        this.weights = math.divide(this.weights, math.sum(this.weights))

        // resample by treating the weights as a discrete probability distribution
        for (let i = 0; i < this.particles.length; i++) {
            let eps = Math.random()
            let cumulative = 0.0
            for (let j = 0; j < this.particles.length; j++) {
                cumulative += this.weights[j]
                if (eps < cumulative) {
                    this.particles[i] = newParticles[j]
                    break
                }
            }
        }

        // reset the weights since we've resampled the particles
        this.weights = math.divide(math.ones(this.particles.length), this.particles.length)
    }
}