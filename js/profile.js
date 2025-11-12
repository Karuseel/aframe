class ProfileSystem {
    constructor() {
        this.levels = {
            bronze: { 
                name: 'Бронза', 
                icon: '🥉', 
                minAcoins: 0, 
                maxAcoins: 999,
                benefits: [
                    { icon: '🎁', name: 'Базовые бонусы', description: 'Начисление 5% Acoin от бронирований' },
                    { icon: '📧', name: 'Email поддержка', description: 'Приоритетная обработка запросов' }
                ]
            },
            silver: { 
                name: 'Серебро', 
                icon: '🥈', 
                minAcoins: 1000, 
                maxAcoins: 4999,
                benefits: [
                    { icon: '🎁', name: 'Увеличенные бонусы', description: 'Начисление 7% Acoin от бронирований' },
                    { icon: '⚡', name: 'Приоритетное бронирование', description: 'Ранний доступ к новым домам' },
                    { icon: '🎯', name: 'Персональные предложения', description: 'Специальные акции и скидки' }
                ]
            },
            gold: { 
                name: 'Золото', 
                icon: '🥇', 
                minAcoins: 5000, 
                maxAcoins: 9999,
                benefits: [
                    { icon: '🎁', name: 'Премиум бонусы', description: 'Начисление 10% Acoin от бронирований' },
                    { icon: '⭐', name: 'VIP обслуживание', description: 'Персональный менеджер' },
                    { icon: '🏠', name: 'Бесплатные апгрейды', description: 'Автоматическое улучшение категории' },
                    { icon: '🎫', name: 'Пригласительные билеты', description: 'Доступ к закрытым мероприятиям' }
                ]
            },
            diamond: { 
                name: 'Бриллиант', 
                icon: '💎', 
                minAcoins: 10000, 
                maxAcoins: Infinity,
                benefits: [
                    { icon: '🎁', name: 'Эксклюзивные бонусы', description: 'Начисление 15% Acoin от бронирований' },
                    { icon: '👑', name: 'Эксклюзивный доступ', description: 'Доступ к премиум домам' },
                    { icon: '🚗', name: 'Трансфер включен', description: 'Бесплатный трансфер от/до аэропорта' },
                    { icon: '🍾', name: 'Welcome набор', description: 'Премиальный набор при заезде' },
                    { icon: '💝', name: 'Персональные подарки', description: 'Эксклюзивные сувениры и подарки' }
                ]
            }
        };
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

        // Обработчики для карточек уровней
        document.addEventListener('click', (e) => {
            if (e.target.closest('.level-card')) {
                const levelCard = e.target.closest('.level-card');
                const level = levelCard.dataset.level;
                this.showLevelDetails(level);
            }
        });
    }

    loadProfileData() {
        if (!app.currentUser) return;

        document.getElementById('user-name').textContent = app.currentUser.name;
        document.getElementById('user-level').textContent = this.getLevelName(app.currentUser.level);
        document.getElementById('acoins-count').textContent = app.currentUser.acoins.toLocaleString();
        document.getElementById('referrals-count').textContent = app.currentUser.referrals;
        document.getElementById('referral-link').value = `https://t.me/your_bot?start=${app.currentUser.referralCode}`;

        // Обновляем систему уровней
        this.updateLevelSystem();
    }

    updateLevelSystem() {
        const user = app.currentUser;
        const currentLevel = this.levels[user.level];
        const nextLevel = this.getNextLevel(user.level);
        
        // Прогресс до следующего уровня
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            const progress = this.calculateLevelProgress(user.acoins, currentLevel, nextLevel);
            
            progressContainer.innerHTML = `
                <div class="progress-info">
                    <div class="progress-label">Прогресс до ${nextLevel?.name || 'максимума'}</div>
                    <div class="progress-stats">${user.acoins.toLocaleString()} / ${nextLevel ? nextLevel.minAcoins.toLocaleString() : '∞'} Acoin</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            `;
        }

        // Обновляем карточки уровней
        this.updateLevelCards();

        // Показываем преимущества текущего уровня
        this.showCurrentLevelBenefits();
    }

    calculateLevelProgress(acoins, currentLevel, nextLevel) {
        if (!nextLevel) return 100;
        
        const range = nextLevel.minAcoins - currentLevel.minAcoins;
        const progress = acoins - currentLevel.minAcoins;
        return Math.min(100, Math.max(0, (progress / range) * 100));
    }

    getNextLevel(currentLevel) {
        const levelOrder = ['bronze', 'silver', 'gold', 'diamond'];
        const currentIndex = levelOrder.indexOf(currentLevel);
        
        if (currentIndex < levelOrder.length - 1) {
            return this.levels[levelOrder[currentIndex + 1]];
        }
        return null;
    }

    updateLevelCards() {
        const levelsGrid = document.querySelector('.levels-grid');
        if (!levelsGrid) return;

        const user = app.currentUser;
        levelsGrid.innerHTML = '';

        Object.entries(this.levels).forEach(([levelKey, levelData], index) => {
            const isActive = levelKey === user.level;
            const isLocked = user.acoins < levelData.minAcoins;
            const isUnlocked = user.acoins >= levelData.minAcoins;
            
            const levelCard = document.createElement('div');
            levelCard.className = `level-card ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`;
            levelCard.dataset.level = levelKey;
            
            levelCard.innerHTML = `
                ${isActive ? '<div class="level-badge">✓</div>' : ''}
                <div class="level-icon">${levelData.icon}</div>
                <div class="level-name">${levelData.name}</div>
                <div class="level-requirement">
                    ${levelData.minAcoins === 0 ? 'Старт' : `от ${levelData.minAcoins.toLocaleString()} Acoin`}
                </div>
            `;
            
            levelsGrid.appendChild(levelCard);
        });
    }

    showCurrentLevelBenefits() {
        const benefitsContainer = document.querySelector('.benefits-list');
        if (!benefitsContainer) return;

        const currentLevel = this.levels[app.currentUser.level];
        benefitsContainer.innerHTML = '';

        currentLevel.benefits.forEach(benefit => {
            const benefitItem = document.createElement('div');
            benefitItem.className = 'benefit-item';
            benefitItem.innerHTML = `
                <div class="benefit-icon">${benefit.icon}</div>
                <div class="benefit-content">
                    <div class="benefit-name">${benefit.name}</div>
                    <div class="benefit-description">${benefit.description}</div>
                </div>
            `;
            benefitsContainer.appendChild(benefitItem);
        });
    }

    showLevelDetails(level) {
        const levelData = this.levels[level];
        const user = app.currentUser;
        const isUnlocked = user.acoins >= levelData.minAcoins;
        
        // Создаем модальное окно с деталями уровня
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="payment-content">
                <h3>${levelData.icon} Уровень ${levelData.name}</h3>
                
                <div class="level-details">
                    <div class="level-status ${isUnlocked ? 'unlocked' : 'locked'}">
                        ${isUnlocked ? '✅ Доступен' : '🔒 Требуется больше Acoin'}
                    </div>
                    
                    <div class="requirement-info">
                        <strong>Требование:</strong> ${levelData.minAcoins.toLocaleString()} Acoin
                    </div>
                    
                    <div class="user-progress">
                        <strong>Ваш прогресс:</strong> ${user.acoins.toLocaleString()} / ${levelData.minAcoins.toLocaleString()} Acoin
                    </div>
                    
                    <div class="benefits-section">
                        <h4>Преимущества уровня:</h4>
                        <div class="benefits-list">
                            ${levelData.benefits.map(benefit => `
                                <div class="benefit-item">
                                    <div class="benefit-icon">${benefit.icon}</div>
                                    <div class="benefit-content">
                                        <div class="benefit-name">${benefit.name}</div>
                                        <div class="benefit-description">${benefit.description}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="payment-actions">
                    <button class="btn btn-primary" id="close-level-details">
                        Понятно
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Обработчик закрытия
        modal.querySelector('#close-level-details').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
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

    copyReferralLink() {
        const linkInput = document.getElementById('referral-link');
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);
        
        try {
            navigator.clipboard.writeText(linkInput.value);
            app.showNotification('Ссылка скопирована в буфер обмена!');
        } catch (err) {
            // Fallback для старых браузеров
            linkInput.select();
            document.execCommand('copy');
            app.showNotification('Ссылка скопирована!');
        }
    }

    sendFeedback() {
        const feedbackText = document.getElementById('feedback-text').value.trim();
        
        if (!feedbackText) {
            app.showNotification('Пожалуйста, введите ваш отзыв');
            return;
        }

        if (feedbackText.length < 10) {
            app.showNotification('Отзыв должен содержать минимум 10 символов');
            return;
        }

        db.addFeedback({
            userId: app.currentUser.id,
            text: feedbackText,
            type: 'suggestion'
        });

        document.getElementById('feedback-text').value = '';
        app.showNotification('Спасибо за ваш отзыв! Мы ценим ваше мнение.');
    }
}

// Инициализация системы профиля
document.addEventListener('DOMContentLoaded', function() {
    window.profileSystem = new ProfileSystem();
});