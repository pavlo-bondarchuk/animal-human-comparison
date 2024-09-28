document.addEventListener("DOMContentLoaded", function() {
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
        const resultMessage = document.getElementById('result-message');
        resultMessage.innerHTML = `Дякую за гру! Вірних пар: ${correctPairs}`;
        resultMessage.style.display = 'block';
    }
});
