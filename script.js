document.addEventListener('DOMContentLoaded', function() {
    // --- UTILITY FUNCTIONS ---
    const nameToFilename = (name) => name.toLowerCase().replace(/ /g, '-').replace(/\./g, '') + '.jpg';
    const nameToInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    // --- ORG CHART LOGIC ---
    function renderOrgChart() {
        const teamData = {
            name: 'Megha Chhaparia',
            title: 'AML LOB Lead',
            image: 'meghachhaparia.jpg',
            color: '#8b5cf6', // Purple for the lead
            children: [
                { name: 'Aparna Jayant', title: 'AML EMEA DRI', image: 'ajayant.jpg', color: '#ef4444', reports: ['Agnel Levin', 'Aman Husain', 'Nanda Krishnan U Nair', 'Padma Lochan Choudhury', 'Princy Ann', 'Suman S', 'Vasudevan Sundararaj', 'Yusuf Khan'] },
                { name: 'Divya Nayak', title: 'AML EMEA DRI', image: 'divyanayak.jpg', color: '#3b82f6', reports: ['Ashwini H', 'Bindya Cheruvalanda Lava', 'Geetanjali Gudiseva', 'Lokesh Raaju Polamarasetty', 'Monica Manisha Monteiro', 'Shalini T', 'Surbhi Kumari', 'Swaroop S Kaushik', 'Vaishnavi V', 'Vidya t'] },
                { name: 'Mohit Aditya', title: 'AML APAC DRI & Projects Lead', image: 'mohitaditya.jpg', color: '#22c55e', reports: ['Arshanath Sasidharan Nalini', 'Avinav Chel', 'Chaitanya Vaddadi', 'Hemanth Harish G', 'Manish Kumar Sahu', 'Nabanita Mazumdar', 'Nikita Dsouza', 'Swarnim Taj', 'Vineeth R'] },
                { name: 'Vinayak Shenoy K', title: 'AML US DRI', image: 'vinayaks.jpg', color: '#f97316', reports: ['Aanchal Mutreja', 'Aanya Chhabria', 'Aarush Sharma', 'Aditya Mathur', 'Amitha Mathew', 'Angdeep Sharma', 'Arbaaz Khan', 'Ashik Gem', 'Ekansh Lohani', 'Fateh N Ahmed', 'Gaurav Kumar', 'Gyanesh Chaudhary', 'Jinkala Thrisha', 'KRUTHIKA RAMASWAMY', 'Khushi Khandelwal', 'M Tikendra Singha', 'Mehul Shah', 'Nagaruru Nithya Sai Rachana', 'Nandini Karwa', 'Nikita Kanjilal', 'Nisha Shetty', 'Nitin Vashisth', 'Pallav Makil', 'Pradyumn Gupta', 'Puneeth Balaji T', 'Rebecca Siangshai', 'Sabhya Punjabi', 'Sanchit Maitra', 'Sanjana Kadlaskar', 'Sharib Shams', 'Shashi Mehta', 'Shreeja Dutta', 'Shwetabh Trivedi', 'Sindhu Sampathkumar', 'Sneha Agarwal', 'Srijoni Dasgupta', 'Sriparna Guha Roy', 'Sriram Chandrasekaran', 'Srishti Bhandary', 'Suhasini Satapathy', 'Vibhav Prakash', 'Vignesh R'] }
            ]
        };

        const container = document.getElementById('org-chart-container');
        if (!container) return;

        container.innerHTML = `<div class="org-tree"></div><svg id="org-chart-svg"></svg>`;
        const treeContainer = container.querySelector('.org-tree');

        function createNode(person, isRoot = false) {
            const li = document.createElement('li');
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'org-node';
            nodeDiv.id = `node-${person.name.replace(/ /g, '-')}`;
            
            const color = person.color || '#6b7280';
            const placeholderColor = color.substring(1);
            nodeDiv.style.borderColor = color;
            
            const titleDiv = `<div class="title" style="color: ${color};">${person.title}</div>`;

            nodeDiv.innerHTML = `
                <img src="images/${person.image || nameToFilename(person.name)}" onerror="this.onerror=null;this.src='https://placehold.co/120x120/${placeholderColor}/ffffff?text=${nameToInitials(person.name)}';">
                <div class="name">${person.name}</div>
                ${titleDiv}
            `;
            
            li.appendChild(nodeDiv);

            const children = person.children || (person.reports ? person.reports.map(name => ({name, title: 'Analyst'})) : []);

            if (children.length > 0) {
                nodeDiv.classList.add('has-children');
                const subList = document.createElement('ul');
                children.sort((a, b) => a.name.localeCompare(b.name)).forEach(child => {
                    if (person.color && !child.color) child.color = person.color;
                    subList.appendChild(createNode(child));
                });
                li.appendChild(subList);

                nodeDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    li.classList.toggle('expanded');
                    nodeDiv.classList.toggle('expanded');
                    setTimeout(drawConnections, 50); 
                });
            }
            
            if (isRoot) {
                li.classList.add('expanded');
                nodeDiv.classList.add('expanded');
            }

            return li;
        }

        const rootList = document.createElement('ul');
        rootList.appendChild(createNode(teamData, true));
        treeContainer.appendChild(rootList);

        setTimeout(drawConnections, 100);
        window.addEventListener('resize', () => {
            if (window.resizeTimeout) clearTimeout(window.resizeTimeout);
            window.resizeTimeout = setTimeout(drawConnections, 100);
        });
    }

    function drawConnections() {
        const svg = document.getElementById('org-chart-svg');
        const container = document.getElementById('org-chart-container');
        if (!svg || !container) return;

        svg.innerHTML = '';
        const containerRect = container.getBoundingClientRect();

        document.querySelectorAll('.org-tree li.expanded').forEach(parentNode => {
            const parentDiv = parentNode.querySelector(':scope > .org-node');
            const childrenUl = parentNode.querySelector(':scope > ul');
            if (!childrenUl) return;

            const parentRect = parentDiv.getBoundingClientRect();
            const parentColor = parentDiv.style.borderColor || '#6b7280';
            
            const startX = parentRect.left - containerRect.left + parentRect.width / 2;
            const startY = parentRect.top - containerRect.top + parentRect.height;

            Array.from(childrenUl.children).forEach(childLi => {
                const childDiv = childLi.querySelector(':scope > .org-node');
                const childRect = childDiv.getBoundingClientRect();

                const endX = childRect.left - containerRect.left + childRect.width / 2;
                const endY = childRect.top - containerRect.top;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const controlY1 = startY + (endY - startY) * 0.5;
                const controlY2 = endY - (endY - startY) * 0.5;
                const d = `M ${startX} ${startY} C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${endY}`;
                
                path.setAttribute('d', d);
                path.setAttribute('stroke', parentColor);
                path.setAttribute('stroke-width', '2.5');
                path.setAttribute('fill', 'none');
                svg.appendChild(path);
            });
        });
    }

    // --- OTHER PAGE RENDERERS (Unchanged) ---
    function renderHomeAccordion() { /* ... function content ... */ }
    function renderResourcesContent() { /* ... function content ... */ }
    function initializeRnrCarousel() { /* ... function content ... */ }

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
                // ... other page initializations
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

    // Initial page load
    switchPage('home');
});
