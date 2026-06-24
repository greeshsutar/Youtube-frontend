# 🎬 YouTube Clone (MERN Stack)

A full-stack YouTube Clone built using the MERN stack (MongoDB, Express, React, Node.js).
This project allows users to authenticate, upload videos, watch videos, interact with content, and manage their own channel.

---

## 🚀 Live Features

### 🔐 Authentication

* User Registration & Login
* JWT-based authentication
* Protected routes (Upload, Channel)

### 🏠 Home Page

* Video grid display
* Search videos by title/channel
* Category-based filtering (Tech, Music, Gaming, etc.)
* Responsive layout

### 📺 Video Player Page

* YouTube video playback (iframe support)
* Title, description, and channel info
* Like / Dislike functionality
* Views count
* Comment system:

  * Add comment
  * Edit comment
  * Delete comment (only own comments)

### 📤 Upload Feature

* Upload video with:

  * Title
  * Description
  * Thumbnail URL
  * Video URL
  * Category

### 📡 Channel Page

* Create channel (authenticated users)
* View own uploaded videos
* Delete videos
* Manage content

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Axios
* Tailwind CSS
* Context API (Authentication)

### Backend

* Node.js
* Express.js
* MongoDB (Atlas / Local)
* JWT Authentication
* Mongoose ODM

---

## 📂 Project Structure

```
Youtube-Project/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── api/
│   └── ...
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── ...
```

---

## 🔗 Repositories

* 🔹 Frontend: https://github.com/greeshsutar/Youtube-frontend
* 🔹 Backend: https://github.com/greeshsutar/Youtube-Clone

---

## ⚙️ Setup Instructions

### 1️⃣ Clone both repositories

```bash
git clone https://github.com/greeshsutar/Youtube-frontend.git
git clone https://github.com/greeshsutar/Youtube-Clone.git
```

---

### 2️⃣ Setup Backend

```bash
cd Youtube-Clone
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd Youtube-frontend
npm install
npm run dev
```

---

## 🧪 Sample Data

Make sure MongoDB has:

* Users
* Videos
* Channels

👉 You can import sample JSON data if needed.

---

## 📱 Responsiveness

* Mobile ✅
* Tablet ✅
* Desktop ✅

---

## 🎥 Demo (Recommended)

👉 Record a short demo showing:

* Register/Login
* Upload video
* Watch video
* Like/Dislike
* Comment
* Channel page

---

## 📌 Notes

* Uses ES Modules (import/export)
* Built with Vite (no CRA)
* Clean folder structure
* Scalable backend architecture

---

## 👨‍💻 Author

**Greesh Sutar**
Full Stack Developer (MERN)

---

## ⭐ Conclusion

This project demonstrates a real-world full-stack application with authentication, CRUD operations, and responsive UI, closely replicating core YouTube functionality.
