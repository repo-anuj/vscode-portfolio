import React, { useState } from 'react';
import { X, Search, Download, RefreshCw, Package, Star, ExternalLink } from 'lucide-react';

/**
 * Props for the Extensions component
 */


interface ExtensionsProps {
  /** Whether the extensions panel is open */
  isOpen: boolean;
  /** Handler for close button click */
  onClose: () => void;
  /** Optional CSS class name */
  className?: string;
}

interface Extension {
  id: string;
  name: string;
  publisher: string;
  description: string;
  stars: number;
  downloads: number;
  verified: boolean;
  installed: boolean;
  icon: string;
}

/**
 * Extensions component that displays a panel of VS Code extensions
 *
 * @param {ExtensionsProps} props - Component props
 * @returns {JSX.Element | null} Rendered Extensions component or null if not open
 */
const Extensions: React.FC<ExtensionsProps> = ({ isOpen, onClose, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'tools'>('frontend');

  // Skills as extensions
  const extensions: Extension[] = [
  {
    id: 'react-mastery',
    name: 'React.js Mastery',
    publisher: 'Frontend Skills',
    description: 'Advanced React development including hooks, context API, and performance optimization techniques',
    stars: 4.9,
    downloads: 3500000,
    verified: true,
    installed: true,
    icon: '⚛️'
  },
  {
    id: 'typescript-pro',
    name: 'TypeScript Professional',
    publisher: 'Language Skills',
    description: 'Type-safe development with TypeScript including generics, utility types, and advanced type inference',
    stars: 4.8,
    downloads: 2800000,
    verified: true,
    installed: true,
    icon: '🔷'
  },
  {
    id: 'tailwind-expert',
    name: 'Tailwind CSS Expert',
    publisher: 'Styling Skills',
    description: 'Utility-first CSS framework implementation with custom configurations and responsive design',
    stars: 4.9,
    downloads: 3200000,
    verified: true,
    installed: true,
    icon: '🎨'
  },
  {
    id: 'next-js-developer',
    name: 'Next.js Developer',
    publisher: 'Framework Skills',
    description: 'Server-side rendering, static site generation, and API routes with Next.js',
    stars: 4.7,
    downloads: 2500000,
    verified: true,
    installed: true,
    icon: '▲'
  },
  {
    id: 'responsive-design',
    name: 'Responsive Design Master',
    publisher: 'UI/UX Skills',
    description: 'Creating fluid layouts that work seamlessly across all device sizes and orientations',
    stars: 4.8,
    downloads: 2900000,
    verified: true,
    installed: true,
    icon: '📱'
  },
  {
    id: 'api-integration',
    name: 'API Integration Specialist',
    publisher: 'Backend Skills',
    description: 'RESTful API integration, data fetching, and state management with various frontend frameworks',
    stars: 4.6,
    downloads: 2200000,
    verified: true,
    installed: true,
    icon: '🔌'
  },
  {
    id: 'animation-expert',
    name: 'Animation & Motion Effects',
    publisher: 'UI Skills',
    description: 'Creating smooth animations and transitions using Framer Motion and CSS animations',
    stars: 4.7,
    downloads: 1800000,
    verified: true,
    installed: true,
    icon: '✨'
  },
  {
    id: 'performance-optimizer',
    name: 'Performance Optimization',
    publisher: 'Technical Skills',
    description: 'Techniques for optimizing web application performance including code splitting and lazy loading',
    stars: 4.5,
    downloads: 1500000,
    verified: true,
    installed: true,
    icon: '⚡'
  },
  {
    id: 'git-workflow',
    name: 'Git & Collaboration',
    publisher: 'DevOps Skills',
    description: 'Version control with Git, branching strategies, and collaborative development workflows',
    stars: 4.6,
    downloads: 2100000,
    verified: true,
    installed: true,
    icon: '🔄'
  },
  {
    id: 'accessibility',
    name: 'Web Accessibility (a11y)',
    publisher: 'Inclusive Design',
    description: 'Creating accessible web applications following WCAG guidelines and best practices',
    stars: 4.4,
    downloads: 1200000,
    verified: true,
    installed: true,
    icon: '♿'
  }];


  // Add category to each extension
  const categorizedExtensions = extensions.map((ext) => {
    let category: 'frontend' | 'backend' | 'tools' = 'frontend';

    // Categorize based on extension id/name
    if (['react-mastery', 'typescript-pro', 'tailwind-expert', 'next-js-developer', 'responsive-design', 'animation-expert'].includes(ext.id)) {
      category = 'frontend';
    } else if (['api-integration', 'performance-optimizer', 'accessibility'].includes(ext.id)) {
      category = 'backend';
    } else {
      category = 'tools';
    }

    return { ...ext, category };
  });

  // Filter extensions based on search term and active tab
  const filteredExtensions = categorizedExtensions.
  filter((ext) =>
  ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  ext.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  ext.publisher.toLowerCase().includes(searchTerm.toLowerCase())
  ).
  filter((ext) => {
    if (activeTab === 'frontend') return ext.category === 'frontend';
    if (activeTab === 'backend') return ext.category === 'backend';
    return ext.category === 'tools'; // tools tab
  });

  if (!isOpen) return null;

  return (
    <div className={`w-[300px] h-full bg-vscode-sidebar border-l border-[#1e1e1e] flex flex-col z-50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[#3c3c3c]">
        <h2 className="text-sm font-medium text-white/90">Extensions</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-sm transition-colors">

          <X size={16} className="text-white/60" />
        </button>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-[#3c3c3c]">
        <div className="flex items-center bg-[#3c3c3c] rounded-sm px-2">
          <Search size={14} className="text-white/60 mr-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Extensions..."
            className="w-full bg-transparent border-none outline-none py-1 text-sm text-white/90 placeholder-white/40" />

        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#3c3c3c]">
        <button
          className={`flex-1 py-1 text-xs font-medium ${
          activeTab === 'frontend' ?
          'text-white border-b-2 border-white/80' :
          'text-white/60 hover:text-white/80'}`
          }
          onClick={() => setActiveTab('frontend')}>

          Frontend
        </button>
        <button
          className={`flex-1 py-1 text-xs font-medium ${
          activeTab === 'backend' ?
          'text-white border-b-2 border-white/80' :
          'text-white/60 hover:text-white/80'}`
          }
          onClick={() => setActiveTab('backend')}>

          Backend
        </button>
        <button
          className={`flex-1 py-1 text-xs font-medium ${
          activeTab === 'tools' ?
          'text-white border-b-2 border-white/80' :
          'text-white/60 hover:text-white/80'}`
          }
          onClick={() => setActiveTab('tools')}>

          Tools
        </button>
      </div>

      {/* Extension List */}
      <div className="flex-1 overflow-y-auto">
        {filteredExtensions.length === 0 ? (
            <div className="p-4 text-white/40 text-center text-sm">
            No extensions found
          </div>
          ) : (
          <div className="divide-y divide-[#3c3c3c]/30">
            {filteredExtensions.map((extension) => (
            <div key={extension.id} className="p-3 hover:bg-[#2a2d2e] cursor-pointer">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">{extension.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white/90 truncate">{extension.name}</h3>
                      {extension.installed ? (
                      <button className="text-xs bg-[#4d4d4d] text-white/80 px-1.5 py-0.5 rounded-sm">
                          Installed
                        </button>
                    ) : (
                      <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded-sm flex items-center">
                          <Download size={10} className="mr-1" />
                          Install
                        </button>
                    )}
                    </div>
                    <div className="text-xs text-white/60 flex items-center mt-0.5">
                      {extension.publisher}
                      {extension.verified && (
                    <span className="ml-1 text-blue-400 text-[10px]">✓</span>
                    )}
                    </div>
                    <p className="text-xs text-white/70 mt-1 line-clamp-2">
                      {extension.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-white/60">
                      <div className="flex items-center mr-3">
                        <Star size={12} className="mr-1 text-yellow-400" />
                        {extension.stars}
                      </div>
                      <div className="flex items-center">
                        <Download size={12} className="mr-1" />
                        {extension.downloads.toLocaleString()}
                      </div>
                      <a
                      href="#"
                      className="ml-auto text-white/50 hover:text-white/80"
                      title="View in Marketplace">

                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#3c3c3c] flex justify-between">
        <button className="text-xs text-white/60 hover:text-white/80 flex items-center">
          <RefreshCw size={12} className="mr-1" />
          Refresh
        </button>
        <button className="text-xs text-white/60 hover:text-white/80 flex items-center">
          <Package size={12} className="mr-1" />
          More Extensions
        </button>
      </div>
    </div>
  );
};

export default Extensions;