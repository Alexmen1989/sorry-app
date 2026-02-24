// Элементы DOM
const preloader = document.getElementById('preloader');
const content = document.getElementById('content');
const typingText = document.getElementById('typing-text');
const modal = document.getElementById('message-modal');
const modalMessage = document.getElementById('modal-message');
const effectLayer = document.getElementById('effect-layer');
const datetimeElem = document.getElementById('current-datetime');

// Устанавливаем текущую дату и время в подвал
function setCurrentDateTime() {
    const now = new Date();
    const options = { 
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    };
    datetimeElem.textContent = now.toLocaleString('ru-RU', options);
}
setCurrentDateTime();

// ===== Прелоадер с эффектом печати (3 фразы) =====
const messages = [
    "Простите что не пришел на хинкал...",
    "Знаю что этим обидел Вас...",
    "Но я правда не мог прийти в то воскресенье..."
];

let msgIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = '';

function typeEffect() {
    if (msgIndex >= messages.length) {
        // Все сообщения показаны – скрываем прелоадер
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                content.style.display = 'block';
            }, 1000);
        }, 500);
        return;
    }

    const fullText = messages[msgIndex];
    
    if (!isDeleting) {
        currentText = fullText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === fullText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
            typingText.textContent = currentText;
            return;
        }
    } else {
        currentText = fullText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            msgIndex++;
            if (msgIndex === messages.length) {
                setTimeout(typeEffect, 500);
                return;
            }
        }
    }

    typingText.textContent = currentText;
    setTimeout(typeEffect, isDeleting ? 50 : 100);
}

window.onload = typeEffect;

// ===== Функция отправки данных на сервер (теперь с названием кнопки) =====
async function sendClick(buttonText) {
    try {
        const response = await fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ button: buttonText })
        });
        const data = await response.json();
        if (data.status === 'ok') {
            console.log('✅ Уведомление отправлено на сервер');
        } else {
            console.error('❌ Ошибка сервера');
        }
    } catch (error) {
        console.error('❌ Ошибка соединения:', error);
    }
}

// ===== Эффекты =====
function clearEffects() {
    effectLayer.innerHTML = '';
}

function explosionEffect() {
    clearEffects();
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;
        particle.style.setProperty('--x', x + 'px');
        particle.style.setProperty('--y', y + 'px');
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        effectLayer.appendChild(particle);
    }
    setTimeout(clearEffects, 1000);
}

function rainEffect() {
    clearEffects();
    for (let i = 0; i < 120; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = Math.random() * 1 + 0.5 + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        effectLayer.appendChild(drop);
    }
    setTimeout(clearEffects, 6000);
}

function smileEffect() {
    clearEffects();
    for (let i = 0; i < 40; i++) {
        const smile = document.createElement('div');
        smile.textContent = '😊';
        smile.className = 'smile-particle';
        smile.style.left = Math.random() * 100 + '%';
        smile.style.top = Math.random() * 100 + '%';
        smile.style.fontSize = Math.random() * 2 + 1.5 + 'rem';
        smile.style.animationDuration = Math.random() * 3 + 3 + 's';
        effectLayer.appendChild(smile);
    }
    setTimeout(clearEffects, 4000);
}

function ashEffect() {
    clearEffects();
    // Скрываем кнопки и заголовок с подвалом
    document.querySelector('.buttons-container').style.opacity = '0';
    document.querySelector('.header-text').style.opacity = '0';
    document.querySelector('.footer').style.opacity = '0';
    document.querySelector('.floating-elements').style.opacity = '0';
    // Создаём пепел
    for (let i = 0; i < 250; i++) {
        const ash = document.createElement('div');
        ash.className = 'ash-particle';
        ash.style.left = Math.random() * 100 + '%';
        ash.style.top = '-10%';
        ash.style.animationDuration = Math.random() * 3 + 3 + 's';
        ash.style.animationDelay = Math.random() * 2 + 's';
        effectLayer.appendChild(ash);
    }
    modalMessage.innerHTML = '🌑<br>Всё исчезло...';
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.display = 'none';
        // Элементы не возвращаем (логика "навсегда")
    }, 4000);
}

function showMessage(text, effectCallback) {
    if (effectCallback) effectCallback();
    modalMessage.innerHTML = text;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 4000);
}

// ===== Обработчики кнопок (с отправкой названия) =====
document.getElementById('btn-forgive').addEventListener('click', () => {
    sendClick('ПРОСТИТЬ');
    showMessage('СПАСИБО!!! ВЫ САМАЯ ЛУЧШАЯ!', explosionEffect);
});

document.getElementById('btn-not-forgive').addEventListener('click', () => {
    sendClick('НЕ ПРОЩАТЬ');
    showMessage('ПОХОЖЕ МЫ С ВАМИ БОЛЬШЕ НЕ ДРУЗЬЯ :(', rainEffect);
});

document.getElementById('btn-angry-forgive').addEventListener('click', () => {
    sendClick('НЕМНОГО ПОЗЛЮСЬ И ПРОЩУ');
    showMessage('СПАСИБО! 😊😊😊', smileEffect);
});

document.getElementById('btn-ignore').addEventListener('click', () => {
    sendClick('ИГНОРИРОВАТЬ НАВСЕГДА');
    ashEffect();
});