// script.js

// Funkce pro filtrování toolů
function filterTools(category) {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        if (category === 'all') {
            tool.classList.remove('hide');
        } else {
            if (tool.classList.contains(category)) {
                tool.classList.remove('hide');
            } else {
                tool.classList.add('hide');
            }
        }
    });
}

// ---------- UNIVERZÁLNÍ FUNKCE PRO PŘETAŽENÍ A PÁD GIFU ----------
function makeGifDraggable(gifElement) {
    if (!gifElement) return;
    
    let isDragging = false;
    let startMouseX, startMouseY;
    let startGifLeft, startGifTop;
    
    // Získání aktuální pozice GIFu vzhledem k viewportu
    function getGifViewportPosition() {
        const rect = gifElement.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top
        };
    }
    
    // Nastavení pozice GIFu pomocí fixed
    function setGifFixedPosition(left, top) {
        gifElement.style.position = 'fixed';
        gifElement.style.bottom = 'auto';
        gifElement.style.right = 'auto';
        gifElement.style.left = left + 'px';
        gifElement.style.top = top + 'px';
        gifElement.style.margin = '0';
    }
    
    // Funkce pro pád dolů
    function fallToBottom() {
        const currentLeft = parseFloat(gifElement.style.left);
        const currentTop = parseFloat(gifElement.style.top);
        const gifHeight = gifElement.offsetHeight;
        const windowHeight = window.innerHeight;
        const targetTop = windowHeight - gifHeight;
        
        if (Math.abs(currentTop - targetTop) < 5) {
            gifElement.style.transition = '';
            return;
        }
        
        gifElement.style.transition = 'top 0.4s cubic-bezier(0.33, 1, 0.68, 1)';
        gifElement.style.top = targetTop + 'px';
        
        // Efekt odrazu po dopadu
        setTimeout(() => {
            gifElement.style.transition = 'transform 0.08s ease';
            gifElement.style.transform = 'rotate(3deg)';
            setTimeout(() => {
                gifElement.style.transform = 'rotate(-2deg)';
                setTimeout(() => {
                    gifElement.style.transform = 'rotate(0deg)';
                    gifElement.style.transition = '';
                }, 80);
            }, 80);
        }, 380);
    }
    
    // Začátek tažení
    gifElement.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        isDragging = true;
        gifElement.style.cursor = 'grabbing';
        gifElement.style.transition = 'none';
        
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        
        const currentPos = getGifViewportPosition();
        startGifLeft = currentPos.left;
        startGifTop = currentPos.top;
        
        // Přepnout na fixed pozicování pokud není
        if (gifElement.style.position !== 'fixed') {
            const rect = gifElement.getBoundingClientRect();
            setGifFixedPosition(rect.left, rect.top);
        }
    });
    
    // Během tažení
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        let newLeft = startGifLeft + (e.clientX - startMouseX);
        let newTop = startGifTop + (e.clientY - startMouseY);
        
        // Omezení na okraje obrazovky
        const maxLeft = window.innerWidth - gifElement.offsetWidth;
        const maxTop = window.innerHeight - gifElement.offsetHeight;
        newLeft = Math.min(Math.max(0, newLeft), maxLeft);
        newTop = Math.min(Math.max(0, newTop), maxTop);
        
        gifElement.style.left = newLeft + 'px';
        gifElement.style.top = newTop + 'px';
    });
    
    // Konec tažení - pád
    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        gifElement.style.cursor = 'grab';
        fallToBottom();
        
        // Aktualizovat pozici pro případné další tažení
        setTimeout(() => {
            if (!isDragging) {
                const newPos = getGifViewportPosition();
                startGifLeft = newPos.left;
                startGifTop = newPos.top;
            }
        }, 420);
    });
    
    // Zamezení výchozího přetahování obrázku
    gifElement.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });
    
    gifElement.style.cursor = 'grab';
    
    // Ošetření scrollu během tažení
    window.addEventListener('scroll', () => {
        if (isDragging) {
            const currentPos = getGifViewportPosition();
            startGifLeft = currentPos.left;
            startGifTop = currentPos.top;
        }
    });
    
    // Ošetření změny velikosti okna
    window.addEventListener('resize', () => {
        if (!isDragging && gifElement.style.position === 'fixed') {
            const rect = gifElement.getBoundingClientRect();
            const maxLeft = window.innerWidth - gifElement.offsetWidth;
            const maxTop = window.innerHeight - gifElement.offsetHeight;
            
            let newLeft = rect.left;
            let newTop = rect.top;
            let needUpdate = false;
            
            if (rect.left < 0) {
                newLeft = 0;
                needUpdate = true;
            } else if (rect.left > maxLeft) {
                newLeft = maxLeft;
                needUpdate = true;
            }
            
            if (rect.top < 0) {
                newTop = 0;
                needUpdate = true;
            } else if (rect.top > maxTop) {
                newTop = maxTop;
                needUpdate = true;
            }
            
            if (needUpdate) {
                gifElement.style.left = newLeft + 'px';
                gifElement.style.top = newTop + 'px';
                startGifLeft = newLeft;
                startGifTop = newTop;
            }
        }
    });
}

// ---------- AUTOMATICKÉ SPUŠTĚNÍ PRO VŠECHNY GIFY S TŘÍDOU "draggable-gif" ----------
// Create a simple image modal (gallery-style) and expose open/close helpers
function createImageModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';

    const img = document.createElement('img');
    img.alt = '';
    modal.appendChild(img);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    modal.appendChild(closeBtn);

    function open(src, alt) {
        img.src = src;
        img.alt = alt || '';
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
        // clear src to stop GIFs
        img.src = '';
    }

    // click outside or close button closes
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn) close();
    });

    // ESC to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) close();
    });

    document.body.appendChild(modal);

    // expose helper
    return { open, close };
}

document.addEventListener('DOMContentLoaded', () => {
    const allDraggableGifs = document.querySelectorAll('.draggable-gif');
    allDraggableGifs.forEach(gif => {
        makeGifDraggable(gif);
    });

    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
    });

    // Initialize simple gallery on images with class 'item' (memes page)
    const items = document.querySelectorAll('.item');
    if (items.length) {
        const modal = createImageModal();
        items.forEach(el => {
            el.style.cursor = 'zoom-in';
            el.addEventListener('click', () => {
                // use full-size src if available via data-large, otherwise use src
                const src = el.dataset.large || el.src || el.getAttribute('src');
                modal.open(src, el.alt || '');
            });
        });
    }
});