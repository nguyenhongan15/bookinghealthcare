# bookinghealthcare

Hệ thống đặt lịch khám bệnh trực tuyến giúp bệnh nhân dễ dàng đặt lịch hẹn với bác sĩ và quản lý thông tin sức khỏe.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://bookinghealthcare.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repository-blue.svg)](https://github.com/nguyenhongan15/bookinghealthcare)

## 📋 Tổng quan

Booking Healthcare là một nền tảng đặt lịch khám bệnh toàn diện, cho phép:
- Bệnh nhân tìm kiếm và đặt lịch với bác sĩ
- Bác sĩ quản lý lịch làm việc và cuộc hẹn
- Quản trị viên giám sát và quản lý toàn bộ hệ thống

## ✨ Tính năng chính

### Dành cho Bệnh nhân
- 🔍 Tìm kiếm bác sĩ theo chuyên khoa, vị trí
- 📅 Đặt lịch khám trực tuyến
- 📝 Quản lý hồ sơ bệnh án cá nhân
- 🔔 Nhận thông báo lịch hẹn

### Dành cho Bác sĩ
- 📊 Quản lý lịch làm việc
- 👥 Xem danh sách bệnh nhân
- 📋 Cập nhật thông tin khám bệnh
- ⏰ Quản lý thời gian khám

### Dành cho Quản trị viên
- 👨‍⚕️ Quản lý danh sách bác sĩ
- 👤 Quản lý người dùng
- 📈 Thống kê và báo cáo
- ⚙️ Cấu hình hệ thống

## 🛠️ Công nghệ sử dụng

### Frontend
- **JavaScript** - Ngôn ngữ lập trình chính
- **React.js** - Thư viện xây dựng giao diện
- **CSS** - Styling và responsive design
- **HTML** - Cấu trúc trang web

### Backend
- **Java** - Ngôn ngữ backend chính
- **Spring Boot** (dự kiến) - Framework Java
- **RESTful API** - Giao tiếp client-server

### Database
- **MySQL/PostgreSQL** (dự kiến) - Cơ sở dữ liệu quan hệ

### Deployment
- **Vercel** - Hosting frontend
- **Render/Railway** (dự kiến) - Hosting backend

## 📂 Cấu trúc dự án

```
bookinghealthcare/
│
├── frontend/           # Mã nguồn frontend (React)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/            # Mã nguồn backend (Java/Spring Boot)
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
├── docs/               # Tài liệu dự án
│
├── images/             # Hình ảnh và tài nguyên
│
└── README.md           # File này
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js (v14 trở lên)
- Java JDK (v11 trở lên)
- Maven hoặc Gradle
- MySQL/PostgreSQL
- Git

### Cài đặt Frontend

```bash
# Clone repository
git clone https://github.com/nguyenhongan15/bookinghealthcare.git

# Di chuyển vào thư mục frontend
cd bookinghealthcare/frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

Frontend sẽ chạy tại `http://localhost:3000`

### Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd bookinghealthcare/backend

# Cài đặt dependencies với Maven
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

Backend sẽ chạy tại `http://localhost:8080`

### Cấu hình Database

1. Tạo database mới:
```sql
CREATE DATABASE bookinghealthcare;
```

2. Cập nhật thông tin kết nối trong `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookinghealthcare
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 🔧 Biến môi trường

Tạo file `.env` trong thư mục frontend:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=10000
```

Tạo file `.env` trong thư mục backend (nếu cần):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bookinghealthcare
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

## 📖 API Documentation

### Endpoints chính

#### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

#### Users
- `GET /api/users/profile` - Lấy thông tin người dùng
- `PUT /api/users/profile` - Cập nhật thông tin
- `GET /api/users/doctors` - Danh sách bác sĩ

#### Appointments
- `GET /api/appointments` - Danh sách lịch hẹn
- `POST /api/appointments` - Tạo lịch hẹn mới
- `PUT /api/appointments/:id` - Cập nhật lịch hẹn
- `DELETE /api/appointments/:id` - Hủy lịch hẹn

##  Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
mvn test
```

##  Screenshots

### Trang chủ
![Home Page](images/homepage.png)

### Đặt lịch khám
![Booking](images/booking.png)

### Quản lý lịch hẹn
![Dashboard](images/dashboard.png)

_Cập nhật screenshots thực tế vào thư mục `images/`_

##  Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

##  License

Dự án này được phân phối dưới giấy phép MIT License. Xem file `LICENSE` để biết thêm chi tiết.

##  Tác giả

**Nguyễn Hồng Ân** - [@nguyenhongan15](https://github.com/nguyenhongan15)

## 📞 Liên hệ

- Project Link: [https://github.com/nguyenhongan15/bookinghealthcare](https://github.com/nguyenhongan15/bookinghealthcare)
- Live Demo: [https://bookinghealthcare.vercel.app](https://bookinghealthcare.vercel.app)

## 🙏 Acknowledgments

- Cảm ơn tất cả những người đã đóng góp cho dự án
- Cảm ơn các thư viện và framework được sử dụng
- Đặc biệt cảm ơn cộng đồng open source

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star nhé!
