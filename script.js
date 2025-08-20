const nicknameScreen = document.getElementById("nickname-screen");
const mainScreen = document.getElementById("main-screen");
const profileScreen = document.getElementById("profile-screen");
const settingsScreen = document.getElementById("settings-screen");
const nicknameInput = document.getElementById("nickname-input");
const nicknameSubmit = document.getElementById("nickname-submit");
const playerName = document.querySelectorAll("#player-name");
const menuSection = document.getElementById("menu-section");
const navText = document.querySelector(".nav-text");

const menuButtons = document.querySelectorAll(".nav-menu-list li");

const sections = document.querySelectorAll("section:not(#menu-section)");
// Animation of change character
document.querySelectorAll(".card").forEach((card) => {
  const img = card.querySelector("img");
  const staticSrc = img.src;
  const animSrc = img.dataset.anim;

  card.addEventListener("mouseenter", () => {
    img.src = animSrc;
  });

  card.addEventListener("mouseleave", () => {
    img.src = staticSrc;
  });
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
