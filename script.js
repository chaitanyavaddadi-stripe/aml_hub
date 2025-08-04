document.addEventListener('DOMContentLoaded', function() {
    // --- VANTA.JS GLOBE EFFECT ---
    let vantaEffect = null;
    
    function initVantaEffect() {
        if (vantaEffect) {
            vantaEffect.destroy();
        }
        
        const isLightMode = document.documentElement.classList.contains('light');
        const globeEl = document.getElementById('vanta-globe');
        
        if (!globeEl) return;
        
        // Configure the globe effect
        vantaEffect = VANTA.GLOBE({
            el: globeEl,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: isLightMode ? 0x635bff : 0xff3f81, // #635bff in light, pink in dark
            color2: isLightMode ? 0x222244 : 0xffffff, // dark blue in light, white in dark
            backgroundColor: isLightMode ? 0xffffff : 0x23153c, // Light/dark background
            size: isLightMode ? 1.4 : 1.2, // Restore original globe size
            speed: 0.80,
            points: isLightMode ? 8.00 : 10.00, // Restore previous density
            maxDistance: isLightMode ? 20.00 : 25.00, // Restore previous connection length
            rotation: 0.2
        });
    }
    
    // --- THEME TOGGLE ---
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        themeToggle.addEventListener('click', () => {
            // Toggle light/dark classes on html element
            if (document.documentElement.classList.contains('light')) {
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                localStorage.theme = 'light';
            }
            // Animate toggle slider and icons
            setTimeout(() => {
                const slider = themeToggle.querySelector('.toggle-slider');
                const sun = themeToggle.querySelector('.toggle-icon.sun');
                const moon = themeToggle.querySelector('.toggle-icon.moon');
                if (document.documentElement.classList.contains('dark')) {
                    slider.style.left = '27px';
                    sun.style.opacity = '0.3';
                    moon.style.opacity = '1';
                } else {
                    slider.style.left = '3px';
                    sun.style.opacity = '1';
                    moon.style.opacity = '0.3';
                }
            }, 10);
            // Update particle colors if the canvas exists
            updateParticleColors();
            // Reinitialize Vanta effect with new colors
            initVantaEffect();
        });
        // On load, set slider and icons to correct state
        setTimeout(() => {
            const slider = themeToggle.querySelector('.toggle-slider');
            const sun = themeToggle.querySelector('.toggle-icon.sun');
            const moon = themeToggle.querySelector('.toggle-icon.moon');
            if (document.documentElement.classList.contains('dark')) {
                slider.style.left = '27px';
                sun.style.opacity = '0.3';
                moon.style.opacity = '1';
            } else {
                slider.style.left = '3px';
                sun.style.opacity = '1';
                moon.style.opacity = '0.3';
            }
        }, 100);
    }
    
    // --- PARTICLE CANVAS BACKGROUND ---
    let particles = [];
    let particleColors = {
        dark: {
            particle: [255, 255, 255],
            connection: [255, 255, 255]
        },
        light: {
            particle: [35, 21, 60], // Dark purple color for better contrast
            connection: [35, 21, 60]
        }
    };
    
    function updateParticleColors() {
        const isLightMode = document.documentElement.classList.contains('light');
        if (particles.length > 0) {
            particles.forEach(particle => {
                particle.color = isLightMode ? particleColors.light.particle : particleColors.dark.particle;
            });
        }
    }
    
    function createParticleBackground() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // Set canvas size to match window
        canvas.width = width;
        canvas.height = height;
        
        // Track mouse position
        let mouseX = width / 2;
        let mouseY = height / 2;
        let mouseRadius = 150;
        
        // Create particles
        const particleCount = Math.min(Math.floor((width * height) / 9000), 200);
        
        // Find the hero banner position to create more particles around it
        const heroBanner = document.querySelector('.hero-banner-img');
        let heroBannerRect = null;
        
        if (heroBanner) {
            heroBannerRect = heroBanner.getBoundingClientRect();
        }
        
        class Particle {
            constructor(nearBanner = false) {
                if (nearBanner && heroBannerRect) {
                    // Create particles near the banner
                    const margin = 100;
                    this.x = heroBannerRect.left - margin + Math.random() * (heroBannerRect.width + margin * 2);
                    this.y = heroBannerRect.top - margin + Math.random() * (heroBannerRect.height + margin * 2);
                    this.size = Math.random() * 2.5 + 0.8;
                    this.opacity = Math.random() * 0.6 + 0.3;
                } else {
                    // Create particles randomly across the screen
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.size = Math.random() * 2 + 0.5;
                    this.opacity = Math.random() * 0.5 + 0.2;
                }
                
                this.baseSize = this.size;
                const isLightMode = document.documentElement.classList.contains('light');
                this.color = isLightMode ? particleColors.light.particle : particleColors.dark.particle;
                this.speed = {
                    x: (Math.random() - 0.5) * 0.5,
                    y: (Math.random() - 0.5) * 0.5
                };
                this.connections = [];
            }
            
            update() {
                // Move particle
                this.x += this.speed.x;
                this.y += this.speed.y;
                
                // Wrap around edges
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
                
                // React to mouse
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouseRadius - distance) / mouseRadius;
                    
                    // Push particles away from mouse
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                    
                    // Increase size and opacity near mouse
                    this.size = this.baseSize * (1 + force);
                    this.opacity = Math.min(0.8, this.opacity + force * 0.2);
                } else {
                    // Return to base size and opacity
                    this.size = this.baseSize;
                    this.opacity = Math.max(0.2, this.opacity - 0.01);
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
                ctx.fill();
            }
            
            connectTo(particle) {
                const dx = this.x - particle.x;
                const dy = this.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only connect particles within a certain distance
                const maxDistance = width / 10;
                if (distance < maxDistance) {
                    // Check if both particles are near the banner
                    let isNearBanner = false;
                    if (heroBannerRect) {
                        const nearBanner1 = 
                            this.x >= heroBannerRect.left - 100 && 
                            this.x <= heroBannerRect.right + 100 &&
                            this.y >= heroBannerRect.top - 100 && 
                            this.y <= heroBannerRect.bottom + 100;
                            
                        const nearBanner2 = 
                            particle.x >= heroBannerRect.left - 100 && 
                            particle.x <= heroBannerRect.right + 100 &&
                            particle.y >= heroBannerRect.top - 100 && 
                            particle.y <= heroBannerRect.bottom + 100;
                            
                        isNearBanner = nearBanner1 && nearBanner2;
                    }
                    
                    // Calculate opacity based on distance and banner proximity
                    let opacity = 0.2 * (1 - distance / maxDistance);
                    const isLightMode = document.documentElement.classList.contains('light');
                    let color = isLightMode ? particleColors.light.connection : particleColors.dark.connection;
                    
                    // Enhance connections near the banner
                    if (isNearBanner) {
                        opacity *= 1.5;
                        // Add a slight tint to connections near the banner
                        if (isLightMode) {
                            color = [79, 70, 229]; // Indigo for light mode
                        } else {
                            color = [200, 220, 255]; // Light blue for dark mode
                        }
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
                    ctx.lineWidth = isNearBanner ? 0.8 : 0.5;
                    ctx.stroke();
                }
            }
        }
        
        // Create particles
        // First create particles around the banner
        if (heroBannerRect) {
            for (let i = 0; i < particleCount * 0.3; i++) {
                particles.push(new Particle(true));
            }
        }
        
        // Then create particles across the screen
        for (let i = 0; i < particleCount * 0.7; i++) {
            particles.push(new Particle(false));
        }
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Handle clicks
        document.addEventListener('click', (e) => {
            // Create ripple effect
            mouseRadius = 300;
            setTimeout(() => {
                mouseRadius = 150;
            }, 500);
            
            // Create new particles at click position
            for (let i = 0; i < 5; i++) {
                const particle = new Particle(false);
                particle.x = e.clientX;
                particle.y = e.clientY;
                particle.opacity = 0.8;
                particle.size = Math.random() * 3 + 1;
                particle.baseSize = particle.size;
                particles.push(particle);
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            
            // Update hero banner rect
            if (heroBanner) {
                heroBannerRect = heroBanner.getBoundingClientRect();
            }
        });
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections between particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    particles[i].connectTo(particles[j]);
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // --- UTILITY FUNCTIONS ---
    const leadImageMap = {
        'Megha Chhaparia': 'meghachhaparia.jpg',
        'Mohit Aditya': 'mohitaditya.jpg',
        'Aparna Jayant': 'ajayant.jpg',
        'Vinayak Shenoy K': 'vinayaks.jpg',
        'Divya Nayak': 'divyanayak.jpg',
    };
    const nameToFilename = (name) => leadImageMap[name] || name.toLowerCase().replace(/ /g, '-').replace(/\./g, '') + '.jpg';
    const nameToInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    // --- TIMELINE ORG CHART ---
    function renderOrgChart() {
        const teamData = {
            name: 'Megha Chhaparia', title: 'AML LOB Lead', image: 'meghachhaparia.jpg', color: '#8b5cf6',
            children: [
                { name: 'Aparna Jayant', title: 'AML EMEA DRI', image: 'ajayant.jpg', color: '#ef4444', reports: ['Agnel Levin', 'Aman Husain', 'Nanda Krishnan U Nair', 'Padma Lochan Choudhury', 'Princy Ann', 'Suman S', 'Vasudevan Sundararaj', 'Yusuf Khan'] },
                { name: 'Divya Nayak', title: 'AML EMEA DRI', image: 'divyanayak.jpg', color: '#3b82f6', reports: ['Ashwini H', 'Bindya Cheruvalanda Lava', 'Geetanjali Gudiseva', 'Lokesh Raaju Polamarasetty', 'Monica Manisha Monteiro', 'Shalini T', 'Surbhi Kumari', 'Swaroop S Kaushik', 'Vaishnavi V', 'Vidya t'] },
                { name: 'Mohit Aditya', title: 'AML APAC DRI & Projects Lead', image: 'mohitaditya.jpg', color: '#22c55e', reports: ['Arshanath Sasidharan Nalini', 'Avinav Chel', 'Chaitanya Vaddadi', 'Hemanth Harish G', 'Manish Kumar Sahu', 'Nabanita Mazumdar', 'Nikita Dsouza', 'Swarnim Taj', 'Vineeth R'] },
                { name: 'Vinayak Shenoy K', title: 'AML US DRI', image: 'vinayaks.jpg', color: '#f97316', reports: ['Aanchal Mutreja', 'Aanya Chhabria', 'Aarush Sharma', 'Aditya Mathur', 'Amitha Mathew', 'Angdeep Sharma', 'Arbaaz Khan', 'Ashik Gem', 'Ekansh Lohani', 'Fateh N Ahmed', 'Gaurav Kumar', 'Gyanesh Chaudhary', 'Jinkala Thrisha', 'KRUTHIKA RAMASWAMY', 'Khushi Khandelwal', 'M Tikendra Singha', 'Mehul Shah', 'Nagaruru Nithya Sai Rachana', 'Nandini Karwa', 'Nikita Kanjilal', 'Nisha Shetty', 'Nitin Vashisth', 'Pallav Makil', 'Pradyumn Gupta', 'Puneeth Balaji T', 'Rebecca Siangshai', 'Sabhya Punjabi', 'Sanchit Maitra', 'Sanjana Kadlaskar', 'Sharib Shams', 'Shashi Mehta', 'Shreeja Dutta', 'Shwetabh Trivedi', 'Sindhu Sampathkumar', 'Sneha Agarwal', 'Srijoni Dasgupta', 'Sriparna Guha Roy', 'Sriram Chandrasekaran', 'Srishti Bhandary', 'Suhasini Satapathy', 'Vibhav Prakash', 'Vignesh R'] }
            ]
        };

        // Creative bios for tooltips
        const leadBios = {
            'Megha Chhaparia': `
                <span class="lead-title">The Visionary Architect</span>
                <span class="lead-highlight">15+ years</span> of orchestrating global teams in investment banking and fintech.<br>
                <span class="lead-highlight">Expertise:</span> AML, KYC, regulatory wizardry, and process transformation.<br>
                <span class="lead-quote">“Turning complexity into clarity, and teams into families.”</span>
                <span class="lead-funfact">Fun fact: Loves automating away the boring stuff!</span>
            `,
            'Mohit Aditya': `
                <span class="lead-title">The Compliance Maestro</span>
                <span class="lead-highlight">Banking & FinCrime Pro</span> with a knack for <span class="lead-highlight">KYC, AML, CTF</span> and team magic.<br>
                <span class="lead-highlight">Engineer at heart</span> (B.E., BVBCET, Hubli) who brings precision and passion to every project.<br>
                <span class="lead-quote">“Building trust, one transaction at a time.”</span>
                <span class="lead-funfact">Fun fact: Can explain compliance in three languages!</span>
            `,
            'Aparna Jayant': `
                <span class="lead-title">The Risk Sleuth</span>
                <span class="lead-highlight">14+ years</span> in the trenches of AML consulting and financial crime compliance.<br>
                <span class="lead-highlight">Specialties:</span> Transaction review, KYC, CDD, SARs, and quality control.<br>
                <span class="lead-quote">“Every risk tells a story—let’s read between the lines.”</span>
                <span class="lead-funfact">Fun fact: Has a sixth sense for spotting fraud before it happens!</span>
            `,
            'Vinayak Shenoy K': `
                <span class="lead-title">The Operations Dynamo</span>
                <span class="lead-highlight">FinCrimes Manager</span> with a legacy at Amazon and a passion for <span class="lead-highlight">AML, KYC, CDD</span>.<br>
                <span class="lead-highlight">Strengths:</span> Mentoring, analytics, and root cause sleuthing.<br>
                <span class="lead-quote">“Results matter, but integrity matters more.”</span>
                <span class="lead-funfact">Fun fact: Can solve a Rubik’s cube faster than you can say ‘compliance’!</span>
            `,
            'Divya Nayak': `
                <span class="lead-title">The Credit Risk Connoisseur</span>
                <span class="lead-highlight">Expert in Global Fraud Risk Standards</span> and a champion at resolving queued transactions within SLAs to reduce potential revenue losses.<br>
                <span class="lead-highlight">System Improver:</span> Always identifying new ways to prevent fraud and boost efficiency.<br>
                <span class="lead-quote">“Every transaction is a puzzle—let’s solve it smartly!”</span>
                <span class="lead-funfact">Fun fact: Can spot a risky transaction from a mile away!</span>
            `
        };

        // Helper to check if this is a lead with an expandable bio
        function isLeadWithExpand(name) {
            return [
                'Megha Chhaparia',
                'Mohit Aditya',
                'Aparna Jayant',
                'Vinayak Shenoy K',
                'Divya Nayak'
            ].includes(name);
        }

        const container = document.getElementById('org-chart-container');
        if (!container) return;

        container.innerHTML = `<div class="timeline-org-chart"></div>`;
        const chart = container.querySelector('.timeline-org-chart');

        const lead = teamData;
        const leadColor = lead.color || '#6b7280';
        const leadProfileLink = `/profiles/${lead.name.toLowerCase().replace(/ /g, '-')}`;
        // Render org chart as normal, no special classes for Megha
        chart.innerHTML = `
            <div class="timeline-lead">
                <div class="node-card" style="border-color: ${leadColor}; cursor: pointer;">
                    <img src="images/${lead.image || nameToFilename(lead.name)}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/${leadColor.substring(1)}/ffffff?text=${nameToInitials(lead.name)}';">
                    <div class="name">${lead.name}</div>
                    <div class="title" style="color: ${leadColor};">${lead.title}</div>
                </div>
            </div>`;
        
        const timelineBody = document.createElement('div');
        timelineBody.className = 'timeline-body';
        chart.appendChild(timelineBody);
        
        teamData.children.forEach((manager, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const item = document.createElement('div');
            item.className = `org-timeline-item ${side}`;
            item.style.setProperty('--item-color', manager.color);
            
            const managerColor = manager.color || '#6b7280';
            let reportsHtml = '';
            if (manager.reports && manager.reports.length > 0) {
                reportsHtml = '<ul class="reports-list">';
                manager.reports.forEach(reportName => {
                    const reportProfileLink = `/profiles/${reportName.toLowerCase().replace(/ /g, '-')}`;
                    const reportImage = nameToFilename(reportName);
                    const reportInitials = nameToInitials(reportName);
                    reportsHtml += `
                        <li>
                            <a href="${reportProfileLink}" target="_blank" class="report-item-link">
                                <img src="images/${reportImage}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/e0e0e0/333?text=${reportInitials}';">
                                <span>${reportName}</span>
                            </a>
                        </li>`;
                });
                reportsHtml += '</ul>';
            }
            const managerProfileLink = `/profiles/${manager.name.toLowerCase().replace(/ /g, '-')}`;
            let cardHtml = `
                <div class="node-card" data-has-reports="${!!reportsHtml}" style="border-color: ${managerColor};">
                    <img src="images/${manager.image || nameToFilename(manager.name)}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/${managerColor.substring(1)}/ffffff?text=${nameToInitials(manager.name)}';">
                    <div class="name">${manager.name}</div>
                    <div class="title" style="color: ${managerColor};">${manager.title}</div>
                    ${reportsHtml}
                </div>`;
            item.innerHTML = cardHtml;
            timelineBody.appendChild(item);
        });
        // Restore expand/collapse logic for direct reports
        chart.querySelectorAll('.node-card[data-has-reports="true"]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.report-item-link')) return;
                const orgItem = card.closest('.org-timeline-item');
                if (!orgItem) return;
                // Collapse all others
                chart.querySelectorAll('.org-timeline-item.expanded').forEach(item => {
                    if (item !== orgItem) item.classList.remove('expanded');
                });
                orgItem.classList.toggle('expanded');
            });
        });

        // Render creative bios for all leads in a new section below the org chart
        let biosSection = document.getElementById('lead-bios-section');
        if (!biosSection) {
            biosSection = document.createElement('section');
            biosSection.id = 'lead-bios-section';
            biosSection.className = 'lead-bios-section';
            chart.parentElement.appendChild(biosSection);
        }
        biosSection.innerHTML = `
            <div class="lead-bios-bg-anim">
                <svg viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="100" r="18" fill="#635bff"/>
                    <circle cx="1000" cy="80" r="10" fill="#ff3f81"/>
                    <circle cx="600" cy="350" r="14" fill="#ffe066"/>
                    <circle cx="400" cy="300" r="8" fill="#635bff"/>
                    <circle cx="900" cy="320" r="12" fill="#ff3f81"/>
                    <circle cx="300" cy="200" r="7" fill="#b4baff"/>
                    <circle cx="1100" cy="200" r="9" fill="#635bff"/>
                </svg>
            </div>
            <h2 class="lead-bios-title"><span class="animated-icon"><i class="fas fa-users"></i></span>Meet Our Leadership</h2>
            <div class="lead-bios-cards">
                ${[
                    {name:'Megha Chhaparia', icon:'fa-shield-halved'},
                    {name:'Mohit Aditya', icon:'fa-user-tie'},
                    {name:'Aparna Jayant', icon:'fa-search-dollar'},
                    {name:'Vinayak Shenoy K', icon:'fa-cubes'},
                    {name:'Divya Nayak', icon:'fa-bolt'}
                ].map(({name,icon}) => `
                    <div class="lead-bio-card">
                        <span class="bio-animated-icon"><i class="fas ${icon}"></i></span>
                        <img src="images/${nameToFilename(name)}" class="lead-bio-avatar" alt="${name}">
                        <div class="lead-bio-content">${leadBios[name]}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Parallax effect for vertical bio cards (with rotation and scale)
        function parallaxBios() {
            const cards = document.querySelectorAll('.lead-bio-card');
            const section = document.getElementById('lead-bios-section');
            if (!cards.length || !section) return;
            const sectionRect = section.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            cards.forEach((card, i) => {
                // Each card moves at a slightly different speed and rotates/scales
                const speed = 0.12 + i * 0.07;
                const offset = (sectionRect.top + scrollY - window.innerHeight/2 + card.offsetTop) * speed;
                const rot = Math.sin((scrollY + card.offsetTop) / 200) * 3 * (i % 2 === 0 ? 1 : -1);
                const scale = 1 + Math.cos((scrollY + card.offsetTop) / 300) * 0.015;
                card.style.transform = `translateY(${offset}px) scale(${scale}) rotate(${rot}deg)`;
            });
        }
        function onParallaxScroll() {
            requestAnimationFrame(parallaxBios);
        }
        window.addEventListener('scroll', onParallaxScroll);
        window.addEventListener('resize', onParallaxScroll);
        setTimeout(parallaxBios, 200);

        // Fade-in-up animation for cards as they enter viewport
        const observer = new window.IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.lead-bio-card').forEach(card => observer.observe(card));
    }

    // --- HOME PAGE ACCORDION ---
    function renderHomeAccordion() { /* ... content from previous versions ... */ }

    // --- RESOURCES PAGE CONTENT (TABBED WITH FLOWCHARTS) ---
    function renderResourcesContent() {
        const container = document.getElementById('resources-content');
        if (!container) return;

        // Tab headers
        container.innerHTML = `
      <div class="resources-tabs flex justify-center gap-4 mb-10">
        <button class="resources-tab active" data-tab="flowcharts"><i class="fas fa-project-diagram mr-2"></i>What is AML?</button>
        <button class="resources-tab" data-tab="reference"><i class="fas fa-book mr-2"></i>AML Referrals</button>
      </div>
      <div class="resources-tab-panels relative">
        <div id="resources-tab-flowcharts" class="resources-tab-panel"></div>
        <div id="resources-tab-reference" class="resources-tab-panel hidden"></div>
      </div>
    `;

        // Render both panels (only one visible)
        renderResourcesFlowcharts();
        renderResourcesReference();

        // Tab switching logic
        const tabBtns = container.querySelectorAll('.resources-tab');
        const panels = container.querySelectorAll('.resources-tab-panel');
        tabBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            panels.forEach(panel => panel.classList.add('hidden'));
            container.querySelector(`#resources-tab-${btn.dataset.tab}`).classList.remove('hidden');
          });
        });
    }

    // --- INTERACTIVE FLOWCHARTS TAB ---
    function renderResourcesFlowcharts() {
  const panel = document.getElementById('resources-tab-flowcharts');
  if (!panel) return;
  panel.innerHTML = `
    <section class="floating-section fade-in mb-16">
      <div class="floating-info-node">
        <h2 class="floating-title gradient-text mb-2"><i class="fas fa-question-circle mr-2"></i>What is Money Laundering?</h2>
        <p class="floating-desc">Money laundering is the process of making illegally-gained proceeds ("dirty money") appear legal ("clean"). It involves disguising the origins of money obtained from crimes so it can be used freely in the legitimate economy. <span class="gradient-text">Criminals use money laundering to hide their tracks and enjoy their profits without detection.</span></p>
      </div>
    </section>
    <section class="floating-section fade-in">
      <div class="accordion" id="aml-accordion">
        <!-- Stages Section -->
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="true">
            <span class="accordion-title"><i class="fas fa-project-diagram mr-2"></i>The Three Stages of Money Laundering</span>
            <span class="accordion-icon">&#9660;</span>
          </button>
          <div class="accordion-panel" style="display:block;">
            <div class="flowchart-cards flex flex-col md:flex-row justify-around items-center space-y-8 md:space-y-0 md:space-x-4">
              <!-- Placement Card -->
              <div class="flowchart-card mode-glass text-center p-6 rounded-xl shadow-lg w-full md:w-1/3">
                <div class="icon-container stage1-bg rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"><i class="fas fa-coins fa-2x"></i></div>
                <h3 class="text-xl font-semibold mb-2 stage1-text">1. Placement</h3>
                <p class="text-gray-600">Introducing "dirty money" into the financial system.</p>
                <div class="text-left mt-4 text-sm text-gray-500"><p class="font-semibold">Examples:</p><ul class="list-disc list-inside"><li>Blending funds with a legitimate cash-intensive business.</li><li>Structuring cash deposits to evade reporting.</li><li>Currency smuggling.</li></ul></div>
              </div>
              <div class="arrow stage1-arrow hidden md:block"><i class="fas fa-arrow-right fa-2x"></i></div>
              <!-- Layering Card -->
              <div class="flowchart-card mode-glass text-center p-6 rounded-xl shadow-lg w-full md:w-1/3">
                <div class="icon-container stage2-bg rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"><i class="fas fa-random fa-2x"></i></div>
                <h3 class="text-xl font-semibold mb-2 stage2-text">2. Layering</h3>
                <p class="text-gray-600">Concealing the source of the money through complex transactions.</p>
                <div class="text-left mt-4 text-sm text-gray-500"><p class="font-semibold">Examples:</p><ul class="list-disc list-inside"><li>Moving funds electronically between countries.</li><li>Investing in stocks, bonds, or real estate.</li><li>Using shell companies to obscure owners.</li></ul></div>
              </div>
              <div class="arrow stage2-arrow hidden md:block"><i class="fas fa-arrow-right fa-2x"></i></div>
              <!-- Integration Card -->
              <div class="flowchart-card mode-glass text-center p-6 rounded-xl shadow-lg w-full md:w-1/3">
                <div class="icon-container stage3-bg rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"><i class="fas fa-university fa-2x"></i></div>
                <h3 class="text-xl font-semibold mb-2 stage3-text">3. Integration</h3>
                <p class="text-gray-600">Making the "cleaned" money appear legitimate.</p>
                <div class="text-left mt-4 text-sm text-gray-500"><p class="font-semibold">Examples:</p><ul class="list-disc list-inside"><li>Purchasing luxury assets like property or art.</li><li>Investing in legitimate business ventures.</li><li>Making loans to other companies.</li></ul></div>
              </div>
            </div>
          </div>
        </div>
        <!-- Prevention Section -->
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false">
            <span class="accordion-title"><i class="fas fa-shield-alt mr-2"></i>The AML Prevention Process</span>
            <span class="accordion-icon">&#9660;</span>
          </button>
          <div class="accordion-panel" style="display:none;">
            <div class="flowchart-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div class="flowchart-card mode-glass flex flex-col items-center text-center p-6 rounded-xl shadow-lg">
                <div class="icon-container bg-gradient-to-br from-red-200 to-red-300 rounded-full w-20 h-20 flex items-center justify-center mb-4"><i class="fas fa-search fa-lg text-red-700"></i></div>
                <h3 class="text-lg font-semibold text-red-800">Risk Assessment</h3>
                <p class="text-gray-600 text-sm mt-2">Identify and assess ML/TF risks to apply a risk-based approach.</p>
              </div>
              <div class="flowchart-card mode-glass flex flex-col items-center text-center p-6 rounded-xl shadow-lg">
                <div class="icon-container bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full w-20 h-20 flex items-center justify-center mb-4"><i class="fas fa-id-card fa-lg text-yellow-700"></i></div>
                <h3 class="text-lg font-semibold text-yellow-800">Customer Due Diligence</h3>
                <p class="text-gray-600 text-sm mt-2">Verify customer identity and understand the nature of the relationship.</p>
              </div>
              <div class="flowchart-card mode-glass flex flex-col items-center text-center p-6 rounded-xl shadow-lg">
                <div class="icon-container bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full w-20 h-20 flex items-center justify-center mb-4"><i class="fas fa-chart-line fa-lg text-indigo-700"></i></div>
                <h3 class="text-lg font-semibold text-indigo-800">Transaction Monitoring</h3>
                <p class="text-gray-600 text-sm mt-2">Continuously monitor for unusual or inconsistent activity.</p>
              </div>
              <div class="flowchart-card mode-glass flex flex-col items-center text-center p-6 rounded-xl shadow-lg">
                <div class="icon-container bg-gradient-to-br from-pink-200 to-pink-300 rounded-full w-20 h-20 flex items-center justify-center mb-4"><i class="fas fa-flag fa-lg text-pink-700"></i></div>
                <h3 class="text-lg font-semibold text-pink-800">Suspicious Activity Reporting</h3>
                <p class="text-gray-600 text-sm mt-2">Investigate and report suspicious transactions to the FIU.</p>
              </div>
              <div class="flowchart-card mode-glass flex flex-col items-center text-center p-6 rounded-xl shadow-lg">
                <div class="icon-container bg-gradient-to-br from-teal-200 to-teal-300 rounded-full w-20 h-20 flex items-center justify-center mb-4"><i class="fas fa-users fa-lg text-teal-700"></i></div>
                <h3 class="text-lg font-semibold text-teal-800">Investigation & Cooperation</h3>
                <p class="text-gray-600 text-sm mt-2">Authorities investigate and cooperate internationally.</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Controls Section -->
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false">
            <span class="accordion-title"><i class="fas fa-cogs mr-2"></i>Key Prevention Controls</span>
            <span class="accordion-icon">&#9660;</span>
          </button>
          <div class="accordion-panel" style="display:none;">
            <div class="flowchart-card mode-glass bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
              <h3 class="text-2xl font-semibold mb-4 text-gray-800">The Pillars of an Effective AML Program</h3>
              <p class="text-gray-600 mb-6">A robust AML program is built on several key pillars. Click each one to learn more.</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="modal-trigger p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-modal-title="Internal Policies, Procedures & Controls" data-modal-content="A system of written policies that set the tone from the top, detailed procedures for employees, and controls to ensure the program functions as intended. This forms the blueprint for the entire AML program, outlining how the institution meets its regulatory obligations and manages risk."><h4 class="font-semibold text-gray-700">1. Internal Policies, Procedures & Controls</h4></div>
                <div class="modal-trigger p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-modal-title="Designated Compliance Officer" data-modal-content="A qualified individual, with sufficient authority and independence, responsible for managing and overseeing the day-to-day operation of the AML/CFT program. They are the central point of contact for AML matters."><h4 class="font-semibold text-gray-700">2. Designated Compliance Officer</h4></div>
                <div class="modal-trigger p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-modal-title="Ongoing Employee Training" data-modal-content="A comprehensive training program to educate all relevant employees on AML laws, their specific responsibilities, and how to identify and report potential red flags. Training should be tailored to roles and repeated periodically."><h4 class="font-semibold text-gray-700">3. Ongoing Employee Training</h4></div>
                <div class="modal-trigger p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-modal-title="Independent Audit Function" data-modal-content="Regular, independent testing of the AML program by internal audit or a qualified external party. This audit assesses the program's overall effectiveness and its compliance with regulations, ensuring that any deficiencies are identified and corrected."><h4 class="font-semibold text-gray-700">4. Independent Audit Function</h4></div>
                <div class="modal-trigger md:col-span-2 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-modal-title="Customer Due Diligence (CDD)" data-modal-content="A risk-based process for conducting ongoing due diligence to truly know your customers. This includes understanding their risk profile, monitoring for changes, and keeping their information up-to-date to detect suspicious activity effectively."><h4 class="font-semibold text-gray-700">5. Customer Due Diligence (CDD)</h4></div>
              </div>
            </div>
          </div>
        </div>
        <!-- Consequences Section -->
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false">
            <span class="accordion-title"><i class="fas fa-balance-scale mr-2"></i>Why AML Matters: The Consequences</span>
            <span class="accordion-icon">&#9660;</span>
          </button>
          <div class="accordion-panel" style="display:none;">
            <div class="flowchart-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div class="flowchart-card bg-white p-6 rounded-xl shadow-lg"><h3 class="font-semibold text-lg mb-2 text-gray-800">Economic Damage</h3><p class="text-gray-600 text-sm">Undermines legitimate businesses, distorts competition, and can lead to economic instability and loss of tax revenue.</p></div>
              <div class="flowchart-card bg-white p-6 rounded-xl shadow-lg"><h3 class="font-semibold text-lg mb-2 text-gray-800">Weakened Institutions</h3><p class="text-gray-600 text-sm">Erodes the integrity of financial institutions, leading to reputational damage, loss of trust, and significant legal penalties.</p></div>
              <div class="flowchart-card bg-white p-6 rounded-xl shadow-lg"><h3 class="font-semibold text-lg mb-2 text-gray-800">Increased Crime</h3><p class="text-gray-600 text-sm">Successful laundering makes crime profitable, encouraging more criminal activity, corruption, and bribery of public officials.</p></div>
              <div class="flowchart-card bg-white p-6 rounded-xl shadow-lg"><h3 class="font-semibold text-lg mb-2 text-gray-800">Social Costs</h3><p class="text-gray-600 text-sm">Enables criminal organizations to expand, increasing the societal costs of crime and law enforcement.</p></div>
            </div>
          </div>
        </div>
        <!-- Distinctions Section -->
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false">
            <span class="accordion-title"><i class="fas fa-exchange-alt mr-2"></i>Key Distinctions</span>
            <span class="accordion-icon">&#9660;</span>
          </button>
          <div class="accordion-panel" style="display:none;">
            <div class="flowchart-cards max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-2xl font-semibold mb-3 text-gray-800">Money Laundering</h3>
                <p class="text-gray-600"><strong class="text-gray-700">Primary Motivation:</strong> To disguise the illegal origin of funds.</p>
                <p class="text-gray-600"><strong class="text-gray-700">Source of Funds:</strong> Always from criminal activity (e.g., drug trafficking, fraud).</p>
                <p class="text-gray-600"><strong class="text-gray-700">Process:</strong> A cycle (Placement, Layering, Integration) to make dirty money look clean.</p>
              </div>
              <div>
                <h3 class="text-2xl font-semibold mb-3 text-gray-800">Terrorist Financing</h3>
                <p class="text-gray-600"><strong class="text-gray-700">Primary Motivation:</strong> To hide the ultimate, illegal purpose of the funds.</p>
                <p class="text-gray-600"><strong class="text-gray-700">Source of Funds:</strong> Can be from legitimate sources (e.g., donations) as well as criminal activities.</p>
                <p class="text-gray-600"><strong class="text-gray-700">Process:</strong> A linear path to collect and move funds to support terrorist acts.</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Global Bodies Section -->
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false">
            <span class="accordion-title"><i class="fas fa-globe mr-2"></i>The Global Effort</span>
            <span class="accordion-icon">&#9660;</span>
          </button>
          <div class="accordion-panel" style="display:none;">
            <div class="flowchart-cards grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div class="flowchart-card bg-white p-6 rounded-xl shadow-lg text-center"><h3 class="font-semibold text-xl mb-2">FATF</h3><p class="text-gray-600 text-sm">The Financial Action Task Force is an inter-governmental body that sets international standards (the 40 Recommendations) to combat money laundering and terrorist financing.</p></div>
              <div class="flowchart-card bg-white p-6 rounded-xl shadow-lg text-center"><h3 class="font-semibold text-xl mb-2">Wolfsberg Group</h3><p class="text-gray-600 text-sm">An association of thirteen global banks that develops financial industry standards and guidance for managing financial crime risks.</p></div>
              <div class="flowchart-card bg-white p-6 rounded-xl shadow-lg text-center"><h3 class="font-semibold text-xl mb-2">Egmont Group</h3><p class="text-gray-600 text-sm">A forum for Financial Intelligence Units (FIUs) from around the world to improve cooperation and information sharing in the fight against financial crime.</p></div>
            </div>
          </div>
        </div>
        <!-- Red Flags Section -->
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false">
            <span class="accordion-title"><i class="fas fa-flag-checkered mr-2"></i>Spotting the Signs: Common Red Flags</span>
            <span class="accordion-icon">&#9660;</span>
          </button>
          <div class="accordion-panel" style="display:none;">
            <div class="flowchart-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div class="flowchart-card flip-card h-48 cursor-pointer">
                <div class="flip-card-inner">
                  <div class="flip-card-front bg-white shadow-lg flex flex-col justify-center items-center h-full"><h3 class="text-lg font-semibold text-gray-700">Unusual Behavior</h3><p class="text-sm text-gray-500 mt-2">(Click to reveal)</p></div>
                  <div class="flip-card-back bg-red-100 text-red-800 shadow-lg flex flex-col justify-center items-center h-full"><p class="text-sm">Customer is nervous, secretive, or reluctant to provide information. Threatens staff or tries to avoid reporting requirements.</p></div>
                </div>
              </div>
              <div class="flowchart-card flip-card h-48 cursor-pointer">
                <div class="flip-card-inner">
                  <div class="flip-card-front bg-white shadow-lg flex flex-col justify-center items-center h-full"><h3 class="text-lg font-semibold text-gray-700">Atypical Transactions</h3><p class="text-sm text-gray-500 mt-2">(Click to reveal)</p></div>
                  <div class="flip-card-back bg-yellow-100 text-yellow-800 shadow-lg flex flex-col justify-center items-center h-full"><p class="text-sm">Activity inconsistent with the customer's known business or profile, like a local charity making large international wire transfers.</p></div>
                </div>
              </div>
              <div class="flowchart-card flip-card h-48 cursor-pointer">
                <div class="flip-card-inner">
                  <div class="flip-card-front bg-white shadow-lg flex flex-col justify-center items-center h-full"><h3 class="text-lg font-semibold text-gray-700">Structuring</h3><p class="text-sm text-gray-500 mt-2">(Click to reveal)</p></div>
                  <div class="flip-card-back bg-indigo-100 text-indigo-800 shadow-lg flex flex-col justify-center items-center h-full"><p class="text-sm">Making multiple cash deposits or withdrawals in amounts just below the reporting threshold to avoid scrutiny.</p></div>
                </div>
              </div>
              <div class="flowchart-card flip-card h-48 cursor-pointer">
                <div class="flip-card-inner">
                  <div class="flip-card-front bg-white shadow-lg flex flex-col justify-center items-center h-full"><h3 class="text-lg font-semibold text-gray-700">Use of Shell Companies</h3><p class="text-sm text-gray-500 mt-2">(Click to reveal)</p></div>
                  <div class="flip-card-back bg-green-100 text-green-800 shadow-lg flex flex-col justify-center items-center h-full"><p class="text-sm">Transactions involving complex legal structures or shell companies with no clear business purpose, especially in high-risk jurisdictions.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  // Accordion logic
  const accordion = panel.querySelector('#aml-accordion');
  if (accordion) {
    accordion.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        accordion.querySelectorAll('.accordion-header').forEach(h => h.setAttribute('aria-expanded', 'false'));
        accordion.querySelectorAll('.accordion-panel').forEach(p => p.style.display = 'none');
        if (!expanded) {
          this.setAttribute('aria-expanded', 'true');
          this.nextElementSibling.style.display = 'block';
        }
      });
    });
    // Modal logic for Controls section
    let modal = document.getElementById('modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content">
          <h3 id="modal-title" class="text-2xl font-bold mb-4 text-gray-800"></h3>
          <p id="modal-content" class="text-gray-600"></p>
          <button id="modal-close" class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Close</button>
        </div>
      `;
      document.body.appendChild(modal);
    }
    const modalTitle = modal.querySelector('#modal-title');
    const modalContent = modal.querySelector('#modal-content');
    const modalClose = modal.querySelector('#modal-close');
    accordion.querySelectorAll('.modal-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        modalTitle.textContent = trigger.dataset.modalTitle;
        modalContent.textContent = trigger.dataset.modalContent;
        modal.classList.add('active');
      });
    });
    const closeModal = () => { modal.classList.remove('active'); };
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    // Flip card logic for Red Flags
    accordion.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('flipped');
      });
    });
  }
}

// --- REFERENCE CONTENT TAB (EXISTING ACCORDION) ---
function renderResourcesReference() {
  const panel = document.getElementById('resources-tab-reference');
  if (!panel) return;
  // Move the existing accordion and info content here
  panel.innerHTML = `
    <div class="bg-white p-8 rounded-lg shadow-md">
      <p class="text-gray-600 leading-relaxed text-lg text-center">
        
      </p>
    </div>
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h3 class="text-2xl font-bold mb-6 text-gray-800 text-center">AML Referrals Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="border-2 border-green-200 bg-green-50 p-6 rounded-lg">
          <h4 class="font-bold text-lg text-green-700 mb-3 flex items-center"><i class="fas fa-check-circle mr-2"></i>What to Do</h4>
          <ul class="list-disc list-inside space-y-3 text-green-800">
            <li>Submit an AML referral to the team at <a href="#" class="font-semibold underline">go/aml-referral</a>.</li>
            <li>Follow guidance on <a href="#" class="font-semibold underline">go/unusual-activity</a>.</li>
            <li>Ask for the team’s input via <a href="#" class="font-semibold underline">go/ask/financial-crimes</a>.</li>
            <li>If you’re not sure, it’s always worth an ask!</li>
          </ul>
        </div>
        <div class="border-2 border-red-200 bg-red-50 p-6 rounded-lg">
          <h4 class="font-bold text-lg text-red-700 mb-3 flex items-center"><i class="fas fa-times-circle mr-2"></i>What Not to Do</h4>
          <ul class="list-disc list-inside space-y-3 text-red-800">
            <li>Tell a user about Stripe Financial Crimes concerns (tipping off).</li>
            <li>Fail to share any concerns you have with our team.</li>
            <li>Help users get around our controls.</li>
            <li>Offer legal or compliance advice to users.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="border-l-4 border-yellow-500 bg-yellow-50 p-6 rounded-r-lg shadow">
      <h4 class="font-bold text-lg text-yellow-800 mb-3 flex items-center"><i class="fas fa-exclamation-triangle mr-2"></i>Important Note on "Tipping Off"</h4>
      <p class="text-yellow-900 mb-4">Disclosing sensitive information could lead to serious civil or criminal penalties. AML teams cannot share investigation outcomes. For help with user-facing language, please contact the AML team.</p>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg">
          <thead class="bg-yellow-100">
            <tr>
              <th class="text-left py-2 px-4 font-semibold text-yellow-900">Country</th>
              <th class="text-left py-2 px-4 font-semibold text-yellow-900">Potential Fine</th>
              <th class="text-left py-2 px-4 font-semibold text-yellow-900">Imprisonment</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr><td class="border-t py-2 px-4">US</td><td class="border-t py-2 px-4">Up to $100k (civil); $250k (criminal)</td><td class="border-t py-2 px-4">Up to 5 years</td></tr>
            <tr><td class="border-t py-2 px-4">UK</td><td class="border-t py-2 px-4">Unlimited</td><td class="border-t py-2 px-4">Up to 5 years</td></tr>
            <tr><td class="border-t py-2 px-4">Ireland</td><td class="border-t py-2 px-4">Up to €5k</td><td class="border-t py-2 px-4">Up to 5 years</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="resources-accordion-container" class="space-y-4"></div>
  `;
  // Re-render the accordion in the new panel
  const accordionData = [
    {
      title: 'Guide to Creating an AML Referral',
      icon: 'fa-file-alt',
      content: `<p class="mb-4 text-gray-600">This section explains how Stripes can raise concerns about accounts with the Global AML teams. Referrals will be directed to the regional teams where accounts are opened. If you’re not sure, always ask.</p>
          <ol class="list-decimal list-inside space-y-6">
            <li><h5 class="font-semibold text-gray-800 inline">Navigate and Submit</h5><p class="pl-6 text-gray-600">Go to <a href="#" class="text-indigo-600 font-medium hover:underline">go/aml-referral</a>, select "AML", and input the merchant token and supporting information. This creates a referral under the <code>anti_money_laundering</code> review type in the AML team’s queue.</p></li>
            <li><h5 class="font-semibold text-gray-800 inline">Draft Your Referral</h5><ul class="list-disc list-inside space-y-2 mt-2 pl-6 text-gray-600"><li>Include the **Merchant token**.</li><li>Describe **why** you are concerned with the specific account.</li><li>Include any related links or associated Stripe accounts.</li><li>Avoid describing things as "suspicious"; use "unusual" instead.</li></ul></li>
            <li><h5 class="font-semibold text-gray-800 inline">What Happens Next?</h5><p class="pl-6 text-gray-600">Financial Crimes reviews the information within 1 business day. If the activity looks unusual, a case is opened, which could result in a Suspicious Activity Report (SAR). If not, we note our findings and clear the alert. No further action is required from you.</p></li>
          </ol>`
    },
    {
      title: 'Understanding Unusual Activity',
      icon: 'fa-search',
      content: `<p class="mb-4 text-gray-600">Unusual activity can be conducted by any party in the Stripe ecosystem. Here is a non-exhaustive list of signals:</p>
          <div class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-lg border"><h6 class="font-semibold text-gray-700">Discrepancy in Business Purpose</h6><ul class="list-disc list-inside text-gray-600 mt-2 pl-2"><li>Mismatch between stated business and actual transaction activity.</li><li>Activity is not normal for the industry.</li><li>User in one country logs in exclusively from high-risk jurisdictions.</li></ul></div>
            <div class="p-4 bg-gray-50 rounded-lg border"><h6 class="font-semibold text-gray-700">Unusual Merchant/Rep Actions</h6><ul class="list-disc list-inside text-gray-600 mt-2 pl-2"><li>Supporting documentation seems off.</li><li>Merchant rep is on a blacklist.</li><li>User refuses to provide info or is aggressive.</li></ul></div>
            <div class="p-4 bg-gray-50 rounded-lg border"><h6 class="font-semibold text-gray-700">Unusual Transaction Patterns</h6><ul class="list-disc list-inside text-gray-600 mt-2 pl-2"><li>Transactions don't make sense for the business location (e.g., UK business with all charges from LATAM).</li><li>Repetitive charges from a single end-user with no clear purpose.</li><li>Excessive transactions (e.g., large ACH Top Ups) unexplained by the business model.</li></ul></div>
            <div class="p-4 bg-gray-50 rounded-lg border"><h6 class="font-semibold text-gray-700">Potentially Illegal Content</h6><ul class="list-disc list-inside text-gray-600 mt-2 pl-2"><li>Website sells items of questionable legality (e.g., weapons, certain drugs, illicit pornography).</li></ul></div>
          </div>`
    },
    {
      title: 'Examples of Great AML Referrals',
      icon: 'fa-star',
      content: `<p class="mb-4 text-gray-600">These paraphrased examples show the kind of detail that is helpful to the AML team.</p>
          <div class="space-y-4">
            <blockquote class="p-4 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800">"Three connected accounts share a bank account. Similar businesses (landscaping), but no info on them via Google. Notes three other potentially relevant accounts: acct_aa; acct_bb; acct_cc."</blockquote>
            <blockquote class="p-4 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800">"All charges have the same BIN and were made using prepaid cards; charge amounts are small but increasing. IPs appear to be supporting VPNs and are associated with illicit payments (mostly fraud)."</blockquote>
          </div>`
    },
    {
      title: 'Frequently Asked Questions (FAQ)',
      icon: 'fa-question-circle',
      content: `<div class="space-y-4">
        <div><h6 class="font-semibold text-gray-700">What if someone else already raised an AML review?</h6><p class="text-gray-600 mt-1 pl-2">We still want to hear from you! You might have additional findings not covered in prior reviews.</p></div>
        <div><h6 class="font-semibold text-gray-700">What if the activity spans several accounts?</h6><p class="text-gray-600 mt-1 pl-2">If they are clearly connected by the Duplicates panel, you only need to raise one review. Note the other account tokens in your referral.</p></div>
        <div><h6 class="font-semibold text-gray-700">Does an AML Review affect the user?</h6><p class="text-gray-600 mt-1 pl-2">No, in most cases. We may reach out for more info or file a SAR, but the user won't know about the SAR. We only reject users where we identify a significant risk.</p></div>
      </div>`
    }
  ];
  const accordionContainer = panel.querySelector('#resources-accordion-container');
  if (accordionContainer) {
    accordionContainer.innerHTML = '';
    accordionData.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'bg-white rounded-lg shadow-sm';
      const buttonEl = document.createElement('button');
      buttonEl.className = 'accordion-button w-full flex justify-between items-center text-left p-5 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg';
      buttonEl.innerHTML = `<span class="flex items-center text-lg"><i class="fas ${item.icon} text-indigo-500 mr-4 w-5 text-center"></i>${item.title}</span><svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
      const contentEl = document.createElement('div');
      contentEl.className = 'accordion-content';
      contentEl.innerHTML = `<div class="p-5 pt-0 text-gray-600">${item.content}</div>`;
      buttonEl.addEventListener('click', () => {
        const content = buttonEl.nextElementSibling;
        buttonEl.querySelector('svg').classList.toggle('rotate-180');
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
      itemEl.appendChild(buttonEl);
      itemEl.appendChild(contentEl);
      accordionContainer.appendChild(itemEl);
    });
  }
}
    
    // --- ROLL OF HONOUR CAROUSEL ---
    function initializeRnrCarousel() { /* ... content from previous versions ... */ }


    // --- PAGE NAVIGATION LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const mobileMenu = document.getElementById('mobile-menu');
    let pageInitialized = {};

    function switchPage(pageId) {
        window.scrollTo(0, 0);
        pageContents.forEach(page => {
            page.classList.toggle('active', page.id === `page-${pageId}`);
            if (page.id === `page-${pageId}`) {
                page.classList.add('fade-in');
                if (pageId === 'home' && !pageInitialized.home) {
                    renderOrgChart();
                    renderHomeAccordion();
                    pageInitialized.home = true;
                }
                if (pageId === 'resources' && !pageInitialized.resources) {
                    renderResourcesContent();
                    pageInitialized.resources = true;
                }
                if (pageId === 'roll-of-honour' && !pageInitialized.rnr) {
                    initializeRnrCarousel();
                    pageInitialized.rnr = true;
                }
            }
        });
        navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === pageId));
        mobileMenu.classList.add('hidden');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });

    const menuBtn = document.getElementById('menu-btn');
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    
    // Re-add the R&R carousel function to ensure it's in scope
    initializeRnrCarousel = function() {
        const carouselItems = document.querySelectorAll('.rnr-carousel-item');
        const prevBtn = document.getElementById('rnr-prevBtn');
        const nextBtn = document.getElementById('rnr-nextBtn');
        if (!carouselItems.length || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        let autoSlideInterval;

        function showItem(index) {
            carouselItems.forEach((item, i) => {
                item.classList.toggle('hidden', i !== index);
            });
        }
        
        function nextItem() {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            showItem(currentIndex);
        }

        function prevItem() {
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            showItem(currentIndex);
        }
        
        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextItem, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        nextBtn.addEventListener('click', () => { nextItem(); startAutoSlide(); });
        prevBtn.addEventListener('click', () => { prevItem(); startAutoSlide(); });
        
        startAutoSlide();
    };

              // Initial page load
    switchPage('home');
    
    // Initialize in the correct order
    setTimeout(() => {
        initVantaEffect(); // Initialize Vanta effect first
        createParticleBackground(); // Then initialize particle background
        initThemeToggle(); // Finally initialize theme toggle
    }, 100); // Small delay to ensure DOM is fully ready
  });

// --- HAMBURGER MENU ANIMATION ---
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const menuOverlay = document.getElementById('menu-overlay');
  const closeMenuBtn = document.getElementById('close-menu');
  const menuLinks = document.querySelectorAll('.menu-link');
  let menuOpen = false;

  function openMenu() {
    menuOverlay.classList.remove('translate-x-full');
    menuOverlay.classList.add('translate-x-0');
    menuOverlay.style.pointerEvents = 'auto';
    menuOverlay.style.backdropFilter = 'blur(8px)';
    // Animate links in
    menuLinks.forEach((link, i) => {
      setTimeout(() => {
        link.classList.remove('opacity-0', 'translate-x-8');
        link.classList.add('opacity-100', 'translate-x-0');
      }, 80 * i);
    });
    menuOpen = true;
    // Animate hamburger to X
    hamburgerBtn.classList.add('open');
    // Focus trap
    menuOverlay.setAttribute('tabindex', '-1');
    menuOverlay.focus();
  }
  function closeMenu() {
    menuOverlay.classList.add('translate-x-full');
    menuOverlay.classList.remove('translate-x-0');
    menuOverlay.style.pointerEvents = 'none';
    menuOverlay.style.backdropFilter = '';
    // Animate links out
    menuLinks.forEach((link, i) => {
      setTimeout(() => {
        link.classList.add('opacity-0', 'translate-x-8');
        link.classList.remove('opacity-100', 'translate-x-0');
      }, 40 * i);
    });
    menuOpen = false;
    hamburgerBtn.classList.remove('open');
  }
  hamburgerBtn.addEventListener('click', openMenu);
  closeMenuBtn.addEventListener('click', closeMenu);
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  // ESC to close
  document.addEventListener('keydown', e => {
    if (menuOpen && (e.key === 'Escape' || e.key === 'Esc')) closeMenu();
  });
  // Accessibility: focus trap
  menuOverlay.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      closeMenuBtn.focus();
    }
  });
});
