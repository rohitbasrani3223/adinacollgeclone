document.addEventListener('DOMContentLoaded', () => {

    // --- Tab Switching ---
    const menuItems = document.querySelectorAll('.sidebar-menu li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(m => m.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            item.classList.add('active');
            document.getElementById(item.getAttribute('data-tab')).classList.add('active');
        });
    });

    // --- State Management via LocalStorage ---
    
    // Default Gallery Images
    const defaultGalleryImages = [
        { src: './images/ceremony.jpg', caption: 'Felicitation Ceremony' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2024/06/AIPS-FRONT-scaled.jpg', caption: 'AIPS Front View' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2024/06/AIST-FRONT-scaled.jpg', caption: 'AIST Front View' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2024/06/ACP2.png', caption: 'ACP Campus' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2023/11/Award_check-removebg-preview.png', caption: 'Award Check' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2023/11/Director-sir.png', caption: 'Director Sir' },
        { src: 'https://www.adina.edu.in/wp-content/uploads/2024/05/ADINA-Logo-1-290x300.png', caption: 'Adina Logo' }
    ];

    let galleryData = JSON.parse(localStorage.getItem('adina_gallery')) || defaultGalleryImages;

    // Default Popup
    const defaultPopup = {
        enabled: true,
        title: "Important Announcement",
        body: "<p>Welcome to ADINA Group of Institutions. Admissions are open for 2026-2027.</p>"
    };

    let popupData = JSON.parse(localStorage.getItem('adina_popup')) || defaultPopup;

    // --- Gallery Management ---
    const tableBody = document.getElementById('galleryTableBody');
    const addImgBtn = document.getElementById('addImgBtn');
    const imageModal = document.getElementById('imageModal');
    const closeAdminModal = document.querySelector('.close-admin-modal');
    const imageForm = document.getElementById('imageForm');
    const modalTitle = document.getElementById('modalTitle');
    const imgUrlInput = document.getElementById('imgUrl');
    const imgCaptionInput = document.getElementById('imgCaption');
    const editIndexInput = document.getElementById('editIndex');

    function renderTable() {
        tableBody.innerHTML = '';
        galleryData.forEach((item, index) => {
            let displayUrl = item.src;
            if (displayUrl.startsWith('data:image')) {
                displayUrl = '<span style="color:var(--success); font-weight:bold;"><i class="fas fa-file-image"></i> Uploaded via Dropzone</span><br><small style="color:#888;">(Base64 Data)</small>';
            } else if (displayUrl.length > 50) {
                displayUrl = displayUrl.substring(0, 47) + '...';
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${item.src}" alt="${item.caption}" class="table-img"></td>
                <td><div style="word-break: break-all; max-width: 250px;">${displayUrl}</div></td>
                <td>${item.caption}</td>
                <td class="actions">
                    <button class="icon-btn edit" onclick="editImage(${index})"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn delete" onclick="deleteImage(${index})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Modal Handlers
    addImgBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add Gallery Image';
        imageForm.reset();
        editIndexInput.value = -1;
        imageModal.style.display = 'flex';
    });

    closeAdminModal.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });

    // --- Drag and Drop Logic ---
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Resize/Compress image to avoid blowing up localStorage
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                imgUrlInput.value = dataUrl;
                
                // Show brief success text
                const p = dropZone.querySelector('p');
                const originalText = p.innerHTML;
                p.innerHTML = `<span style="color:var(--success)">Image processed successfully!</span>`;
                setTimeout(() => p.innerHTML = originalText, 3000);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Form Submit
    imageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newImg = {
            src: imgUrlInput.value.trim(),
            caption: imgCaptionInput.value.trim()
        };

        const idx = parseInt(editIndexInput.value);
        if (idx === -1) {
            // Add new
            galleryData.unshift(newImg); // Add to beginning
        } else {
            // Update
            galleryData[idx] = newImg;
        }

        saveGallery();
        renderTable();
        imageModal.style.display = 'none';
    });

    // Edit/Delete (Global functions for onclick)
    window.editImage = (index) => {
        const item = galleryData[index];
        modalTitle.textContent = 'Edit Gallery Image';
        imgUrlInput.value = item.src;
        imgCaptionInput.value = item.caption;
        editIndexInput.value = index;
        imageModal.style.display = 'flex';
    };

    window.deleteImage = (index) => {
        if (confirm('Are you sure you want to delete this image?')) {
            galleryData.splice(index, 1);
            saveGallery();
            renderTable();
        }
    };

    function saveGallery() {
        localStorage.setItem('adina_gallery', JSON.stringify(galleryData));
        // Optional: show a toast notification
    }

    // --- Popup Management ---
    const popupForm = document.getElementById('popupForm');
    const popupEnabledInput = document.getElementById('popupEnabled');
    const popupTitleInput = document.getElementById('popupTitle');
    const popupBodyInput = document.getElementById('popupBody');

    function loadPopupSettings() {
        popupEnabledInput.checked = popupData.enabled;
        popupTitleInput.value = popupData.title;
        popupBodyInput.value = popupData.body;
    }

    popupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        popupData = {
            enabled: popupEnabledInput.checked,
            title: popupTitleInput.value.trim(),
            body: popupBodyInput.value.trim()
        };
        localStorage.setItem('adina_popup', JSON.stringify(popupData));
        alert('Popup settings saved successfully! They will apply when you view the website.');
    });


    // Initialize
    renderTable();
    loadPopupSettings();
});
