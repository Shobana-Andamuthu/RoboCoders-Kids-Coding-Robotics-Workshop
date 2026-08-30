/**
 * Kids Coding & Robotics Workshop / Academy
 * Main Javascript File (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // PUBLIC PAGES: DYNAMIC MOBILE PREFERENCES MOVER
  // ==========================================
  const mobMenu = document.getElementById('mobile-menu');
  const mobButtonsWrap = document.querySelector('.flex.items-center.gap-3.lg\\:hidden');
  if (mobMenu && mobButtonsWrap) {
    const mobToggles = mobButtonsWrap.querySelectorAll('.rtl-toggle, .dark-mode-toggle');
    if (mobToggles.length > 0) {
      const prefContainer = document.createElement('div');
      prefContainer.className = 'flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4';
      
      const prefLabel = document.createElement('span');
      prefLabel.className = 'text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider';
      prefLabel.textContent = 'Preferences';
      
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'flex items-center gap-2';
      
      mobToggles.forEach(toggle => {
        // Standardize classes for toggles in the menu drawer
        toggle.className = toggle.classList.contains('rtl-toggle')
          ? 'rtl-toggle w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors'
          : 'dark-mode-toggle w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors';
        buttonsDiv.appendChild(toggle);
      });
      
      prefContainer.appendChild(prefLabel);
      prefContainer.appendChild(buttonsDiv);
      mobMenu.appendChild(prefContainer);
    }
  }

  // ==========================================
  // 0. AUTH HEADER CHECK
  // ==========================================
  const headerLoginBtns = document.querySelectorAll('.header-login-btn');
  const userIsLoggedIn = localStorage.getItem('isLoggedIn');
  if (userIsLoggedIn === 'true') {
    const studentEmail = localStorage.getItem('studentEmail') || 'alex.coder@academy.com';
    const namePart = studentEmail.split('@')[0];
    const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    headerLoginBtns.forEach(btn => {
      btn.href = 'dashboard.html';
      btn.innerHTML = `
        <span class="relative z-10 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Hi, ${capitalizedName}</span>
        </span>
      `;
    });
  }

  // ==========================================
  // 1. PAGE LOADER
  // ==========================================
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }, 500); // 500ms delay for premium feel
    });
    // Fallback if load event doesn't fire
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 2000);
  }

  // ==========================================
  // 2. DARK MODE TOGGLE
  // ==========================================
  const darkToggles = document.querySelectorAll('.dark-mode-toggle');
  
  // Set theme from localStorage or default to system
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
    updateDarkToggleIcons(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateDarkToggleIcons(false);
  }

  darkToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateDarkToggleIcons(isDark);
    });
  });

  function updateDarkToggleIcons(isDark) {
    darkToggles.forEach(toggle => {
      // Toggle custom icons inside the button
      const sunIcon = toggle.querySelector('.sun-icon');
      const moonIcon = toggle.querySelector('.moon-icon');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
    });
  }

  // ==========================================
  // 3. RTL / LTR DIRECTION TOGGLE
  // ==========================================
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const savedDir = localStorage.getItem('direction') || 'ltr';
  
  setPageDirection(savedDir);

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      setPageDirection(newDir);
    });
  });

  function setPageDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('direction', dir);
    
    // Update button text / styling to indicate active state
    rtlToggles.forEach(toggle => {
      const textSpan = toggle.querySelector('.rtl-toggle-text');
      if (textSpan) {
        textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  // ==========================================
  // 4. STICKY HEADER SCROLL SHADOW
  // ==========================================
  const siteHeader = document.querySelector('header');
  if (siteHeader) {
    const onHeaderScroll = () => {
      if (window.scrollY > 10) {
        siteHeader.classList.add('header-scrolled');
      } else {
        siteHeader.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll(); // run once on load
  }

  // ==========================================
  // 4b. ACTIVE NAV LINK HIGHLIGHTING
  // Detects current page and highlights the matching
  // desktop nav link, Home dropdown item, and mobile
  // menu link. Persists correctly on scroll.
  // ==========================================
  (function() {
    // Get current filename (e.g. "index.html", "programs.html")
    const path = window.location.pathname;
    const currentFile = path.split('/').pop() || 'index.html';

    // Active style tokens
    const ACTIVE_TEXT   = ['text-brand-600', 'dark:text-brand-400'];
    const ACTIVE_FONT   = ['font-semibold'];
    const DEFAULT_TEXT  = ['text-slate-600', 'dark:text-slate-300'];

    // ── Desktop nav links (direct <a> elements) ──
    const desktopNavLinks = document.querySelectorAll('nav.hidden.lg\\:flex a[href]');
    desktopNavLinks.forEach(link => {
      const linkFile = link.getAttribute('href').split('/').pop();
      if (linkFile === currentFile) {
        DEFAULT_TEXT.forEach(c => link.classList.remove(c));
        ACTIVE_TEXT.forEach(c => link.classList.add(c));
        ACTIVE_FONT.forEach(c => link.classList.add(c));
      }
    });

    // ── Desktop Home dropdown items ──
    const homeDropdownItems = document.querySelectorAll('#home-dropdown-menu a[href]');
    let homeIsActive = false;
    homeDropdownItems.forEach(item => {
      const itemFile = item.getAttribute('href').split('/').pop();
      if (itemFile === currentFile) {
        homeIsActive = true;
        // Highlight the dropdown item
        item.classList.add('bg-brand-50', 'dark:bg-slate-700', 'text-brand-600', 'dark:text-brand-400', 'font-semibold');
      }
    });
    // If on a home page, also highlight the "Home" dropdown button
    if (homeIsActive) {
      const homeBtn = document.getElementById('home-dropdown-btn');
      if (homeBtn) {
        homeBtn.querySelectorAll('.text-slate-600, .dark\\:text-slate-300')
          .forEach(el => { el.classList.remove('text-slate-600'); });
        homeBtn.classList.remove('text-slate-600', 'dark:text-slate-300');
        ACTIVE_TEXT.forEach(c => homeBtn.classList.add(c));
        ACTIVE_FONT.forEach(c => homeBtn.classList.add(c));
      }
    }

    // ── Mobile menu direct links ──
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a[href]');
    mobileMenuLinks.forEach(link => {
      const linkFile = link.getAttribute('href').split('/').pop();
      if (linkFile === currentFile) {
        link.classList.add('text-brand-600', 'dark:text-brand-400', 'font-semibold');
        link.classList.remove('text-slate-700', 'text-slate-600', 'dark:text-slate-200');
      }
    });

    // ── Mobile Home sub-dropdown: highlight current home item ──
    const mobileHomeItems = document.querySelectorAll('#mobile-home-dropdown-menu a[href]');
    let mobileHomeActive = false;
    mobileHomeItems.forEach(item => {
      const itemFile = item.getAttribute('href').split('/').pop();
      if (itemFile === currentFile) {
        mobileHomeActive = true;
        item.classList.add('text-brand-600', 'dark:text-brand-400', 'font-semibold');
        item.classList.remove('text-slate-600', 'dark:text-slate-200');
      }
    });
    // If on a home page, auto-expand the mobile home dropdown and style its toggle button
    if (mobileHomeActive) {
      const mobileHomeMenu = document.getElementById('mobile-home-dropdown-menu');
      const mobileHomeBtn  = document.getElementById('mobile-home-dropdown-btn');
      if (mobileHomeMenu) mobileHomeMenu.classList.remove('hidden');
      if (mobileHomeBtn) {
        const arrow = mobileHomeBtn.querySelector('.dropdown-arrow');
        if (arrow) arrow.classList.add('rotate-180');
        mobileHomeBtn.classList.add('text-brand-600', 'dark:text-brand-400', 'font-semibold');
        mobileHomeBtn.classList.remove('text-slate-700', 'dark:text-slate-200');
      }
    }
  })();

  // ==========================================
  // 5. MOBILE MENU & HOME DROPDOWNS
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenu) {

    function openMobileMenu() {
      mobileMenu.classList.remove('hidden');
      if (menuIconOpen) menuIconOpen.classList.add('hidden');
      if (menuIconClose) menuIconClose.classList.remove('hidden');
    }

    function closeMobileMenu() {
      mobileMenu.classList.add('hidden');
      if (menuIconOpen) menuIconOpen.classList.remove('hidden');
      if (menuIconClose) menuIconClose.classList.add('hidden');
    }

    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.contains('hidden') ? openMobileMenu() : closeMobileMenu();
    });

    // Close menu when resizing past mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1280) closeMobileMenu();
    });
  }

  // Dropdown behaviour for Home Link
  const homeDropdownBtn = document.getElementById('home-dropdown-btn');
  const homeDropdownMenu = document.getElementById('home-dropdown-menu');
  const homeDropdownContainer = homeDropdownBtn ? homeDropdownBtn.closest('.relative') : null;

  if (homeDropdownBtn && homeDropdownMenu && homeDropdownContainer) {
    let hideTimer = null;

    const showDropdown = () => {
      clearTimeout(hideTimer);
      homeDropdownMenu.classList.remove('hidden');
      const arrow = homeDropdownBtn.querySelector('.dropdown-arrow');
      if (arrow) arrow.classList.add('rotate-180');
    };

    const hideDropdown = () => {
      hideTimer = setTimeout(() => {
        homeDropdownMenu.classList.add('hidden');
        const arrow = homeDropdownBtn.querySelector('.dropdown-arrow');
        if (arrow) arrow.classList.remove('rotate-180');
      }, 150);
    };

    // Desktop hover (mouseenter/mouseleave on whole container)
    homeDropdownContainer.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) showDropdown();
    });
    homeDropdownContainer.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) hideDropdown();
    });
    homeDropdownMenu.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    homeDropdownMenu.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) hideDropdown();
    });

    // Click toggle (mobile + desktop)
    homeDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = homeDropdownMenu.classList.contains('hidden');
      if (isHidden) {
        showDropdown();
      } else {
        homeDropdownMenu.classList.add('hidden');
        const arrow = homeDropdownBtn.querySelector('.dropdown-arrow');
        if (arrow) arrow.classList.remove('rotate-180');
      }
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
      if (!homeDropdownContainer.contains(e.target)) {
        homeDropdownMenu.classList.add('hidden');
        const arrow = homeDropdownBtn.querySelector('.dropdown-arrow');
        if (arrow) arrow.classList.remove('rotate-180');
      }
    });
  }

  // Mobile menu sub-dropdown for home
  const mobileHomeDropdownBtn = document.getElementById('mobile-home-dropdown-btn');
  const mobileHomeDropdownMenu = document.getElementById('mobile-home-dropdown-menu');
  if (mobileHomeDropdownBtn && mobileHomeDropdownMenu) {
    mobileHomeDropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mobileHomeDropdownMenu.classList.toggle('hidden');
      const arrow = mobileHomeDropdownBtn.querySelector('.dropdown-arrow');
      if (arrow) {
        arrow.classList.toggle('rotate-180');
      }
    });
  }

  // ==========================================
  // 5. BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 6. ACCORDION / FAQ COMPONENT
  // ==========================================
  const faqButtons = document.querySelectorAll('.faq-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isOpen = !panel.classList.contains('hidden');
      
      // Close all other panels
      document.querySelectorAll('.faq-panel').forEach(p => p.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      if (!isOpen) {
        panel.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  // ==========================================
  // 7. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('academy-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const successAlert = document.getElementById('contact-success-alert');
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        
        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Message';
          if (successAlert) {
            successAlert.classList.remove('hidden');
            setTimeout(() => {
              successAlert.classList.add('hidden');
            }, 5000);
          }
        }, 1500);
      }
    });
  }

  // ==========================================
  // 8. STUDENT LOGIN & REGISTRATION REDIRECTION
  // ==========================================
  const loginForm = document.getElementById('student-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (email && password) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Signing In...';
        
        // Simulating login auth
        setTimeout(() => {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('studentEmail', email);
          window.location.href = 'dashboard.html';
        }, 1200);
      }
    });
  }

  const registerForm = document.getElementById('student-register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      if (name && email && password) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Creating Account...';
        
        setTimeout(() => {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('studentEmail', email);
          window.location.href = 'dashboard.html';
        }, 1200);
      }
    });
  }

  // Password visibility toggle
  const togglePassBtns = document.querySelectorAll('.toggle-password-btn');
  togglePassBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        const eyeIcon = btn.querySelector('.eye-icon');
        if (eyeIcon) {
          if (type === 'text') {
            eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
          } else {
            eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />`;
          }
        }
      }
    });
  });

  // ==========================================
  // 9. STUDENT DASHBOARD INTERACTIVE ACTIONS
  // ==========================================
  const dashboardContainer = document.getElementById('student-dashboard');
  if (dashboardContainer) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      window.location.href = 'login.html';
    }

    // Set student email/name dynamically
    const studentEmail = localStorage.getItem('studentEmail') || 'alex.coder@academy.com';
    const emailDisplay = document.getElementById('student-email-display');
    const nameDisplay = document.getElementById('student-name-display');
    const navName = document.getElementById('nav-student-name');
    if (emailDisplay) emailDisplay.textContent = studentEmail;
    if (nameDisplay || navName) {
      const namePart = studentEmail.split('@')[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      if (nameDisplay) nameDisplay.textContent = capitalized;
      if (navName) navName.textContent = capitalized;
      
      const mobileNameDisplays = document.querySelectorAll('.mobile-student-name');
      mobileNameDisplays.forEach(el => el.textContent = capitalized);

      const avatarLetters = capitalized.substring(0, 2).toUpperCase();
      const mobileAvatars = document.querySelectorAll('.mobile-student-avatar');
      mobileAvatars.forEach(el => el.textContent = avatarLetters);
    }

    // Logout function
    const logoutBtn = document.getElementById('dashboard-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('studentEmail');
        window.location.href = 'login.html';
      });
    }

    // Lesson Progression simulation
    const lessonItems = document.querySelectorAll('.lesson-item');
    const lessonTitle = document.getElementById('current-lesson-title');
    const lessonDescription = document.getElementById('current-lesson-desc');
    const lessonVideo = document.getElementById('current-lesson-video');
    const lessonCodeExercise = document.getElementById('coding-editor-instruction');
    const exerciseCodeTextarea = document.getElementById('code-editor-textarea');
    const runCodeBtn = document.getElementById('run-code-btn');
    const codeOutput = document.getElementById('code-output');

    // Exercise feedback responses mapped to lessons
    const lessonContentMap = {
      'lesson-1': {
        title: '1. Welcome to the Smart City Grid',
        desc: 'In this lesson, you will learn the basics of visual sensors and how grid systems control city traffic lights using microcontrollers.',
        exercise: 'Instructions: Complete the code logic to turn on the green LED when a car approaches. Set `car_present = true`.',
        code: '# Python Smart Grid Code\ncar_present = False\n\nif car_present:\n    print("Green Light ON")\nelse:\n    print("Red Light ON")',
        correct: 'Green Light ON'
      },
      'lesson-2': {
        title: '2. Basic Loops & Movement',
        desc: 'Learn how to program a continuous loop that instructs your robotic delivery drone to move forward until an obstacle is detected by its ultrasonic rangefinder.',
        exercise: 'Instructions: Write a `while` loop that prints "Drone flying forward..." for 3 iterations, then stops.',
        code: '# Loop Simulation\ncounter = 0\n# Complete the while loop:\n',
        correct: 'Drone flying forward...'
      },
      'lesson-3': {
        title: '3. Sensor Inputs & Conditions',
        desc: 'Explore thermal and light sensors. Program a smart light threshold switch that automatically triggers outdoor yard lighting when ambient light drops below 40%.',
        exercise: 'Instructions: Program a conditional to check if `light_level < 40`. If true, set `lights = "ON"`.',
        code: 'light_level = 35\nlights = "OFF"\n# Add code here:',
        correct: 'lights = "ON"'
      }
    };

    lessonItems.forEach(item => {
      item.addEventListener('click', () => {
        const lessonId = item.getAttribute('data-lesson-id');
        
        // Remove active class from all lessons across both layouts
        lessonItems.forEach(i => {
          i.classList.remove('bg-brand-50', 'dark:bg-slate-700', 'border-brand-300');
          i.classList.add('border-slate-100', 'dark:border-slate-700');
          // Reset default indicator if it wasn't completed (i.e. does not have checkmark)
          const statusIcon = i.querySelector('.status-icon');
          if (statusIcon && !statusIcon.querySelector('svg.text-emerald-500')) {
            statusIcon.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 block m-1"></span>';
          }
        });

        // Apply active classes to all items matching the clicked lessonId (both desktop sidebar and mobile list)
        const matchedItems = document.querySelectorAll(`.lesson-item[data-lesson-id="${lessonId}"]`);
        matchedItems.forEach(matched => {
          matched.classList.remove('border-slate-100', 'dark:border-slate-700');
          matched.classList.add('bg-brand-50', 'dark:bg-slate-700', 'border-brand-300');
          
          const statusIcon = matched.querySelector('.status-icon');
          if (statusIcon && !statusIcon.querySelector('svg.text-emerald-500')) {
            statusIcon.innerHTML = `<svg class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>`;
          }
        });

        const content = lessonContentMap[lessonId];
        if (content) {
          if (lessonTitle) lessonTitle.textContent = content.title;
          if (lessonDescription) lessonDescription.textContent = content.desc;
          if (lessonCodeExercise) lessonCodeExercise.textContent = content.exercise;
          if (exerciseCodeTextarea) exerciseCodeTextarea.value = content.code;
          if (codeOutput) {
            codeOutput.textContent = 'Click "Run Code" to execute code...';
            codeOutput.classList.remove('text-green-500', 'text-red-500');
          }
        }
      });
    });

    // Run Code Button Simulation
    if (runCodeBtn && exerciseCodeTextarea && codeOutput) {
      runCodeBtn.addEventListener('click', () => {
        codeOutput.textContent = 'Compiling and executing code...';
        codeOutput.classList.remove('text-green-500', 'text-red-500');

        setTimeout(() => {
          const currentCode = exerciseCodeTextarea.value;
          // Simple mock validator based on current active lesson
          const activeItem = document.querySelector('.lesson-item.bg-brand-50');
          const lessonId = activeItem ? activeItem.getAttribute('data-lesson-id') : 'lesson-1';
          
          if (lessonId === 'lesson-1') {
            if (currentCode.includes('car_present = True') || currentCode.includes('car_present=True')) {
              codeOutput.textContent = 'Output:\nGreen Light ON\n\nSuccess! Light triggered successfully. Coding exercise complete!';
              codeOutput.classList.add('text-green-500');
              markLessonComplete(activeItem);
            } else {
              codeOutput.textContent = 'Output:\nRed Light ON\n\nError: Car presence was not set to True. Please modify the code and try again.';
              codeOutput.classList.add('text-red-500');
            }
          } else {
            // General success for other lessons to make it friendly
            codeOutput.textContent = 'Output:\nCompilation Successful!\nCode ran without errors. Great job!';
            codeOutput.classList.add('text-green-500');
            markLessonComplete(activeItem);
          }
        }, 1000);
      });
    }

    // Mark Lesson Complete
    function markLessonComplete(lessonElement) {
      if (!lessonElement) return;
      const lessonId = lessonElement.getAttribute('data-lesson-id');
      const matchedItems = document.querySelectorAll(`.lesson-item[data-lesson-id="${lessonId}"]`);
      
      matchedItems.forEach(matched => {
        const statusIcon = matched.querySelector('.status-icon');
        if (statusIcon) {
          // Change from dot or play icon to a green checkmark
          statusIcon.innerHTML = `
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          `;
        }
      });
      
      // Update Progress Bar
      updateDashboardProgress();
    }

    // Update Dashboard Progress Bar and count
    function updateDashboardProgress() {
      const totalLessons = 3; // There are exactly 3 lessons in the syllabus
      let completedLessons = 0;
      for (let i = 1; i <= totalLessons; i++) {
        const items = document.querySelectorAll(`.lesson-item[data-lesson-id="lesson-${i}"]`);
        const isCompleted = Array.from(items).some(item => item.querySelector('svg.text-emerald-500'));
        if (isCompleted) {
          completedLessons++;
        }
      }
      
      const progressPercent = Math.min(Math.round(((completedLessons + 2) / (totalLessons + 2)) * 100), 100); // offset starting at 2 completed lessons

      const progressBar = document.getElementById('dashboard-progress-bar');
      const progressText = document.getElementById('dashboard-progress-text');
      
      if (progressBar) progressBar.style.width = `${progressPercent}%`;
      if (progressText) progressText.textContent = `${progressPercent}%`;

      // Unlock badges if we reach milestones
      const sensorSlayerBadge = document.getElementById('badge-sensor');
      if (progressPercent >= 60 && sensorSlayerBadge) {
        sensorSlayerBadge.classList.remove('opacity-40', 'grayscale');
        sensorSlayerBadge.querySelector('.badge-title').textContent = 'Sensor Slayer (Unlocked)';
      }
    }

    // Assignment/Project Submission form simulation
    const projectForm = document.getElementById('dashboard-project-form');
    if (projectForm) {
      projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = projectForm.querySelector('button[type="submit"]');
        const feedbackArea = document.getElementById('project-feedback-area');
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Uploading File...';
          
          setTimeout(() => {
            submitBtn.innerHTML = 'Submitting...';
            setTimeout(() => {
              submitBtn.innerHTML = 'Submitted Successfully';
              submitBtn.classList.remove('bg-brand-600', 'hover:bg-brand-700');
              submitBtn.classList.add('bg-emerald-600', 'text-white');
              projectForm.reset();

              // Mock feedback appearing instantly
              if (feedbackArea) {
                feedbackArea.innerHTML = `
                  <div class="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl mb-4">
                    <div class="flex justify-between items-start mb-2">
                      <span class="font-bold text-emerald-800 dark:text-emerald-300">Grade: Excellent (95/100)</span>
                      <span class="text-xs text-slate-500">Just Now</span>
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Excellent smart traffic sensor project! Your coding flow matches the logic. Your wiring is clean and demonstrates strong sensor integrations. Keep it up!</p>
                    <p class="text-xs mt-2 text-brand-600 dark:text-brand-400 font-semibold">— Feedback by Lead Robotics Coach Sarah</p>
                  </div>
                  <div class="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div class="flex justify-between items-start mb-2">
                      <span class="font-bold text-slate-700 dark:text-slate-300">Grade: Approved (88/100)</span>
                      <span class="text-xs text-slate-500">2 Days Ago</span>
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Great progress on your Scratch Game. The collision logic functions smoothly, but remember to add custom score labels next time.</p>
                    <p class="text-xs mt-2 text-brand-600 dark:text-brand-400 font-semibold">— Feedback by Scratch Specialist Emily</p>
                  </div>
                `;
              }
            }, 1000);
          }, 1000);
        }
      });
    }
  }

  // ==========================================
  // 9. DASHBOARD NAVIGATION INTERCEPT
  // ==========================================
  const dashboardNavLinks = document.querySelectorAll('.dashboard-nav-link');
  dashboardNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'login.html';
      }
    });
  });
});


