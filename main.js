function main() {
    const width = window.innerWidth
    const height = window.innerHeight

    // setup the math library
    math.config({
        matrix: 'Array'
    })

    // create the simulation components
    const world = new World(width, height)
    const lander = new Lander(width / 2, height)
    const radars = [
        new Radar(4*Math.PI/3),
        new Radar(3*Math.PI/2),
        new Radar(5*Math.PI/3)
    ]
    const radarOffset = 5

    // create the particle filter
    const filter = new ParticleFilter(200, 2, [10, 10], 10)
    filter.stateTransition = (particle) => {
        return particle
    }
    filter.measFunction = (particle) => {
        return radars.map((r) => r.measure(particle[0], particle[1], world))
    }
    filter.initParticles([0, width], [0, height])
   
    // define the input handlers
    window.onkeydown = (e) => {
        switch (e.key) {
            case 'w':
                lander.setUpThruster(true)
                break
            case 'a':
                lander.setLeftThruster(true)
                break
            case 'd':
                lander.setRightThruster(true)
                break
        }
    }

    window.onkeyup = (e) => {
        switch (e.key) {
            case 'w':
                lander.setUpThruster(false)
                break
            case 'a':
                lander.setLeftThruster(false)
                break
            case 'd':
                lander.setRightThruster(false)
                break
        }
    }

    // set up the paused handler
    let paused = true
    window.onkeypress = (e) => {
        if (e.key === 'p') {
            paused = !paused
        }
    }

    // create the renderer
    const renderer = new Renderer(document.querySelector("#canvas"), width, height)

    let lastTime = (new Date()).getTime()
    const frameUpdate = () => {
        const now = (new Date()).getTime()
        const deltaTime = now - lastTime
        lastTime = now

        // update the lander
        if (!paused) {
            lander.update(deltaTime / 1000)
        }

        // measure the lander's height using the radar
        const measurements = radars.map((r) => r.measure(lander.pos[0], lander.pos[1], world))

        // update the particle filter with the measurement
        const tic = window.performance.now()
        filter.update(measurements)
        const toc = window.performance.now()

        // tell the renderer to draw everything
        renderer.drawBackground()
        renderer.drawWorld(world)
        renderer.drawLander(lander, radars, measurements)
        renderer.drawParticles(filter.particles)

        window.requestAnimationFrame(frameUpdate)
    }

    // request the first frame
    window.requestAnimationFrame(frameUpdate)
}

// start everything when the page loads            
main()