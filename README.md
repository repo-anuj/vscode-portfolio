# VS Code Portfolio

A VS Code-inspired portfolio website built with React, TypeScript, and Vite, showcasing my projects and skills as a developer.

![Portfolio Preview](public/portfolio-preview.png)

## Live Demo

Visit the live site: [https://anujkidding-portfolio.vercel.app/](https://anujkidding-portfolio.vercel.app/)

## Features

- **VS Code-inspired UI**: Complete with file explorer, tabs, terminal, and command palette
- **Interactive Experience**: Navigate through different sections like you would in VS Code
- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Authentic VS Code dark theme with customization options
- **Interactive Games**: Bug squasher and memory match games for fun engagement
- **Contact Form**: Integrated contact form with validation and feedback
- **Project Showcase**: Detailed project cards with expandable information
- **Work Experience**: Timeline of professional experience with expandable details
- **Skills Section**: Visual representation of technical skills
- **Social Media Integration**: Connect through various platforms
- **Real-time Like Button**: WebSocket-powered like feature for instant feedback

## Setup

### Environment Variables

This project uses EmailJS for the contact form functionality and a MongoDB backend for the like button. You need to set up the following environment variables:

1. Create a `.env` file in the root directory based on the `.env.example` file:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

2. Replace the placeholder values with your actual credentials.

### Backend Setup

This project includes a backend server for the like button functionality. To set it up:

1. Navigate to the `backend` directory
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory based on `.env.example`:

```
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=3001
NODE_ENV=development
WEBSOCKET_ORIGINS=http://localhost:5173,https://anujkidding-portfolio.vercel.app
```

4. Start the backend server:

```bash
npm run dev
```

For more details, see the [Backend README](backend/README.md).

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
/
├── src/                # Frontend code
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── data/           # Static data files
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Main page components
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
│
└── backend/            # Backend server
    ├── index.js        # Main server file with MongoDB schema
    └── .env            # Backend environment variables
```

## Key Components

- **App.tsx**: Main application component
- **Header.tsx**: Top navigation bar
- **Sidebar.tsx**: Left sidebar with navigation icons
- **FileExplorer.tsx**: File tree navigation
- **TabsBar.tsx**: Open file tabs
- **Terminal.tsx**: Interactive terminal with commands
- **CommandPalette.tsx**: Command search interface
- **Projects.tsx**: Project showcase
- **Work.tsx**: Work experience timeline
- **Skills.tsx**: Skills visualization
- **Profile.tsx**: Personal profile information

## Tech Stack

- **React**: Frontend library for building the UI
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Vite**: Build tool and development server
- **EmailJS**: Email service for the contact form
- **Lucide React**: Icon library
- **Express**: Backend server framework
- **MongoDB**: Database for storing likes
- **Socket.IO**: Real-time WebSocket communication
- **OpenRouter API**: AI integration for the chatbot

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: Preventing unnecessary re-renders
- **Image Optimization**: Optimized images for faster loading
- **Preloading**: Strategic preloading of components

## SEO Optimizations

- **Meta Tags**: Comprehensive meta tags for better indexing
- **Semantic HTML**: Proper HTML structure for accessibility and SEO
- **Sitemap**: XML sitemap for search engine crawling
- **Robots.txt**: Guidance for search engine crawlers

## Contact

Feel free to reach out if you have any questions or feedback!

- Email: 00a20.j50@gmai.com.com
- GitHub: [repo-anuj](https://github.com/repo-anuj)
- LinkedIn: [anuj-dubey](https://www.linkedin.com/in/anuj-0-dubey-26963527b)
