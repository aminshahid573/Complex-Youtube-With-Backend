# VideoVerse - Modern Video Sharing Platform

## 📝 Project Description

VideoVerse is a comprehensive video sharing platform inspired by YouTube. It provides users with a seamless experience to upload, view, like, and comment on videos. The platform also supports features like user subscriptions, playlist creation, and social interactions through tweets.

This full-stack application demonstrates modern web development practices with a React.js frontend and Express.js backend, providing a responsive, interactive user experience.

## ✨ Features

### User Management
- User registration and authentication
- Profile management with avatars and cover images
- Secure password handling
- JWT-based authentication

### Video Features
- Video uploads with thumbnails
- Video playback
- View count tracking
- Video details (title, description, duration)
- Video search and filtering

### Social Interactions
- Like/dislike videos
- Comment on videos
- Reply to comments
- Subscribe to channels
- Real-time notification system

### Content Organization
- Create and manage playlists
- Add/remove videos to playlists
- Share playlists with others

### Social Media Integration
- Post tweets
- Like tweets
- Share content across platforms

## 🛠️ Tech Stack

### Frontend
- **React.js**: UI library for building interactive user interfaces
- **React Router**: For navigation and routing
- **Redux**: State management
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Build tool and development server

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication using JSON Web Tokens
- **Multer**: File upload handling
- **Cloudinary**: Cloud storage for media files
- **Bcrypt**: Password hashing

## 🚀 Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/videoverse.git
cd videoverse
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup
1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Create a `.env` file in the frontend directory:
```
VITE_APP_BASE_URL=http://localhost:8000/api/v1
```

3. Start the frontend development server:
```bash
npm run dev
```

4. Access the application at `http://localhost:5173`

## 📖 Usage

### User Account
1. Register for a new account
2. Update your profile information and upload avatar/cover images
3. Browse videos on the platform

### Video Management
1. Upload videos by clicking the "Upload" button
2. Add title, description, and thumbnails to your videos
3. View analytics for your uploaded content

### Interacting with Content
1. Like/dislike videos
2. Comment on videos
3. Subscribe to channels you enjoy
4. Create playlists to organize your favorite videos

### Social Features
1. Post tweets to share thoughts
2. Interact with other users through comments and likes
3. Build your subscriber base

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

