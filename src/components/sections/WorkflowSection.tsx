'use client';

import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import WaterDropParticles from '@/components/ui/WaterDropParticles';

const workflowSteps = [
  {
    number: 1,
    title: "Discover",
    subtitle: "Free assessment + strategy session",
    description: "We start by understanding your business, challenges, and goals through our comprehensive AI readiness assessment.",
    features: [
      "Free 15-minute consultation",
      "Custom opportunity analysis", 
      "Industry-specific recommendations",
      "ROI projections for your business"
    ]
  },
  {
    number: 2,
    title: "Design", 
    subtitle: "Custom solution blueprint",
    description: "Based on our findings, we create a detailed blueprint of your custom AI solution with clear specifications.",
    features: [
      "Tailored AI architecture",
      "Integration planning",
      "Security & compliance design",
      "Implementation roadmap"
    ]
  },
  {
    number: 3,
    title: "Develop",
    subtitle: "Build and test your tools", 
    description: "Our team develops your custom AI tools, rigorously testing them to ensure they meet your requirements.",
    features: [
      "Custom AI development",
      "Rigorous testing protocols",
      "Security implementation",
      "Performance optimization"
    ]
  },
  {
    number: 4,
    title: "Deploy",
    subtitle: "Launch and train your team",
    description: "We handle the deployment and provide comprehensive training to ensure your team can effectively use the new tools.",
    features: [
      "Seamless deployment",
      "Team training sessions",
      "Documentation & guides",
      "Go-live support"
    ]
  },
  {
    number: 5,
    title: "Deliver",
    subtitle: "Ongoing support and optimization",
    description: "Continuous monitoring and optimization to ensure your AI solutions deliver lasting value as your business grows.",
    features: [
      "Performance monitoring",
      "Continuous optimization",
      "Ongoing support",
      "Success measurement"
    ]
  }
];

export default function WorkflowSection() {
  const stepImages: string[] = [
    '/01_discover_card_v2.webp',
    '/02_design_solutions_card.webp',
    '/03_development_build_card.webp',
    '/04_training_implementation_card.webp',
    '/05_customer_success_support_card.webp',
  ];

  // State to track which arrow is currently at center
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [arrowsInCenter, setArrowsInCenter] = useState<Set<number>>(new Set());
  const [particleEmitters, setParticleEmitters] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  
  // Refs to track arrow positions
  const arrowRefs = useRef<{ [key: number]: HTMLElement | null }>({});

  // Scroll detection system - sound in both directions, particles only when scrolling down
  useEffect(() => {
    let isProcessing = false;
    
    const handleScroll = () => {
      // Prevent processing multiple events at once
      if (isProcessing) return;
      isProcessing = true;
      
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const viewportCenter = window.innerHeight / 2; // Center of viewport
      const newArrowsInCenter = new Set<number>();
      
      // Check each arrow position
      workflowSteps.forEach((step) => {
        const arrowElement = document.getElementById(`workflow-step-${step.number}`);
        
        if (arrowElement) {
          const rect = arrowElement.getBoundingClientRect();
          const arrowCenter = rect.top + rect.height / 2;
          
          // Check if arrow is at the center line (within threshold)
          const threshold = 50; // pixels tolerance for triggering
          if (Math.abs(arrowCenter - viewportCenter) < threshold) {
            newArrowsInCenter.add(step.number);
            
            // Trigger if this arrow wasn't in center before
            if (!arrowsInCenter.has(step.number)) {
              setCurrentStep(step.number);
              
              // Always play sound regardless of scroll direction
              console.log(`🎯 SOUND TRIGGER: Arrow ${step.number} - ${step.title} crossed center`);
              try {
                playWaterDropSound();
              } catch (error) {
                console.log('Audio playback failed:', error);
              }
              
              // Only emit particles when scrolling DOWN
              if (isScrollingDown) {
                console.log(`💧 PARTICLES: Emitting for step ${step.number}`);
                handleParticleEmission(step.number, step.title);
              }
            }
          }
        }
      });
      
      // Update the set of arrows currently in center
      setArrowsInCenter(newArrowsInCenter);
      setLastScrollY(currentScrollY);
      
      // Allow next scroll event to be processed
      setTimeout(() => {
        isProcessing = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    // Don't call handleScroll() on mount to avoid initial trigger
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [arrowsInCenter, lastScrollY]);

  // Play water droplet sound effect
  const playWaterDropSound = () => {
    // Create audio context for web audio API sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for the 'plink' sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure the water drop sound - softer tone
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime); // Lower start frequency
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.12); // Smoother drop
    
    // Configure volume envelope for that 'drop' effect - AUDIO ON
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);  // Quiet water drop sound
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    // Add a second 'plop' for more water-like effect
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.08);
      
      gainNode2.gain.setValueAtTime(0, audioContext.currentTime);  // Second tone muted
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.15);
    }, 100);
  };

  // Handle particle emission (for all arrows, only when scrolling down)
  const handleParticleEmission = (stepNumber: number, stepTitle: string) => {
    // Emit particles for any arrow (1-5)
    const arrowElement = document.getElementById(`workflow-step-${stepNumber}`);
    if (arrowElement) {
      const rect = arrowElement.getBoundingClientRect();
      const arrowCenterX = rect.left + rect.width / 2;
      const arrowCenterY = rect.top + rect.height / 2;
      
      // Add new particle emitter at arrow position
      const emitterId = `particles-${Date.now()}-${stepNumber}`;
      setParticleEmitters(prev => [...prev, { 
        id: emitterId, 
        x: arrowCenterX, 
        y: arrowCenterY 
      }]);
      
      console.log(`💧 Particles emitted from arrow ${stepNumber} at (${arrowCenterX}, ${arrowCenterY})`);
    }
  };
  
  // Clean up particle emitters after animation completes
  const handleParticleComplete = (emitterId: string) => {
    setParticleEmitters(prev => prev.filter(e => e.id !== emitterId));
  };

  // Scroll to center a specific workflow step
  const scrollToStep = (stepNumber: number) => {
    // Try different ID format
    const element = document.querySelector(`#workflow-step-${stepNumber}`);
    
    if (!element) {
      // Fallback: try to find by index
      const allSteps = document.querySelectorAll('[id^="workflow-step-"]');
      console.error(`Cannot find workflow-step-${stepNumber}. Found ${allSteps.length} workflow steps total.`);
      return;
    }

    // Simple scroll to element
    const yOffset = -100; // Account for navbar
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  };

  return (
    <section id="workflow" className="py-32" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            How We Work
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-body)' }}>
            Our proven 5-step process ensures your AI implementation succeeds from day one. 
            From discovery to delivery, we&apos;re with you every step of the way.
          </p>
        </motion.div>

        {/* Process Steps with Consistent Grid */}
        <div className="space-y-24 max-w-7xl mx-auto">
          {workflowSteps.map((step, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                id={`workflow-step-${step.number}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                {/* Desktop Layout - FIXED GRID */}
                <div className="hidden lg:grid lg:grid-cols-12 items-center gap-8">
                  {isEven ? (
                    <>
                      {/* Left Image */}
                      <div className="col-span-5">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl"
                          style={{ borderColor: '#4e8ad3', borderWidth: '2px' }}
                        >
                          <Image
                            src={stepImages[index]}
                            alt={step.title}
                            fill
                            className="object-cover"
                            priority={index < 2}
                          />
                        </motion.div>
                      </div>
                      
                      {/* Center Number */}
                      <div className="col-span-2 relative flex justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollToStep(step.number);
                          }}
                          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer transform transition-all duration-200 hover:scale-110"
                          style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0)'
                          }}
                          aria-label={`Go to step ${step.number}: ${step.title}`}
                        >
                          <ChevronDown 
                            className={`w-6 h-6 ${currentStep === step.number ? 'animate-pulse' : ''}`}
                            style={{ color: '#9ab6e0' }}
                          />
                        </button>
                      </div>
                      
                      {/* Right Content */}
                      <div className="col-span-5">
                        <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          {step.title}
                        </h3>
                        <p className="text-lg font-medium mb-4" style={{ color: '#4e8ad3' }}>
                          {step.subtitle}
                        </p>
                        <p className="text-base mb-6 leading-relaxed" style={{ color: '#FFFFFF' }}>
                          {step.description}
                        </p>
                        <ul className="space-y-3">
                          {step.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-3">
                              <div 
                                className="flex-shrink-0 w-5 h-5 rounded-full mt-0.5 flex items-center justify-center"
                                style={{ backgroundColor: '#4e8ad3' }}
                              >
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left Content */}
                      <div className="col-span-5">
                        <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          {step.title}
                        </h3>
                        <p className="text-lg font-medium mb-4" style={{ color: '#4e8ad3' }}>
                          {step.subtitle}
                        </p>
                        <p className="text-base mb-6 leading-relaxed" style={{ color: '#FFFFFF' }}>
                          {step.description}
                        </p>
                        <ul className="space-y-3">
                          {step.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-3">
                              <div 
                                className="flex-shrink-0 w-5 h-5 rounded-full mt-0.5 flex items-center justify-center"
                                style={{ backgroundColor: '#4e8ad3' }}
                              >
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Center Number */}
                      <div className="col-span-2 relative flex justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollToStep(step.number);
                          }}
                          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer transform transition-all duration-200 hover:scale-110"
                          style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0)'
                          }}
                          aria-label={`Go to step ${step.number}: ${step.title}`}
                        >
                          <ChevronDown 
                            className={`w-6 h-6 ${currentStep === step.number ? 'animate-pulse' : ''}`}
                            style={{ color: '#9ab6e0' }}
                          />
                        </button>
                      </div>
                      
                      {/* Right Image */}
                      <div className="col-span-5">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl"
                          style={{ borderColor: '#4e8ad3', borderWidth: '2px' }}
                        >
                          <Image
                            src={stepImages[index]}
                            alt={step.title}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden space-y-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`Mobile button clicked for step ${step.number}`);
                        scrollToStep(step.number);
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transform transition-all duration-200 hover:scale-110"
                      style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0)'
                      }}
                      aria-label={`Go to step ${step.number}: ${step.title}`}
                    >
                      <ChevronDown 
                        className="w-5 h-5"
                        style={{ color: '#9ab6e0' }}
                      />
                    </button>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </h3>
                      <p className="text-base font-medium" style={{ color: '#4e8ad3' }}>
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-xl">
                    <Image
                      src={stepImages[index]}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <p className="text-base leading-relaxed" style={{ color: '#FFFFFF' }}>
                    {step.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div 
                          className="flex-shrink-0 w-5 h-5 rounded-full mt-0.5 flex items-center justify-center"
                          style={{ backgroundColor: '#4e8ad3' }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
      
      {/* Render particle emitters */}
      {particleEmitters.map(emitter => (
        <WaterDropParticles
          key={emitter.id}
          x={emitter.x}
          y={emitter.y}
          onComplete={() => handleParticleComplete(emitter.id)}
        />
      ))}
    </section>
  );
}