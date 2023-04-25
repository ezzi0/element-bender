const gameArea = document.querySelector("main");
const gameAreaBounding = gameArea.getBoundingClientRect(); //calculate gamearea based on resize.Add an event listener
const speed = 5;
let startGameButton = document.getElementById("start-game");
const modal = document.getElementById("end-game");
let avatar;
let elements;
let game;
let gameStarted = false;

const pressedKeys = { right: false, left: false, up: false, down: false };
const pickedUpElements = [];

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
      this.element.classList.remove("sprite-left");
    }
    if (direction === "left" && this.canMoveLeft()) {
      this.x -= speed;
      this.element.classList.add("sprite-left");
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
    let pressed = false;
    for (const key in pressedKeys) {
      if (pressedKeys[key]) {
        sprite.style.animationPlayState = "running";
        pressed = true;
        break;
      }
    }
    if (!pressed) {
      sprite.style.animationPlayState = "paused";
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

class Elements {
  constructor() {
    this.data = [
      {
        type: "fire",
        image: "./assets/images/elements (1)/Fire.gif",
      },
      {
        type: "wind",
        image: "./assets/images/elements (1)/wind.gif",
      },
      {
        type: "water",
        image: "./assets/images/elements (1)/Water.gif",
      },
      {
        type: "earth",
        image: "./assets/images/elements (1)/Earth.gif",
      },
    ];
    this.data1 = [
      {
        type: "fire",
        image: "./assets/images/FireBending.png",
      },
      {
        type: "wind",
        image: "./assets/images/AirBending.png",
      },
      {
        type: "water",
        image: "./assets/images/WaterBending.png",
      },
      {
        type: "earth",
        image: "./assets/images/Earth Bending.png",
      },
    ];
    this.elements = [];
    this.elementsCounter = [];
    this.gameArea = document.querySelector("main");
  }

  createElement() {
    this.data.forEach((element) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.src = element.image;
      div.appendChild(img);
      div.className = "element-container";
      this.gameArea.appendChild(div);
      this.setPositionOnMap(div);
      this.elements.push(div);
    });
  }

  createElementCounterHolder() {
    const container = document.querySelector(".images-Bending");

    this.data1.forEach((element) => {
      const img = document.createElement("img");
      img.src = element.image;
      img.alt = element.alt || ""; // Optional: add alt attribute for better accessibility
      img.className = "image-Size";
      container.appendChild(img);
      this.elementsCounter.push(img);
    });
  }

  setPositionOnMap(div) {
    // Set the position of the div randomly within the map area
    const mapWidth = this.gameArea.clientWidth;
    const mapHeight = this.gameArea.clientHeight;
    const divWidth = div.clientWidth;
    const divHeight = div.clientHeight;
    const randomLeft = Math.floor(Math.random() * (mapWidth - divWidth));
    const randomTop = Math.floor(Math.random() * (mapHeight - divHeight));
    div.style.left = randomLeft + "px";
    div.style.top = randomTop + "px";
    div.style.position = "absolute";
  }
}

class Game {
  constructor() {
    this.avatar = new Avatar();
    this.elements = new Elements();
    this.elements.createElement();
    this.elements.createElementCounterHolder();
    this.animate();
    this.addEventListener();
    this.pickUpElements = this.pickUpElements.bind(this);
  }

  collisionDetectionAvatarElements(element) {
    const avatarBounding = this.avatar.element.getBoundingClientRect();
    const elementsBounding = element.getBoundingClientRect();
    const isInX =
      avatarBounding.left < elementsBounding.right &&
      avatarBounding.right > elementsBounding.left;
    const isInY =
      avatarBounding.bottom > elementsBounding.top &&
      avatarBounding.top < elementsBounding.bottom;
    return isInX && isInY;
    //   collusionDetectionAvatarElements(element) {
    //     const avatarBounding = this.avatar.element.getBoundingClientRect();
    //     console.log(element);
    //     const elementsBounding = element.getBoundingClientRect();
    //     console.log(avatarBounding.intersects(elementsBounding));
    //     return avatarBounding.intersects(elementsBounding);
  }

  detectCollisions() {
    for (const element of this.elements.elements) {
      const collision = this.collisionDetectionAvatarElements(element);
      if (collision) {
        element.classList.add("colliding"); // Add a 'colliding' class to the element
      } else {
        element.classList.remove("colliding"); // Remove the 'colliding' class if not colliding
      }
    }
  }

  pickUpElements() {
    const collidingElements = document.querySelectorAll(".colliding");
    for (const element of collidingElements) {
      pickedUpElements.push(element);
      element.remove();
    }
  }

  //   pickUpElements() {
  //     for (const element of this.elements.elements) {
  //       const collision = this.collisionDetectionAvatarElements(element);
  //       const div = gameArea.querySelector("div");
  //       if (collision) {
  //         pickedUpElements.push(element);
  //         element.remove(div);
  //         console.log(pickedUpElements);
  //       }
  //     }
  //     return pickedUpElements;
  //   }

  updateElements() {
    const isPresent = pickedUpElements.includes(element);
    if (isPresent) {
      element.classList.add("pop");
    } else {
      element.classList.remove("pop");
    }
  }

  animate() {
    setInterval(() => {
      this.detectCollisions();
    }, 1000 / 60);
  }
  //   animate() {
  //     setInterval(() => {
  //       for (const element of this.elements.elements) {
  //         this.pickUpElements(element);
  //       }
  //     }, 1000 / 60);
  //   }
  addEventListener() {
    window.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault(); // prevent page scrolling
        this.avatar.jump(avatar);
      }
      if (event.key === "e") {
        event.preventDefault();
        this.pickUpElements();
      }
    });
  }
}

function startGame(event) {
  event.target.disabled = true;
  game = new Game();
  gameStarted = true;
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
    // case "e":
    //   event.preventDefault();
    //   if (game && gameStarted) {
    //     // Check if the game instance exists and the game has started
    //     game.pickUpElements(); // Call the pickUpElements method on the game instance
    //   }
    //   break;
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
