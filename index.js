const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Boundary {
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }
    draw() {
      c.fillStyle = "blue"
      c.fillRect (this.position.x, this.position.y, this.width, this.height)  
    }
}


const Boundary = new Boundary({
    position: {
        x: 0,
        y: 0
    }
})

Boundary.draw()