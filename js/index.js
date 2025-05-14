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

    // Gère l'affichage du menu et du bouton "backToTop" au scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        menu.classList.toggle('fixed', scrollY > 50);
        menu.classList.toggle('scrolled', scrollY > 100);
        backToTop.classList.toggle('show', scrollY > 100);
    });

    // Retour en haut de la page
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Affiche le modal avec l'image en grand
    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            modal.style.display = "flex";
            overlay.style.display = "block";
            body.classList.add('disable-interaction');
            modalImg.src = img.src;
            currentIndex = index;
        });
    });

    // Ferme le modal quand on clique sur la croix
    closeBtn.addEventListener("click", closeModal);

    // Ferme le modal si l'utilisateur clique sur le fond
    function closeModalIfClickedOutside(e) {
        if (e.target === modal || e.target === overlay) {
            closeModal();
        }
    }

    function closeModal() {
        modal.style.display = "none";
        overlay.style.display = "none";
        body.classList.remove('disable-interaction');
        currentIndex = -1;
    }

    window.addEventListener('click', closeModalIfClickedOutside);
    window.addEventListener('touchstart', closeModalIfClickedOutside);

    // Navigation via clavier
    window.addEventListener('keydown', (e) => {
        if (modal.style.display === "flex") {
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
});

// Loader
window.addEventListener('load', () => {
  setTimeout(() => {
    const modal = document.getElementById('loader-modal');
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 500); // Attend la fin de la transition
  }, 2000);
});