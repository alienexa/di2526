
/* =========================================================
 * SCRIPT PRINCIPAL — Portfólio de Design
 * - Scroll suave para âncoras internas
 * - Destaque do link ativo no nav
 * - Animação de entrada (reveal on scroll)
 * - Menu hambúrguer + sidebar (ARIA + fechos)
 * - Flip-cards: virar só pelo botão (click/Enter/Espaço)
 * ---------------------------------------------------------
 * Requisitos: carregar com <script defer>
 ========================================================= */

(() => {
    'use strict';

    /* ---------------------------
       Utilitários rápidos
    --------------------------- */
    const qs = (sel, ctx = document) => ctx.querySelector(sel);
    const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* =========================================================
       SCROLL SUAVE PARA ÂNCORAS (somente se o alvo existir)
    ========================================================= */
    qsa('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            // Ignora "#" puro
            if (!href || href === '#') return;

            const id = href.slice(1);
            let target = null;

            try {
                target = document.getElementById(id) || document.querySelector(`#${CSS.escape(id)}`);
            } catch {
                target = document.getElementById(id);
            }

            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* =========================================================
       FADE-IN DO BODY NA CARGA (leve e sem dependências)
    ========================================================= */
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        requestAnimationFrame(() => {
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease-in';
                document.body.style.opacity = '1';
            }, 60);
        });
    });

    /* =========================================================
       DESTAQUE DO LINK ATIVO NO NAV + aria-current
    ========================================================= */
    function highlightActiveNav() {
        const links = qsa('nav a[href]');
        if (!links.length) return;

        const current = new URL(location.href);
        const currentPath = current.pathname.replace(/\/$/, '') || '/index.html';

        links.forEach(link => {
            try {
                const url = new URL(link.getAttribute('href'), location.origin);
                const linkPath = url.pathname.replace(/\/$/, '') || '/index.html';
                if (linkPath === currentPath) {
                    link.style.color = 'var(--primary)';
                    link.style.fontWeight = 'bold';
                    link.setAttribute('aria-current', 'page');
                }
            } catch {
                /* href inválido/externo: ignora */
            }
        });
    }
    highlightActiveNav();

    /* =========================================================
       REVEAL ON SCROLL (IntersectionObserver)
       Aplica entrada suave a .card / .trabalho-card / .flip-card
    ========================================================= */
    const revealTargets = qsa('.card, .trabalho-card, .flip-card');
    if (revealTargets.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealTargets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.transition = 'opacity .5s ease-out, transform .5s ease-out';
            io.observe(el);
        });
    }

    /* =========================================================
       NAV: transição suave (cosmética)
    ========================================================= */
    const navEl = qs('nav');
    if (navEl) navEl.style.transition = 'all .3s ease';

    /* =========================================================
       SIDEBAR / HAMBÚRGUER (mobile) — robusto + ARIA
    ========================================================= */
    const menuToggle = qs('#menu-toggle');
    const sidebar = qs('#sidebar');

    if (menuToggle && sidebar) {
        const openSidebar = () => {
            sidebar.classList.add('open');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            sidebar.setAttribute('aria-hidden', 'false');
        };

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
        };

        // Toggle no botão
        menuToggle.addEventListener('click', () => {
            const isOpen = sidebar.classList.toggle('open');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            sidebar.setAttribute('aria-hidden', String(!isOpen));
        });

        // Fechar ao clicar num link do menu
        qsa('.sidebar-menu a', sidebar).forEach(a => a.addEventListener('click', closeSidebar));

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                closeSidebar();
                menuToggle.focus();
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    }

    /* =========================================================
       FLIP CARDS — virar APENAS pelo botão (click/Enter/Espaço)
       - Não viram no hover (CSS já neutraliza)
       - Foco vai para o verso para permitir scroll
    ========================================================= */

    // Clique/tap no botão (apenas .flip-card__btn, para não colidir com outros .trabalho-btn)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.flip-card__btn');
        if (!btn) return;

        const inner = btn.closest('.flip-card')?.querySelector('.flip-card__inner');
        if (!inner) return;

        e.preventDefault();

        const flipped = inner.classList.toggle('is-flipped');

        // Evita que SPACE no botão volte a alternar ao tentar rolar
        btn.blur();

        // Se virou para o verso, foca o conteúdo do verso (para leitura/scroll)
        if (flipped) {
            const content = inner.querySelector('.flip-card__back .flip-card__content')
                || inner.querySelector('.flip-card__back');
            if (content) {
                content.setAttribute('tabindex', '-1');
                content.focus({ preventScroll: true });
            }
        }
    });

    // Teclado: Enter/Espaço apenas quando o alvo É o botão
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key !== 'Enter' && key !== ' ') return;

        const el = document.activeElement;
        if (!el || !el.matches('.flip-card__btn')) return;

        e.preventDefault();
        el.click(); // reutiliza a lógica do clique
    });

    // Garantia extra: não virar no Enter/Espaço do container interno
    qsa('.flip-card__inner').forEach(inner => {
        inner.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key === 'Enter' || key === ' ') e.stopPropagation();
        });
    });

    /* =========================================================
       LOG simpático no console
    ========================================================= */
    try {
        console.log('%cBem-vindo ao meu Portfólio! 🎨', 'font-size:20px;color:#6366f1;font-weight:bold;');
        console.log('%cDesign de Interfaces — Portfólio Final', 'font-size:14px;color:#a855f7;');
    } catch { /* ambientes sem console formatado */ }
})();
