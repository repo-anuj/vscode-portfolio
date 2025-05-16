import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import gsap from 'gsap';
import Typed from 'typed.js';
// import '@fontsource/fira-code'
// import '@fontsource/space-grotesk'
// import '@fontsource/inter'

import { Var, T } from "gt-react";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initialize typed.js
    const typed = new Typed(typedRef.current!, {
      strings: [
      'A passionate developer',
      'A creative problem solver',
      'A continuous learner',
      'A tech enthusiast'],

      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true
    });

    // Animate award icons
    const ctx = gsap.context(() => {
      gsap.to('.award-icon', {
        rotateY: 360,
        duration: 2,
        repeat: -1,
        ease: 'power1.inOut',
        stagger: 0.3
      });
    }, containerRef);

    return () => {
      typed.destroy();
      ctx.revert();
    };
  }, []);

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (<T id="pages.about.0">
    <div ref={containerRef} className="relative w-full h-full bg-vscode-editor">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-vscode-accent/5 via-transparent to-purple-900/10" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-4xl mx-auto px-8 py-16">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          className="text-center mb-16">
          
          <span className="text-vscode-accent font-['Fira_Code'] text-sm tracking-wider mb-3 block">
            {'<About Me />'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-['Space_Grotesk']">
            Hello, I'm Anuj Dubey
          </h1>
          <div className="h-8 font-['Inter'] text-xl lg:text-2xl text-white/60">
            <span ref={typedRef}></span>
            <span className="animate-blink">|</span>
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16">
          
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="text-vscode-accent" size={24} />
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Education</h2>
          </div>
          <div className="space-y-6">
            <Var>{[
              {
                degree: 'Bachelor of Computer Applications (BCA)',
                school: 'Shri Shankaracharya Professional University',
                location: 'Bhilai, Chhattisgarh',
                period: '2022 – 2025'
              },
              {
                degree: '12th PCB CBSE',
                school: 'Holy Hearts Education Academy',
                period: '2022'
              },
              {
                degree: '10th CBSE',
                school: 'Holy Hearts Education Academy',
                period: '2020'
              }].
              map((edu) => (
              <motion.div
                key={edu.degree}
                variants={fadeInUpVariant}
                className="bg-white/5 rounded-lg p-6 border border-white/10">
                
                <h3 className="text-xl text-white font-['Space_Grotesk'] mb-2">
                  {edu.degree}
                </h3>
                <p className="text-vscode-accent font-['Inter'] mb-1">
                  {edu.school}
                </p>
                {edu.location && (
                <p className="text-white/60 font-['Inter'] mb-1">{edu.location}</p>
                )}
                <p className="text-white/40 font-['Inter']">{edu.period}</p>
              </motion.div>
              ))}</Var>
          </div>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}>
          
          <div className="flex items-center gap-2 mb-8">
            <Award className="text-vscode-accent" size={24} />
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Certifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Var>{[
              'Postman API Student Expert (Postman Academy)',
              'LetsUpgrade Student Ambassador',
              'Microsoft GitHub Administrator',
              'IBM Python for Data Science',
              'Oracle Certified Java Programmer'].
              map((cert) => (
              <motion.div
                key={cert}
                variants={fadeInUpVariant}
                className="group bg-white/5 hover:bg-white/10 rounded-lg p-6 border border-white/10 transition-colors">
                
                <div className="flex items-start gap-3">
                  <Award className="award-icon text-vscode-accent shrink-0 mt-1" size={20} />
                  <span className="text-white/70 font-['Inter'] group-hover:text-white transition-colors">
                    {cert}
                  </span>
                </div>
              </motion.div>
              ))}</Var>
          </div>
        </motion.div>
      </div>
    </div></T>
  );
};

export default About;