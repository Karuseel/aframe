class BookingSystem {
    constructor() {
        this.currentStep = 1;
        this.bookingData = {
            houseType: null,
            checkInTime: null,
            checkOutTime: null,
            checkInDate: null,
            checkOutDate: null,
            availableHouses: [],
            selectedHouse: null,
            services: { chan: { hours: 0, price: 0 } },
            totalAmount: 0,
            finalAmount: 0,
            acoinsUsed: 0,
            guestsCount: 8
        };
        this.bindEvents();
        this.initDateInputs();
    }

    bindEvents() {
        console.log('Initializing booking system events...');

        // Выбор типа дома
        document.querySelectorAll('.type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Type card clicked:', card.dataset.type);
                this.selectHouseType(card.dataset.type);
            });
            
            card.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Type card touched:', card.dataset.type);
                this.selectHouseType(card.dataset.type);
            });
        });

        // Выбор времени (для больших домов)
        document.addEventListener('click', (e) => {
            const timeOption = e.target.closest('.time-option');
            if (timeOption) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Time option clicked');
                this.selectTimeOption(timeOption);
            }
        });

        document.addEventListener('touchend', (e) => {
            const timeOption = e.target.closest('.time-option');
            if (timeOption) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Time option touched');
                this.selectTimeOption(timeOption);
            }
        });

        // Кнопка продолжения к выбору домов
        const continueToHousesBtn = document.getElementById('continue-to-houses');
        if (continueToHousesBtn) {
            continueToHousesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Continue to houses clicked');
                this.proceedToHousesSelection();
            });
            
            continueToHousesBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Continue to houses touched');
                this.proceedToHousesSelection();
            });
        } else {
            console.error('Continue to houses button not found!');
        }

        // Кнопка продолжения к выбору дат
        const continueToDatesBtn = document.getElementById('continue-to-dates');
        if (continueToDatesBtn) {
            continueToDatesBtn.addEventListener('click', () => {
                this.showStep(3);
            });
        }

        // Кнопка продолжения к детальной карточке дома
        const continueToHouseDetailBtn = document.getElementById('continue-to-house-detail');
        if (continueToHouseDetailBtn) {
            continueToHouseDetailBtn.addEventListener('click', () => {
                this.proceedToHouseDetail();
            });
        }

        // Кнопки назад
        const backToTypeBtn = document.getElementById('back-to-type');
        if (backToTypeBtn) {
            backToTypeBtn.addEventListener('click', () => {
                this.showStep(1);
            });
        }

        const backToHousesBtn = document.getElementById('back-to-houses');
        if (backToHousesBtn) {
            backToHousesBtn.addEventListener('click', () => {
                this.showStep(2);
            });
        }

        const backToDatesBtn = document.getElementById('back-to-dates');
        if (backToDatesBtn) {
            backToDatesBtn.addEventListener('click', () => {
                this.showStep(3);
            });
        }

        // Обработчики изменения дат
        const checkinDate = document.getElementById('checkin-date');
        const checkoutDate = document.getElementById('checkout-date');
        
        if (checkinDate) {
            checkinDate.addEventListener('change', (e) => {
                this.bookingData.checkInDate = e.target.value;
                this.updateDatesValidation();
            });
        }
        
        if (checkoutDate) {
            checkoutDate.addEventListener('change', (e) => {
                this.bookingData.checkOutDate = e.target.value;
                this.updateDatesValidation();
            });
        }

        console.log('All booking events bound successfully');
    }

    initDateInputs() {
        // Устанавливаем минимальную дату (завтра)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        
        const checkinInput = document.getElementById('checkin-date');
        const checkoutInput = document.getElementById('checkout-date');
        
        if (checkinInput) checkinInput.min = minDate;
        if (checkoutInput) checkoutInput.min = minDate;
    }

    selectHouseType(houseType) {
        console.log('Selecting house type:', houseType);
        
        // Сбрасываем предыдущий выбор
        document.querySelectorAll('.type-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Выделяем выбранный тип
        const selectedCard = document.querySelector(`.type-card[data-type="${houseType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            
            // Добавляем визуальную обратную связь для мобильных
            selectedCard.style.transform = 'scale(0.98)';
            setTimeout(() => {
                selectedCard.style.transform = '';
            }, 150);
        }
        
        this.bookingData.houseType = houseType;
        
        // Показываем/скрываем выбор времени для больших домов
        const timeSelection = document.getElementById('time-selection');
        if (timeSelection) {
            if (houseType === 'big') {
                setTimeout(() => {
                    timeSelection.classList.add('show');
                    // Прокручиваем к времени заезда
                    setTimeout(() => {
                        timeSelection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 200);
                }, 100);
                this.bookingData.checkInTime = null;
                this.bookingData.checkOutTime = null;
                this.bookingData.availableHouses = [];
            } else {
                timeSelection.classList.remove('show');
                // Для парных и семейных устанавливаем время по умолчанию
                this.bookingData.checkInTime = '12:00';
                this.bookingData.checkOutTime = '10:00';
                // Устанавливаем правильные ID домов для каждого типа
                if (houseType === 'pair') {
                    this.bookingData.availableHouses = [7, 8];
                } else if (houseType === 'family') {
                    this.bookingData.availableHouses = [9, 10];
                }
            }
        }
        
        this.updateContinueButton();
    }

    selectTimeOption(timeOption) {
        console.log('Selecting time option');
        
        if (this.bookingData.houseType !== 'big') return;
        
        // Сбрасываем предыдущий выбор времени
        document.querySelectorAll('.time-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Выделяем выбранное время
        timeOption.classList.add('selected');
        
        // Визуальная обратная связь для мобильных
        timeOption.style.transform = 'scale(0.98)';
        setTimeout(() => {
            timeOption.style.transform = '';
        }, 150);
        
        const [checkIn, checkOut] = timeOption.dataset.time.split('-');
        this.bookingData.checkInTime = checkIn;
        this.bookingData.checkOutTime = checkOut;
        this.bookingData.availableHouses = timeOption.dataset.houses.split(',').map(Number);
        
        this.updateContinueButton();
    }

    updateContinueButton() {
        const continueBtn = document.getElementById('continue-to-houses');
        if (!continueBtn) {
            console.error('Continue button not found!');
            return;
        }
        
        let canContinue = false;
        
        if (this.bookingData.houseType) {
            if (this.bookingData.houseType === 'big') {
                // Для больших домов нужно выбрать и тип, и время
                canContinue = this.bookingData.checkInTime && this.bookingData.checkOutTime;
                console.log('Big house selection - can continue:', canContinue, 'Time selected:', this.bookingData.checkInTime);
            } else {
                // Для парных и семейных достаточно выбора типа
                canContinue = true;
                console.log('Other house type - can continue:', canContinue);
            }
        }
        
        continueBtn.disabled = !canContinue;
        
        if (canContinue) {
            continueBtn.style.opacity = '1';
            continueBtn.style.cursor = 'pointer';
            continueBtn.style.transform = 'translateY(0)';
        } else {
            continueBtn.style.opacity = '0.6';
            continueBtn.style.cursor = 'not-allowed';
            continueBtn.style.transform = 'translateY(2px)';
        }
        
        console.log('Continue button updated - disabled:', continueBtn.disabled);
    }

    updateDatesValidation() {
        const continueBtn = document.getElementById('continue-to-house-detail');
        if (!continueBtn) return;
        
        const checkinDate = this.bookingData.checkInDate;
        const checkoutDate = this.bookingData.checkOutDate;
        
        let canContinue = false;
        
        if (checkinDate && checkoutDate) {
            const checkin = new Date(checkinDate);
            const checkout = new Date(checkoutDate);
            canContinue = checkout > checkin;
        }
        
        continueBtn.disabled = !canContinue;
        
        if (canContinue) {
            continueBtn.style.opacity = '1';
            continueBtn.style.cursor = 'pointer';
        } else {
            continueBtn.style.opacity = '0.6';
            continueBtn.style.cursor = 'not-allowed';
        }
    }

    proceedToHousesSelection() {
        console.log('Proceeding to houses selection');
        
        // Проверяем, можно ли продолжить
        if (this.bookingData.houseType === 'big' && (!this.bookingData.checkInTime || !this.bookingData.checkOutTime)) {
            this.showNotification('Пожалуйста, выберите время заезда');
            return;
        }
        
        if (!this.bookingData.houseType) {
            this.showNotification('Пожалуйста, выберите тип дома');
            return;
        }
        
        // Загружаем доступные дома
        this.loadAvailableHouses();
        
        // Обновляем subtitle
        const subtitle = document.getElementById('houses-subtitle');
        const typeNames = {
            'big': 'больших домов',
            'pair': 'парных домов', 
            'family': 'семейных домов'
        };
        
        if (subtitle) {
            subtitle.textContent = `Доступные варианты ${typeNames[this.bookingData.houseType]}`;
        }
        
        // Переходим к шагу выбора дома
        this.showStep(2);
        
        // Прокручиваем вверх
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    }

    proceedToHouseDetail() {
        console.log('Proceeding to house detail');
        
        // Проверяем, что дом выбран
        if (!this.bookingData.selectedHouse) {
            this.showNotification('Пожалуйста, выберите дом');
            return;
        }
        
        // Переходим к детальной карточке дома
        if (window.houseDetail) {
            houseDetail.showHouseDetail(this.bookingData.selectedHouse);
        }
    }

    loadAvailableHouses() {
        const housesList = document.getElementById('houses-list');
        if (!housesList) {
            console.error('Houses list container not found!');
            return;
        }
        
        housesList.innerHTML = '';
        
        let houses = [];
        
        if (this.bookingData.houseType === 'big') {
            // Для больших домов фильтруем по доступным номерам
            const allHouses = db.getHousesByType('big');
            houses = allHouses.filter(house => 
                this.bookingData.availableHouses.includes(house.id)
            );
        } else {
            // Для парных и семейных показываем все дома этого типа
            houses = db.getHousesByType(this.bookingData.houseType);
        }
        
        if (houses.length === 0) {
            housesList.innerHTML = '<p style="text-align: center; color: var(--gray-600); padding: 40px;">Нет доступных домов по вашему выбору</p>';
            return;
        }
        
        houses.forEach(house => {
            const houseCard = document.createElement('div');
            houseCard.className = 'house-card';
            houseCard.innerHTML = `
                <div class="house-image">
                    ${house.images && house.images.length > 0 ? 
                        `<img src="${house.images[0]}" alt="Дом №${house.id}" 
                             onerror="this.style.display='none'; this.parentNode.innerHTML='${this.getHouseIcon(house.type)}';">` :
                        `<div class="image-placeholder">${this.getHouseIcon(house.type)}</div>`
                    }
                </div>
                <div class="house-content">
                    <h3 class="house-title">Дом №${house.id}</h3>
                    <p class="house-description">${house.description}</p>
                    
                    <div class="house-features">
                        <span class="house-feature">🛏️ ${house.beds}</span>
                        <span class="house-feature">📏 ${house.size}</span>
                        <span class="house-feature">👥 ${house.capacity} чел</span>
                        <span class="house-feature">🕛 ${house.checkIn} - ${house.checkOut}</span>
                    </div>
                    
                    <div class="amenities-grid-small">
                        ${house.amenities.slice(0, 4).map(amenity => 
                            `<div class="amenity-item">${amenity}</div>`
                        ).join('')}
                    </div>
                    
                    <div class="price-section">
                        <div class="house-capacity">
                            ${this.getCapacityIcon(house.type)} 
                            ${this.getCapacityText(house.type, house.capacity)}
                        </div>
                        <div class="house-price">${house.price.toLocaleString()} ₽</div>
                    </div>
                </div>
            `;
            
            houseCard.addEventListener('click', () => {
                this.selectHouse(house, houseCard);
            });
            
            houseCard.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.selectHouse(house, houseCard);
            });
            
            housesList.appendChild(houseCard);
        });
        
        console.log(`Loaded ${houses.length} houses`);
    }

    selectHouse(house, houseElement) {
        console.log('Selecting house:', house.id);
        
        // Сбрасываем предыдущий выбор
        document.querySelectorAll('.house-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Выделяем выбранный дом
        houseElement.classList.add('selected');
        this.bookingData.selectedHouse = house;
        
        // Активируем кнопку продолжения
        const continueBtn = document.getElementById('continue-to-dates');
        if (continueBtn) {
            continueBtn.disabled = false;
            continueBtn.style.opacity = '1';
            continueBtn.style.cursor = 'pointer';
        }
    }

    showStep(stepNumber) {
        console.log('Showing step:', stepNumber);
        
        document.querySelectorAll('.booking-step').forEach(step => {
            step.classList.remove('active');
        });
        
        const stepNames = { 
            1: 'type', 
            2: 'houses', 
            3: 'dates', 
            4: 'house-detail' 
        };
        
        const stepElement = document.getElementById(`step-${stepNames[stepNumber]}`);
        if (stepElement) {
            stepElement.classList.add('active');
            this.currentStep = stepNumber;
            
            // Прокручиваем вверх при смене шага
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        } else {
            console.error(`Step element not found: step-${stepNames[stepNumber]}`);
        }
    }

    showNotification(message) {
        console.log('Notification:', message);
        alert(message);
    }

    getHouseIcon(type) {
        const icons = {
            'big': '🏠',
            'pair': '💑', 
            'family': '👨‍👩‍👧‍👦'
        };
        return icons[type] || '🏠';
    }

    getCapacityIcon(type) {
        const icons = {
            'big': '👥',
            'pair': '💞',
            'family': '👪'
        };
        return icons[type] || '👥';
    }

    getCapacityText(type, capacity) {
        const texts = {
            'big': `До ${capacity} гостей`,
            'pair': `Для ${capacity} гостей`,
            'family': `До ${capacity} гостей`
        };
        return texts[type] || `До ${capacity} гостей`;
    }

    resetBooking() {
        console.log('Resetting booking data');
        
        this.bookingData = {
            houseType: null,
            checkInTime: null,
            checkOutTime: null,
            checkInDate: null,
            checkOutDate: null,
            availableHouses: [],
            selectedHouse: null,
            services: { chan: { hours: 0, price: 0 } },
            totalAmount: 0,
            finalAmount: 0,
            acoinsUsed: 0,
            guestsCount: 8
        };
        
        // Сбрасываем UI
        document.querySelectorAll('.type-card, .time-option, .house-card').forEach(el => {
            el.classList.remove('selected');
        });
        
        const timeSelection = document.getElementById('time-selection');
        if (timeSelection) timeSelection.classList.remove('show');
        
        const continueToHousesBtn = document.getElementById('continue-to-houses');
        if (continueToHousesBtn) continueToHousesBtn.disabled = true;
        
        const continueToDatesBtn = document.getElementById('continue-to-dates');
        if (continueToDatesBtn) continueToDatesBtn.disabled = true;
        
        const continueToHouseDetailBtn = document.getElementById('continue-to-house-detail');
        if (continueToHouseDetailBtn) continueToHouseDetailBtn.disabled = true;
        
        // Сбрасываем даты
        const checkinInput = document.getElementById('checkin-date');
        const checkoutInput = document.getElementById('checkout-date');
        if (checkinInput) checkinInput.value = '';
        if (checkoutInput) checkoutInput.value = '';
        
        this.showStep(1);
    }
}

// Инициализация системы бронирования
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing booking system');
    window.bookingSystem = new BookingSystem();
    
    // Fallback инициализация для мобильных
    setTimeout(() => {
        console.log('Running mobile fallback check');
        const continueBtn = document.getElementById('continue-to-houses');
        if (continueBtn && !continueBtn._eventsBound) {
            console.log('Binding fallback events for continue button');
            
            continueBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Fallback: Continue button clicked');
                if (window.bookingSystem) {
                    window.bookingSystem.proceedToHousesSelection();
                }
            });
            
            continueBtn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Fallback: Continue button touched');
                if (window.bookingSystem) {
                    window.bookingSystem.proceedToHousesSelection();
                }
            });
            
            continueBtn._eventsBound = true;
        }
    }, 1000);
});