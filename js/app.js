class AFrameApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.initTelegram();
        this.bindEvents();
        this.loadUserData();
        this.preventPullToRefresh();
    }

    initTelegram() {
        this.tg = window.Telegram.WebApp;
        if (this.tg) {
            this.tg.expand();
            this.tg.enableClosingConfirmation();
            this.tg.setHeaderColor('#1a1a1a');
            this.tg.setBackgroundColor('#0f0f0f');
        }
    }

    preventPullToRefresh() {
        // Предотвращаем pull-to-refresh на мобильных устройствах
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (touchY > touchStartY && scrollTop === 0) {
                e.preventDefault();
            }
        }, { passive: false });
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
        const startBookingBtn = document.getElementById('start-booking');
        if (startBookingBtn) {
            startBookingBtn.addEventListener('click', () => {
                this.showPage('booking');
            });
        }

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
                behavior: 'smooth'
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
    document.getElementById('current-level-display').textContent = this.getLevelName(this.currentUser.level);
    document.getElementById('acoins-count').textContent = this.currentUser.acoins.toLocaleString();
    document.getElementById('referrals-count').textContent = this.currentUser.referrals;
    document.getElementById('referral-link').value = `https://t.me/your_bot?start=${this.currentUser.referralCode}`;

    // Обновляем систему уровней через profileSystem
    if (window.profileSystem) {
        profileSystem.loadProfileData();
    }
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
        
        // Создаем кастомное уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: var(--surface);
            color: var(--text-primary);
            padding: 16px 24px;
            border-radius: 12px;
            border: 1px solid var(--border-light);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            font-weight: 600;
            transition: transform 0.4s var(--ease-out);
            backdrop-filter: blur(20px);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(-100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
    window.app = new AFrameApp();
    console.log('AFrameApp initialized');
    
    // Дополнительная инициализация скролла
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});