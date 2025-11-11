class ProfileSystem {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Копирование реферальной ссылки
        document.getElementById('copy-referral').addEventListener('click', () => {
            this.copyReferralLink();
        });

        // Отправка обратной связи
        document.getElementById('send-feedback').addEventListener('click', () => {
            this.sendFeedback();
        });
    }

    copyReferralLink() {
        const linkInput = document.getElementById('referral-link');
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);
        
        try {
            navigator.clipboard.writeText(linkInput.value);
            this.showNotification('Ссылка скопирована в буфер обмена!');
        } catch (err) {
            // Fallback для старых браузеров
            linkInput.select();
            document.execCommand('copy');
            this.showNotification('Ссылка скопирована!');
        }
    }

    sendFeedback() {
        const feedbackText = document.getElementById('feedback-text').value.trim();
        
        if (!feedbackText) {
            this.showNotification('Пожалуйста, введите ваш отзыв');
            return;
        }

        if (feedbackText.length < 10) {
            this.showNotification('Отзыв должен содержать минимум 10 символов');
            return;
        }

        db.addFeedback({
            userId: app.currentUser.id,
            text: feedbackText,
            type: 'suggestion'
        });

        document.getElementById('feedback-text').value = '';
        this.showNotification('Спасибо за ваш отзыв! Мы ценим ваше мнение.');
    }

    showNotification(message) {
        console.log('Notification:', message);
        alert(message);
    }
}

// Инициализация системы профиля
document.addEventListener('DOMContentLoaded', function() {
    window.profileSystem = new ProfileSystem();
});