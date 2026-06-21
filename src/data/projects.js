import pulse from '../assets/pulse.svg';
import flash from '../assets/flash.svg';
import ball from '../assets/ball.svg';

const projects = [
  {
    title: 'PulseConnect',
    subtitle: 'Real-Time Communication Web App',
    color: '#C62828',
    period: 'Dec 2024 – Jan 2025',
    imageUrl: pulse,
    highlights: [
      'Full-stack WebRTC app with React/TypeScript and Node.js — sub-200ms latency video calls',
      'Real-time messaging via Socket.io with MongoDB for persistent storage',
      'AI gesture detection using TensorFlow.js and speech-to-text transcription',
      'Fully containerized with Docker',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'WebRTC', 'Socket.io', 'MongoDB', 'Docker'],
  },
  {
    title: 'WattWise',
    subtitle: 'Energy Management System',
    color: '#1565C0',
    period: 'Feb 2024 – May 2024',
    imageUrl: flash,
    highlights: [
      'Django and React web app for real-time energy consumption tracking with OAuth',
      'Interactive dashboards with Chart.js, data analysis pipeline with Pandas',
      'Optimized frontend state management for 40% faster load times',
    ],
    tags: ['Django', 'React', 'Python', 'Chart.js', 'Pandas', 'OAuth'],
  },
  {
    title: 'T20 World Cup Analysis',
    subtitle: 'Cricket Data Analytics',
    color: '#7B1F1F',
    period: 'Nov 2023 – Dec 2023',
    imageUrl: ball,
    highlights: [
      'ETL pipeline in Python/Pandas for cricket match data with web scraping and normalized schema',
      'Interactive Excel dashboard with pivot tables and VBA macros for match analytics',
    ],
    tags: ['Python', 'Pandas', 'Excel', 'VBA', 'ETL'],
  },
];

export default projects;
