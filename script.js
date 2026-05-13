document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loader Animation ---
    const loader = document.getElementById('loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800); // match transition in CSS
            }
        }, 2500); // Act as a splash screen for 2.5s
    });

    // Fallback if load event already fired or takes too long
    setTimeout(() => {
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }, 4500);

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
    const popupTitleEl = document.getElementById('popupTitle');
    const popupBodyEl = document.getElementById('popupBody');

    // Load custom popup settings if any
    let popupEnabled = true;
    const savedPopup = localStorage.getItem('adina_popup');
    if (savedPopup) {
        const popupData = JSON.parse(savedPopup);
        popupEnabled = popupData.enabled;
        if (!popupEnabled && popupOverlay) {
            popupOverlay.style.display = 'none'; // Completely hide if disabled
        } else {
            if (popupTitleEl) popupTitleEl.innerText = popupData.title;
            if (popupBodyEl) {
                let bodyHtml = popupData.body;
                if (popupData.image) {
                    bodyHtml = `<img src="${popupData.image}" style="max-width:100%; max-height:300px; border-radius:8px; display:block; margin:0 auto 15px auto; box-shadow:0 5px 15px rgba(0,0,0,0.1);">` + bodyHtml;
                }
                popupBodyEl.innerHTML = bodyHtml;
            }
        }
    }

    // Show popup after 3 seconds of page load (if enabled)
    setTimeout(() => {
        if(popupOverlay && popupEnabled && popupOverlay.style.display !== 'none') {
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

    // --- 6. Life @ Adina Gallery & Pagination/Popup (Popation) ---
    const defaultGalleryImages = [
        { src: './images/ceremony.jpg', caption: 'Felicitation Ceremony' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2024/06/AIPS-FRONT-scaled.jpg', caption: 'AIPS Front View' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2024/06/AIST-FRONT-scaled.jpg', caption: 'AIST Front View' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2024/06/ACP2.png', caption: 'ACP Campus' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2023/11/Award_check-removebg-preview.png', caption: 'Award Check' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2023/11/Director-sir.png', caption: 'Director Sir' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2024/05/ADINA-Logo-1-290x300.png', caption: 'Adina Logo' },
    ];

    // Load from localStorage if available
    const savedGallery = localStorage.getItem('adina_gallery');
    const galleryImages = savedGallery ? JSON.parse(savedGallery) : defaultGalleryImages;

    const ITEMS_PER_PAGE = 3;
    let currentPage = 1;
    let totalPages = Math.ceil(galleryImages.length / ITEMS_PER_PAGE);

    const galleryGrid = document.getElementById('galleryGrid');
    const galleryDotsContainer = document.getElementById('galleryDots');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');

    // Modal elements
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImg');
    const modalCaption = document.getElementById('galleryModalCaption');
    const closeGallery = document.querySelector('.close-gallery');
    const modalPrev = document.getElementById('galleryModalPrev');
    const modalNext = document.getElementById('galleryModalNext');
    let currentModalIndex = 0;

    function renderGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageImages = galleryImages.slice(start, end);

        pageImages.forEach((item, index) => {
            const actualIndex = start + index;
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('gallery-item');
            itemDiv.innerHTML = `
                <img src="${item.src}" alt="${item.caption}">
                <div class="gallery-item-caption">${item.caption}</div>
            `;
            
            // Open modal on click
            itemDiv.addEventListener('click', () => {
                openModal(actualIndex);
            });
            
            galleryGrid.appendChild(itemDiv);
        });

        renderPagination();
    }

    function renderPagination() {
        if (!galleryDotsContainer) return;
        galleryDotsContainer.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pag-dot');
            if (i === currentPage) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentPage = i;
                renderGallery();
            });
            galleryDotsContainer.appendChild(dot);
        }

        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderGallery();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderGallery();
            }
        });
    }

    // Modal Functions
    function openModal(index) {
        if (!modal) return;
        currentModalIndex = index;
        updateModalImage();
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    function updateModalImage() {
        const item = galleryImages[currentModalIndex];
        if (modalImg) modalImg.src = item.src;
        if (modalCaption) modalCaption.textContent = item.caption;
    }

    if (closeGallery) {
        closeGallery.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    if (modalPrev) {
        modalPrev.addEventListener('click', () => {
            currentModalIndex = (currentModalIndex - 1 + galleryImages.length) % galleryImages.length;
            updateModalImage();
        });
    }

    if (modalNext) {
        modalNext.addEventListener('click', () => {
            currentModalIndex = (currentModalIndex + 1) % galleryImages.length;
            updateModalImage();
        });
    }

    // Close modal when clicking outside image
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }

    // Initial Render
    renderGallery();

});
