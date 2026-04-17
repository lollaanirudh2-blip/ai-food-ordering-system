# 🍽️ AI-Powered Food Ordering System

An end-to-end full-stack food ordering application with **AI-based recommendations**, **user behavior tracking**, and **analytics dashboard**.

This project simulates a real-world platform like Swiggy/Zomato with intelligent suggestions based on user activity.

---

## 🚀 Features

### 🔐 Authentication

* User Signup & Login
* OTP-based Email Verification
* JWT Authentication
* Protected Routes

---

### 🍴 Core Food Ordering

* Browse Restaurants
* View Menu Items
* Add to Cart
* Increase/Decrease Quantity
* Checkout Flow
* Mock Payment Integration
* Payment Success Page
* Order History
* Order Details View
* Reorder Functionality

---

### 🤖 AI-Powered Recommendations

* **Predicted for You** (based on frequent behavior)
* **Recent Activity Suggestions**
* **Time-Based Suggestions**
* **Trending Now**
* **“What Should I Eat?” Smart Suggestion**

---

### 🔍 Search & Tracking

* Search Restaurants by:

  * Name
  * Cuisine
  * Location
* Search History Storage
* Search Behavior Tracking

---

### 📊 Analytics Dashboard

* Total Orders
* Total Revenue
* Total Users
* Total Events
* Top Ordered Items
* Top Event Types

---

### 🧠 Behavior Tracking

Tracks user actions such as:

* Add to Cart
* Remove from Cart
* Increase/Decrease Quantity
* Place Order
* Reorder
* Search

---

## 🏗️ Tech Stack

### Frontend

* React.js (Vite)
* React Router
* Tailwind CSS
* Axios

### Backend

* FastAPI (Python)
* JWT Authentication
* REST APIs

### Database

* PostgreSQL

### Tools

* DBeaver (DB Management)
* VS Code

---

## 📁 Project Structure

```
ai-food-ordering-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── dependencies/
│   │   ├── core/
│   │   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── App.jsx
```

---

## ⚙️ Setup Instructions

### 🔹 Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` file in backend:

```
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 📌 API Endpoints

### Auth

* `POST /auth/signup`
* `POST /auth/login`
* `POST /auth/verify-otp`

### Restaurants

* `GET /restaurants`
* `GET /restaurants/search?q=`

### Cart

* Add / Remove / Update items

### Orders

* Create order
* Get orders
* Order details
* Reorder

### Recommendations

* `/recommendations/home`
* `/recommendations/instant`
* `/recommendations/trending`

### Analytics

* `/analytics/dashboard`

---

## 🧠 Key Highlights

* Real-world application architecture
* AI-based recommendation engine
* Behavior-driven insights
* Clean UI with modern UX
* Full-stack integration
* Scalable modular backend design

---

## 📸 Screenshots (Add later)

* Home Page
* Recommendation Sections
* Cart Page
* Checkout
* Dashboard

---

## 🚀 Future Enhancements

* Charts in analytics dashboard
* Advanced recommendation scoring
* Redis caching
* Real payment integration
* Admin role-based access
* Deployment (AWS / Vercel / Render)

---

## 👨‍💻 Author

**Anirudh Lolla**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share your feedback!
