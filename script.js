document.addEventListener("DOMContentLoaded", function() {
    const emailBlock = document.getElementById('email-block');
    const startGameBtn = document.getElementById('start-game-btn');
    const emailInput = document.getElementById('email-input');
    const resultMessage = document.getElementById('result-message');
    const restartGameBtn = document.getElementById('restart-game-btn');

    const botToken = '7722163534:AAGY0-L6uHrqmc_tjbxyt9fTT57kkYzfm-M'; // Ваш токен
    const chatId = '283348659'; // Ваш Chat ID

    // Перевіряємо, чи є пошта в localStorage
    if (localStorage.getItem('email')) {
        emailBlock.style.display = 'none';
    }

    // Обробка введення пошти
    startGameBtn.addEventListener('click', () => {
        const email = emailInput.value;
        if (email) {
            localStorage.setItem('email', email);
            emailBlock.style.display = 'none';
        } else {
            alert('Please enter a valid email.');
        }
    });

    const animalSlides = document.querySelectorAll('.animal-slider .slide');
    const humanSlides = document.querySelectorAll('.human-slider .slide');
    let selectedAnimal = null;
    let selectedHuman = null;
    let correctPairs = 0;
    let currentHumanIndex = 0;

    // Показуємо перше фото людини
    humanSlides.forEach((human, index) => {
        if (index !== 0) {
            human.classList.add('hidden');
        }
    });

    animalSlides.forEach(animal => {
        animal.addEventListener('click', function() {
            if (selectedAnimal) {
                selectedAnimal.classList.remove('selected');
            }
            selectedAnimal = this;
            selectedAnimal.classList.add('selected');
            compareSelection();
        });
    });

    humanSlides.forEach(human => {
        human.addEventListener('click', function() {
            if (!selectedHuman && human.classList.contains('hidden') === false) {
                selectedHuman = this;
                selectedHuman.classList.add('selected');
            }
            compareSelection();
        });
    });

    function compareSelection() {
        if (selectedAnimal && selectedHuman) {
            const animalId = selectedAnimal.id.split('-')[1];
            const humanId = selectedHuman.id.split('-')[1];

            if (animalId === humanId) {
                selectedAnimal.classList.add('correct');
                selectedHuman.classList.add('correct');
                correctPairs++;
            } else {
                selectedAnimal.classList.add('wrong');
                selectedHuman.classList.add('wrong');
            }

            setTimeout(() => {
                resetSelection();
                showNextHumanSlide();
            }, 1000);
        }
    }

    function resetSelection() {
        if (selectedAnimal) {
            selectedAnimal.classList.remove('selected', 'correct', 'wrong');
            selectedAnimal.classList.add('hidden'); // Приховуємо вибрану тварину
        }
        if (selectedHuman) {
            selectedHuman.classList.remove('selected', 'correct', 'wrong');
        }
        selectedAnimal = null;
        selectedHuman = null;
    }

    function showNextHumanSlide() {
        humanSlides[currentHumanIndex].classList.add('hidden');
        currentHumanIndex++;
        if (currentHumanIndex >= humanSlides.length) {
            endGame();
        } else {
            humanSlides[currentHumanIndex].classList.remove('hidden');
        }
    }

    function endGame() {
        const resultText = `Дякую за гру! Вірних пар: ${correctPairs}`;
        resultMessage.querySelector('p').innerText = resultText;
        resultMessage.style.display = 'block';

        // Відправляємо результат у Telegram
        sendTelegramMessage(resultText);
    }

    // Перезапуск гри
    restartGameBtn.addEventListener('click', () => {
        location.reload(); // Перезапуск гри
    });

    // Функція для відправки повідомлення у Telegram
    function sendTelegramMessage(message) {
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
});
