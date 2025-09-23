// Configuration
const CONFIG = {
    whatsappNumber: '+919444606656',
    observerOptions: {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  };
  
  // ---------- Utility Functions ----------
  const getErrorElement = (input) => document.getElementById(`${input.id}-error`);
  
  const showFieldError = (input, message) => {
    const el = getErrorElement(input);
    if (el) {
      el.textContent = message;
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }
  };
  
  const clearFieldError = (input) => {
    const el = getErrorElement(input);
    if (el) {
      el.textContent = "";
      input.removeAttribute("aria-invalid");
    }
  };
  
  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const sanitizeName = (val) =>
    val.replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ').trimStart();
  
  const sanitizePhone = (val) => {
    let cleaned = val.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.slice(1).replace(/\D/g, '');
      return cleaned.slice(0, 16); // + + up to 15 digits
    }
    return cleaned.replace(/\D/g, '').slice(0, 15);
  };
  
  // ---------- Mobile Navigation ----------
  const initMobileNav = () => {
    const hamburger = document.querySelector('.hz-hamburger');
    const navMenu = document.querySelector('.hz-nav-menu');
    if (!hamburger || !navMenu) return;
  
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  
    document.querySelectorAll('.hz-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  };
  
  // ---------- Smooth Scrolling ----------
  const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };
  
  // ---------- Scroll Animations ----------
  const initScrollAnimations = () => {
    const scrollObserver = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate');
      }),
      CONFIG.observerOptions
    );
    document.querySelectorAll('.scroll-animate, .hz-first-time-image')
      .forEach(el => scrollObserver.observe(el));
  };
  
  // ---------- Navbar Highlighting ----------
  const initNavbarHighlighting = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.hz-nav-link');
    if (!sections.length || !navLinks.length) return;
  
    const highlightNavLink = (id) => {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.hz-nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) highlightNavLink(entry.target.id);
      });
    }, { threshold: 0.2, rootMargin: '-10% 0px -80% 0px' });
  
    sections.forEach(s => observer.observe(s));
  
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 100;
      sections.forEach(section => {
        const top = section.offsetTop;
        if (scrollY >= top && scrollY < top + section.offsetHeight) {
          highlightNavLink(section.id);
        }
      });
      if (scrollY < 100) highlightNavLink('home');
    });
  };
  
  // ---------- Back to Top ----------
  const initBackToTop = () => {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    const heroHeight = (document.querySelector('.hz-hero')?.offsetHeight) || 600;
  
    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.pageYOffset > heroHeight * 0.5);
    });
    btn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  };
  
  // ---------- Form Validation ----------
  const validateBookingForm = (form) => {
    let isValid = true;
    const fields = {
      name: form.querySelector("#name"),
      phone: form.querySelector("#phone"),
      date: form.querySelector("#date"),
      time: form.querySelector("#time"),
      players: form.querySelector("#players")
    };
  
    Object.values(fields).forEach(f => f && clearFieldError(f));
  
    // Name
    if (fields.name) {
      const value = fields.name.value.trim();
      if (!value) {
        showFieldError(fields.name, "Full name is required."); isValid = false;
      } else if (!/^[A-Za-z\s]{2,}$/.test(value)) {
        showFieldError(fields.name, "Name should contain letters and spaces only.");
        isValid = false;
      }
    }
  
    // Phone
    if (fields.phone) {
      const raw = fields.phone.value.trim();
      if (!raw) {
        showFieldError(fields.phone, "Mobile number is required."); isValid = false;
      } else if (raw.startsWith('+')) {
        const digits = raw.replace(/[^\d]/g, '');
        if (digits.length < 10 || digits.length > 15) {
          showFieldError(fields.phone, "Enter a valid international number (10–15 digits).");
          isValid = false;
        }
      } else if (!/^[6-9]\d{9}$/.test(raw.replace(/\D/g, ''))) {
        showFieldError(fields.phone, "Enter a valid 10-digit mobile number."); isValid = false;
      }
    }
  
    // Date / Time / Players
    if (fields.date && !fields.date.value) {
      showFieldError(fields.date, "Please select a date."); isValid = false;
    }
    if (fields.time && !fields.time.value) {
      showFieldError(fields.time, "Please select a time."); isValid = false;
    }
    if (fields.players && !fields.players.value) {
      showFieldError(fields.players, "Please select players."); isValid = false;
    }
  
    if (fields.date?.value) {
      const selectedDate = new Date(fields.date.value);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showFieldError(fields.date, "Please select a future date."); isValid = false;
      }
    }
    return isValid;
  };
  
  // ---------- Time Options ----------
  const populateTimeOptions = () => {
    const timeSelect = document.getElementById('time');
    const dateInput = document.getElementById('date');
    if (!timeSelect || !dateInput) return;

    const updateTimes = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const selected = dateInput.value;
      const disableBefore = (selected === today) ? now.getHours() : -1;

      timeSelect.innerHTML = `<option value="">Select Time</option>`;
      for (let h = 0; h < 24; h++) {
        const val = `${String(h).padStart(2, '0')}:00`;
        const displayTime = formatTime12Hour(val);
        const option = new Option(displayTime, val);
        if (disableBefore !== -1 && h <= disableBefore) option.disabled = true;
        timeSelect.appendChild(option);
      }
    };
    dateInput.addEventListener('change', updateTimes);
    updateTimes();
  };

  // ---------- Time Formatting ----------
  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // ---------- Booking Form ----------
  const initBookingForm = () => {
    const form = document.getElementById('bookingForm');
    if (!form) return;
  
    const nameInput = form.querySelector('#name');
    const phoneInput = form.querySelector('#phone');
  
    nameInput?.addEventListener('input', () => {
      const cleaned = sanitizeName(nameInput.value);
      if (nameInput.value !== cleaned) nameInput.value = cleaned;
    });
    nameInput?.addEventListener('paste', (e) => {
      e.preventDefault();
      nameInput.value = sanitizeName((e.clipboardData || window.clipboardData).getData('text'));
    });
  
    if (phoneInput) {
      phoneInput.setAttribute('inputmode', 'tel');
      phoneInput.setAttribute('pattern', '\\+?[0-9]{10,15}');
      phoneInput.addEventListener('input', e => e.target.value = sanitizePhone(e.target.value));
      phoneInput.addEventListener('paste', (e) => {
        e.preventDefault();
        phoneInput.value = sanitizePhone((e.clipboardData || window.clipboardData).getData('text'));
      });
    }
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateBookingForm(form)) return;
  
      const data = Object.fromEntries(new FormData(form).entries());
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
  
      btn.innerHTML = '<span class="loading"></span> Processing...';
      btn.disabled = true;
  
      setTimeout(() => {
        form.reset();
        btn.textContent = original;
        btn.disabled = false;
  
        const playersText = data.players === '1' ? '1 Player' : `${data.players} Players`;
        const formattedTime = formatTime12Hour(data.time);
        const message = `*New Court Booking Request*\n\n*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Date:* ${new Date(data.date).toLocaleDateString()}\n*Time:* ${formattedTime}\n*Players:* ${playersText}\n\nPlease confirm this booking.`;
  
        openWhatsApp(message);
      }, 2000);
    });
  };
  
  // ---------- WhatsApp Buttons ----------
  const initWhatsAppButtons = () => {
    document.querySelectorAll('.hz-whatsapp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.classList.contains('hz-plan-btn')) {
          openWhatsApp(`*Membership Plan Inquiry*\n\nI'm interested in the *${btn.dataset.plan}* membership plan.\n\nPlease provide more details.`);
        } else if (btn.dataset.membership === 'true') {
          openWhatsApp(`*Membership Enrollment*\n\nI'm interested in becoming a member at HitZone SPARC.\n\nPlease provide membership details.`);
        } else if (btn.dataset.event === 'true') {
          openWhatsApp(`*Event Planning Inquiry*\n\nI'm interested in planning an event at HitZone SPARC.\n\nPlease provide event details.`);
        } else {
          openWhatsApp(btn.dataset.message || 'Hello! I would like to know more about your services.');
        }
      });
    });
  };
  
  // ---------- Form Animations ----------
  const initFormAnimations = () => {
    document.querySelectorAll('.hz-form-group input, .hz-form-group select')
      .forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => { if (!input.value) input.parentElement.classList.remove('focused'); });
      });
  };
  
  // ---------- Date ----------
  const setMinDate = () => {
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  };

  // ---------- Tournament Data from Google Sheets ----------
  const loadTournamentData = async () => {
    try {
      // 🔗 REPLACE THIS URL WITH YOUR GOOGLE SHEETS CSV URL
      // Get this URL from: File → Share → Publish to web → CSV format
      const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSA-ODDFMr6nbrlb65eaTGPvUaNWWusNVRGv4QLq95mlnmo4xt5Ahrs0wzF3qjUNdRX65qC1RG9-P8g/pub?output=csv';
      
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      
      // Parse CSV data
      const tournaments = parseCSV(csvText);
      
      // Update the tournament table
      updateTournamentTable(tournaments);
      
    } catch (error) {
      console.error('❌ Error loading tournament data from Google Sheets:', error);
      console.log('💡 Make sure you have:');
      console.log('   1. Published your Google Sheet as CSV');
      console.log('   2. Updated the SHEET_URL in the code');
      console.log('   3. Made the sheet publicly accessible');
      // Fallback to static data if API fails
      console.log('📋 Using fallback tournament data');
    }
  };

  const splitCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        // Toggle quoting; handle escaped quotes by doubling
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip the escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result.map(col => col.trim());
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const tournaments = [];
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      const rawLine = lines[i];
      if (!rawLine) continue;
      const line = rawLine.replace(/\r$/, '').trim();
      if (!line) continue;
      const columns = splitCSVLine(line).map(col => col.replace(/^\"|\"$/g, '').replace(/\r/g, '').trim());
      if (columns.length >= 5) {
        tournaments.push({
          name: columns[0],        // EVENT NAME
          club: columns[1],        // CLUB NAME
          date: columns[2],        // DATE
          time: columns[3],        // TIME
          location: columns[4],    // LOCATION
        });
      }
    }
    return tournaments;
  };

  const updateTournamentTable = (tournaments) => {
    const tableBody = document.querySelector('.hz-tournament-table-content tbody');
    if (!tableBody) return;

    // Clear existing rows
    tableBody.innerHTML = '';

    // Add new tournament rows
    tournaments.forEach((tournament, index) => {
      const row = document.createElement('tr');
      
      const colorClass = getColorClass(tournament.color, index);
      
      row.innerHTML = `
        <td>
          <div class="hz-tournament-row">
            <div class="hz-tournament-dot ${colorClass}"></div>
            <span>${tournament.name}</span>
          </div>
        </td>
        <td>${tournament.club}</td>
        <td>${tournament.date}</td>
        <td>${tournament.time}</td>
        <td>${tournament.location}</td>
      `;
      
      tableBody.appendChild(row);
    });
  };

  const getColorClass = (color, index) => {
    const colorMap = {
      'purple': 'hz-dot-purple',
      'blue': 'hz-dot-blue', 
      'green': 'hz-dot-green',
      'red': 'hz-dot-purple',
      'orange': 'hz-dot-blue',
      'yellow': 'hz-dot-green'
    };
    
    return colorMap[color] || ['hz-dot-purple', 'hz-dot-blue', 'hz-dot-green'][index % 3];
  };
  

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarHighlighting();
    initBackToTop();
    initBookingForm();
    initWhatsAppButtons();
    initFormAnimations();
    setMinDate();
    populateTimeOptions();
    loadTournamentData();
  });
  