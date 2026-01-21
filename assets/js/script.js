/* ================================================
 *  SCRIPT PRINCIPAL DO PORTFÓLIO DE DESIGN
 *  Funcionalidades gerais e acessibilidade
 * ================================================ */

/* ===== SCROLL SUAVE PARA LINKS INTERNOS ===== */
/* Permite navegação suave entre seções da página ao clicar em links âncora */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            /* Scroll comportamento suave */
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ===== ANIMAÇÃO DE FADE-IN AO CARREGAR A PÁGINA ===== */
/* Cria efeito de aparição suave quando a página carrega */
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

/* ===== DESTAQUE DO LINK ATIVO NA NAVEGAÇÃO ===== */
/* Identifica a página atual e destaca o link correspondente na navegação */
function highlightActiveNav() {
    /* Obtém o nome do arquivo atual */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        /* Compara o href com a página atual */
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.style.color = 'var(--primary)';
            link.style.fontWeight = 'bold';
        }
    });
}

highlightActiveNav();

/* ===== EFEITO DE HOVER NOS CARDS ===== */
/* Adiciona efeito visual ao passar o mouse sobre os cards */
document.querySelectorAll('.card, .trabalho-card').forEach(card => {
    /* Mouseenter: move card para cima e aumenta sombra */
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.15)';
    });
    
    /* Mouseleave: retorna card ao estado original */
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    });
});

/* ===== ANIMAÇÃO AO FAZER SCROLL (FADE-IN) ===== */
/* Usa Intersection Observer para animar cards conforme entram na viewport */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        /* Quando elemento fica visível, aplica fade-in */
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

/* Aplicar observador a todos os cards */
document.querySelectorAll('.card, .trabalho-card').forEach(card => {
    /* Estado inicial: invisível e deslocado para baixo */
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
});

/* ===== TRANSIÇÃO SUAVE NA NAVEGAÇÃO ===== */
/* Prepara o container de navegação para transições */
const navContainer = document.querySelector('nav');
if (navContainer) {
    navContainer.style.transition = 'all 0.3s ease';
}

/* ===== LOG DE BEM-VINDO NO CONSOLE ===== */
/* Mensagens estilizadas no console do navegador para fins de demonstração */
console.log('%cBem-vindo ao meu Portfólio! 🎨', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cDesign de Interfaces - Portfólio Final', 'font-size: 14px; color: #a855f7;');


/* ===== FUNCIONALIDADES DE ACESSIBILIDADE ===== */
/* Sistema completo de acessibilidade com armazenamento de preferências */

/* ===== SELEÇÃO DE ELEMENTOS DO DOM ===== */
/* Botão e painel de acessibilidade */
const accessibilityBtn = document.getElementById('accessibility-btn');
const accessibilityPanel = document.getElementById('accessibility-panel');
const closeAccessibility = document.getElementById('close-accessibility');

/* Botões de controle de tamanho de fonte */
const increaseFontBtn = document.getElementById('increase-font');
const decreaseFontBtn = document.getElementById('decrease-font');
const resetFontBtn = document.getElementById('reset-font');

/* Checkboxes para diferentes modos de acessibilidade */
const highContrastCheck = document.getElementById('high-contrast');
const darkModeCheck = document.getElementById('dark-mode');
const highlightLinksCheck = document.getElementById('highlight-links');
const lineHeightCheck = document.getElementById('line-height');

/* Botão para resetar todas as configurações */
const resetAccessibilityBtn = document.getElementById('reset-accessibility');

/* ===== VARIÁVEL GLOBAL PARA TAMANHO DA FONTE ===== */
/* Armazena o percentual atual (100% = tamanho padrão) */
let currentFontSize = 100;

/* ===== CARREGAR PREFERÊNCIAS SALVAS ===== */
/* Recupera as configurações de acessibilidade do localStorage ao iniciar */
function loadAccessibilityPreferences() {
    /* Obtém objeto JSON do localStorage ou retorna objeto vazio */
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences')) || {};
    
    /* Aplicar tamanho da fonte salvo */
    if (preferences.fontSize) {
        currentFontSize = preferences.fontSize;
        document.documentElement.style.fontSize = currentFontSize + '%';
    }
    
    /* Aplicar alto contraste */
    if (preferences.highContrast) {
        document.body.classList.add('high-contrast');
        if (highContrastCheck) highContrastCheck.checked = true;
    }
    
    /* Aplicar modo escuro */
    if (preferences.darkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeCheck) darkModeCheck.checked = true;
    }
    
    /* Aplicar destaque de links */
    if (preferences.highlightLinks) {
        document.body.classList.add('highlight-links');
        if (highlightLinksCheck) highlightLinksCheck.checked = true;
    }
    
    /* Aplicar espaçamento aumentado */
    if (preferences.increasedSpacing) {
        document.body.classList.add('increased-spacing');
        if (lineHeightCheck) lineHeightCheck.checked = true;
    }
}

/* ===== SALVAR PREFERÊNCIAS ===== */
/* Armazena as configurações atuais no localStorage */
function saveAccessibilityPreferences() {
    const preferences = {
        fontSize: currentFontSize,
        highContrast: document.body.classList.contains('high-contrast'),
        darkMode: document.body.classList.contains('dark-mode'),
        highlightLinks: document.body.classList.contains('highlight-links'),
        increasedSpacing: document.body.classList.contains('increased-spacing')
    };
    
    /* Salvar como JSON */
    localStorage.setItem('accessibilityPreferences', JSON.stringify(preferences));
}

/* ===== CONTROLE DO PAINEL DE ACESSIBILIDADE ===== */

/* Abrir painel ao clicar no botão */
if (accessibilityBtn) {
    accessibilityBtn.addEventListener('click', () => {
        accessibilityPanel.classList.add('active');
        accessibilityPanel.setAttribute('aria-hidden', 'false');
        accessibilityBtn.setAttribute('aria-expanded', 'true');
    });
}

/* Fechar painel ao clicar no botão X */
if (closeAccessibility) {
    closeAccessibility.addEventListener('click', () => {
        accessibilityPanel.classList.remove('active');
        accessibilityPanel.setAttribute('aria-hidden', 'true');
        accessibilityBtn.setAttribute('aria-expanded', 'false');
    });
}

/* Fechar painel ao clicar fora dele */
document.addEventListener('click', (e) => {
    if (accessibilityPanel && accessibilityBtn) {
        if (!accessibilityPanel.contains(e.target) && !accessibilityBtn.contains(e.target)) {
            accessibilityPanel.classList.remove('active');
            accessibilityPanel.setAttribute('aria-hidden', 'true');
            accessibilityBtn.setAttribute('aria-expanded', 'false');
        }
    }
});

/* Fechar painel ao pressionar tecla ESC */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && accessibilityPanel.classList.contains('active')) {
        accessibilityPanel.classList.remove('active');
        accessibilityPanel.setAttribute('aria-hidden', 'true');
        accessibilityBtn.setAttribute('aria-expanded', 'false');
    }
});

/* ===== CONTROLE DE TAMANHO DE FONTE ===== */

/* Aumentar tamanho da fonte (máximo 150%) */
if (increaseFontBtn) {
    increaseFontBtn.addEventListener('click', () => {
        if (currentFontSize < 150) {
            currentFontSize += 10;
            document.documentElement.style.fontSize = currentFontSize + '%';
            saveAccessibilityPreferences();
        }
    });
}

/* Diminuir tamanho da fonte (mínimo 80%) */
if (decreaseFontBtn) {
    decreaseFontBtn.addEventListener('click', () => {
        if (currentFontSize > 80) {
            currentFontSize -= 10;
            document.documentElement.style.fontSize = currentFontSize + '%';
            saveAccessibilityPreferences();
        }
    });
}

/* Resetar tamanho da fonte para 100% */
if (resetFontBtn) {
    resetFontBtn.addEventListener('click', () => {
        currentFontSize = 100;
        document.documentElement.style.fontSize = currentFontSize + '%';
        saveAccessibilityPreferences();
    });
}

/* ===== MODO ALTO CONTRASTE ===== */
/* Preto e branco com bordas mais definidas */
if (highContrastCheck) {
    highContrastCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('high-contrast');
            /* Desativar modo escuro se estiver ativo (evita conflito) */
            document.body.classList.remove('dark-mode');
            if (darkModeCheck) darkModeCheck.checked = false;
        } else {
            document.body.classList.remove('high-contrast');
        }
        saveAccessibilityPreferences();
    });
}

/* ===== MODO ESCURO ===== */
/* Fundo escuro com texto claro para reduzir fadiga visual */
if (darkModeCheck) {
    darkModeCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            /* Desativar alto contraste se estiver ativo (evita conflito) */
            document.body.classList.remove('high-contrast');
            if (highContrastCheck) highContrastCheck.checked = false;
        } else {
            document.body.classList.remove('dark-mode');
        }
        saveAccessibilityPreferences();
    });
}

/* ===== DESTAQUE DE LINKS ===== */
/* Adiciona sublinhado e fundo amarelo aos links para melhor visibilidade */
if (highlightLinksCheck) {
    highlightLinksCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('highlight-links');
        } else {
            document.body.classList.remove('highlight-links');
        }
        saveAccessibilityPreferences();
    });
}

/* ===== ESPAÇAMENTO AUMENTADO ===== */
/* Aumenta o espaço entre linhas e parágrafos para melhor legibilidade */
if (lineHeightCheck) {
    lineHeightCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('increased-spacing');
        } else {
            document.body.classList.remove('increased-spacing');
        }
        saveAccessibilityPreferences();
    });
}

/* ===== RESETAR TODAS AS CONFIGURAÇÕES DE ACESSIBILIDADE ===== */
/* Remove todas as customizações e volta aos padrões */
if (resetAccessibilityBtn) {
    resetAccessibilityBtn.addEventListener('click', () => {
        /* Remover todas as classes de acessibilidade */
        document.body.classList.remove('high-contrast', 'dark-mode', 'highlight-links', 'increased-spacing');
        
        /* Resetar tamanho da fonte para 100% */
        currentFontSize = 100;
        document.documentElement.style.fontSize = currentFontSize + '%';
        
        /* Desmarcar todos os checkboxes */
        if (highContrastCheck) highContrastCheck.checked = false;
        if (darkModeCheck) darkModeCheck.checked = false;
        if (highlightLinksCheck) highlightLinksCheck.checked = false;
        if (lineHeightCheck) lineHeightCheck.checked = false;
        
        /* Parar leitura de voz se estiver ativa */
        const textToSpeechCheck = document.getElementById('text-to-speech');
        if (textToSpeechCheck) {
            textToSpeechCheck.checked = false;
            stopSpeech();
        }
        
        /* Limpar dados do localStorage */
        localStorage.removeItem('accessibilityPreferences');
        
        /* Feedback visual ao usuário */
        alert('Configurações de acessibilidade restauradas para o padrão!');
    });
}

/* ===== FUNCIONALIDADE DE LEITURA DE VOZ (TEXT-TO-SPEECH) ===== */
/* Usa Web Speech API para ler o conteúdo da página em voz alta */

// Variáveis globais para controle de voz
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isSpeaking = false;
let selectedElements = [];

// Função para parar a leitura
function stopSpeech() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    isSpeaking = false;
    // Remover destaques visuais
    selectedElements.forEach(el => {
        el.style.outline = '';
        el.style.backgroundColor = '';
    });
    selectedElements = [];
}

// Função para ler texto
function speakText(text, element) {
    if (!text || text.trim() === '') return;
    
    // Cancelar leitura anterior se houver
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    // Criar nova instância de leitura
    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Configurações de voz
    currentUtterance.lang = 'pt-PT'; // Português de Portugal
    currentUtterance.rate = 0.9; // Velocidade (0.1 a 10)
    currentUtterance.pitch = 1; // Tom (0 a 2)
    currentUtterance.volume = 1; // Volume (0 a 1)
    
    // Destacar elemento sendo lido
    if (element) {
        element.style.outline = '3px solid var(--primary)';
        element.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
        selectedElements.push(element);
    }
    
    // Eventos de controle
    currentUtterance.onend = () => {
        isSpeaking = false;
        if (element) {
            element.style.outline = '';
            element.style.backgroundColor = '';
        }
    };
    
    currentUtterance.onerror = (event) => {
        console.error('Erro na leitura de voz:', event);
        isSpeaking = false;
    };
    
    // Iniciar leitura
    speechSynthesis.speak(currentUtterance);
    isSpeaking = true;
}

// Função para ler o conteúdo principal da página
function readPageContent() {
    // Selecionar elementos para leitura (priorizar conteúdo principal)
    const mainContent = document.querySelector('main') || document.body;
    const elementsToRead = mainContent.querySelectorAll('h1, h2, h3, p, li, button, a');
    
    let textToRead = '';
    elementsToRead.forEach(el => {
        // Ignorar elementos ocultos ou do painel de acessibilidade
        if (el.offsetParent !== null && !el.closest('#accessibility-panel')) {
            const text = el.textContent.trim();
            if (text) {
                textToRead += text + '. ';
            }
        }
    });
    
    if (textToRead) {
        speakText(textToRead, mainContent);
    }
}

// Adicionar evento ao checkbox de Text-to-Speech
const textToSpeechCheck = document.getElementById('text-to-speech');
if (textToSpeechCheck) {
    textToSpeechCheck.addEventListener('change', function() {
        if (this.checked) {
            // Verificar suporte do navegador
            if (!('speechSynthesis' in window)) {
                alert('Desculpe, seu navegador não suporta leitura de voz. Tente usar Chrome, Edge ou Firefox.');
                this.checked = false;
                return;
            }
            
            // Ativar modo de leitura
            isSpeaking = true;
            
            // Ler conteúdo da página
            readPageContent();
            
            // Adicionar listeners para ler ao passar o mouse (opcional)
            document.querySelectorAll('h1, h2, h3, p, button, a').forEach(el => {
                el.addEventListener('mouseenter', function(e) {
                    if (isSpeaking && textToSpeechCheck.checked) {
                        const text = this.textContent.trim();
                        if (text && !this.closest('#accessibility-panel')) {
                            speakText(text, this);
                        }
                    }
                });
            });
            
            // Feedback ao usuário
            console.log('Leitura de voz ativada. Passe o mouse sobre os elementos para ouvir.');
            
        } else {
            // Desativar e parar leitura
            stopSpeech();
        }
        
        saveAccessibilityPreferences();
    });
}

// Adicionar suporte a teclas de atalho para leitura de voz
document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + S = Parar leitura
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        const textToSpeechCheck = document.getElementById('text-to-speech');
        if (textToSpeechCheck && textToSpeechCheck.checked) {
            stopSpeech();
            textToSpeechCheck.checked = false;
            saveAccessibilityPreferences();
        }
    }
    
    // Ctrl + Shift + R = Ler página
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        const textToSpeechCheck = document.getElementById('text-to-speech');
        if (textToSpeechCheck) {
            textToSpeechCheck.checked = true;
            textToSpeechCheck.dispatchEvent(new Event('change'));
        }
    }
});

/* ===== INICIALIZAÇÃO ===== */
/* Carregar preferências salvas ao iniciar a página */
loadAccessibilityPreferences();

