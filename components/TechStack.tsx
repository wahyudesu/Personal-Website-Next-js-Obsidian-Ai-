import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import knowledgeBase from '@/data/knowledge_base.json';

const TechStack: React.FC = () => {
  // Ambil tech_stack dari JSON
  const techStack = knowledgeBase.tech_stack;

  return (
    <div className="flex flex-col items-center py-8">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-6 py-4">
        {techStack.map((tech, index) => {
          // Generate path ikon secara dinamis
          const iconPath = `/icons/${tech.toLowerCase().replace(/\s+/g, '-')}.svg`;

          return (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
                <Image
                  src={iconPath}
                  alt={tech}
                  fill
                  className="object-contain transition-transform duration-300 border-2 p-3 rounded-xl grayscale border-gray-300 hover:grayscale-0 hover:border-primary-500"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-gray-400 text-center">
                {tech}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStack;