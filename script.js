const flipCards = document.querySelectorAll('.flip-card'); //карточка
let currentCardIndex = 0;

//слова
const cards =[{
    word: 'mother',
    translate: 'мама',
    example: 'I love my mother!'
},
{
    word: 'father',
    translate: 'папа',
    example: 'My father is a very strong!'
},
{
    word: 'teacher',
    translate: 'учитель',
    example: 'My future job is a teacher!'
},
{
    word: 'dress',
    translate: 'платье',
    example: 'I want to buy this pink dress!'
},
{
    word: 'fruits',
    translate: 'фрукты',
    example: 'We need to eat more fruits!'
},
{
    word: 'flowers',
    translate: 'цветы',
    example: 'Girls like flowers!'
},
];

// кнопки
const backButton = document.querySelector('#back');
const nextButton = document.querySelector('#next');

// текст в карточке
const cardFront = document.querySelector('#card-front h1'); //передняя сторона карточки - слово
const cardBack = document.querySelector('#card-back h1'); // задняя сторона - перевод
const cardBackExample = document.querySelector('#card-back span'); // задняя сторона - пример

// Функция для обновления активной карточки
function updateActiveCard() {
    const activeCard = cards[currentCardIndex];
    cardFront.textContent = activeCard.word;
    cardBack.textContent = activeCard.translate;
    cardBackExample.textContent = activeCard.example;

    // блокировка кнопок
    backButton.disabled = currentCardIndex === 0;
    nextButton.disabled = currentCardIndex === cards.length - 1;

    // счет слов
    const currentWordElement = document.querySelector('#current-word');
    currentWordElement.textContent = `Слово ${currentCardIndex + 1}`;
}


flipCards.forEach((card) => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });
});

// клик на кнопки вперед/назад
backButton.addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--; 
        updateActiveCard();
    }
});

nextButton.addEventListener('click', () => {
    if (currentCardIndex < cards.length - 1) {
        currentCardIndex++; 
        updateActiveCard();
    }
});


updateActiveCard();

// тестирование

const examButton = document.querySelector('#exam');
const sliderCard = document.querySelector('.slider');

examButton.addEventListener('click', startExam);



// тест
function startExam() {
    const studyModeElement = document.querySelector('#study-mode');
    const examModeElement = document.querySelector('#exam-mode');
    const contentElement = document.querySelector('#exam-cards');

    studyModeElement.classList.add('hidden');
    examModeElement.classList.remove('hidden');
    backButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    examButton.classList.add('hidden');
    sliderCard.classList.add('hidden');

    // перемешать карточки
    const randomCards =   [...cards];
    randomCards.sort(() => Math.random() - 0.5);

    // контейнер для карточек
    const fragment = document.createDocumentFragment();

    // карточки для контейнера
    randomCards.forEach((card) => {
        const cardWordElement = createCardElement(card.translate, card.word);
        const cardTranslateElement = createCardElement(card.word, card.translate);
        fragment.append(cardWordElement);
        fragment.append(cardTranslateElement);
    });
    contentElement.append(fragment);

}

// карточки
function createCardElement(word, translation) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const wordElement = document.createElement('div');
    wordElement.classList.add('card-word');
    wordElement.textContent = word;

    const translationElement = document.createElement('div');
    translationElement.classList.add('card-translation');
    translationElement.textContent = translation;

    cardElement.append(wordElement);
    cardElement.append(translationElement);
    translationElement.classList.add('hidden');

    // родитель всех карточек
    const contentElement = document.querySelector('#exam-cards');
    let firstClickedCard = null;
    let correctAnswersCount = 0;

    // обработчик клика на родителя
    contentElement.addEventListener('click', function(event) {
        const cardElement = event.target.closest('.card');

        if (cardElement) {
            if (firstClickedCard === null) {
                firstClickedCard = cardElement;
                firstClickedCard.classList.add('correct');
            } else {
                const firstCardWord = firstClickedCard.querySelector('.card-word').textContent;
                const secondCardWord = cardElement.querySelector('.card-word').textContent;
                const firstCardTranslation = firstClickedCard.querySelector('.card-translation').textContent;
                const secondCardTranslation = cardElement.querySelector('.card-translation').textContent;

                if (
                    (firstCardWord === secondCardTranslation && firstCardTranslation === secondCardWord) ||
                    (firstCardTranslation === secondCardWord && firstCardWord === secondCardTranslation)
                ) {
                    cardElement.classList.add('correct');
                    firstClickedCard.classList.add('fade-out');
                    cardElement.classList.add('fade-out');

                    firstClickedCard = null;
                    correctAnswersCount++;
                } else {
                    cardElement.classList.add('wrong');

                    setTimeout(() => {
                        cardElement.classList.remove('wrong');
                        firstClickedCard.classList.remove('correct');
                        firstClickedCard = null;
                    }, 500);
                }
            }
        }
      
      if (correctAnswersCount === cards.length) {
        setTimeout(() => { alert("Экзамен пройден!"); }, 500);
      }
    });

    return cardElement;
}