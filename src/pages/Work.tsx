import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Briefcase, Calendar, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

gsap.registerPlugin(ScrollTrigger)

const Work = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  useEffect(() => {
    console.log(scaleX); // This will ensure scaleX is used
  }, [scaleX]);

  useEffect(() => {
    // Animate timeline
    const ctx = gsap.context(() => {
      // Animate the timeline line drawing
      gsap.fromTo('.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.timeline-line',
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
            scrub: 1
          }
        }
      )

      // Animate timeline dots with glow effect
      gsap.to('.timeline-dot', {
        boxShadow: '0 0 10px 2px rgba(0,122,204,0.4)',
        duration: 1,
        repeat: -1,
        yoyo: true,
        stagger: 0.2
      })

      // Animate tech badges
      gsap.fromTo('.tech-badge', 
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.tech-badge',
            start: 'top bottom',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const workExperience = [
    {
      title: 'Frontend Web Developer',
      company: 'Codeplayer',
      period: '2024 – 2025',
      location: 'Codeplayers.in',
      description: [
        'Developed the official website using ReactJS, Bootstrap, and Framer Motion, focusing on performance and interactivity.',
        'Implemented animations and transitions to enhance user engagement.',
        'Optimized the site for cross-platform compatibility and fast load times.'
      ],
      technologies: ['ReactJS', 'Bootstrap', 'Framer Motion', 'Responsive Design']
    },
    {
      title: 'Web Developer',
      company: 'Festiva Portfolio Website',
      period: '2025',
      location: 'Freelance Project',
      description: [
        'Designed and developed a portfolio website for Festiva using Vite, ReactJS, and Framer Motion.',
        'Addressed challenges in implementing advanced animations and ensured seamless user interactions.',
        'Delivered a high-performing, visually appealing website showcasing Festiva\'s portfolio.'
      ],
      technologies: ['Vite', 'ReactJS', 'Framer Motion', 'Advanced Animations']
    },
    {
      title: 'Catalog Management Intern',
      company: 'Mentorsity',
      period: 'April 2023 – June 2023',
      location: 'Ghaziabad, India',
      description: [
        'Managed and maintained digital catalogs for clients, ensuring high data accuracy.',
        'Collaborated with teams to streamline catalog processes, boosting operational efficiency.'
      ],
      technologies: ['Data Management', 'Team Collaboration', 'Process Optimization']
    },
    {
      title: 'Web Developer Intern',
      company: 'Bharat Intern',
      period: 'June 2022 – October 2022',
      location: 'India',
      description: [
        'Developed responsive features using ReactJS, enhancing user interface design.',
        'Implemented client-requested functionalities and optimized performance.',
        'Gained hands-on experience with modern web development practices.'
      ],
      technologies: ['ReactJS', 'Responsive Design', 'UI/UX', 'Web Development']
    }
  ]

  return (
    <div ref={containerRef} className="relative w-full h-full bg-vscode-editor overflow-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-vscode-accent/5 via-transparent to-purple-900/10" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="text-vscode-accent font-['Fira_Code'] text-xs sm:text-sm tracking-wider mb-2 sm:mb-3 block">
            {'<Work Experience />'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 font-['Space_Grotesk']">
            My Professional Journey
          </h1>
          <p className="text-white/60 font-['Inter'] max-w-2xl mx-auto text-sm sm:text-base px-4">
            A timeline of my professional experience, showcasing projects and roles 
            that have shaped my development journey.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-4 sm:pl-0" ref={timelineRef}>
          {/* Timeline Line */}
          <motion.div 
            className="timeline-line absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-vscode-accent/50 via-vscode-accent to-vscode-accent/50"
            style={{ transformOrigin: 'top' }}
          />

          {/* Work Items */}
          <div className="space-y-8 sm:space-y-12 md:space-y-16 relative">
            {workExperience.map((work, index) => (
              <motion.div
                key={work.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-6 sm:pl-8"
              >
                {/* Timeline Dot */}
                <div className="timeline-dot absolute -left-[5px] top-0 w-3 h-3 rounded-full bg-vscode-accent 
                  shadow-[0_0_0_4px_rgba(0,122,204,0.1)] transition-shadow duration-500" />

                {/* Content Card */}
                <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 hover:border-vscode-accent/50 
                  transition-all duration-300 group hover:shadow-lg hover:shadow-vscode-accent/10">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl text-white font-['Space_Grotesk'] mb-2 flex flex-wrap items-center gap-2">
                        <span className="mr-1">{work.title}</span>
                        <ChevronRight size={18} className="text-vscode-accent transition-transform group-hover:translate-x-1 hidden sm:block" />
                        <span className="text-vscode-accent">{work.company}</span>
                      </h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm font-['Inter']">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {work.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {work.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <ul className="mb-4 space-y-2 text-white/70 text-sm sm:text-base">
                    {work.description.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <ChevronRight size={16} className="text-vscode-accent mt-1 shrink-0" />
                        <span className="ml-2">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {work.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="tech-badge px-2 py-1 text-xs rounded-md bg-vscode-accent/10 text-vscode-accent 
                        border border-vscode-accent/20 hover:border-vscode-accent/40 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Work