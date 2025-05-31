# Educational Games API

A RESTful API built with Node.js, Express, and Firestore for managing students and teachers in an educational games platform.

## Features

- CRUD operations for students and teachers
- Data validation using Joi
- Error handling
- Firebase/Firestore integration

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Firebase project with Firestore database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up Firebase credentials:
   - Go to your Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key" to download your service account JSON file
   - From the JSON file, copy the following values:
     - `private_key`: Copy the entire private key including "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----"
     - `client_email`: Copy the service account email address
4. Create a `.env` file based on `.env.example` and fill in your Firebase credentials:
   - Set `FIREBASE_PRIVATE_KEY` to your private key (keep the quotes and \n characters)
   - Set `FIREBASE_CLIENT_EMAIL` to your service account email
   - Fill in the remaining Firebase configuration values
5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Teachers

- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get a teacher by ID
- `POST /api/teachers` - Create a new teacher
- `PUT /api/teachers/:id` - Update a teacher
- `DELETE /api/teachers/:id` - Delete a teacher

## Data Models

### Student

```json
{
  "name": "John Doe",
  "age": 10,
  "address": "123 School St, City",
  "grade": "5th Grade",
  "parentName": "Jane Doe",
  "parentEmail": "jane.doe@example.com",
  "notes": "Allergic to peanuts"
}
```

### Teacher

```json
{
  "name": "Alice Smith",
  "age": 35,
  "address": "456 Teaching Ave, Town",
  "subject": "Mathematics",
  "email": "alice.smith@example.com",
  "phone": "555-123-4567",
  "qualification": "Master in Education",
  "yearsOfExperience": 8,
  "notes": "Available for after-school tutoring"
}
```

## License

MIT