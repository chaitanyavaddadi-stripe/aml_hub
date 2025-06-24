document.addEventListener('DOMContentLoaded', function() {
    // --- UTILITY FUNCTIONS ---
    const nameToFilename = (name) => name.toLowerCase().replace(/ /g, '-').replace(/\./g, '') + '.jpg';
    const nameToInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    // --- NEW RADIAL ORG CHART ---
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
            <div id="org-nodes-wrapper"></div>
            <svg id="org-chart-svg"></svg>
            <button id="org-back-button"><i class="fas fa-arrow-left mr-2"></i> Go Back</button>
        `;
        const nodesWrapper = container.querySelector('#org-nodes-wrapper');
        const svg = container.querySelector('#org-chart-svg');
        const backButton = container.querySelector('#org-back-button');

        function renderRadialChart(focusNodeName) {
            const focusNode = hierarchy[focusNodeName];
            nodesWrapper.innerHTML = ''; // Clear existing nodes

            const centerX = container.offsetWidth / 2;
            const centerY = container.offsetHeight / 2;

            // Render Center Node
            const centerNodeEl = createNode(focusNode, 'center');
            centerNodeEl.style.left = `${centerX}px`;
            centerNodeEl.style.top = `${centerY}px`;
            nodesWrapper.appendChild(centerNodeEl);

            // Render Orbiting Children Nodes
            const children = focusNode.children;
            const angleStep = children.length > 0 ? 360 / children.length : 0;
            const radius = Math.min(centerX, centerY) * 0.7;

            children.forEach((child, index) => {
                const angle = angleStep * index - 90; // -90 to start from the top
                const angleRad = angle * (Math.PI / 180);

                const childX = centerX + radius * Math.cos(angleRad);
                const childY = centerY + radius * Math.sin(angleRad);

                const childNodeEl = createNode(child, 'orbit');
                childNodeEl.style.left = `${childX}px`;
                childNodeEl.style.top = `${childY}px`;
                nodesWrapper.appendChild(childNodeEl);
            });
            
            // Draw lines and handle back button after a short delay for CSS transitions
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
            const placeholderColor = color.substring(1);
            nodeEl.style.borderColor = color;

            nodeEl.innerHTML = `
                <img src="images/${person.image || nameToFilename(person.name)}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/${placeholderColor}/ffffff?text=${nameToInitials(person.name)}';">
                <div class="name">${person.name}</div>
                <div class="title" style="color: ${color};">${person.title}</div>
            `;
            
            if (hierarchy[person.name].children.length > 0) {
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

        // Initial Render
        renderRadialChart(teamData.name);
        window.addEventListener('resize', () => renderRadialChart(document.querySelector('.center').dataset.name));
    }


    // --- EXISTING PAGE LOGIC (UNMODIFIED) ---

    function renderHomeAccordion() { /* ... function content ... */ }
    function renderResourcesContent() { /* ... function content ... */ }
    function initializeRnrCarousel() { /* ... function content ... */ }

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
                    renderOrgChart(); // This now renders the new RADIAL chart
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

    switchPage('home');
});
