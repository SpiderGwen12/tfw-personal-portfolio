document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       DYNAMIC HOBBIES INJECTION
       ========================================================================== */
    const hobbiesData = [
        {
            title: "Reading",
            category: "Books I Cherish",
            icon: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1h13.5v16H6.5a2.5 2.5 0 0 0-2.5 2.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            items: [
                { name: "A Good Girl's Guide to Murder", url: "https://www.penguinrandomhouse.com/series/2G4/a-good-girls-guide-to-murder" },
                { name: "Harry Potter", url: "https://www.wizardingworld.com" },
                { name: "The Sherlock Holmes", url: "https://www.conandoyleestate.com/" }
            ]
        },
        {
            title: "Binge Watching",
            category: "Shows I Love",
            icon: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 2 12 7 7 2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            items: [
                { name: "Wednesday", url: "https://www.netflix.com/title/81231974" },
                { name: "Stranger Things", url: "https://www.netflix.com/title/80057281" },
                { name: "Just Add Magic", url: "https://www.amazon.com/dp/B00O9S4Z2S" }
            ]
        },
        {
            title: "Bharatanatyam",
            category: "Classical Dance",
            icon: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            image: "bharatanatyam.png"
        },
        {
            title: "Music",
            category: "Melodies & Rhythms",
            icon: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6-3 3 3 0 0 1 6 3zm12-2a3 3 0 1 1-6-3 3 3 0 0 1 6 3z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            items: [
                { name: "Sweater Weather", url: "https://www.youtube.com/watch?v=GCdwMSWK_GE" },
                { name: "Stay", url: "https://www.youtube.com/watch?v=kTJczUoc26U" },
                { name: "Ain't Worried", url: "https://www.youtube.com/watch?v=mNEW1D9Yy9c" },
                { name: "House of Memories", url: "https://www.youtube.com/watch?v=KuliCkN2oic" }
            ]
        }
    ];

    const hobbiesContainer = document.getElementById('hobbies-container');
    if (hobbiesContainer) {
        hobbiesData.forEach((hobby, index) => {
            const card = document.createElement('div');
            card.className = `hobby-card reveal reveal-delay-${(index % 4) + 1}`;
            card.id = `hobby-card-${hobby.title.toLowerCase().replace(/\\s+/g, '-')}`;
            
            let bodyContent = '';
            if (hobby.items) {
                bodyContent = `
                    <ul class="hobby-items-list">
                        \${hobby.items.map(item => `
                            <li>
                                <a href="\${item.url}" target="_blank" rel="noopener noreferrer" class="hobby-item-link">
                                    <span>\${item.name}</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="external-link-icon">
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7 7 17 7 17 17"></polyline>
                                    </svg>
                                </a>
                            </li>
                        \`).join('')}
                    </ul>
                `;
            } else if (hobby.image) {
                bodyContent = `
                    <div class="hobby-image-container">
                        <img src="\${hobby.image}" alt="Bharatanatyam Dancer" class="hobby-image" loading="lazy">
                        <div class="hobby-image-overlay">
                            <span>Traditional Classical Dance Form</span>
                        </div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="hobby-header">
                    <div class="hobby-icon-box">\${hobby.icon}</div>
                    <span class="hobby-category">\${hobby.category}</span>
                    <h3 class="hobby-title">\${hobby.title}</h3>
                </div>
                <div class="hobby-body">
                    \${bodyContent}
                </div>
            `;
            hobbiesContainer.appendChild(card);
        });
    }

    /* ==========================================================================
       SCROLL INDICATORS & NAV STATE
       ========================================================================== */
    const header = document.getElementById('main-header');

    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check on load

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once it has revealed, we can stop observing it
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element enters the viewport
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    /* ==========================================================================
       COPY EMAIL TO CLIPBOARD
       ========================================================================== */
    const emailBtn = document.getElementById('email-btn');
    const toast = document.getElementById('toast');

    if (emailBtn && toast) {
        emailBtn.addEventListener('click', () => {
            const emailText = 'mohashanbhag123@gmail.com';

            // Modern Clipboard API
            navigator.clipboard.writeText(emailText).then(() => {
                showToast();
            }).catch(err => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = emailText;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast();
                } catch (e) {
                    console.error('Failed to copy email: ', e);
                }
                document.body.removeChild(textArea);
            });
        });
    }

    function showToast() {
        toast.classList.add('show');

        // Add a micro-effect to the button
        emailBtn.style.transform = 'scale(0.97)';
        setTimeout(() => {
            emailBtn.style.transform = '';
        }, 150);

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    /* ==========================================================================
       INTERACTIVE CANVAS STARBACKDROP (MAGICAL PARTICLES)
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        const particleCount = window.innerWidth < 768 ? 35 : 70;

        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle Class definition
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height + canvas.height; // Start below screen or randomly
                if (Math.random() > 0.5) this.y = Math.random() * canvas.height; // Spread initially

                this.size = Math.random() * 1.5 + 0.5; // Small, elegant dots
                this.speedY = -(Math.random() * 0.4 + 0.1); // Float upwards slowly
                this.speedX = (Math.random() - 0.5) * 0.2; // Tiny drift
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;

                // Color variation between soft ivory and gold glow
                this.color = Math.random() > 0.7
                    ? `rgba(207, 168, 74, ${this.opacity})` // Gold
                    : `rgba(245, 246, 249, ${this.opacity})`; // White/Ivory
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                // Slowly cycle opacity
                if (this.opacity <= 0.05 || this.y < -10) {
                    this.reset();
                    this.y = canvas.height + 10;
                }

                // Gentle gravity pull towards cursor if mouse is active and close
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 180) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (180 - distance) / 180; // strong force close to mouse
                        this.x += forceDirectionX * force * 0.4;
                        this.y += forceDirectionY * force * 0.4;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;

                // Add soft glow to gold particles
                if (this.color.includes('207')) {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = '#cfa84a';
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            }
        }

        // Initialize particle array
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();

        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Animation loop
        const animate = () => {
            // Semi-transparent clear to allow nice trails
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };
        animate();
    }

});
