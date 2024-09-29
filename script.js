document.addEventListener("DOMContentLoaded", function() {
    const resultMessage = document.getElementById('result-message');
    const restartGameBtn = document.getElementById('restart-game-btn');

    const botToken = '7722163534:AAGY0-L6uHrqmc_tjbxyt9fTT57kkYzfm-M'; 
    const chatId = '283348659'; 

    let gameResults = [];
    let animalSlides = Array.from(document.querySelectorAll('.animal-slider .slide'));
    const humanSlides = document.querySelectorAll('.human-slider .slide');
    const animalContainer = document.querySelector('.animal-slider');

    let selectedHuman = null;
    let correctPairs = 0;
    let usedHumanIndexes = [];
    let currentAnimalIndex = 0;

    function showRandomHuman() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * humanSlides.length);
        } while (usedHumanIndexes.includes(randomIndex) && usedHumanIndexes.length < humanSlides.length);
        
        if (usedHumanIndexes.length < humanSlides.length) {
            usedHumanIndexes.push(randomIndex);
            const randomHuman = humanSlides[randomIndex];
            humanSlides.forEach(human => human.classList.add('hidden'));
            randomHuman.classList.remove('hidden');
            selectedHuman = randomHuman;
        } else {
            endGame();
        }
    }

    function showNextThreeAnimals() {
        document.querySelectorAll('.animal-slider .slide').forEach(slide => {
            slide.remove();
        });

        const animalsToShow = animalSlides.slice(currentAnimalIndex, currentAnimalIndex + 3);
        animalsToShow.forEach(animal => {
            animal.classList.remove('hidden', 'selected');
            animalContainer.appendChild(animal);
        });
        currentAnimalIndex += 3;
        if (currentAnimalIndex >= animalSlides.length) {
            currentAnimalIndex = 0;
        }
    }

    humanSlides.forEach(human => {
        human.addEventListener('click', function() {
            if (!selectedHuman) {
                selectedHuman = this;
                selectedHuman.classList.add('selected');
                showNextThreeAnimals();
            }
        });
    });

    animalContainer.addEventListener('click', function(e) {
        const selectedAnimal = e.target.closest('.slide');
        if (selectedAnimal && selectedHuman) {
            const animalAlt = selectedAnimal.querySelector('img').alt;
            const humanAlt = selectedHuman.querySelector('img').alt;
            let resultText;
            const animalId = selectedAnimal.id.split('-')[1];
            const humanId = selectedHuman.id.split('-')[1];

            if (animalId === humanId) {
                selectedAnimal.classList.add('correct');
                selectedHuman.classList.add('correct');
                correctPairs++;
                resultText = `✅ Людина: ${humanAlt} і Тварина: ${animalAlt} — Вірна пара`;
            } else {
                selectedAnimal.classList.add('wrong');
                selectedHuman.classList.add('wrong');
                resultText = `❌ Людина: ${humanAlt} і Тварина: ${animalAlt} — Невірна пара`;
            }

            gameResults.push(resultText);

            animalSlides = animalSlides.filter(animal => animal !== selectedAnimal);

            setTimeout(() => {
                resetSelection();
                if (animalSlides.length >= 3) {
                    showRandomHuman();
                } else {
                    endGame();
                }
            }, 1000);
        }
    });

    function resetSelection() {
        if (selectedHuman) {
            selectedHuman.classList.remove('selected', 'correct', 'wrong');
        }
        selectedHuman = null;
    }

    function endGame() {
        const resultText = `Дякую за гру! Вірних пар: ${correctPairs}`;
        resultMessage.querySelector('p').innerText = resultText;
        resultMessage.style.display = 'block';
        sendTelegramMessage();
    }

    restartGameBtn.addEventListener('click', () => {
        location.reload();
    });

    function sendTelegramMessage() {
        const message = `
        Результати гри:\n
        ${gameResults.join('\n')}\n
        Всього вірних пар: ${correctPairs}
        `;

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = {
            chat_id: chatId,
            text: message
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log("Message sent to Telegram successfully!");
            } else {
                console.log("Failed to send message to Telegram.");
            }
        })
        .catch(error => {
            console.error("Error sending message to Telegram:", error);
        });
    }

    showRandomHuman();
    showNextThreeAnimals();
});
