document.addEventListener('DOMContentLoaded', () => {
    
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
