export type Lang = 'pt-br' | 'en';

export const routes = {
  'pt-br': { home: '/', about: '/sobre/', cases: '/casos/' },
  en: { home: '/en/', about: '/en/about/', cases: '/en/cases/' },
} as const;

export const ui = {
  'pt-br': {
    htmlLang: 'pt-BR',
    navCases: 'Casos',
    navServices: 'Como ajudo',
    navAbout: 'Sobre',
    navContact: 'Contato',
    switchLabel: 'English',
    heroEyebrow: 'Engenharia de plataforma · Automação · IaC',
    heroTitle: 'Infraestrutura self-service, do formulário ao servidor pronto.',
    heroLead:
      'Sou Ricardo Rosa, engenheiro de plataforma sênior. Ajudo times a transformar Ansible e Terraform em uma plataforma interna que provisiona, configura e observa infraestrutura sem fila de chamados.',
    heroCtaCases: 'Ver os casos',
    heroCtaTalk: 'Conversar sobre seu time',
    runTitle: 'workflow: provisionar-lxc · execução real',
    metrics: [
      { value: '~108 s', label: 'do formulário ao servidor com DNS e acesso' },
      { value: '11 anos', label: 'em infraestrutura, cloud e automação' },
      { value: '5', label: 'certificações: Red Hat, Microsoft, HashiCorp, Dynatrace' },
    ],
    servicesTitle: 'Como posso ajudar seu time',
    services: [
      {
        title: 'Portal self-service (IDP)',
        body: 'Backstage como porta de entrada, com formulários que disparam automação revisada. O time pede infraestrutura sem abrir chamado e sem conhecer Terraform.',
      },
      {
        title: 'Automação Ansible governada',
        body: 'AWX ou Ansible Automation Platform com job templates como código, execução isolada, credenciais fora do repositório e relatórios de execução.',
      },
      {
        title: 'Terraform e cloud',
        body: 'Módulos reutilizáveis, state remoto, pipelines de plan/apply e padrões para Azure, AWS e virtualização on-premises.',
      },
    ],
    casesTitle: 'Estudos de caso',
    casesLead:
      'Cada caso mostra o problema, a arquitetura, as decisões, o resultado medido e o que deu errado no caminho. Tudo foi construído e operado no meu laboratório, com os mesmos padrões que uso em ambiente corporativo.',
    readCase: 'Ler o caso',
    soon: 'Em breve',
    certsTitle: 'Certificações',
    contactTitle: 'Vamos conversar',
    contactBody:
      'Se o seu time ainda provisiona infraestrutura por chamado, ou tem automação espalhada que ninguém confia, me chame. A primeira conversa é para entender o cenário, sem proposta pronta.',
    contactLinkedin: 'Falar no LinkedIn',
    contactGithub: 'GitHub',
    caseBack: '← Todos os casos',
    caseStack: 'Stack',
    caseResult: 'Resultado',
    footer: 'Ricardo Rosa · devatech',
    aboutTitle: 'Sobre',
  },
  en: {
    htmlLang: 'en',
    navCases: 'Case studies',
    navServices: 'How I help',
    navAbout: 'About',
    navContact: 'Contact',
    switchLabel: 'Português',
    heroEyebrow: 'Platform engineering · Automation · IaC',
    heroTitle: 'Self-service infrastructure, from form to ready server.',
    heroLead:
      'I’m Ricardo Rosa, a senior platform engineer. I help teams turn Ansible and Terraform into an internal platform that provisions, configures and observes infrastructure without a ticket queue.',
    heroCtaCases: 'See the case studies',
    heroCtaTalk: 'Talk about your team',
    runTitle: 'workflow: provision-lxc · real run',
    metrics: [
      { value: '~108 s', label: 'from request form to a server with DNS and access' },
      { value: '11 years', label: 'in infrastructure, cloud and automation' },
      { value: '5', label: 'certifications: Red Hat, Microsoft, HashiCorp, Dynatrace' },
    ],
    servicesTitle: 'How I can help your team',
    services: [
      {
        title: 'Self-service portal (IDP)',
        body: 'Backstage as the front door, with forms that trigger reviewed automation. Teams request infrastructure without a ticket and without knowing Terraform.',
      },
      {
        title: 'Governed Ansible automation',
        body: 'AWX or Ansible Automation Platform with job templates as code, isolated execution, credentials kept out of the repo, and run reports.',
      },
      {
        title: 'Terraform and cloud',
        body: 'Reusable modules, remote state, plan/apply pipelines, and patterns for Azure, AWS and on-premises virtualization.',
      },
    ],
    casesTitle: 'Case studies',
    casesLead:
      'Each case covers the problem, the architecture, the decisions, the measured result, and what went wrong along the way. Everything was built and operated in my lab, using the same patterns I apply in enterprise environments.',
    readCase: 'Read the case',
    soon: 'Coming soon',
    certsTitle: 'Certifications',
    contactTitle: 'Let’s talk',
    contactBody:
      'If your team still provisions infrastructure through tickets, or has scattered automation nobody trusts, reach out. The first conversation is about understanding your setup, not pitching a ready-made proposal.',
    contactLinkedin: 'Message me on LinkedIn',
    contactGithub: 'GitHub',
    caseBack: '← All case studies',
    caseStack: 'Stack',
    caseResult: 'Result',
    footer: 'Ricardo Rosa · devatech',
    aboutTitle: 'About',
  },
} as const;

export const links = {
  linkedin: 'https://www.linkedin.com/in/ricardo-rosa-4a20011a/',
  github: 'https://github.com/dbaricardo',
};

export const certs = [
  { name: 'Red Hat Certified Specialist in Managing Automation with Ansible Automation Platform (EX467)', issuer: 'Red Hat', year: '2026' },
  { name: 'Microsoft Certified: Azure Administrator Associate (AZ-104)', issuer: 'Microsoft', year: '' },
  { name: 'HashiCorp Certified: Terraform Associate', issuer: 'HashiCorp', year: '' },
  { name: 'Microsoft Certified: Azure Fundamentals (AZ-900)', issuer: 'Microsoft', year: '2020' },
  { name: 'Dynatrace Essentials', issuer: 'Dynatrace', year: '2026' },
];

/** Casos ainda não escritos aparecem como "em breve" na listagem. */
export const upcoming = {
  'pt-br': [
    { title: 'Plataforma do laboratório como produto', summary: 'Cluster de virtualização com quórum, orquestrador de containers, proxy reverso, DNS e firewall tratados como um produto interno.' },
    { title: 'Observabilidade que gera ação', summary: 'Alertas críticos que abrem incidentes e avisam o time sozinhos, com inventário descoberto automaticamente.' },
    { title: 'IA aplicada à operação', summary: 'Base de conhecimento pesquisável por agentes, execução de código no lugar de dezenas de chamadas de ferramenta e guardrails para comandos destrutivos.' },
    { title: 'Laboratórios de certificação como código', summary: 'Ambientes de prática reproduzíveis, com correção automática e revisão por IA.' },
  ],
  en: [
    { title: 'The lab platform as a product', summary: 'A virtualization cluster with quorum, container orchestrator, reverse proxy, DNS and firewall run as an internal product.' },
    { title: 'Observability that triggers action', summary: 'Critical alerts that open incidents and notify the team on their own, backed by automatically discovered inventory.' },
    { title: 'AI applied to operations', summary: 'A knowledge base agents can search, code execution instead of dozens of tool calls, and guardrails for destructive commands.' },
    { title: 'Certification labs as code', summary: 'Reproducible practice environments with automatic grading and AI review.' },
  ],
};
