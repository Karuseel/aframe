class HouseDetail {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.selectedServices = {
            chan: { hours: 0, price: 0 }
        };
        this.acoinsUsed = 0;
        this.guestsCount = 8; // Базовое значение
        this.maxGuests = 15;
        this.bindEvents();
    }

    bindEvents() {
        // Навигация галереи
        document.getElementById('gallery-prev').addEventListener('click', () => {
            this.prevSlide();
        });

        document.getElementById('gallery-next').addEventListener('click', () => {
            this.nextSlide();
        });

        // Клик по точкам галереи
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-dot')) {
                this.goToSlide(parseInt(e.target.dataset.slide));
            }
        });

        // Выбор услуги чана
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-variant')) {
                this.selectServiceVariant(e.target.closest('.service-variant'));
            }
        });

        document.getElementById('guests-decrease').addEventListener('click', () => {
            this.changeGuests(-1);
        });

        document.getElementById('guests-increase').addEventListener('click', () => {
            this.changeGuests(1);
        });

        // Использование Acoin
        const useAcoins = document.getElementById('use-acoins');
        const acoinsInput = document.getElementById('acoins-amount');
        
        useAcoins.addEventListener('change', (e) => {
            acoinsInput.disabled = !e.target.checked;
            if (!e.target.checked) {
                acoinsInput.value = '';
                this.acoinsUsed = 0;
            }
            this.updatePrices();
        });

        acoinsInput.addEventListener('input', (e) => {
            const maxAcoins = Math.min(app.currentUser.acoins, this.calculateTotalPrice());
            this.acoinsUsed = Math.min(parseInt(e.target.value) || 0, maxAcoins);
            e.target.value = this.acoinsUsed;
            this.updatePrices();
        });

        // Кнопка бронирования
        document.getElementById('book-now-btn').addEventListener('click', () => {
            this.proceedToPayment();
        });
    }

    showHouseDetail(house) {
        this.currentHouse = house;
        this.currentSlide = 0;
        this.selectedServices = { chan: { hours: 0, price: 0 } };
        this.acoinsUsed = 0;
        this.guestsCount = 8; // Сбрасываем к базовому значению
        
        this.updateHouseInfo(house);
        this.updateGallery();
        this.updateGuestsSelection(house);
        this.updatePrices();
        this.resetServiceSelection();
        
        bookingSystem.showStep(4);
    }
    updateGuestsSelection(house) {
        const guestsSection = document.getElementById('guests-selection');
        
        // Показываем выбор гостей только для больших домов
        if (house.type === 'big') {
            guestsSection.style.display = 'block';
            this.updateGuestsControls();
        } else {
            guestsSection.style.display = 'none';
        }
    }

    updateGuestsControls() {
        const countElement = document.getElementById('guests-count');
        const decreaseBtn = document.getElementById('guests-decrease');
        const increaseBtn = document.getElementById('guests-increase');
        
        countElement.textContent = this.guestsCount;
        
        // Обновляем состояние кнопок
        decreaseBtn.disabled = this.guestsCount <= 1;
        increaseBtn.disabled = this.guestsCount >= this.maxGuests;
        
        // Обновляем цены при изменении количества гостей
        this.updatePrices();
    }

    changeGuests(delta) {
        const newCount = this.guestsCount + delta;
        
        // Проверяем границы
        if (newCount >= 1 && newCount <= this.maxGuests) {
            this.guestsCount = newCount;
            this.updateGuestsControls();
        }
    }

    updateHouseInfo(house) {
        document.getElementById('detail-house-name').textContent = house.name;
        document.getElementById('detail-house-price').textContent = house.price.toLocaleString() + ' ₽';
        document.getElementById('detail-house-beds').textContent = house.beds;
        document.getElementById('detail-house-size').textContent = house.size;
        document.getElementById('detail-house-capacity').textContent = `До ${house.capacity} гостей`;
        document.getElementById('detail-house-time').textContent = `${house.checkIn} - ${house.checkOut}`;
        
        // Загружаем удобства
        const amenitiesList = document.getElementById('detail-house-amenities');
        amenitiesList.innerHTML = house.amenities.map(amenity => 
            `<div class="amenity-item">${amenity}</div>`
        ).join('');
        
        // Обновляем баланс Acoin
        document.getElementById('acoins-balance').textContent = app.currentUser.acoins;
        document.getElementById('acoins-amount').max = Math.min(app.currentUser.acoins, house.price);
        
        // Сбрасываем чекбокс Acoin
        document.getElementById('use-acoins').checked = false;
        document.getElementById('acoins-amount').disabled = true;
        document.getElementById('acoins-amount').value = '';

        const servicesSection = document.querySelector('.services-section');
        if (servicesSection) {
            if (house.type === 'big') {
                servicesSection.style.display = 'block';
            } else {
                servicesSection.style.display = 'none';
            }
        }
    
    // Обновляем название дома - убираем текстовое название, оставляем только номер
    const houseNameElement = document.getElementById('detail-house-name');
        houseNameElement.textContent = `Дом №${house.id}`;

    this.updateGalleryWithImages(house);

    }

    updateGalleryWithImages(house) {
    const gallery = document.getElementById('house-gallery');
    const slidesContainer = gallery.querySelector('.gallery-slides') || this.createGallerySlides(gallery);
    
    // Очищаем существующие слайды
    slidesContainer.innerHTML = '';
    
    // Добавляем слайды с изображениями
    house.images.forEach((imagePath, index) => {
        const slide = document.createElement('div');
        slide.className = `gallery-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img src="${imagePath}" alt="Дом №${house.id} - фото ${index + 1}" 
                 onerror="this.style.display='none'; this.parentNode.innerHTML='🏠';">
        `;
        slidesContainer.appendChild(slide);
    });
    
    // Обновляем точки навигации
    this.updateGalleryDots(house.images.length);
}

    createGallerySlides(gallery) {
    // Убираем статичные слайды если есть
    const oldSlides = gallery.querySelectorAll('.gallery-slide');
    oldSlides.forEach(slide => slide.remove());
    
    // Создаем контейнер для слайдов
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'gallery-slides';
    slidesContainer.style.position = 'relative';
    slidesContainer.style.width = '100%';
    slidesContainer.style.height = '100%';
    
    gallery.insertBefore(slidesContainer, gallery.firstChild);
    return slidesContainer;
}

updateGalleryDots(totalSlides) {
    const dotsContainer = document.querySelector('.gallery-dots');
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
        dot.dataset.slide = i;
        dotsContainer.appendChild(dot);
    }
    
    this.totalSlides = totalSlides;
}

    updateGallery() {
        // Сбрасываем галерею
        document.querySelectorAll('.gallery-slide').forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateGallery();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateGallery();
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateGallery();
    }

    selectServiceVariant(variant) {
        const serviceType = 'chan';
        const hours = parseInt(variant.dataset.hours);
        const price = parseInt(variant.dataset.price);
        
        // Сбрасываем выбор для этого типа услуги
        variant.closest('.service-variants').querySelectorAll('.service-variant').forEach(v => {
            v.classList.remove('selected');
        });
        
        // Выделяем выбранный вариант
        variant.classList.add('selected');
        
        // Сохраняем выбор
        this.selectedServices[serviceType] = { hours, price };
        
        this.updatePrices();
    }

    resetServiceSelection() {
        document.querySelectorAll('.service-variant').forEach(variant => {
            variant.classList.remove('selected');
        });
        
        // Выбираем вариант "Не выбирать" по умолчанию
        const noService = document.querySelector('.service-variant[data-hours="0"]');
        if (noService) {
            noService.classList.add('selected');
        }
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
        let guestsText = '';
        
        if (this.currentHouse?.type === 'big') {
            if (this.guestsCount > 8) {
                const extraGuests = this.guestsCount - 8;
                guestsExtra = extraGuests * 500;
                guestsText = ` (+${extraGuests} гостей)`;
            }
        }
        
        const totalPrice = basePrice + servicesPrice + guestsExtra;
        const finalPrice = Math.max(0, totalPrice - this.acoinsUsed);

        // Обновляем цены в интерфейсе
        document.getElementById('summary-base-price').textContent = 
            `${basePrice.toLocaleString()} ₽${guestsText}`;
        document.getElementById('summary-services-price').textContent = servicesPrice.toLocaleString() + ' ₽';
        
        // Показываем надбавку за гостей если есть
        const guestsExtraElement = document.getElementById('guests-extra') || this.createGuestsExtraElement();
        if (guestsExtra > 0) {
            guestsExtraElement.style.display = 'flex';
            guestsExtraElement.innerHTML = `
                <span>Доп. гости (${this.guestsCount - 8} чел):</span>
                <span>+${guestsExtra.toLocaleString()} ₽</span>
            `;
        } else {
            guestsExtraElement.style.display = 'none';
        }
        
        document.getElementById('summary-total-price').textContent = finalPrice.toLocaleString() + ' ₽';
        document.getElementById('book-final-price').textContent = finalPrice.toLocaleString();
        
        // Обновляем максимальное значение Acoin
        const acoinsInput = document.getElementById('acoins-amount');
        acoinsInput.max = Math.min(app.currentUser.acoins, totalPrice);
    }

    createGuestsExtraElement() {
        const summaryElement = document.querySelector('.booking-summary');
        const servicesItem = document.getElementById('summary-services-price').closest('.summary-item');
        
        const guestsExtraElement = document.createElement('div');
        guestsExtraElement.className = 'summary-item';
        guestsExtraElement.id = 'guests-extra';
        guestsExtraElement.style.display = 'none';
        
        servicesItem.parentNode.insertBefore(guestsExtraElement, servicesItem.nextSibling);
        return guestsExtraElement;
    }

    proceedToPayment() {
        if (!this.currentHouse) {
            this.showNotification('Ошибка: дом не выбран');
            return;
        }

        // Сохраняем данные бронирования
        bookingSystem.bookingData.selectedHouse = this.currentHouse;
        bookingSystem.bookingData.services = this.selectedServices;
        bookingSystem.bookingData.guestsCount = this.guestsCount;
        bookingSystem.bookingData.totalAmount = this.calculateTotalPrice();
        bookingSystem.bookingData.finalAmount = Math.max(0, this.calculateTotalPrice() - this.acoinsUsed);
        bookingSystem.bookingData.acoinsUsed = this.acoinsUsed;

        // Переходим к оплате
        if (window.paymentSystem) {
            paymentSystem.showPaymentPage();
        }
    }

    showNotification(message) {
        console.log('Notification:', message);
        alert(message);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    window.houseDetail = new HouseDetail();
});