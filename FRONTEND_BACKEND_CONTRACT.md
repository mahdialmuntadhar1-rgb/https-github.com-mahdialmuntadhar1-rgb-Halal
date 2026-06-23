# HALAL Matchmaking - Frontend/Backend API Contract

This document defines the clear integration interfaces between the completed React SPA frontend and any future Node.js / Express backend service. It documents all expected HTTP endpoints, request payloads, response data structures, and the TypeScript state transitions that support compliance and local-first simulation flow.

---

## 1. Expected API Endpoints

### Auth Module (`/api/auth/*`)

#### `POST /api/auth/register`
Creates a brand new user account with authentic security parameters.
* **Request Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123",
    "fullName": "Karwan Ali"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "u101",
      "email": "user@example.com",
      "fullName": "Karwan Ali"
    },
    "token": "jwt_session_token_value"
  }
  ```

#### `POST /api/auth/login`
Authenticates a user session.
* **Request Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "u101",
      "email": "user@example.com",
      "fullName": "Karwan Ali"
    },
    "token": "jwt_session_token_value"
  }
  ```

#### `POST /api/auth/logout`
Terminates user session and revokes JWT.
* **Response (200 OK)**:
  ```json
  { "success": true, "message": "Logged out successfully" }
  ```

#### `GET /api/auth/me`
Retrieves current authenticated user summary.
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  ```json
  {
    "id": "u101",
    "email": "user@example.com",
    "fullName": "Karwan Ali"
  }
  ```

---

### Profile Module (`/api/profile/*`)

#### `GET /api/profile/me`
Fetches the detailed companion profile data for matchmaking.
* **Response (200 OK)**:
  ```json
  {
    "id": "p101",
    "name": "Karwan",
    "gender": "male",
    "age": 28,
    "governorate": "Sulaymaniyah",
    "country": "Iraq",
    "city": "Rania",
    "religion": "islam",
    "sect": "sunni",
    "ethnicity": "kurdish",
    "education": "B.Sc. in Computer Science",
    "profession": "Systems Administrator",
    "aboutMe": "A peaceful individual focusing on sustainable technology assets...",
    "intention": "To establish a respectful family based on joint understanding...",
    "timeline": "Within 1 year",
    "wantsChildren": "Yes, definitely",
    "languages": ["Kurdish", "Arabic", "English"],
    "privacySettings": {
      "photoVisibility": "blurred",
      "nameDisplay": "first_name",
      "profileVisibility": "verified_only"
    }
  }
  ```

#### `PUT /api/profile/me`
Updates user profile settings and details.
* **Request Payload**: Partial match profile structure.
* **Response (200 OK)**: Complete upgraded profile structure.

#### `POST /api/profile/photo`
Handles image uploading. The server converts to secure cloud static object.
* **Request Form Data**: `image` file binary.
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "avatarUrl": "https://storage.halalmatchmaking.com/avatars/p101_v3.jpg"
  }
  ```

#### `PUT /api/profile/privacy`
Modifies picture and coordinate secrecy parameters.
* **Request Payload**:
  ```json
  {
    "photoVisibility": "blurred",
    "nameDisplay": "initials"
  }
  ```
* **Response (200 OK)**: Updated settings block.

---

### Matches Module (`/api/matches/*`)

#### `GET /api/matches`
Queries potential candidates filtered by advanced compatibility indices.
* **Query Parameters**:
  * `gender`: `male` | `female`
  * `minAge`: number
  * `maxAge`: number
  * `governorate`: string (Iraq provinces)
  * `photoVisibility`: `All` | `Blurred Only` | `Visible Only`
* **Response (200 OK)**: Array of filtered `MatchProfile` entities.

#### `GET /api/matches/:id`
Retrieves granular bio of specific match with appropriate privacy masking applied.
* **Response (200 OK)**: Single masked/unmasked `MatchProfile`.

#### `POST /api/requests`
Submits a serious matchmaking request to access communication and reveal portraiture.
* **Request Payload**:
  ```json
  {
    "targetMatchId": "f1"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "requestId": "req_5001",
    "senderId": "u101",
    "receiverId": "f1",
    "status": "sent"
  }
  ```

#### `PUT /api/requests/:id/accept`
Accepts a request, allowing direct mutual connection, photo reveal, and text chat.
* **Response (200 OK)**: Connection upgraded to `accepted`.

#### `PUT /api/requests/:id/decline`
Declines matching proposal, safely hiding biographical tracks.
* **Response (200 OK)**: Status updated to `declined`.

---

### Chat Module (`/api/conversations/*`)

#### `GET /api/conversations`
Retrieves chats with matching candidates. Only return conversations where requests have status = `accepted`.
* **Response (200 OK)**: Array of current active conversational channels.

#### `GET /api/conversations/:id/messages`
Retrieves structural dialogs.
* **Response (200 OK)**: Historical chat feed.

#### `POST /api/conversations/:id/messages`
Appends synchronous message body to channel log.
* **Request Payload**:
  ```json
  {
    "text": "Thank you for sharing your thoughts on managing family consulting early."
  }
  ```
* **Response (201 Created)**: Saved `Message` item.

---

### Safety Module (`/api/reports` & `/api/blocks`)

#### `POST /api/reports`
Flags an account for moderator inspection inside the virtual trust framework.
* **Request Payload**:
  ```json
  {
    "reportedProfileId": "m3",
    "reason": "Inappropriate or casual language",
    "detail": "Violates the strict marital purpose directive of HALAL."
  }
  ```
* **Response (201 Created)**: `{ "success": true, "ticketId": "rep_903" }`

#### `POST /api/blocks`
Immediately severs compatibility, hiding matching records instantly.
* **Request Payload**: `{ "blockedProfileId": "m3" }`
* **Response (201 Created)**: `{ "success": true, "message": "Profile blocked successfully" }`

#### `DELETE /api/blocks/:id`
Removes target profile from blocklist.
* **Response (200 OK)**: Unblocked confirmation.

---

## 2. Frontend Data Models (Structures)

These structures align exactly with TypeScript declarations in `/src/types.ts`.

### MatchProfile
```typescript
interface MatchProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  governorate: string;
  country: string;
  religion: 'islam' | 'other';
  sect?: 'sunni' | 'shiaa' | 'other';
  ethnicity: string;
  profession: string;
  education: string;
  intention: string;
  timeline: string;
  wantsChildren: string;
  communicationPreference: string;
  valuesSummary: string[];
  verified: boolean;
  photoStatus: 'visible' | 'blurred' | 'hidden' | 'initials' | 'unlocked';
  avatarSeed: string;
  avatarUrl: string;
  compatibilityScore: number;
  languages: string[];
  aboutMe: string;
  dealbreakers: string[];
  requestStatus: 'none' | 'sent' | 'accepted' | 'declined';
}
```

### UserProfile (Authenticated Self)
```typescript
interface UserProfile {
  name: string;
  gender: 'male' | 'female' | '';
  age: number;
  country: string;
  governorate: string;
  city: string;
  religion: 'islam' | 'other' | '';
  sect: 'sunni' | 'shiaa' | 'other' | '';
  ethnicity: string;
  education: string;
  profession: string;
  intention: string;
  timeline: string;
  wantsChildren: string;
  hasPhoto: boolean;
}
```

### Message
```typescript
interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}
```
