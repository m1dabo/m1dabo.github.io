export interface ImpactMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  problem: string;
  architecture: string;
  actions: string[];
  results: string[];
  tags: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface SkillGroup {
  name: string;
  skills: string[];
}

export interface EducationItem {
  degree: string;
  minor?: string;
  school: string;
  location: string;
  year: string;
}

export interface GitHubRepoFallback {
  name: string;
  description: string;
  htmlUrl: string;
  language: string;
  stars: number;
  topics: string[];
}

export interface Profile {
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  links: {
    github: string;
    linkedin: string;
  };
  impact: ImpactMetric[];
  caseStudies: CaseStudy[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  education: EducationItem[];
  openSourceFallback: GitHubRepoFallback[];
}

export const PROFILE: Profile = {
  name: 'Mohammed Dabo',
  title: 'Senior Software Engineer',
  summary:
    'Tech-agnostic Senior Software Engineer specializing in high-availability architecture, distributed microservices, and end-to-end full-stack development. I engineer robust API workflows and cross-platform mobile applications, leveraging advanced caching (Redis Sentinel), deployment automation (Azure DevOps), and database optimization to deliver scalable, high-concurrency enterprise platforms without being constrained by legacy tech stacks.',
  location: 'Riyadh, Saudi Arabia',
  email: 'mohammed.dabo@hotmail.com',
  phone: '+(966)538604774',
  links: {
    github: 'https://github.com/m1dabo/',
    linkedin: 'https://www.linkedin.com/in/m1dabo/',
  },
  impact: [
    { value: '40%', label: 'Faster responses' },
    { value: '15+', label: 'Microservices' },
    { value: '99.9%', label: 'Uptime on 15+ servers' },
    { value: '200%', label: 'Traffic growth handled' },
  ],
  caseStudies: [
    {
      slug: 'redis-sentinel-ha',
      title: 'Redis Sentinel HA Cluster',
      problem:
        'Production workloads at ZATCA needed sub-second responses under high concurrency, but database load and single-node cache risk created latency spikes and failover gaps.',
      architecture:
        '3-node Redis master-replica topology with Sentinel failover monitoring, integrated into .NET services as a shared cache and session layer in front of MSSQL.',
      actions: [
        'Designed and deployed a high-availability Redis master-replica cluster with Sentinel health checks.',
        'Tuned cache keys, TTLs, and invalidation strategies for baseline limits and asset workflows.',
        'Instrumented failover drills and connection resilience in application clients.',
      ],
      results: [
        'Cut server response times by ~40%.',
        'Reduced database load by ~30%.',
        'Improved resilience during node failures with automated Sentinel failover.',
      ],
      tags: ['Redis', 'HA', 'Caching', '.NET', 'Performance'],
    },
    {
      slug: 'zatca-microservices',
      title: '15+ .NET Microservices at ZATCA',
      problem:
        'Monolithic change delivery slowed time-to-market for configurable baseline limits, asset retirement, and related tax/customs workflows.',
      architecture:
        'Distributed .NET microservices with RESTful APIs, shared data contracts, and independently deployable services for Zakat, Tax, and Customs domains.',
      actions: [
        'Delivered 15+ distributed microservices using enterprise .NET and modern frameworks.',
        'Spearheaded end-to-end change requests including configurable baseline limits and asset retirement workflows.',
        'Led cross-platform Expo React Native and Angular migrations alongside backend delivery.',
      ],
      results: [
        'Accelerated time-to-market by ~15%.',
        'Improved system scalability and performance by ~30%.',
        'Enabled safer, incremental releases across domain boundaries.',
      ],
      tags: ['.NET', 'Microservices', 'REST', 'Angular', 'React Native'],
    },
    {
      slug: 'sap-cpi-integrations',
      title: 'SAP CPI Groovy & XPath Integrations',
      problem:
        'Enterprise systems needed reliable cross-system orchestration; brittle mappings and manual integration work created friction and delivery delay.',
      architecture:
        'SAP Cloud Integration (CPI) iFlows with custom Groovy scripts and XPath mapping between upstream services and downstream enterprise platforms.',
      actions: [
        'Engineered CPI workflows with reusable Groovy transformations.',
        'Implemented XPath mappings for structured payload translation.',
        'Hardened error handling and monitoring for production integrations.',
      ],
      results: [
        'Reduced integration friction by ~20%.',
        'Shortened onboarding of new integration paths.',
        'Improved consistency of cross-system message contracts.',
      ],
      tags: ['SAP CPI', 'Groovy', 'XPath', 'Integration', 'Enterprise'],
    },
    {
      slug: 'azure-devops-cicd',
      title: 'Azure DevOps CI/CD at 99.9% Uptime',
      problem:
        'Operating 15+ production servers with manual or inconsistent releases risked downtime and slow recovery for mission-critical authority platforms.',
      architecture:
        'Azure DevOps pipelines with self-hosted build agents, automated deployments, and standardized release gates across production estates.',
      actions: [
        'Automated deployments via Azure DevOps CI/CD pipelines.',
        'Operated self-hosted build agents for controlled enterprise builds.',
        'Maintained 15+ production servers with monitoring and repeatable release processes.',
      ],
      results: [
        'Sustained 99.9% uptime across production servers.',
        'Reduced deployment risk through automation.',
        'Improved release predictability for cross-team delivery.',
      ],
      tags: ['Azure DevOps', 'CI/CD', 'DevOps', 'Reliability'],
    },
    {
      slug: 'arabdt-saas',
      title: 'Multi-tenant SaaS at ArabDT',
      problem:
        'Rapid client growth demanded a distributed SaaS platform that could absorb traffic spikes without sacrificing uptime or permission flexibility.',
      architecture:
        'Distributed microservices SaaS with RESTful APIs, database-driven permissions, and multi-tenant delivery for 20+ enterprise clients.',
      actions: [
        'Engineered scalable microservices handling sustained traffic growth.',
        'Delivered high-throughput SaaS services for 20+ enterprise clients.',
        'Designed database-driven permission architectures and refactored static admin roles.',
      ],
      results: [
        'Handled 200% traffic growth with 100% uptime.',
        'Boosted system efficiency by ~25% and cut downtime by ~40%.',
        'Improved project delivery efficiency by ~20% via flexible permissions.',
      ],
      tags: ['SaaS', 'Microservices', 'Multi-tenant', 'REST', 'Permissions'],
    },
  ],
  experience: [
    {
      company: 'Zakat, Tax and Customs Authority (ZATCA)',
      role: 'Senior Software Engineer',
      location: 'Riyadh, Saudi Arabia',
      start: 'Oct 2021',
      end: 'Present',
      bullets: [
        'Spearheaded end-to-end delivery of complex change requests including configurable baseline limits and asset retirement workflows, accelerating time-to-market by 15%.',
        'Architected a high-availability 3-node Redis master-replica cluster with Sentinel failover monitoring, cutting server response times by 40% and database load by 30%.',
        'Developed over 15 distributed microservices for Zakat, Tax, and Customs Authority using enterprise .NET and modern frameworks, improving system scalability and performance by 30%.',
        'Engineered enterprise workflows using SAP Cloud Integration (CPI) with custom Groovy scripts and XPath mapping, reducing integration friction by 20%.',
        'Maintained 15+ production servers ensuring 99.9% uptime, automated deployments via Azure DevOps CI/CD pipelines and self-hosted build agents, and led cross-platform Expo React Native and Angular migrations.',
      ],
    },
    {
      company: 'ArabDT',
      role: 'Senior Software Engineer',
      location: 'New Cairo, Egypt',
      start: 'Jun 2020',
      end: 'Sep 2021',
      bullets: [
        'Engineered a scalable distributed microservices architecture handling 200% traffic growth with 100% uptime, robust RESTful APIs, and 20% higher customer satisfaction.',
        'Delivered high-throughput SaaS microservices for 20+ enterprise clients, boosting system efficiency by 25% while cutting downtime by 40%.',
        'Designed database-driven permission architectures and refactored static administrative roles, boosting project delivery efficiency by 20%.',
      ],
    },
    {
      company: 'Edge-Pro for Information System',
      role: 'Software Engineer',
      location: 'Cairo, Egypt',
      start: 'Oct 2018',
      end: 'Jun 2020',
      bullets: [
        'Engineered Egypt ASSETS web applications using modern full-stack technologies, achieving an 80% increase in user engagement.',
        'Managed on-premise application deployments in client environments, ensuring a 90% improvement in deployment efficiency.',
        'Integrated Hexagon tools (ERDAS Imagine, M.App Enterprise) to streamline geospatial workflows and reduce processing time by 25%.',
      ],
    },
    {
      company: 'Cloud Soft',
      role: 'Full-Stack Software Developer',
      location: 'Cairo, Egypt',
      start: 'Apr 2018',
      end: 'Sep 2018',
      bullets: [
        'Optimized UI rendering performance by 20% through frontend modernization and responsive design practices.',
        'Accelerated backend response reliability by 30% via robust database and system tuning.',
        'Accelerated product delivery cycles by 40% via full-stack technology adoption and agile workflows.',
      ],
    },
  ],
  skills: [
    {
      name: 'Languages',
      skills: ['C', 'C++', 'C#', 'Java', 'TypeScript', 'Go', 'Node.js'],
    },
    {
      name: 'APIs',
      skills: ['SOAP', 'RESTful', 'GraphQL (basic)'],
    },
    {
      name: 'Databases',
      skills: ['MSSQL', 'MySQL', 'PostgreSQL', 'Oracle'],
    },
    {
      name: 'Front-End',
      skills: ['HTML', 'JavaScript', 'CSS', 'CSS3', 'Bootstrap', 'Materialize'],
    },
    {
      name: 'Client frameworks',
      skills: ['Angular', 'React', 'Expo React Native', 'Ionic', 'jQuery', 'Tailwind'],
    },
    {
      name: 'Server frameworks',
      skills: ['Entity Framework / Core', '.NET / Core', 'Gin', 'Beego', 'Spring'],
    },
    {
      name: 'Testing',
      skills: ['xUnit', '.NET unit testing', 'Jasmine'],
    },
    {
      name: 'DevOps',
      skills: ['Azure DevOps CI/CD', 'Git', 'Redis Sentinel', 'Docker', 'Jenkins', 'CircleCI'],
    },
    {
      name: 'Cloud/Tools',
      skills: ['AWS', 'Microsoft Azure', 'GitHub', 'GitLab', 'Jira', 'VS Code', 'Visual Studio'],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Computer and Information Sciences',
      minor: 'Software Engineering',
      school: 'Ain Shams University',
      location: 'Cairo, Egypt',
      year: '2017',
    },
  ],
  openSourceFallback: [
    {
      name: 'portfolio',
      description: 'Personal portfolio with Angular SSG frontend and .NET API backend.',
      htmlUrl: 'https://github.com/m1dabo/',
      language: 'TypeScript',
      stars: 0,
      topics: ['angular', 'dotnet', 'portfolio'],
    },
  ],
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return PROFILE.caseStudies.find((c) => c.slug === slug);
}

export const CASE_STUDY_SLUGS = PROFILE.caseStudies.map((c) => c.slug);
