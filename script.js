document.addEventListener("DOMContentLoaded", function() {
    const restartGameBtn = document.getElementById('restart-game-btn');

    let animalSlides = Array.from(document.querySelectorAll('.animal-slider .slide'));
    const humanSlides = document.querySelectorAll('.human-slider .slide');
    const animalContainer = document.querySelector('.animal-slider');

    let selectedHuman = null;
    let correctPairs = 0;
    let currentHumanIndex = 0;

    function showNextHuman() {
        if (currentHumanIndex < humanSlides.length) {
            const nextHuman = humanSlides[currentHumanIndex];
            humanSlides.forEach(human => human.classList.add('hidden'));
            nextHuman.classList.remove('hidden');
            selectedHuman = nextHuman;
            showNextThreeAnimals(nextHuman.id);
            currentHumanIndex++;
        } else {
            endGame();
        }
    }

    function showNextThreeAnimals(humanId) {
        document.querySelectorAll('.animal-slider .slide').forEach(slide => {
            slide.remove();
        });

        const correctAnimal = animalSlides.find(animal => animal.id === humanId.replace('human', 'animal'));

        let randomAnimals = animalSlides.filter(animal => animal !== correctAnimal);
        randomAnimals = shuffle(randomAnimals).slice(0, 2);

        const animalsToShow = [correctAnimal, ...randomAnimals];
        shuffle(animalsToShow).forEach(animal => {
            animal.classList.remove('hidden', 'selected', 'correct', 'wrong');
            animalContainer.appendChild(animal);
        });
    }

    animalContainer.addEventListener('click', function(e) {
        const selectedAnimal = e.target.closest('.slide');
        if (selectedAnimal && selectedHuman) {
            const animalId = selectedAnimal.id.split('-')[1];
            const humanId = selectedHuman.id.split('-')[1];

            selectedAnimal.querySelector('img').classList.add('selected');

            if (animalId === humanId) {
                selectedAnimal.classList.add('correct');
                selectedHuman.classList.add('correct');
                correctPairs++;

                animalSlides = animalSlides.filter(animal => animal !== selectedAnimal);

            } else {
                selectedAnimal.classList.add('wrong');
                selectedHuman.classList.add('wrong');
            }

            setTimeout(() => {
                resetSelection();
                if (animalSlides.length >= 3) {
                    showNextHuman();
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
        document.querySelectorAll('.animal-slider .slide img').forEach(animal => {
            animal.classList.remove('selected', 'correct', 'wrong');
        });
        selectedHuman = null;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function endGame() {
        alert(`Гра завершена! Вірних пар: ${correctPairs}`);
    }

    restartGameBtn.addEventListener('click', () => {
        location.reload();
    });

    showNextHuman();
});
