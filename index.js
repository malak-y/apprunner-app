const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const layout = (title, content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg:        #07080a;
      --surface:   #0f1115;
      --border:    rgba(255,255,255,0.07);
      --accent:    #00e5a0;
      --accent2:   #0070f3;
      --text:      #e8eaf0;
      --muted:     #5a5f72;
      --font-head: 'Syne', sans-serif;
      --font-mono: 'DM Mono', monospace;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── NOISE OVERLAY ── */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: 0.03;
      pointer-events: none;
      z-index: 0;
    }

    /* ── GRID BACKGROUND ── */
    body::after {
      content: '';
      position: fixed; inset: 0;
      background-image:
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 0;
    }

    /* ── NAV ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 2.5rem;
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(20px);
      background: rgba(7,8,10,0.7);
    }

    .nav-logo {
      font-family: var(--font-head);
      font-weight: 800;
      font-size: 1rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text);
      text-decoration: none;
    }

    .nav-logo span { color: var(--accent); }

    .nav-links { display: flex; gap: 2rem; }

    .nav-links a {
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .nav-links a:hover, .nav-links a.active { color: var(--accent); }

    /* ── STATUS BADGE ── */
    .status-pill {
      display: inline-flex; align-items: center; gap: 0.5rem;
      font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 0.3rem 0.75rem;
      border: 1px solid rgba(0,229,160,0.25);
      border-radius: 99px;
      color: var(--accent);
      background: rgba(0,229,160,0.05);
    }

    .status-pill::before {
      content: '';
      width: 6px; height: 6px;
      background: var(--accent);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,229,160,0.4); }
      50%       { opacity: 0.7; box-shadow: 0 0 0 4px rgba(0,229,160,0); }
    }

    /* ── MAIN CONTENT ── */
    main {
      position: relative; z-index: 1;
      min-height: 100vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 7rem 2rem 4rem;
      text-align: center;
    }

    /* ── EYEBROW ── */
    .eyebrow {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 1.5rem;
      animation: fadeUp 0.6s ease both;
    }

    /* ── HEADLINE ── */
    h1 {
      font-family: var(--font-head);
      font-weight: 800;
      font-size: clamp(3rem, 8vw, 6.5rem);
      line-height: 0.95;
      letter-spacing: -0.02em;
      margin-bottom: 1.5rem;
      animation: fadeUp 0.6s 0.1s ease both;
    }

    h1 .highlight {
      -webkit-text-fill-color: transparent;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
      -webkit-background-clip: text;
      background-clip: text;
    }

    /* ── SUBTITLE ── */
    .subtitle {
      font-size: 0.95rem;
      color: var(--muted);
      max-width: 480px;
      line-height: 1.7;
      margin-bottom: 3rem;
      animation: fadeUp 0.6s 0.2s ease both;
    }

    /* ── CTA BUTTONS ── */
    .ctas {
      display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
      animation: fadeUp 0.6s 0.3s ease both;
    }

    .btn {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 0.85rem 2rem;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn:hover { transform: translateY(-2px); }

    .btn-primary {
      background: var(--accent);
      color: #000;
      font-weight: 500;
      box-shadow: 0 0 30px rgba(0,229,160,0.25);
    }

    .btn-primary:hover { box-shadow: 0 0 40px rgba(0,229,160,0.45); }

    .btn-ghost {
      border: 1px solid var(--border);
      color: var(--muted);
      background: transparent;
    }

    .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

    /* ── STATS ROW ── */
    .stats {
      display: flex; gap: 3rem; flex-wrap: wrap; justify-content: center;
      margin-top: 5rem;
      padding-top: 3rem;
      border-top: 1px solid var(--border);
      animation: fadeUp 0.6s 0.4s ease both;
      width: 100%; max-width: 700px;
    }

    .stat-item { text-align: center; }

    .stat-value {
      font-family: var(--font-head);
      font-weight: 800;
      font-size: 2rem;
      color: var(--text);
    }

    .stat-label {
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
      margin-top: 0.25rem;
    }

    /* ── CARD (about page) ── */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      max-width: 900px;
      width: 100%;
      margin-top: 3rem;
      animation: fadeUp 0.6s 0.35s ease both;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 2rem;
      text-align: left;
      transition: border-color 0.2s, transform 0.2s;
    }

    .card:hover {
      border-color: rgba(0,229,160,0.3);
      transform: translateY(-4px);
    }

    .card-icon {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .card h3 {
      font-family: var(--font-head);
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    .card p {
      font-size: 0.8rem;
      color: var(--muted);
      line-height: 1.7;
    }

    /* ── CODE TAG ── */
    .code-tag {
      display: inline-block;
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      background: rgba(0,112,243,0.1);
      border: 1px solid rgba(0,112,243,0.25);
      color: #6ab4ff;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }

    /* ── FOOTER ── */
    footer {
      position: relative; z-index: 1;
      text-align: center;
      padding: 2rem;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      border-top: 1px solid var(--border);
    }

    /* ── ANIMATION ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── GLOW ORBS ── */
    .orb {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      filter: blur(80px);
      opacity: 0.12;
    }

    .orb-1 {
      width: 500px; height: 500px;
      background: var(--accent);
      top: -150px; right: -150px;
    }

    .orb-2 {
      width: 400px; height: 400px;
      background: var(--accent2);
      bottom: -100px; left: -100px;
    }
  </style>
</head>
<body>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>

  <nav>
    <a class="nav-logo" href="/">App<span>Runner</span></a>
    <div class="nav-links">
      <a href="/" ${title === 'Home — AppRunner' ? 'class="active"' : ''}>Home</a>
      <a href="/about" ${title === 'About — AppRunner' ? 'class="active"' : ''}>About</a>
    </div>
    <div class="status-pill">Live</div>
  </nav>

  ${content}

  <footer>
    &copy; ${new Date().getFullYear()} &nbsp;·&nbsp; Deployed via AWS App Runner &nbsp;·&nbsp; Node.js + Express
  </footer>
</body>
</html>`;

app.get("/", (req, res) => {
  res.send(layout("Home — AppRunner", `
    <main>
      <p class="eyebrow">Production · Scalable · Serverless</p>
      <h1>Hello from<br><span class="highlight">AWS App Runner</span> 🚀</h1>
      <p class="subtitle">
        Your application is live and running on fully managed infrastructure.
        Auto-scales from zero — no servers to manage, no clusters to configure.
      </p>
      <div class="ctas">
        <a href="/about" class="btn btn-primary">Learn More</a>
        <a href="https://aws.amazon.com/apprunner/" class="btn btn-ghost" target="_blank" rel="noopener">AWS Docs ↗</a>
      </div>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">∞</div>
          <div class="stat-label">Auto Scaling</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0</div>
          <div class="stat-label">Servers Managed</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">99.9%</div>
          <div class="stat-label">Uptime SLA</div>
        </div>
      </div>
    </main>
  `));
});

app.get("/about", (req, res) => {
  res.send(layout("About — AppRunner", `
    <main>
      <div class="code-tag">GET /about</div>
      <p class="eyebrow">About this deployment</p>
      <h1 style="font-size: clamp(2.5rem, 6vw, 4.5rem)">Built on <span class="highlight">App Runner</span></h1>
      <p class="subtitle">
        AWS App Runner automatically builds and deploys your application, then load balances traffic with TLS encryption — so you can focus on code.
      </p>
      <div class="card-grid">
        <div class="card">
          <div class="card-icon">⚡</div>
          <h3>Instant Deploy</h3>
          <p>Push code and App Runner automatically builds, deploys, and serves your application within minutes.</p>
        </div>
        <div class="card">
          <div class="card-icon">📈</div>
          <h3>Auto Scaling</h3>
          <p>Traffic spikes are handled gracefully. Scale to zero when idle, scale up instantly on demand.</p>
        </div>
        <div class="card">
          <div class="card-icon">🔒</div>
          <h3>Secure by Default</h3>
          <p>Automatic HTTPS, managed TLS certificates, and built-in AWS IAM integration out of the box.</p>
        </div>
        <div class="card">
          <div class="card-icon">🌐</div>
          <h3>Global Edge</h3>
          <p>Serve users worldwide with low latency, backed by AWS's global infrastructure and CDN.</p>
        </div>
      </div>
    </main>
  `));
});

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});
