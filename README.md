# Social Media Platform Backend API

Welcome to the RESTful API for a basic social media platform. This project aims to facilitate user interactions, post management, and notifications within the platform.

## Table of Contents

1. [Introduction](#introduction)
2. [Functionality](#functionality)
3. [Technical Specifications](#technical-specifications)
4. [Setup Instructions](#setup-instructions)
5. [API Documentation](#api-documentation)
6. [Testing](#testing)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

In this project, we've built a backend API using Express.js and TypeScript, with MongoDB as the database solution. The API supports various functionalities including user management, posts and feed management, likes and comments on posts, and notifications.

## Functionality

### User Management

- **Register**: Users can create accounts with their name, email, and password.
- **Login**: Users can authenticate using JWT tokens.

### Posts and Feed

- **Create Posts**: Users can create posts with text, optional image/video attachments.
- **Follow Users**: Users can follow other users.
- **Personalized Feed**: Users can see posts from users they follow.
- **Pagination**: Implemented for efficient data retrieval.

### Likes and Comments

- **Like Posts**: Users can like posts created by others.
- **Comment on Posts**: Users can comment on posts.
- **View Counts**: Users can see the number of likes and comments on a post.

### Notifications

- **Real-time Notifications**: Users receive notifications for mentions, likes, and comments using websockets.

## Technical Specifications

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Caching**: Implemented caching mechanisms for improved response times.
- **Asynchronous Programming**: Used async/await for efficient handling of concurrent requests.
- **Error Handling**: Implemented error handling with appropriate HTTP status codes.
- **Testing**: Unit tests for code functionality and integration tests for component communication.

## Setup Instructions

To run the API locally, follow these steps:

**Clone the repository:**
   ```bash
   git clone https://github.com/Olusoga/social-media-api
   cd social-media-platform-backend

```
**Install dependecies**
   ```bash
   npm install
```
## Set up environment variables:
Create a `.env` file in the root directory and add the necessary environment variables like:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- (any other required variables)


**Run Server**
   ```bash
   npm start
```
**Access API**
   The API will be accessible at http://localhost:5000/api.

## API Documentation
   Detailed API endpoints and their functionalities are documented here. https://documenter.getpostman.com/view/19781070/2sA3e1Bq8m

## Testing
   Unit Tests: Ensure code functionality with unit tests.
   Integration Tests: Verify communication between different components.

**To run tests:**
```bash
  npm test
```
## Contributing
   Contributions are welcome! Fork the repository and submit a pull request with your improvements.

## License
   This project is licensed under the MIT License.