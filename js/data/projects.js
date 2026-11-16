PORTFOLIO_DATA.projectCategories = [
      { id: 'web-apps', name: 'Web Applications', icon: 'layout-dashboard' },
      { id: 'ecommerce', name: 'E-commerce', icon: 'shopping-bag' },
      { id: 'edtech', name: 'Education Technology', icon: 'graduation-cap' },
      { id: 'portfolio', name: 'Portfolio Websites', icon: 'user' },
      { id: 'productivity', name: 'Productivity Tools', icon: 'list-checks' },
      { id: 'management', name: 'Management Systems', icon: 'briefcase' },
      { id: 'experimental', name: 'Experimental Projects', icon: 'flask' }
    ];

    /* Project schema
       id, title, categoryId, description (card), longDescription (modal),
       features[], tech[], liveUrl | null, sourceUrl | null,
       image 'assets/images/projects/<file>' | null (renders a labelled placeholder),
       year, featured, placeholder */
    PORTFOLIO_DATA.projects = [
      {
        id: 'portfolio-website', title: 'Personal Portfolio Website', categoryId: 'portfolio', year: '2026',
        description: 'The site you are viewing — a premium, accessible single-page portfolio built with semantic HTML, modern CSS and vanilla JavaScript.',
        longDescription: 'A data-driven personal portfolio designed to communicate credibility and craft. Content (certifications, skills, projects, testimonials) lives in separate data modules so it can be edited without touching the layout, and the whole experience works without a framework or build step.',
        features: [
          'Dark and light themes with persisted preference',
          'Certification gallery with institution filters and an accessible preview modal',
          'Project showcase with category filtering and detail views',
          'EmailJS-powered contact form with validation and spam protection',
          'Scroll-triggered reveals, animated statistics and a reduced-motion fallback'
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'EmailJS'],
        liveUrl: null, sourceUrl: null, image: null, featured: true, placeholder: false
      },
      {
        id: 'placeholder-web-app', title: 'Web application project', categoryId: 'web-apps', year: null,
        description: 'Replace with a one- or two-sentence summary of the problem this project solves and who it is for.',
        longDescription: 'Replace with a fuller overview: the context, your role, the main technical decisions and the outcome.',
        features: ['Key feature one', 'Key feature two', 'Key feature three'],
        tech: ['Technology one', 'Technology two'],
        liveUrl: null, sourceUrl: null, image: null, featured: true, placeholder: true
      },
      {
        id: 'placeholder-ecommerce', title: 'E-commerce project', categoryId: 'ecommerce', year: null,
        description: 'Replace with a short summary — for example, a storefront with product filtering, a cart and checkout flow.',
        longDescription: 'Replace with a fuller overview of the project.',
        features: ['Key feature one', 'Key feature two'],
        tech: ['Technology one', 'Technology two'],
        liveUrl: null, sourceUrl: null, image: null, featured: false, placeholder: true
      },
      {
        id: 'placeholder-edtech', title: 'Education technology project', categoryId: 'edtech', year: null,
        description: 'Replace with a short summary — for example, an interactive learning tool or quiz platform.',
        longDescription: 'Replace with a fuller overview of the project.',
        features: ['Key feature one', 'Key feature two'],
        tech: ['Technology one', 'Technology two'],
        liveUrl: null, sourceUrl: null, image: null, featured: true, placeholder: true
      },
      {
        id: 'placeholder-productivity', title: 'Productivity tool', categoryId: 'productivity', year: null,
        description: 'Replace with a short summary — for example, a task manager, note-taking app or habit tracker.',
        longDescription: 'Replace with a fuller overview of the project.',
        features: ['Key feature one', 'Key feature two'],
        tech: ['Technology one', 'Technology two'],
        liveUrl: null, sourceUrl: null, image: null, featured: false, placeholder: true
      },
      {
        id: 'placeholder-management', title: 'Management system', categoryId: 'management', year: null,
        description: 'Replace with a short summary — for example, an inventory, booking or records management system.',
        longDescription: 'Replace with a fuller overview of the project.',
        features: ['Key feature one', 'Key feature two'],
        tech: ['Technology one', 'Technology two'],
        liveUrl: null, sourceUrl: null, image: null, featured: false, placeholder: true
      },
      {
        id: 'placeholder-experimental', title: 'Experimental project', categoryId: 'experimental', year: null,
        description: 'Replace with a short summary — for example, a Canvas experiment, a browser API exploration or a small game.',
        longDescription: 'Replace with a fuller overview of the project.',
        features: ['Key feature one', 'Key feature two'],
        tech: ['Technology one', 'Technology two'],
        liveUrl: null, sourceUrl: null, image: null, featured: false, placeholder: true
      }
    ];
