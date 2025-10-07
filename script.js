// =============================================
// EQOS - Gestionnaire d'Application Principal
// =============================================

class EQOSApp {
    constructor() {
        this.currentLang = 'fr';
        this.translations = {
            fr: this.getFrenchTranslations(),
            en: this.getEnglishTranslations(),
            ar: this.getArabicTranslations()
        };
        this.init();
    }

    // Initialisation de l'application
    init() {
        this.handleLoading();
        this.initNavigation();
        this.initLanguage();
        this.initAnimations();
        this.initContactForm();
        this.initBackToTop();
        this.initCounters();
        this.initParallax();
    }

    // Gestion de l'écran de chargement
    handleLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000);
        });
    }

    // Initialisation de la navigation
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.getElementById('navLinks');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

        // Effet de scroll sur la navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Gestion des touches du clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    // Menu mobile
    toggleMenu() {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    }

    closeMenu() {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.closeMenu();
        }
    }

    // Gestion des langues
    initLanguage() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.switchLanguage(lang);
            });
        });

        // Détection automatique de la langue
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.startsWith('en')) {
            this.switchLanguage('en');
        } else if (userLang.startsWith('ar')) {
            this.switchLanguage('ar');
        }
    }

    switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        
        // Mettre à jour les boutons de langue
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Animation de transition
        document.documentElement.style.opacity = '0.7';
        setTimeout(() => {
            this.updateContentLanguage(lang);
            document.documentElement.style.opacity = '1';
            
            // Mettre à jour l'attribut lang
            document.documentElement.lang = lang;
            
            // Mettre à jour la direction pour l'arabe
            if (lang === 'ar') {
                document.documentElement.dir = 'rtl';
            } else {
                document.documentElement.dir = 'ltr';
            }
        }, 300);
    }

    updateContentLanguage(lang) {
        const trans = this.translations[lang];
        
        // Mettre à jour tous les éléments avec data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (trans[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = trans[key];
                } else {
                    element.textContent = trans[key];
                }
            }
        });
    }

    // Animations
    initAnimations() {
        this.initAOS();
        this.initScrollAnimations();
    }

    initAOS() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Animation des compteurs
                    if (entry.target.classList.contains('stat-card')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observer les éléments pour l'animation
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    initScrollAnimations() {
        // Animation au scroll pour les éléments avec fade-in-up
        const fadeElements = document.querySelectorAll('.fade-in-up');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease 0.2s';
            fadeObserver.observe(el);
        });
    }

    // Compteurs animés
    initCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-card').forEach(card => {
            counterObserver.observe(card);
        });
    }

    animateCounter(statCard) {
        const numberElement = statCard.querySelector('.stat-number');
        const countAttribute = numberElement.getAttribute('data-count');
        
        if (!countAttribute) return; // Pour les compteurs sans data-count (100%, ∞)
        
        const finalValue = parseInt(countAttribute);
        let currentValue = 0;
        const duration = 2000;
        const increment = finalValue / (duration / 16);
        
        function updateCounter() {
            if (currentValue < finalValue) {
                currentValue += increment;
                numberElement.textContent = Math.floor(currentValue);
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = finalValue;
            }
        }
        
        // Réinitialiser pour re-animation
        numberElement.textContent = '0';
        updateCounter();
    }

    // Effet parallaxe
    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.gradient-orb');
            
            orbs.forEach((orb, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                orb.style.transform = `translateY(${yPos}px) scale(${1 - (scrolled * 0.0001)})`;
            });
        });
    }

    // Formulaire de contact
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                // Désactiver le bouton
                submitBtn.disabled = true;
                submitBtn.textContent = this.translations[this.currentLang].form_sending || 'Envoi en cours...';
                
                try {
                    // Simulation d'envoi - à remplacer par votre logique d'API
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    formMessage.textContent = this.translations[this.currentLang].form_success || 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.';
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    
                    contactForm.reset();
                    
                } catch (error) {
                    formMessage.textContent = this.translations[this.currentLang].form_error || 'Une erreur est survenue. Veuillez réessayer.';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    
                    // Cacher le message après 5 secondes
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                }
            });
        }
    }

    // Bouton retour en haut
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Traductions françaises
    getFrenchTranslations() {
        return {
            // Navigation
            nav_home: "Accueil",
            nav_about: "Qui sommes-nous",
            nav_apps: "Applications",
            nav_market: "Marché",
            nav_team: "Équipe",
            nav_contact: "Contact",
            
            // Hero
            hero_subtitle: "Entreprise Qualifiée dans les Offres et Services",
            hero_description: "Révolutionnons ensemble l'Afrique avec des solutions technologiques innovantes qui transforment l'emploi, le transport et l'agriculture",
            hero_cta1: "Découvrir nos solutions",
            hero_cta2: "Nous rejoindre",
            
            // Stats
            stat_apps: "Applications Innovantes",
            stat_countries: "Pays Ciblés",
            stat_digital: "Digital & Mobile",
            stat_potential: "Potentiel Africain",
            
            // About
            about_title: "Qui Sommes-Nous ?",
            about_subtitle: "EQOS est une entreprise innovante dédiée à la transformation digitale de l'Afrique",
            about_mission_title: "Notre Mission",
            about_mission_p1: "EQOS est née d'une vision simple mais ambitieuse : utiliser la technologie pour résoudre les défis quotidiens auxquels font face les communautés africaines. Nous croyons fermement que l'innovation digitale est la clé pour débloquer le potentiel immense de notre continent.",
            about_mission_p2: "À travers nos trois applications phares - Wali, Wandi et Makiti - nous créons un écosystème complet qui touche les aspects essentiels de la vie quotidienne : l'emploi, la mobilité et l'alimentation. Notre approche holistique permet de créer des synergies entre ces différents domaines pour maximiser l'impact positif sur nos utilisateurs.",
            
            // Values
            value_innovation_title: "Innovation",
            value_innovation_desc: "Nous développons des solutions technologiques adaptées aux réalités africaines",
            value_impact_title: "Impact Social",
            value_impact_desc: "Chaque solution vise à améliorer concrètement la vie de nos utilisateurs",
            value_sustainability_title: "Durabilité",
            value_sustainability_desc: "Nous promouvons une économie circulaire et respectueuse de l'environnement",
            value_excellence_title: "Excellence",
            value_excellence_desc: "Nous visons la qualité et la fiabilité dans tous nos produits",
            
            // Apps
            apps_title: "Nos Applications",
            apps_subtitle: "Trois solutions puissantes pour transformer l'Afrique",
            
            // Wali
            wali_slogan: "\"Plongez-vous dans l'instant de liberté que vous méritez.\"",
            wali_vision: "🎯 Vision : Simplifier la vie quotidienne des Africains grâce à la technologie",
            wali_description: "Wali est une application dédiée à la mise en relation de prestataires de services et de clients via une application mobile. Elle propose une large gamme de services tels que la livraison de produits, le nettoyage à domicile, les cours particuliers et plus encore.",
            wali_feature1: "Mise en relation instantanée avec des prestataires qualifiés",
            wali_feature2: "Large gamme de services disponibles 24/7",
            wali_feature3: "Système de notation et d'avis vérifiés",
            wali_feature4: "Paiement sécurisé et flexible",
            wali_feature5: "Suivi en temps réel de vos missions",
            download_wali: "Télécharger Wali",
            
            // Wandi
            wandi_slogan: "\"Voyagez ensemble, payez moins, connectez l'Afrique.\"",
            wandi_vision: "🌍 Vision : Offrir une solution de transport fiable, économique et respectueuse de l'environnement",
            wandi_description: "Wandi est l'application de covoiturage d'EQOS conçue pour faciliter les déplacements urbains et interurbains en Afrique. Elle permet aux conducteurs de proposer des trajets et aux passagers de réserver facilement une place, à moindre coût.",
            wandi_feature1: "Trajets urbains et interurbains accessibles",
            wandi_feature2: "Réduction des coûts de transport jusqu'à 70%",
            wandi_feature3: "Impact environnemental positif",
            wandi_feature4: "Communauté de confiance vérifiée",
            wandi_feature5: "Réservation simple et rapide",
            download_wandi: "Télécharger Wandi",
            
            // Makiti
            makiti_slogan: "\"Du champ à l'assiette, sans détour.\"",
            makiti_vision: "🌾 Vision : Encourager une agriculture durable et une consommation responsable",
            makiti_description: "Makiti est la marketplace digitale d'EQOS dédiée à la vente en ligne de produits alimentaires issus de l'agriculture locale. Elle met en relation directe les producteurs et les consommateurs, sans intermédiaires.",
            makiti_feature1: "Connexion directe producteurs-consommateurs",
            makiti_feature2: "Produits frais et locaux garantis",
            makiti_feature3: "Prix justes pour tous",
            makiti_feature4: "Soutien à l'économie rurale",
            makiti_feature5: "Livraison rapide et traçabilité complète",
            download_makiti: "Télécharger Makiti",
            
            // Market
            market_title: "Notre Marché",
            market_subtitle: "Une stratégie de croissance ambitieuse pour l'Afrique",
            market_geo_title: "Zone Géographique",
            market_geo_1: "Lancement initial : Guinée, Mali, Sénégal",
            market_geo_2: "Phase 2 : Expansion Afrique de l'Ouest",
            market_geo_3: "Phase 3 : Déploiement continental",
            market_geo_4: "Vision long terme : Toute l'Afrique",
            market_users_title: "Utilisateurs Cibles",
            market_users_1: "Jeunes entrepreneurs et professionnels",
            market_users_2: "Familles urbaines et périurbaines",
            market_users_3: "Agriculteurs et producteurs locaux",
            market_users_4: "PME et commerces de proximité",
            market_users_5: "Restaurateurs et collectivités",
            market_model_title: "Modèle Économique",
            market_model_1: "Commissions sur missions Wali",
            market_model_2: "Frais de trajets covoiturage Wandi",
            market_model_3: "Commissions sur ventes Makiti",
            market_model_4: "Publicité ciblée multi-plateformes",
            market_model_5: "Partenariats stratégiques B2B",
            
            // Team
            team_title: "Notre Équipe",
            team_subtitle: "Des experts passionnés par l'innovation africaine",
            team_direction_title: "Direction Générale",
            team_direction_role: "Leadership & Vision",
            team_direction_desc: "Pilotage stratégique et développement de l'écosystème EQOS",
            team_tech_title: "Équipe Technique",
            team_tech_role: "Développement & Innovation",
            team_tech_desc: "Conception et maintenance des plateformes digitales",
            team_marketing_title: "Marketing & Business",
            team_marketing_role: "Croissance & Partenariats",
            team_marketing_desc: "Développement commercial et stratégies d'acquisition",
            team_support_title: "Service Client",
            team_support_role: "Support & Satisfaction",
            team_support_desc: "Accompagnement et support utilisateurs 24/7",
            
            // Contact
            contact_title: "Contactez-Nous",
            contact_subtitle: "Rejoignez l'aventure EQOS ou posez-nous vos questions",
            contact_address_title: "Adresse",
            contact_phone_title: "Téléphone",
            contact_social_title: "Réseaux Sociaux",
            
            // Form
            form_name: "Nom complet",
            form_subject: "Sujet",
            form_message: "Message",
            form_submit: "Envoyer le message",
            form_sending: "Envoi en cours...",
            form_success: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
            form_error: "Une erreur est survenue. Veuillez réessayer.",
            
            // CTA
            cta_title: "Rejoignez la Révolution EQOS",
            cta_description: "Téléchargez nos applications et transformez votre quotidien dès aujourd'hui",
            cta_wali: "Télécharger Wali",
            cta_wandi: "Télécharger Wandi",
            cta_makiti: "Télécharger Makiti",
            
            // Footer
            footer_description: "Entreprise Qualifiée dans les Offres et Services. Nous transformons l'Afrique grâce à l'innovation technologique et des solutions adaptées aux réalités locales.",
            footer_apps: "Applications",
            footer_company: "Entreprise",
            footer_about: "À propos",
            footer_team: "Équipe",
            footer_market: "Marché",
            footer_contact: "Contact",
            footer_legal: "Légal",
            footer_legal_mentions: "Mentions légales",
            footer_privacy: "Confidentialité",
            footer_terms: "CGU",
            footer_cookies: "Cookies",
            footer_rights: "Tous droits réservés"
        };
    }

    getEnglishTranslations() {
        return {
            // Navigation
            nav_home: "Home",
            nav_about: "About Us",
            nav_apps: "Applications",
            nav_market: "Market",
            nav_team: "Team",
            nav_contact: "Contact",
            
            // Hero
            hero_subtitle: "Qualified Company in Offers and Services",
            hero_description: "Let's revolutionize Africa together with innovative technological solutions that transform employment, transportation and agriculture",
            hero_cta1: "Discover our solutions",
            hero_cta2: "Join us",
            
            // Stats
            stat_apps: "Innovative Applications",
            stat_countries: "Targeted Countries",
            stat_digital: "Digital & Mobile",
            stat_potential: "African Potential",
            
            // About
            about_title: "Who We Are?",
            about_subtitle: "EQOS is an innovative company dedicated to Africa's digital transformation",
            about_mission_title: "Our Mission",
            about_mission_p1: "EQOS was born from a simple but ambitious vision: to use technology to solve the daily challenges facing African communities. We firmly believe that digital innovation is the key to unlocking the immense potential of our continent.",
            about_mission_p2: "Through our three flagship applications - Wali, Wandi and Makiti - we create a complete ecosystem that touches the essential aspects of daily life: employment, mobility and food. Our holistic approach creates synergies between these different areas to maximize positive impact on our users.",
            
            // Values
            value_innovation_title: "Innovation",
            value_innovation_desc: "We develop technological solutions adapted to African realities",
            value_impact_title: "Social Impact",
            value_impact_desc: "Each solution aims to concretely improve the lives of our users",
            value_sustainability_title: "Sustainability",
            value_sustainability_desc: "We promote a circular and environmentally friendly economy",
            value_excellence_title: "Excellence",
            value_excellence_desc: "We aim for quality and reliability in all our products",
            
            // Apps
            apps_title: "Our Applications",
            apps_subtitle: "Three powerful solutions to transform Africa",
            
            // Wali
            wali_slogan: "\"Immerse yourself in the moment of freedom you deserve.\"",
            wali_vision: "🎯 Vision: Simplify daily life for Africans through technology",
            wali_description: "Wali is an application dedicated to connecting service providers and customers via a mobile application. It offers a wide range of services such as product delivery, home cleaning, private lessons and more.",
            wali_feature1: "Instant connection with qualified providers",
            wali_feature2: "Wide range of services available 24/7",
            wali_feature3: "Verified rating and review system",
            wali_feature4: "Secure and flexible payment",
            wali_feature5: "Real-time mission tracking",
            download_wali: "Download Wali",
            
            // Wandi
            wandi_slogan: "\"Travel together, pay less, connect Africa.\"",
            wandi_vision: "🌍 Vision: Provide reliable, economical and environmentally friendly transport solution",
            wandi_description: "Wandi is EQOS's carpooling application designed to facilitate urban and interurban travel in Africa. It allows drivers to offer trips and passengers to easily book a seat at lower cost.",
            wandi_feature1: "Accessible urban and interurban trips",
            wandi_feature2: "Transport cost reduction up to 70%",
            wandi_feature3: "Positive environmental impact",
            wandi_feature4: "Verified trust community",
            wandi_feature5: "Simple and quick reservation",
            download_wandi: "Download Wandi",
            
            // Makiti
            makiti_slogan: "\"From field to plate, without detours.\"",
            makiti_vision: "🌾 Vision: Encourage sustainable agriculture and responsible consumption",
            makiti_description: "Makiti is EQOS's digital marketplace dedicated to online sales of food products from local agriculture. It directly connects producers and consumers, without intermediaries.",
            makiti_feature1: "Direct producer-consumer connection",
            makiti_feature2: "Guaranteed fresh and local products",
            makiti_feature3: "Fair prices for all",
            makiti_feature4: "Support for rural economy",
            makiti_feature5: "Fast delivery and complete traceability",
            download_makiti: "Download Makiti",
            
            // Market
            market_title: "Our Market",
            market_subtitle: "An ambitious growth strategy for Africa",
            market_geo_title: "Geographical Area",
            market_geo_1: "Initial launch: Guinea, Mali, Senegal",
            market_geo_2: "Phase 2: West Africa expansion",
            market_geo_3: "Phase 3: Continental deployment",
            market_geo_4: "Long-term vision: All Africa",
            market_users_title: "Target Users",
            market_users_1: "Young entrepreneurs and professionals",
            market_users_2: "Urban and suburban families",
            market_users_3: "Farmers and local producers",
            market_users_4: "SMEs and local businesses",
            market_users_5: "Restaurateurs and communities",
            market_model_title: "Economic Model",
            market_model_1: "Commissions on Wali missions",
            market_model_2: "Carpooling trip fees Wandi",
            market_model_3: "Commissions on Makiti sales",
            market_model_4: "Multi-platform targeted advertising",
            market_model_5: "Strategic B2B partnerships",
            
            // Team
            team_title: "Our Team",
            team_subtitle: "Experts passionate about African innovation",
            team_direction_title: "General Management",
            team_direction_role: "Leadership & Vision",
            team_direction_desc: "Strategic steering and development of the EQOS ecosystem",
            team_tech_title: "Technical Team",
            team_tech_role: "Development & Innovation",
            team_tech_desc: "Design and maintenance of digital platforms",
            team_marketing_title: "Marketing & Business",
            team_marketing_role: "Growth & Partnerships",
            team_marketing_desc: "Business development and acquisition strategies",
            team_support_title: "Customer Service",
            team_support_role: "Support & Satisfaction",
            team_support_desc: "24/7 user support and accompaniment",
            
            // Contact
            contact_title: "Contact Us",
            contact_subtitle: "Join the EQOS adventure or ask us your questions",
            contact_address_title: "Address",
            contact_phone_title: "Phone",
            contact_social_title: "Social Networks",
            
            // Form
            form_name: "Full name",
            form_subject: "Subject",
            form_message: "Message",
            form_submit: "Send message",
            form_sending: "Sending...",
            form_success: "Thank you for your message! We will get back to you as soon as possible.",
            form_error: "An error occurred. Please try again.",
            
            // CTA
            cta_title: "Join the EQOS Revolution",
            cta_description: "Download our applications and transform your daily life today",
            cta_wali: "Download Wali",
            cta_wandi: "Download Wandi",
            cta_makiti: "Download Makiti",
            
            // Footer
            footer_description: "Qualified Company in Offers and Services. We transform Africa through technological innovation and solutions adapted to local realities.",
            footer_apps: "Applications",
            footer_company: "Company",
            footer_about: "About",
            footer_team: "Team",
            footer_market: "Market",
            footer_contact: "Contact",
            footer_legal: "Legal",
            footer_legal_mentions: "Legal mentions",
            footer_privacy: "Privacy",
            footer_terms: "Terms",
            footer_cookies: "Cookies",
            footer_rights: "All rights reserved"
        };
    }

    getArabicTranslations() {
        return {
            // Navigation
            nav_home: "الرئيسية",
            nav_about: "من نحن",
            nav_apps: "التطبيقات",
            nav_market: "السوق",
            nav_team: "الفريق",
            nav_contact: "اتصل بنا",
            
            // Hero
            hero_subtitle: "شركة مؤهلة في العروض والخدمات",
            hero_description: "لنحدث ثورة في إفريقيا معًا من خلال حلول تكنولوجية مبتكرة تحول التوظيف والنقل والزراعة",
            hero_cta1: "اكتشف حلولنا",
            hero_cta2: "انضم إلينا",
            
            // Stats
            stat_apps: "تطبيقات مبتكرة",
            stat_countries: "الدول المستهدفة",
            stat_digital: "رقمي ومتنقل",
            stat_potential: "الإمكانات الأفريقية",
            
            // About
            about_title: "من نحن؟",
            about_subtitle: "EQOS هي شركة مبتكرة مكرسة للتحول الرقمي في إفريقيا",
            about_mission_title: "مهمتنا",
            about_mission_p1: "ولدت EQOS من رؤية بسيطة ولكنها طموحة: استخدام التكنولوجيا لحل التحديات اليومية التي تواجهها المجتمعات الأفريقية. نحن نؤمن بشدة أن الابتكار الرقمي هو المفتاح لإطلاق الإمكانات الهائلة لقارتنا.",
            about_mission_p2: "من خلال تطبيقاتنا الثلاثة الرئيسية - Wali و Wandi و Makiti - نخلق نظامًا بيئيًا كاملاً يلمس الجوانب الأساسية للحياة اليومية: التوظيف والتنقل والغذاء. يخلق نهجنا الشامل تآزرًا بين هذه المجالات المختلفة لتعظيم التأثير الإيجابي على مستخدمينا.",
            
            // Values
            value_innovation_title: "الابتكار",
            value_innovation_desc: "نطور حلولاً تكنولوجية تتكيف مع الواقع الأفريقي",
            value_impact_title: "التأثير الاجتماعي",
            value_impact_desc: "يهدف كل حل إلى تحسين حياة مستخدمينا بشكل ملموس",
            value_sustainability_title: "الاستدامة",
            value_sustainability_desc: "نروج لاقتصاد دائري وصديق للبيئة",
            value_excellence_title: "التميز",
            value_excellence_desc: "نهدف إلى الجودة والموثوقية في جميع منتجاتنا",
            
            // Apps
            apps_title: "تطبيقاتنا",
            apps_subtitle: "ثلاثة حلول قوية لتحويل إفريقيا",
            
            // Wali
            wali_slogan: "\"اغمر نفسك في لحظة الحرية التي تستحقها.\"",
            wali_vision: "🎯 الرؤية: تبسيط الحياة اليومية للأفارقة من خلال التكنولوجيا",
            wali_description: "Wali هو تطبيق مخصص لربح مقدمي الخدمات والعملاء عبر تطبيق جوال. يقدم مجموعة واسعة من الخدمات مثل توصيل المنتجات والتنظيف المنزلي والدروس الخصوصية والمزيد.",
            wali_feature1: "اتصال فوري مع مقدمي خدمات مؤهلين",
            wali_feature2: "مجموعة واسعة من الخدمات المتاحة 24/7",
            wali_feature3: "نظام تقييم ومراجعة موثوق",
            wali_feature4: "دفع آمن ومرن",
            wali_feature5: "تتبع المهام في الوقت الحقيقي",
            download_wali: "تحميل Wali",
            
            // Wandi
            wandi_slogan: "\"سافروا معًا، ادفعوا أقل، وصلوا إفريقيا.\"",
            wandi_vision: "🌍 الرؤية: توفير حل نقل موثوق واقتصادي وصديق للبيئة",
            wandi_description: "Wandi هو تطبيق مشاركة الرحلات من EQOS المصمم لتسهيل السفر الحضري وبين المدن في إفريقيا. يسمح للسائقين بتقديم رحلات وللركاب بحجز مقعد بسهولة بتكلفة أقل.",
            wandi_feature1: "رحلات حضرية وبين المدن يمكن الوصول إليها",
            wandi_feature2: "خفض تكاليف النقل حتى 70٪",
            wandi_feature3: "تأثير بيئي إيجابي",
            wandi_feature4: "مجتمع ثقة موثوق",
            wandi_feature5: "حجز بسيط وسريع",
            download_wandi: "تحميل Wandi",
            
            // Makiti
            makiti_slogan: "\"من الحقل إلى الطبق، دون انحراف.\"",
            makiti_vision: "🌾 الرؤية: تشجيع الزراعة المستدامة والاستهلاك المسؤول",
            makiti_description: "Makiti هو السوق الرقمي لـ EQOS المخصص للمبيعات عبر الإنترنت للمنتجات الغذائية من الزراعة المحلية. فهو يربط المنتجين والمستهلكين مباشرة، دون وساطة.",
            makiti_feature1: "اتصال مباشر بين المنتجين والمستهلكين",
            makiti_feature2: "منتجات طازجة ومحلية مضمونة",
            makiti_feature3: "أسعار عادلة للجميع",
            makiti_feature4: "دعم الاقتصاد الريفي",
            makiti_feature5: "تسليم سريع وإمكانية تتبع كاملة",
            download_makiti: "تحميل Makiti",
            
            // Market
            market_title: "سوقنا",
            market_subtitle: "استراتيجية نمو طموحة لإفريقيا",
            market_geo_title: "المنطقة الجغرافية",
            market_geo_1: "الإطلاق الأولي: غينيا، مالي، السنغال",
            market_geo_2: "المرحلة 2: التوسع في غرب إفريقيا",
            market_geo_3: "المرحلة 3: النشر القاري",
            market_geo_4: "رؤية طويلة المدى: كل إفريقيا",
            market_users_title: "المستخدمون المستهدفون",
            market_users_1: "رواد الأعمال الشباب والمحترفون",
            market_users_2: "العائلات الحضرية وشبه الحضرية",
            market_users_3: "المزارعون والمنتجون المحليون",
            market_users_4: "الشركات الصغيرة والمتوسطة والأعمال المحلية",
            market_users_5: "مطاعم ومجتمعات",
            market_model_title: "النموذج الاقتصادي",
            market_model_1: "عمولات على مهام Wali",
            market_model_2: "رسول رحلات المشاركة Wandi",
            market_model_3: "عمولات على مبيعات Makiti",
            market_model_4: "إعلانات مستهدفة متعددة المنصات",
            market_model_5: "شراكات B2B استراتيجية",
            
            // Team
            team_title: "فريقنا",
            team_subtitle: "خبراء شغوفون بالابتكار الأفريقي",
            team_direction_title: "الإدارة العامة",
            team_direction_role: "القيادة والرؤية",
            team_direction_desc: "التوجيه الاستراتيجي وتطوير نظام EQOS البيئي",
            team_tech_title: "الفريق التقني",
            team_tech_role: "التطوير والابتكار",
            team_tech_desc: "تصميم وصيانة المنصات الرقمية",
            team_marketing_title: "التسويق والأعمال",
            team_marketing_role: "النمو والشراكات",
            team_marketing_desc: "تطوير الأعمال واستراتيجيات الاكتساب",
            team_support_title: "خدمة العملاء",
            team_support_role: "الدعم والرضا",
            team_support_desc: "دعم ومرافقة المستخدمين على مدار 24/7",
            
            // Contact
            contact_title: "اتصل بنا",
            contact_subtitle: "انضم إلى مغامرة EQOS أو اسألنا أسئلتك",
            contact_address_title: "العنوان",
            contact_phone_title: "الهاتف",
            contact_social_title: "الشبكات الاجتماعية",
            
            // Form
            form_name: "الاسم الكامل",
            form_subject: "الموضوع",
            form_message: "الرسالة",
            form_submit: "إرسال الرسالة",
            form_sending: "جاري الإرسال...",
            form_success: "شكرًا على رسالتك! سوف نعود إليك في أقرب وقت ممكن.",
            form_error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
            
            // CTA
            cta_title: "انضم إلى ثورة EQOS",
            cta_description: "حمّل تطبيقاتنا وحوّل حياتك اليومية الآن",
            cta_wali: "تحميل Wali",
            cta_wandi: "تحميل Wandi",
            cta_makiti: "تحميل Makiti",
            
            // Footer
            footer_description: "شركة مؤهلة في العروض والخدمات. نحول إفريقيا من خلال الابتكار التكنولوجي والحلول المتكيفة مع الواقع المحلي.",
            footer_apps: "التطبيقات",
            footer_company: "الشركة",
            footer_about: "من نحن",
            footer_team: "الفريق",
            footer_market: "السوق",
            footer_contact: "اتصل بنا",
            footer_legal: "قانوني",
            footer_legal_mentions: "الإشارات القانونية",
            footer_privacy: "الخصوصية",
            footer_terms: "الشروط",
            footer_cookies: "الكوكيز",
            footer_rights: "جميع الحقوق محفوظة"
        };
    }
}

// =============================================
// Initialisation de l'application
// =============================================

// Création de l'instance principale
const eqosApp = new EQOSApp();

// Fonctions globales pour les événements HTML
function toggleMenu() {
    eqosApp.toggleMenu();
}

function closeMenu() {
    eqosApp.closeMenu();
}

function scrollToSection(sectionId) {
    eqosApp.scrollToSection(sectionId);
}

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur globale:', e.error);
});

// Service Worker pour le cache (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}