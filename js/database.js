// Симуляция базы данных через localStorage
class Database {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('aFrameUsers')) {
            localStorage.setItem('aFrameUsers', JSON.stringify({}));
        }
        if (!localStorage.getItem('aFrameBookings')) {
            localStorage.setItem('aFrameBookings', JSON.stringify([]));
        }
        if (!localStorage.getItem('aFrameHouses')) {
            this.initHouses();
        }
        if (!localStorage.getItem('aFrameFeedback')) {
            localStorage.setItem('aFrameFeedback', JSON.stringify([]));
        }
    }

    initHouses() {
        const houses = {
            big: [
                {
                    id: 1,
                    name: "Дом №1",
                    type: "big",
                    checkIn: "12:00",
                    checkOut: "10:00",
                    capacity: 4,
                    price: 10000,
                    available: true,
                    images: ["images/houses/big/house1-1.jpg", "images/houses/big/house1-2.jpg", "images/houses/big/house1-3.jpg"],
                    description: "Просторный двухэтажный дом с панорамными окнами, собственной сауной и террасой с видом на лес. Идеально подходит для компании друзей или семьи.",
                    amenities: ["Сауна", "Терраса", "Камин", "TV", "Wi-Fi", "Кухня"],
                    size: "85 м²",
                    beds: "2 двуспальные кровати",
                    features: ["Отдельная парковка", "Зона BBQ", "Гидромассажная ванна"]
                },
                {
                    id: 2,
                    name: "Дом №2",
                    type: "big",
                    checkIn: "12:00",
                    checkOut: "10:00",
                    capacity: 4,
                    price: 10000,
                    available: true,
                    images: ["images/houses/big/house2-1.jpg", "images/houses/big/house2-2.jpg", "images/houses/big/house2-3.jpg"],
                    description: "Уютный дом в стиле шале с камином и балконом. Расположен в самом сердце соснового бора, в шаговой доступности от озера.",
                    amenities: ["Камин", "Балкон", "TV", "Wi-Fi", "Полностью оборудованная кухня"],
                    size: "78 м²",
                    beds: "1 двуспальная + 2 односпальные",
                    features: ["Детская площадка рядом", "Мангальная зона", "Веранда"]
                },
                {
                    id: 3,
                    name: "Дом №3",
                    type: "big",
                    checkIn: "14:00",
                    checkOut: "12:00",
                    capacity: 4,
                    price: 10000,
                    available: true,
                    images: ["images/houses/big/house3-1.jpg", "images/houses/big/house3-2.jpg", "images/houses/big/house3-3.jpg"],
                    description: "Премиум дом с прямым выходом к озеру. Панорамные окна от пола до потолка, современный дизайн и приватная территория.",
                    amenities: ["Вид на озеро", "Терраса", "Камин", "Smart TV", "Wi-Fi", "Посудомоечная машина"],
                    size: "92 м²",
                    beds: "2 двуспальные кровати",
                    features: ["Приватный пляж", "Сауна", "Джакузи на террасе"]
                },
                {
                    id: 4,
                    name: "Дом №4",
                    type: "big",
                    checkIn: "14:00",
                    checkOut: "12:00",
                    capacity: 4,
                    price: 10000,
                    available: true,
                    images: ["images/houses/big/house4-1.jpg", "images/houses/big/house4-2.jpg", "images/houses/big/house4-3.jpg"],
                    description: "Традиционный деревянный дом с современным комфортом. Большая терраса с качелями и зоной отдыха, окружен вековыми соснами.",
                    amenities: ["Большая терраса", "Камин", "TV", "Wi-Fi", "Стиральная машина"],
                    size: "80 м²",
                    beds: "1 двуспальная + 2 односпальные",
                    features: ["Гамак", "Мангал", "Детские игрушки"]
                },
                {
                    id: 5,
                    name: "Дом №5",
                    type: "big",
                    checkIn: "16:00",
                    checkOut: "14:00",
                    capacity: 4,
                    price: 10000,
                    available: true,
                    images: ["images/houses/big/house5-1.jpg", "images/houses/big/house5-2.jpg", "images/houses/big/house5-3.jpg"],
                    description: "Элитный дом с дизайнерским ремонтом, системой умный дом и премиальной отделкой. Максимальный комфорт и приватность.",
                    amenities: ["Умный дом", "Тёплые полы", "Камин", "4K TV", "Wi-Fi 6", "Винный шкаф"],
                    size: "95 м²",
                    beds: "2 king-size кровати",
                    features: ["Частный бассейн", "SPA-зона", "Охраняемая территория"]
                },
                {
                    id: 6,
                    name: "Дом №6",
                    type: "big",
                    checkIn: "16:00",
                    checkOut: "14:00",
                    capacity: 4,
                    price: 10000,
                    available: true,
                    images: ["images/houses/big/house6-1.jpg", "images/houses/big/house6-2.jpg", "images/houses/big/house6-3.jpg"],
                    description: "Экологичный дом из натуральных материалов. Солнечные панели, система сбора дождевой воды и естественная вентиляция.",
                    amenities: ["Экоматериалы", "Большие окна", "TV", "Wi-Fi", "Экокухня"],
                    size: "75 м²",
                    beds: "1 двуспальная + 2 односпальные",
                    features: ["Огород с травами", "Экотропа", "Велосипеды в подарок"]
                }
            ],
            pair: [
                {
                    id: 7,
                    name: "Дом №7",
                    type: "pair",
                    checkIn: "12:00",
                    checkOut: "10:00",
                    capacity: 2,
                    price: 6000,
                    available: true,
                    images: ["images/houses/pair/house7-1.jpg", "images/houses/pair/house7-2.jpg", "images/houses/pair/house7-3.jpg"],
                    description: "Уютный домик для влюбленных пар с камином, большим балконом и романтической атмосферой. Идеален для медового месяца.",
                    amenities: ["Камин", "Балкон", "TV", "Wi-Fi", "Кофемашина"],
                    size: "45 м²",
                    beds: "1 двуспальная кровать",
                    features: ["Романтический декор", "Шампанское в подарок", "Цветы при заезде"]
                },
                {
                    id: 8,
                    name: "Дом №8",
                    type: "pair",
                    checkIn: "12:00",
                    checkOut: "10:00",
                    capacity: 2,
                    price: 6000,
                    available: true,
                    images: ["images/houses/pair/house8-1.jpg", "images/houses/pair/house8-2.jpg", "images/houses/pair/house8-3.jpg"],
                    description: "Компактный и стильный дом для пар, ценящих уединение. Панорамные окна с видом на лес, современный интерьер.",
                    amenities: ["Панорамные окна", "TV", "Wi-Fi", "Мини-кухня", "Кондиционер"],
                    size: "40 м²",
                    beds: "1 двуспальная кровать",
                    features: ["Шезлонги", "Книги и настолки", "Утренняя доставка завтрака"]
                }
            ],
            family: [
                {
                    id: 9,
                    name: "Дом №9",
                    type: "family",
                    checkIn: "12:00",
                    checkOut: "10:00",
                    capacity: 6,
                    price: 14000,
                    available: true,
                    images: ["images/houses/family/house9-1.jpg", "images/houses/family/house9-2.jpg", "images/houses/family/house9-3.jpg"],
                    description: "Просторный семейный дом с детской комнатой, игровой зоной и всем необходимым для комфортного отдыха с детьми.",
                    amenities: ["Детская комната", "Игровая зона", "2 TV", "Wi-Fi", "Полная кухня", "Стиральная машина"],
                    size: "105 м²",
                    beds: "2 двуспальные + 2 односпальные",
                    features: ["Детская кроватка", "Стульчик для кормления", "Игровая площадка", "Безопасная территория"]
                },
                {
                    id: 10,
                    name: "Дом №10",
                    type: "family",
                    checkIn: "12:00",
                    checkOut: "10:00",
                    capacity: 6,
                    price: 14000,
                    available: true,
                    images: ["images/houses/family/house10-1.jpg", "images/houses/family/house10-2.jpg", "images/houses/family/house10-3.jpg"],
                    description: "Тёплый семейный дом в традиционном стиле с большой гостиной, отдельными спальнями и закрытой территорией для детей.",
                    amenities: ["3 спальни", "Большая гостиная", "TV", "Wi-Fi", "Кухня-столовая"],
                    size: "98 м²",
                    beds: "3 двуспальные кровати",
                    features: ["Закрытый двор", "Качели", "Настольные игры", "Детский бассейн"]
                }
            ]
        };
        localStorage.setItem('aFrameHouses', JSON.stringify(houses));
    }

    // Методы для работы с пользователями
    getUser(userId) {
        const users = JSON.parse(localStorage.getItem('aFrameUsers'));
        return users[userId] || this.createUser(userId);
    }

    createUser(userId) {
        const users = JSON.parse(localStorage.getItem('aFrameUsers'));
        const user = {
            id: userId,
            name: 'Пользователь',
            level: 'bronze',
            acoins: 1000,
            referrals: 0,
            referralCode: this.generateReferralCode(),
            bookings: []
        };
        users[userId] = user;
        localStorage.setItem('aFrameUsers', JSON.stringify(users));
        return user;
    }

    updateUser(userId, updates) {
        const users = JSON.parse(localStorage.getItem('aFrameUsers'));
        if (users[userId]) {
            users[userId] = { ...users[userId], ...updates };
            localStorage.setItem('aFrameUsers', JSON.stringify(users));
        }
    }

    // Методы для бронирований
    createBooking(bookingData) {
        const bookings = JSON.parse(localStorage.getItem('aFrameBookings'));
        const booking = {
            id: Date.now().toString(),
            ...bookingData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        bookings.push(booking);
        localStorage.setItem('aFrameBookings', JSON.stringify(bookings));
        
        // Добавляем бронирование в профиль пользователя
        const users = JSON.parse(localStorage.getItem('aFrameUsers'));
        if (users[bookingData.userId]) {
            users[bookingData.userId].bookings.push(booking.id);
            localStorage.setItem('aFrameUsers', JSON.stringify(users));
        }
        
        return booking;
    }

    getBookingsByUser(userId) {
        const bookings = JSON.parse(localStorage.getItem('aFrameBookings'));
        return bookings.filter(booking => booking.userId === userId);
    }

    // Методы для домов
    getHousesByType(type) {
        const houses = JSON.parse(localStorage.getItem('aFrameHouses'));
        return houses[type] || [];
    }

    getHouseById(houseId) {
        const houses = JSON.parse(localStorage.getItem('aFrameHouses'));
        for (const type in houses) {
            const house = houses[type].find(h => h.id === parseInt(houseId));
            if (house) return house;
        }
        return null;
    }

    // Методы для отзывов
    addFeedback(feedback) {
        const feedbacks = JSON.parse(localStorage.getItem('aFrameFeedback'));
        feedbacks.push({
            id: Date.now().toString(),
            ...feedback,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('aFrameFeedback', JSON.stringify(feedbacks));
    }

    getUserBookings(userId) {
    const bookings = JSON.parse(localStorage.getItem('aFrameBookings'));
    return bookings
        .filter(booking => booking.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

updateBookingStatus(bookingId, status) {
    const bookings = JSON.parse(localStorage.getItem('aFrameBookings'));
    const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
    
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = status;
        localStorage.setItem('aFrameBookings', JSON.stringify(bookings));
        return true;
    }
    return false;
}

    // Вспомогательные методы
    generateReferralCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    addAcoins(userId, amount) {
        const users = JSON.parse(localStorage.getItem('aFrameUsers'));
        if (users[userId]) {
            users[userId].acoins += amount;
            localStorage.setItem('aFrameUsers', JSON.stringify(users));
            
            // Обновляем уровень пользователя
            this.updateUserLevel(userId);
        }
    }

    updateUserLevel(userId) {
        const users = JSON.parse(localStorage.getItem('aFrameUsers'));
        const user = users[userId];
        if (!user) return;

        let newLevel = 'bronze';
        if (user.acoins >= 10000) newLevel = 'diamond';
        else if (user.acoins >= 5000) newLevel = 'gold';
        else if (user.acoins >= 1000) newLevel = 'silver';

        if (user.level !== newLevel) {
            users[userId].level = newLevel;
            localStorage.setItem('aFrameUsers', JSON.stringify(users));
        }
    }
}

// Создаем глобальный экземпляр базы данных
const db = new Database();