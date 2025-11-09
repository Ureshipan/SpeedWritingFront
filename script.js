// Массив текстов для тренировки
const texts = [
    "Быстрая коричневая лиса прыгает через ленивую собаку. Программирование требует практики и терпения.",
    "JavaScript является одним из самых популярных языков программирования в мире. Он используется для создания интерактивных веб-сайтов.",
    "Регулярная практика печати значительно улучшает скорость и точность набора текста. Упражнения помогают развить мышечную память.",
    "Клавиатурные тренажеры помогают развить навыки слепой печати. Это экономит время и повышает продуктивность работы.",
    "Внимание к деталям и концентрация являются ключевыми факторами успешного программирования и быстрой печати."
];

// Переменные для хранения состояния
let currentText = '';
let timeLeft = 60;
let timerInterval = null;
let isTestActive = false;
let errors = 0;
let totalTyped = 0;
let startTime = null;

// Получение элементов DOM
const textContent = document.getElementById('textContent');
const typingInput = document.getElementById('typingInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const cpmDisplay = document.getElementById('cpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorsDisplay = document.getElementById('errors');
const typedDisplay = document.getElementById('typed');

// Инициализация - выбор случайного текста
function initTest() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    displayText();
}

// Отображение текста с подсветкой
function displayText() {
    textContent.innerHTML = '';
    const inputValue = typingInput.value;
    
    for (let i = 0; i < currentText.length; i++) {
        const char = currentText[i];
        let className = '';
        
        if (i < inputValue.length) {
            // Проверка правильности введенного символа
            className = inputValue[i] === char ? 'correct' : 'incorrect';
        } else if (i === inputValue.length) {
            // Текущий символ для ввода
            className = 'current';
        }
        
        const span = document.createElement('span');
        span.textContent = char;
        span.className = className;
        textContent.appendChild(span);
    }
}

// Старт теста
function startTest() {
    isTestActive = true;
    timeLeft = 60;
    errors = 0;
    totalTyped = 0;
    startTime = Date.now();
    
    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.focus();
    startBtn.disabled = true;
    
    // Инициализация текста
    initTest();
    
    // Запуск таймера с использованием Date.now() для точности
    timerInterval = setInterval(updateTimer, 1000);
}

// Обновление таймера
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        // Обновление статистики каждую секунду
        updateStats();
    } else {
        endTest();
    }
}

// Обработка ввода текста
typingInput.addEventListener('input', () => {
    if (!isTestActive) return;
    
    const inputValue = typingInput.value;
    totalTyped = inputValue.length;
    
    // Подсчет ошибок
    errors = 0;
    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] !== currentText[i]) {
            errors++;
        }
    }
    
    // Обновление отображения текста
    displayText();
    
    // Обновление статистики
    updateStats();
    
    // Проверка завершения текста
    if (inputValue === currentText) {
        endTest();
    }
});

// Обновление статистики
function updateStats() {
    const timeElapsed = (60 - timeLeft) || 1; // Избегаем деления на 0
    const inputValue = typingInput.value;
    
    // Подсчет правильных символов
    let correctChars = 0;
    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] === currentText[i]) {
            correctChars++;
        }
    }
    
    // CPM (Characters Per Minute) - символов в минуту
    const cpm = Math.round((correctChars / timeElapsed) * 60);
    
    // WPM (Words Per Minute) - слов в минуту (средняя длина слова = 5 символов)
    const wpm = Math.round(cpm / 5);
    
    // Точность в процентах
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    
    // Обновление дисплея
    wpmDisplay.textContent = wpm;
    cpmDisplay.textContent = cpm;
    accuracyDisplay.textContent = accuracy;
    errorsDisplay.textContent = errors;
    typedDisplay.textContent = totalTyped;
}

// Завершение теста
function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    typingInput.disabled = true;
    startBtn.disabled = false;
    
    // Финальное обновление статистики
    updateStats();
}

// Сброс теста
function resetTest() {
    clearInterval(timerInterval);
    
    isTestActive = false;
    timeLeft = 60;
    errors = 0;
    totalTyped = 0;
    startTime = null;
    
    typingInput.value = '';
    typingInput.disabled = true;
    startBtn.disabled = false;
    
    timerDisplay.textContent = '60';
    wpmDisplay.textContent = '0';
    cpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    errorsDisplay.textContent = '0';
    typedDisplay.textContent = '0';
    
    // Новый текст
    initTest();
}

// Обработчики событий кнопок
startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    initTest();
});
