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
      <div className="relative w-full max-w-4xl mx-auto px-8 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-vscode-accent font-['Fira_Code'] text-sm tracking-wider mb-3 block">
            {'<Work Experience />'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-['Space_Grotesk']">
            My Professional Journey
          </h1>
          <p className="text-white/60 font-['Inter'] max-w-2xl mx-auto">
            A timeline of my professional experience, showcasing projects and roles 
            that have shaped my development journey.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Timeline Line */}
          <motion.div 
            className="timeline-line absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-vscode-accent/50 via-vscode-accent to-vscode-accent/50"
            style={{ transformOrigin: 'top' }}
          />

          {/* Work Items */}
          <div className="space-y-16 relative">
            {workExperience.map((work, index) => (
              <motion.div
                key={work.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-8"
              >
                {/* Timeline Dot */}
                <div className="timeline-dot absolute -left-[5px] top-0 w-3 h-3 rounded-full bg-vscode-accent 
                  shadow-[0_0_0_4px_rgba(0,122,204,0.1)] transition-shadow duration-500" />

                {/* Content Card */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-vscode-accent/50 
                  transition-all duration-300 group hover:shadow-lg hover:shadow-vscode-accent/10">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl text-white font-['Space_Grotesk'] mb-2 flex items-center gap-2">
                        {work.title}
                        <ChevronRight size={18} className="text-vscode-accent transition-transform group-hover:translate-x-1" />
                        <span className="text-vscode-accent">{work.company}</span>
                      </h3>
                      <div className="flex items-center gap-4 text-white/60 text-sm font-['Inter']">
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
                  <ul className="space-y-2 mb-6">
                    {work.description.map((item, i) => (
                      <li key={i} className="text-white/70 font-['Inter'] flex gap-2 group-hover:text-white/90 transition-colors">
                        <ChevronRight size={18} className="text-vscode-accent shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {work.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="tech-badge px-3 py-1.5 bg-vscode-accent/10 text-vscode-accent 
                          text-sm font-['Inter'] rounded-md border border-vscode-accent/20
                          hover:border-vscode-accent/40 transition-all duration-300
                          hover:shadow-[0_0_10px_rgba(0,122,204,0.2)] hover:scale-105"
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