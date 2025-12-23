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
        this.conversationHistory = this.loadHistory();
        
        this.init();
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
                this.displayMessage('你好！我是Chad Guo的AI助手 👋', 'ai');
                setTimeout(() => {
                    this.displayMessage('我可以回答关于背景经历、服务内容、资历背书或预约咨询等问题。有什么想了解的吗？', 'ai');
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

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // 显示用户消息
        this.displayMessage(message, 'user');
        this.chatInput.value = '';
        this.autoResizeTextarea();
        this.saveHistory({ text: message, sender: 'user' });

        // 显示打字指示器
        this.showTypingIndicator();

        // 模拟AI回复延迟
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.displayMessage(response, 'ai');
            this.saveHistory({ text: response, sender: 'ai' });
        }, 1000 + Math.random() * 1000);
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

        // 关于背景和经历
        if (lowerMessage.includes('背景') || lowerMessage.includes('介绍') || lowerMessage.includes('经历') || lowerMessage.includes('资历')) {
            return '我是Chad Guo，拥有5年世界500强AI营销专家经验，足迹遍布7大洲90个国家。我毕业于阿姆斯特丹大学，获得商科硕士学位。我将世界500强的严谨逻辑与纵横全球的跨文化洞察相结合，为客户提供跨越边界的深度服务。';
        }

        // 关于服务
        if (lowerMessage.includes('服务') || lowerMessage.includes('提供') || lowerMessage.includes('咨询')) {
            return '我提供两大类服务：\n\n【全球商业战略】\n1. 企业出海全案咨询 - 跨越文化鸿沟，打破增长瓶颈\n2. AI赋能战略&营销咨询 - 用技术杠杆，重塑商业增长\n\n【卓越个人生活】\n1. 高端旅行私人定制 - 不是旅行，是生命维度的拓宽\n2. 国际视野Life Coach - 认知重塑，成就世界级人格\n\n您可以在服务概览区域查看详细信息。';
        }

        // 关于预约
        if (lowerMessage.includes('预约') || lowerMessage.includes('咨询') || lowerMessage.includes('联系') || lowerMessage.includes('如何')) {
            return '您可以通过以下方式联系我：\n1. 点击页面顶部的"开启商业咨询"或"预约私人定制"按钮\n2. 通过页面底部的联系方式\n3. 直接在这里告诉我您的需求，我会尽快回复\n\n我专注于为远见者提供专属服务，期待与您的深度合作。';
        }

        // 关于AI营销
        if (lowerMessage.includes('ai') || lowerMessage.includes('营销') || lowerMessage.includes('出海')) {
            return '在AI营销领域，我拥有5年世界500强头部大厂的实战经验。我擅长构建基于生成式AI的营销闭环，优化投入产出比（ROI），在存量时代实现智能突围。同时，我也为企业提供出海全案咨询，依托全球90国的本土化洞察，帮助企业跨越文化鸿沟，实现全球化增长。';
        }

        // 关于旅行
        if (lowerMessage.includes('旅行') || lowerMessage.includes('旅游') || lowerMessage.includes('定制')) {
            return '基于环游七大洲的极致阅历，我为高净值人群提供高端旅行私人定制服务。拒绝平庸路径，每一程都是艺术品级的独特体验 - 无论是极地探索、文明溯源还是隐世疗愈之旅。这不是旅行，而是生命维度的拓宽。';
        }

        // 关于coaching
        if (lowerMessage.includes('coach') || lowerMessage.includes('教练') || lowerMessage.includes('指导') || lowerMessage.includes('转型')) {
            return '我提供国际视野Life Coach服务，将商科硕士的理性分析与环球旅行的人文感悟结合。通过一对一深度陪伴，我助力精英群体在职业迷茫与生活转型期，找回内驱力，构建全球化视野下的个人竞争力。认知重塑，成就世界级人格。';
        }

        // 默认回复
        const defaultResponses = [
            '这是一个很好的问题。',
            '让我为您详细解答。',
            '很高兴您问这个。',
            '这确实值得深入探讨。'
        ];

        if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            return '你好！我是Chad Guo的AI助手。我可以回答关于我的背景、服务、资历等问题。您也可以询问如何预约咨询或了解更多信息。';
        }

        if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢')) {
            return '不客气！如果还有其他问题，随时问我。期待为您提供专业服务。';
        }

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)] + ' 您可以问我关于个人背景、服务内容、资历或如何预约咨询等问题。';
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

    saveHistory(message) {
        this.conversationHistory.push(message);
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        localStorage.setItem('chatHistory', JSON.stringify(this.conversationHistory));
    }

    loadHistory() {
        const saved = localStorage.getItem('chatHistory');
        return saved ? JSON.parse(saved) : [];
    }
}

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    // 创建粒子效果
    createParticles();

    // 初始化轮播
    new Carousel();

    // 初始化时间线动画
    animateTimeline();

    // 初始化技能动画
    animateSkills();

    // 初始化AI对话
    new ChatBot();

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
function initFormLogic() {
    const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
    const tobFields = document.getElementById('tobFields');
    const tocFields = document.getElementById('tocFields');

    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'tob') {
                tobFields.style.display = 'block';
                tocFields.style.display = 'none';
                // 清除ToC字段
                document.getElementById('city').value = '';
                document.getElementById('vision').value = '';
                document.getElementById('referral').value = '';
            } else if (e.target.value === 'toc') {
                tobFields.style.display = 'none';
                tocFields.style.display = 'block';
                // 清除ToB字段
                document.getElementById('company').value = '';
                document.getElementById('challenges').value = '';
                document.getElementById('objectives').value = '';
            }
        });
    });
}

// ===== 表单提交处理 =====
function initFormSubmit() {
    const form = document.getElementById('inquiryForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 收集表单数据
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // 这里可以添加实际的表单提交逻辑
        // 例如：发送到服务器、发送邮件等
        console.log('Form Data:', data);

        // 显示成功消息
        const submitBtn = form.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>已发送</span><span class="submit-btn-en">SENT</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)';
        submitBtn.disabled = true;

        // 3秒后恢复
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            form.reset();
            // 隐藏条件字段
            const tobFields = document.getElementById('tobFields');
            const tocFields = document.getElementById('tocFields');
            if (tobFields) tobFields.style.display = 'none';
            if (tocFields) tocFields.style.display = 'none';
            // 清除单选按钮选择
            const radios = form.querySelectorAll('input[name="serviceType"]');
            radios.forEach(radio => radio.checked = false);
        }, 3000);

        // 实际应用中，这里应该发送数据到服务器
        // fetch('/api/submit-inquiry', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
    });
}

