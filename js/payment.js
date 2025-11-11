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
            <h3>💳 Оплата бронирования</h3>
            
            <div class="payment-summary">
                <div class="summary-item">
                    <span>Дом:</span>
                    <span><strong>Дом №${bookingData.selectedHouse.id}</strong></span>
                </div>
                <div class="summary-item">
                    <span>Тип:</span>
                    <span>${this.getHouseTypeName(bookingData.selectedHouse.type)}</span>
                </div>
                ${bookingData.guestsCount ? `
                <div class="summary-item">
                    <span>Количество гостей:</span>
                    <span>${bookingData.guestsCount} человек</span>
                </div>
                ` : ''}
                <div class="summary-item">
                    <span>Время заезда/выезда:</span>
                    <span>${bookingData.selectedHouse.checkIn} - ${bookingData.selectedHouse.checkOut}</span>
                </div>
                ${bookingData.checkInDate ? `
                <div class="summary-item">
                    <span>Даты проживания:</span>
                    <span>${this.formatDate(bookingData.checkInDate)} - ${this.formatDate(bookingData.checkOutDate)}</span>
                </div>
                ` : ''}
                <div class="summary-item">
                    <span>Стоимость проживания:</span>
                    <span>${bookingData.selectedHouse.price.toLocaleString()} ₽</span>
                </div>
                ${this.calculateGuestsExtra(bookingData) > 0 ? `
                <div class="summary-item">
                    <span>Дополнительные гости:</span>
                    <span>+${this.calculateGuestsExtra(bookingData).toLocaleString()} ₽</span>
                </div>
                ` : ''}
                ${bookingData.services.chan.price > 0 ? `
                <div class="summary-item">
                    <span>Деревянный чан (${bookingData.services.chan.hours}ч):</span>
                    <span>${bookingData.services.chan.price.toLocaleString()} ₽</span>
                </div>
                ` : ''}
                ${bookingData.acoinsUsed > 0 ? `
                <div class="summary-item">
                    <span>Скидка Acoin:</span>
                    <span style="color: #27ae60;">-${bookingData.acoinsUsed.toLocaleString()} ₽</span>
                </div>
                ` : ''}
                <div class="summary-item total">
                    <span>Итого к оплате:</span>
                    <span style="color: var(--gray-900); font-size: 1.4rem; font-weight: 800;">
                        ${bookingData.finalAmount.toLocaleString()} ₽
                    </span>
                </div>
            </div>

            <div class="contact-info">
                <h4>📞 Контактная информация</h4>
                <input type="tel" id="user-phone" placeholder="Ваш телефон *" required
                       pattern="[0-9+]{10,15}" title="Введите корректный номер телефона">
                <input type="email" id="user-email" placeholder="Email (необязательно)">
                <small style="color: var(--gray-600); font-size: 0.85rem; display: block; margin-top: 8px; line-height: 1.4;">
                    * Телефон обязателен для связи по поводу бронирования
                </small>
            </div>

            <div class="payment-instructions">
                <h4>🏦 Реквизиты для перевода</h4>
                <div class="bank-details">
                    <p><strong>Банк:</strong> Тинькофф</p>
                    <p><strong>Номер карты:</strong> <code>5536 9138 1234 5678</code></p>
                    <p><strong>Получатель:</strong> Иванов И.И.</p>
                    <p><strong>Сумма к переводу:</strong> <strong style="color: var(--gray-900); font-size: 1.1rem;">${bookingData.finalAmount.toLocaleString()} руб.</strong></p>
                    <p><strong>Назначение платежа:</strong> Бронирование A-Frame Village</p>
                    <p style="font-size: 0.9rem; color: var(--gray-600); margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--gray-300); line-height: 1.5;">
                        💡 <em>В комментарии к переводу укажите: "Бронирование Дом №${bookingData.selectedHouse.id}, ${this.formatDate(bookingData.checkInDate)} - ${this.formatDate(bookingData.checkOutDate)}"</em>
                    </p>
                </div>
            </div>

            <div class="payment-actions">
                <button class="btn btn-secondary" id="cancel-payment">
                    ❌ Отмена
                </button>
                <button class="btn btn-primary" id="confirm-payment">
                    ✅ Подтвердить перевод ${bookingData.finalAmount.toLocaleString()} ₽
                </button>
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
            document.body.removeChild(modal);
        });

        // Подтверждение оплаты
        modal.querySelector('#confirm-payment').addEventListener('click', () => {
            this.processPayment(modal);
        });

        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
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

        // Закрываем модальное окно
        document.body.removeChild(modal);

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
        console.log('Notification:', message);
        alert(message);
    }
}

// Инициализация системы оплаты
document.addEventListener('DOMContentLoaded', function() {
    window.paymentSystem = new PaymentSystem();
});