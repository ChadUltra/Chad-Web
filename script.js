// ===== InstantDB 导入 =====
import { db, id, tx, waitForConnection, checkConnection } from './instantdb.config.js';

// ===== 粒子效果 =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== 导航栏滚动效果 =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// ===== 视差效果 =====
window.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    particles.forEach((particle, index) => {
        const speed = (index % 5 + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===== 轮播功能 =====
class Carousel {
    constructor() {
        this.currentIndex = 0;
        this.items = document.querySelectorAll('.carousel-item');
        this.totalItems = this.items.length;
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        
        this.init();
    }

    init() {
        if (this.totalItems === 0 || !this.dotsContainer || !this.prevBtn || !this.nextBtn) {
            return; // 如果没有轮播元素，直接返回
        }

        // 创建指示点
        for (let i = 0; i < this.totalItems; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }

        // 按钮事件
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // 自动播放
        this.autoPlay();
        
        // 触摸支持
        this.addTouchSupport();
    }

    updateCarousel() {
        this.items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentIndex) {
                item.classList.add('active');
            } else if (index === this.currentIndex - 1 || (this.currentIndex === 0 && index === this.totalItems - 1)) {
                item.classList.add('prev');
            } else if (index === this.currentIndex + 1 || (this.currentIndex === this.totalItems - 1 && index === 0)) {
                item.classList.add('next');
            }
        });

        // 更新指示点
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    autoPlay() {
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;

        this.items[0].parentElement.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.items[0].parentElement.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        this.handleSwipe = () => {
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
    }
}

// ===== 时间线动画 =====
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// ===== 技能进度条动画 =====
function animateSkills() {
    const progressRings = document.querySelectorAll('.progress-ring-progress');
    if (progressRings.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                const circumference = 2 * Math.PI * 50;
                const offset = circumference - (progress / 100) * circumference;
                entry.target.style.strokeDashoffset = offset;
                entry.target.style.transition = 'stroke-dashoffset 1.5s ease';
            }
        });
    }, {
        threshold: 0.5
    });

    progressRings.forEach(ring => {
        observer.observe(ring);
    });

    // 添加SVG渐变定义到body（全局可用）
    if (!document.querySelector('#svgGradientDefs')) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('id', 'svgGradientDefs');
        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        
        const defs = document.createElementNS(svgNS, 'defs');
        const gradient = document.createElementNS(svgNS, 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS(svgNS, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#00d4ff');
        
        const stop2 = document.createElementNS(svgNS, 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#a855f7');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
        document.body.appendChild(svg);
    }
}

// ===== AI对话功能 =====
class ChatBot {
    constructor() {
        this.chatWindow = document.getElementById('chatWindow');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatClose = document.getElementById('chatClose');
        this.chatMinimize = document.getElementById('chatMinimize');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSendBtn = document.getElementById('chatSendBtn');
        this.quickQuestions = document.querySelectorAll('.quick-question-btn');
        this.isMinimized = false;
        this.sessionId = this.getOrCreateSessionId();
        this.conversationHistory = [];
        this.dbReady = false;
        
        this.init();
    }

    async init() {
        // 数据库已通过 import 初始化
        this.dbReady = true;
        
        // 加载历史记录
        await this.loadHistory();
        
        // 按钮事件
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        this.chatMinimize.addEventListener('click', () => this.minimizeChat());
        this.chatSendBtn.addEventListener('click', () => this.sendMessage());
        
        // 输入框事件
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.chatInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });

        // 快捷问题
        this.quickQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.chatInput.value = question;
                this.sendMessage();
            });
        });

        // 显示欢迎消息（如果没有历史记录）
        if (this.conversationHistory.length === 0) {
            setTimeout(() => {
                this.displayMessage('Hello! I\'m Chad Guo\'s AI assistant 👋', 'ai');
                setTimeout(() => {
                    this.displayMessage('I can answer questions about background, services, credentials, or booking consultations. What would you like to know?', 'ai');
                }, 500);
            }, 500);
        } else {
            // 显示历史记录
            this.conversationHistory.forEach(msg => {
                this.displayMessage(msg.message, msg.sender);
            });
        }
    }

    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('chatSessionId');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('chatSessionId', sessionId);
        }
        return sessionId;
    }

    init() {
        // 按钮事件
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        this.chatMinimize.addEventListener('click', () => this.minimizeChat());
        this.chatSendBtn.addEventListener('click', () => this.sendMessage());
        
        // 输入框事件
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.chatInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });

        // 快捷问题
        this.quickQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.chatInput.value = question;
                this.sendMessage();
            });
        });

        // 加载历史记录
        if (this.conversationHistory.length > 0) {
            this.conversationHistory.forEach(msg => {
                this.displayMessage(msg.text, msg.sender);
            });
        } else {
            // 显示欢迎消息
            setTimeout(() => {
                this.displayMessage('Hello! I\'m Chad Guo\'s AI assistant 👋', 'ai');
                setTimeout(() => {
                    this.displayMessage('I can answer questions about background, services, credentials, or booking consultations. What would you like to know?', 'ai');
                }, 500);
            }, 500);
        }
    }

    toggleChat() {
        if (this.chatWindow.classList.contains('active')) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatWindow.classList.add('active');
        this.chatWindow.classList.remove('minimized');
        this.isMinimized = false;
        this.chatInput.focus();
        this.scrollToBottom();
    }

    closeChat() {
        this.chatWindow.classList.remove('active');
        this.chatWindow.classList.remove('minimized');
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        if (this.isMinimized) {
            this.chatWindow.classList.add('minimized');
        } else {
            this.chatWindow.classList.remove('minimized');
            this.chatInput.focus();
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // 显示用户消息
        this.displayMessage(message, 'user');
        this.chatInput.value = '';
        this.autoResizeTextarea();
        await this.saveMessage(message, 'user');

        // 显示打字指示器
        this.showTypingIndicator();

        // 模拟AI回复延迟
        setTimeout(async () => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.displayMessage(response, 'ai');
            await this.saveMessage(response, 'ai');
        }, 1000 + Math.random() * 1000);
    }

    async saveMessage(message, sender) {
        if (!this.dbReady || !db) {
            // 降级到 localStorage
            const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            history.push({ text: message, sender });
            if (history.length > 50) history.shift();
            localStorage.setItem('chatHistory', JSON.stringify(history));
            return;
        }

        try {
            // 使用 InstantDB 保存消息
            const messageId = id();
            db.transact(
                tx.chat_messages[messageId].update({
                    sessionId: this.sessionId,
                    message: message,
                    sender: sender,
                    timestamp: Date.now(),
                })
            );
            
            // 更新会话
            db.transact(
                tx.chat_sessions[this.sessionId].update({
                    lastMessageAt: Date.now(),
                })
            );
            
            // 同时保存到 localStorage 作为备份
            const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            history.push({ text: message, sender });
            if (history.length > 50) history.shift();
            localStorage.setItem('chatHistory', JSON.stringify(history));
            
            this.conversationHistory.push({
                id: messageId,
                sessionId: this.sessionId,
                message: message,
                sender: sender,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('Error saving message to InstantDB:', error);
            // 降级到 localStorage
            const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            history.push({ text: message, sender });
            if (history.length > 50) history.shift();
            localStorage.setItem('chatHistory', JSON.stringify(history));
        }
    }

    async loadHistory() {
        try {
            // 从 localStorage 加载（InstantDB 的查询在 vanilla JS 中需要使用订阅模式）
            // 这里我们先从 localStorage 加载，InstantDB 会实时同步
            const saved = localStorage.getItem('chatHistory');
            this.conversationHistory = saved ? JSON.parse(saved).map(msg => ({
                message: msg.text,
                sender: msg.sender,
                timestamp: Date.now()
            })) : [];
            
            // TODO: 如果需要从 InstantDB 实时加载，需要使用 db.useQuery 的订阅模式
            // 在 vanilla JS 中，这可能需要不同的实现方式
        } catch (error) {
            console.error('Error loading history:', error);
            this.conversationHistory = [];
        }
    }

    displayMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'chat-message-avatar';
        avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'chat-message-bubble';
        bubble.textContent = text;

        const time = document.createElement('div');
        time.className = 'chat-message-time';
        time.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        bubble.appendChild(time);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message ai';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'chat-message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            indicator.appendChild(dot);
        }

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(indicator);
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // About background and experience
        if (lowerMessage.includes('background') || lowerMessage.includes('experience') || lowerMessage.includes('credentials') || lowerMessage.includes('qualification')) {
            return 'I\'m Chad Guo, with 5 years of Fortune 500 AI marketing expertise and exploration across 90+ countries. I hold an MSc in Business from the University of Amsterdam. I combine Fortune 500 analytical rigor with cross-cultural insights from global travels to deliver transformative services that bridge boundaries.';
        }

        // About services
        if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('consulting') || lowerMessage.includes('what can you')) {
            return 'I offer two main service categories:\n\n【Corporate Services】\n1. Global Market Expansion - Break through cultural barriers, unlock growth potential\n2. AI-Powered Marketing & Growth Strategy - Scale smarter with technology-driven solutions\n\n【Personal Services】\n1. Bespoke Travel Curation - Not just travel, a lifetime experience\n2. Global Mindset Coaching - Elevate your perspective, amplify your impact\n\nYou can find detailed information in the Services section.';
        }

        // About booking/contact
        if (lowerMessage.includes('book') || lowerMessage.includes('contact') || lowerMessage.includes('how') || lowerMessage.includes('reach') || lowerMessage.includes('consultation')) {
            return 'You can reach me through:\n1. Click the "Corporate Services" or "Personal Services" buttons at the top\n2. Fill out the contact form at the bottom of the page\n3. Tell me your needs here directly, and I\'ll respond as soon as possible\n\nI focus exclusively on serving visionaries ready to transform. Looking forward to working with you.';
        }

        // About AI marketing
        if (lowerMessage.includes('ai') || lowerMessage.includes('marketing') || lowerMessage.includes('expansion') || lowerMessage.includes('global')) {
            return 'In AI marketing, I have 5 years of hands-on experience at Fortune 500 companies. I specialize in building generative AI-powered marketing systems that optimize ROI and achieve breakthrough growth in saturated markets. I also provide global expansion consulting, leveraging insights from 90+ countries to help businesses cross cultural barriers and achieve global growth.';
        }

        // About travel
        if (lowerMessage.includes('travel') || lowerMessage.includes('journey') || lowerMessage.includes('bespoke') || lowerMessage.includes('curation')) {
            return 'Drawing from explorations across 7 continents, I design extraordinary journeys for discerning travelers—from Antarctic expeditions to African safaris and spiritual retreats in Bhutan. No cookie-cutter itineraries. This isn\'t just travel—it\'s a lifetime experience.';
        }

        // About coaching
        if (lowerMessage.includes('coach') || lowerMessage.includes('coaching') || lowerMessage.includes('mindset') || lowerMessage.includes('transformation')) {
            return 'I offer Global Mindset Coaching, combining business school analytical thinking with cross-cultural wisdom from global travels. Through 1-on-1 intensive coaching, I help high-achievers navigate career transitions or develop world-class leadership perspectives. Elevate your perspective, amplify your impact.';
        }

        // Default responses
        const defaultResponses = [
            'That\'s a great question.',
            'Let me provide you with detailed information.',
            'I\'m glad you asked.',
            'That\'s definitely worth exploring in depth.'
        ];

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! I\'m Chad Guo\'s AI assistant. I can answer questions about my background, services, credentials, and more. You can also ask about booking a consultation or learn more about what I offer.';
        }

        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return 'You\'re welcome! If you have any other questions, feel free to ask. I look forward to serving you.';
        }

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)] + ' You can ask me about my background, services, credentials, or how to book a consultation.';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }

}

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    // 显示 InstantDB 连接状态
    console.log('🔌 检查 InstantDB 连接状态...');
    console.log('📊 InstantDB App ID:', '091dee0e-9e50-47f5-babf-a0b29687ce9e');
    console.log('📊 db 对象:', db);
    console.log('📊 id 函数:', id);
    
    // 定期检查连接状态
    setInterval(() => {
        const connected = checkConnection();
        if (connected) {
            console.log('✅ InstantDB 连接正常');
        } else {
            console.log('⚠️ InstantDB 连接检查中...');
        }
    }, 5000);
    
    // 创建粒子效果
    createParticles();

    // 初始化轮播
    new Carousel();

    // 初始化时间线动画
    animateTimeline();

    // 初始化技能动画
    animateSkills();

    // 初始化AI对话（异步）
    const chatBot = new ChatBot();

    // 初始化表单逻辑
    initFormLogic();
    initFormSubmit();

    // 添加页面淡入效果
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== 滚动动画 =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .philosophy-content, .services-grid, .credentials-grid').forEach(el => {
    observer.observe(el);
});

// ===== 表单条件逻辑 =====
// ===== 表单逻辑和验证 =====
function initFormLogic() {
    const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
    const tobFields = document.getElementById('tobFields');
    const tocFields = document.getElementById('tocFields');
    
    // Initially hide both fields and remove required attributes
    if (tobFields) {
        tobFields.style.display = 'none';
        tobFields.style.visibility = 'hidden';
        tobFields.classList.remove('active');
        // Mark required fields and remove required attribute
        const tobRequiredFields = tobFields.querySelectorAll('[required]');
        tobRequiredFields.forEach(field => {
            field.setAttribute('data-was-required', 'true');
            field.removeAttribute('required');
        });
    }
    if (tocFields) {
        tocFields.style.display = 'none';
        tocFields.style.visibility = 'hidden';
        tocFields.classList.remove('active');
        // Mark required fields and remove required attribute
        const tocRequiredFields = tocFields.querySelectorAll('[required]');
        tocRequiredFields.forEach(field => {
            field.setAttribute('data-was-required', 'true');
            field.removeAttribute('required');
        });
    }

    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            console.log('Service type changed to:', e.target.value);
            
            if (e.target.value === 'tob') {
                // Hide ToC fields with animation
                if (tocFields) {
                    tocFields.classList.remove('active');
                    tocFields.style.display = 'none';
                    tocFields.style.visibility = 'hidden';
                    // Remove required attributes from hidden ToC fields
                    const tocRequiredFields = tocFields.querySelectorAll('[required]');
                    tocRequiredFields.forEach(field => {
                        field.removeAttribute('required');
                        field.setAttribute('data-was-required', 'true');
                    });
                }
                
                // Show ToB fields with animation
                if (tobFields) {
                    tobFields.style.display = 'block';
                    tobFields.style.visibility = 'visible';
                    // Restore required attributes for visible ToB fields
                    const tobRequiredFields = tobFields.querySelectorAll('[data-was-required="true"]');
                    tobRequiredFields.forEach(field => {
                        field.setAttribute('required', 'required');
                    });
                    // Small delay to ensure display is set before adding active class
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            tobFields.classList.add('active');
                            console.log('ToB fields shown, active class added');
                        });
                    });
                }
                
                // Clear ToC fields
                clearFields(['city', 'timezone', 'serviceInterest', 'vision', 'referral', 'travelBudget', 'travelDates']);
                const serviceInterestRadios = document.querySelectorAll('input[name="serviceInterest"]');
                serviceInterestRadios.forEach(r => r.checked = false);
                
            } else if (e.target.value === 'toc') {
                // Hide ToB fields with animation
                if (tobFields) {
                    tobFields.classList.remove('active');
                    tobFields.style.display = 'none';
                    tobFields.style.visibility = 'hidden';
                    // Remove required attributes from hidden ToB fields
                    const tobRequiredFields = tobFields.querySelectorAll('[required]');
                    tobRequiredFields.forEach(field => {
                        field.removeAttribute('required');
                        field.setAttribute('data-was-required', 'true');
                    });
                }
                
                // Show ToC fields with animation
                if (tocFields) {
                    tocFields.style.display = 'block';
                    tocFields.style.visibility = 'visible';
                    // Restore required attributes for visible ToC fields
                    const tocRequiredFields = tocFields.querySelectorAll('[data-was-required="true"]');
                    tocRequiredFields.forEach(field => {
                        field.setAttribute('required', 'required');
                    });
                    // Small delay to ensure display is set before adding active class
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            tocFields.classList.add('active');
                            console.log('ToC fields shown, active class added');
                        });
                    });
                }
                
                // Clear ToB fields
                clearFields(['company', 'industry', 'companySize', 'role', 'challenges', 'objectives', 'budget', 'timeline']);
            }
        });
    });
    
    // Initialize fields as hidden and remove required attributes
    if (tobFields) {
        tobFields.style.display = 'none';
        tobFields.style.visibility = 'hidden';
        tobFields.classList.remove('active');
        // Mark required fields and remove required attribute
        const tobRequiredFields = tobFields.querySelectorAll('[required]');
        tobRequiredFields.forEach(field => {
            field.setAttribute('data-was-required', 'true');
            field.removeAttribute('required');
        });
    }
    if (tocFields) {
        tocFields.style.display = 'none';
        tocFields.style.visibility = 'hidden';
        tocFields.classList.remove('active');
        // Mark required fields and remove required attribute
        const tocRequiredFields = tocFields.querySelectorAll('[required]');
        tocRequiredFields.forEach(field => {
            field.setAttribute('data-was-required', 'true');
            field.removeAttribute('required');
        });
    }
    
    // Initialize real-time validation
    initFormValidation();
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="margin-right: 0.5rem;"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000); // Toast disappears after 4 seconds
}

// Clear form fields
function clearFields(fieldIds) {
    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.value = '';
            removeFieldError(field);
        }
    });
}

// Initialize form validation
function initFormValidation() {
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', validateEmail);
        emailField.addEventListener('input', () => {
            if (emailField.value && !emailField.classList.contains('error')) {
                validateEmail({ target: emailField });
            }
        });
    }
    
    // Phone validation
    const phoneField = document.getElementById('contact');
    if (phoneField) {
        phoneField.addEventListener('blur', validatePhone);
        phoneField.addEventListener('input', () => {
            if (phoneField.value && !phoneField.classList.contains('error')) {
                validatePhone({ target: phoneField });
            }
        });
    }
    
    // Required fields validation
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateRequired);
        field.addEventListener('input', () => {
            if (field.value) {
                removeFieldError(field);
            }
        });
    });
}

// Validate email
function validateEmail(e) {
    const field = e.target || e;
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(field, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    } else {
        removeFieldError(field);
        return true;
    }
}

// Validate phone
function validatePhone(e) {
    const field = e.target || e;
    const phone = field.value.trim();
    // International phone format: + followed by digits, spaces, dashes, parentheses
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    
    if (!phone) {
        showFieldError(field, 'Phone number is required');
        return false;
    } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showFieldError(field, 'Please enter a valid phone number (e.g., +1 (555) 123-4567)');
        return false;
    } else {
        removeFieldError(field);
        return true;
    }
}

// Validate required field
function validateRequired(e) {
    const field = e.target || e;
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    } else {
        removeFieldError(field);
        return true;
    }
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message show';
    errorMsg.textContent = message;
    field.parentElement.appendChild(errorMsg);
}

// Remove field error
function removeFieldError(field) {
    field.classList.remove('error');
    field.classList.add('success');
    
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.classList.remove('show');
        setTimeout(() => errorMsg.remove(), 300);
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;
    const form = document.getElementById('inquiryForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (field.type === 'email') {
            if (!validateEmail(field)) isValid = false;
        } else if (field.id === 'contact') {
            if (!validatePhone(field)) isValid = false;
        } else {
            if (!validateRequired(field)) isValid = false;
        }
    });
    
    // Validate conditional required fields
    const serviceType = form.querySelector('input[name="serviceType"]:checked');
    if (serviceType) {
        if (serviceType.value === 'tob') {
            const company = document.getElementById('company');
            const challenges = document.getElementById('challenges');
            if (company && !validateRequired(company)) isValid = false;
            if (challenges && !validateRequired(challenges)) isValid = false;
        } else if (serviceType.value === 'toc') {
            const referral = document.getElementById('referral');
            const serviceInterest = form.querySelector('input[name="serviceInterest"]:checked');
            const vision = document.getElementById('vision');
            if (referral && !validateRequired(referral)) isValid = false;
            if (!serviceInterest) {
                const serviceInterestGroup = document.querySelector('input[name="serviceInterest"]').closest('.form-group');
                if (serviceInterestGroup) {
                    showFieldError(serviceInterestGroup.querySelector('input'), 'Please select a service interest');
                    isValid = false;
                }
            }
            if (vision && !validateRequired(vision)) isValid = false;
        }
    }
    
    return isValid;
}

// ===== InstantDB 数据操作函数 =====

// 保存咨询数据
async function saveInquiry(data) {
    // 1. 清理和验证数据
    // 去除所有字段的前后空格，只保留非空字段
    const cleanedData = {};
    
    // 基础字段（所有情况）
    if (data.name && data.name.trim()) cleanedData.name = data.name.trim();
    if (data.contact && data.contact.trim()) cleanedData.contact = data.contact.trim();
    if (data.email && data.email.trim()) cleanedData.email = data.email.trim();
    if (data.serviceType && data.serviceType.trim()) cleanedData.serviceType = data.serviceType.trim();
    if (data.additional && data.additional.trim()) cleanedData.additional = data.additional.trim();
    
    // ToB specific fields
    if (data.company && data.company.trim()) cleanedData.company = data.company.trim();
    if (data.industry && data.industry.trim()) cleanedData.industry = data.industry.trim();
    if (data.companySize && data.companySize.trim()) cleanedData.companySize = data.companySize.trim();
    if (data.role && data.role.trim()) cleanedData.role = data.role.trim();
    if (data.challenges && data.challenges.trim()) cleanedData.challenges = data.challenges.trim();
    if (data.objectives && data.objectives.trim()) cleanedData.objectives = data.objectives.trim();
    if (data.budget && data.budget.trim()) cleanedData.budget = data.budget.trim();
    if (data.timeline && data.timeline.trim()) cleanedData.timeline = data.timeline.trim();
    
    // ToC specific fields
    if (data.city && data.city.trim()) cleanedData.city = data.city.trim();
    if (data.timezone && data.timezone.trim()) cleanedData.timezone = data.timezone.trim();
    if (data.serviceInterest && data.serviceInterest.trim()) cleanedData.serviceInterest = data.serviceInterest.trim();
    if (data.vision && data.vision.trim()) cleanedData.vision = data.vision.trim();
    if (data.referral && data.referral.trim()) cleanedData.referral = data.referral.trim();
    if (data.travelBudget && data.travelBudget.trim()) cleanedData.travelBudget = data.travelBudget.trim();
    if (data.travelDates && data.travelDates.trim()) cleanedData.travelDates = data.travelDates.trim();
    
    // 添加时间戳
    cleanedData.createdAt = Date.now();
    
    // 生成唯一ID（用于 localStorage）
    const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const inquiryData = { 
        ...cleanedData, 
        id: inquiryId, 
        createdAt: new Date().toISOString() // localStorage 使用 ISO 字符串
    };
    
    console.log('📋 清理后的数据:', cleanedData);
    console.log('📋 字段数量:', Object.keys(cleanedData).length);
    
    // 2. 先保存到 localStorage（确保数据不丢失）
    try {
        const localInquiries = JSON.parse(localStorage.getItem('inquiries_backup') || '[]');
        localInquiries.push(inquiryData);
        localStorage.setItem('inquiries_backup', JSON.stringify(localInquiries));
        console.log('✅ 数据已保存到 localStorage:', inquiryData);
    } catch (error) {
        console.error('❌ 保存到 localStorage 失败:', error);
        throw error; // 如果 localStorage 也失败，抛出错误
    }
    
    // 3. 保存到 InstantDB
    try {
        // 检查 InstantDB 是否可用
        if (!db || !db.transact || !tx || !id) {
            console.warn('⚠️ InstantDB 未正确初始化');
            console.warn('⚠️ db:', db, 'tx:', tx, 'id:', id);
            // 不在这里返回，继续执行邮件发送
            console.log('⚠️ 将跳过 InstantDB 保存，但会继续发送邮件');
        } else {
            // 等待 InstantDB 连接建立（最多等待5秒）
            console.log('⏳ 等待 InstantDB 连接建立...');
            const connected = await waitForConnection(5000);
            
            if (!connected) {
                console.warn('⚠️ InstantDB 连接未建立，但继续尝试保存数据');
            }
            
            // 生成 InstantDB 的唯一ID
            const instantDbId = id();
            console.log('💾 正在保存到 InstantDB');
            console.log('📋 InstantDB 数据ID:', instantDbId);
            console.log('📋 完整数据对象:', cleanedData);
            console.log('📋 字段详情:');
            Object.keys(cleanedData).forEach(key => {
                console.log(`  - ${key}: ${typeof cleanedData[key]} = ${cleanedData[key]}`);
            });
            
            // 执行事务 - 只保存非空字段
            try {
                // 构建更新对象，只包含非空字段
                const updateData = {
                    createdAt: cleanedData.createdAt,
                };
                
                // 基础字段
                if (cleanedData.name) updateData.name = cleanedData.name;
                if (cleanedData.contact) updateData.contact = cleanedData.contact;
                if (cleanedData.email) updateData.email = cleanedData.email;
                if (cleanedData.serviceType) updateData.serviceType = cleanedData.serviceType;
                if (cleanedData.additional) updateData.additional = cleanedData.additional;
                
                // ToB 字段（如果 serviceType 是 'tob'）
                if (cleanedData.serviceType === 'tob') {
                    if (cleanedData.company) updateData.company = cleanedData.company;
                    if (cleanedData.challenges) updateData.challenges = cleanedData.challenges;
                    if (cleanedData.objectives) updateData.objectives = cleanedData.objectives;
                }
                
                // ToC 字段（如果 serviceType 是 'toc'）
                if (cleanedData.serviceType === 'toc') {
                    if (cleanedData.city) updateData.city = cleanedData.city;
                    if (cleanedData.vision) updateData.vision = cleanedData.vision;
                    if (cleanedData.referral) updateData.referral = cleanedData.referral;
                }
                
                console.log('📤 发送到 InstantDB 的数据:', updateData);
                console.log('📤 数据字段数:', Object.keys(updateData).length);
                
                db.transact(
                    tx.inquiries[instantDbId].update(updateData)
                );
                
                console.log('✅ 事务已提交到 InstantDB');
                console.log('✅ 数据应该会在几秒内出现在 InstantDB Explorer 中');
                console.log('✅ 请在 InstantDB Explorer 中查看 inquiries 表');
                
                // 验证事务是否成功
                setTimeout(() => {
                    console.log('🔍 数据应该已经保存到 InstantDB');
                    console.log('🔍 请刷新 InstantDB Explorer 查看数据');
                }, 2000);
                
            } catch (transactError) {
                console.error('❌ 事务执行失败:', transactError);
                console.error('❌ 错误类型:', transactError.constructor.name);
                console.error('❌ 错误消息:', transactError.message);
                console.error('❌ 错误堆栈:', transactError.stack);
                throw transactError;
            }
        }
    } catch (error) {
        console.error('❌ InstantDB 保存过程出错:', error);
        console.error('❌ 错误类型:', error?.constructor?.name);
        console.error('❌ 错误消息:', error?.message);
        console.error('❌ 错误堆栈:', error?.stack);
        // 不抛出错误，因为数据已经在 localStorage 中
    }
    
    // 4. 发送确认邮件（异步，不阻塞主流程）
    console.log('📧 ========== 准备发送确认邮件 ==========');
    console.log('📧 邮件数据:', {
        name: inquiryData.name,
        email: inquiryData.email,
        serviceType: inquiryData.serviceType
    });
    sendConfirmationEmail(inquiryData).catch(error => {
        console.warn('⚠️ 邮件发送失败，但不影响表单提交:', error);
    });
    
    return { success: true, data: inquiryData };
}

// ===== 发送确认邮件 =====
async function sendConfirmationEmail(inquiryData) {
    try {
        console.log('📧 [邮件] 开始处理邮件发送请求...');
        
        // 检查必需字段
        if (!inquiryData.email || !inquiryData.name || !inquiryData.serviceType) {
            console.warn('⚠️ [邮件] 跳过发送：缺少必需字段', {
                hasEmail: !!inquiryData.email,
                hasName: !!inquiryData.name,
                hasServiceType: !!inquiryData.serviceType
            });
            return;
        }

        console.log('📧 [邮件] 准备发送确认邮件到:', inquiryData.email);
        console.log('📧 [邮件] API 端点: /api/send-confirmation-email');
        
        const requestBody = {
            name: inquiryData.name,
            email: inquiryData.email,
            serviceType: inquiryData.serviceType,
        };
        
        console.log('📧 [邮件] 请求数据:', requestBody);
        
        const response = await fetch('/api/send-confirmation-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log('📧 [邮件] API 响应状态:', response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ [邮件] API 响应错误:', errorData);
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ [邮件] 确认邮件发送成功!');
        console.log('✅ [邮件] 响应详情:', result);
        console.log('✅ [邮件] 邮件 ID:', result.messageId);
        console.log('📧 ========== 邮件发送完成 ==========');
        
    } catch (error) {
        // 邮件发送失败不应影响表单提交
        console.error('❌ [邮件] 发送失败:', error);
        console.error('❌ [邮件] 错误详情:', {
            message: error.message,
            stack: error.stack
        });
        // 不抛出错误，让调用者知道这是非关键错误
    }
}

// ===== 表单提交处理 =====
function initFormSubmit() {
    const form = document.getElementById('inquiryForm');
    if (!form) {
        console.error('❌ 表单未找到: inquiryForm');
        return;
    }
    
    console.log('✅ 表单提交处理器已初始化');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📝 ========== 表单提交开始 ==========');
        
        // 收集表单数据
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (value.trim()) {
                data[key] = value.trim();
            }
        });
        
        console.log('📊 收集到的表单数据:', data);
        console.log('📊 数据字段数量:', Object.keys(data).length);

        // 获取提交按钮
        const submitBtn = form.querySelector('.submit-btn');
        if (!submitBtn) {
            console.error('❌ 提交按钮未找到');
            alert('错误：提交按钮未找到，请刷新页面重试');
            return;
        }
        
        // 保存原始状态
        const originalHTML = submitBtn.innerHTML;
        const originalBg = submitBtn.style.background;
        
        // Validate form before submission
        console.log('🔍 Validating form...');
        if (typeof validateForm === 'function') {
            const isValid = validateForm();
            console.log('🔍 Form validation result:', isValid);
            if (!isValid) {
                console.log('❌ Form validation failed');
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Please fix errors</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #ff4444 0%, #ff6666 100%)';
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = originalBg;
                }, 2000);
                return;
            }
            console.log('✅ Form validation passed');
        } else {
            console.warn('⚠️ validateForm function not found, skipping validation');
        }
        
        // Show loading state
        console.log('⏳ Showing loading state...');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';

        try {
            console.log('💾 Starting to save data...');
            
            // 保存数据
            const result = await saveInquiry(data);
            console.log('✅ Save result:', result);
            
            // Success feedback - Update button
            console.log('✅ Showing success state...');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent ✓</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'default';
            
            // Show toast notification
            showToast('Thank you! We\'ll respond within 48 hours.', 'success');
            console.log('✅ Success notification displayed');
            
            // Reset form after 2 seconds
            setTimeout(() => {
                console.log('🔄 Resetting form...');
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = originalBg;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                form.reset();
                
                // Hide conditional fields
                const tobFields = document.getElementById('tobFields');
                const tocFields = document.getElementById('tocFields');
                if (tobFields) {
                    tobFields.style.display = 'none';
                    tobFields.style.visibility = 'hidden';
                    tobFields.classList.remove('active');
                }
                if (tocFields) {
                    tocFields.style.display = 'none';
                    tocFields.style.visibility = 'hidden';
                    tocFields.classList.remove('active');
                }
                
                // Clear radio button selections
                const radios = form.querySelectorAll('input[name="serviceType"]');
                radios.forEach(radio => radio.checked = false);
                
                // Clear serviceInterest radio buttons if they exist
                const serviceInterestRadios = form.querySelectorAll('input[name="serviceInterest"]');
                serviceInterestRadios.forEach(radio => radio.checked = false);
                
                console.log('✅ Form has been reset');
            }, 3000);
            
            console.log('✅ ========== 表单提交完成 ==========');
            
        } catch (error) {
            console.error('❌ 保存失败:', error);
            
            // Error feedback
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Failed - Try Again</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #ff4444 0%, #ff6666 100%)';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            
            // Show error toast
            showToast('Submission failed. Please try again.', 'error');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = originalBg;
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'pointer';
            }, 3000);
        }
    });
}

