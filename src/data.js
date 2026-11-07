/* All portfolio content lives here. Edit this file to change copy, projects and links. */

export const SITE = {
  email: 'sbapan@quantumhash.me',
  links: [
    { href: 'https://github.com/MotoBwi', label: 'github.com/MotoBwi' },
    { href: 'https://github.com/Quantumhash-Corporation', label: 'github.com/Quantumhash-Corporation' },
    { href: 'https://quantumhash.me', label: 'quantumhash.me' },
  ],
};

export const HERO = {
  tag: 'ML Engineer & Infrastructure Operator',
  lede:
    'Building machine learning systems and the self-hosted infrastructure they run on: speech pipelines, vector search, replicated databases and zero-downtime deploys, running around the clock from Kuwait.',
  stats: [
    { n: 37, suffix: '', label: 'PM2 services', red: true },
    { n: 3, suffix: '-Way', label: 'Failover' },
    { n: 6, suffix: '×', label: 'GSE upload speedup' },
  ],
  runtime: [
    { idx: '01.', label: 'Runtime', title: 'Self-Hosted Core', text: 'Three servers, Jenkins on both, Nginx failover. No cloud lock-in.', chips: [] },
    { idx: '02.', label: 'Production', title: 'GSE Storage', text: 'Encrypted, deduplicated object storage serving live products.', chips: ['Python', 'MinIO', 'Vault', 'MySQL'] },
    { idx: '03.', label: 'Execution', title: 'Speech & ML APIs', text: 'ASR, diarization, OCR and embeddings behind FastAPI.', chips: ['FastAPI', 'PyTorch', 'ffmpeg'] },
  ],
};

export const ABOUT = {
  paragraphs: [
    "I'm Bapan, a machine learning engineer at QuantumHash Corporation, working remotely from Kuwait since January 2025. I hold a BCom from the University of Calcutta, and my route here ran through data analysis at KodeCore and Python development at Arkca Corporate Solutions.",
    'How I work comes down to owning the whole path. I train and serve the models, write the APIs, run the databases and servers underneath, and wire up the alerts that tell me when something breaks. Everything on my stack is self-hosted, because I would rather understand a system end to end than rent a black box.',
  ],
  quote: 'Models are the easy part to demo. The hard part is keeping them online, observable and recoverable while real users depend on them.',
  feats: [
    { idx: '01', title: 'Self-hosted first', text: 'Mail, storage, databases, CI/CD and monitoring all run on hardware I manage.' },
    { idx: '02', title: 'Failover by design', text: 'Every critical service has a second home, and I test it by actually taking the first one offline.' },
    { idx: '03', title: 'Verify, then ship', text: 'Round-trip integrity checks, dry-run garbage collection and staged rollouts come before anything touches production.' },
  ],
  timeline: [
    { when: '2025 → now', title: 'Machine Learning Engineer', org: 'QuantumHash Corporation · Remote' },
    { when: 'Apr 2022 – Jan 2025', title: 'Python Developer', org: 'Arkca Corporate Solutions' },
    { when: 'Apr 2020 – Mar 2022', title: 'Data Analyst', org: 'KodeCore Private Limited' },
    { when: 'Education', title: 'BCom', org: 'University of Calcutta' },
  ],
};

export const FEATURE = {
  badge: 'Core ecosystem',
  hardware: 'Hardware: 3 Linux servers · 128 GB RAM node · Quadro P5000 ×2 · RTX 3090',
  title: 'Hosting HA: 3-Way Failover Platform',
  desc:
    'Every hosting service mirrored across two active nodes, with a third as the last resort. Jenkins builds each push on both servers, and Nginx balances traffic across them with health-checked upstreams.',
  kpis: [
    { n: 3, label: 'Servers' },
    { n: 21, label: 'Dual-built CI jobs' },
    { text: '60+', label: 'Balanced sites' },
    { text: '24/7', label: 'Monitored' },
  ],
};

export const STACK = [
  { tab: 'L1: Edge & TLS', kind: 'Edge', title: "Nginx gateway with Let's Encrypt", text: 'One gateway terminates TLS for 60+ site configs using Cloudflare DNS challenges, then proxies to upstream pairs with health checks (max_fails and fail_timeout).', chips: ['Nginx', "Let's Encrypt", 'Cloudflare DNS'] },
  { tab: 'L2: Compute', kind: 'Compute', title: 'Three servers, two with GPUs', text: 'A mail and hosting node, a DMZ gateway node, and a 128 GB RAM storage and database node. Services run under PM2, with deploy users and UIDs matched across nodes.', chips: ['Ubuntu', 'PM2', 'Quadro P5000', 'RTX 3090'] },
  { tab: 'L3: Data Core', kind: 'Data core', title: 'Replicated MySQL and PostgreSQL', text: 'A three-node MySQL InnoDB Cluster behind MySQL Router with tested automatic failover, plus a Patroni-based PostgreSQL cluster designed for a ten-million-user project.', chips: ['InnoDB Cluster', 'Group Replication', 'Patroni', 'pgBackRest'] },
  { tab: 'L4: Storage', kind: 'Storage', title: 'S3-class object storage', text: 'MinIO on a 4 TB NVMe with a RAID1 backup mirror, a bucket per service and download-only public policies, fronted by the GSE encryption and deduplication layer.', chips: ['MinIO', 'mdadm RAID1', 'GSE', 'Vault'] },
  { tab: 'L5: CI/CD', kind: 'Delivery', title: 'Dual Jenkins pipelines', text: 'Jenkins is replicated on both nodes, so 21 jobs build on every push through dual GitHub webhooks, with GitHub Deployment statuses, npm ci and zero-downtime pm2 reloads.', chips: ['Jenkins', 'GitHub Deployments', 'pm2 reload'] },
  { tab: 'L6: Observability', kind: 'Observability', title: 'Logs, metrics and alerts in one place', text: 'Grafana with Loki and Promtail collects logs from every server, Prometheus watches MinIO and GSE, and a custom webhook emails the actual error lines when an alert fires.', chips: ['Grafana', 'Loki', 'Promtail', 'Prometheus'] },
  { tab: 'L7: Recovery', kind: 'Recovery', title: 'Backups and failover drills', text: "Nightly MySQL dumps to MinIO with 30-day lifecycle rules, RAID1 replication of buckets, and real failover tests such as taking a node's services offline to confirm traffic stays up.", chips: ['Cron', 'mdadm', 'ip_hash', 'Failover tests'] },
];

export const CARDS = [
  { badge: 'Data // Storage', title: 'GSE: Genome Storage Engine', text: 'Content-addressed, encrypted object storage that gives every internal service one place for files, with deduplication built in.', bullets: ['BLAKE3 identity, CDC chunking, Zstd and LZ4 compression', 'XChaCha20-Poly1305 with Vault Transit key wrapping', '500 MB upload cut from 42 s to 7 s'], chips: ['Python', 'FastAPI', 'MinIO', 'Vault'], note: '3 projects live' },
  { badge: 'Product // Speech', title: 'OfficeMoM Meeting Bot', text: 'A bot that joins Google Meet, Zoom or Teams, records the audio and feeds ASR and diarization to produce minutes of meeting.', bullets: ['Playwright join flow, PipeWire audio capture and ffmpeg', 'Canary ASR and diarization from the QVox pipeline', 'Recordings merged and stored through GSE'], chips: ['TypeScript', 'Playwright', 'PM2'], note: 'Runs 24/7' },
  { badge: 'Model // Serving', title: 'Self-Hosted AI APIs', text: 'Open models served behind plain HTTP, so products can swap vendors without changing their code.', bullets: ['BGE-Large embeddings with similarity and rerank endpoints', 'Infinity-Parser2 OCR returning Mistral-compatible JSON', 'Qdrant holding 6 collections and 23,745 migrated points'], chips: ['sentence-transformers', 'PyMuPDF', 'Qdrant'], note: 'Mistral-compatible' },
];

export const CATS = [
  { id: 'all', label: 'All Systems' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'data', label: 'Data & Storage' },
  { id: 'infra', label: 'Infrastructure' },
  { id: 'prod', label: 'Products' },
];

export const SYS = [
  { cat: 'ai', tag: 'Machine Learning', title: 'Embedding API', text: 'BGE-Large-EN-v1.5 on FastAPI with embeddings, similarity, rerank and health endpoints, managed by PM2.', chips: ['sentence-transformers', 'FastAPI'] },
  { cat: 'ai', tag: 'Machine Learning', title: 'OCR Service', text: 'Infinity-Parser2-Flash behind five Mistral-compatible endpoints, rendering PDFs at 3× through PyMuPDF.', chips: ['Transformers', 'PyMuPDF'] },
  { cat: 'ai', tag: 'Speech', title: 'QVox Speech Pipeline', text: 'Canary ASR and speaker diarization microservices. Added ffmpeg normalization to fix header-less WebM chunks.', chips: ['Canary', 'Diarization', 'ffmpeg'] },
  { cat: 'ai', tag: 'Agents', title: 'JARVIS Desktop Agent', text: 'Claude API with Tinyfish web automation and local system tools, behind a dark sci-fi browser UI on a Python backend.', chips: ['Python', 'Claude API', 'Tinyfish'] },
  { cat: 'ai', tag: 'Security', title: 'Defensive Security Model', text: 'Phishing, intrusion and malware classifiers plus a small quantized LLM for explanations. Defensive only, with a human-reviewed retraining loop.', chips: ['Classical ML', 'Quantized LLM', 'MITRE'] },
  { cat: 'ai', tag: 'LLM Serving', title: 'Kimi-K3 Colibri Port', text: 'Converted the K3 tiktoken tokenizer (163,584 base tokens) to HuggingFace format and benchmarked MoE streaming on P5000 GPUs, then moved on to GLM-5.2.', chips: ['tokenizers', 'MoE'] },
  { cat: 'ai', tag: 'RAG', title: 'HSE Quiz RAG Pipeline', text: 'Node service that OCRs HSE documents with Mistral, stores them in MySQL and indexes chunks in Qdrant, with files routed through GSE.', chips: ['Node.js', 'Qdrant', 'Mistral OCR'] },
  { cat: 'data', tag: 'Database', title: 'MySQL InnoDB Cluster', text: 'Three nodes with Group Replication and MySQL Router. Primary failover tested, automatic rejoin on boot.', chips: ['MySQL 9.7', 'Router', 'Shell'] },
  { cat: 'data', tag: 'Database', title: 'PostgreSQL HA for HSE', text: 'Three-node Patroni cluster sized for about 10M users, with pgBackRest to MinIO and a C.UTF-8 locale so sort order matches on every node.', chips: ['Patroni', 'pgBackRest'] },
  { cat: 'data', tag: 'Storage', title: 'S3-Class Storage', text: 'MinIO on NVMe with a bucket per service, RAID1 mirror replication, CORS tuning and Prometheus dashboards.', chips: ['MinIO', 'RAID1', 'Grafana'] },
  { cat: 'data', tag: 'Vector DB', title: 'Qdrant Vector Database', text: 'Self-hosted Qdrant with API-key auth. Migrated 6 collections and 23,745 points through snapshots.', chips: ['Qdrant', 'Docker', 'Nginx'] },
  { cat: 'infra', tag: 'CI/CD', title: 'Jenkins Pipelines', text: 'Production-grade Jenkinsfiles with GitHub Deployment statuses, ruleset-matching checks and peer-deploy loop guards.', chips: ['Jenkins', 'Groovy', 'GitHub'] },
  { cat: 'infra', tag: 'Monitoring', title: 'Observability Stack', text: 'Grafana, Loki and Promtail across all servers, plus a Node webhook that emails the real error lines when an alert fires.', chips: ['Grafana', 'Loki', 'Node.js'] },
  { cat: 'infra', tag: 'Mail', title: 'Mail Platform', text: 'iRedMail migrated from Mailcow: about 21 mailboxes across 7 domains, DKIM on four, a Brevo relay and branded SOGo.', chips: ['iRedMail', 'DKIM', 'Brevo'] },
  { cat: 'infra', tag: 'GPU', title: 'Mining on Idle Cards', text: "lolMiner on Ergo's Autolykos algorithm: about 81 MH/s per P5000 pair and about 290 MH/s from an RTX 3090 container.", chips: ['lolMiner', 'systemd', 'Docker'] },
  { cat: 'infra', tag: 'Planning', title: 'AI Datacenter Blueprint', text: 'A multi-GPU RTX 5090 design with EPYC nodes, 100GbE RoCE and Kubernetes, vLLM, Ray Serve and SLURM.', chips: ['Kubernetes', 'vLLM', 'Ray'] },
  { cat: 'prod', tag: 'Cross-platform', title: 'QCortex', text: 'Agent app published to npm, with Developer ID-signed macOS builds, GPG-verified tags and a Telegram bot.', chips: ['Node.js', 'macOS', 'npm'] },
  { cat: 'prod', tag: 'Web App', title: 'PTW Rig-Site App', text: 'React, Vite and Tailwind app for tablets at a rig site, moving toward offline-first for poor networks.', chips: ['React', 'Vite', 'Tailwind'] },
  { cat: 'prod', tag: 'Mobile', title: 'Vegetable Boy', text: 'Grocery delivery in three roles: React Native user and delivery apps, a Next.js 15 admin and a Node.js and MySQL backend with dynamic UPI QR.', chips: ['React Native', 'Next.js 15'] },
  { cat: 'prod', tag: 'Platform', title: 'Quiz Platform', text: 'Production and test environments deployed by Jenkins, plus certificate generation and storage work for the ASES migration.', chips: ['Node.js', 'MySQL', 'Jenkins'] },
  { cat: 'prod', tag: 'Dashboard', title: 'API Usage Dashboard', text: 'Node and React dashboard tracking cost, usage, renewals and balance across Ollama, Mistral, OpenAI, AssemblyAI, Recall.ai and Mailbaby.', chips: ['Node.js', 'React', 'MySQL'] },
  { cat: 'prod', tag: 'Automation', title: 'AI Trading Bot', text: 'Built end to end for a client who does not code, with full written guidance for running it.', chips: ['Automation', 'Client project'] },
];

export const ALSO_RUNNING = ['n8n', 'Coder', 'Jitsi Meet', 'Nextcloud AIO', 'Graphiti + Neo4j', 'Mailcow', 'rootllms.com on Route 53 + CloudFront'];
