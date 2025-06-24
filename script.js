// --- DATA ---
const nameToFilename = (name) => name.toLowerCase().replace(/ /g, '-').replace(/\./g, '') + '.jpg';
const nameToInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2);

// --- RENDER FUNCTIONS ---
function renderOrgChart() {
     const teamData = {
        name: 'Megha Chhaparia',
        title: 'AML LOB Lead',
        image: 'meghachhaparia.jpg',
        children: [
            { name: 'Aparna Jayant', title: 'AML EMEA DRI', image: 'ajayant.jpg', reports: ['Agnel Levin', 'Aman Husain', 'Nanda Krishnan U Nair', 'Padma Lochan Choudhury', 'Princy Ann', 'Suman S', 'Vasudevan Sundararaj', 'Yusuf Khan'] },
            { name: 'Divya Nayak', title: 'AML EMEA DRI', image: 'divyanayak.jpg', reports: ['Ashwini H', 'Bindya Cheruvalanda Lava', 'Geetanjali Gudiseva', 'Lokesh Raaju Polamarasetty', 'Monica Manisha Monteiro', 'Shalini T', 'Surbhi Kumari', 'Swaroop S Kaushik', 'Vaishnavi V', 'Vidya t'] },
            { name: 'Mohit Aditya', title: 'AML APAC DRI & Projects Lead', image: 'mohitaditya.jpg', reports: ['Arshanath Sasidharan Nalini', 'Avinav Chel', 'Chaitanya Vaddadi', 'Hemanth Harish G', 'Manish Kumar Sahu', 'Nabanita Mazumdar', 'Nikita Dsouza', 'Swarnim Taj', 'Vineeth R'] },
            { name: 'Vinayak Shenoy K', title: 'AML US DRI', image: 'vinayaks.jpg', reports: ['Aanchal Mutreja', 'Aanya Chhabria', 'Aarush Sharma', 'Aditya Mathur', 'Amitha Mathew', 'Angdeep Sharma', 'Arbaaz Khan', 'Ashik Gem', 'Ekansh Lohani', 'Fateh N Ahmed', 'Gaurav Kumar', 'Gyanesh Chaudhary', 'Jinkala Thrisha', 'KRUTHIKA RAMASWAMY', 'Khushi Khandelwal', 'M Tikendra Singha', 'Mehul Shah', 'Nagaruru Nithya Sai Rachana', 'Nandini Karwa', 'Nikita Kanjilal', 'Nisha Shetty', 'Nitin Vashisth', 'Pallav Makil', 'Pradyumn Gupta', 'Puneeth Balaji T', 'Rebecca Siangshai', 'Sabhya Punjabi', 'Sanchit Maitra', 'Sanjana Kadlaskar', 'Sharib Shams', 'Shashi Mehta', 'Shreeja Dutta', 'Shwetabh Trivedi', 'Sindhu Sampathkumar', 'Sneha Agarwal', 'Srijoni Dasgupta', 'Sriparna Guha Roy', 'Sriram Chandrasekaran', 'Srishti Bhandary', 'Suhasini Satapathy', 'Vibhav Prakash', 'Vignesh R'] }
        ]
    };

    const container = document.getElementById('org-chart-container');
    if(!container) return;
    container.innerHTML = ''; 

    const leadNode = document.createElement('div');
    leadNode.className = 'flex justify-center mb-8';
    leadNode.innerHTML = `
        <div class="org-node w-64">
            <img src="images/${teamData.image}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/6366f1/ffffff?text=MC';">
            <div class="name">${teamData.name}</div>
            <div class="title">${teamData.title}</div>
        </div>
    `;
    container.appendChild(leadNode);
    
    const line = document.createElement('div');
    line.className = 'h-12 w-px bg-gray-300 mx-auto';
    container.appendChild(line);

    const managerContainer = document.createElement('div');
    managerContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8';
    
    teamData.children.sort((a, b) => a.name.localeCompare(b.name));

    teamData.children.forEach(manager => {
        const managerWrapper = document.createElement('div');
        const managerNode = document.createElement('div');
        managerNode.className = 'org-node manager-node';
        managerNode.innerHTML = `
            <img src="images/${manager.image}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/6366f1/ffffff?text=${nameToInitials(manager.name)}';">
            <div class="name">${manager.name}</div>
            <div class="title">${manager.title}</div>
        `;
        
        const reportsContainer = document.createElement('div');
        reportsContainer.className = 'reports-container';
        const reportsGridWrapper = document.createElement('div');
        reportsGridWrapper.className = 'reports-grid-wrapper';
        const reportsGrid = document.createElement('div');
        reportsGrid.className = 'reports-grid';
        
        manager.reports.sort((a, b) => a.localeCompare(b)).forEach(reportName => {
            const reportNode = document.createElement('div');
            reportNode.className = 'org-node reportee-node';
            const reportImage = nameToFilename(reportName);
            const reportInitials = nameToInitials(reportName);

            reportNode.innerHTML = `
                <img src="images/${reportImage}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/e0e0e0/333?text=${reportInitials}';">
                <div class="name">${reportName}</div>
            `;
            reportsGrid.appendChild(reportNode);
        });

        reportsGridWrapper.appendChild(reportsGrid);
        reportsContainer.appendChild(reportsGridWrapper);
        
        managerNode.addEventListener('click', () => {
            reportsContainer.classList.toggle('expanded');
        });

        managerWrapper.appendChild(managerNode);
        managerWrapper.appendChild(reportsContainer);
        managerContainer.appendChild(managerWrapper);
    });
    container.appendChild(managerContainer);
}

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
        {
            title: 'Guide to Creating an AML Referral',
            icon: 'fa-file-alt',
            content: `<p class="mb-4 text-gray-600">This section explains how to raise concerns about accounts with the Global AML teams. If you’re not sure, always ask.</p>
                <ol class="list-decimal list-inside space-y-6">
                    <li><h5 class="font-semibold text-gray-800 inline">Navigate to the Referral Form</h5><p class="pl-6 text-gray-600">Go to <a href="#" class="text-indigo-600 font-medium hover:underline">go/aml-referral</a>, select "AML", and input the merchant token and supporting information. This creates a referral in the AML team's queue.</p></li>
                    <li><h5 class="font-semibold text-gray-800 inline">Draft Your Referral</h5><ul class="list-disc list-inside space-y-2 mt-2 pl-6 text-gray-600"><li>Provide the merchant token.</li><li>Describe <strong>why</strong> you are concerned. Be specific.</li><li>Include links to related accounts (with their tokens).</li><li>Avoid using the word "suspicious"; describe the activity as "unusual."</li></ul></li>
                    <li><h5 class="font-semibold text-gray-800 inline">What Happens Next?</h5><p class="pl-6 text-gray-600">The AML team reviews your referral within 1 business day. If the activity looks unusual, a case is opened, which may result in a regulatory filing (SAR). If not, the alert is cleared with notes. No further action is required from you.</p></li>
                </ol>`
        },
        {
            title: 'Understanding Unusual Activity',
            icon: 'fa-search',
            content: `<p class="mb-4 text-gray-600">Unusual activity can be conducted by any party in the Stripe ecosystem. It's often indicated by one or more signals. Here is a non-exhaustive list:</p>
                <div class="space-y-4">
                    <div class="p-4 bg-gray-50 rounded-lg border"><h6 class="font-semibold text-gray-700">Significant Discrepancy in Business Purpose</h6><ul class="list-disc list-inside text-gray-600 mt-2 pl-2"><li>Obvious mismatch between stated business and actual transaction activity.</li><li>Activity can’t be explained as normal for the business or industry.</li><li>Major difference in account registration location and log-in locations (e.g., US account with logins only from high-risk jurisdictions).</li></ul></div>
                    <div class="p-4 bg-gray-50 rounded-lg border"><h6 class="font-semibold text-gray-700">Unusual Merchant/Rep Actions</h6><ul class="list-disc list-inside text-gray-600 mt-2 pl-2"><li>Supporting documentation seems off or falsified.</li><li>Merchant rep is on a blacklist for financial crimes.</li><li>User refuses to provide info or is aggressive when asked for verification.</li></ul></div>
                    <div class="p-4 bg-gray-50 rounded-lg border"><h6 class="font-semibold text-gray-700">Unusual Transaction Patterns</h6><ul class="list-disc list-inside text-gray-600 mt-2 pl-2"><li>End-user appears to have a personal relationship with the merchant.</li><li>Transactions originate from locations that don't make sense for the business.</li><li>All charges originate from the same BIN, especially with no chargebacks.</li><li>Excessive or repetitive charges from a single user with no clear purpose.</li><li>Total volume/number of transactions exceeds expectations for the business type.</li></ul></div>
                    <div class="p-4 bg-gray-50 rounded-lg border"><h6 class="font-semibold text-gray-700">Potentially Illegal Content</h6><ul class="list-disc list-inside text-gray-600 mt-2 pl-2"><li>Website content is of questionable legality (e.g., weapons, certain substances depending on region, illicit pornography).</li></ul></div>
                </div>`
        },
        {
            title: 'Examples of Great AML Referrals',
            icon: 'fa-star',
            content: `<p class="mb-4 text-gray-600">These paraphrased examples show the kind of detail that is helpful to the AML team.</p>
                <div class="space-y-4">
                    <blockquote class="p-4 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800">"Three connected accounts (acct_aa, acct_bb, acct_cc) share a bank account and have card similarity. Similar landscaping businesses, but no info online. Prepaid cards and shared cards with unrelated accounts (acct_dd, acct_ee). Repetitive BINs. Invoices provided, but still looks unusual."</blockquote>
                    <blockquote class="p-4 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800">"All charges have the same BIN and were made using prepaid cards. Charge amounts are small but increasing. IPs appear to be supporting VPNs and are associated with illicit payments (mostly fraud)."</blockquote>
                    <blockquote class="p-4 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800">"Large charges and not much business history. Account shares location and behavior with connected accounts (acct_xx, acct_yy, acct_zz). No chargebacks on those accounts, which may indicate it's not straight card cashing."</blockquote>
                </div>`
        },
        {
            title: 'Frequently Asked Questions (FAQ)',
            icon: 'fa-question-circle',
            content: `<div class="space-y-4">
                    <div><h6 class="font-semibold text-gray-700">What if someone else already raised an AML review on this account?</h6><p class="text-gray-600 mt-1 pl-2">We still want to hear from you! You might have additional findings or concerns not covered in prior reviews.</p></div>
                    <div><h6 class="font-semibold text-gray-700">What if the activity spans across several accounts?</h6><p class="text-gray-600 mt-1 pl-2">If the accounts are clearly connected in the Duplicates panel in Admin, you only need to raise one review. Note the other account tokens in your referral.</p></div>
                    <div><h6 class="font-semibold text-gray-700">Does an AML Review affect the user?</h6><p class="text-gray-600 mt-1 pl-2">No, in most cases. We may reach out for more info or file a SAR, but the user won't know about the SAR. We only reject users where we identify a significant risk.</p></div>
                </div>`
        }
    ];

    const accordionContainer = document.getElementById('resources-accordion-container');
    accordionData.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'bg-white rounded-lg shadow-sm';
        const buttonEl = document.createElement('button');
        buttonEl.className = 'accordion-button w-full flex justify-between items-center text-left p-5 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg';
        buttonEl.innerHTML = `<span class="flex items-center text-lg"><i class="fas ${item.icon} text-indigo-500 mr-4 w-5 text-center"></i>${item.title}</span><svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
        const contentEl = document.createElement('div');
        contentEl.className = 'accordion-content';
        contentEl.innerHTML = `<div class="p-5 pt-0 text-gray-600">${item.content}</div>`;
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

