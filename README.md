# 🛒 ShopCart

A modern, full-stack e-commerce application built with the MERN stack, featuring a beautiful Material-UI interface and powered by a custom JSON product database.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![MUI](https://img.shields.io/badge/MUI-5.x-007FFF)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌐 Live Demo

**[View Live Application](https://sd-shopcart.vercel.app/)**

## ✨ Features

- 🎨 **Modern UI/UX** - Clean and responsive interface built with Material-UI components
- 🛍️ **Product Catalog** - Browse products from custom JSON database
- 🔍 **Search & Filter** - Easy product search and category filtering
- 🛒 **Shopping Cart** - Add, remove, and update product quantities
- 💳 **Checkout Process** - Seamless checkout experience
- 👤 **User Authentication** - Secure login and registration system
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized loading and smooth interactions

## 🚀 Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **Material-UI (MUI)** - React component library for elegant design
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API requests
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Data Source
- **products.json** - Custom JSON file containing product data

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18.x or higher)
- npm or yarn
- MongoDB (v6.x or higher)
- Git

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/shopcart.git
cd shopcart
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopcart
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Application

### Development Mode

**Start MongoDB** (if running locally):
```bash
mongod
```

**Run Backend Server:**
```bash
cd backend
npm run dev
```

**Run Frontend Development Server:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Production Server:**
```bash
cd backend
npm start
```

## 📁 Project Structure

```bash
📦 backend  
 ┣ 📂 controllers  
 ┃ ┣ 📜 authController.js  
 ┃ ┣ 📜 orderController.js  
 ┃ ┣ 📜 productController.js  
 ┃ ┗ 📜 userController.js  
 ┣ 📂 middleware  
 ┃ ┣ 📜 authMiddleware.js  
 ┃ ┗ 📜 errorMiddleware.js  
 ┣ 📂 models  
 ┃ ┣ 📜 Order.js  
 ┃ ┣ 📜 Product.js  
 ┃ ┗ 📜 User.js  
 ┣ 📂 routes  
 ┃ ┣ 📜 authRoutes.js  
 ┃ ┣ 📜 orderRoutes.js  
 ┃ ┣ 📜 productRoutes.js  
 ┃ ┗ 📜 userRoutes.js  
 ┣ 📂 utils  
 ┃ ┗ 📜 db.js  
 ┣ 📜 .env  
 ┣ 📜 package.json  
 ┣ 📜 server.js  

📦 frontend  
 ┣ 📂 public  
 ┣ 📂 src  
 ┃ ┣ 📂 assets  
 ┃ ┣ 📂 components  
 ┃ ┃ ┣ 📜 Cart.jsx  
 ┃ ┃ ┣ 📜 Footer.jsx  
 ┃ ┃ ┣ 📜 Header.jsx  
 ┃ ┃ ┣ 📜 Loader.jsx  
 ┃ ┃ ┗ 📜 ProductCard.jsx  
 ┃ ┣ 📂 context  
 ┃ ┃ ┗ 📜 AuthContext.jsx  
 ┃ ┣ 📂 pages  
 ┃ ┃ ┣ 📜 CartPage.jsx  
 ┃ ┃ ┣ 📜 HomePage.jsx  
 ┃ ┃ ┣ 📜 LoginPage.jsx  
 ┃ ┃ ┣ 📜 OrderPage.jsx  
 ┃ ┃ ┣ 📜 ProductPage.jsx  
 ┃ ┃ ┗ 📜 RegisterPage.jsx  
 ┃ ┣ 📂 services  
 ┃ ┃ ┣ 📜 api.js  
 ┃ ┃ ┗ 📜 auth.js  
 ┃ ┣ 📜 App.jsx  
 ┃ ┣ 📜 index.css  
 ┃ ┣ 📜 main.jsx  
 ┃ ┗ 📜 routes.jsx  
 ┣ 📜 .gitignore  
 ┣ 📜 package.json  
 ┣ 📜 vite.config.js  
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?q=query` - Search products

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item quantity (Protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)

### User
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

## 📦 products.json Structure

The `products.json` file in the `backend/data` directory contains product information:

```json
[
  {
    "id": 1,
    "title": "Product Name",
    "price": 99.99,
    "description": "Product description",
    "category": "electronics",
    "rating": {
      "rate": 4.5,
      "count": 120
    },
    "stock": 50
  }
]
```

## 🎨 Key Features Implementation

### Material-UI Components Used
- **AppBar** - Navigation header
- **Drawer** - Side navigation menu
- **Card** - Product display cards
- **Grid** - Responsive layout system
- **Button** - Action buttons
- **TextField** - Form inputs
- **Dialog** - Modal dialogs
- **Badge** - Cart item count
- **Snackbar** - Notifications
- **Pagination** - Product pagination
- **Tabs** - Category navigation

### Cart Management
The shopping cart is managed using React Context API, allowing global state access across components without prop drilling. Cart data is synced with the backend for authenticated users.

### Authentication Flow
JWT-based authentication with protected routes ensures secure access to user-specific features like checkout and order history. Tokens are stored securely and validated on each request.

### Database Seeding
Run the seed script to populate MongoDB with products from `products.json`:

```bash
cd backend
npm run seed
```

## 🚀 Deployment

### Frontend (Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder to Vercel
3. Set environment variables in Vercel dashboard

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful component library
- [MongoDB](https://www.mongodb.com/) for the database solution
- The MERN stack community for excellent documentation

## 📧 Contact

Project Link: [https://github.com/sandeepdara-sd/ShopCart](https://github.com/sandeepdara-sd/ShopCart)

---

⭐ Star this repo if you find it helpful!