rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access the database
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // A user can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // A user can only access their own vehicles
      match /vehicles/{vehicleId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        // A user can only access their own vehicle records
        match /records/{recordId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }

    // Reminders collection
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}

service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
