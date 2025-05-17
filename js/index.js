document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector('.menu');
    const backToTop = document.getElementById('backToTop');
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".close");
    const overlay = document.getElementById("overlay");
    const body = document.body;
    const galleryImages = document.querySelectorAll('.grid-item img');
    let currentIndex = -1; // pour la navigation via clavier
    const loaderModal = document.getElementById('loader-modal');

    // Vérifier si les éléments nécessaires sont présents dans le DOM
    if (!modal || !modalImg || !closeBtn || !overlay) {
        console.error("Les éléments nécessaires à la modale sont manquants dans le DOM.");
        return;
    }

   // Gère l'affichage du menu et du bouton "backToTop" au scroll
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    menu.classList.toggle('fixed', scrollY > 50);
    menu.classList.toggle('scrolled', scrollY > 100);
    backToTop.classList.toggle('show', scrollY > 100);
});

// Détection mobile simple
function isMobile() {
    return window.innerWidth <= 768;
}

// Scroll plus lent pour mobile
function slowScrollToTop() {
    const duration = 0; // ralentir ici si tu veux encore plus doux
    const start = window.scrollY;
    const startTime = performance.now();

    function scroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easing cubic-out

        window.scrollTo(0, start * (1 - ease));

        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
}

// Retour en haut de la page
backToTop.addEventListener('click', (e) => {
    e.preventDefault();

    if (isMobile()) {
        slowScrollToTop();
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

    // Affiche la modale avec l'image en grand
    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            if (modal && modalImg) {
                modal.classList.add('show'); // Ajouter la classe 'show' pour rendre visible la modale
                overlay.classList.add("show"); // Utilisation de la classe show pour overlay
                body.classList.add('disable-interaction'); // Désactive l'interaction avec le corps
                modalImg.src = img.src;
                currentIndex = index;
            }
        });
    });

    // Ferme le modal quand on clique sur la croix
    closeBtn.addEventListener("click", closeModal);

    // Ferme le modal si l'utilisateur clique sur le fond (overlay)
    function closeModalIfClickedOutside(e) {
        if (e.target === modal || e.target === overlay) {
            closeModal();
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('show'); // Retirer la classe 'show' pour masquer la modale
            overlay.classList.remove("show"); // Retirer la classe show pour l'overlay
            body.classList.remove('disable-interaction'); // Réactiver l'interaction avec le corps
            currentIndex = -1;
        }
    }

    window.addEventListener('click', closeModalIfClickedOutside);
    window.addEventListener('touchstart', closeModalIfClickedOutside);

    // Navigation via clavier
    window.addEventListener('keydown', (e) => {
        if (modal.classList.contains("show")) {
            if (e.key === "Escape") {
                closeModal();
            } else if (e.key === "ArrowRight") {
                navigateModal(1);
            } else if (e.key === "ArrowLeft") {
                navigateModal(-1);
            }
        }
    });

    function navigateModal(direction) {
        if (currentIndex === -1) return;
        currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
        modalImg.src = galleryImages[currentIndex].src;
    }

    // Ajuste les marges des images pour centrer l'image dans l'élément contenant
    function adjustImageMargins() {
        const images = document.querySelectorAll('.grid-item img');
        images.forEach(img => {
            const containerWidth = img.parentElement.offsetWidth;
            const marginLeft = (containerWidth - img.offsetWidth) / 2;
            img.style.marginLeft = `${marginLeft}px`;
            img.style.marginRight = `${marginLeft}px`;
        });
    }

    adjustImageMargins(); // initial
    window.addEventListener('resize', adjustImageMargins);

    // Loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loaderModal) {
                loaderModal.style.opacity = '0';
                setTimeout(() => {
                    loaderModal.style.display = 'none';
                }, 500); // Attend la fin de la transition
            }
        }, 2000);
    });
});
