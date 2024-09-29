# Click-Race

**Group Project**

### Team Members:
- **Risky** (Team Leader)
- **Fata** (Member)
- **Reiza** (Member)
- **Zahrah** (Member)

---

## **Overview**
**Click-Race** is a clicker game that uses various modern web technologies, including:

- **Backend**: Express.js
- **Frontend**: React.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Real-Time Communication**: Socket.io

This project allows users to register, log in, play the game, and compete by submitting their scores. The real-time component ensures that all scores are updated dynamically during gameplay.

---

## **API Documentation**

### **Base URL**:
- http://<your-server-url>


### **Endpoints**:

1. **Root Endpoint**
   - **Method**: `GET`
   - **URL**: `/`
   - **Description**: Returns a simple message to ensure the server is running.
   - **Response**:
     ```json
     {
       "message": "Hello World!"
     }
     ```

2. **User Registration**
   - **Method**: `POST`
   - **URL**: `/register`
   - **Description**: Registers a new user for the Click-Race game.
   - **Request Body**:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Response**:
     - **Error**:
       ```json
       {
         "message": "Username must be unique"
       },
       {
         "message": "Username can't be empty"
       }
       ```

3. **Authorization Middleware**
   - Used to authorize users before accessing certain endpoints. It is applied to all endpoints after registration.

4. **Get All Scores**
   - **Method**: `GET`
   - **URL**: `/score`
   - **Description**: Retrieves all players' scores.
   - **Response**:
     ```json
     [
       {
         "id": 1,
         "username": "string",
         "score": "integer"
       }
     ]
     ```

5. **Add Score**
   - **Method**: `POST`
   - **URL**: `/score`
   - **Description**: Adds a new score for the authenticated user.
   - **Request Body**:
     ```json
     {
       "score": "integer"
     }
     ```

6. **Get My Score**
   - **Method**: `GET`
   - **URL**: `/myscore`
   - **Description**: Retrieves the score of the logged-in user.
   - **Response**:
     ```json
     {
       "username": "string",
       "score": "integer"
     }
     ```

---

## **Database Schema**

### **Users Table**
- `id`: Primary Key
- `username`: Unique string
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### **Scores Table**
- `id`: Primary Key
- `userId`: Foreign Key to Users table
- `score`: Integer
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## **Real-Time Communication (Socket.io)**

The real-time aspect of the game is handled using **Socket.io**. Events are used to update the scores dynamically without refreshing the page.

### Events:
1. **User Join Event**
   - **Event Name**: `userJoin`
   - **Description**: Triggered when a user joins the game.

2. **Update Score Event**
   - **Event Name**: `updateScore`
   - **Description**: Used to send the real-time score updates as users play.

---

## **How to Run the Project**

### **Backend Setup**
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
3. Set up PostgreSQL database and configure the `.env` file with database credentials.
4. Run migrations and seeders:
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
5. Start the backend server:
   npm run start


### **Frontend Setup**
1. Navigate to the `client` directory.
2. Install dependencies:
   npm install
3. Start the frontend:
   npm run dev


### **socket.io**
- Ensure that the Socket.io server and client are set up properly to enable real-time score updates.