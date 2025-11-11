class AFrameApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.initTelegram();
        this.bindEvents();
        this.loadUserData();
    }

    initTelegram() {
        this.tg = window.Telegram.WebApp;
        if (this.tg) {
            this.tg.expand();
            this.tg.enableClosingConfirmation();
            this.tg.setHeaderColor('#2c5530');
            this.tg.setBackgroundColor('#f0f0f0');
        }
    }

    bindEvents() {
        // Навигация
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn')) {
                const btn = e.target.closest('.nav-btn');
                const page = btn.dataset.page;
                this.showPage(page);
            }
        });

        // Главная страница - только кнопка бронирования
        document.getElementById('start-booking').addEventListener('click', () => {
            this.showPage('booking');
        });

        console.log('All events bound successfully');
    }

    showPage(pageName) {
        // Скрываем все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Убираем активный класс у всех кнопок навигации
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Показываем нужную страницу
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Активируем соответствующую кнопку навигации
        const targetNavBtn = document.querySelector(`.nav-btn[data-page="${pageName}"]`);
        if (targetNavBtn) {
            targetNavBtn.classList.add('active');
        }

        // Ждем следующего цикла отрисовки и прокручиваем вверх
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
            
            // Дополнительная прокрутка для надежности
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 10);

        // Загружаем данные для страницы
        if (pageName === 'profile') {
            this.loadProfileData();
        } else if (pageName === 'bookings') {
            if (window.bookingsSystem) {
                bookingsSystem.loadUserBookings();
            }
        }
        
        if (pageName === 'booking') {
            if (window.bookingSystem) {
                bookingSystem.resetBooking();
            }
        }
    }

    loadUserData() {
        // В реальном приложении здесь будет ID пользователя из Telegram
        const userId = this.tg?.initDataUnsafe?.user?.id || 'demo_user';
        this.currentUser = db.getUser(userId);
        
        // Если есть данные из Telegram, обновляем имя
        if (this.tg?.initDataUnsafe?.user) {
            const tgUser = this.tg.initDataUnsafe.user;
            const userName = tgUser.first_name || tgUser.username || `Гость${userId.slice(-4)}`;
            db.updateUser(userId, { name: userName });
            this.currentUser.name = userName;
        }
    }

    loadProfileData() {
        if (!this.currentUser) return;

        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-level').textContent = this.getLevelName(this.currentUser.level);
        document.getElementById('acoins-count').textContent = this.currentUser.acoins;
        document.getElementById('referrals-count').textContent = this.currentUser.referrals;
        document.getElementById('referral-link').value = `https://t.me/your_bot?start=${this.currentUser.referralCode}`;

        // Обновляем уровни
        document.querySelectorAll('.level-badge').forEach(badge => {
            badge.classList.remove('active');
            if (badge.dataset.level === this.currentUser.level) {
                badge.classList.add('active');
            }
        });
    }

    getLevelName(level) {
        const levels = {
            bronze: 'Бронза',
            silver: 'Серебро', 
            gold: 'Золото',
            diamond: 'Бриллиант'
        };
        return levels[level] || 'Бронза';
    }

    showNotification(message) {
        console.log('Notification:', message);
        alert(message);
    }
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
    window.app = new AFrameApp();
    console.log('AFrameApp initialized');
    
    // Дополнительная инициализация скролла
    window.scrollTo(0, 0);
});