
// Configuration
const CONFIG = {
    whatsappNumber: '+919444606656',
    observerOptions: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
};

// Utility Functions
const createNotification = (message, type = 'error') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#28A745' : '#FF4F18';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px ${bgColor}30;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

const openWhatsApp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
};

// Mobile Navigation
const initMobileNav = () => {
    const hamburger = document.querySelector('.hz-hamburger');
    const navMenu = document.querySelector('.hz-nav-menu');
    const navLinks = document.querySelectorAll('.hz-nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
};

// Smooth Scrolling
const initSmoothScrolling = () => {
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
};

// Scroll Animations
const initScrollAnimations = () => {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, CONFIG.observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-animate, .hz-first-time-image');
    scrollElements.forEach(el => scrollObserver.observe(el));
};

// Navbar Section Highlighting
const initNavbarHighlighting = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.hz-nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    const highlightNavLink = (sectionId) => {
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to the corresponding nav link
        const activeLink = document.querySelector(`.hz-nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '-10% 0px -80% 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                highlightNavLink(sectionId);
            }
        });
    }, observerOptions);
    
    // Observe all sections with IDs
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Alternative method using scroll event for better reliability
    const handleScrollHighlight = () => {
        const scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                highlightNavLink(sectionId);
            }
        });
        
        // Handle home section when at top
        if (scrollPosition < 100) {
            highlightNavLink('home');
        }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollHighlight);
    
    // Call on page load
    handleScrollHighlight();
};

// Back to Top Button
const initBackToTop = () => {
    const backToTopBtn = document.getElementById('backToTop');
    const heroSection = document.querySelector('.hz-hero');
    
    if (!backToTopBtn) return;

    const heroHeight = heroSection ? heroSection.offsetHeight : 600;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > heroHeight * 0.5) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// Form Validation
const validateBookingForm = (data) => {
    const requiredFields = ['name', 'phone', 'date', 'time', 'duration', 'players'];
    
    for (let field of requiredFields) {
        if (!data[field]) {
            createNotification(`Please fill in the ${field} field.`);
            return false;
        }
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        createNotification('Please enter a valid 10-digit Indian mobile number.');
        return false;
    }
    
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        createNotification('Please select a future date.');
        return false;
    }
    
    return true;
};

// Populate Time Options (24 hrs + disable past times if today)
const populateTimeOptions = () => {
    const timeSelect = document.getElementById('time');
    if (!timeSelect) return;
    
    timeSelect.innerHTML = `<option value="">Select Time</option>`;

    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    const selectedDateInput = document.getElementById('date');

    let disableBeforeHour = -1;

    const updateTimes = () => {
        const selectedDate = selectedDateInput.value;
        timeSelect.innerHTML = `<option value="">Select Time</option>`;
        
        if (selectedDate === todayDate) {
            disableBeforeHour = now.getHours();
        } else {
            disableBeforeHour = -1;
        }

        for (let h = 0; h < 24; h++) {
            const hour = h.toString().padStart(2, '0');
            const timeValue = `${hour}:00`;
            const option = document.createElement('option');
            option.value = timeValue;
            option.textContent = timeValue;
            if (disableBeforeHour !== -1 && h <= disableBeforeHour) {
                option.disabled = true;
            }
            timeSelect.appendChild(option);
        }
    };

    selectedDateInput.addEventListener('change', updateTimes);
    updateTimes();
};

// Booking Form
const initBookingForm = () => {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const bookingData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            date: formData.get('date'),
            time: formData.get('time'),
            duration: formData.get('duration'),
            players: formData.get('players')
        };
        
        if (!validateBookingForm(bookingData)) return;
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Create WhatsApp message
            const timeDisplay = bookingData.time;
            
            const durationText = bookingData.duration === '1' ? '1 Hour' : `${bookingData.duration} Hours`;
            const playersText = bookingData.players === '1' ? '1 Player' : `${bookingData.players} Players`;
            
            const message = `*New Court Booking Request*

*Name:* ${bookingData.name}
*Phone:* ${bookingData.phone}
*Date:* ${new Date(bookingData.date).toLocaleDateString()}
*Time:* ${timeDisplay}
*Duration:* ${durationText}
*Players:* ${playersText}

Please confirm this booking.`;

            openWhatsApp(message);
            createNotification('Booking request sent! Please check WhatsApp to complete your booking.', 'success');
        }, 2000);
    });
};

// WhatsApp Integration
const initWhatsAppButtons = () => {
    document.querySelectorAll('.hz-whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const plan = this.getAttribute('data-plan');
            const isEvent = this.getAttribute('data-event');
            const isContact = this.getAttribute('data-contact');
            const isMembership = this.getAttribute('data-membership');
            
            let message = '';
            
            if (plan) {
                // Define plan details
                const planDetails = {
                    'Monthly': {
                        price: '₹3,499',
                        features: [
                            '30 hours play/month',
                            'Transferable hours (up to 1 month)',
                            'Locker access'
                        ]
                    },
                    'Quarterly': {
                        price: '₹9,499',
                        features: [
                            '90 hours play (30 hours/month)',
                            'Transferable hours (up to 2 months)',
                            'Reserved locker access',
                            '1 Free Tournament Entry',
                            'AI Coaching & Match Analytics',
                            '1 Guest Pass'
                        ]
                    },
                    'Annual': {
                        price: '₹29,999',
                        features: [
                            '60 hours/month (720 total)',
                            'Transferable hours (up to 3 months)',
                            'Reserved locker access',
                            '1 Free Event Entry',
                            'AI Coaching, Scoring & Analytics',
                            '3 Guest Passes',
                            'Loyalty Rewards'
                        ]
                    },
                    'Lifetime': {
                        price: '₹99,999',
                        features: [
                            'Unlimited hours/month',
                            'Lifetime transferable hours',
                            'VIP locker access',
                            'Unlimited event entries',
                            'Premium AI features',
                            '5 Guest Passes',
                            'VIP benefits & rewards'
                        ]
                    }
                };

                const selectedPlan = planDetails[plan];
                if (selectedPlan) {
                    const featuresList = selectedPlan.features.map(feature => `• ${feature}`).join('\n');
                    
                    message = `*HitZone SPARC Membership Inquiry*

Hi! I'm interested in joining the *${plan} Membership Plan*.

*Plan Details:*
💰 *Price:* ${selectedPlan.price}

*Features I'm interested in:*
${featuresList}

Please provide me with:
• Complete enrollment process
• Payment options available
• When I can start my membership
• Any current offers or discounts

Looking forward to joining the HitZone SPARC community!

Thank you! 🏓`;
                }
            } else if (isEvent) {
                message = `*Event Planning Inquiry*

I'm interested in hosting an event at Hitzone!

Please provide information about:
• Available dates and times
• Pricing for court rentals
• Event coordination services
• Catering options

Thank you!`;
            } else if (isContact) {
                message = `*Hitzone General Inquiry*

Hello! I have a question about Hitzone pickleball courts.

Please provide information about:
• Court availability
• Pricing
• Equipment rental
• Any other services

Thank you!`;
            } else if (isMembership) {
                message = `*Hitzone Membership Inquiry*

I'm interested to become a member at Hitzone!

Please provide information about:
• Available membership plans and pricing
• Membership benefits and features
• How to sign up and get started

Thank you!`;
            }
            
            if (message) {
                openWhatsApp(message);
            }
        });
    });
};

// Form Input Animations
const initFormAnimations = () => {
    document.querySelectorAll('.hz-form-group input, .hz-form-group select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
};

// Set minimum date for booking form
const setMinDate = () => {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
};

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarHighlighting(); // Added this line
    initBackToTop();
    initBookingForm();
    initWhatsAppButtons();
    initFormAnimations();
    setMinDate();
    populateTimeOptions();
});

console.log('🏓 Hitzone website loaded successfully!');

