# Smart Task & Habit Tracker 🧠✅   ![In Progress](https://img.shields.io/badge/Status-%F0%9F%A7%AA%20In%20Progress-blue)
🧪 In Progress — This project is actively being built!


A full-stack productivity app that lets users manage daily tasks and long-term habits, plan them visually on a weekly schedule, and track their completion over time.

---

## ✨ Features So Far

- 🔐 **User authentication** (register, login)
- ⏰ **Personalized planner hours** – user defines their day start/end during registration
- 📅 **Drag-and-drop weekly planner** for placing tasks and recurring habits
- 🤖 **Auto-scheduling** habits based on frequency & preferred time
- ✅ **Mark tasks as completed**
- ⚙️ **Option to update planner hours** directly from the dashboard
- 📦 **Data persistence** via Spring Boot backend (Java) and local storage
- 🎨 **Clean UI** with real-time updates using React

---

## 🚀 How to Run Locally

### 📦 Backend (Spring Boot + PostgreSQL)

1. Clone this repository  
   ```bash
   git clone https://github.com/yourusername/smart-task-habit-tracker.git
   cd smart-task-habit-tracker
   ```

2. Set up PostgreSQL and create a database (e.g. `taskmaster`)
3. Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/taskmaster
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

4. Run the Spring Boot app:
   ```
   ./mvnw spring-boot:run
   ```

### 💻 Frontend (React)

1. Open a new terminal in the `frontend/` directory
2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

The app will be running at `http://localhost:3000/`.

---

## 🛠️ Tech Stack

- **Frontend**: React, CSS
- **Backend**: Java, Spring Boot, REST API
- **Database**: PostgreSQL
- **Drag and Drop**: @hello-pangea/dnd
- **Deployment**: In progress

---

## 📌 Next Features (coming soon)

- 📊 Habit & task completion **statistics** (weekly, monthly)
- 🔄 **Google Calendar integration**
- 🪄 **Responsive design improvements**
- ⚙️ **Settings page** for more personal design
- 🧠 Smart recommendations engine (future idea!)
- 🚀 **Public live version of the app for users**

---

## 🙋‍♀️ Author

**Rachel Belokopytov**  
[GitHub](https://github.com/RachelB9913) | [LinkedIn](https://www.linkedin.com/in/rachel-belokopytov/)

