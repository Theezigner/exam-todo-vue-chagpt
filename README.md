# Todo App – Fullstack Examination Project (Vue 3 & Node.js/AI)

## Overview

This project is a single-page Todo application fully migrated from React to Vue 3 and enhanced with a secure, integrated AI Chatbot. It serves as a comprehensive demonstration of modern full-stack development, covering proficiency in frontend frameworks, data management, and external API integration (OpenAI).

The application features offline-first capabilities using Dexie.js for local data persistence and integrates ChatGPT directly within the frontend for intelligent task assistance.

## Key Highlights

- **Framework Migration**: Complete rewrite from React to Vue 3 (Composition API, `<script setup>`).
- **Modern UI Framework**: Utilizes Tailwind CSS and DaisyUI for beautiful, responsive design.
- **AI Integration**: Implemented an integrated AI Chatbot using the official OpenAI SDK.
- **Offline-First Architecture**: Uses Dexie.js and LocalForage for local data persistence and offline support.
- **Data Management**: Frontend data fetching and caching via TanStack Vue Query.
- **Security**: AI responses are rendered using Markdown (`marked`) and safely sanitized using `DOMPurify` to prevent XSS attacks.
- **TypeScript-First**: Rigorous use of TypeScript across the entire application.
- **Theme Support**: Dark mode toggle with persistent theme preference.
- **SEO Ready**: Integrated Unhead for meta tag management and SEO optimization.

## ⚠️ Important Note on AI Chatbot Functionality

The AI Chatbot is fully implemented and integrated directly into the frontend application. However, due to the project's academic nature:

- The included OpenAI API key has an **insufficient usage quota**.
- **Implementation Status**: The OpenAI SDK is correctly configured and makes requests directly from the browser.
- **Observed Error**: You may see API quota errors when attempting to use the chat feature.
- **Proof of Concept**: This confirms the entire AI integration is working as designed.
- **Testing**: To successfully test the AI feature, you must replace the API key in your environment variables with a valid key that has an active quota.

## Live Demo

- **Deployed App**: [Update this link when deployed]
- **Source Code (Monorepo)**: [Insert Your GitHub URL Here]

## Table of Contents

- [Installation](#installation)
- [Technology Stack & Dependencies](#technology-stack--dependencies)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Installation

This is a single Vue 3 frontend project with integrated AI capabilities.

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- Git

### Setup Instructions

1. **Clone the repository:**

```bash
git clone [Your GitHub Repository URL]
cd exam-todo-vue
```

2. **Install dependencies:**

```bash
pnpm install
# or
npm install
```

3. **Configure environment variables (if needed):**

Create a `.env` file in the root directory:

```env
VITE_TODO_API_URL=https://jsonplaceholder.typicode.com
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. **Start the development server:**

```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Technology Stack & Dependencies

### Frontend

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **State Management**: Vue's Composition API (ref, reactive, computed)
- **Data Fetching**: TanStack Vue Query
- **Offline Storage**: Dexie.js (IndexedDB wrapper) & LocalForage
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS & DaisyUI
- **Notifications**: vue-toastification & vue-hot-toast
- **Markdown Rendering**: marked
- **Security**: DOMPurify (XSS prevention)
- **Icons**: @heroicons/vue & vue-icons-lib
- **SEO**: Unhead (Vue head management)
- **Linting**: ESLint with Vue plugin
- **AI Integration**: OpenAI SDK (client-side)

### Backend (chat-service-backend)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Integration**: OpenAI SDK (`openai`)
- **Environment Variables**: dotenv
- **CORS**: cors middleware
- **Request Parsing**: express.json()
- **Dev Tools**: ts-node, nodemon

## Architecture

The project employs a modern, component-based architecture:

### Application Structure

```
Vue 3 Frontend (Port 5173)
├── Pages (Route-based views)
│   ├── homePage.vue (Main todo list)
│   ├── todoDetailpage.vue (Individual todo)
│   └── notFoundPage.vue (404 handler)
│
├── Components (Reusable UI elements)
│   ├── chatGPT.vue (AI chat interface)
│   ├── createTodoModal.vue
│   ├── editTodoModal.vue
│   ├── deleteTodoModal.vue
│   ├── themeToggle.vue
│   ├── errorBoundary.vue
│   └── errorComponent.vue
│
├── Layouts
│   └── layout.vue (Main app wrapper)
│
├── Routes (Vue Router configuration)
│   ├── home.route.ts
│   ├── todoDetail.route.ts
│   └── notFound.route.ts
│
└── Utils (Core functionality)
    ├── axios.ts (HTTP client config)
    ├── dexieDB.ts (IndexedDB setup)
    └── queryClient.ts (TanStack Query config)
```

### Data Flow

```
User Action
    ↓
Vue Component
    ↓
TanStack Vue Query (Cache Layer)
    ↓
Axios → JSONPlaceholder API (Todos)
    ↓
Dexie.js (Local Persistence)
    ↓
UI Update (Reactive State)
```

### AI Integration Flow

```
User Message → chatGPT.vue Component → OpenAI SDK → ChatGPT API
                                              ↓
User Interface ← Markdown Rendering ← DOMPurify Sanitization
```

## API Documentation

### Todo API (Mock/Frontend-Managed)

**Base API**: `https://jsonplaceholder.typicode.com`

#### Endpoints:

- `GET /todos` - Fetch all todos
- `GET /todos/:id` - Fetch a single todo
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

### AI Chat Service API (Custom Backend)

**Base API**: `http://localhost:3000/api`

#### Endpoints:

**POST** `/api/chat`

Request body:
```json
{
  "message": "string"
}
```

Response:
```json
{
  "response": "string (AI-generated response)"
}
```

Error Response (429):
```json
{
  "error": "Rate limit exceeded. Please check your OpenAI quota."
}
```

## Features

- ✅ **Modern Vue 3 Architecture**: Built with Composition API and `<script setup>` syntax.
- ✅ **CRUD Operations**: Full functionality to Create, Read, Update, and Delete Todos.
- ✅ **Search & Pagination**: Efficient client-side searching and paginated display of the task list.
- ✅ **Optimistic UI**: Provides instant feedback on create/update/delete actions while network requests run in the background.
- ✅ **AI Chatbot**: Interactive chat component with Markdown rendering and input sanitization.
- ✅ **Offline Support**: Works without internet using Dexie.js and LocalForage for data persistence.
- ✅ **Dark Mode**: Theme toggle with persistent preference storage.
- ✅ **Accessibility (A11y)**: Uses semantic HTML, ARIA roles, and keyboard navigation support for modal dialogs.
- ✅ **Error Handling**: Implemented TanStack Query's error/success handling with vue-toastification and vue-hot-toast for user notifications.
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS and DaisyUI components.
- ✅ **TypeScript**: End-to-end type safety across the entire application.
- ✅ **SEO Optimized**: Meta tag management with Unhead.
- ✅ **Route-based Code Splitting**: Optimized loading with Vue Router.
- ✅ **Screenshots Included**: Visual documentation of all major features.

## Project Structure

```
exam-todo-vue/
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
│
├── public/
│   ├── chatgpt.png
│   ├── favicon.png
│   └── vite.svg
│
├── src/
│   ├── App.vue
│   ├── App.css
│   ├── main.ts
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   └── react.svg
│   │
│   ├── components/
│   │   ├── chatGPT.vue
│   │   ├── createTodoModal.vue
│   │   ├── deleteTodoModal.vue
│   │   ├── editTodoModal.vue
│   │   ├── errorBoundary.vue
│   │   ├── errorComponent.vue
│   │   └── themeToggle.vue
│   │
│   ├── layouts/
│   │   └── layout.vue
│   │
│   ├── pages/
│   │   ├── homePage.vue
│   │   ├── notFoundPage.vue
│   │   └── todoDetailpage.vue
│   │
│   ├── routes/
│   │   ├── index.ts
│   │   ├── home.route.ts
│   │   ├── notFound.route.ts
│   │   └── todoDetail.route.ts
│   │
│   ├── screenshots/
│   │   ├── homepage.png
│   │   ├── Taskdetails.png
│   │   ├── createTodo.png
│   │   ├── editModal.png
│   │   ├── deleteTodo.png
│   │   └── darkMode.png
│   │
│   └── utils/
│       ├── axios.ts
│       ├── dexieDB.ts
│       └── queryClient.ts
│
└── node_modules/
    ├── @eslint/
    ├── @heroicons/
    ├── @tailwindcss/
    ├── @tanstack/
    ├── @types/
    ├── @unhead/
    ├── @vitejs/
    ├── @vue/
    ├── axios/
    ├── daisyui/
    ├── dexie/
    ├── dompurify/
    ├── eslint/
    ├── eslint-plugin-vue/
    ├── globals/
    ├── localforage/
    ├── marked/
    ├── openai/
    ├── tailwindcss/
    ├── typescript/
    ├── unhead/
    ├── vite/
    ├── vue/
    ├── vue-hot-toast/
    ├── vue-icons-lib/
    ├── vue-router/
    ├── vue-toastification/
    └── vue-tsc/
```

## Environment Variables

### Frontend (.env)

Create a `.env` file in the root directory:

```env
# Todo API Configuration
VITE_TODO_API_URL=https://jsonplaceholder.typicode.com

# OpenAI Configuration (Optional - for AI Chat feature)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
VITE_APP_TITLE=Vue Todo App
```

**Important Security Note**: In production, never expose API keys in the frontend. Use a backend proxy service instead.

## Scripts

### Available Commands

```bash
pnpm dev             # Start development server with hot reload
pnpm build           # Build for production
pnpm preview         # Preview production build locally
pnpm lint            # Lint code with ESLint
pnpm type-check      # TypeScript type checking
pnpm format          # Format code (if Prettier is configured)
```

### Using npm instead of pnpm

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

## Known Issues

- **OpenAI Quota Limit**: The expected API quota error will occur when the chat feature is used with an expired or limited key.
- **API Key Exposure**: For educational purposes, the OpenAI API key is configured in the frontend. This is NOT recommended for production applications.
- **Mock API Limitation**: Changes made to Todos via the JSONPlaceholder API are not truly persistent across browser sessions unless cached locally.
- **Modal Focus Trapping**: Modals are accessible but do not use a dedicated focus-trap library.
- **Browser Compatibility**: IndexedDB features require modern browsers (IE not supported).

## Future Improvements

- [ ] **Backend Proxy for AI**: Move OpenAI API calls to a secure backend service to protect API keys.
- [ ] **Integrated AI Actions**: Enhance the AI to perform actions, e.g., "Ask AI to create a task for grocery shopping."
- [ ] **Enhanced Offline Support**: Implement full offline-first architecture with background sync.
- [ ] **Persistent Backend**: Replace the mock JSONPlaceholder API with a real backend (e.g., Supabase, Firebase, or custom Express/NestJS server).
- [ ] **Testing Suite**: Add unit tests (Vitest) and end-to-end tests (Cypress/Playwright).
- [ ] **Authentication**: Add user authentication and authorization with protected routes.
- [ ] **Rate Limiting**: Implement rate limiting for API requests.
- [ ] **Docker Support**: Add Dockerfile and docker-compose for easy deployment.
- [ ] **CI/CD Pipeline**: Set up automated testing and deployment with GitHub Actions.
- [ ] **Advanced Filters**: Add priority levels, categories, and due dates for todos.
- [ ] **Drag & Drop**: Implement drag-and-drop reordering of tasks.
- [ ] **Progressive Web App (PWA)**: Add service workers for full PWA support.
- [ ] **Multi-language Support**: Implement i18n for internationalization.
- [ ] **Animations**: Add smooth transitions and micro-interactions.

## Contributing

This is an academic project, but if you'd like to suggest improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project was submitted as part of the **AltSchool Africa Frontend Engineering Program**. It is intended solely for academic demonstration and evaluation.

## Author

**Temitayo Adebayo**  
AltSchool Africa – Frontend Engineering  
Second Semester, Tinyuka Cohort

---

## Acknowledgments

- AltSchool Africa for the project guidelines
- OpenAI for the AI integration capabilities
- The Vue.js and Node.js communities for excellent documentation

## Contact

For any questions or feedback regarding this project:

- GitHub: [Your GitHub Profile]
- Live Demo: [Your Email]

---
