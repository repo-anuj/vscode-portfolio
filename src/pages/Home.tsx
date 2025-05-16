import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Terminal, Sparkles, Code2 } from 'lucide-react'
import gsap from 'gsap'
import Typed from 'typed.js'
import my from '../assets/my.jpg';
import OptimizedImage from '../components/OptimizedImage'
import { getAnimationSettings, optimizeGSAP, getOptimizedVariants } from '../utils/animationUtils'
import { useGT } from 'gt-react'
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

interface HomeProps {
  onContactClick: () => void
}

const Home: React.FC<HomeProps> = ({ onContactClick }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const typedRef = useRef<HTMLSpanElement>(null)
  const t = useGT()

  useEffect(() => {
    // Get animation settings based on device capabilities
    const animSettings = getAnimationSettings()

    // Animate background elements with optimized settings
    const ctx = gsap.context(() => {
      // Create timeline for floating icons
      const tl = gsap.timeline()

      // Only animate if animations are enabled
      if (animSettings.enabled) {
        tl.to('.floating-icon', {
          y: animSettings.useSimpleAnimations ? -10 : -20,
          duration: 2 * (animSettings.durationMultiplier || 1),
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          stagger: animSettings.useSimpleAnimations ? 0.1 : 0.2
        })

        // Optimize the timeline based on device capabilities
        optimizeGSAP(tl)
      }
    }, containerRef)

    // Initialize typed.js with optimized settings
    const typed = new Typed(typedRef.current!, {
      strings: [
        t('Building digital experiences'),
        t('Crafting clean code'),
        t('Designing user interfaces'),
        t('Creating web solutions')
      ],
      typeSpeed: animSettings.useSimpleAnimations ? 70 : 50,
      backSpeed: animSettings.useSimpleAnimations ? 40 : 30,
      backDelay: 1500,
      loop: true,
      // Disable cursor blinking on low-end devices
      showCursor: !animSettings.useSimpleAnimations
    })

    return () => {
      ctx.revert()
      typed.destroy()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full bg-vscode-editor">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-vscode-accent/5 via-transparent to-purple-900/10" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />

        {/* Floating Icons */}
        <Terminal className="floating-icon absolute top-[15%] left-[10%] text-vscode-accent/20 w-12 h-12" />
        <Code2 className="floating-icon absolute top-[30%] right-[15%] text-vscode-accent/20 w-16 h-16" />
        <Sparkles className="floating-icon absolute bottom-[20%] left-[20%] text-vscode-accent/20 w-10 h-10" />
      </div>

      {/* Main Content Container */}
      <div className="relative min-h-full w-full py-16 px-8 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            {...getOptimizedVariants({
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.6 }
            })}
            className="space-y-8"
          >
            <div>
              <motion.div
                {...getOptimizedVariants({
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.2 }
                })}
                className="mb-3"
              >
                <span className="text-vscode-accent font-['Fira_Code'] text-sm tracking-wider">
                  {'<Hello World />'}
                </span>
              </motion.div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                I'm Anuj Dubey
              </h1>
              <div className="h-12 font-['Inter'] text-xl lg:text-2xl text-white/60">
                <span ref={typedRef}></span>
                <span className="animate-blink">|</span>
              </div>
            </div>

            <motion.p
              {...getOptimizedVariants({
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.4 }
              })}
              className="text-base lg:text-lg text-white/70 font-['Inter'] leading-relaxed max-w-xl"
            >
              
                A passionate full-stack developer who loves to create elegant solutions
                with clean, efficient code. Focused on building exceptional digital experiences.
              
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              {...getOptimizedVariants({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.6 }
              })}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContactClick}
                className="group relative px-6 py-3 bg-vscode-accent text-white rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-vscode-accent/25"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative flex items-center gap-2">
                  Hire Me
                  <Terminal size={18} />
                </span>
              </motion.button>

              <motion.a
                href="https://github.com/repo-anuj"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-6 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                View Work
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              {...getOptimizedVariants({
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.8 }
              })}
              className="pt-4"
            >
              <p className="text-white/40 text-sm font-['Fira_Code'] mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-white/5 rounded-md text-white/60 text-sm font-['Inter'] border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            {...getOptimizedVariants({
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.6, delay: 0.4 }
            })}
            className="relative max-w-md mx-auto lg:ml-auto w-full aspect-square"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-vscode-accent/20 to-purple-500/20 rounded-full blur-3xl" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5">
              <OptimizedImage
                src={my}
                alt="Anuj Dubey"
                className="w-full h-full"
                objectFit="cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home
