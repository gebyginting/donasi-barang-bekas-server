# ♻️ Donasi Barang Bekas | Backend API

This is the backend service for the **Donasi Barang Bekas** mobile application.  
Built with **Node.js**, **Express.js**, and **MongoDB**, it provides APIs for authentication, donation management, campaign listings, and file/image uploads.

> 🚧 **Note:** This project is still under development. Features and API endpoints may change frequently until the stable release.

---

## ✨ Features

- 🔐 **Authentication & Authorization**
  - Register, login with JWT
  - Role-based access (Admin / Donor / Receiver / Guest)
- 👥 **User Management**
  - Profile management
  - Password hashing with bcrypt
- 🎁 **Donation Management**
  - Add, edit, delete donations
  - View donation history
- ☁️ **Cloudinary Integration**
  - Upload and manage donation images
- 📂 **Multer Support**
  - Handle file uploads locally or to cloud
- 🌍 **CORS Enabled**
  - Secure cross-origin requests

---

## 🔧 Tech Stack

| Technology   | Description                                |
|--------------|--------------------------------------------|
| Node.js      | JavaScript runtime environment             |
| Express.js   | Web framework for building REST APIs        |
| MongoDB      | NoSQL database for storing data             |
| Mongoose     | ODM for MongoDB                            |
| JWT          | Authentication & authorization middleware   |
| Bcrypt.js    | Password hashing                           |
| Multer       | File upload handling                       |
| Cloudinary   | Cloud storage for images                   |
| Dotenv       | Manage environment variables               |
| Nodemon      | Development auto-reloader                  |

---

## 🛠️ Setup Instructions

1. **Clone this repository**
    ```bash
    git clone https://github.com/gebyginting/donasi-barang-bekas-server.git
    cd donasi-barang-bekas-server
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Setup environment variables**
    Create a `.env` file in the root folder:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. **Run the server**
    ```bash
    # Development
    npm run dev
    
    # Production
    node server.js
    ```

5. **Test the API**
    - Use **Postman** or **Insomnia** to hit the endpoints.
    - Base URL: `http://localhost:5000/api`

---

## ⚠️ Notes

- Make sure MongoDB is running locally or provide a remote connection string.  
- Sensitive credentials (Mongo URI, JWT secret, Cloudinary keys) are stored securely in environment variables and excluded from version control (.gitignore).  
- Only authenticated users can create or manage donations.  

---

## 🙋‍♂️ Author

Developed by **Geby Ginting**  
📧 gebygintingg@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/geby-ginting)  
