document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loader Animation ---
    const loader = document.getElementById('loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 300); // short delay
    });

    // Fallback if load event already fired or takes too long
    setTimeout(() => {
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 3000);

    // --- 2. Scroll to Top Button ---
    const scrollTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            if(scrollTopBtn) scrollTopBtn.classList.add('show');
        } else {
            if(scrollTopBtn) scrollTopBtn.classList.remove('show');
        }
    });

    if(scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 3. Fade-in on Scroll ---
    const sections = document.querySelectorAll('.elementor-section, .elementor-widget');
    
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    sections.forEach(section => {
        section.classList.add('fade-in-section');
        appearOnScroll.observe(section);
    });

    // --- 4. Popup Logic ---
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupBtn = document.querySelector('.close-popup');

    // Show popup after 3 seconds of page load
    setTimeout(() => {
        if(popupOverlay) {
            popupOverlay.classList.add('show');
        }
    }, 3000);

    if(closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            if(popupOverlay) popupOverlay.classList.remove('show');
        });
    }

    if(popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('show');
            }
        });
    }

    // --- 5. AI Chatbot Logic ---
    const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChatBtn = document.getElementById('closeChat');
    const chatbotBody = document.getElementById('chatbotBody');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    const botResponses = {
        "Admission": "Admissions are currently open for the 2026-2027 batch. You can apply online via our admission portal or visit the campus.",
        "Courses": "We offer various UG and PG programs including B.Tech, MBA, B.Pharma, and Diploma courses.",
        "Fees": "Fee structures vary by course. Please contact our admission office at +91-XXXX-XXXXXX for detailed fee information.",
        "Contact": "You can reach us at info@adina.edu.in or call +91-XXXX-XXXXXX. The campus is located in Sagar, MP."
    };

    if(chatbotToggleBtn && chatbotContainer) {
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotContainer.classList.toggle('show');
        });
    }

    if(closeChatBtn && chatbotContainer) {
        closeChatBtn.addEventListener('click', () => {
            chatbotContainer.classList.remove('show');
        });
    }

    function appendMessage(sender, text) {
        if(!chatbotBody) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message');
        if (sender === 'user') {
            msgDiv.classList.add('user-message');
        } else {
            msgDiv.classList.add('bot-message');
        }
        msgDiv.innerText = text;
        chatbotBody.appendChild(msgDiv);
        
        // Auto scroll
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    quickReplies.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const query = e.target.getAttribute('data-reply');
            
            // Add user message
            appendMessage('user', query);
            
            // Simulate bot typing delay
            setTimeout(() => {
                const reply = botResponses[query] || "I'm sorry, I don't have information on that.";
                appendMessage('bot', reply);
            }, 600);
        });
    });
});
