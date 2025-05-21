# Weather App

A full-stack weather application that allows users to track weather conditions for different cities. Built with Spring Boot and React.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes and API endpoints
- Secure password handling

### City Management
- Add new cities with name and country
- View list of all cities
- Update city information
- Delete cities
- Search and filter cities

### Weather Tracking
- Record weather conditions for cities
- Track multiple weather parameters:
  - Temperature
  - Humidity
  - Wind Speed
  - Pressure
  - Weather Status
  - Date and Time
- Filter weather records by:
  - City
  - Date range
  - Weather status
- View historical weather data

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- Axios for API calls
- React Router for navigation
- Tailwind CSS for styling

## Project Structure

```
weatherapp/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/smj/weatherapp/
│   │   │       ├── config/         # Configuration classes
│   │   │       ├── controller/     # REST controllers
│   │   │       ├── model/         # Entity classes
│   │   │       ├── repository/    # Data repositories
│   │   │       ├── security/      # Security configuration
│   │   │       └── service/       # Business logic
│   │   └── resources/
│   │       └── application.properties
│   └── test/                      # Test classes
└── pom.xml

weatherapp-frontend/
├── src/
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL
- Maven
- npm or yarn

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd weatherapp
   ```
3. Configure the database in `application.properties`
4. Build the project:
   ```bash
   mvn clean install
   ```
5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd weatherapp-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Cities
- `GET /api/cities` - Get all cities
- `GET /api/cities/{id}` - Get city by ID
- `POST /api/cities` - Create new city
- `PUT /api/cities/{id}` - Update city
- `DELETE /api/cities/{id}` - Delete city

### Weather
- `GET /api/weather` - Get all weather records
- `GET /api/weather/city/{cityId}` - Get weather by city
- `GET /api/weather/range` - Get weather by date range
- `GET /api/weather/status/{status}` - Get weather by status
- `POST /api/weather` - Create new weather record

## Security

The application uses JWT (JSON Web Tokens) for authentication. The token is stored in the browser's local storage and is automatically included in all API requests.

### Token Flow
1. User logs in with credentials
2. Server validates credentials and returns JWT
3. Frontend stores token in localStorage
4. Token is automatically added to all subsequent requests
5. Server validates token for protected endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 