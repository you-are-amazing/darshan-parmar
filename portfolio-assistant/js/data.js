// ---------- Content library ----------
// All chatbot reply content lives here so it can be edited without
// touching the app logic in app.js.

const responseLibrary = {
  about: `
    <h2>About Darshan</h2>
    <p>I'm a <strong>Computer Engineering graduate</strong> currently working as a <strong>Software Quality Assurance Engineer at Exotic Infotech</strong> in Bharuch. My day-to-day is software testing, automation, defect analysis, API testing, and technical documentation.</p>
    <p>I have a strong foundation in computer networks, IT infrastructure, operating systems, and information security fundamentals, along with hands-on academic and internship experience in <strong>AI/ML engineering</strong> — from LLM fine-tuning with retrieval-augmented generation (RAG) for pharmaceutical knowledge systems to deep-learning-based brain tumor segmentation.</p>
    <p>I'm analytical and detail-oriented, with an interest in software quality, reliable IT systems, and secure technology infrastructure.</p>
    <p>I studied Computer Engineering at <strong>Government Engineering College, Bharuch (GTU)</strong> and I'm based in <strong>Bharuch, Gujarat, India</strong>.</p>
    <div class="link-row">
      <a class="link-pill" href="https://www.linkedin.com/in/-darshan-a-parmar/" target="_blank" rel="noopener">LinkedIn</a>
      <a class="link-pill" href="mailto:connect.darshanparmar@gmail.com">Email</a>
    </div>
  `,

  skills: `
    <h2>Skills & tools</h2>
    <p>Tools and concepts I work with most, grouped by area.</p>
    <div class="skill-grid">
      <div class="skill-row"><div class="k">Software Testing</div><div class="v">Manual Testing · Functional · Regression · Smoke · Sanity · Integration · System · Usability · Black-Box · Test Case Design · Defect Identification & Reporting</div></div>
      <div class="skill-row"><div class="k">Testing Concepts</div><div class="v">SDLC · STLC · Bug Life Cycle · Severity & Priority · Defect Life Cycle · Test Documentation · Agile & Scrum</div></div>
      <div class="skill-row"><div class="k">Tools & Programming</div><div class="v">Postman · Jira · Git · GitHub · Selenium WebDriver · Python · SQL · CI/CD Fundamentals</div></div>
      <div class="skill-row"><div class="k">Networking & Infrastructure</div><div class="v">TCP/IP · OSI Model · IPv4/IPv6 · Subnetting · DNS · DHCP · VLANs · Routing · Switching · NAT · Wi-Fi · Network Troubleshooting</div></div>
      <div class="skill-row"><div class="k">Security & Systems</div><div class="v">Network Security Fundamentals · Firewall & ACL Concepts · VPN Concepts · Network Segmentation · Linux · Windows · PowerShell</div></div>
      <div class="skill-row"><div class="k">AI / ML</div><div class="v">Machine Learning · Deep Learning · RAG · LLMs</div></div>
      <div class="skill-row"><div class="k">Professional</div><div class="v">Analytical Thinking · Problem Solving · Attention to Detail · Debugging · Communication · Teamwork · Technical Documentation</div></div>
    </div>
  `,

  experience: `
    <h2>Experience</h2>
    <p>Software QA, AI/ML internships, and research — a mix of quality engineering and applied AI.</p>
    <div class="timeline">
      <div class="tl-item">
        <div class="tl-head">
          <div><span class="tl-title">Software Quality Assurance</span> · <span class="tl-org">Exotic Infotech</span></div>
          <div class="tl-date">Aug 2026 — Present</div>
        </div>
        <div class="tl-body">Design and execute test cases for web and mobile applications to validate functionality, usability, and reliability. Perform functional, regression, integration, smoke, sanity, and usability testing; identify, document, and track defects while working with developers to reproduce issues and verify fixes. <em>Bharuch, Gujarat · On site.</em></div>
      </div>
      <div class="tl-item">
        <div class="tl-head">
          <div><span class="tl-title">AI Intern</span> · <span class="tl-org">Fiscal Ox Cloud Pvt Ltd</span></div>
          <div class="tl-date">Dec 2025 — Apr 2026</div>
        </div>
        <div class="tl-body">Worked on domain-adaptive LLM fine-tuning with Retrieval-Augmented Generation (RAG) for chemical, pharmaceutical, and life-science knowledge systems. Developed and evaluated domain-specific AI solutions, applied RAG to improve retrieval and response generation, and contributed to testing and technical documentation. <em>Bhayali, Vadodara, Gujarat · On site.</em></div>
      </div>
      <div class="tl-item">
        <div class="tl-head">
          <div><span class="tl-title">Research Intern</span> · <span class="tl-org">IEEE SPS Summer Mentorship Program</span></div>
          <div class="tl-date">Jun 2025 — Jul 2025</div>
        </div>
        <div class="tl-body">Worked under Dr. Mita Paunwala (CKPCET, Surat) on <em>Deep Learning Based Brain Tumor Segmentation using Multi-Modal MRI Data</em>. Took part in technical review discussions, implemented improvements from feedback, and delivered a detailed project report and a working software module. <em>Online.</em></div>
      </div>
    </div>
    <div class="section-title">Education</div>
    <div class="timeline">
      <div class="tl-item">
        <div class="tl-head">
          <div><span class="tl-title">B.E./B.Tech, Computer Engineering</span> · <span class="tl-org">Government Engineering College, Bharuch (GTU)</span></div>
          <div class="tl-date">2022 — 2026</div>
        </div>
        <div class="tl-body">CGPA: 8.22 / 10.</div>
      </div>
    </div>
  `,

  projects: `
    <h2>Projects</h2>
    <p>Applied AI/ML work from my internships.</p>

    <div class="project-card">
      <h4>Brain Tumor Segmentation using Multi-Modal MRI</h4>
      <div class="meta">Jun — Jul 2025 · IEEE SPS Summer Mentorship Program</div>
      <p>A deep learning solution for segmenting brain tumors from multi-modal MRI data, developed under the guidance of Dr. Mita Paunwala. Delivered as a detailed project report and a working software module.</p>
      <div class="stack"><span>Deep Learning</span><span>3D U-Net</span><span>Multi-modal MRI</span></div>
    </div>

    <div class="project-card">
      <h4>Domain-Adaptive LLM + RAG for Pharma &amp; Life Sciences</h4>
      <div class="meta">Dec 2025 — Apr 2026 · Fiscal Ox Cloud Pvt Ltd</div>
      <p>Domain-adaptive LLM fine-tuning combined with retrieval-augmented generation for chemical, pharmaceutical, and life-science knowledge systems, improving domain-specific retrieval and response generation.</p>
      <div class="stack"><span>LLMs</span><span>RAG</span><span>Fine-tuning</span></div>
    </div>
  `,

  research: `
    <h2>Research</h2>
    <p>My research work sits in medical image analysis and explainable, fair AI for healthcare.</p>

    <div class="paper-card">
      <h4>Probability-Guided Post-Processing for Improving Surface Metrics in UNet-Based Tumour Segmentation using Multiparametric MRI</h4>
      <div class="meta">ET2ECN-2026 · Accepted</div>
      <p>Guided by Dr. Mita Paunwala &amp; Dr. Shankar Parmar. Built and trained a 3D U-Net on the Medical Segmentation Decathlon dataset using multi-parametric MRI (T1, T1-Gd, T2, FLAIR), and developed probability-guided post-processing that improved surface metrics (Surface Dice +0.03, HD95 −1 mm) without retraining.</p>
    </div>

    <div class="paper-card">
      <h4>Enhancing Fairness and Interpretability in EEG-Based PTSD Diagnosis with XAI</h4>
      <div class="meta">Guided by Dr. Shankar Parmar · GEC, Bharuch</div>
      <p>Proposed an explainable AI framework for EEG-based PTSD detection, identified Beta PSD in the Right Primary Motor Cortex as a candidate biomarker, and performed fairness evaluation to reduce demographic bias in model predictions.</p>
    </div>
  `,

  contact: `
    <h2>Get in touch</h2>
    <p>The best way to reach Darshan is by email or LinkedIn.</p>

    <div class="contact-grid">
      <div class="contact-item">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:connect.darshanparmar@gmail.com">connect.darshanparmar@gmail.com</a></div>
      </div>
      <div class="contact-item">
        <div class="label">LinkedIn</div>
        <div class="value"><a href="https://www.linkedin.com/in/-darshan-a-parmar/" target="_blank" rel="noopener">linkedin.com/in/-darshan-a-parmar</a></div>
      </div>
      <div class="contact-item">
        <div class="label">Location</div>
        <div class="value">Bharuch, Gujarat, India</div>
      </div>
    </div>
  `
};

const promptLabels = {
  about: "Tell me about Darshan",
  skills: "What are his skills?",
  experience: "What's his work experience and Education?",
  projects: "Show me his projects",
  research: "Tell me about his research",
  contact: "How can I contact him?"
};

// ---------- Blog posts & repo previews ----------
// The in-app viewer panel (see app.js) can render blog posts and GitHub repo
// previews. None are configured right now — add entries here (and matching
// data-blog / data-repo cards in responseLibrary) if you want them back.
const blogPosts = {};
const repoPreviews = {};

window.RESPONSES = responseLibrary;
window.PROMPT_LABELS = promptLabels;
window.BLOG_POSTS = blogPosts;
window.REPO_PREVIEWS = repoPreviews;