import Image from 'next/image';
import React from 'react';

const techStack = [
  { name: 'Figma', icon: '/icons/figma.svg' },
  { name: 'TypeScript', icon: '/icons/typescript.svg' },
  { name: 'Next.js', icon: '/icons/nextjs.svg' },
  { name: 'Git', icon: '/icons/git.svg' },
  { name: 'Python', icon: '/icons/python.svg' },
  { name: 'Tableau', icon: '/icons/tableau.svg' },
  { name: 'PyTorch', icon: '/icons/pytorch.svg' },
  { name: 'R', icon: '/icons/r-project-icon.svg' },
  { name: 'Hugging Face', icon: '/icons/hf.svg' },
  { name: 'PostgreSQL', icon: '/icons/postgre.svg' },
  { name: 'TensorFlow', icon: '/icons/tensorflow-icon.svg' },
  { name: 'Grafana', icon: '/icons/grafana.svg' },
  { name: 'D3js', icon: '/icons/d3.svg' },
];

const TechStack: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-6 py-4">
        {techStack.map((tech, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
              <Image
                src={tech.icon}
                alt={tech.name}
                fill
                className="object-contain transition-transform duration-300 border-2 p-3 rounded-xl grayscale border-gray-300 hover:grayscale-0 hover:border-primary-500"
              />
            </div>
            <p className="mt-2 text-xs font-medium text-gray-400 text-center">
              {tech.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;