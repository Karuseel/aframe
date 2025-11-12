class PaymentSystem {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Обработчики будут добавляться динамически в модальном окне
    }

    showPaymentPage() {
    const bookingData = bookingSystem.bookingData;
    
    // Проверяем необходимые данные
    if (!bookingData.selectedHouse || !bookingData.finalAmount) {
        this.showNotification('Ошибка: недостаточно данных для оплаты');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-content">
            <div class="payment-header">
                <div class="payment-icon">💳</div>
                <h2 class="payment-title">Оплата бронирования</h2>
                <p class="payment-subtitle">Завершите бронирование, переведя сумму на наши реквизиты</p>
            </div>
            
            <div class="payment-summary">
                <div class="summary-header">
                    <div class="summary-title">Детали бронирования</div>
                    <div class="summary-amount">${bookingData.finalAmount.toLocaleString()} ₽</div>
                </div>
                <div class="summary-items">
                    <div class="summary-item">
                        <span class="summary-label">Дом №${bookingData.selectedHouse.id}</span>
                        <span class="summary-value">${this.getHouseTypeName(bookingData.selectedHouse.type)}</span>
                    </div>
                    ${bookingData.guestsCount ? `
                    <div class="summary-item">
                        <span class="summary-label">Количество гостей</span>
                        <span class="summary-value">${bookingData.guestsCount} человек</span>
                    </div>
                    ` : ''}
                    <div class="summary-item">
                        <span class="summary-label">Время заезда/выезда</span>
                        <span class="summary-value">${bookingData.selectedHouse.checkIn} - ${bookingData.selectedHouse.checkOut}</span>
                    </div>
                    ${bookingData.checkInDate ? `
                    <div class="summary-item">
                        <span class="summary-label">Даты проживания</span>
                        <span class="summary-value">${this.formatDate(bookingData.checkInDate)} - ${this.formatDate(bookingData.checkOutDate)}</span>
                    </div>
                    ` : ''}
                    <div class="summary-item">
                        <span class="summary-label">Стоимость проживания</span>
                        <span class="summary-value">${bookingData.selectedHouse.price.toLocaleString()} ₽</span>
                    </div>
                    ${this.calculateGuestsExtra(bookingData) > 0 ? `
                    <div class="summary-item">
                        <span class="summary-label">Дополнительные гости</span>
                        <span class="summary-value">+${this.calculateGuestsExtra(bookingData).toLocaleString()} ₽</span>
                    </div>
                    ` : ''}
                    ${bookingData.services.chan.price > 0 ? `
                    <div class="summary-item">
                        <span class="summary-label">Деревянный чан (${bookingData.services.chan.hours}ч)</span>
                        <span class="summary-value">${bookingData.services.chan.price.toLocaleString()} ₽</span>
                    </div>
                    ` : ''}
                    ${bookingData.acoinsUsed > 0 ? `
                    <div class="summary-item">
                        <span class="summary-label">Скидка Acoin</span>
                        <span class="summary-value discount">-${bookingData.acoinsUsed.toLocaleString()} ₽</span>
                    </div>
                    ` : ''}
                    <div class="summary-item total">
                        <span class="summary-label">Итого к оплате</span>
                        <span class="summary-value total">${bookingData.finalAmount.toLocaleString()} ₽</span>
                    </div>
                </div>
            </div>

            <div class="contact-info">
                <div class="contact-header">
                    <div class="contact-icon">📞</div>
                    <div class="contact-title">Контактная информация</div>
                </div>
                <div class="contact-fields">
                    <div class="contact-field">
                        <label class="contact-label required">Ваш телефон</label>
                        <input type="tel" id="user-phone" class="contact-input" 
                               placeholder="+7 (999) 999-99-99" required
                               pattern="[0-9+]{10,15}">
                    </div>
                    <div class="contact-field">
                        <label class="contact-label">Email (необязательно)</label>
                        <input type="email" id="user-email" class="contact-input" 
                               placeholder="your.email@example.com">
                    </div>
                </div>
                <div class="contact-note">
                    * Телефон обязателен для связи по поводу бронирования и подтверждения заезда
                </div>
            </div>

            <div class="payment-instructions">
                <div class="instructions-header">
                    <div class="instructions-icon">🏦</div>
                    <div class="instructions-title">Реквизиты для перевода</div>
                </div>
                <div class="bank-details">
                    <div class="bank-detail">
                        <span class="bank-label">Банк</span>
                        <span class="bank-value">Тинькофф</span>
                    </div>
                    <div class="bank-detail">
                        <span class="bank-label">Номер карты</span>
                        <span class="bank-value code">5536 9138 1234 5678</span>
                    </div>
                    <div class="bank-detail">
                        <span class="bank-label">Получатель</span>
                        <span class="bank-value">Иванов И.И.</span>
                    </div>
                    <div class="bank-detail">
                        <span class="bank-label">Сумма к переводу</span>
                        <span class="bank-value amount">${bookingData.finalAmount.toLocaleString()} руб.</span>
                    </div>
                    <div class="bank-detail">
                        <span class="bank-label">Назначение платежа</span>
                        <span class="bank-value">Бронирование A-Frame Village</span>
                    </div>
                </div>
                <div class="instructions-note">
                    <div class="note-text">
                        💡 <strong>Важно:</strong> В комментарии к переводу укажите: 
                        "Бронирование Дом №${bookingData.selectedHouse.id}, ${this.formatDate(bookingData.checkInDate)} - ${this.formatDate(bookingData.checkOutDate)}"
                    </div>
                </div>
            </div>

            <div class="payment-actions">
                <button class="payment-btn payment-btn-cancel" id="cancel-payment">
                    ❌ Отмена
                </button>
                <button class="payment-btn payment-btn-confirm" id="confirm-payment">
                    ✅ Подтвердить перевод ${bookingData.finalAmount.toLocaleString()} ₽
                </button>
            </div>

            <div class="payment-security">
                <div class="security-text">
                    <span class="security-icon">🔒</span>
                    Безопасное соединение • Ваши данные защищены
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    this.bindPaymentEvents(modal);
    
    // Фокус на поле телефона
    setTimeout(() => {
        const phoneInput = modal.querySelector('#user-phone');
        if (phoneInput) phoneInput.focus();
    }, 400);
}

    bindPaymentEvents(modal) {
        // Отмена оплаты
        modal.querySelector('#cancel-payment').addEventListener('click', () => {
            modal.style.animation = 'paymentSlideIn 0.3s var(--ease-out) reverse';
            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            }, 300);
        });

        // Подтверждение оплаты
        modal.querySelector('#confirm-payment').addEventListener('click', () => {
            this.processPayment(modal);
        });

        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'paymentSlideIn 0.3s var(--ease-out) reverse';
                setTimeout(() => {
                    if (modal.parentNode) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            }
        });

        // Анимация при наведении на кнопку подтверждения
        const confirmBtn = modal.querySelector('#confirm-payment');
        confirmBtn.addEventListener('mouseenter', () => {
            confirmBtn.classList.add('payment-success');
        });
        
        confirmBtn.addEventListener('animationend', () => {
            confirmBtn.classList.remove('payment-success');
        });
    }

    calculateGuestsExtra(bookingData) {
        if (bookingData.selectedHouse.type === 'big' && bookingData.guestsCount > 8) {
            return (bookingData.guestsCount - 8) * 500;
        }
        return 0;
    }

    processPayment(modal) {
        const phone = modal.querySelector('#user-phone').value.trim();
        const email = modal.querySelector('#user-email').value.trim();

        // Валидация телефона
        if (!phone) {
            this.showNotification('Пожалуйста, укажите телефон для связи');
            return;
        }

        if (phone.length < 10) {
            this.showNotification('Пожалуйста, укажите корректный номер телефона');
            return;
        }

        const bookingData = bookingSystem.bookingData;

        // Создаем бронирование
        const booking = db.createBooking({
            userId: app.currentUser.id,
            houseId: bookingData.selectedHouse.id,
            houseName: bookingData.selectedHouse.name,
            checkIn: bookingData.checkInDate,
            checkOut: bookingData.checkOutDate,
            checkInTime: bookingData.selectedHouse.checkIn,
            checkOutTime: bookingData.selectedHouse.checkOut,
            services: bookingData.services,
            totalAmount: bookingData.totalAmount,
            finalAmount: bookingData.finalAmount,
            acoinsUsed: bookingData.acoinsUsed,
            contacts: { phone, email },
            status: 'pending'
        });

        // Списываем использованные Acoin
        if (bookingData.acoinsUsed > 0) {
            db.addAcoins(app.currentUser.id, -bookingData.acoinsUsed);
        }

        // Начисляем Acoin за бронирование (5% от суммы)
        const acoinsEarned = Math.floor(bookingData.finalAmount * 0.05);
        db.addAcoins(app.currentUser.id, acoinsEarned);

        // Анимация успешной оплаты
        const confirmBtn = modal.querySelector('#confirm-payment');
        confirmBtn.innerHTML = '✅ Оплата подтверждается...';
        confirmBtn.disabled = true;

        setTimeout(() => {
            // Закрываем модальное окно
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }

            // Показываем уведомление
            this.showNotification(
                `Бронирование создано! 🎉\n\n` +
                `Ожидайте подтверждения администратора.\n` +
                `Вам начислено ${acoinsEarned} Acoin.\n\n` +
                `Номер брони: #${booking.id}`
            );

            // Переходим на главную страницу
            app.showPage('home');

            // Уведомляем администратора
            this.notifyAdmin(booking);
        }, 2000);
    }

    notifyAdmin(booking) {
        const house = db.getHouseById(booking.houseId);
        const user = app.currentUser;
        
        const message = `
🎯 НОВОЕ БРОНИРОВАНИЕ #${booking.id}

🏠 Дом: ${house.name} (ID: ${house.id})
📅 Заезд: ${booking.checkIn} ${house.checkIn}
📅 Выезд: ${booking.checkOut} ${house.checkOut}
👤 Гость: ${user.name}
📞 Телефон: ${booking.contacts.phone}
📧 Email: ${booking.contacts.email || 'не указан'}
💰 Сумма: ${booking.totalAmount} руб.
🎁 Скидка Acoin: ${booking.acoinsUsed} руб.
💳 Итого: ${booking.finalAmount} руб.
⚡ Доп. услуги: Чан - ${booking.services.chan.hours} часов

Для подтверждения оплаты используйте команду:
/confirm_${booking.id}
        `;
        
        // В реальном приложении здесь будет отправка через Telegram Bot API
        console.log('📨 Уведомление администратору:', message);
        
        // Заглушка для демо
        setTimeout(() => {
            console.log('🤖 Сообщение отправлено администратору через Telegram Bot API');
        }, 1000);
    }

    getHouseTypeName(type) {
        const types = {
            'big': 'Большой дом',
            'pair': 'Парный дом',
            'family': 'Семейный дом'
        };
        return types[type] || 'Дом';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    showNotification(message) {
        app.showNotification(message);
    }
}

// Инициализация системы оплаты
document.addEventListener('DOMContentLoaded', function() {
    window.paymentSystem = new PaymentSystem();
});