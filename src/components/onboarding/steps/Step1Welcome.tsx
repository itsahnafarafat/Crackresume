
'use client';

import { motion } from 'framer-motion';
import { Bot, Briefcase, Target, PartyPopper } from 'lucide-react';

const benefits = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Resumes',
    description: 'Generate ATS-friendly resumes and cover letters tailored to any job description in seconds.',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Track Applications',
    description: 'Manage your entire job search pipeline from "Saved" to "Offer" in one organized place.',
  },
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: 'Land Interviews Faster',
    description: 'Analyze your resume-to-job match score to understand your strengths and apply with confidence.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export function Step1Welcome() {
  return (
    <div className="space-y-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <PartyPopper className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Welcome to Crackresume! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Let's get your profile set up in less than 2 minutes.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="p-6 bg-secondary/30 rounded-lg border border-border/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30"
            variants={itemVariants}
          >
            <div className="flex justify-center mb-3">{benefit.icon}</div>
            <h3 className="font-semibold text-lg text-foreground">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
