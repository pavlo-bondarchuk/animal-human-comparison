document.addEventListener("DOMContentLoaded", function() {
    const animalSlides = document.querySelectorAll('.animal-slider .slide');
    const humanSlides = document.querySelectorAll('.human-slider .slide');

    let selectedAnimal = null;
    let selectedHuman = null;

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
            if (selectedHuman) {
                selectedHuman.classList.remove('selected');
            }
            selectedHuman = this;
            selectedHuman.classList.add('selected');
            compareSelection();
        });
    });

    function compareSelection() {
        if (selectedAnimal && selectedHuman) {
            console.log("Selected pair:", selectedAnimal.id, "and", selectedHuman.id);
            // Add any other logic you want to run when both selections are made
        }
    }
});
