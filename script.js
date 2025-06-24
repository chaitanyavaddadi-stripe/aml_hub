// --- DATA ---
const nameToFilename = (name) => name.toLowerCase().replace(/ /g, '-').replace(/\./g, '') + '.jpg';
const nameToInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2);

// --- NEW ORG CHART LOGIC ---
function renderOrgChart() {
    const teamData = {
        name: 'Megha Chhaparia',
        title: 'AML LOB Lead',
        image: 'meghachhaparia.jpg',
        children: [
            { name: 'Aparna Jayant', title: 'AML EMEA DRI', image: 'ajayant.jpg', color: '#ef4444', reports: ['Agnel Levin', 'Aman Husain', 'Nanda Krishnan U Nair', 'Padma Lochan Choudhury', 'Princy Ann', 'Suman S', 'Vasudevan Sundararaj', 'Yusuf Khan'] },
            { name: 'Divya Nayak', title: 'AML EMEA DRI', image: 'divyanayak.jpg', color: '#3b82f6', reports: ['Ashwini H', 'Bindya Cheruvalanda Lava', 'Geetanjali Gudiseva', 'Lokesh Raaju Polamarasetty', 'Monica Manisha Monteiro', 'Shalini T', 'Surbhi Kumari', 'Swaroop S Kaushik', 'Vaishnavi V', 'Vidya t'] },
            { name: 'Mohit Aditya', title: 'AML APAC DRI & Projects Lead', image: 'mohitaditya.jpg', color: '#22c55e', reports: ['Arshanath Sasidharan Nalini', 'Avinav Chel', 'Chaitanya Vaddadi', 'Hemanth Harish G', 'Manish Kumar Sahu', 'Nabanita Mazumdar', 'Nikita Dsouza', 'Swarnim Taj', 'Vineeth R'] },
            { name: 'Vinayak Shenoy K', title: 'AML US DRI', image: 'vinayaks.jpg', color: '#f97316', reports: ['Aanchal Mutreja', 'Aanya Chhabria', 'Aarush Sharma', 'Aditya Mathur', 'Amitha Mathew', 'Angdeep Sharma', 'Arbaaz Khan', 'Ashik Gem', 'Ekansh Lohani', 'Fateh N Ahmed', 'Gaurav Kumar', 'Gyanesh Chaudhary', 'Jinkala Thrisha', 'KRUTHIKA RAMASWAMY', 'Khushi Khandelwal', 'M Tikendra Singha', 'Mehul Shah', 'Nagaruru Nithya Sai Rachana', 'Nandini Karwa', 'Nikita Kanjilal', 'Nisha Shetty', 'Nitin Vashisth', 'Pallav Makil', 'Pradyumn Gupta', 'Puneeth Balaji T', 'Rebecca Siangshai', 'Sabhya Punjabi', 'Sanchit Maitra', 'Sanjana Kadlaskar', 'Sharib Shams', 'Shashi Mehta', 'Shreeja Dutta', 'Shwetabh Trivedi', 'Sindhu Sampathkumar', 'Sneha Agarwal', 'Srijoni Dasgupta', 'Sriparna Guha Roy', 'Sriram Chandrasekaran', 'Srishti Bhandary', 'Suhasini Satapathy', 'Vibhav Prakash', 'Vignesh R'] }
        ]
    };

    const container = document.getElementById('org-chart-container');
    if (!container) return;

    // Clear previous content and add the SVG canvas
    container.innerHTML = `<div class="org-tree"></div><svg id="org-chart-svg"></svg>`;
    const treeContainer = container.querySelector('.org-tree');

    // Recursive function to build the tree structure
    function createNode(person, isRoot = false) {
        const li = document.createElement('li');
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'org-node';
        nodeDiv.id = `node-${person.name.replace(/ /g, '-')}`;
        
        nodeDiv.innerHTML = `
            <img src="images/${person.image}" onerror="this.onerror=null;this.src='https://placehold.co/120x120/${person.color ? person.color.substring(1) : '6366f1'}/ffffff?text=${nameToInitials(person.name)}';">
            <div class="name">${person.name}</div>
            <div class="title">${person.title}</div>
        `;
        
        if (person.color) {
            nodeDiv.style.borderColor = person.color;
        }
        
        li.appendChild(nodeDiv);

        const children = person.children || (person.reports ? person.reports.map(name => ({name, title: 'Analyst'})) : []);

        if (children.length > 0) {
            nodeDiv.classList.add('has-children');
            const subList = document.createElement('ul');
            children.sort((a, b) => a.name.localeCompare(b.name)).forEach(child => {
                // Assign color from parent if it's a direct report
                if (person.color && !child.color) {
                    child.color = person.color;
                }
                subList.appendChild(createNode(child));
            });
            li.appendChild(subList);

            nodeDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                li.classList.toggle('expanded');
                nodeDiv.classList.toggle('expanded');
                // Use a timeout to allow the DOM to update before redrawing
                setTimeout(drawConnections, 50); 
            });
        }
        
        if (isRoot) {
            // Automatically expand the first level
            li.classList.add('expanded');
            nodeDiv.classList.add('expanded');
        }

        return li;
    }

    const rootList = document.createElement('ul');
    rootList.appendChild(createNode(teamData, true));
    treeContainer.appendChild(rootList);

    // Initial draw
    setTimeout(drawConnections, 100);

    // Redraw on window resize
    window.addEventListener('resize', () => {
        // Simple throttle
        if (window.resizeTimeout) clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(drawConnections, 100);
    });
}

function drawConnections() {
    const svg = document.getElementById('org-chart-svg');
    const container = document.getElementById('org-chart-container');
    if (!svg || !container) return;

    svg.innerHTML = ''; // Clear previous lines
    const containerRect = container.getBoundingClientRect();

    const expandedNodes = document.querySelectorAll('.org-tree li.expanded');

    expandedNodes.forEach(parentNode => {
        const parentDiv = parentNode.querySelector(':scope > .org-node');
        const childrenUl = parentNode.querySelector(':scope > ul');
        if (!childrenUl) return;

        const childrenLis = childrenUl.querySelectorAll(':scope > li');
        if (childrenLis.length === 0) return;

        const parentRect = parentDiv.getBoundingClientRect();
        const parentColor = parentDiv.style.borderColor || '#6b7280';
        
        const startX = parentRect.left - containerRect.left + parentRect.width / 2;
        const startY = parentRect.top - containerRect.top + parentRect.height - 2; // -2 to be on the border

        childrenLis.forEach(childLi => {
            const childDiv = childLi.querySelector(':scope > .org-node');
            const childRect = childDiv.getBoundingClientRect();

            const endX = childRect.left - containerRect.left + childRect.width / 2;
            const endY = childRect.top - containerRect.top + 2; // +2 to be on the border

            // Create a curved path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const controlY = startY + (endY - startY) * 0.5; // Midpoint for the curve handle
            const d = `M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`;
            
            path.setAttribute('d', d);
            path.setAttribute('stroke', parentColor);
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            svg.appendChild(path);
        });
    });
}


// --- EXISTING FUNCTIONS (Unchanged from before) ---

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
                renderOrgChart(); // This now renders the new chart
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
menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});


// --- Roll of Honour Carousel ---
function initializeRnrCarousel() {
    const carouselItems = document.querySelectorAll('.rnr-carousel-item');
    const prevBtn = document.getElementById('rnr-prevBtn');
    const nextBtn = document.getElementById('rnr-nextBtn');
    if(!carouselItems.length) return;
    let currentIndex = 0;

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

// Initial render on page load
switchPage('home');
