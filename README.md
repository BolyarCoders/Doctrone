# Doctrone

### AI-powered medical assistant for patients and health monitoring

Doctrone is an intelligent medical assistant designed to help patients manage their medications, monitor treatment schedules, and receive personalized health advice from an AI-driven chatbot.
It serves as a digital companion for individuals with chronic conditions or temporary illnesses — offering smart reminders, symptom analysis, and safe guidance based on the user’s personal medical profile.

# Overview
Doctrone combines the power of AI conversation, medical data tracking, and multi-platform access to create a safe, intelligent, and always-available health companion.
Users can chat directly with the AI to ask about side effects, dosage frequency, or symptoms.
The system analyzes their stored medical data — such as prescriptions, age, blood type, and existing diagnoses — to generate context-aware, medically-relevant responses.

# Core Features
- **AI Chatbot** — Users can ask health-related questions about medications, symptoms, or conditions.
- **Prescription Tracking** — Keeps a history of prescribed drugs, dosages, and intake schedules.
- **Medication Reminders** — Notifies users when it’s time to take their medicine.
- **Health Insights** — The AI analyzes patient data to provide safe and personalized advice.
- **Shared PostgreSQL Database** — Both AI and Main API access the same data securely.
- **Cross-Platform Access** — Available on mobile (React Native) and web (React + Vite).

# System Architecture
## 1. Backend Services
| Component     | Technology       | Description                                                                                  |
| ------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| **Main API**  | C# (.NET)        | Handles authentication, user management, and database communication.                         |
| **AI Server** | Python (Flask)   | Processes chat requests, integrates with AI models, and fetches contextual data from the DB. |
| **Database**  | PostgreSQL       | Stores all user, prescription, and chat data. Shared between the APIs.                       |

## 2. Frontend Interfaces
| Platform          | Stack                     | Purpose                                                                            |
| ----------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| **Mobile App**    | React Native (TypeScript) | Main user interface for chat, reminders, and notifications.                        |
| **Web App**       | React + Vite              | It has the same functionality as the mobile app.                                   |

## 3. Data Model Overview
The PostgreSQL schema includes 6 main entities:

| Table             | Purpose                                                                         |
| ----------------- | ------------------------------------------------------------------------------- |
| **Users**         | Stores patient details (name, blood type, age, gender, diagnoses, credentials). |
| **Prescriptions** | Links users to their prescribed drugs, including dosage and intake schedule.    |
| **Drugs**         | Contains drug names and metadata for AI reference.                              |
| **Chats**         | Manages conversation sessions between users and the AI.                         |
| **Messages**      | Stores individual chat messages exchanged during each session.                  |
| **Folders**       | Allows users to organize their chat sessions and prescriptions.                 |

# Getting Started
## Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- .NET SDK ≥ 8.0
- PostgreSQL ≥ 15
- npm / yarn

## Installation & Start
`# Clone repository`  
`git clone https://github.com/BolyarCoders/Doctrone.git`  
`cd Src`  

`# Install main API dependencies`  
`cd Doctrone.Api/DoctrroneAPI`   
`dotnet restore`   
`dotnet run`   

`# Install AI server dependencies`    
`cd Doctrone.AI`    
`pip install -r requirements.txt`   
`python main.py`  

`# Install web app dependencies`   
`cd Doctrone.Website/react-app`   
`npm install`   
`npm run dev`    

`# Install mobile app dependencies`    
`cd Doctrone.MobileApp`   
`# You need to install the expo-cli dependency and install their mobile app 'Expo Go' from Google Play Store & Apple Store`   
`npm install -g expo-cli`  
`npm install`   
`npx expo start`   
`# Follow the instructions given in the cli in order to run the Doctrone App on your phone`   

# Example Flow
1. User registers and logs into the mobile app (via .NET API).
2. Every new user is asked about their medical prescriptions.
3. The app retrieves the user’s prescriptions and chat history.
4. User asks: “I feel dizzy after taking my pill, is that normal?”
5. Mobile app sends the message to the AI server.
6. AI queries the PostgreSQL DB for that user’s drugs and known side effects.
7. AI replies with context-aware advice (“Mild dizziness is common for DrugX, but monitor your symptoms”).
8. The response is stored in messages, maintaining the medical history thread.

# Tech Stack Summary
| Layer            | Technology                                 |
| ---------------- | ------------------------------------------ |
| Backend          | .NET (C#), Python (Flask)                  |
| Frontend         | React, React Native, Vite                  |
| Database         | PostgreSQL                                 |
| ORM / Migrations | Entity Framework                           |
| AI Layer         | Python (Gemini-2.5-flash model)            |
| Hosting          | Render / Expo Go / Supabase                |

# Contributing
1. Fork the repository
2. Create a feature branch:
`git checkout -b feature/chat-enhancement`
3. Commit with a clear message:
`git commit -m "Add health insight generation to AI responses"`
4. Open a Pull Request to the dev branch.

# License
Licensed under the MIT License — free for personal and commercial use.
See LICENSE for details.

# Future Roadmap
- Integration with wearable health devices.
- Doctor dashboard for remote patient monitoring.
- Voice-based AI interaction.
- Smart emergency alerts for dangerous symptoms.
- Advanced analytics for medication adherence.
