document.addEventListener('DOMContentLoaded', function() {
    // --- UTILITY FUNCTIONS ---
    const nameToFilename = (name) => name.toLowerCase().replace(/ /g, '-').replace(/\./g, '') + '.jpg';
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

        const container = document.getElementById('org-chart-container');
        if (!container) return;

        container.innerHTML = `<div class="timeline-org-chart"></div>`;
        const chart = container.querySelector('.timeline-org-chart');

        const lead = teamData;
        const leadColor = lead.color || '#6b7280';
        const leadProfileLink = `/profiles/${lead.name.toLowerCase().replace(/ /g, '-')}`;
        chart.innerHTML = `
            <div class="timeline-lead">
                <a href="${leadProfileLink}" target="_blank" class="node-card-link" style="text-decoration: none;">
                    <div class="node-card" style="border-color: ${leadColor}; cursor: pointer;">
                        <img src="images/${lead.image || nameToFilename(lead.name)}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/${leadColor.substring(1)}/ffffff?text=${nameToInitials(lead.name)}';">
                        <div class="name">${lead.name}</div>
                        <div class="title" style="color: ${leadColor};">${lead.title}</div>
                    </div>
                </a>
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
            item.innerHTML = `
                <div class="node-card" data-has-reports="${!!reportsHtml}" style="border-color: ${managerColor};">
                    <img src="images/${manager.image || nameToFilename(manager.name)}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/${managerColor.substring(1)}/ffffff?text=${nameToInitials(manager.name)}';">
                    <div class="name">${manager.name}</div>
                    <div class="title" style="color: ${managerColor};">${manager.title}</div>
                    ${reportsHtml}
                </div>`;
            
            timelineBody.appendChild(item);
        });

        chart.querySelectorAll('.node-card').forEach(card => {
            const hasReports = card.dataset.hasReports === 'true';
            if (hasReports) {
                card.addEventListener('click', (e) => {
                    // Prevent link navigation if clicking inside the card to expand
                    if (e.target.closest('a')) return; 
                    card.closest('.org-timeline-item').classList.toggle('expanded');
                });
                // To make the manager card itself a link, we wrap it in an anchor tag conditionally or handle navigation via JS.
                // For simplicity, let's make only reports clickable links, and manager cards expanders.
            } else {
                 // For managers without reports, their card becomes a link
                 const managerName = card.querySelector('.name').textContent;
                 const profileLink = `/profiles/${managerName.toLowerCase().replace(/ /g, '-')}`;
                 card.addEventListener('click', () => {
                     window.open(profileLink, '_blank');
                 });
            }
        });
    }

    // --- HOME PAGE ACCORDION ---
    function renderHomeAccordion() { /* ... content from previous versions ... */ }

    // --- RESOURCES PAGE CONTENT (NOW WITH FULL DETAILS) ---
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

        const accordionContainer = document.getElementById('resources-accordion-container');
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
});
