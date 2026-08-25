/**
 * ProjectMatch AI - Initial Data Store & Mock Data
 * Based on Stitch Project 18423920413998334986 (Synthetix Pulse)
 */

const DEFAULT_PROJECTS = [
  {
    id: 'p1',
    title: 'FinTech Dashboard API',
    founder: 'Alex Chen',
    founderRole: 'Founder & Architect',
    matchScore: 94,
    category: 'FinTech',
    hackathon: 'Hackathon Alpha',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    needs: [
      { name: 'React', type: 'match' },
      { name: 'UI Design', type: 'gap' },
      { name: 'GraphQL', type: 'ghost' }
    ],
    aiInsight: 'Matches your React expertise and strong interest in emerging FinTech platforms with real-time analytics.',
    description: 'A high-frequency algorithmic trade monitoring dashboard with sub-millisecond WebSocket data pipelines.',
    specs: {
      teamSize: '3/5 filled',
      timeCommitment: '20 hrs/week',
      duration: '4 weeks',
      equityOrPrize: '$25,000 Prize Pool'
    }
  },
  {
    id: 'p2',
    title: 'Neural Canvas AI',
    founder: 'Elena Rostova',
    founderRole: 'AI Research Lead',
    matchScore: 92,
    category: 'Generative AI',
    hackathon: 'AI Genesis 2026',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    needs: [
      { name: 'Python', type: 'match' },
      { name: 'TensorFlow', type: 'match' },
      { name: 'WebGL', type: 'gap' }
    ],
    aiInsight: 'High overlap with your deep learning portfolio and generative shader experiments.',
    description: 'Diffusion-based 3D scene synthesizer designed for indie game developers and VR creators.',
    specs: {
      teamSize: '2/4 filled',
      timeCommitment: '15 hrs/week',
      duration: '2 weeks',
      equityOrPrize: '$40,000 Grant'
    }
  },
  {
    id: 'p3',
    title: 'DeFi Arbitrage Engine',
    founder: 'Marcus Vance',
    founderRole: 'Crypto Strategist',
    matchScore: 88,
    category: 'Web3 & DeFi',
    hackathon: 'ETH Global Pulse',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    needs: [
      { name: 'Solidity', type: 'match' },
      { name: 'Go', type: 'gap' },
      { name: 'Redis', type: 'match' }
    ],
    aiInsight: 'Great fit for your high-concurrency systems background & EVM smart contracts fluency.',
    description: 'Cross-chain flash loan arbitrage detector executing atomic swaps across 6 Layer-2 networks.',
    specs: {
      teamSize: '4/5 filled',
      timeCommitment: '25 hrs/week',
      duration: '3 weeks',
      equityOrPrize: '$30,000 + VC Intro'
    }
  },
  {
    id: 'p4',
    title: 'MedTech Vision Assistant',
    founder: 'Dr. Kenji Sato',
    founderRole: 'Biomedical Engineer',
    matchScore: 91,
    category: 'Healthcare AI',
    hackathon: 'MedHacks 2026',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    needs: [
      { name: 'Python', type: 'match' },
      { name: 'React', type: 'match' },
      { name: 'FHIR API', type: 'ghost' }
    ],
    aiInsight: 'Compliments your full-stack ML skills for FDA-grade automated radiography assistance.',
    description: 'Edge-computed computer vision model highlighting micro-fractures in emergency trauma scans.',
    specs: {
      teamSize: '3/4 filled',
      timeCommitment: '10 hrs/week',
      duration: '2 weeks',
      equityOrPrize: '$50,000 Seed Fund'
    }
  },
  {
    id: 'p5',
    title: 'Quantum Logistics Routing',
    founder: 'Sophia Lin',
    founderRole: 'Operations Research',
    matchScore: 85,
    category: 'Infrastructure',
    hackathon: 'Hackathon Alpha',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    needs: [
      { name: 'Go', type: 'match' },
      { name: 'Kafka', type: 'gap' },
      { name: 'Graph Algo', type: 'match' }
    ],
    aiInsight: 'Requires distributed scaling beyond 100k RPS, directly matching your backend architecture strengths.',
    description: 'Simulated quantum annealing engine optimizing multimodal freight transport routes globally.',
    specs: {
      teamSize: '2/5 filled',
      timeCommitment: '20 hrs/week',
      duration: '4 weeks',
      equityOrPrize: '$15,000 Prize'
    }
  },
  {
    id: 'p6',
    title: 'CyberSec Zero-Trust Mesh',
    founder: 'Viktor K.',
    founderRole: 'Security Researcher',
    matchScore: 89,
    category: 'Cybersecurity',
    hackathon: 'DefCon Innovate',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    needs: [
      { name: 'Docker', type: 'match' },
      { name: 'Rust', type: 'gap' },
      { name: 'Tailwind', type: 'match' }
    ],
    aiInsight: 'Direct match for your microservice orchestration security auditing experiments.',
    description: 'Decentralized peer-to-peer authorization proxy with cryptographic wireguard verification.',
    specs: {
      teamSize: '3/5 filled',
      timeCommitment: '15 hrs/week',
      duration: '3 weeks',
      equityOrPrize: '$20,000 Bounty'
    }
  }
];

const DEFAULT_TEAMS = [
  {
    id: 't-appx',
    name: 'AppX',
    description: 'AI-driven predictive analytics for retail inventory and consumer demand.',
    matchScore: 94,
    hackathon: 'Hackathon Alpha',
    slotsTotal: 5,
    slotsFilled: 4,
    skills: ['Python', 'AWS'],
    needsRole: 'ML Engineer',
    conflict: null,
    members: [
      { name: 'Marcus L.', role: 'Lead Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { name: 'Chloe T.', role: 'Data Engineer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
      { name: 'Kevin W.', role: 'Backend Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { name: 'Aria S.', role: 'Product Strategist', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 't-cyberx',
    name: 'Team Cyber-X',
    description: 'Building a decentralized automated matching engine for high-velocity teams.',
    matchScore: 88,
    hackathon: 'Hackathon Alpha',
    slotsTotal: 5,
    slotsFilled: 3,
    skills: ['Solidity', 'React'],
    needsRole: 'UI Designer',
    conflict: {
      type: 'ROLE_OVERLAP',
      title: 'Conflict: Role Overlap (Dev)',
      description: 'Two Senior Backend Engineers detected — potential redundancy in technical leadership.'
    },
    members: [
      { name: 'Sarah J.', role: 'Project Lead', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
      { name: 'Alex M.', role: 'Backend Architect', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
      { name: 'David K.', role: 'You (Full-Stack)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 't-synthetix',
    name: 'Synthetix Pulse AI',
    description: 'Generative 3D spatial interface synthesis engine powered by multimodal LLMs.',
    matchScore: 91,
    hackathon: 'AI Genesis 2026',
    slotsTotal: 4,
    slotsFilled: 2,
    skills: ['TypeScript', 'WebGL', 'PyTorch'],
    needsRole: 'Frontend Architect',
    conflict: null,
    members: [
      { name: 'Elena R.', role: 'AI Researcher', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
      { name: 'Liam P.', role: '3D Graphics Eng', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 't-greengrid',
    name: 'GreenGrid IoT',
    description: 'Decentralized smart microgrid carbon credit tracking protocol.',
    matchScore: 84,
    hackathon: 'Hackathon Alpha',
    slotsTotal: 5,
    slotsFilled: 3,
    skills: ['Smart Contracts', 'Node.js'],
    needsRole: 'Product Lead',
    conflict: {
      type: 'SKILL_IMBALANCE',
      title: 'Skill Imbalance: Missing PM',
      description: 'Strong technical core but missing product and pitch direction.'
    },
    members: [
      { name: 'Amara O.', role: 'IoT Systems', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80' },
      { name: 'Tariq H.', role: 'Blockchain Dev', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80' },
      { name: 'Nina W.', role: 'Full-Stack', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' }
    ]
  }
];

const DEFAULT_CHATS = {
  't-cyberx': {
    teamId: 't-cyberx',
    teamName: 'Team Cyber-X',
    teamAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    memberCount: '3/5 Members',
    messages: [
      {
        id: 'm1',
        sender: 'Sarah J.',
        role: 'Project Lead',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        timestamp: '09:15 AM',
        isOutgoing: false,
        text: "Welcome to Team Cyber-X, Alex! Glad to have you on board. I've uploaded the initial spec doc to the shared drive. We should probably review it before the kickoff."
      },
      {
        id: 'm2',
        sender: 'Alex M.',
        role: 'Backend Architect',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        timestamp: '09:22 AM',
        isOutgoing: false,
        text: "Hey Alex! I'm taking point on the backend arch. I'll need some input on the API schemas once you're settled. Are we doing a sync this afternoon?"
      },
      {
        id: 'm3',
        sender: 'You (Alex Mercer)',
        role: 'Senior Full-Stack AI Engineer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        timestamp: '09:30 AM',
        isOutgoing: true,
        text: 'Thanks Sarah & Alex! Excited to be here. I can definitely jump on a sync today to go over the specs and schemas. What time works best?'
      },
      {
        id: 'm-ai-insight',
        isAiCard: true,
        cardType: 'INSIGHT',
        title: 'ProjectMatch AI Insight',
        text: 'Based on member timezones and calendar availability, <strong class="text-secondary">2:30 PM PST</strong> is the optimal time for a 45-minute sync today.',
        alertTitle: 'TEAM COMPOSITION ALERT',
        alertText: 'To proceed to the Prototyping phase next week, this team currently requires a <span class="badge-conflict">UI Designer</span>.',
        actions: [
          { label: 'Schedule for 2:30 PM', actionKey: 'schedule_meeting', isPrimary: true },
          { label: 'Find UI Designer', actionKey: 'find_designer', isPrimary: false }
        ]
      },
      {
        id: 'm-ai-conflict',
        isAiCard: true,
        cardType: 'CONFLICT',
        title: 'ProjectMatch AI: Conflict Detection',
        items: [
          {
            icon: 'group_off',
            label: 'ROLE OVERLAP',
            text: 'Two <strong class="text-error">Senior Backend Engineers</strong> detected — potential redundancy in technical leadership.'
          },
          {
            icon: 'balance',
            label: 'SKILL IMBALANCE',
            text: 'Strong technical core but <strong class="text-error">missing product direction</strong>. Consider adding a Product Manager.'
          }
        ],
        actions: [
          { label: 'Adjust Roles', actionKey: 'adjust_roles', isPrimary: true, isError: true },
          { label: 'Find PM', actionKey: 'find_pm', isPrimary: false, isError: true }
        ]
      },
      {
        id: 'm4',
        sender: 'Sarah J.',
        role: 'Project Lead',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        timestamp: '09:32 AM',
        isOutgoing: false,
        text: '2:30 PM works for me! And good catch, AI. We should definitely interview a UI Designer candidate by Friday.'
      }
    ]
  }
};

const USER_PROFILE = {
  name: 'Alex Mercer',
  title: 'Senior Full-Stack AI Engineer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  bio: 'Building intelligent multi-agent systems and real-time distributed web apps.',
  skills: ['React', 'Python', 'TensorFlow', 'Solidity', 'GraphQL', 'Tailwind', 'Go', 'Docker'],
  metrics: {
    topContributor: 'Top 1% Contributor',
    fastResponder: '< 15m Response',
    hackathonsWon: '12 Hackathons Won',
    avgMatchScore: '94% Match Fit'
  },
  aiMatchSuggestions: [
    { id: 'ms1', name: 'Neon Horizon Studio', need: 'AI Engineer', score: 94 },
    { id: 'ms2', name: 'Quantum Logistics', need: 'Data Architect', score: 88 },
    { id: 'ms3', name: 'FinTech Node', need: 'React Native', score: 82 }
  ],
  myRequests: [
    { id: 'req1', target: 'CyberSec Alliance', timeAgo: 'Sent 2 days ago', status: 'Accepted', statusClass: 'status-badge-accepted' },
    { id: 'req2', target: 'DataHive Inc', timeAgo: 'Sent 12 hrs ago', status: 'Pending', statusClass: 'status-badge-pending' },
    { id: 'req3', target: 'Legacy Systems', timeAgo: 'Sent 1 week ago', status: 'Rejected', statusClass: 'status-badge-rejected' }
  ]
};

const AI_INTERVIEW_FLOW = [
  {
    step: 1,
    question: 'To ensure a great fit for <strong class="text-primary-fixed-dim">Team Cyber-X</strong>, how would you describe your experience with high-concurrency systems?',
    subtext: 'They are looking for someone who has scaled architectures beyond 100k requests/sec.',
    options: [
      {
        badge: 'Extensive',
        desc: 'Designed systems handling 500k+ RPS using Go, Redis, and Kafka.',
        scoreBoost: 8
      },
      {
        badge: 'Moderate',
        desc: 'Maintained microservices at 50k RPS using Node.js & Redis clusters.',
        scoreBoost: 5
      },
      {
        badge: 'Fundamental',
        desc: 'Built monoliths with PostgreSQL caching and vertical scaling.',
        scoreBoost: 2
      },
      {
        badge: 'Eager to Learn',
        desc: 'Solid backend fundamentals, ready to pair program on scale.',
        scoreBoost: 1
      }
    ]
  },
  {
    step: 2,
    question: 'What is your preferred role dynamic when collaborating in high-velocity hackathons?',
    subtext: 'Team Cyber-X balances rapid experimentation with structured code review.',
    options: [
      {
        badge: 'Autonomous Architect',
        desc: 'I like taking ownership of core schemas and core engine pipelines.',
        scoreBoost: 6
      },
      {
        badge: 'Agile Pair Programmer',
        desc: 'I love tight pairing, rapid feedback loops, and PR iteration.',
        scoreBoost: 7
      },
      {
        badge: 'Full-Stack Flex',
        desc: 'I jump across UI and API endpoints wherever the team has bottlenecks.',
        scoreBoost: 8
      },
      {
        badge: 'Product & Vision Guide',
        desc: 'I bridge user stories and architecture specs for presentation.',
        scoreBoost: 5
      }
    ]
  },
  {
    step: 3,
    question: 'What is your weekly commitment and availability for Hackathon Alpha sprints?',
    subtext: 'Kickoff begins this Friday with demo day in 2 weeks.',
    options: [
      {
        badge: 'Dedicated (25+ hrs/wk)',
        desc: 'Evenings and full weekends dedicated to the project.',
        scoreBoost: 8
      },
      {
        badge: 'Standard (15-20 hrs/wk)',
        desc: 'Active daily contributor during core hackathon hours.',
        scoreBoost: 6
      },
      {
        badge: 'Focused Contributor (10 hrs/wk)',
        desc: 'Dedicated to specialized modules and key deliverables.',
        scoreBoost: 4
      }
    ]
  }
];

const INITIAL_TICKER_EVENTS = [
  'Sarah J. joined Team Cyber-X',
  'AppX is looking for a ML Engineer',
  'David posted a new idea: DeFi Arbitrage',
  'New match formed for Hackathon Alpha (96%)',
  'Neural Canvas AI reached 2/4 members',
  'BioSync Alpha won AI Track Sponsor Prize'
];
