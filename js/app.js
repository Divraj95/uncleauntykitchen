/**
 * Uncle & Aunty Kitchen - Main Application
 * This file loads content from JSON data files and renders them to the page.
 * Edit the JSON files in /data folder to update content without touching HTML.
 */

// Cache for loaded data
const dataCache = {};

/**
 * Load JSON data from a file
 */
async function loadData(filename) {
    if (dataCache[filename]) {
        return dataCache[filename];
    }

    try {
        const response = await fetch(`data/${filename}.json`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        const data = await response.json();
        dataCache[filename] = data;
        return data;
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return null;
    }
}

/**
 * Render site-wide content (name, tagline, footer)
 */
async function renderSite() {
    const site = await loadData('site');
    if (!site) return;

    // Hero section
    document.querySelector('.hero h1').textContent = site.name;
    document.querySelector('.tagline').textContent = site.tagline;
    document.querySelector('.subtitle').textContent = site.subtitle;

    // Navigation
    document.querySelector('.nav-logo').textContent = site.name.replace(' Kitchen', '');

    // Footer
    document.querySelector('.footer-logo').textContent = site.name;
    document.querySelector('.copyright').innerHTML = `&copy; ${site.copyright}`;
}

/**
 * Render About section
 */
async function renderAbout() {
    const about = await loadData('about');
    if (!about) return;

    const section = document.querySelector('#about');
    section.querySelector('h2').textContent = about.title;

    // Paragraphs
    const textContainer = section.querySelector('.about-text');
    const paragraphsHtml = about.paragraphs
        .map(p => `<p>${p}</p>`)
        .join('');

    // Features
    const featuresHtml = about.features
        .map(f => `
            <div class="feature">
                <span class="feature-icon">${f.icon}</span>
                <span>${f.text}</span>
            </div>
        `)
        .join('');

    textContainer.innerHTML = `
        ${paragraphsHtml}
        <div class="features">${featuresHtml}</div>
    `;
}

/**
 * Render Menu section
 */
async function renderMenu() {
    const menu = await loadData('menu');
    if (!menu) return;

    const section = document.querySelector('#menu');
    section.querySelector('h2').textContent = menu.title;

    // Categories
    const gridContainer = section.querySelector('.menu-grid');
    const categoriesHtml = menu.categories
        .map(category => `
            <div class="menu-category">
                <h3>${category.name}</h3>
                <ul>
                    ${category.items.map(item => `
                        <li>
                            <span class="dish-name">${item.name}</span>
                            <span class="dish-desc">${item.description}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `)
        .join('');

    gridContainer.innerHTML = categoriesHtml;

    // Note
    section.querySelector('.menu-note').textContent = menu.note;
}

/**
 * Render Services section
 */
async function renderServices() {
    const services = await loadData('services');
    if (!services) return;

    const section = document.querySelector('#services');
    section.querySelector('h2').textContent = services.title;

    // Service cards
    const gridContainer = section.querySelector('.services-grid');
    const servicesHtml = services.items
        .map(service => `
            <div class="service-card">
                <div class="service-icon">${service.icon}</div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
            </div>
        `)
        .join('');

    gridContainer.innerHTML = servicesHtml;
}

/**
 * Render Contact section
 */
async function renderContact() {
    const contact = await loadData('contact');
    if (!contact) return;

    const section = document.querySelector('#contact');
    section.querySelector('h2').textContent = contact.title;

    // Contact details
    const infoContainer = section.querySelector('.contact-info');
    const details = contact.details;

    const contactHtml = Object.values(details)
        .map(item => `
            <div class="contact-item">
                <span class="contact-icon">${item.icon}</span>
                <div>
                    <h4>${item.label}</h4>
                    <p>${item.link
                        ? `<a href="${item.link}">${item.value}</a>`
                        : item.value
                    }</p>
                </div>
            </div>
        `)
        .join('');

    infoContainer.innerHTML = contactHtml;

    // CTA
    const ctaContainer = section.querySelector('.contact-cta');
    ctaContainer.innerHTML = `
        <p>${contact.cta_text}</p>
        <a href="${details.phone.link}" class="cta-button">${contact.cta_button}</a>
    `;
}

/**
 * Initialize mobile navigation
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Initialize the application
 */
async function init() {
    try {
        // Load all sections in parallel
        await Promise.all([
            renderSite(),
            renderAbout(),
            renderMenu(),
            renderServices(),
            renderContact()
        ]);

        // Initialize navigation after content is loaded
        initNavigation();

        console.log('Uncle & Aunty Kitchen loaded successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
