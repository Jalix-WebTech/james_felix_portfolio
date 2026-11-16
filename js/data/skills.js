/* Proficiency levels — no percentages, no progress bars. */
    PORTFOLIO_DATA.skillLevels = {
      proficient: 'Proficient',
      working: 'Working Knowledge',
      learning: 'Currently Learning'
    };

    /* Skill schema
       name        display name
       icon        Simple Icons slug (https://simpleicons.org) — rendered via cdn.simpleicons.org
       iconColor   hex (without #) or { dark: 'hex', light: 'hex' } for theme-aware colouring
       lucide      fallback UI icon name when there is no brand logo
       mono        2–3 character monogram used when no icon loads
       level       'proficient' | 'working' | 'learning' | null (badge hidden when null)
       description one sentence
       source      where it was learned / issuing institution (optional)
       link        verification or reference URL (optional)
       core        shown in the homepage "Core technologies" cloud
       placeholder true until real data is supplied */
    PORTFOLIO_DATA.skillCategories = [
      {
        id: 'languages', title: 'Programming Languages', icon: 'code',
        description: 'Languages I write and reason in day to day.',
        skills: [
          { name: 'JavaScript', icon: 'javascript', iconColor: 'F7DF1E', mono: 'JS', level: 'proficient', core: true,
            description: 'Modern ES6+ — modules, async patterns, DOM APIs and clean, testable functions.' },
          { name: 'HTML5', icon: 'html5', iconColor: 'E34F26', mono: 'H5', level: 'proficient', core: true,
            description: 'Semantic, accessible markup as the foundation of every interface.' },
          { name: 'CSS3', icon: 'css', iconColor: '663399', mono: 'C3', level: 'proficient', core: true,
            description: 'Layout with Grid and Flexbox, custom properties, responsive design and motion.' }
        ]
      },
      {
        id: 'frontend', title: 'Frontend Development', icon: 'layout',
        description: 'Turning designs into fast, inclusive user interfaces.',
        skills: [
          { name: 'Responsive Web Design', lucide: 'smartphone', mono: 'RW', level: 'proficient', core: true,
            description: 'Mobile-first layouts that adapt gracefully from small phones to large displays.' },
          { name: 'DOM Manipulation', lucide: 'git-branch', mono: 'DOM', level: 'proficient',
            description: 'Efficient, event-driven UI updates without a framework.' },
          { name: 'Web Accessibility', lucide: 'accessibility', mono: 'A11y', level: 'working', core: true,
            description: 'Semantic structure, keyboard support, ARIA where needed and WCAG-aware colour contrast.' },
          { name: 'UI Implementation', lucide: 'palette', mono: 'UI', level: 'proficient',
            description: 'Pixel-conscious implementation of design systems, components and micro-interactions.' }
        ]
      },
      {
        id: 'backend', title: 'Backend Development', icon: 'server',
        description: 'Only technologies genuinely studied are listed here.',
        skills: [
          { name: 'Backend technology', lucide: 'server', mono: 'BE', level: 'learning', placeholder: true,
            description: 'Add only backend technologies you have genuinely studied (for example Node.js or Python). Remove this entry if not applicable.' }
        ]
      },
      {
        id: 'databases', title: 'Databases', icon: 'database',
        description: 'Verified database technologies.',
        skills: [
          { name: 'Database technology', lucide: 'database', mono: 'DB', level: 'learning', placeholder: true,
            description: 'Add verified database technologies (for example MySQL, PostgreSQL or MongoDB). Remove this entry if not applicable.' }
        ]
      },
      {
        id: 'tools', title: 'Tools & Platforms', icon: 'wrench',
        description: 'The everyday toolkit.',
        skills: [
          { name: 'Git', icon: 'git', iconColor: 'F05032', mono: 'Git', level: 'proficient', core: true,
            description: 'Branching, meaningful commits and collaborative workflows.' },
          { name: 'GitHub', icon: 'github', iconColor: { dark: 'ffffff', light: '181717' }, mono: 'GH', level: 'proficient', core: true,
            description: 'Repositories, pull requests, issues and GitHub Pages deployments.' },
          { name: 'VS Code', lucide: 'terminal', mono: 'VS', level: 'proficient', core: true,
            description: 'Primary editor — extensions, debugging and integrated terminal workflows.' },
          { name: 'Other tool or platform', lucide: 'wrench', mono: '+', level: null, placeholder: true,
            description: 'Add further tools you use regularly (design tools, CLIs, hosting platforms…).' }
        ]
      }
    ];
