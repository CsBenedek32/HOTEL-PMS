# HotelPMS - Szállodamenedzsment Rendszer
## 📋 Leírás
Modern, webalapú szállodamenedzsment rendszer kisebb és közepes méretű szállodák számára.

## ✨ Főbb funkciók
- 📅 Foglalások kezelése (létrehozás, módosítás, státusz váltás)
- 🏨 Szobák és szobatípusok menedzsmentje
- 👥 Vendégek adatainak tárolása és kezelése
- 🧾 Számlázás és fizetési státuszok követése
- 🧹 Takarítási feladatok koordinálása
- 📊 Statisztikák 
- 👤 Felhasználók és jogosultságok kezelése

## 🛠️ Technológiai stack

### Backend
- Java 17
- Spring Boot 3.x
- MySQL
- Spring Data JPA
- Spring Security
- OpenPDF (számlagenerálás)

### Frontend
- React 18
- TypeScript
- Jotai (state management)
- Material-UI
- React Router

## 🚀 Telepítés és futtatás

### Előfeltételek
- Java 17+
- Node.js 18+
- MySQL 8.0+

### Backend indítása
```
cd backend
./mvnw spring-boot:run
```
Frontend indítása
```
cd frontend
npm install
npm start
```
Adatbázis konfiguráció

# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotelpms
spring.datasource.username=your_username
spring.datasource.password=your_password


🧪 Tesztelés
# Backend tesztek
./mvnw test

# Frontend tesztek
npm test

🔮 Továbbfejlesztési lehetőségek

- Channel manager integráció (Booking.com, Airbnb)
- Email értesítések

👨‍💻 Szerző
Csapó Benedek István
