import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Code2, Layers } from 'lucide-react'
import gsap from 'gsap'
import codeplayers from '../projects/codeplayers.png';
import festiva from '../projects/festiva.png';
import linkedin from '../projects/linkedin.png';
import pacman from '../projects/pacman.png';
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)

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
      )

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
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const projects = [
    {
      title: 'Pac-Man Game',
      description: 'A modernized Pac-Man game featuring interactive controls and responsive design. Built with dynamic game logic and smooth animations for an engaging gaming experience.',
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
      image: codeplayers,
      tags: ['ReactJS', 'Bootstrap', 'Framer Motion', 'SEO'],
      live: 'https://code-x-gules.vercel.app/landing',
      status: 'completed',
      year: '2024'
    },
    {
      title: 'Festiva Website',
      description: 'A responsive event management platform built with modern design principles. Implements real-time updates and dynamic components with advanced Framer Motion animations.',
      image: festiva,
      tags: ['Vite', 'ReactJS', 'Framer Motion'],
      live: 'https://festiva-canva.vercel.app/',
      status: 'completed',
      year: '2024'
    },
    {
      title: 'Linkedin Post Generator',
      description: 'A tool for generating professional-looking LinkedIn posts with ease. Features a user-friendly interface and real-time preview for optimal content distribution.',
      image: linkedin,
      tags: ['Vite', 'ReactJS', 'Framer Motion'],
      github: 'https://github.com/repo-anuj/Linkedin-Post-Generator',
      live: 'https://linkedin-post-generator-orcin.vercel.app/',
      status: 'completed',
      year: '2024'
    }
  ]

  const statusColors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    planned: 'bg-blue-500'
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-vscode-editor overflow-auto">
      <div className="relative w-full max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-vscode-accent font-['Fira_Code'] text-sm tracking-wider mb-3 block">
            {'<Projects />'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-['Space_Grotesk']">
            Featured Projects
          </h1>
          <p className="text-white/60 font-['Inter'] max-w-2xl mx-auto">
            A collection of my recent work, showcasing web development and interactive experiences.
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[Code2, Layers].map((Icon, index) => (
            <Icon 
              key={index}
              className={`floating-icon absolute text-vscode-accent/20 w-16 h-16
                ${index % 2 ? 'left-[10%]' : 'right-[10%]'}
                top-[${(index * 30) + 20}%]`}
            />
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.title}
              className="project-card group relative bg-white/5 rounded-xl overflow-hidden
                border border-white/10 hover:border-vscode-accent/50 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Year Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium
                  bg-vscode-accent/90 text-white">
                  {project.year}
                </span>
                {/* Status Badge */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium
                  ${statusColors[project.status as keyof typeof statusColors]} text-white/90`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 font-['Space_Grotesk']">
                  {project.title}
                </h3>
                <p className="text-white/60 text-sm mb-4 font-['Inter'] line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/70
                        border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/60 hover:text-vscode-accent
                        transition-colors duration-300"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">Code</span>
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/60 hover:text-vscode-accent
                        transition-colors duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Future Projects Section - Optional, can be removed if not needed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-8 font-['Space_Grotesk']">
            Upcoming Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Portfolio 2.0',
                description: 'An enhanced version of this portfolio with more interactive features and animations.'
              },
              {
                title: 'Full-Stack Blog',
                description: 'A modern blogging platform with authentication and rich text editing.'
              },
              {
                title: 'Weather Dashboard',
                description: 'Real-time weather tracking with interactive maps and forecasts.'
              }
            ].map((idea) => (
              <motion.div
                key={idea.title}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white/5 rounded-lg border border-white/10
                  hover:border-vscode-accent/50 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-2 font-['Space_Grotesk']">
                  {idea.title}
                </h3>
                <p className="text-white/60 text-sm font-['Inter']">
                  {idea.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Projects