import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Layers, Database, Palette, Cpu, Globe } from 'lucide-react';
import gsap from 'gsap';
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

import { Var, T } from "gt-react";

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const yReverse = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);

  useEffect(() => {
    // Delay the initial animation to ensure page is loaded
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Animate floating icons
        gsap.to('.floating-icon', {
          y: 'random(-20, 20)',
          x: 'random(-20, 20)',
          rotation: 'random(-15, 15)',
          duration: 'random(2, 4)',
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          stagger: {
            amount: 2,
            from: 'random'
          }
        });

        // Animate skill cards
        gsap.fromTo('.skill-card',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top bottom',
            end: 'center center',
            toggleActions: 'play none none reverse'
          }
        }
        );

        // Animate all progress bars simultaneously after page load
        gsap.to('.progress-bar', {
          width: 'var(--target-width)',
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.1
        });
      }, containerRef);

      return () => ctx.revert();
    }, 500); // 500ms delay to ensure page load

    return () => clearTimeout(timer);
  }, []);

  const skillCategories = [
  {
    title: 'Frontend Development',
    icon: Globe,
    skills: [
    { name: 'ReactJS', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'Next.js', level: 80 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'Framer Motion', level: 85 }]

  },
  {
    title: 'Backend Development',
    icon: Database,
    skills: [
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'Django', level: 75 },
    { name: 'PostgreSQL', level: 80 },
    { name: 'MongoDB', level: 85 }]

  },
  {
    title: 'UI/UX Design',
    icon: Palette,
    skills: [
    { name: 'Figma', level: 85 },
    { name: 'Adobe XD', level: 80 },
    { name: 'Responsive Design', level: 90 },
    { name: 'Prototyping', level: 85 }]

  },
  {
    title: 'DevOps & Tools',
    icon: Cpu,
    skills: [
    { name: 'Git', level: 90 },
    { name: 'Docker', level: 80 },
    { name: 'AWS', level: 75 },
    { name: 'CI/CD', level: 80 }]

  }];


  const backgroundWords = [
  'REACT', 'NODE', 'TYPESCRIPT', 'PYTHON', 'AWS', 'DOCKER', 'MONGODB', 'SQL',
  'GIT', 'API', 'CSS', 'HTML', 'FIGMA', 'UI/UX', 'RESPONSIVE', 'FRONTEND', 'BACKEND'];


  return (<T id="pages.skills.0">
    <div ref={containerRef} className="relative w-full h-full bg-vscode-editor">
      {/* Content Container */}
      <div className="relative w-full max-w-6xl mx-auto px-8 py-16">
        {/* Moving Background Text - Now inside content container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-[0.02]">
          <motion.div
            style={{ y }}
            className="whitespace-nowrap leading-none">
            
            <Var>{[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="text-[200px] font-bold font-['Space_Grotesk'] tracking-tight"
                style={{ transform: `translateX(${i % 2 ? -50 : 0}px)` }}>
                
                {backgroundWords.slice(0, 8).join(' ')}
              </div>
              ))}</Var>
          </motion.div>
          <motion.div
            style={{ y: yReverse }}
            className="whitespace-nowrap leading-none">
            
            <Var>{[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="text-[200px] font-bold font-['Space_Grotesk'] tracking-tight"
                style={{ transform: `translateX(${i % 2 ? 0 : -50}px)` }}>
                
                {backgroundWords.slice(8).join(' ')}
              </div>
              ))}</Var>
          </motion.div>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative">
          
          <span className="text-vscode-accent font-['Fira_Code'] text-sm tracking-wider mb-3 block">
            {'<Technical Skills />'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-['Space_Grotesk']">
            My Technology Stack
          </h1>
          <p className="text-white/60 font-['Inter'] max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and expertise across different domains.
          </p>
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Var>{[Code2, Layers, Database, Palette, Globe, Cpu].map((Icon, index) => (
            <Icon
              key={index}
              className={`floating-icon absolute text-vscode-accent/20 w-12 h-12
                ${index % 2 ? 'left-[15%]' : 'right-[15%]'}
                top-[${(index * 20) + 10}%]`} />

            ))}</Var>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <Var>{skillCategories.map((category) => (
            <motion.div
              key={category.title}
              className="skill-card bg-white/5 rounded-lg p-6 border border-white/10 
                hover:border-vscode-accent/50 transition-all duration-300 group
                hover:shadow-lg hover:shadow-vscode-accent/10">


              
              <div className="flex items-center gap-3 mb-6">
                <category.icon className="text-vscode-accent w-6 h-6" />
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-['Inter']">
                      <span className="text-white/80">{skill.name}</span>
                      <span className="text-vscode-accent">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                      className="progress-bar h-full bg-gradient-to-r from-vscode-accent to-vscode-accent/60 rounded-full"
                      style={{ width: '0%', '--target-width': `${skill.level}%` } as any} />
                    
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            ))}</Var>
        </div>

        {/* Additional Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center relative">
          
          <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] mb-6">
            Additional Technologies & Tools
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Var>{[
              'VS Code', 'Postman', 'Jest', 'Redux', 'GraphQL', 'Webpack', 'Sass',
              'Firebase', 'Vercel', 'Netlify', 'Material UI', 'Bootstrap'].
              map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-white/5 text-white/70 rounded-full border border-white/10
                  hover:border-vscode-accent/50 hover:text-white transition-all duration-300
                  font-['Inter'] text-sm">


                
                {tech}
              </motion.span>
              ))}</Var>
          </div>
        </motion.div>
      </div>
    </div></T>
  );
};

export default Skills;