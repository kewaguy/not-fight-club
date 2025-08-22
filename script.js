const nicknameScreen = document.getElementById("nickname-screen");
const mainScreen = document.getElementById("main-screen");
const profileScreen = document.getElementById("profile-screen");
const settingsScreen = document.getElementById("settings-screen");
const nicknameInput = document.getElementById("nickname-input");
const nicknameSubmit = document.getElementById("nickname-submit");
const playerName = document.querySelectorAll("#player-name");
const menuSection = document.getElementById("menu-section");
const navText = document.querySelector(".nav-text");
const inputBox = document.querySelector(".input-box");
const menuButtons = document.querySelectorAll(".nav-menu-list li");
const characterCards = document.querySelectorAll(".cards-container .card");
const mainCharacter = document.querySelector(".main-character");
const playerImage = document.querySelector(".avatar-box img");
const attackBtn = document.getElementById("attack-btn");
const battleLog = document.getElementById("battle-log");

let playerHealth = 100;
let monsterHealth = 100;
const sections = document.querySelectorAll("section:not(#menu-section)");

const monsters = [
  {
    name: "Enemy1",
    attackPoints: 2,
    defensePoints: 1,
    zones: ["head", "neck", "body", "belly", "legs"],
    img: "enemy/enemy1.webp",
    health: 100,
  },
  {
    name: "Enemy2",
    attackPoints: 1,
    defensePoints: 2,
    zones: ["head", "neck", "body", "belly", "legs"],
    img: "enemy/enemy2.webp",
    health: 100,
  },
  {
    name: "Enemy3",
    attackPoints: 2,
    defensePoints: 2,
    zones: ["head", "neck", "body", "belly", "legs"],
    img: "enemy/enemy3.webp",
    health: 80,
  },
];

// Animation of change character
document.querySelectorAll(".card").forEach((card) => {
  const img = card.querySelector("img");
  const staticSrc = img.src;
  const animSrc = img.dataset.anim;
  if (!card.dataset.exclude) {
    card.addEventListener("mouseenter", () => {
      img.src = animSrc;
    });

    card.addEventListener("mouseleave", () => {
      img.src = staticSrc;
    });
  }
});

// check localStorage
const savedNickname = localStorage.getItem("nickname");
if (savedNickname) {
  nicknameInput.value = savedNickname;
  playerName.forEach((name) => {
    name.textContent = savedNickname;
  });

  showMainScreen();
}

function logMessage(message) {
  const li = document.createElement("li");
  li.innerHTML = message;
  battleLog.appendChild(li);

  battleLog.scrollTop = battleLog.scrollHeight;
}

let monster;

// when game starts initialize monster
function initMonster() {
  monster = monsters[Math.floor(Math.random() * monsters.length)];
  document.getElementById("enemy-name").textContent = monster.name;
  document.querySelector(".avatar-enemy img").src = monster.img;
  document.getElementById("enemy-health").textContent = monster.health;
}
initMonster();

// If nickname exists, show main screen
function showMainScreen() {
  nicknameScreen.classList.remove("active");
  mainScreen.classList.add("active");
  menuSection.classList.add("active");
  profileScreen.classList.remove("active");
  settingsScreen.classList.remove("active");
}

// Logout functionality
function logout() {
  localStorage.removeItem("nickname");
  nicknameInput.value = "";
  nicknameScreen.classList.add("active");
  mainScreen.classList.remove("active");
  menuSection.classList.remove("active");
  profileScreen.classList.remove("active");
  settingsScreen.classList.remove("active");
}

function getSelectedAttack() {
  const attack = document.querySelector('input[name="attack"]:checked');
  return attack ? attack.value : null;
}

function getSelectedDefense() {
  const defenses = Array.from(
    document.querySelectorAll('input[name="defense"]:checked')
  ).map((d) => d.value);
  return defenses;
}

function randomZones(array, count) {
  const result = [];
  const copy = [...array];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

function updateButtonState() {
  const attack = getSelectedAttack();
  const defense = getSelectedDefense();
  attackBtn.disabled = !(attack && defense.length === 2);
}

document
  .querySelectorAll('input[name="attack"], input[name="defense"]')
  .forEach((input) => {
    input.addEventListener("change", updateButtonState);
  });

attackBtn.addEventListener("click", () => {
  const playerAttack = [getSelectedAttack()];
  const playerDefense = getSelectedDefense();

  const monsterAttack = randomZones(monster.zones, monster.attackPoints);
  const monsterDefense = randomZones(monster.zones, monster.defensePoints);

  // enemy attack
  monsterAttack.forEach((zone) => {
    if (!playerDefense.includes(zone)) {
      playerHealth -= 10;
      logMessage(
        `<span class="text-box-enemy">${monster.name}</span> attacked <span class="text-box">${savedNickname}</span> to ${zone} → <span class="text-box">${savedNickname}</span> received 10 damage!`
      );
    } else {
      logMessage(
        `<span class="text-box-enemy">${monster.name}</span> attacked <span class="text-box">${savedNickname}</span> to ${zone} → <span class="text-box">${savedNickname}</span> was able to protect his ${zone}!`
      );
    }
  });

  // player attack
  playerAttack.forEach((zone) => {
    if (!monsterDefense.includes(zone)) {
      monsterHealth -= 10;
      logMessage(
        `<span class="text-box">${savedNickname}</span> attacked to ${zone} → <span class="text-box-enemy">${monster.name}</span> received 10 damage!`
      );
    } else {
      logMessage(
        `<span class="text-box">${savedNickname}</span> attacked to ${zone} → <span class="text-box-enemy">${monster.name}</span> was able to protect his ${zone}!`
      );
    }
  });

  // update health display
  document.getElementById("player-health").textContent = playerHealth;
  document.getElementById("enemy-health").textContent = monsterHealth;

  // check for end of game
  if (playerHealth <= 0 || monsterHealth <= 0) {
    if (playerHealth <= 0 && monsterHealth <= 0) {
      battleLog.innerHTML += `<li>Draw!</li>`;
    } else if (playerHealth <= 0) {
      battleLog.innerHTML += `<li>${monster.name} won!</li>`;
    } else {
      battleLog.innerHTML += `<li>${savedNickname} won!</li>`;
    }
    attackBtn.disabled = true;
  }

  // reset selections for next turn
  document
    .querySelectorAll('input[name="attack"]')
    .forEach((i) => (i.checked = false));
  document
    .querySelectorAll('input[name="defense"]')
    .forEach((i) => (i.checked = false));
  updateButtonState();
});

// Event listener for logout button
document.getElementById("logout-button").addEventListener("click", () => {
  logout();
});

// section navigation
menuButtons.forEach((li) => {
  const btn = li.querySelector("button");
  btn.addEventListener("click", () => {
    const sectionId = btn.dataset.section;
    if (sectionId === "logout") {
      logout();
    } else {
      showSection(sectionId);
    }
  });
});

// Handle nickname submission
nicknameSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  const nickname = nicknameInput.value.trim();
  if (nickname) {
    localStorage.setItem("nickname", nickname);

    playerName.forEach((name) => {
      name.textContent = nickname;
    });

    showMainScreen();
  } else {
    alert("Please enter a valid nickname.");
  }
});

// Show section
function showSection(sectionId) {
  sections.forEach((section) => {
    if (section.id === sectionId) {
      if (sectionId === "profile-screen") {
        navText.textContent = "Profile";
      } else if (sectionId === "settings-screen") {
        navText.textContent = "Settings";
      } else {
        navText.textContent = "Main";
      }

      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });

  if (sectionId === "nickname-screen") {
    menuSection.classList.remove("active");
  }
}

// Change nickname in settings
document.querySelector(".settings-box button").addEventListener("click", () => {
  const inputElement = document.querySelector(".settings-box input");
  const newNickname = inputElement.value.trim();
  if (newNickname) {
    localStorage.setItem("nickname", newNickname);
    playerName.forEach((name) => {
      name.textContent = newNickname;
    });
    nicknameInput.value = newNickname; // Update input field
    inputElement.value = ""; // Update input box in settings
    alert("Nickname updated successfully!");
  } else {
    alert("Please enter a valid nickname.");
  }
});

// Change main character
characterCards.forEach((Card) => {
  Card.addEventListener("click", () => {
    const characterName = Card.querySelector(".card-badge").textContent;
    mainCharacter.querySelector(".card-badge").textContent = characterName;
    mainCharacter.querySelector("img").src = Card.querySelector("img").src;
    playerImage.src = Card.querySelector("img").src;
  });
});
