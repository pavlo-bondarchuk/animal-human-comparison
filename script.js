document.addEventListener("DOMContentLoaded", function () {
  const resultMessage = document.getElementById("result-message");
  const restartGameBtn = document.getElementById("restart-game-btn");

  const botToken = "7722163534:AAGY0-L6uHrqmc_tjbxyt9fTT57kkYzfm-M";
  const chatId = "283348659";

  let gameResults = [];
  const animalSlides = document.querySelectorAll(".animal-slider .slide");
  const humanSlides = document.querySelectorAll(".human-slider .slide");
  const animalContainer = document.querySelector(".animal-slider");

  let selectedHuman = null;
  let correctPairs = 0;
  let currentHumanIndex = 0;

  function showRandomAnimals() {
    animalContainer.innerHTML = "<h2>Animal Photos</h2>";
    const animalsArray = Array.from(animalSlides);
    const randomAnimals = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * animalsArray.length);
      randomAnimals.push(animalsArray[randomIndex]);
      animalsArray.splice(randomIndex, 1);
    }
    randomAnimals.forEach((animal) => {
      animal.classList.remove("hidden", "selected");
      animalContainer.appendChild(animal);
    });
  }

  humanSlides.forEach((human) => {
    human.addEventListener("click", function () {
      if (!selectedHuman) {
        selectedHuman = this;
        selectedHuman.classList.add("selected");
        showRandomAnimals();
      }
    });
  });

  animalContainer.addEventListener("click", function (e) {
    const selectedAnimal = e.target.closest(".slide");
    if (selectedAnimal && selectedHuman) {
      const animalAlt = selectedAnimal.querySelector("img").alt;
      const humanAlt = selectedHuman.querySelector("img").alt;
      let resultText;
      const animalId = selectedAnimal.id.split("-")[1];
      const humanId = selectedHuman.id.split("-")[1];

      if (animalId === humanId) {
        selectedAnimal.classList.add("correct");
        selectedHuman.classList.add("correct");
        correctPairs++;
        resultText = `✅ Людина: ${humanAlt} і Тварина: ${animalAlt} — Вірна пара`;
      } else {
        selectedAnimal.classList.add("wrong");
        selectedHuman.classList.add("wrong");
        resultText = `❌ Людина: ${humanAlt} і Тварина: ${animalAlt} — Невірна пара`;
      }

      gameResults.push(resultText);

      setTimeout(() => {
        resetSelection();
        showNextHumanSlide();
      }, 1000);
    }
  });

  function resetSelection() {
    if (selectedHuman) {
      selectedHuman.classList.remove("selected", "correct", "wrong");
    }
    selectedHuman = null;
  }

  function showNextHumanSlide() {
    humanSlides[currentHumanIndex].classList.add("hidden");
    currentHumanIndex++;
    if (currentHumanIndex >= humanSlides.length) {
      endGame();
    } else {
      humanSlides[currentHumanIndex].classList.remove("hidden");
    }
  }

  function endGame() {
    const resultText = `Дякую за гру! Вірних пар: ${correctPairs}`;
    resultMessage.querySelector("p").innerText = resultText;
    resultMessage.style.display = "block";
    sendTelegramMessage();
  }

  restartGameBtn.addEventListener("click", () => {
    location.reload();
  });

  function sendTelegramMessage() {
    const message = `
      Результати гри:\n
      ${gameResults.join("\n")}\n
      Всього вірних пар: ${correctPairs}
      `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = {
      chat_id: chatId,
      text: message,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          console.log("Message sent to Telegram successfully!");
        } else {
          console.log("Failed to send message to Telegram.");
        }
      })
      .catch((error) => {
        console.error("Error sending message to Telegram:", error);
      });
  }
});
