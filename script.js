// ================================================
// FIREBASE CONFIGURATION
// ================================================
const firebaseConfig = {
    apiKey: "AIzaSyCqLJH97nGCuiBNgG9M30XTLtH0pE2tG4I",
    authDomain: "euroflux-113e1.firebaseapp.com",
    databaseURL: "https://euroflux-113e1-default-rtdb.firebaseio.com",
    projectId: "euroflux-113e1",
    storageBucket: "euroflux-113e1.appspot.com",
    messagingSenderId: "686283631702",
    appId: "1:686283631702:web:4e3f5c8c2d7f3a1c"
};

try {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
} catch (e) {
    console.log('Firebase init error:', e);
}

// ================================================
// SCROLL PROGRESS BAR (Program Page Only)
// ================================================
let progressBar;
let programSnapContainer;

function initScrollProgress() {
    progressBar = document.getElementById('scroll-progress');
    programSnapContainer = document.getElementById('program-snap');
    
    if (!progressBar) return;
    
    const updateProgress = () => {
        if (!programSnapContainer || !document.getElementById('page-program')?.classList.contains('active')) {
            progressBar.classList.remove('active');
            return;
        }
        
        progressBar.classList.add('active');
        
        const scrollTop = programSnapContainer.scrollTop;
        const scrollHeight = programSnapContainer.scrollHeight - programSnapContainer.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        const progressHeight = (progress / 100) * 184; // 200px - 16px indicator
        const progressTop = progressHeight;
        
        progressBar.style.setProperty('--progress-height', progressHeight + 'px');
        progressBar.style.setProperty('--progress-top', progressTop + 'px');
        progressBar.style.height = '200px';
    };
    
    if (programSnapContainer) {
        programSnapContainer.addEventListener('scroll', updateProgress, { passive: true });
    }
    updateProgress();
}

// ================================================
// HEADER BEHAVIOR (All Pages)
// ================================================
function initHeaderBehavior() {
    const header = document.getElementById('main-header');
    
    if (!header) return;
    
    let lastScrollTop = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const isScrollingDown = scrollTop > lastScrollTop;
        const isAtTop = scrollTop < 100;
        
        clearTimeout(scrollTimeout);
        
        // Hide header when scrolling down (not at top)
        if (isScrollingDown && !isAtTop) {
            header.classList.add('hidden');
            header.classList.remove('visible');
        }
        // Show header when scrolling up or at top
        else if (scrollTop < lastScrollTop || isAtTop) {
            header.classList.remove('hidden');
            header.classList.add('visible');
        }
        
        lastScrollTop = scrollTop;
    });
}

// ================================================
// PROGRAM PAGE ANIMATIONS
// ================================================
function initProgramAnimations() {
    const programSnap = document.getElementById('program-snap');
    if (!programSnap) return;
    
    const sections = programSnap.querySelectorAll('.program-snap-section');
    
    const observerOptions = {
        root: programSnap,
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateProgramCounters(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Scroll-to-fade effect for program titles
    const handleTitleFade = () => {
        sections.forEach((section, index) => {
            const title = section.querySelector('.program-title');
            if (!title) return;
            
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const distance = sectionCenter - viewportCenter;
            
            // Calculate opacity based on distance from center
            const maxDistance = window.innerHeight / 2;
            const opacity = Math.max(0.2, 1 - Math.abs(distance) / maxDistance * 0.8);
            const translateY = distance * 0.1;
            
            title.style.opacity = opacity;
            title.style.transform = `translateY(${translateY}px)`;
        });
    };
    
    programSnap.addEventListener('scroll', handleTitleFade, { passive: true });
    handleTitleFade();
}

function animateProgramCounters(section) {
    const counters = section.querySelectorAll('.prog-stat-num');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        if (!target) return;
        
        const duration = 1500;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(update);
    });
}

// ================================================
// LOADING SCREEN
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initHeaderBehavior();
    initProgramAnimations();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1500);
});

// ================================================
// NAVIGATION
// ================================================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });
        
        // Show header on all pages
        const header = document.getElementById('main-header');
        if (header) {
            header.classList.remove('hidden');
            header.classList.add('visible');
        }
        
        // Update progress bar
        initScrollProgress();
        
        // Re-init program animations
        if (pageId === 'program') {
            setTimeout(initProgramAnimations, 100);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Close mobile menu
        const nav = document.getElementById('nav-menu');
        const toggle = document.getElementById('menu-toggle');
        if (nav) nav.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
    }
}

function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    const toggle = document.getElementById('menu-toggle');
    
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
}

// ================================================
// ACCORDION
// ================================================
function toggleAcc(button) {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');
    
    // Close all
    document.querySelectorAll('.acc-item').forEach(i => {
        i.classList.remove('open');
    });
    
    // Open clicked if wasn't open
    if (!isOpen) {
        item.classList.add('open');
    }
}

// ================================================
// CONTACT FORM - Submit to Firebase
// ================================================
async function submitContactForm(event) {
    event.preventDefault();
    
    const status = document.getElementById('cf-status');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        const formData = {
            name: document.getElementById('cf-name').value,
            email: document.getElementById('cf-email').value,
            subject: document.getElementById('cf-subject').value,
            message: document.getElementById('cf-message').value,
            type: 'contact',
            timestamp: Date.now()
        };
        
        await database.ref('submissions').push(formData);
        
        if (status) {
            status.textContent = 'Message sent successfully! We will get back to you soon.';
            status.style.color = '#00ff00';
        }
        
        event.target.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        if (status) {
            status.textContent = 'Error sending message. Please try again.';
            status.style.color = '#ff0000';
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}

// ================================================
// APPLICATION FORM - Submit to Firebase
// ================================================
async function submitApplication(event) {
    event.preventDefault();
    
    const status = document.getElementById('app-status');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        const formData = {
            name: document.getElementById('app-name').value,
            email: document.getElementById('app-email').value,
            program: document.getElementById('app-program').value,
            country: document.getElementById('app-country').value,
            organization: document.getElementById('app-org').value,
            reason: document.getElementById('app-reason').value,
            linkedin: document.getElementById('app-linkedin').value,
            type: 'application',
            status: 'pending',
            timestamp: Date.now()
        };
        
        await database.ref('submissions').push(formData);
        
        if (status) {
            status.textContent = 'Application submitted successfully! We will review it and get back to you.';
            status.style.color = '#00ff00';
        }
        
        event.target.reset();
        
    } catch (error) {
        console.error('Error submitting application:', error);
        if (status) {
            status.textContent = 'Error submitting application. Please try again.';
            status.style.color = '#ff0000';
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
    }
}
