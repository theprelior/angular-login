# Full-Stack Application

This repository contains a full-stack application built with a .NET backend and an Angular frontend.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Backend Setup (.NET)](#backend-setup-net)
  - [Frontend Setup (Angular)](#frontend-setup-angular)
- [Configuration](#configuration)
- [Building the Project](#building-the-project)
- [Running the Application](#running-the-application)
- [License](#license)

## Project Overview

This project is a complete full-stack application that includes a .NET backend for handling API requests and an Angular frontend for the user interface. The application provides a simple user authentication system with login and registration features.

## Technologies Used

- **Backend:**
  - .NET 7.0
  - MongoDB (Database)
  - JWT (JSON Web Tokens)

- **Frontend:**
  - Angular 14.0.0
  - Bootstrap 5

## Getting Started

### Backend Setup (.NET)

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo/backend
   ```

2. **Restore Dependencies:**

   ```bash
   dotnet restore
   ```

3. **Configure the Application:**

   - Open the `appsettings.json` file located at `backend/bin/Release/appsettings.json`.
   - Update the `ConnectionString` and `DatabaseName` under the `MongoDB` section to match your MongoDB setup.
   - Update the `Jwt` settings to suit your environment.

   Example:
   ```json
   {
      "MongoDB": {
         "ConnectionString": "your-mongodb-connection-string",
         "DatabaseName": "your-database-name"
      },
      "Jwt": {
         "Key": "your-jwt-secret-key",
         "Issuer": "your-domain.com",
         "Audience": "your-domain.com"
      }
   }
   ```

4. **Publish the Application:**

   The backend has already been published. The published files are located in the `backend/bin/Release/net7.0` directory.

   To manually publish (if needed):

   ```bash
   dotnet publish -c Release -o ./publish
   ```

5. **Run the Backend:**

   Navigate to the publish directory and run the application:

   ```bash
   cd backend/bin/Release/net7.0
   dotnet YourApp.dll
   ```

### Frontend Setup (Angular)

1. **Navigate to the Frontend Directory:**

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Build the Application:**

   The frontend has already been built, and the build files are located in the `dist/new-project` directory.

   To manually build (if needed):

   ```bash
   ng build --configuration production
   ```

4. **Deploy or Run Locally:**

   - Deploy the contents of the `dist/new-project` directory to your web server.
   - Or run the application locally using a web server like `http-server`:

   ```bash
   npx http-server dist/new-project
   ```

## Configuration

- **Backend:**
  - Configuration is managed through the `appsettings.json` file.
  
- **Frontend:**
  - Update the `apiUrl` in the `environment.ts` file if the API URL changes.

## Building the Project

- **Backend:** Already built and published in `backend/bin/Release/net7.0`.
- **Frontend:** Already built in `dist/new-project`.

## Running the Application

To run the application:

1. Start the backend by navigating to `backend/bin/Release/net7.0` and running `dotnet YourApp.dll`.
2. Serve the frontend files from the `dist/new-project` directory using a web server.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

This `README.md` file explains step by step how to install, configure, and run the project on the user's system. It is also stated that the user should edit the backend `appsettings.json` file according to their MongoDB connection information.
