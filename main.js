const gameArea = document.querySelector("main");
const gameAreaBounding = gameArea.getBoundingClientRect(); //calculate gamearea based on resize.
const speed = 12;
const startGameButton = document.getElementById("start-game");
const modal = document.getElementById("end-game");

const pressedKeys = { right: false, left: false, up: false, down: false };

class Avatar {
  constructor() {
    this.element = this.createAvatar();
    this.x = gameArea.clientWidth / 2 - this.element.clientWidth / 2;
    this.y = gameArea.clientHeight / 2 - this.element.clientHeight / 2;
    this.setAvatarPosition();
    this.animate();
  }

  createAvatar() {
    const div = document.createElement("div");
    div.classList.add("avatar");
    gameArea.append(div);
    return div;
  }

  setAvatarPosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  move(direction) {
    if (direction === "right" && this.canMoveRight()) {
      this.x += speed;
    }
    if (direction === "left" && this.canMoveLeft()) {
      this.x -= speed;
    }
    if (direction === "up" && this.canMoveUp()) {
      this.y -= speed;
    }
    if (direction === "down" && this.canMoveDown()) {
      this.y += speed;
    }
    this.setAvatarPosition();
  }

  canMoveRight() {
    const elementBounding = this.element.getBoundingClientRect();
    if (elementBounding.right < gameAreaBounding.right) {
      return true;
    }
    return false;
  }
  canMoveLeft() {
    const elementBounding = this.element.getBoundingClientRect();
    if (elementBounding.left > gameAreaBounding.left) {
      return true;
    }
    return false;
  }

  canMoveUp() {
    const elementBounding = this.element.getBoundingClientRect();
    if (elementBounding.top > gameAreaBounding.top) {
      return true;
    }
    return false;
  }

  canMoveDown() {
    const elementBounding = this.element.getBoundingClientRect();
    if (elementBounding.bottom < gameAreaBounding.bottom) {
      console.log(elementBounding.bottom, gameAreaBounding.bottom);
      return true;
    }
    return false;
  }

  animate() {
    for (const key in pressedKeys) {
      if (pressedKeys[key]) {
        this.move(key);
      }
    }
    let animationId = requestAnimationFrame(() => {
      this.animate();
    });
  }
}

// const avatar = new Avatar();

function startGame() {
  new Avatar();
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
      pressedKeys.right = true;
      break;
    case "ArrowLeft":
      pressedKeys.left = true;
      break;
    case "ArrowUp":
      pressedKeys.up = true;
      break;
    case "ArrowDown":
      pressedKeys.down = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowRight":
      pressedKeys.right = false;
      break;
    case "ArrowLeft":
      pressedKeys.left = false;
      break;
    case "ArrowUp":
      pressedKeys.up = false;
      break;
    case "ArrowDown":
      pressedKeys.down = false;
      break;
  }
});

startGameButton.addEventListener("click", startGame);
