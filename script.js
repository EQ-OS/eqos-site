window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('active');
}
function scrollToSection(id) {
    const s = document.getElementById(id);
    if (s) s.scrollIntoView({ behavior: 'smooth' });
}

// Intersection Observer animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-card, .problem-card, .app-detail, .market-card, .team-card, .value-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all .6s ease';
    observer.observe(el);
});

// Form handling: send via Formspree or FormSubmit fallback
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = 'Envoi en cours...';
        const formData = new FormData(form);
        const endpoint = form.getAttribute('action');

        // If user did not replace endpoint, use FormSubmit as temporary fallback (requires email confirmation)
        let url = endpoint && endpoint !== 'REPLACE_WITH_FORMSPREE_ENDPOINT'
            ? endpoint
            : 'https://formsubmit.co/contact@e-qos.com';

        try {
            const res = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                status.textContent = 'Merci — votre message a été envoyé.';
                form.reset();
            } else {
                const data = await res.json().catch(() => null);
                status.textContent = (data && data.error)
                    ? data.error
                    : 'Erreur lors de l\'envoi — réessayez.';
            }
        } catch (err) {
            console.error(err);
            status.textContent = 'Impossible d\'envoyer le message. Vérifiez votre connexion.';
        }
    });
}