import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap, Award, Code2, Layers, 
  Mail, Github, Linkedin, Globe, Terminal
} from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

gsap.registerPlugin(ScrollTrigger)

const Profile = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate profile sections with staggered reveal
      gsap.fromTo('.profile-section',
        { 
          y: 100,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.3,
          ease: 'elastic.out(1, 0.8)',
          scrollTrigger: {
            trigger: '.profile-content',
            start: 'top bottom-=100',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
            scrub: 1
          }
        }
      )

      // Animate skill items with staggered bounce
      gsap.fromTo('.skill-item',
        {
          scale: 0,
          rotation: -15
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top bottom-=50',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Enhanced floating animations for decorative elements
      gsap.to('.floating-icon', {
        y: 'random(-20, 20)',
        x: 'random(-20, 20)',
        rotation: 'random(-25, 25)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          from: 'random'
        }
      })

      // Animate certification cards
      gsap.fromTo('.cert-card',
        {
          x: -50,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.certs-grid',
            start: 'top bottom-=50',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const education = [
    {
      school: 'Holy Hearts Education Academy',
      degree: '12th Grade',
      year: '2023',
      score: '85%'
    },
    {
      school: 'Holy Hearts Education Academy',
      degree: '10th Grade',
      year: '2021',
      score: '82%'
    }
  ]

  const certifications = [
    {
      title: 'React - The Complete Guide',
      issuer: 'Udemy',
      date: 'January 2024'
    },
    {
      title: 'Advanced JavaScript Concepts',
      issuer: 'Udemy',
      date: 'December 2023'
    },
    {
      title: 'Web Development Bootcamp',
      issuer: 'Udemy',
      date: 'November 2023'
    }
  ]

  return (
    <motion.div 
      ref={containerRef} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full bg-gradient-to-b from-vscode-editor to-vscode-editor/95 overflow-auto"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(50,100,255,0.1),transparent_50%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,50,100,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 py-16">
        {/* Enhanced Header with Terminal-like intro */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-white/5 rounded-lg p-4 mb-8 backdrop-blur-sm"
          >
            <Terminal className="w-6 h-6 text-vscode-accent mb-2 mx-auto" />
            <code className="text-sm font-['Fira_Code'] text-white/70">
              <span className="text-vscode-accent">const</span> developer = {'{'}
              <br />
              &nbsp;&nbsp;name: <span className="text-green-400">"Anuj Dubey"</span>,
              <br />
              &nbsp;&nbsp;role: <span className="text-green-400">"Full Stack Developer"</span>,
              <br />
              &nbsp;&nbsp;location: <span className="text-green-400">"India"</span>
              <br />
              {'}'};
            </code>
          </motion.div>

          <motion.span
            whileHover={{ scale: 1.1 }}
            className="inline-block text-vscode-accent font-['Fira_Code'] text-sm tracking-wider mb-3"
          >
            {'<Profile />'}
          </motion.span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-['Space_Grotesk']">
            Anuj Dubey
          </h1>
          <p className="text-white/60 font-['Inter'] max-w-2xl mx-auto">
            Full Stack Developer | React Specialist | UI/UX Enthusiast
          </p>
          
          {/* Enhanced Social Links with spring animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-6 mt-6"
          >
            {[
              { icon: Mail, href: 'mailto:your.email@example.com', label: 'Email' },
              { icon: Github, href: 'https://github.com/yourusername', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
              { icon: Globe, href: 'https://your-portfolio.com', label: 'Website' }
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.2,
                  rotate: 5,
                  backgroundColor: 'rgba(255,255,255,0.15)' 
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="p-2 rounded-full bg-white/5 text-white/60 hover:text-vscode-accent
                  backdrop-blur-sm transition-all duration-300"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[Code2, Layers].map((Icon, index) => (
            <Icon 
              key={index}
              className={`floating-icon absolute text-vscode-accent/20 w-16 h-16
                ${index % 2 ? 'left-[10%]' : 'right-[10%]'}
                top-[${(index * 30) + 20}%]`}
            />
          ))}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-vscode-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Enhanced Profile Content */}
        <div className="profile-content space-y-16">
          {/* About Section with glass effect */}
          <motion.section 
            className="profile-section backdrop-blur-sm bg-white/5 rounded-xl p-8 border border-white/10
              hover:border-vscode-accent/50 transition-all duration-500"
            whileHover={{ 
              scale: 1.02,
              borderColor: 'rgba(100,200,255,0.5)',
              backgroundColor: 'rgba(255,255,255,0.08)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-['Space_Grotesk'] flex items-center gap-3">
              <Code2 className="text-vscode-accent" />
              About Me
            </h2>
            <p className="text-white/70 font-['Inter'] leading-relaxed">
              I am a passionate Full Stack Developer with a strong focus on creating engaging web experiences.
              My journey in web development has equipped me with a deep understanding of modern technologies
              and best practices. I specialize in React and related technologies, always striving to build
              efficient and user-friendly applications.
            </p>
          </motion.section>

          {/* Education Section with enhanced cards */}
          <motion.section 
            className="profile-section backdrop-blur-sm bg-white/5 rounded-xl p-8 border border-white/10
              hover:border-vscode-accent/50 transition-all duration-500"
            whileHover={{ 
              scale: 1.02,
              borderColor: 'rgba(100,200,255,0.5)',
              backgroundColor: 'rgba(255,255,255,0.08)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-['Space_Grotesk'] flex items-center gap-3">
              <GraduationCap className="text-vscode-accent" />
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <motion.div 
                  key={edu.degree}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between
                    p-4 bg-white/5 rounded-lg transition-all duration-300
                    hover:shadow-lg hover:shadow-vscode-accent/10"
                >
                  <div>
                    <h3 className="text-white font-bold mb-1 font-['Space_Grotesk']">{edu.school}</h3>
                    <p className="text-white/60 text-sm font-['Inter']">{edu.degree}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <span className="text-vscode-accent font-['Fira_Code']">{edu.year}</span>
                    <p className="text-white/60 text-sm font-['Inter']">Score: {edu.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Certifications Section with enhanced cards */}
          <motion.section 
            className="profile-section backdrop-blur-sm bg-white/5 rounded-xl p-8 border border-white/10
              hover:border-vscode-accent/50 transition-all duration-500"
            whileHover={{ 
              scale: 1.02,
              borderColor: 'rgba(100,200,255,0.5)',
              backgroundColor: 'rgba(255,255,255,0.08)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-['Space_Grotesk'] flex items-center gap-3">
              <Award className="text-vscode-accent" />
              Certifications
            </h2>
            <div className="certs-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <motion.div 
                  key={cert.title}
                  className="cert-card p-4 bg-white/5 rounded-lg hover:bg-white/10 
                    transition-all duration-300 hover:shadow-lg hover:shadow-vscode-accent/10"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <h3 className="text-white font-bold mb-1 font-['Space_Grotesk']">{cert.title}</h3>
                  <p className="text-white/60 text-sm font-['Inter']">{cert.issuer}</p>
                  <p className="text-vscode-accent/80 text-sm font-['Fira_Code'] mt-2">{cert.date}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Enhanced Skills Section with animated grid */}
          <motion.section 
            className="profile-section backdrop-blur-sm bg-white/5 rounded-xl p-8 border border-white/10
              hover:border-vscode-accent/50 transition-all duration-500"
            whileHover={{ 
              scale: 1.02,
              borderColor: 'rgba(100,200,255,0.5)',
              backgroundColor: 'rgba(255,255,255,0.08)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-['Space_Grotesk'] flex items-center gap-3">
              <Code2 className="text-vscode-accent" />
              Technical Skills
            </h2>
            <div className="skills-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'React', 'TypeScript', 'Node.js', 'Next.js',
                'Tailwind CSS', 'MongoDB', 'Git', 'RESTful APIs',
                'Framer Motion', 'Redux', 'Express.js', 'PostgreSQL'
              ].map((skill) => (
                <motion.div
                  key={skill}
                  className="skill-item px-4 py-2 bg-white/5 rounded-lg text-white/70 text-center
                    border border-white/10 backdrop-blur-sm hover:text-white 
                    transition-all duration-300 font-['Inter']
                    hover:shadow-lg hover:shadow-vscode-accent/10"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(100,200,255,0.1)',
                    borderColor: 'rgba(100,200,255,0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile 