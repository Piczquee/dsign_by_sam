// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if(navLinks.classList.contains('active')) {
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
    if(form) {
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
                if(!counter.hasAttribute('data-target')) {
                    counter.setAttribute('data-target', target);
                    counter.innerText = '0' + (counter.innerText.includes('+') ? '+' : counter.innerText.includes('%') ? '%' : '');
                }

                const finalTarget = +counter.getAttribute('data-target');
                const inc = finalTarget / speed;

                if (count < finalTarget) {
                    counter.setAttribute('data-count', Math.ceil(count + inc));
                    
                    let suffix = '';
                    if(counter.getAttribute('data-target') > 100 && !suffix.includes('+')) suffix = '+';
                    if(counter.getAttribute('data-target') == 100 && !suffix.includes('%')) suffix = '%';

                    counter.innerText = Math.ceil(count + inc) + suffix;
                    setTimeout(updateCount, 10);
                } else {
                    let suffix = '';
                    if(finalTarget > 100) suffix = '+';
                    if(finalTarget == 100) suffix = '%';
                    counter.innerText = finalTarget + suffix;
                }
            };
            
            // Intersection Observer to trigger animation when visible
            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) {
                    updateCount();
                    observer.disconnect();
                }
            });
            observer.observe(counter);
        });
    }
    animateCounters();
});
