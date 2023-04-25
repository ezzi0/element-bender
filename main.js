const gameArea = document.querySelector("main");
const gameAreaBounding = gameArea.getBoundingClientRect(); //calculate gamearea based on resize.Add an event listener
const speed = 5;
const startGameButton = document.getElementById("start-game");
const modal = document.getElementById("end-game");
let avatar;

const pressedKeys = { right: false, left: false, up: false, down: false };

class Avatar {
  constructor() {
    this.element = this.createAvatar();
    this.x = gameArea.clientWidth / 2 - this.element.clientWidth / 2;
    this.y = gameArea.clientHeight / 2 - this.element.clientHeight / 2;
    this.setAvatarPosition();
    this.animate();
    this.isJumping = false;
  }

  createAvatar() {
    // const containerDiv = document.createElement("div");
    // containerDiv.classList.add("sprite-container");

    // const avatarDiv = document.createElement("div");
    // avatarDiv.classList.add("sprite");

    // containerDiv.appendChild(avatarDiv);
    // gameArea.appendChild(containerDiv);

    // return containerDiv;
    const div = document.createElement("div");
    div.classList.add("sprite");
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

  animateImage() {
    // Get the sprite's current position
    let sprite = this.element;
    let currentPositionX = window.getComputedStyle(sprite).backgroundPositionX;

    // Set the sprite's new position
    sprite.style.backgroundPositionX =
      parseInt(currentPositionX) - animationSpeed + "px";

    // If the sprite has reached the beginning of its animation, reset its position
    if (parseInt(currentPositionX) - animationSpeed <= -spriteWidth) {
      sprite.style.backgroundPositionX = 0;
    }

    for (const key in pressedKeys) {
      if (pressedKeys[key]) {
        sprite.style.animationPlayState = "running";
        break;
      } else {
        sprite.style.animationPlayState = "paused";
      }
    }

    setTimeout(animateImage, 1000 / 60);
  }

  jump() {
    if (!this.isJumping) {
      // Only jump if the avatar is not currently jumping
      this.isJumping = true;
      let jumpHeight = 20; // Limit the jump height to 50 pixels
      let jumpDuration = 400; // Set the jump duration to 500ms
      let startTime = null;

      const jumpAnimation = (timestamp) => {
        if (!startTime) startTime = timestamp;
        let elapsedTime = timestamp - startTime;
        let progress = elapsedTime / jumpDuration;
        let newY = this.y - jumpHeight * progress * (1 - progress); // Calculate the new y position based on a quadratic curve
        if (progress >= 1) {
          // If the jump animation is complete, reset the flag and the y position
          this.isJumping = false;
          newY = gameArea.clientHeight / 2 - this.element.clientHeight / 2;
        }
        this.y = newY;
        this.setAvatarPosition();
        if (progress < 1) {
          // If the jump animation is not complete, continue the animation
          requestAnimationFrame(jumpAnimation);
        }
      };

      // Start the jump animation
      requestAnimationFrame(jumpAnimation);
    }
  }
}

// const avatar = new Avatar();

function startGame() {
  avatar = new Avatar();
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

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault(); // prevent page scrolling
    avatar.jump(avatar);
  }
});

startGameButton.addEventListener("click", startGame);
