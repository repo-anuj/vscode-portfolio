import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, MapPin, Globe, BookOpen, Code2, Award, Briefcase,
  ChevronRight, Terminal
} from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

gsap.registerPlugin(ScrollTrigger)

interface ProfileSection {
  id: string
  title: string
  icon: React.ElementType
  content: React.ReactNode
  defaultOpen?: boolean
}

const Profile: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['about'])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate sections on scroll
      gsap.fromTo('.profile-section',
        { 
          y: 50,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.profile-container',
            start: 'top center',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Floating animation for decorative elements
      gsap.to('.floating-element', {
        y: 'random(-10, 10)',
        x: 'random(-10, 10)',
        rotation: 'random(-15, 15)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 1.5,
          from: 'random'
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const sections: ProfileSection[] = [
    {
      id: 'about',
      title: 'About',
      icon: User,
      defaultOpen: true,
      content: (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <motion.img 
              src="/profile-pic.jpg" 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-2 border-vscode-accent"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
            <div>
              <motion.h2 
                className="text-xl font-semibold text-white font-['Space_Grotesk']"
                whileHover={{ color: '#61dafb' }}
              >
                Anuj Dubey
              </motion.h2>
              <p className="text-white/60 font-['Inter']">Full Stack Developer</p>
            </div>
          </div>
          <p className="text-white/80 leading-relaxed font-['Inter']">
            Passionate Full Stack Developer with a strong focus on creating engaging web experiences.
            My journey in web development has equipped me with a deep understanding of modern technologies
            and best practices. I specialize in React and related technologies, always striving to build
            efficient and user-friendly applications.
          </p>
          <div className="flex flex-col gap-2 text-white/70">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ x: 5, color: '#61dafb' }}
            >
              <Mail size={16} />
              <span>anuj.dubey@example.com</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ x: 5, color: '#61dafb' }}
            >
              <MapPin size={16} />
              <span>India</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ x: 5, color: '#61dafb' }}
            >
              <Globe size={16} />
              <a href="#" className="text-vscode-accent hover:underline">portfolio.dev</a>
            </motion.div>
          </div>
        </motion.div>
      )
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      icon: Code2,
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <h3 className="text-white/80 font-medium font-['Space_Grotesk']">Frontend Development</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'].map((skill, index) => (
                <motion.span 
                  key={skill}
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(97, 218, 251, 0.2)'
                  }}
                  className="px-2 py-1 rounded-md bg-vscode-accent/10 text-vscode-accent text-sm
                    font-['Fira_Code'] cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white/80 font-medium font-['Space_Grotesk']">Backend Development</h3>
            <div className="flex flex-wrap gap-2">
              {['Node.js', 'Python', 'Django', 'PostgreSQL', 'MongoDB'].map((skill, index) => (
                <motion.span 
                  key={skill}
                  initial={{ scale: 0, rotate: 15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(97, 218, 251, 0.2)'
                  }}
                  className="px-2 py-1 rounded-md bg-vscode-accent/10 text-vscode-accent text-sm
                    font-['Fira_Code'] cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white/80 font-medium font-['Space_Grotesk']">Tools & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {['Git', 'Docker', 'AWS', 'VS Code', 'Figma'].map((skill, index) => (
                <motion.span 
                  key={skill}
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(97, 218, 251, 0.2)'
                  }}
                  className="px-2 py-1 rounded-md bg-vscode-accent/10 text-vscode-accent text-sm
                    font-['Fira_Code'] cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: Briefcase,
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.div 
            className="space-y-2"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium">Senior Frontend Developer</h3>
                <p className="text-white/60">Tech Corp Inc.</p>
              </div>
              <span className="text-white/40 text-sm">2021 - Present</span>
            </div>
            <ul className="list-disc list-inside text-white/70 space-y-1 text-sm">
              <li>Led frontend development for major client projects</li>
              <li>Implemented modern React architecture patterns</li>
              <li>Mentored junior developers and conducted code reviews</li>
            </ul>
          </motion.div>
          <motion.div 
            className="space-y-2"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium">Full Stack Developer</h3>
                <p className="text-white/60">StartUp Solutions</p>
              </div>
              <span className="text-white/40 text-sm">2019 - 2021</span>
            </div>
            <ul className="list-disc list-inside text-white/70 space-y-1 text-sm">
              <li>Developed full-stack applications using React and Node.js</li>
              <li>Optimized application performance and user experience</li>
              <li>Collaborated with design team on UI/UX improvements</li>
            </ul>
          </motion.div>
        </motion.div>
      )
    },
    {
      id: 'education',
      title: 'Education',
      icon: BookOpen,
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <motion.div 
            className="space-y-1"
            whileHover={{ x: 5 }}
          >
            <h3 className="text-white font-medium font-['Space_Grotesk']">Holy Hearts Education Academy</h3>
            <p className="text-white/60">12th Grade</p>
            <p className="text-white/40 text-sm">2023 - Score: 85%</p>
          </motion.div>
          <motion.div 
            className="space-y-1"
            whileHover={{ x: 5 }}
          >
            <h3 className="text-white font-medium font-['Space_Grotesk']">Holy Hearts Education Academy</h3>
            <p className="text-white/60">10th Grade</p>
            <p className="text-white/40 text-sm">2021 - Score: 82%</p>
          </motion.div>
        </motion.div>
      )
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: Award,
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {[
            {
              name: 'React - The Complete Guide',
              org: 'Udemy',
              date: 'January 2024'
            },
            {
              name: 'Advanced JavaScript Concepts',
              org: 'Udemy',
              date: 'December 2023'
            },
            {
              name: 'Web Development Bootcamp',
              org: 'Udemy',
              date: 'November 2023'
            }
          ].map((cert, index) => (
            <motion.div 
              key={cert.name} 
              className="flex items-start gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ x: 5 }}
            >
              <Award size={18} className="text-vscode-accent mt-1" />
              <div>
                <h3 className="text-white font-medium font-['Space_Grotesk']">{cert.name}</h3>
                <p className="text-white/60 text-sm">{cert.org}</p>
                <p className="text-white/40 text-sm font-['Fira_Code']">{cert.date}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )
    }
  ]

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto bg-vscode-editor p-6"
    >
      {/* Terminal-like Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-8 bg-black/20 rounded-lg p-4 backdrop-blur-sm"
      >
        <Terminal className="w-5 h-5 text-vscode-accent mb-2" />
        <code className="text-sm font-['Fira_Code'] text-white/70">
          <span className="text-vscode-accent">const</span> profile = {'{'}
          <br />
          &nbsp;&nbsp;name: <span className="text-green-400">"Anuj Dubey"</span>,
          <br />
          &nbsp;&nbsp;role: <span className="text-green-400">"Full Stack Developer"</span>
          <br />
          {'}'};
        </code>
      </motion.div>

      <div className="profile-container max-w-3xl mx-auto space-y-4 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(50,100,255,0.1),transparent_50%)]" />
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,50,100,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="floating-element absolute w-8 h-8 rounded-full bg-vscode-accent/5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `scale(${Math.random() * 2 + 1})`
              }}
            />
          ))}
        </div>

        {sections.map(section => (
          <motion.div 
            key={section.id}
            layout
            className="profile-section panel-border rounded-lg overflow-hidden focus-border
              backdrop-blur-sm bg-black/20 border border-white/10"
          >
            <motion.button
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-white/5 text-white/80
                transition-colors duration-200"
              onClick={() => toggleSection(section.id)}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <section.icon size={18} className="text-vscode-accent" />
              <motion.span 
                className="font-medium font-['Space_Grotesk']"
                animate={{ color: expandedSections.includes(section.id) ? '#61dafb' : 'rgba(255, 255, 255, 0.8)' }}
              >
                {section.title}
              </motion.span>
              <motion.div
                className="ml-auto"
                animate={{ 
                  rotate: expandedSections.includes(section.id) ? 90 : 0
                }}
              >
                <ChevronRight size={18} />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {expandedSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-white/10">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Profile 