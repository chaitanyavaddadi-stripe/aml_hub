document.addEventListener('DOMContentLoaded', function() {
    // --- UTILITY FUNCTIONS ---
    const nameToFilename = (name) => name.toLowerCase().replace(/ /g, '-').replace(/\./g, '') + '.jpg';
    const nameToInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    // --- RADIAL ORG CHART ---
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

        const hierarchy = {};
        function buildHierarchy(node, parent = null) {
            const children = node.children || (node.reports ? node.reports.map(name => ({name, title: 'Analyst', color: node.color})) : []);
            hierarchy[node.name] = { ...node, parent, children };
            children.forEach(child => buildHierarchy(child, node.name));
        }
        buildHierarchy(teamData);

        const container = document.getElementById('org-chart-container');
        if (!container) return;

        container.innerHTML = `
            <div id="org-nodes-wrapper">
                <svg id="org-chart-svg"></svg>
                <div id="org-nodes-elements"></div>
                <button id="org-back-button"><i class="fas fa-arrow-left mr-2"></i> Go Back</button>
            </div>
        `;
        const wrapper = container.querySelector('#org-nodes-wrapper');
        const elementsContainer = container.querySelector('#org-nodes-elements');
        const svg = container.querySelector('#org-chart-svg');
        const backButton = container.querySelector('#org-back-button');

        let currentFocus = teamData.name;

        function renderRadialChart(focusNodeName) {
            currentFocus = focusNodeName;
            const focusNode = hierarchy[focusNodeName];
            elementsContainer.innerHTML = ''; 

            const centerX = wrapper.offsetWidth / 2;
            const centerY = wrapper.offsetHeight / 2;
            
            const centerNodeEl = createNode(focusNode, 'center');
            centerNodeEl.style.left = `${centerX}px`;
            centerNodeEl.style.top = `${centerY}px`;
            elementsContainer.appendChild(centerNodeEl);

            const children = focusNode.children;
            const angleStep = children.length > 0 ? 360 / children.length : 0;
            const radius = Math.min(centerX, centerY) * 0.7;

            children.forEach((child, index) => {
                const angle = angleStep * index - 90;
                const angleRad = angle * (Math.PI / 180);
                const childX = centerX + radius * Math.cos(angleRad);
                const childY = centerY + radius * Math.sin(angleRad);
                const childNodeEl = createNode(child, 'orbit');
                childNodeEl.style.left = `${childX}px`;
                childNodeEl.style.top = `${childY}px`;
                elementsContainer.appendChild(childNodeEl);
            });
            
            setTimeout(() => {
                drawLines(focusNode, centerX, centerY, radius);
                if (focusNode.parent) {
                    backButton.classList.add('visible');
                    backButton.onclick = () => renderRadialChart(focusNode.parent);
                } else {
                    backButton.classList.remove('visible');
                }
            }, 50);
        }
        
        function createNode(person, type) {
            const nodeEl = document.createElement('div');
            nodeEl.className = `radial-org-node ${type}`;
            nodeEl.dataset.name = person.name;
            const color = person.color || '#6b7280';
            nodeEl.style.borderColor = color;

            nodeEl.innerHTML = `
                <img src="images/${person.image || nameToFilename(person.name)}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/${color.substring(1)}/ffffff?text=${nameToInitials(person.name)}';">
                <div class="name">${person.name}</div>
                <div class="title" style="color: ${color};">${person.title}</div>
            `;
            
            if (hierarchy[person.name] && hierarchy[person.name].children.length > 0) {
                nodeEl.style.cursor = 'pointer';
                nodeEl.addEventListener('click', () => renderRadialChart(person.name));
            } else {
                nodeEl.style.cursor = 'default';
            }
            return nodeEl;
        }

        function drawLines(focusNode, centerX, centerY, radius) {
            svg.innerHTML = '';
            const children = focusNode.children;
            const angleStep = children.length > 0 ? 360 / children.length : 0;
            children.forEach((child, index) => {
                const angle = angleStep * index - 90;
                const angleRad = angle * (Math.PI / 180);
                const childX = centerX + radius * Math.cos(angleRad);
                const childY = centerY + radius * Math.sin(angleRad);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                line.setAttribute('d', `M ${centerX} ${centerY} L ${childX} ${childY}`);
                line.setAttribute('stroke', child.color || '#cbd5e1');
                line.setAttribute('stroke-width', '2');
                svg.appendChild(line);
            });
        }

        renderRadialChart(currentFocus);
        window.addEventListener('resize', () => renderRadialChart(currentFocus));
    }


    // --- HOME PAGE ACCORDION ---
    function renderHomeAccordion(){
         const accordionData = [
            { title: 'AML Investigations', content: 'This is the core of our operations. Our investigators perform deep-dive analysis on user accounts and transaction patterns to identify and report suspicious activity, working closely with law enforcement and regulatory bodies.' },
            { title: 'Crypto Compliance', content: 'As the world of finance evolves, so do we. This specialized team focuses on the unique risks associated with cryptocurrency transactions, ensuring Stripe remains a safe platform for emerging payment technologies.' },
            { title: 'Projects & Innovation', content: 'This team is focused on the future. They develop and implement new tools, workflows, and strategies to make our detection and prevention capabilities smarter, faster, and more efficient.' }
         ];
         const accordionContainer = document.getElementById('home-accordion');
         if(!accordionContainer) return;
         accordionContainer.innerHTML = '';
         
         accordionData.forEach((item) => {
             const itemEl = document.createElement('div');
             itemEl.className = 'bg-white rounded-lg shadow-sm';
             
             const buttonEl = document.createElement('button');
             buttonEl.className = 'accordion-button w-full flex justify-between items-center text-left p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg';
             buttonEl.innerHTML = `
                <span>${item.title}</span>
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
             `;
             
             const contentEl = document.createElement('div');
             contentEl.className = 'accordion-content';
             contentEl.innerHTML = `<div class="p-4 pt-0 text-gray-600">${item.content}</div>`;
             
             buttonEl.addEventListener('click', () => {
                 const content = buttonEl.nextElementSibling;
                 buttonEl.querySelector('svg').classList.toggle('rotate-180');
                 if(content.style.maxHeight) {
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

    // --- RESOURCES PAGE CONTENT ---
    function renderResourcesContent() {
        const container = document.getElementById('resources-content');
        if (!container) return;

        container.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-md">
                <p class="text-gray-600 leading-relaxed text-lg text-center">
                    As explained on the Global AML home page, Stripe’s Global AML Team works to combat money laundering and terrorist financing. This hub provides explanations of unusual activity, guides for AML referrals, and clarifies what can be shared with users.
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

        const accordionData = [
            { title: 'Guide to Creating an AML Referral', icon: 'fa-file-alt', content: `<p>...omitted for brevity...</p>` },
            { title: 'Understanding Unusual Activity', icon: 'fa-search', content: `<p>...omitted for brevity...</p>`},
            { title: 'Examples of Great AML Referrals', icon: 'fa-star', content: `<p>...omitted for brevity...</p>`},
            { title: 'Frequently Asked Questions (FAQ)', icon: 'fa-question-circle', content: `<p>...omitted for brevity...</p>`}
        ];
        const accordionContainer = document.getElementById('resources-accordion-container');
        if (accordionContainer) {
            accordionData.forEach(item => { /* ... accordion rendering logic ... */ });
        }
    }

    // --- ROLL OF HONOUR CAROUSEL ---
    function initializeRnrCarousel() {
        const carouselItems = document.querySelectorAll('.rnr-carousel-item');
        const prevBtn = document.getElementById('rnr-prevBtn');
        const nextBtn = document.getElementById('rnr-nextBtn');
        if(!carouselItems.length) return;
        let currentIndex = 0;

        function showItem(index) {
            carouselItems.forEach((item, i) => item.classList.toggle('hidden', i !== index));
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
            if (window.rnrCarouselInterval) clearInterval(window.rnrCarouselInterval);
            window.rnrCarouselInterval = setInterval(nextItem, 5000);
        }

        function stopAutoSlide() {
            clearInterval(window.rnrCarouselInterval);
        }

        if (prevBtn) {
            nextBtn.addEventListener('click', () => { nextItem(); stopAutoSlide(); startAutoSlide(); });
            prevBtn.addEventListener('click', () => { prevItem(); stopAutoSlide(); startAutoSlide(); });
        }
        
        startAutoSlide();
    }


    // --- PAGE NAVIGATION LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const mobileMenu = document.getElementById('mobile-menu');
    let pageInitialized = {};

    function switchPage(pageId) {
        window.scrollTo(0, 0);
        
        pageContents.forEach(page => {
            page.classList.toggle('active', page.id === `page-${pageId}`);
            if(page.id === `page-${pageId}`) {
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

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });

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

    // Initial page load
    switchPage('home');
});
