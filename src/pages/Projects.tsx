import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, Layers } from 'lucide-react';
import gsap from 'gsap';
import codeplayers from '../projects/codeplayers.png';
import festiva from '../projects/festiva.png';
import linkedin from '../projects/linkedin.png';
import pacman from '../projects/pacman.png';
import rentRideRepeat from '../projects/rentRideRepeat.png';
import portfolioGenerator from '../projects/portfolioGen.png';
import losser from '../projects/losser.png';
import erp from '../projects/ERP-AI.jpg';
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

import { Var, T } from "gt-react";

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate project cards on scroll
      gsap.fromTo('.project-card',
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse'
        }
      }
      );

      // Animate decorative elements
      gsap.to('.floating-icon', {
        y: 'random(-10, 10)',
        x: 'random(-10, 10)',
        rotation: 'random(-15, 15)',
        duration: 'random(2, 3)',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: {
          amount: 1.5,
          from: 'random'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const projects = [
  {
    title: 'ERP-AI System',
    description: 'A scalable ERP system with role-based access and dynamic dashboards for comprehensive business management. Built with modern web technologies for optimal performance.',
    detailedDescription: [
    'Implemented role-based access control system with custom permission management',
    'Designed responsive dashboards with real-time data visualization using Chart.js',
    'Integrated AI-powered analytics for business intelligence and predictive insights',
    'Built RESTful API endpoints with Next.js API routes and implemented data validation'],

    role: 'Lead Developer',
    challenges: 'Designing a scalable database schema that could accommodate various business types while maintaining performance',
    image: erp,
    tags: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB'],
    github: 'https://github.com/repo-anuj/ERP-AI',
    status: 'in-progress',
    year: '2025'
  },
  {
    title: 'LOSSER Portfolio',
    description: 'A modern portfolio website showcasing projects and professional experience. Features clean design, responsive layout, and smooth animations for an optimal user experience.',
    detailedDescription: [
    'Designed and implemented a custom theme system with light/dark mode support',
    'Created responsive layouts that adapt seamlessly to all device sizes',
    'Implemented performance optimizations including code splitting and image optimization',
    'Built custom animations using Framer Motion for enhanced user engagement'],

    role: 'Frontend Developer',
    challenges: 'Balancing aesthetic design with optimal performance across devices while maintaining accessibility standards',
    image: losser,
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/repo-anuj/LOSSER',
    live: 'https://losser.vercel.app',
    status: 'completed',
    year: '2025'
  },
  {
    title: 'RentRideRepeat',
    description: 'A responsive vehicle rental platform with booking system, user management, and payment integration. Optimized for all devices with intuitive navigation.',
    detailedDescription: [
    'Developed a comprehensive booking system with availability calendar and reservation management',
    'Implemented user authentication and profile management with secure data handling',
    'Integrated payment processing with Stripe for secure transactions',
    'Built an admin dashboard for inventory management and booking oversight'],

    role: 'Full Stack Developer',
    challenges: 'Creating a reliable booking system that handles concurrent reservations and prevents double-booking',
    image: rentRideRepeat,
    tags: ['React', 'Next.js', 'Tailwind CSS'],
    github: 'https://github.com/repo-anuj/rentriderepeat-website',
    live: 'https://rentriderepeat-website.vercel.app/',
    status: 'completed',
    year: '2025'
  },
  {
    title: 'Portfolio Generator',
    description: 'Dynamic tool for real-time portfolio generation with user authentication and templating. Allows users to create professional portfolios with minimal effort.',
    detailedDescription: [
    'Built a template system with customizable sections and layouts',
    'Implemented real-time preview functionality using React context',
    'Created a user authentication system with Firebase for secure access',
    'Developed a content management system for easy portfolio updates'],

    role: 'Frontend Developer',
    challenges: 'Designing a flexible template system that allows customization while maintaining professional design standards',
    image: portfolioGenerator,
    tags: ['React', 'Tailwind CSS', 'Firebase'],
    github: 'https://github.com/repo-anuj/portfolio-generator',
    live: 'https://portfolio-generator-nine.vercel.app/',
    status: 'completed',
    year: '2025'
  },
  {
    title: 'Pac-Man Game',
    description: 'A modernized Pac-Man game featuring interactive controls and responsive design. Built with dynamic game logic and smooth animations for an engaging gaming experience.',
    detailedDescription: [
    'Implemented game mechanics including character movement, collision detection, and scoring',
    'Created responsive controls that work on both desktop and mobile devices',
    'Designed custom animations for game characters and interactions',
    'Built a high-score system with local storage integration'],

    role: 'Game Developer',
    challenges: 'Implementing collision detection and game physics that work consistently across different devices and screen sizes',
    image: pacman,
    tags: ['React', 'Tailwind CSS', 'Game Development'],
    github: 'https://github.com/repo-anuj/packman-best',
    live: 'https://packman-best.vercel.app/',
    status: 'completed',
    year: '2024'
  },
  {
    title: 'Codeplayers Website',
    description: 'An engaging website optimized for SEO and performance across all devices. Features smooth animations and dynamic content delivery for an enhanced user experience.',
    detailedDescription: [
    'Implemented SEO best practices including semantic HTML and metadata optimization',
    'Created performance-optimized animations using Framer Motion',
    'Designed responsive layouts with Bootstrap for consistent cross-device experience',
    'Integrated content management system for easy updates'],

    role: 'Frontend Developer',
    challenges: 'Balancing rich animations and visual effects with optimal page load performance and SEO requirements',
    image: codeplayers,
    tags: ['ReactJS', 'Bootstrap', 'Framer Motion', 'SEO'],
    live: 'https://code-x-gules.vercel.app/landing',
    status: 'completed',
    year: '2024'
  },
  {
    title: 'Festiva Website',
    description: 'A responsive event management platform built with modern design principles. Implements real-time updates and dynamic components with advanced Framer Motion animations.',
    detailedDescription: [
    'Designed and implemented a dynamic event showcase with filtering capabilities',
    'Created custom animations for page transitions and UI interactions',
    'Built responsive layouts that adapt to all device sizes',
    'Implemented performance optimizations for fast page loads'],

    role: 'UI/UX Developer',
    challenges: 'Creating complex animations that enhance user experience without compromising performance or accessibility',
    image: festiva,
    tags: ['Vite', 'ReactJS', 'Framer Motion'],
    live: 'https://festiva-canva.vercel.app/',
    status: 'completed',
    year: '2024'
  },
  {
    title: 'Linkedin Post Generator',
    description: 'A tool for generating professional-looking LinkedIn posts with ease. Features a user-friendly interface and real-time preview for optimal content distribution.',
    detailedDescription: [
    'Developed a user-friendly interface for creating and formatting LinkedIn posts',
    'Implemented real-time preview functionality to show how posts will appear',
    'Created template system with various professional layouts',
    'Built export functionality for easy sharing to LinkedIn'],

    role: 'Frontend Developer',
    challenges: 'Accurately replicating LinkedIn\'s post format and styling while providing an intuitive creation interface',
    image: linkedin,
    tags: ['Vite', 'ReactJS', 'Framer Motion'],
    github: 'https://github.com/repo-anuj/Linkedin-Post-Generator',
    live: 'https://linkedin-post-generator-orcin.vercel.app/',
    status: 'completed',
    year: '2024'
  }];


  const statusColors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    planned: 'bg-blue-500'
  };

  return (<T id="pages.projects.0">
    <div ref={containerRef} className="relative w-full h-full bg-vscode-editor">
      <div className="relative w-full max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          
          <span className="text-vscode-accent font-['Fira_Code'] text-sm tracking-wider mb-3 block">
            {'<Projects />'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-['Space_Grotesk']">
            Featured Projects
          </h1>
          <p className="text-white/60 font-['Inter'] max-w-2xl mx-auto">
            A showcase of my diverse portfolio spanning enterprise solutions, interactive web applications, and creative user experiences.
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <Var>{[Code2, Layers].map((Icon, index) => (
            <Icon
              key={index}
              className={`floating-icon absolute text-vscode-accent/20 w-16 h-16
                ${index % 2 ? 'left-[10%]' : 'right-[10%]'}
                top-[${(index * 30) + 20}%]`} />

            ))}</Var>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          <Var>{projects.map((project) => (<T id="pages.projects.6">
              <motion.div
                key={project.title}
                className="project-card group relative bg-white/5 rounded-xl overflow-hidden
                border border-white/10 hover:border-vscode-accent/50 transition-all duration-300">

                
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                <Var>{typeof project.image === 'string' ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />

                    ) : (
                    <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                    {project.image}
                  </div>
                    )}</Var>
                {/* Year Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium
                  bg-vscode-accent/90 text-white">
                    
                  <Var>{project.year}</Var>
                </span>
                {/* Status Badge */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium
                  ${statusColors[project.status as keyof typeof statusColors]} text-white/90`}>
                  <Var>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</Var>
                </span>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 font-['Space_Grotesk']">
                  <Var>{project.title}</Var>
                </h3>
                <p className="text-white/60 text-sm mb-2 font-['Inter'] line-clamp-3">
                  <Var>{project.description}</Var>
                </p>

                {/* Role & Brief Summary */}
                <div className="mb-3">
                  <Var>{project.role && (<T id="pages.projects.1">
                        <div className="flex items-center gap-1 text-xs text-vscode-accent mb-1">
                      <span className="font-medium">Role:</span>
                      <span><Var>{project.role}</Var></span>
                    </div></T>
                      )}</Var>

                  {/* Brief summary of the first detailed description point */}
                  <Var>{project.detailedDescription && project.detailedDescription[0] && (
                      <p className="text-white/70 text-sm mt-2">
                      {project.detailedDescription[0].split('.')[0]}.
                    </p>
                      )}</Var>
                </div>

                {/* Read More Details - Collapsible */}
                <details className="mb-4 text-white/70 text-sm group">
                  <summary className="cursor-pointer font-medium text-vscode-accent hover:text-vscode-accent/80 transition-colors flex items-center gap-1">
                    <span>Project Details</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transform transition-transform duration-300 group-open:rotate-180">
                        
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </summary>
                  <div className="pt-2 pl-2 border-l border-vscode-accent/30 mt-2 animate-slideDown">
                    <Var>{project.detailedDescription && (
                        <ul className="space-y-1 mb-2">
                        {project.detailedDescription.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-vscode-accent mr-2">•</span>
                            <span>{detail}</span>
                          </li>
                          ))}
                      </ul>
                        )}</Var>
                    <Var>{project.challenges && (<T id="pages.projects.2">
                          <div className="mt-2">
                        <span className="text-vscode-accent font-medium">Challenges: </span>
                        <span><Var>{project.challenges}</Var></span>
                      </div></T>
                        )}</Var>
                  </div>
                </details>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Var>{project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/70
                        border border-white/10 hover:border-vscode-accent/30 transition-colors">

                        
                      {tag}
                    </span>
                      ))}</Var>
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <Var>{project.github && (<T id="pages.projects.3">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-white/60 hover:text-vscode-accent
                        transition-colors duration-300">

                          
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                      <span className="text-sm">Code</span>
                    </a></T>
                      )}</Var>
                  <Var>{project.live && (<T id="pages.projects.4">
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-white/60 hover:text-vscode-accent
                        transition-colors duration-300">

                          
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Live Demo</span>
                    </a></T>
                      )}</Var>

                  {/* Share Button */}
                  <Var>{project.live && (<T id="pages.projects.5">
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: project.title,
                                text: project.description,
                                url: project.live
                              }).catch((err) => console.error('Share failed:', err));
                            } else {
                              navigator.clipboard.writeText(project.live).
                              then(() => alert('Project URL copied to clipboard!')).
                              catch((err) => console.error('Copy failed:', err));
                            }
                          }}
                          className="flex items-center gap-2 text-white/60 hover:text-vscode-accent
                        transition-colors duration-300 ml-auto"

                          aria-label="Share project">
                          
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      <span className="text-sm">Share</span>
                    </button></T>
                      )}</Var>
                </div>
              </div>
            </motion.div></T>
            ))}</Var>
        </div>

        {/* Future Projects Section - Optional, can be removed if not needed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center">
          
          <h2 className="text-2xl font-bold text-white mb-8 font-['Space_Grotesk']">
            Upcoming Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Var>{[
              {
                title: 'WebRTC Video Conferencing',
                description: 'A peer-to-peer video conferencing application using WebRTC for direct browser-to-browser communication without servers.'
              },
              {
                title: 'WebAssembly Image Editor',
                description: 'High-performance image processing tool built with Rust and compiled to WebAssembly for near-native speed in the browser.'
              },
              {
                title: 'WebSocket Collaborative Whiteboard',
                description: 'Real-time collaborative drawing application using WebSockets for instant synchronization across multiple users.'
              }].
              map((idea) => (
              <motion.div
                key={idea.title}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white/5 rounded-lg border border-white/10
                  hover:border-vscode-accent/50 transition-all duration-300">

                
                <h3 className="text-lg font-bold text-white mb-2 font-['Space_Grotesk']">
                  {idea.title}
                </h3>
                <p className="text-white/60 text-sm font-['Inter']">
                  {idea.description}
                </p>
              </motion.div>
              ))}</Var>
          </div>
        </motion.div>
      </div>
    </div></T>
  );
};

export default Projects;