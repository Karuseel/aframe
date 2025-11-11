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
            acoinsUsed: 0
        };
        this.bindEvents();
        this.initDateInputs();
    }

    bindEvents() {
        // Выбор типа дома
        document.querySelectorAll('.type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectHouseType(e.currentTarget.dataset.type);
            });
        });

        // Выбор времени (для больших домов)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.time-option')) {
                this.selectTimeOption(e.target.closest('.time-option'));
            }
        });

        // Кнопка продолжения к выбору домов
        document.getElementById('continue-to-houses').addEventListener('click', () => {
            this.proceedToHousesSelection();
        });

        // Кнопка продолжения к выбору дат
        document.getElementById('continue-to-dates').addEventListener('click', () => {
            this.showStep(3);
        });

        // Кнопка продолжения к детальной карточке дома
        document.getElementById('continue-to-house-detail').addEventListener('click', () => {
            this.proceedToHouseDetail();
        });

        // Кнопки назад
        document.getElementById('back-to-type').addEventListener('click', () => {
            this.showStep(1);
        });

        document.getElementById('back-to-houses').addEventListener('click', () => {
            this.showStep(2);
        });

        document.getElementById('back-to-dates').addEventListener('click', () => {
            this.showStep(3);
        });

        // Обработчики изменения дат
        const checkinDate = document.getElementById('checkin-date');
        const checkoutDate = document.getElementById('checkout-date');
        
        checkinDate.addEventListener('change', (e) => {
            this.bookingData.checkInDate = e.target.value;
            this.updateDatesValidation();
        });
        
        checkoutDate.addEventListener('change', (e) => {
            this.bookingData.checkOutDate = e.target.value;
            this.updateDatesValidation();
        });
    }

    initDateInputs() {
        // Устанавливаем минимальную дату (завтра)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        
        const checkinInput = document.getElementById('checkin-date');
        const checkoutInput = document.getElementById('checkout-date');
        
        checkinInput.min = minDate;
        checkoutInput.min = minDate;
    }

    selectHouseType(houseType) {
    // Сбрасываем предыдущий выбор
    document.querySelectorAll('.type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранный тип
    const selectedCard = document.querySelector(`.type-card[data-type="${houseType}"]`);
    selectedCard.classList.add('selected');
    
    this.bookingData.houseType = houseType;
    
    // Показываем/скрываем выбор времени для больших домов
    const timeSelection = document.getElementById('time-selection');
    if (houseType === 'big') {
        // Даем время для анимации
        setTimeout(() => {
            timeSelection.classList.add('show');
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
    
    this.updateContinueButton();
    
    // Прокручиваем к времени заезда если нужно
    if (houseType === 'big') {
        setTimeout(() => {
            timeSelection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

    selectTimeOption(timeOption) {
        if (this.bookingData.houseType !== 'big') return;
        
        // Сбрасываем предыдущий выбор времени
        document.querySelectorAll('.time-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Выделяем выбранное время
        timeOption.classList.add('selected');
        
        const [checkIn, checkOut] = timeOption.dataset.time.split('-');
        this.bookingData.checkInTime = checkIn;
        this.bookingData.checkOutTime = checkOut;
        this.bookingData.availableHouses = timeOption.dataset.houses.split(',').map(Number);
        
        this.updateContinueButton();
    }

    updateContinueButton() {
        const continueBtn = document.getElementById('continue-to-houses');
        let canContinue = false;
        
        if (this.bookingData.houseType) {
            if (this.bookingData.houseType === 'big') {
                // Для больших домов нужно выбрать и тип, и время
                canContinue = this.bookingData.checkInTime && this.bookingData.checkOutTime;
            } else {
                // Для парных и семейных достаточно выбора типа
                canContinue = true;
            }
        }
        
        continueBtn.disabled = !canContinue;
    }

    updateDatesValidation() {
        const continueBtn = document.getElementById('continue-to-house-detail');
        const checkinDate = this.bookingData.checkInDate;
        const checkoutDate = this.bookingData.checkOutDate;
        
        let canContinue = false;
        
        if (checkinDate && checkoutDate) {
            const checkin = new Date(checkinDate);
            const checkout = new Date(checkoutDate);
            canContinue = checkout > checkin;
        }
        
        continueBtn.disabled = !canContinue;
    }

    proceedToHousesSelection() {
        // Загружаем доступные дома
        this.loadAvailableHouses();
        
        // Обновляем subtitle
        const subtitle = document.getElementById('houses-subtitle');
        const typeNames = {
            'big': 'больших домов',
            'pair': 'парных домов', 
            'family': 'семейных домов'
        };
        
        subtitle.textContent = `Доступные варианты ${typeNames[this.bookingData.houseType]}`;
        
        // Переходим к шагу выбора дома
        this.showStep(2);
    }

    proceedToHouseDetail() {
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
        
        housesList.appendChild(houseCard);
    });
}

    selectHouse(house, houseElement) {
        // Сбрасываем предыдущий выбор
        document.querySelectorAll('.house-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Выделяем выбранный дом
        houseElement.classList.add('selected');
        this.bookingData.selectedHouse = house;
        
        // Активируем кнопку продолжения
        document.getElementById('continue-to-dates').disabled = false;
    }

    showStep(stepNumber) {
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
        stepElement.classList.add('active');
        this.currentStep = stepNumber;
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
            acoinsUsed: 0
        };
        
        // Сбрасываем UI
        document.querySelectorAll('.type-card, .time-option, .house-card').forEach(el => {
            el.classList.remove('selected');
        });
        
        const timeSelection = document.getElementById('time-selection');
        timeSelection.classList.remove('show');
        
        document.getElementById('continue-to-houses').disabled = true;
        document.getElementById('continue-to-dates').disabled = true;
        document.getElementById('continue-to-house-detail').disabled = true;
        
        // Сбрасываем даты
        document.getElementById('checkin-date').value = '';
        document.getElementById('checkout-date').value = '';
        
        this.showStep(1);
    }
}

// Инициализация системы бронирования
document.addEventListener('DOMContentLoaded', function() {
    window.bookingSystem = new BookingSystem();
});