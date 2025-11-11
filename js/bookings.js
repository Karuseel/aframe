class BookingsSystem {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Навигация уже обрабатывается в app.js
    }

    showBookingsPage() {
        this.loadUserBookings();
        app.showPage('bookings');
    }

    loadUserBookings() {
        const bookingsList = document.getElementById('bookings-list');
        const userBookings = db.getUserBookings(app.currentUser.id);
        
        if (userBookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="no-bookings">
                    <div class="no-bookings-icon">📋</div>
                    <h3>У вас пока нет бронирований</h3>
                    <p>Забронируйте свой первый дом и он появится здесь</p>
                    <button class="btn btn-primary" onclick="app.showPage('home')" style="margin-top: 20px;">
                        Найти дом
                    </button>
                </div>
            `;
            return;
        }

        bookingsList.innerHTML = userBookings.map(booking => `
            <div class="booking-item">
                <div class="booking-header">
                    <div class="booking-title">
                        Дом №${booking.houseId}
                        <span class="house-number">№${booking.houseId}</span>
                    </div>
                    <div class="booking-status status-${booking.status}">
                        ${this.getStatusText(booking.status)}
                    </div>
                </div>
                
                <div class="booking-details">
                    <div class="booking-detail">
                        <span class="detail-label">Даты</span>
                        <span class="detail-value">
                            ${this.formatDate(booking.checkIn)} - ${this.formatDate(booking.checkOut)}
                        </span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">Время</span>
                        <span class="detail-value">
                            ${booking.checkInTime} - ${booking.checkOutTime}
                        </span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">Доп. услуги</span>
                        <span class="detail-value">
                            ${this.getServicesText(booking.services)}
                        </span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">Статус</span>
                        <span class="detail-value">
                            ${this.getStatusText(booking.status)}
                        </span>
                    </div>
                </div>
                
                <div class="booking-price">
                    ${booking.finalAmount.toLocaleString()} ₽
                </div>
                
                ${booking.acoinsUsed > 0 ? `
                <div style="text-align: right; font-size: 0.9rem; color: var(--gray-600);">
                    Использовано Acoin: ${booking.acoinsUsed}
                </div>
                ` : ''}
                
                <div style="font-size: 0.8rem; color: var(--gray-500); margin-top: 10px;">
                    Номер брони: #${booking.id}
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statuses = {
            'pending': 'Ожидает подтверждения',
            'confirmed': 'Подтверждено',
            'completed': 'Завершено',
            'cancelled': 'Отменено'
        };
        return statuses[status] || status;
    }

    getServicesText(services) {
        if (!services.chan || services.chan.hours === 0) {
            return 'Нет';
        }
        return `Чан: ${services.chan.hours}ч (${services.chan.price}₽)`;
    }

    formatDate(dateString) {
        if (!dateString) return 'Не указано';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }
}

// Инициализация системы бронирований
document.addEventListener('DOMContentLoaded', function() {
    window.bookingsSystem = new BookingsSystem();
});