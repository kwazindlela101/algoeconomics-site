(function () {
    const modalId = 'aciMethodologyModal';
    let previousBodyOverflow = null;

    const getModal = () => document.getElementById(modalId);

    function openModal() {
        const modal = getModal();
        if (!modal) return;

        if (previousBodyOverflow === null) {
            previousBodyOverflow = document.body.style.overflow;
        }
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = getModal();
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        if (previousBodyOverflow !== null) {
            document.body.style.overflow = previousBodyOverflow;
            previousBodyOverflow = null;
        }
    }

    function openConsultationFromACI() {
        closeModal();
        if (typeof window.openConsultationModal === 'function') {
            window.openConsultationModal();
        } else {
            console.warn('openConsultationModal() not found.');
        }
    }

    function bindEvents() {
        const modal = getModal();
        if (!modal || modal.dataset.bound) return;

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        modal.querySelectorAll('[data-aci-close]').forEach((button) => {
            button.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        modal.dataset.bound = 'true';
    }

    function init() {
        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.showACIModal = openModal;
    window.closeACIModal = closeModal;
    window.openConsultationFromACI = openConsultationFromACI;
})();

