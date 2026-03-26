// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Sticky Navbar & Active Link Update on Scroll
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        // Sticky Nav
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // 3. Product Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                card.style.display = 'none'; // Hide all
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block'; // Show matched
                }
            });
        });
    });

    // 4. Contact Form Submission (Mock)
    const form = document.getElementById('inquiryForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                alert('Thank you! Your message has been sent to DSIGN_BY_SAM. We will get back to you soon.');
                form.reset();
                btn.innerHTML = originalText;
            }, 1500);
        });
    }

    // 5. Stat Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.innerText.replace(/\D/g, ''); // Extract number
                const count = +counter.getAttribute('data-count') || 0;

                // Initialize the attribute if it's the first time
                if (!counter.hasAttribute('data-target')) {
                    counter.setAttribute('data-target', target);
                    counter.innerText = '0' + (counter.innerText.includes('+') ? '+' : counter.innerText.includes('%') ? '%' : '');
                }

                const finalTarget = +counter.getAttribute('data-target');
                const inc = finalTarget / speed;

                if (count < finalTarget) {
                    counter.setAttribute('data-count', Math.ceil(count + inc));

                    let suffix = '';
                    if (counter.getAttribute('data-target') > 100 && !suffix.includes('+')) suffix = '+';
                    if (counter.getAttribute('data-target') == 100 && !suffix.includes('%')) suffix = '%';

                    counter.innerText = Math.ceil(count + inc) + suffix;
                    setTimeout(updateCount, 10);
                } else {
                    let suffix = '';
                    if (finalTarget > 100) suffix = '+';
                    if (finalTarget == 100) suffix = '%';
                    counter.innerText = finalTarget + suffix;
                }
            };

            // Intersection Observer to trigger animation when visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCount();
                    observer.disconnect();
                }
            });
            observer.observe(counter);
        });
    }
    animateCounters();

    // ==========================================
    // 6. Supabase Authentication Layer (E-Commerce)
    // ==========================================
    // TODO: Replace these with your actual Supabase URL and Anon Key!
    const SUPABASE_URL = 'https://hgmjxzsivucowmtjelij.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_UFBm_PdNVovwn94IvsvYIw_X5GabOy_';

    const isSupabaseConfigured = SUPABASE_URL.startsWith('https://');
    let supabaseClient = null;

    const authOverlay = document.getElementById('auth-overlay');
    const authForm = document.getElementById('auth-form');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const authError = document.getElementById('auth-error');
    const authSuccess = document.getElementById('auth-success');
    const authBtn = document.getElementById('auth-btn');
    const toggleAuthLink = document.getElementById('toggle-auth-link');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const togglePassword = document.getElementById('toggle-password');

    let isLoginMode = true;

    // Toggle Password Visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = authPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            authPassword.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
            togglePassword.style.color = type === 'text' ? 'var(--primary-color)' : 'var(--text-muted)';
        });
    }

    // Toggle between Login and Sign Up Modes smoothly
    const toggleAuthMode = () => {
        isLoginMode = !isLoginMode;
        authError.style.display = 'none';
        authSuccess.style.display = 'none';

        // Clear credential values when toggling
        authEmail.value = '';
        authPassword.value = '';
        const nameInput = document.getElementById('auth-name');
        const nickInput = document.getElementById('auth-nickname');
        const phoneInput = document.getElementById('auth-phone');
        if (nameInput) nameInput.value = '';
        if (nickInput) nickInput.value = '';
        if (phoneInput) phoneInput.value = '';

        const signupFields = document.getElementById('signup-fields');
        if (isLoginMode) {
            authTitle.innerHTML = 'Log <span class="highlight">In</span>';
            authSubtitle.innerText = 'Welcome! Log in to access the store.';
            authBtn.innerText = 'Log In';
            toggleAuthLink.innerText = 'Sign Up';
            document.getElementById('toggle-auth-text').childNodes[0].nodeValue = "Don't have an account? ";
            if (signupFields) signupFields.style.display = 'none';
        } else {
            authTitle.innerHTML = 'Sign <span class="highlight">Up</span>';
            authSubtitle.innerText = 'Create an account to start shopping.';
            authBtn.innerText = 'Create Account';
            toggleAuthLink.innerText = 'Log In';
            document.getElementById('toggle-auth-text').childNodes[0].nodeValue = "Already have an account? ";
            if (signupFields) signupFields.style.display = 'block';
        }
    };

    if (toggleAuthLink) {
        toggleAuthLink.addEventListener('click', toggleAuthMode);
    }

    const lockStore = () => {
        document.body.classList.add('auth-locked');
        authOverlay.classList.add('active');
        window.scrollTo(0, 0); // Force to top
    };

    const userDisplayName = document.getElementById('user-display-name');

    const updateUserName = (session) => {
        if (!session || !userDisplayName) return;
        const meta = session.user.user_metadata;
        if (meta) {
            let name = meta.nick_name || meta.full_name;
            if (name) {
                userDisplayName.innerText = name;
                return;
            }
        }
        // Fallback to email identifier if metadata completely missing
        userDisplayName.innerText = session.user.email.split('@')[0];
    };

    const unlockStore = () => {
        document.body.classList.remove('auth-locked');
        authOverlay.classList.remove('active');
    };

    if (isSupabaseConfigured) {
        // Initialize Supabase from the CDN we imported in index.html
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // 1. Check current logged-in session on page load
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                updateUserName(session);
                unlockStore();
            } else {
                lockStore();
            }
        });

        // 2. Listen for auth state changes globally (Login / Logout)
        supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (session) {
                updateUserName(session);
                unlockStore();
            } else {
                lockStore();
            }
        });

        // 3. Handle Login/Signup Form Submission
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            authError.style.display = 'none';
            authSuccess.style.display = 'none';
            authBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            authBtn.disabled = true;

            const email = authEmail.value;
            const password = authPassword.value;

            try {
                if (isLoginMode) {
                    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    // Note: onAuthStateChange will automatically unlock the store if successful!
                } else {
                    const nameNode = document.getElementById('auth-name');
                    const nickNode = document.getElementById('auth-nickname');
                    const phoneNode = document.getElementById('auth-phone');
                    
                    const name = nameNode ? nameNode.value : '';
                    const nickname = nickNode ? nickNode.value : '';
                    const phone = phoneNode ? phoneNode.value : '';

                    if (!/^\d{10}$/.test(phone)) {
                        throw new Error("Please enter a valid 10-digit phone number.");
                    }

                    const { data, error } = await supabaseClient.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: name,
                                nick_name: nickname,
                                phone: phone
                            },
                            emailRedirectTo: window.location.href
                        }
                    });
                    
                    if (error) throw error;
                    
                    // Supabase returns an empty identities array if user already exists
                    if (data?.user && data.user?.identities && data.user.identities.length === 0) {
                        throw new Error("Account already exists for the email id provided.");
                    }
                    
                    authSuccess.innerText = 'Account created successfully! You can now log in.';
                    authSuccess.style.display = 'block';
                    // Switch back to Login mode for them to log in smoothly
                    setTimeout(toggleAuthMode, 2000);
                }
            } catch (err) {
                authError.innerText = err.message;
                authError.style.display = 'block';
            } finally {
                authBtn.innerText = isLoginMode ? 'Log In' : 'Create Account';
                authBtn.disabled = false;
            }
        });

    } else {
        // Setup is incomplete: User needs to provide Supabase Keys!
        lockStore();
        authError.innerHTML = "<strong>Setup Required:</strong> You need to add your Supabase URL and Anon Key inside script.js to activate the store.";
        authError.style.display = 'block';
        authBtn.disabled = true;
        authEmail.disabled = true;
        authPassword.disabled = true;
    }

    // ==========================================
    // 7. User Profile & Logout Logic
    // ==========================================
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userDropdown = document.getElementById('user-dropdown');
    const executeLogoutBtn = document.getElementById('logout-btn');

    // Toggle Dropdown Display
    if (userProfileBtn && userDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.style.display = userDropdown.style.display === 'none' ? 'flex' : 'none';
        });

        // Close dropdown when interacting outside the menu
        document.addEventListener('click', (e) => {
            if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.style.display = 'none';
            }
        });
    }

    // Execute Global Supabase Logout
    if (executeLogoutBtn && isSupabaseConfigured) {
        executeLogoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                // Instantly end session
                const { error } = await supabaseClient.auth.signOut();
                if (error) throw error;
                // auth.onAuthStateChange will automatically see the session drop and call lockStore()
                userDropdown.style.display = 'none'; // hide the dropdown 
            } catch (err) {
                console.error("Error logging out", err.message);
                alert("Failed to log out: " + err.message);
            }
        });
    }

    // ==========================================
    // 8. Product Modal Navigation
    // ==========================================
    const productModal = document.getElementById('product-modal');
    const closeProductModal = document.getElementById('close-product-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalQty = document.getElementById('modal-qty');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const modalCustomization = document.getElementById('modal-customization');

    if (productModal) {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Prevent opening if clicking heart/cart buttons specifically
                if (e.target.closest('.btn-icon')) return;

                const imgSrc = card.querySelector('img').src;
                const title = card.querySelector('h3').innerText;
                const price = card.querySelector('.price').innerText;

                // Bind Data
                modalImg.src = imgSrc;
                modalTitle.innerText = title;
                modalPrice.innerText = price;
                modalQty.value = 1; // Reset qty
                modalCustomization.value = ''; // Reset notes

                // Visual Overrides
                productModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; 
                // Scroll to top of modal
                productModal.scrollTo(0, 0);
            });
        });

        closeProductModal.addEventListener('click', () => {
            productModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Unlock scroll
        });

        // Quantity Logic
        qtyMinus.addEventListener('click', () => {
            if (parseInt(modalQty.value) > 1) modalQty.value = parseInt(modalQty.value) - 1;
        });

        qtyPlus.addEventListener('click', () => {
            if (parseInt(modalQty.value) < 99) modalQty.value = parseInt(modalQty.value) + 1;
        });

        // Add to Cart Logic
        addToCartBtn.addEventListener('click', () => {
            if (parseInt(modalQty.value) < 1) return;
            
            const originalText = addToCartBtn.innerHTML;
            addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            addToCartBtn.style.background = '#52c41a'; // Success green
            addToCartBtn.style.boxShadow = '0 4px 15px rgba(82, 196, 26, 0.4)';
            
            setTimeout(() => {
                addToCartBtn.innerHTML = originalText;
                addToCartBtn.style.background = '';
                addToCartBtn.style.boxShadow = '';
                productModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Unlock site background
            }, 1000);
        });
    }
});
