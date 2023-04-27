const gameArea = document.querySelector("main");
const gameAreaBounding = gameArea.getBoundingClientRect(); //calculate gamearea based on resize.Add an event listener
const speed = 5;
let startGameButton = document.getElementById("start-game");
const modal = document.getElementById("end-game");
const timer = document.getElementById("time");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");
let avatar;
let enemy;
let elements;
let game;
let gameStarted = false;
let obstacles;
let timeLeft = 60;
let interval;
let acceleration;

const pressedKeys = { right: false, left: false, up: false, down: false };
let pickedUpElements = [];
let pickedUpMotherFucker = [];

class Avatar {
  constructor() {
    this.element = this.createAvatar();
    this.x = gameArea.clientWidth / 2 - this.element.clientWidth / 2;
    this.y = gameArea.clientHeight / 2 - this.element.clientHeight / 2;
    this.lives = 3;
    this.setAvatarPosition();
    this.animate();
    this.isJumping = false;
    this.acceleration = 1;
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
      this.x += speed * this.acceleration;
      this.element.classList.remove("sprite-left");
    }
    if (direction === "left" && this.canMoveLeft()) {
      this.x -= speed * this.acceleration;
      this.element.classList.add("sprite-left");
    }
    if (direction === "up" && this.canMoveUp()) {
      this.y -= speed * this.acceleration;
    }
    if (direction === "down" && this.canMoveDown()) {
      this.y += speed * this.acceleration;
    }
    this.setAvatarPosition();
  }

  canMoveRight() {
    const elementBounding = this.element.getBoundingClientRect();
    if (elementBounding.right - 40 < gameAreaBounding.right) {
      return true;
    }
    return false;
  }
  canMoveLeft() {
    const elementBounding = this.element.getBoundingClientRect();
    if (elementBounding.left + 40 > gameAreaBounding.left) {
      return true;
    }
    return false;
  }

  canMoveUp() {
    const elementBounding = this.element.getBoundingClientRect();
    if (elementBounding.top + 90 > gameAreaBounding.top) {
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
    // for (const key in pressedKeys) {
    //   if (pressedKeys[key]) {
    //     this.move(key);
    //   }
    // }
    // let animationId = requestAnimationFrame(() => {
    //   this.animate();
    // });
  }

  animateImage() {
    // Get the sprite's current position
    let sprite = this.element;
    let currentPositionX = window.getComputedStyle(sprite).backgroundPositionX;

    // Set the sprite's new position
    sprite.style.backgroundPositionX = parseInt(currentPositionX) - 20 + "px";

    // If the sprite has reached the beginning of its animation, reset its position
    if (parseInt(currentPositionX) - 20 <= -sprite.clientWidth) {
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
    // setInterval(this.animateImage, 1000 / 60);
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

  addEvent() {
    window.addEventListener("keydown", (event) => {
      if (
        event.key === 37 ||
        event.key === 38 ||
        event.key === 39 ||
        event.key === 40
      ) {
        event.preventDefault(); // prevent page scrolling
        this.animateImage();
      }
    });
  }
}

class Enemy {
  constructor(avatar) {
    this.avatar = avatar;
    this.element = this.createEnemy();
    this.x = Math.random() * gameArea.clientWidth;
    this.y = Math.random() * gameArea.clientHeight;
    this.setEnemyPosition();
    this.followAvatar();
  }

  createEnemy() {
    const div = document.createElement("div");
    div.classList.add("enemy");
    gameArea.append(div);
    return div;
  }

  setEnemyPosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  followAvatar() {
    const follow = () => {
      const dx = this.avatar.x - this.x;
      const dy = this.avatar.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const moveX = dx / distance;
        const moveY = dy / distance;

        const newX = this.x + moveX * speed;
        const newY = this.y + moveY * speed;

        if (newX > this.x) {
          this.element.classList.remove("enemy-left");
        } else if (newX < this.x) {
          this.element.classList.add("enemy-left");
        }

        this.x = newX;
        this.y = newY;
        this.setEnemyPosition();
      }

      if (distance <= 5) {
        // console.log("test");
        // Collision detection: 5px distance
        this.killAvatar();
      } else {
        requestAnimationFrame(follow);
      }
    };

    follow();
  }

  killAvatar() {
    const enemyBounding = this.element.getBoundingClientRect();
    const avatarBounding = this.avatar.element.getBoundingClientRect();

    const isInX =
      enemyBounding.left < avatarBounding.right &&
      enemyBounding.right > avatarBounding.left;
    const isInY =
      enemyBounding.top < avatarBounding.bottom &&
      enemyBounding.bottom > avatarBounding.top;

    const isColliding = isInX && isInY;

    // console.log(isColliding);
    this.avatar.element.classList.add("killed");

    if (isColliding) {
      this.avatar.lives -= 1;
    }
    if (this.avatar.lives <= 0) {
      this.avatar.element.remove();
      // console.log("killed");
      const gameOverMessage = document.createElement("div");
      gameOverMessage.innerText = "Game Over";
      gameOverMessage.style.position = "absolute";
      gameOverMessage.style.left = "50%";
      gameOverMessage.style.top = "50%";
      gameOverMessage.style.transform = "translate(-50%, -50%)";
      gameOverMessage.style.fontSize = "32px";
      gameOverMessage.style.color = "red";
      gameArea.appendChild(gameOverMessage);
    }
  }
}

class Elements {
  constructor() {
    this.data = [
      {
        type: "fire",
        image: "./assets/images/elements (1)/Fire.gif",
        alt: "fire element",
      },
      {
        type: "wind",
        image: "./assets/images/elements (1)/wind.gif",
        alt: "wind element",
      },
      {
        type: "water",
        image: "./assets/images/elements (1)/Water.gif",
        alt: "water element",
      },
      {
        type: "earth",
        image: "./assets/images/elements (1)/Earth.gif",
        alt: "earth element",
      },
    ];
    this.data1 = [
      {
        type: "fire",
        image: "./assets/images/FireBending.png",
        alt: "fire element",
      },
      {
        type: "wind",
        image: "./assets/images/AirBending.png",
        alt: "wind element",
      },
      {
        type: "water",
        image: "./assets/images/WaterBending.png",
        alt: "water element",
      },
      {
        type: "earth",
        image: "./assets/images/Earth Bending.png",
        alt: "earth element",
      },
    ];
    this.elements = [];
    this.elementsCounter = [];
    this.gameArea = document.querySelector("main");
    setInterval(() => this.updateElementsPosition(), 4000);
  }

  createElement() {
    this.data.forEach((element) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.src = element.image;
      img.alt = element.alt || "";
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
      img.alt = element.alt || "";
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

  updateElementsPosition() {
    this.elements.forEach((element) => {
      this.setPositionOnMap(element);
    });
  }
}

class Obstacle {
  constructor() {
    this.gameHurdles = [
      {
        type: "castle",
        image: "./assets/images/castle.png",
        alt: "castle image",
      },
      {
        type: "lock",
        image: "./assets/images/lock.png",
        alt: "lock image",
      },
    ];
    this.obstacles = [];
    this.gameArea = document.querySelector("main");
  }

  createObstacle() {
    this.gameHurdles.forEach((item) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.alt || "";
      div.appendChild(img);
      div.className = "castle-container";
      if (item.type === "lock") {
        div.className = "lock-container";
        img.className = "lock";
      }
      this.gameArea.appendChild(div);
      this.setPositionFixed(div);
      this.obstacles.push(div);
    });
  }

  setPositionFixed(div) {
    const mapWidth = this.gameArea.clientWidth;
    const mapHeight = this.gameArea.clientHeight;
    const divWidth = div.clientWidth;
    const divHeight = div.clientHeight;
    const rightPos = mapWidth - divWidth;
    const bottomPos = mapHeight - divHeight;
    div.style.right = rightPos + "px";
    div.style.bottom = bottomPos + "px";
    div.style.position = "absolute";
  }
}

class Game {
  constructor() {
    this.avatar = new Avatar();
    this.enemy = new Enemy(this.avatar);
    this.elements = new Elements();
    this.obstacles = new Obstacle();
    this.obstacles.createObstacle();
    this.elements.createElement();
    this.elements.createElementCounterHolder();
    this.animate();
    this.addEventListener();
    this.pickUpElements();
    // this.throwElements();
  }

  collisionDetectionAvatarElements(element) {
    const avatarBounding = this.avatar.element.getBoundingClientRect();
    const elementsBounding = element.getBoundingClientRect();
    const isInX =
      avatarBounding.left + 50 < elementsBounding.right &&
      avatarBounding.right - 50 > elementsBounding.left;
    const isInY =
      avatarBounding.bottom > elementsBounding.top &&
      avatarBounding.top + 70 < elementsBounding.bottom;
    return isInX && isInY;
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
      if (!pickedUpElements.includes(element)) {
        element.remove();
        pickedUpElements.push(element.querySelector("img").alt.split(" ")[0]);
        pickedUpMotherFucker.push(element);
      }
    }
  }

  throwElements() {
    let elementToDrop = pickedUpMotherFucker.shift();
    if (pickedUpMotherFucker !== "") {
      gameArea.append(elementToDrop);
      return;
    }
    if (pickedUpElements !== "") {
      pickedUpElements.shift();
    }
  }

  updateElements() {
    for (const element of this.elements.elementsCounter) {
      const elementType = element.alt.split(" ")[0];
      if (
        pickedUpElements.includes(elementType) &&
        this.elements.elementsCounter.find(
          (el) => el.alt.split(" ")[0] === elementType
        )
      ) {
        element.classList.add("pop");
        console.log("sjhdjshdjshdjhdjs");
        continue;
      } else {
        element.classList.remove("pop");
      }
    }
  }

  combineElements() {
    if (
      pickedUpElements.includes("wind") &&
      pickedUpElements.includes("fire") &&
      timeLeft > 0
    ) {
      const lock = document.querySelector(".lock");

      clearInterval(interval);
      clearInterval(this.gameIntervalId);
      lock.style.display = "none";
      message.classList.add("visible");
      message.textContent = "Congratulations! you saved the princess";
    } else {
      if (pickedUpElements.length >= 2) {
        message.textContent =
          "The combination of elements you chose doesn't open the lock, Try again.";
      }
    }
  }

  animate() {
    this.gameIntervalId = setInterval(() => {
      for (const key in pressedKeys) {
        if (pressedKeys[key]) {
          this.avatar.move(key);
        }
      }
      // this.combineElements();
      this.detectCollisions();
      this.avatar.addEvent();
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
        event.preventDefault();
        this.avatar.jump(avatar);
      }
      if (event.key === "t") {
        this.throwElements();
      }

      if (event.key === "r") {
        this.avatar.acceleration = 1.5;
      }

      if (event.key === "e") {
        event.preventDefault();
        this.pickUpElements();
        for (let element of game.elements.elementsCounter) {
          //   if (pickedUpElements.includes(element.a)) {
          //     console.log(!pickedUpElements.includes(element.alt));
          for (let pUpElement of pickedUpElements) {
            if (element.alt !== pUpElement) {
              this.updateElements();
            }
          }
          //   if (
          //     pickedUpElements.find((ele) => {
          //       return ele !== element.alt;
          //     })
          // this.updateElements();
        }
        this.combineElements();
      }
    });
    window.addEventListener("keyup", (event) => {
      if (event.key === "r") {
        this.avatar.acceleration = 1;
      }
    });
  }
  //restartGame() {
  // // Remove existing objects from the game area
  // this.avatar.element.remove();
  // this.enemy.element.remove();
  // this.elements.elements.forEach((element) => element.remove());
  // this.obstacles.obstacles.forEach((obstacle) => obstacle.remove());

  // // Clear any active intervals or timeouts
  // clearInterval(this.gameIntervalId);
  // clearInterval(this.pickUpElementsIntervalId);

  // // Reset the game state
  // pickedUpElements = [];
  // pickedUpMotherFucker = [];

  // this.avatar = new Avatar();
  // this.enemy = new Enemy(this.avatar);
  // this.elements = new Elements();
  // this.obstacles = new Obstacle();
  // this.obstacles.createObstacle();
  // this.elements.createElement();

  // // Restart the game loop and event listeners
  // this.animate();
  // this.addEventListener();

  // // Clear any displayed messages or UI elements
  // message.textContent = "";
}

function startGame() {
  clearInterval(interval);
  event.target.disabled = true;
  game = new Game();
  gameStarted = true;
  timeLeft = 60;
  timer.textContent = timeLeft;
  interval = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(interval);
      message.textContent = "You lost! Try again.";
    }
  }, 1000);
}

window.onload = function () {
  let reloading = sessionStorage.getItem("reloading");
  if (reloading) {
    sessionStorage.removeItem("reloading");
    startGame();
  }
};

function reloadPage() {
  sessionStorage.setItem("reloading", "true");
  document.location.reload();
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

restartButton.addEventListener("click", () => {
  reloadPage();
});

startGameButton.addEventListener("click", startGame);
