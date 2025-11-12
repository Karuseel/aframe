class HouseDetail {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.selectedServices = {
            chan: { hours: 0, price: 0 }
        };
        this.acoinsUsed = 0;
        this.guestsCount = 8;
        this.maxGuests = 15;
        this.bindEvents();
    }

    bindEvents() {
        // Навигация галереи
        document.addEventListener('click', (e) => {
            if (e.target.closest('#gallery-prev')) {
                this.prevSlide();
            }
            if (e.target.closest('#gallery-next')) {
                this.nextSlide();
            }
            if (e.target.closest('.house-gallery-dot')) {
                this.goToSlide(parseInt(e.target.dataset.slide));
            }
        });

        // Выбор услуги чана
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-variant-main')) {
                this.selectServiceVariant(e.target.closest('.service-variant-main'));
            }
        });

        // Управление количеством гостей
        document.addEventListener('click', (e) => {
            if (e.target.closest('#guests-decrease-main')) {
                this.changeGuests(-1);
            }
            if (e.target.closest('#guests-increase-main')) {
                this.changeGuests(1);
            }
        });

        // Использование Acoin
        document.addEventListener('change', (e) => {
            if (e.target.matches('#use-acoins-main')) {
                const acoinsInput = document.getElementById('acoins-amount-main');
                if (acoinsInput) {
                    acoinsInput.disabled = !e.target.checked;
                    if (!e.target.checked) {
                        acoinsInput.value = '';
                        this.acoinsUsed = 0;
                    }
                    this.updatePrices();
                }
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.matches('#acoins-amount-main')) {
                const maxAcoins = Math.min(app.currentUser.acoins, this.calculateTotalPrice());
                this.acoinsUsed = Math.min(parseInt(e.target.value) || 0, maxAcoins);
                e.target.value = this.acoinsUsed;
                this.updatePrices();
            }
        });

        // Кнопка бронирования
        document.addEventListener('click', (e) => {
            if (e.target.closest('#book-now-main')) {
                this.proceedToPayment();
            }
        });

        // Кнопка закрытия
        document.addEventListener('click', (e) => {
            if (e.target.closest('#booking-close')) {
                this.closeBooking();
            }
        });

        // Кнопка "Забронировать" в карточке дома
        document.addEventListener('click', (e) => {
            if (e.target.closest('#start-booking-main')) {
                this.showBookingPage();
            }
        });
    }

    // ДОБАВЛЕННЫЕ МЕТОДЫ ДЛЯ ИКОНОК И ТИПОВ ДОМОВ
    getHouseIcon(type) {
        const icons = {
            'big': '🏠',
            'pair': '💑', 
            'family': '👨‍👩‍👧‍👦'
        };
        return icons[type] || '🏠';
    }

    getHouseTypeBadge(type) {
        const badges = {
            'big': 'Большой',
            'pair': 'Для пар', 
            'family': 'Семейный'
        };
        return badges[type] || 'Дом';
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

    // ИСПРАВЛЕННЫЙ МЕТОД - корректно показывает полноэкранную карточку
    showFullScreenHouse(house) {
        this.currentHouse = house;
        this.currentSlide = 0;
        this.selectedServices = { chan: { hours: 0, price: 0 } };
        this.acoinsUsed = 0;
        this.guestsCount = 8;
        
        // Создаем полноэкранный контейнер
        const container = document.createElement('div');
        container.className = 'house-full-card active';
        container.innerHTML = this.getHouseFullScreenHTML(house);
        
        // Заменяем текущий контент страницы бронирования
        const bookingPage = document.getElementById('booking-page');
        if (bookingPage) {
            bookingPage.innerHTML = '';
            bookingPage.appendChild(container);
            
            // Обновляем данные после добавления в DOM
            setTimeout(() => {
                this.updateHouseInfo(house);
                this.updateGallery(house);
                this.updatePrices();
                this.resetServiceSelection();
            }, 100);
        }
    }

    getHouseFullScreenHTML(house) {
        return `
            <div class="house-gallery-section">
                <div class="house-gallery-slides" id="house-gallery-slides">
                    ${this.getGallerySlidesHTML(house)}
                </div>
                
                <div class="house-gallery-nav">
                    <button class="house-gallery-btn" id="gallery-prev">❮</button>
                    <button class="house-gallery-btn" id="gallery-next">❯</button>
                </div>
                
                <div class="house-gallery-dots" id="house-gallery-dots">
                    ${this.getGalleryDotsHTML(house)}
                </div>
            </div>
            
            <div class="house-content-section">
                <div class="house-main-content">
                    <div class="house-header-main">
                        <h1 class="house-title-main" id="detail-house-name">Дом №${house.id}</h1>
                        <div class="house-price-main" id="detail-house-price">
                            ${house.price.toLocaleString()} ₽
                            <span class="house-price-period">за ночь</span>
                        </div>
                    </div>
                    
                    <div class="house-description-full" id="detail-house-description">
                        ${house.description}
                    </div>
                    
                    <div class="house-features-main">
                        <div class="house-feature-main">
                            <span class="feature-icon-main">🛏️</span>
                            <span class="feature-text-main" id="detail-house-beds">${house.beds}</span>
                        </div>
                        <div class="house-feature-main">
                            <span class="feature-icon-main">📏</span>
                            <span class="feature-text-main" id="detail-house-size">${house.size}</span>
                        </div>
                        <div class="house-feature-main">
                            <span class="feature-icon-main">👥</span>
                            <span class="feature-text-main" id="detail-house-capacity">До ${house.capacity} гостей</span>
                        </div>
                        <div class="house-feature-main">
                            <span class="feature-icon-main">🕛</span>
                            <span class="feature-text-main" id="detail-house-time">${house.checkIn} - ${house.checkOut}</span>
                        </div>
                    </div>
                    
                    <div class="amenities-section-main">
                        <h3 class="section-title-main">Удобства</h3>
                        <div class="amenities-grid-main" id="detail-house-amenities">
                            ${house.amenities.map(amenity => 
                                `<div class="amenity-item-main">${amenity}</div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <button class="book-btn-main" id="start-booking-main">
                        🏷️ Забронировать за ${house.price.toLocaleString()} ₽
                    </button>
                </div>
            </div>
        `;
    }

    getGallerySlidesHTML(house) {
        if (!house.images || house.images.length === 0) {
            return `
                <div class="house-gallery-slide active">
                    <div class="house-gallery-placeholder">${this.getHouseIcon(house.type)}</div>
                </div>
            `;
        }

        return house.images.map((image, index) => `
            <div class="house-gallery-slide ${index === 0 ? 'active' : ''}">
                <img src="${image}" alt="Дом №${house.id} - фото ${index + 1}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="house-gallery-placeholder" style="display: none;">
                    ${this.getHouseIcon(house.type)}
                </div>
            </div>
        `).join('');
    }

    getGalleryDotsHTML(house) {
        const totalSlides = house.images && house.images.length > 0 ? house.images.length : 1;
        let dots = '';
        for (let i = 0; i < totalSlides; i++) {
            dots += `<div class="house-gallery-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`;
        }
        return dots;
    }

    updateGallery(house) {
        const slides = document.querySelectorAll('.house-gallery-slide');
        const dots = document.querySelectorAll('.house-gallery-dot');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        const totalSlides = document.querySelectorAll('.house-gallery-slide').length;
        this.currentSlide = (this.currentSlide + 1) % totalSlides;
        this.updateGallery();
    }

    prevSlide() {
        const totalSlides = document.querySelectorAll('.house-gallery-slide').length;
        this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
        this.updateGallery();
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateGallery();
    }

    showBookingPage() {
        const house = this.currentHouse;
        const container = document.createElement('div');
        container.className = 'booking-full-page active';
        container.innerHTML = this.getBookingPageHTML(house);
        
        const bookingPage = document.getElementById('booking-page');
        if (bookingPage) {
            bookingPage.innerHTML = '';
            bookingPage.appendChild(container);
        }
        
        this.updatePrices();
    }

    getBookingPageHTML(house) {
        return `
            <div class="booking-header-sticky">
                <div class="booking-header-content">
                    <h2 class="booking-title-main">Бронирование</h2>
                    <button class="booking-close-btn" id="booking-close">✕</button>
                </div>
            </div>
            
            <div class="booking-content-full">
                <div class="guests-selection-main" id="guests-selection-main" style="display: ${house.type === 'big' ? 'block' : 'none'};">
                    <div class="guests-header-main">
                        <div class="guests-title-main">👥 Количество гостей</div>
                        <div class="guests-controls-main">
                            <button class="guests-btn-main" id="guests-decrease-main">-</button>
                            <span class="guests-count-main" id="guests-count-main">8</span>
                            <button class="guests-btn-main" id="guests-increase-main">+</button>
                        </div>
                    </div>
                    <div class="guests-note-main">
                        Базовое значение: 8 гостей, максимальное: 15 гостей
                    </div>
                </div>
                
                <div class="services-section-main" style="display: ${house.type === 'big' ? 'block' : 'none'};">
                    <div class="service-option-main">
                        <div class="service-header-main">
                            <div class="service-name-main">Деревянный чан</div>
                            <div class="service-price-main">от 1 000 ₽</div>
                        </div>
                        <div class="service-variants-main">
                            <div class="service-variant-main" data-hours="0" data-price="0">
                                <div class="variant-info">
                                    <div class="variant-name-main">Не выбирать</div>
                                </div>
                                <div class="variant-price-main">0 ₽</div>
                            </div>
                            <div class="service-variant-main" data-hours="2" data-price="1000">
                                <div class="variant-info">
                                    <div class="variant-name-main">2 часа</div>
                                    <div class="variant-duration-main">18:00-20:00</div>
                                </div>
                                <div class="variant-price-main">1 000 ₽</div>
                            </div>
                            <div class="service-variant-main" data-hours="4" data-price="2000">
                                <div class="variant-info">
                                    <div class="variant-name-main">4 часа</div>
                                    <div class="variant-duration-main">18:00-22:00</div>
                                </div>
                                <div class="variant-price-main">2 000 ₽</div>
                            </div>
                            <div class="service-variant-main" data-hours="8" data-price="4000">
                                <div class="variant-info">
                                    <div class="variant-name-main">Вся ночь</div>
                                    <div class="variant-duration-main">18:00-02:00</div>
                                </div>
                                <div class="variant-price-main">4 000 ₽</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="booking-summary-main">
                    <div class="summary-items-main">
                        <div class="summary-item-main">
                            <span class="summary-label-main">Проживание (1 ночь):</span>
                            <span class="summary-value-main" id="summary-base-price-main">${house.price.toLocaleString()} ₽</span>
                        </div>
                        <div class="summary-item-main">
                            <span class="summary-label-main">Доп. услуги:</span>
                            <span class="summary-value-main" id="summary-services-price-main">0 ₽</span>
                        </div>
                        <div class="summary-item-main" id="guests-extra-main" style="display: none;">
                            <span class="summary-label-main">Доп. гости:</span>
                            <span class="summary-value-main" id="guests-extra-value-main">0 ₽</span>
                        </div>
                        <div class="summary-item-main total">
                            <span class="summary-label-main">Итого к оплате:</span>
                            <span class="summary-value-main total" id="summary-total-price-main">${house.price.toLocaleString()} ₽</span>
                        </div>
                    </div>
                    
                    <div class="acoins-section" style="margin-top: 20px;">
                        <div class="acoins-toggle">
                            <input type="checkbox" id="use-acoins-main">
                            <label for="use-acoins-main">Использовать Acoin для скидки</label>
                        </div>
                        <div class="acoins-balance">
                            Доступно: <span id="acoins-balance-main">${app.currentUser ? app.currentUser.acoins : 0}</span> Acoin (1 Acoin = 1 ₽)
                        </div>
                        <input type="number" class="acoins-input" id="acoins-amount-main" 
                               placeholder="Введите количество Acoin" min="0" max="${app.currentUser ? app.currentUser.acoins : 0}" disabled>
                    </div>
                    
                    <button class="book-btn-main" id="book-now-main" style="margin-top: 20px;">
                        🏷️ Забронировать за <span id="book-final-price-main">${house.price.toLocaleString()}</span> ₽
                    </button>
                </div>
            </div>
        `;
    }

    updateHouseInfo(house) {
        // Обновляем информацию о доме
        const nameElement = document.getElementById('detail-house-name');
        const priceElement = document.getElementById('detail-house-price');
        const bedsElement = document.getElementById('detail-house-beds');
        const sizeElement = document.getElementById('detail-house-size');
        const capacityElement = document.getElementById('detail-house-capacity');
        const timeElement = document.getElementById('detail-house-time');
        const descriptionElement = document.getElementById('detail-house-description');
        
        if (nameElement) nameElement.textContent = `Дом №${house.id}`;
        if (priceElement) priceElement.innerHTML = `${house.price.toLocaleString()} ₽<span class="house-price-period">за ночь</span>`;
        if (bedsElement) bedsElement.textContent = house.beds;
        if (sizeElement) sizeElement.textContent = house.size;
        if (capacityElement) capacityElement.textContent = `До ${house.capacity} гостей`;
        if (timeElement) timeElement.textContent = `${house.checkIn} - ${house.checkOut}`;
        if (descriptionElement) descriptionElement.textContent = house.description;
        
        // Обновляем amenities
        const amenitiesList = document.getElementById('detail-house-amenities');
        if (amenitiesList) {
            amenitiesList.innerHTML = house.amenities.map(amenity => 
                `<div class="amenity-item-main">${amenity}</div>`
            ).join('');
        }
    }

    closeBooking() {
        // Возвращаемся к полноэкранной карточке дома
        this.showFullScreenHouse(this.currentHouse);
    }

    // ДОБАВЛЕННЫЕ МЕТОДЫ ДЛЯ РАБОТЫ С УСЛУГАМИ И ЦЕНАМИ
    selectServiceVariant(variant) {
        const serviceType = 'chan';
        const hours = parseInt(variant.dataset.hours);
        const price = parseInt(variant.dataset.price);
        
        // Сбрасываем выбор для этого типа услуги
        variant.closest('.service-variants-main').querySelectorAll('.service-variant-main').forEach(v => {
            v.classList.remove('selected');
        });
        
        // Выделяем выбранный вариант
        variant.classList.add('selected');
        
        // Сохраняем выбор
        this.selectedServices[serviceType] = { hours, price };
        
        this.updatePrices();
    }

    changeGuests(delta) {
        const newCount = this.guestsCount + delta;
        
        // Проверяем границы
        if (newCount >= 1 && newCount <= this.maxGuests) {
            this.guestsCount = newCount;
            this.updateGuestsControls();
            this.updatePrices();
        }
    }

    updateGuestsSelection(house) {
        const guestsSection = document.getElementById('guests-selection-main');
        
        // Показываем выбор гостей только для больших домов
        if (house.type === 'big') {
            if (guestsSection) guestsSection.style.display = 'block';
            this.updateGuestsControls();
        } else {
            if (guestsSection) guestsSection.style.display = 'none';
        }
    }

    updateGuestsControls() {
        const countElement = document.getElementById('guests-count-main');
        const decreaseBtn = document.getElementById('guests-decrease-main');
        const increaseBtn = document.getElementById('guests-increase-main');
        
        if (countElement) countElement.textContent = this.guestsCount;
        
        // Обновляем состояние кнопок
        if (decreaseBtn) decreaseBtn.disabled = this.guestsCount <= 1;
        if (increaseBtn) increaseBtn.disabled = this.guestsCount >= this.maxGuests;
    }

    calculateTotalPrice() {
        const basePrice = this.currentHouse?.price || 0;
        const servicesPrice = Object.values(this.selectedServices).reduce((sum, service) => sum + service.price, 0);
        
        // Добавляем надбавку за дополнительных гостей (только для больших домов)
        let guestsExtra = 0;
        if (this.currentHouse?.type === 'big' && this.guestsCount > 8) {
            const extraGuests = this.guestsCount - 8;
            guestsExtra = extraGuests * 500; // 500 руб за дополнительного гостя
        }
        
        return basePrice + servicesPrice + guestsExtra;
    }

    updatePrices() {
        const basePrice = this.currentHouse?.price || 0;
        const servicesPrice = Object.values(this.selectedServices).reduce((sum, service) => sum + service.price, 0);
        
        // Рассчитываем надбавку за гостей
        let guestsExtra = 0;
        
        if (this.currentHouse?.type === 'big') {
            if (this.guestsCount > 8) {
                const extraGuests = this.guestsCount - 8;
                guestsExtra = extraGuests * 500;
            }
        }
        
        const totalPrice = basePrice + servicesPrice + guestsExtra;
        const finalPrice = Math.max(0, totalPrice - this.acoinsUsed);

        // Обновляем цены в интерфейсе
        const basePriceElement = document.getElementById('summary-base-price-main');
        const servicesPriceElement = document.getElementById('summary-services-price-main');
        const guestsExtraElement = document.getElementById('guests-extra-main');
        const guestsExtraValueElement = document.getElementById('guests-extra-value-main');
        const totalPriceElement = document.getElementById('summary-total-price-main');
        const finalPriceElement = document.getElementById('book-final-price-main');
        
        if (basePriceElement) basePriceElement.textContent = `${basePrice.toLocaleString()} ₽`;
        if (servicesPriceElement) servicesPriceElement.textContent = `${servicesPrice.toLocaleString()} ₽`;
        
        // Показываем надбавку за гостей если есть
        if (guestsExtraElement && guestsExtraValueElement) {
            if (guestsExtra > 0) {
                guestsExtraElement.style.display = 'flex';
                guestsExtraValueElement.textContent = `+${guestsExtra.toLocaleString()} ₽`;
            } else {
                guestsExtraElement.style.display = 'none';
            }
        }
        
        if (totalPriceElement) totalPriceElement.textContent = `${finalPrice.toLocaleString()} ₽`;
        if (finalPriceElement) finalPriceElement.textContent = finalPrice.toLocaleString();
        
        // Обновляем максимальное значение Acoin
        const acoinsInput = document.getElementById('acoins-amount-main');
        if (acoinsInput) {
            acoinsInput.max = Math.min(app.currentUser ? app.currentUser.acoins : 0, totalPrice);
        }
    }

    resetServiceSelection() {
        document.querySelectorAll('.service-variant-main').forEach(variant => {
            variant.classList.remove('selected');
        });
        
        // Выбираем вариант "Не выбирать" по умолчанию
        const noService = document.querySelector('.service-variant-main[data-hours="0"]');
        if (noService) {
            noService.classList.add('selected');
        }
    }

    proceedToPayment() {
        if (!this.currentHouse) {
            app.showNotification('Ошибка: дом не выбран');
            return;
        }

        // Сохраняем данные бронирования
        if (window.bookingSystem) {
            bookingSystem.bookingData.selectedHouse = this.currentHouse;
            bookingSystem.bookingData.services = this.selectedServices;
            bookingSystem.bookingData.guestsCount = this.guestsCount;
            bookingSystem.bookingData.totalAmount = this.calculateTotalPrice();
            bookingSystem.bookingData.finalAmount = Math.max(0, this.calculateTotalPrice() - this.acoinsUsed);
            bookingSystem.bookingData.acoinsUsed = this.acoinsUsed;
        }

        // Переходим к оплате
        if (window.paymentSystem) {
            paymentSystem.showPaymentPage();
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    window.houseDetail = new HouseDetail();
});