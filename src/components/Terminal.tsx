import { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  X,
  Minus,
  Square,
  Maximize2,
  Download,
  Mail,
  FileText,
  Folder} from
'lucide-react';
import { GitHubIcon } from './icons/GitHubIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import emailjs from '@emailjs/browser';
import CodePlayground from './CodePlayground';
import ChatBot from './ChatBot';



interface Command {
  command: string;
  description: string;
  action: (args: string[], terminal: TerminalController) => string | JSX.Element;
  usage?: string;
  aliases?: string[];
}

interface TerminalController {
  addLine: (input?: string, output?: string | JSX.Element) => void;
  clearLines: () => void;
  setTheme: (theme: TerminalTheme) => void;
  getCurrentDirectory: () => string;
  changeDirectory: (path: string) => void;
  getFileSystem: () => FileSystemItem;
  getCommandHistory: () => string[];
}

interface TerminalTheme {
  id: string;
  name: string;
  background: string;
  text: string;
  prompt: string;
  directory: string;
  selection: string;
  accent: string;
}

interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileSystemItem>;
}

const WELCOME_MESSAGE = `Welcome to Portfolio Terminal v2.0.0
Type 'help' to see available commands or 'tutorial' for a guided tour.
Current path: ~/portfolio

[Portfolio Terminal] Connected
`;

const CONTACT_WELCOME_MESSAGE = `Welcome to Contact Form Terminal
I'm excited to hear from you! Let's get started...

[Contact Form] Ready
Enter you name:-
`;

interface ContactFormState {
  step: number;
  name: string;
  email: string;
  message: string;
}

// Terminal themes
const TERMINAL_THEMES: TerminalTheme[] = [
{
  id: 'dark',
  name: 'Dark (Default)',
  background: '#1e1e1e',
  text: 'rgba(255, 255, 255, 0.8)',
  prompt: '#4EC9B0',
  directory: '#569CD6',
  selection: 'rgba(255, 255, 255, 0.1)',
  accent: '#C586C0'
},
{
  id: 'light',
  name: 'Light',
  background: '#f5f5f5',
  text: '#333333',
  prompt: '#0E7490',
  directory: '#0369A1',
  selection: 'rgba(0, 0, 0, 0.1)',
  accent: '#9333EA'
},
{
  id: 'monokai',
  name: 'Monokai',
  background: '#272822',
  text: '#F8F8F2',
  prompt: '#A6E22E',
  directory: '#66D9EF',
  selection: 'rgba(255, 255, 255, 0.1)',
  accent: '#F92672'
},
{
  id: 'github',
  name: 'GitHub',
  background: '#ffffff',
  text: '#24292e',
  prompt: '#2DA44E',
  directory: '#0969DA',
  selection: 'rgba(0, 0, 0, 0.1)',
  accent: '#8250DF'
},
{
  id: 'dracula',
  name: 'Dracula',
  background: '#282a36',
  text: '#f8f8f2',
  prompt: '#50fa7b',
  directory: '#8be9fd',
  selection: 'rgba(255, 255, 255, 0.1)',
  accent: '#ff79c6'
}];


// File system simulation
const createFileSystem = (): FileSystemItem => ({
  name: 'portfolio',
  type: 'directory',
  children: {
    'README.md': {
      name: 'README.md',
      type: 'file',
      content: `# Anuj Dubey's Portfolio

Welcome to my portfolio project! This is a VS Code-inspired interface to showcase my work and skills.

## Features
- Interactive terminal
- Project showcase
- Skills and experience
- Contact form

Feel free to explore using the terminal commands or the sidebar navigation.
`
    },
    'resume.pdf': {
      name: 'resume.pdf',
      type: 'file',
      content: '[PDF Content] My resume with detailed work experience and education.'
    },
    'src': {
      name: 'src',
      type: 'directory',
      children: {
        'components': {
          name: 'components',
          type: 'directory',
          children: {
            'Terminal.tsx': {
              name: 'Terminal.tsx',
              type: 'file',
              content: '// This is the terminal component you are currently using!'
            },
            'Header.tsx': {
              name: 'Header.tsx',
              type: 'file',
              content: '// Header component for the VS Code interface'
            }
          }
        },
        'pages': {
          name: 'pages',
          type: 'directory',
          children: {
            'Home.tsx': {
              name: 'Home.tsx',
              type: 'file',
              content: '// Home page component'
            },
            'About.tsx': {
              name: 'About.tsx',
              type: 'file',
              content: '// About page with my background'
            },
            'Projects.tsx': {
              name: 'Projects.tsx',
              type: 'file',
              content: '// Projects showcase page'
            }
          }
        },
        'App.tsx': {
          name: 'App.tsx',
          type: 'file',
          content: '// Main application component'
        },
        'index.tsx': {
          name: 'index.tsx',
          type: 'file',
          content: '// Entry point for the React application'
        }
      }
    },
    'projects': {
      name: 'projects',
      type: 'directory',
      children: {
        'project1.md': {
          name: 'project1.md',
          type: 'file',
          content: '# Project 1\nA detailed description of my first project.'
        },
        'project2.md': {
          name: 'project2.md',
          type: 'file',
          content: '# Project 2\nA detailed description of my second project.'
        }
      }
    },
    'contact.json': {
      name: 'contact.json',
      type: 'file',
      content: `{
  "email": "00a20.j50@gmai.com.com",
  "github": "https://github.com/repo-anuj",
  "linkedin": "https://www.linkedin.com/in/anuj-0-dubey-26963527b/"
}`
    }
  }
});

// Define commands
const COMMANDS: Record<string, Command> = {
  help: {
    command: 'help',
    description: 'List all available commands',
    usage: 'help [command]',
    action: (args, _terminal) => {
      if (args.length > 0) {
        const cmdName = args[0].toLowerCase();
        const cmd = COMMANDS[cmdName];
        if (cmd) {
          return (
          <div className="text-white/80">
              <div className="mb-2">
                <span className="text-vscode-accent font-bold">{cmd.command}</span>
                {cmd.aliases && cmd.aliases.length > 0 && (
                <span className="text-white/60 ml-2">(aliases: {cmd.aliases.join(', ')})</span>
              )}
              </div>
              <div className="mb-2">{cmd.description}</div>
              {cmd.usage && <div className="mb-2">Usage: {cmd.usage}</div>}
            </div>
          );
        } else {
          return `Command not found: ${cmdName}`;
        }
      }

      return (
        <div className="text-white/80">
          <p className="mb-2">Available commands:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            {Object.values(COMMANDS).map((cmd) => (
              <div key={cmd.command} className="flex items-start">
                <span className="text-vscode-accent font-medium w-24 inline-block">{cmd.command}</span>
                <span className="text-white/70">{cmd.description}</span>
              </div>
              ))}
          </div>
          <p className="mt-3 text-white/60">Type 'help [command]' for more information about a specific command.</p>
        </div>
      );
    }
  },
  clear: {
    command: 'clear',
    description: 'Clear the terminal',
    aliases: ['cls'],
    action: (_, terminal) => {
      terminal.clearLines();
      return '';
    }
  },
  echo: {
    command: 'echo',
    description: 'Print text to the terminal',
    usage: 'echo [text...]',
    action: (args, _) => args.join(' ')
  },
  date: {
    command: 'date',
    description: 'Display current date and time',
    action: (_, __) => new Date().toLocaleString()
  },
  whoami: {
    command: 'whoami',
    description: 'Display current user',
    action: (_, __) => 'Anuj Dubey'
  },
  joke: {
    command: 'joke',
    description: 'Tell a programming joke',
    action: (_, __) => {
      const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "Why did the developer go broke? Because he used up all his cache!",
      "What's a programmer's favorite hangout spot? The Foo Bar!",
      "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25!",
      "Why did the programmer quit his job? Because he didn't get arrays!",
      "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
      "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
      "Why did the developer quit his job? He didn't get arrays!",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
      "Why do Java developers wear glasses? Because they don't C#!"];

      return jokes[Math.floor(Math.random() * jokes.length)];
    }
  },
  weather: {
    command: 'weather',
    description: 'Show current weather (simulated)',
    usage: 'weather [city]',
    action: (args, _) => {
      const city = args.length > 0 ? args.join(' ') : 'Current location';
      const conditions = ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Stormy', 'Snowy', 'Foggy'];
      const temp = Math.floor(Math.random() * 30) + 10;
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const humidity = Math.floor(Math.random() * 50) + 30;

      return (
        <div className="space-y-1">
          <div className="font-bold">Weather for {city}:</div>
          <div>🌡️ Temperature: {temp}°C</div>
          <div>🌤️ Conditions: {condition}</div>
          <div>💧 Humidity: {humidity}%</div>
          <div className="text-white/50 text-xs mt-2">Note: This is simulated weather data</div>
        </div>
      );
    }
  },
  github: {
    command: 'github',
    description: 'Open my GitHub profile',
    action: (_, __) => {
      window.open('https://github.com/repo-anuj', '_blank');
      return (
        <div className="flex items-center gap-2">
          <GitHubIcon size={16} className="text-white" />
          <span>Opening GitHub profile in a new tab...</span>
        </div>
      );
    }
  },
  linkedin: {
    command: 'linkedin',
    description: 'Open my LinkedIn profile',
    action: (_, __) => {
      window.open('https://linkedin.com/in/anuj-dubey', '_blank');
      return (
        <div className="flex items-center gap-2">
          <LinkedInIcon size={16} className="text-blue-500" />
          <span>Opening LinkedIn profile in a new tab...</span>
        </div>
      );
    }
  },
  matrix: {
    command: 'matrix',
    description: 'Display Matrix-like animation',
    action: (_, __) => {
      return (
      <div className="font-mono text-green-500 animate-pulse">
          {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="opacity-80">
              {Array.from({ length: 60 }, () =>
          String.fromCharCode(Math.floor(Math.random() * 94) + 33)
          ).join('')}
            </div>
        ))}
        </div>
      );
    }
  },
  skills: {
    command: 'skills',
    description: 'List my technical skills',
    action: (_, __) => {
      const skills = {
        'Frontend': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Next.js'],
        'Backend': ['Node.js', 'Express', 'Python', 'Django', 'SQL', 'MongoDB', 'Firebase'],
        'DevOps': ['Git', 'GitHub Actions', 'Docker', 'AWS', 'Vercel', 'Netlify'],
        'Tools': ['VS Code', 'Figma', 'Postman', 'Jest', 'Webpack']
      };
      return (
        <div className="text-white/80 space-y-3">
          <div className="text-lg font-bold text-vscode-accent">My Technical Skills</div>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="mb-2">
              <div className="text-vscode-accent font-medium mb-1">{category}:</div>
              <div className="pl-4 flex flex-wrap gap-1">
                {items.map((skill) => (
                <span key={skill} className="px-2 py-1 bg-white/10 rounded-md text-xs">{skill}</span>
                ))}
              </div>
            </div>
            ))}
        </div>
      );
    }
  },
  pwd: {
    command: 'pwd',
    description: 'Print current working directory',
    action: (_, terminal) => terminal.getCurrentDirectory()
  },
  ls: {
    command: 'ls',
    description: 'List directory contents',
    aliases: ['dir'],
    usage: 'ls [path]',
    action: (args, terminal) => {
      // Get current directory path
      const currentPath = terminal.getCurrentDirectory();
      const targetPath = args.length > 0 ? args[0] : currentPath;

      // Navigate to the target directory in our file system
      const fs = terminal.getFileSystem();
      let currentDir = fs;

      // If we're not at root, navigate to the current directory
      if (targetPath !== '~') {
        const pathParts = targetPath.split('/').filter(Boolean);
        for (const part of pathParts) {
          if (part === '..') {
            // Not handling parent directory navigation in this simple example
            continue;
          }
          if (!currentDir.children || !currentDir.children[part]) {
            return `ls: cannot access '${targetPath}': No such file or directory`;
          }
          currentDir = currentDir.children[part];
        }
      }

      if (currentDir.type !== 'directory') {
        return `ls: cannot list '${targetPath}': Not a directory`;
      }

      if (!currentDir.children || Object.keys(currentDir.children).length === 0) {
        return 'Directory is empty';
      }

      return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Object.values(currentDir.children || {}).map((item) => (
        <div key={item.name} className="flex items-center gap-1">
              {item.type === 'directory' ? (
          <Folder size={16} className="text-blue-400" />
          ) : (
          <FileText size={16} className="text-yellow-400" />
          )}
              <span className={item.type === 'directory' ? 'text-blue-400' : 'text-yellow-400'}>
                {item.name}
              </span>
            </div>
        ))}
        </div>
      );
    }
  },
  cd: {
    command: 'cd',
    description: 'Change directory',
    usage: 'cd [directory]',
    action: (args, terminal) => {
      if (args.length === 0) {
        terminal.changeDirectory('~');
        return 'Changed to home directory';
      }

      const targetDir = args[0];
      terminal.changeDirectory(targetDir);
      return `Changed directory to ${terminal.getCurrentDirectory()}`;
    }
  },
  cat: {
    command: 'cat',
    description: 'Display file contents',
    usage: 'cat <file>',
    action: (args, terminal) => {
      if (args.length === 0) {
        return 'Usage: cat <file>';
      }

      const fileName = args[0];
      const fs = terminal.getFileSystem();
      const currentPath = terminal.getCurrentDirectory().split('/').filter(Boolean);

      let currentDir = fs;
      for (const part of currentPath) {
        if (!currentDir.children || !currentDir.children[part]) {
          return `cat: ${fileName}: No such file or directory`;
        }
        currentDir = currentDir.children[part];
      }

      if (!currentDir.children || !currentDir.children[fileName]) {
        return `cat: ${fileName}: No such file or directory`;
      }

      const file = currentDir.children[fileName];
      if (file.type !== 'file') {
        return `cat: ${fileName}: Is a directory`;
      }

      return (
      <div className="whitespace-pre-wrap bg-black/20 p-2 rounded">
          {file.content}
        </div>
      );
    }
  },
  theme: {
    command: 'theme',
    description: 'Change terminal theme',
    usage: 'theme [theme-name]',
    action: (args, terminal) => {
      if (args.length === 0) {
        return (
          <div className="space-y-2">
            <div>Available themes:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TERMINAL_THEMES.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/10"
                  onClick={() => terminal.setTheme(theme)}>

                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accent }} />

                  <span>{theme.name}</span>
                </div>
                ))}
            </div>
            <div className="text-white/60 text-xs">Click on a theme to apply it, or use 'theme [name]'</div>
          </div>
        );
      }

      const themeName = args[0].toLowerCase();
      const theme = TERMINAL_THEMES.find((t) => t.id === themeName);

      if (!theme) {
        return `Theme '${themeName}' not found. Use 'theme' to see available themes.`;
      }

      terminal.setTheme(theme);
      return `Applied theme: ${theme.name}`;
    }
  },
  contact: {
    command: 'contact',
    description: 'Start the interactive contact form',
    action: (_, __) => CONTACT_WELCOME_MESSAGE
  },
  history: {
    command: 'history',
    description: 'Show command history',
    action: (_, terminal) => {
      const history = terminal.getCommandHistory();
      if (history.length === 0) {
        return 'No commands in history';
      }

      return (
      <div className="space-y-1">
          {history.map((cmd, i) => (
        <div key={i} className="flex gap-2">
              <span className="text-white/50 w-6 text-right">{i + 1}</span>
              <span>{cmd}</span>
            </div>
        ))}
        </div>
      );
    }
  },
  resume: {
    command: 'resume',
    description: 'View or download my resume',
    action: (_, __) => {
      return (
        <div className="space-y-3">
          <div className="text-lg font-bold">Anuj Dubey - Resume</div>
          <div className="flex gap-4">
            <button
              onClick={() => window.open('/Anuj_Dubey_Resume.pdf', '_blank')}
              className="flex items-center gap-2 px-3 py-2 bg-vscode-accent/20 hover:bg-vscode-accent/30 rounded-md transition-colors">

              <FileText size={16} />
              <span>View Resume</span>
            </button>
            <a
              href="/Anuj_Dubey_Resume.pdf"
              download
              className="flex items-center gap-2 px-3 py-2 bg-vscode-accent/20 hover:bg-vscode-accent/30 rounded-md transition-colors">

              <Download size={16} />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      );
    }
  },
  tutorial: {
    command: 'tutorial',
    description: 'Start an interactive terminal tutorial',
    action: (_, terminal) => {
      terminal.addLine('', (
        <div className="space-y-3 bg-vscode-accent/10 p-3 rounded-md border-l-4 border-vscode-accent">
          <div className="text-lg font-bold">Welcome to the Terminal Tutorial!</div>
          <p>This terminal is a fully interactive command-line interface that simulates a real terminal experience.</p>
          <p>Here are some commands to try:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-vscode-accent">ls</span> - List files in the current directory</li>
            <li><span className="text-vscode-accent">cd src</span> - Change to the src directory</li>
            <li><span className="text-vscode-accent">cat README.md</span> - View the content of a file</li>
            <li><span className="text-vscode-accent">skills</span> - See my technical skills</li>
            <li><span className="text-vscode-accent">playground</span> - Launch interactive code playground</li>
            <li><span className="text-vscode-accent">chatbot</span> - Launch AI assistant chatbot</li>
            <li><span className="text-vscode-accent">theme</span> - Change the terminal theme</li>
            <li><span className="text-vscode-accent">contact</span> - Start the contact form</li>
          </ul>
          <p>Use the <span className="text-vscode-accent">help</span> command to see all available commands.</p>
          <p>Have fun exploring!</p>
        </div>
      ));
      return '';
    }
  },
  chatbot: {
    command: 'chatbot',
    description: 'Launch AI assistant chatbot',
    aliases: ['chat', 'assistant', 'ai'],
    action: (_, _terminal) => {
      return {
        __type: 'LAUNCH_CHATBOT',
        content: (
          <div className="space-y-3 bg-vscode-accent/10 p-3 rounded-md border-l-4 border-vscode-accent">
            <div className="text-lg font-bold">AI Assistant</div>
            <p>Launching the AI assistant chatbot...</p>
            <p className="text-white/60 text-sm mt-2">
              The AI assistant can answer questions about my skills, projects, and experience.
            </p>
          </div>
        )
      } as any;
    }
  },

  playground: {
    command: 'playground',
    description: 'Launch interactive code playground',
    aliases: ['code', 'editor'],
    action: (_, _terminal) => {
      return {
        __type: 'LAUNCH_CODE_PLAYGROUND',
        content: (
          <div className="space-y-3 bg-vscode-accent/10 p-3 rounded-md border-l-4 border-vscode-accent">
            <div className="text-lg font-bold">Code Playground</div>
            <p>Launching the interactive code playground...</p>
            <p className="text-white/60 text-sm mt-2">
              The code playground allows you to write and execute JavaScript code directly in your browser.
            </p>
          </div>
        )
      } as any;
    }
  },

  social: {
    command: 'social',
    description: 'Display my social media links and profiles',
    action: (_, terminal) => {
      return (
        <div className="space-y-4">
          <div className="text-lg font-bold text-vscode-accent">Connect with me</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Professional Networks */}
            <div className="space-y-2">
              <h3 className="text-white/80 text-sm font-medium border-b border-white/10 pb-1">Professional</h3>
              <div className="flex flex-col gap-2">
                <a
                  href="https://github.com/repo-anuj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-[#24292e]/80 hover:bg-[#24292e] text-white rounded-md transition-colors">

                  <GitHubIcon size={16} />
                  <span>GitHub</span>
                  <span className="text-xs text-white/50 ml-auto">@repo-anuj</span>
                </a>
                <a
                  href="https://linkedin.com/in/anuj-dubey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-[#0077b5]/80 hover:bg-[#0077b5] text-white rounded-md transition-colors">

                  <LinkedInIcon size={16} />
                  <span>LinkedIn</span>
                  <span className="text-xs text-white/50 ml-auto">anuj-dubey</span>
                </a>
                <a
                  href="https://dev.to/anujdubey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-[#632CA6]/80 hover:bg-[#632CA6] text-white rounded-md transition-colors">

                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
                  </svg>
                  <span>Dev.to</span>
                  <span className="text-xs text-white/50 ml-auto">@anujdubey</span>
                </a>
              </div>
            </div>

            {/* Social Networks */}
            <div className="space-y-2">
              <h3 className="text-white/80 text-sm font-medium border-b border-white/10 pb-1">Social & Contact</h3>
              <div className="flex flex-col gap-2">
                <a
                  href="https://twitter.com/anujdubey_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-[#1DA1F2]/80 hover:bg-[#1DA1F2] text-white rounded-md transition-colors">

                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <span>Twitter</span>
                  <span className="text-xs text-white/50 ml-auto">@anujdubey_dev</span>
                </a>
                <a
                  href="https://instagram.com/anuj.codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#405DE6] via-[#E1306C] to-[#FFDC80] text-white rounded-md transition-colors">

                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span>Instagram</span>
                  <span className="text-xs text-white/50 ml-auto">@anuj.codes</span>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('anuj.dubey@example.com').
                    then(() => {
                      terminal.addLine('', (
                        <div className="text-green-400">
                            ✓ Email copied to clipboard!
                          </div>
                      ));
                    }).
                    catch((err) => console.error('Could not copy email: ', err));
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-[#ea4335]/80 hover:bg-[#ea4335] text-white rounded-md transition-colors">

                  <Mail size={16} />
                  <span>Email</span>
                  <span className="text-xs text-white/50 ml-auto">Click to copy</span>
                </button>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-4 p-3 bg-vscode-accent/10 rounded-md border border-vscode-accent/20">
            <h3 className="text-white font-medium mb-2">Stay Updated</h3>
            <p className="text-white/70 text-sm mb-3">
              Follow me on social media for updates on new projects, blog posts, and tech insights.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  terminal.addLine('', (
                    <div className="text-vscode-accent">
                      💡 Pro tip: Use the 'contact' command to send me a direct message!
                    </div>
                  ));
                }}
                className="px-3 py-1.5 bg-vscode-accent text-white rounded-md hover:bg-vscode-accent/90 transition-colors text-sm">

                Contact Me
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
};

interface TerminalProps {
  onClose: () => void;
  startContactForm: boolean;
  className?: string;
  onLaunchCodePlayground?: () => void;
  onLaunchChatBot?: () => void;
}

interface TerminalLine {
  input?: string;
  output?: string | JSX.Element;
}

const Terminal = ({ onClose, startContactForm, className = '', onLaunchCodePlayground, onLaunchChatBot }: TerminalProps) => {
  // Basic terminal state
  const [lines, setLines] = useState<TerminalLine[]>([
  { output: startContactForm ? CONTACT_WELCOME_MESSAGE : WELCOME_MESSAGE }]
  );
  const [showCodePlayground, setShowCodePlayground] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [startDragY, setStartDragY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactFormState>({
    step: startContactForm ? 1 : 0,
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File system and theme state
  const [fileSystem] = useState<FileSystemItem>(createFileSystem());
  const [currentDirectory, setCurrentDirectory] = useState<string>('~/portfolio');
  const setCurrentTheme = useState<TerminalTheme>(TERMINAL_THEMES[0])[1];

  // Refs
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  // Use resize variables
  useEffect(() => {
    if (isDraggingRef.current) {
      setStartDragY(0);
      setStartHeight(0);
    }
  }, []);

  // Handle terminal resize
  useEffect(() => {
    const handleResize = () => {
      if (resizeRef.current && isDraggingRef.current) {
        const currentHeight = startHeight + startDragY;
        setTerminalHeight(Math.min(currentHeight, window.innerHeight));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [startHeight, startDragY]);

  // Use addLine in a cleanup effect
  useEffect(() => {
    return () => {
      if (lines.length > 1000) {
        addLine('', 'Clearing terminal history...');
      }
    };
  }, [lines.length]);

  // Auto-scroll to bottom when lines change with smooth behavior
  useEffect(() => {
    if (terminalRef.current) {
      // Use smooth scrolling for better UX
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [lines]);

  // Ensure terminal is scrolled to bottom when it becomes visible or resized
  useEffect(() => {
    const scrollToBottom = () => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    };

    // Small delay to ensure the terminal is fully rendered
    const timeoutId = setTimeout(scrollToBottom, 100);

    // Also scroll to bottom when terminal is resized
    window.addEventListener('resize', scrollToBottom);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', scrollToBottom);
    };
  }, [isMaximized, terminalHeight]);

  const handleContactForm = (input: string) => {
    let output: string | JSX.Element = '';

    switch (contactForm.step) {
      case 1: // Name entered
        if (input.trim().length < 2) {
          output = (
            <div className="text-yellow-400">
              <p>⚠️ Please enter a valid name (at least 2 characters).</p>
              <p className="text-white/60 mt-1">Your name helps me address you properly in my response.</p>
            </div>
          );
        } else if (!/^[a-zA-Z\s'-]+$/.test(input.trim())) {
          output = (
            <div className="text-yellow-400">
              <p>⚠️ Please enter a name with valid characters (letters, spaces, hyphens, and apostrophes only).</p>
            </div>
          );
        } else {
          setContactForm((prev) => ({ ...prev, name: input.trim(), step: 2 }));
          output = (
            <div>
              <p className="text-green-400">👋 Nice to meet you, {input.trim()}!</p>
              <p className="mt-1">Please enter your email address:</p>
              <p className="text-white/60 text-xs mt-1">(This will be used to respond to your message)</p>
            </div>
          );
        }
        break;

      case 2: // Email entered
        // More comprehensive email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(input.trim())) {
          output = (
            <div className="text-yellow-400">
              <p>⚠️ Please enter a valid email address.</p>
              <p className="text-white/60 mt-1">Format: example@domain.com</p>
            </div>
          );
        } else {
          setContactForm((prev) => ({ ...prev, email: input.trim(), step: 3 }));
          output = (
            <div>
              <p className="text-green-400">📧 Great! Your email looks good.</p>
              <p className="mt-1">Now, what would you like to tell me?</p>
              <p className="text-white/60 mt-1">(Please be specific about your project, requirements, or questions)</p>
              <p className="text-white/60">(Type your message and press Enter)</p>
            </div>
          );
        }
        break;

      case 3: // Message entered
        if (input.trim().length < 10) {
          output = (
            <div className="text-yellow-400">
              <p>⚠️ Please enter a more detailed message (at least 10 characters).</p>
              <p className="text-white/60 mt-1">A detailed message helps me understand your needs better.</p>
            </div>
          );
        } else if (input.trim().length > 1000) {
          output = (
            <div className="text-yellow-400">
              <p>⚠️ Your message is too long (maximum 1000 characters).</p>
              <p className="text-white/60 mt-1">Current length: {input.trim().length} characters. Please be more concise.</p>
            </div>
          );
        } else {
          setContactForm((prev) => ({ ...prev, message: input.trim() }));
          handleContactSubmit();
        }
        break;
    }

    return output;
  };

  const handleContactSubmit = async () => {
    if (isSubmitting) return;

    const { name, email, message } = contactForm;
    if (!name || !email || !message) {
      setLines((prev) => [...prev, {
        output: (
          <div className="text-yellow-400">
            <p>⚠️ Please fill in all fields before submitting.</p>
            <p className="text-white/60 mt-1">All information is required to process your message.</p>
          </div>
        )
      }]);
      return;
    }

    setIsSubmitting(true);
    setLines((prev) => [...prev, {
      output: (
        <div className="animate-pulse">
          <p>📤 Sending your message...</p>
          <div className="mt-2 flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-vscode-accent"
                style={{ animationDelay: `${i * 0.15}s` }}>
              </div>
              ))}
          </div>
        </div>
      )
    }]);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          message: message,
          to_name: "Anuj Dubey",
          reply_to: email,
          sent_at: new Date().toLocaleString()
        }
      );

      // Add a small delay to show the loading animation
      await new Promise((resolve) => setTimeout(resolve, 800));

      setLines((prev) => [...prev, {
        output: (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-lg">✓</span>
              </div>
              <p className="text-green-400 font-medium">Message sent successfully!</p>
            </div>

            <div className="pl-4 border-l-2 border-green-400/30 py-2 my-2">
              <div className="text-white/90 font-medium mb-1">Message Summary:</div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                <span className="text-vscode-accent">Name:</span>
                <span className="text-white/80">{name}</span>

                <span className="text-vscode-accent">Email:</span>
                <span className="text-white/80">{email}</span>

                <span className="text-vscode-accent">Message:</span>
                <span className="text-white/80 whitespace-pre-wrap">{message}</span>
              </div>
            </div>

            <div className="bg-vscode-accent/10 p-3 rounded-md border border-vscode-accent/20 mt-2">
              <p className="text-white/90">
                <span className="text-vscode-accent font-medium">Next steps: </span>
                I'll review your message and get back to you within 24-48 hours. Thank you for reaching out!
              </p>
            </div>
          </div>
        )
      }]);
      setContactForm({ step: 0, name: '', email: '', message: '' });

    } catch (error) {
      console.error('Email sending failed:', error);
      setLines((prev) => [...prev, {
        output: (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="font-medium">Failed to send message</p>
            </div>
            <p className="text-white/70">Please try again or contact me directly at anuj.dubey@example.com</p>
            <div className="bg-red-500/10 p-2 rounded-md border border-red-500/20 mt-2 text-sm">
              <p className="text-white/80">
                <span className="text-red-400 font-medium">Troubleshooting: </span>
                Check your internet connection and try again in a few moments.
              </p>
            </div>
          </div>
        )
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Terminal controller implementation
  const terminalController: TerminalController = {
    addLine: (input, output) => {
      setLines((prev) => [...prev, { input, output }]);
    },
    clearLines: () => {
      setLines([]);
    },
    setTheme: (theme) => {
      setCurrentTheme(theme);
    },
    getCurrentDirectory: () => {
      return currentDirectory;
    },
    changeDirectory: (path) => {
      // Simple directory navigation
      if (path === '~') {
        setCurrentDirectory('~/portfolio');
        return;
      }

      if (path === '..') {
        // Go up one level
        const parts = currentDirectory.split('/');
        if (parts.length > 2) {// Don't go above ~/portfolio
          parts.pop();
          setCurrentDirectory(parts.join('/'));
        }
        return;
      }

      // Handle absolute paths
      if (path.startsWith('~/')) {
        setCurrentDirectory(path);
        return;
      }

      // Handle relative paths
      setCurrentDirectory(`${currentDirectory}/${path}`.replace(/\/+/g, '/'));
    },
    getFileSystem: () => {
      return fileSystem;
    },
    getCommandHistory: () => {
      return commandHistory;
    }
  };

  // Terminal output handling functions can be added here when needed

  // Handle command execution
  const handleCommand = (input: string) => {
    if (startContactForm && contactForm.step !== 0) {
      const output = handleContactForm(input);
      if (output) {
        terminalController.addLine('', output);
      }
      return;
    }

    const args = input.trim().split(' ');
    const commandName = args[0].toLowerCase();

    // Check for aliases
    let foundCommand: Command | undefined = COMMANDS[commandName];
    if (!foundCommand) {
      // Look for command by alias
      foundCommand = Object.values(COMMANDS).find((cmd) =>
      cmd.aliases?.includes(commandName)
      );
    }

    let output: string | JSX.Element | any;
    if (foundCommand) {
      output = foundCommand.action(args.slice(1), terminalController);

      // Handle special commands
      if (foundCommand.command === 'contact') {
        setContactForm((prev) => ({ ...prev, step: 1 }));
      } else if (foundCommand.command === 'playground' || foundCommand.command === 'code' || foundCommand.command === 'editor') {
        if (output && output.__type === 'LAUNCH_CODE_PLAYGROUND') {
          if (onLaunchCodePlayground) {
            onLaunchCodePlayground();
            terminalController.addLine(input, output.content);
          } else {
            setShowCodePlayground(true);
            terminalController.addLine(input, output.content);
          }
          return;
        }
      } else if (foundCommand.command === 'chatbot' || foundCommand.command === 'chat' || foundCommand.command === 'assistant' || foundCommand.command === 'ai') {
        if (output && output.__type === 'LAUNCH_CHATBOT') {
          if (onLaunchChatBot) {
            onLaunchChatBot();
            terminalController.addLine(input, output.content);
          } else {
            setShowChatBot(true);
            terminalController.addLine(input, output.content);
          }
          return;
        }
      }

      // Handle clear command
      if (foundCommand.command === 'clear') {
        terminalController.clearLines();
      } else {
        terminalController.addLine(input, output);
      }
    } else if (input.trim() === '') {
      output = '';
    } else {
      output = `Command not found: ${commandName}. Type 'help' for available commands.`;
      terminalController.addLine(input, output);
    }

    if (input.trim() !== '') {
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const addLine = (input: string, output: string | JSX.Element) => {
    setLines((prev) => [...prev, { input, output }]);
  };

  return (
    <div
      className={`${className} fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d2d] flex flex-col z-50 transition-all duration-200`}
      style={{
        height: isMaximized ? 'calc(100vh - 50px)' : `${terminalHeight}px`,
        maxHeight: 'calc(100vh - 50px)'
      }}
      data-has-code-playground={onLaunchCodePlayground ? 'true' : 'false'}>

      {showCodePlayground && (
        <div className="absolute inset-0 z-10 bg-[#1e1e1e]">
          <CodePlayground onClose={() => setShowCodePlayground(false)} />
        </div>
        )}
      {showChatBot && (
        <div className="absolute inset-0 z-10 bg-[#1e1e1e]">
          <ChatBot onClose={() => setShowChatBot(false)} />
        </div>
        )}
      {/* Resize Handle */}
      <div
        className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize group z-50"
        onMouseDown={(e) => {
          const startDragY = e.clientY;
          const startHeight = terminalHeight;
          const handleMouseMove = (e: MouseEvent) => {
            const deltaY = startDragY - e.clientY;
            const newHeight = Math.min(
              Math.max(200, startHeight + deltaY),
              window.innerHeight - 50
            );
            setTerminalHeight(newHeight);
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}>

        <div className="w-full h-full group-hover:bg-vscode-accent/20 transition-colors" />
      </div>

      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-white/80 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-white/60" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setTerminalHeight(300)}
            className="hover:bg-[#3d3d3d] p-1.5 rounded-sm transition-colors"
            title="Minimize">

            <Minus size={14} />
          </button>
          <button
            onClick={() => setIsMaximized((prev) => !prev)}
            className="hover:bg-[#3d3d3d] p-1.5 rounded-sm transition-colors mx-1"
            title={isMaximized ? "Restore" : "Maximize"}>

            {isMaximized ? <Square size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={onClose}
            className="hover:bg-[#3d3d3d] p-1.5 rounded-sm transition-colors hover:bg-red-500/20"
            title="Close">

            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-sm overflow-auto"
        onClick={() => inputRef.current?.focus()}
        role="log"
        aria-live="polite"
        aria-label="Terminal output">

        {lines.map((line, i) => (
          <div key={i} className="mb-2 leading-relaxed">
            {line.input !== undefined && (
              <div className="flex items-center gap-2 text-white/80 select-text">
                <span className="text-green-400 whitespace-nowrap">portfolio@user</span>
                <span className="text-white/40">:</span>
                <span className="text-blue-400 whitespace-nowrap">~/portfolio/src</span>
                <span className="text-white/40">$</span>
                <span className="break-all">{line.input}</span>
              </div>
            )}
            {line.output && (
            <div className="mt-1 text-white/70 whitespace-pre-line break-words select-text">
                {line.output}
              </div>
            )}
          </div>
          ))}
        <div className="flex items-center gap-2 text-white/80">
          <span className="text-green-400 whitespace-nowrap">portfolio@user</span>
          <span className="text-white/40">:</span>
          <span className="text-blue-400 whitespace-nowrap">~/portfolio/src</span>
          <span className="text-white/40">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none min-w-0 break-all"
            autoFocus
            aria-label="Terminal input"
            placeholder="Type a command..."
            spellCheck="false"
            autoComplete="off"
            aria-autocomplete="none" />

        </div>
      </div>
    </div>
  );
};

export default Terminal;