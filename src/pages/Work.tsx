import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

import { Var, T } from "gt-react";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
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
      );

      // Animate timeline dots with glow effect
      gsap.to('.timeline-dot', {
        boxShadow: '0 0 10px 2px rgba(0,122,204,0.4)',
        duration: 1,
        repeat: -1,
        yoyo: true,
        stagger: 0.2
      });

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
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const workExperience = [
  {
    title: 'Frontend Web Developer',
    company: 'Codeplayer',
    period: '2024 – 2025',
    location: 'Codeplayers.in',
    description: [
    'Developed the official website using ReactJS, Bootstrap, and Framer Motion, focusing on performance and interactivity.',
    'Implemented animations and transitions that increased user engagement by 35% and reduced bounce rate by 20%.',
    'Optimized site performance achieving a 92/100 PageSpeed score, improving load times by 40%.',
    'Collaborated with a team of 5 designers and developers to deliver the project 2 weeks ahead of schedule.'],

    achievements: [
    'Reduced page load time from 3.2s to 1.8s through code optimization and asset management',
    'Implemented responsive design that increased mobile user engagement by 45%',
    'Received client commendation for exceptional UI/UX implementation'],

    technologies: ['ReactJS', 'Bootstrap', 'Framer Motion', 'Responsive Design', 'Performance Optimization']
  },
  {
    title: 'Web Developer',
    company: 'Festiva Portfolio Website',
    period: '2025',
    location: 'Freelance Project',
    description: [
    'Designed and developed a portfolio website for Festiva using Vite, ReactJS, and Framer Motion.',
    'Addressed challenges in implementing advanced animations and ensured seamless user interactions.',
    'Delivered a high-performing, visually appealing website showcasing Festiva\'s portfolio.',
    'Implemented SEO best practices resulting in improved search engine visibility.'],

    achievements: [
    'Created custom animation system that reduced animation code by 60% while maintaining visual quality',
    'Completed project 10 days ahead of deadline while exceeding client expectations',
    'Implemented accessibility features achieving WCAG AA compliance'],

    technologies: ['Vite', 'ReactJS', 'Framer Motion', 'Advanced Animations', 'SEO', 'Accessibility']
  },
  {
    title: 'Catalog Management Intern',
    company: 'Mentorsity',
    period: 'April 2023 – June 2023',
    location: 'Ghaziabad, India',
    description: [
    'Managed and maintained digital catalogs for 15+ clients, ensuring 99.8% data accuracy.',
    'Collaborated with cross-functional teams to streamline catalog processes, reducing update time by 30%.',
    'Implemented data validation procedures that reduced error rates by 25%.',
    'Participated in weekly client meetings to gather requirements and provide progress updates.'],

    achievements: [
    'Recognized as "Intern of the Month" for process improvement suggestions',
    'Created documentation that reduced onboarding time for new catalog managers by 40%',
    'Developed Excel macros that automated repetitive tasks, saving 5+ hours weekly'],

    technologies: ['Data Management', 'Team Collaboration', 'Process Optimization', 'Excel', 'Client Communication']
  },
  {
    title: 'Web Developer Intern',
    company: 'Bharat Intern',
    period: 'June 2022 – October 2022',
    location: 'India',
    description: [
    'Developed responsive features using ReactJS for 3 client projects, enhancing user interface design.',
    'Implemented client-requested functionalities and optimized performance for mobile and desktop platforms.',
    'Collaborated with senior developers to troubleshoot issues and implement best practices.',
    'Participated in code reviews and contributed to team knowledge sharing sessions.'],

    achievements: [
    'Reduced component rendering time by 25% through code optimization',
    'Contributed to open-source project with 5 accepted pull requests',
    'Received positive feedback from 2 clients for exceeding expectations'],

    technologies: ['ReactJS', 'Responsive Design', 'UI/UX', 'Web Development', 'Git', 'Code Review']
  }];


  return (<T id="pages.work.0">
    <div ref={containerRef} className="relative w-full h-full bg-vscode-editor">
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
          className="text-center mb-8 sm:mb-12 md:mb-16">
          
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
            style={{ transformOrigin: 'top' }} />
          

          {/* Work Items */}
          <div className="space-y-8 sm:space-y-12 md:space-y-16 relative">
            <Var>{workExperience.map((work, index) => (<T id="pages.work.2">
                <motion.div
                  key={work.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative pl-6 sm:pl-8">
                  
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
                        <span className="mr-1"><Var>{work.title}</Var></span>
                        <ChevronRight size={18} className="text-vscode-accent transition-transform group-hover:translate-x-1 hidden sm:block" />
                        <span className="text-vscode-accent"><Var>{work.company}</Var></span>
                      </h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm font-['Inter']">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          <Var>{work.period}</Var>
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          <Var>{work.location}</Var>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Brief Summary */}
                  <div className="mb-3 text-white/70 text-sm">
                    <p><Var>{work.description[0].split('.')[0]}</Var>.</p>
                  </div>

                  {/* Collapsible Details */}
                  <details className="group mb-4">
                    <summary className="cursor-pointer font-medium text-vscode-accent hover:text-vscode-accent/80 transition-colors flex items-center gap-1 mb-2">
                      <span>View Details</span>
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

                    <div className="mt-3 pl-2 border-l border-vscode-accent/30 animate-slideDown">
                      {/* Description */}
                      <div className="mb-4">
                        <h4 className="text-white/90 text-sm font-medium mb-2 flex items-center gap-2">
                          <span className="text-vscode-accent">Responsibilities</span>
                          <div className="h-px bg-vscode-accent/30 flex-1"></div>
                        </h4>
                        <ul className="space-y-2 text-white/70 text-sm sm:text-base">
                          <Var>{work.description.map((item, i) => (
                              <li key={i} className="flex items-start">
                              <ChevronRight size={16} className="text-vscode-accent mt-1 shrink-0" />
                              <span className="ml-2">{item}</span>
                            </li>
                              ))}</Var>
                        </ul>
                      </div>

                      {/* Achievements */}
                      <Var>{work.achievements && (<T id="pages.work.1">
                            <div className="mb-4">
                          <h4 className="text-white/90 text-sm font-medium mb-2 flex items-center gap-2">
                            <span className="text-vscode-accent">Key Achievements</span>
                            <div className="h-px bg-vscode-accent/30 flex-1"></div>
                          </h4>
                          <ul className="space-y-2 text-white/70 text-sm sm:text-base">
                            <Var>{work.achievements.map((achievement, i) => (
                                  <li key={i} className="flex items-start">
                                <span className="text-green-400 font-bold mr-2">✓</span>
                                <span>{achievement}</span>
                              </li>
                                  ))}</Var>
                          </ul>
                        </div></T>
                          )}</Var>
                    </div>
                  </details>

                  {/* Technologies */}
                  <div className="mt-4">
                    <h4 className="text-white/90 text-xs font-medium mb-2">Technologies & Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      <Var>{work.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="tech-badge px-2 py-1 text-xs rounded-md bg-vscode-accent/10 text-vscode-accent
                          border border-vscode-accent/20 hover:border-vscode-accent/40 transition-colors">

                            
                          {tech}
                        </span>
                          ))}</Var>
                    </div>
                  </div>
                </div>
              </motion.div></T>
              ))}</Var>
          </div>
        </div>
      </div>
    </div></T>
  );
};

export default Work;