// ===== 全局变量 =====
let allInquiries = [];

// ===== InstantDB 导入 =====
let db, tx, id, waitForConnection;

// 异步加载 InstantDB 模块
(async function initInstantDB() {
    try {
        const instantdbModule = await import('./instantdb.config.js');
        db = instantdbModule.db;
        tx = instantdbModule.tx;
        id = instantdbModule.id;
        waitForConnection = instantdbModule.waitForConnection;
        console.log('✅ InstantDB 模块已加载');
    } catch (error) {
        console.warn('⚠️ InstantDB 模块加载失败，将仅使用 localStorage:', error);
    }
})();

// ===== 加载咨询数据 =====
function loadInquiries() {
    try {
        console.log('📦 开始加载咨询数据...');
        
        // 从 localStorage 加载数据
        const localDataStr = localStorage.getItem('inquiries_backup');
        console.log('📦 localStorage 原始数据:', localDataStr);
        
        if (!localDataStr) {
            console.log('⚠️ localStorage 中没有数据');
            showError('暂无咨询数据。请先提交一个咨询表单。');
            return;
        }
        
        const localData = JSON.parse(localDataStr);
        console.log('📦 解析后的数据:', localData);
        console.log('📦 数据数量:', localData.length);
        
        if (!Array.isArray(localData)) {
            console.error('❌ localStorage 数据格式错误，不是数组');
            showError('数据格式错误，请清除 localStorage 后重试。');
            return;
        }
        
        // 转换数据格式，确保所有字段都存在
        allInquiries = localData.map((item, index) => {
            const inquiry = {
                id: item.id || `inq_${Date.now()}_${index}`,
                name: item.name || '未提供',
                contact: item.contact || '未提供',
                email: item.email || '未提供',
                serviceType: item.serviceType || 'unknown',
                company: item.company || '',
                challenges: item.challenges || '',
                objectives: item.objectives || '',
                city: item.city || '',
                vision: item.vision || '',
                referral: item.referral || '',
                additional: item.additional || '',
                createdAt: item.createdAt || new Date().toISOString(),
            };
            console.log(`📋 咨询 ${index + 1}:`, inquiry);
            return inquiry;
        }).sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
        
        console.log('✅ 数据加载完成，共', allInquiries.length, '条记录');
        console.log('📊 所有咨询数据:', allInquiries);
        
        if (allInquiries.length === 0) {
            showError('暂无咨询数据。请先提交一个咨询表单。');
        } else {
            updateStats();
            displayInquiries('all');
        }
    } catch (error) {
        console.error('❌ 加载数据时出错:', error);
        console.error('❌ 错误详情:', error.stack);
        showError(`加载数据时出错: ${error.message}。请检查浏览器控制台获取详细信息。`);
    }
}

// ===== 更新统计数据 =====
function updateStats() {
    const total = allInquiries.length;
    const today = new Date().toDateString();
    const todayCount = allInquiries.filter(inq => {
        const inqDate = new Date(inq.createdAt).toDateString();
        return inqDate === today;
    }).length;
    
    const tobCount = allInquiries.filter(inq => inq.serviceType === 'tob').length;
    const tocCount = allInquiries.filter(inq => inq.serviceType === 'toc').length;
    
    document.getElementById('totalInquiries').textContent = total;
    document.getElementById('todayInquiries').textContent = todayCount;
    document.getElementById('tobCount').textContent = tobCount;
    document.getElementById('tocCount').textContent = tocCount;
}

// ===== 显示咨询列表 =====
function displayInquiries(filter = 'all') {
    const container = document.getElementById('inquiriesList');
    
    let filtered = allInquiries;
    if (filter !== 'all') {
        filtered = allInquiries.filter(inq => inq.serviceType === filter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>暂无咨询记录</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(inquiry => createInquiryCard(inquiry)).join('');
    
    // 添加删除按钮事件
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            const card = btn.closest('.inquiry-card');
            const inquiryId = card.dataset.id;
            deleteInquiry(inquiryId);
        });
    });
    
    // 添加详情查看事件（排除删除按钮）
    container.querySelectorAll('.inquiry-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // 如果点击的是删除按钮或其子元素，不触发详情查看
            if (e.target.closest('.delete-btn')) {
                return;
            }
            const id = card.dataset.id;
            showInquiryDetail(id);
        });
    });
}

// ===== 创建咨询卡片 =====
function createInquiryCard(inquiry) {
    const date = new Date(inquiry.createdAt).toLocaleString('zh-CN');
    const serviceType = inquiry.serviceType === 'tob' ? '企业咨询' : '个人定制';
    const serviceTypeEn = inquiry.serviceType === 'tob' ? 'ToB' : 'ToC';
    const name = inquiry.name || '未提供';
    const email = inquiry.email || '未提供';
    
    return `
        <div class="inquiry-card" data-id="${inquiry.id}">
            <div class="inquiry-header">
                <div class="inquiry-meta">
                    <span class="inquiry-type ${inquiry.serviceType}">${serviceType}</span>
                    <span class="inquiry-date">${date}</span>
                </div>
                <div class="inquiry-actions">
                    <button class="delete-btn" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            <div class="inquiry-body">
                <h3 class="inquiry-name">${name}</h3>
                <p class="inquiry-email"><i class="fas fa-envelope"></i> ${email}</p>
                ${inquiry.serviceType === 'tob' && inquiry.company ? 
                    `<p class="inquiry-company"><i class="fas fa-building"></i> ${inquiry.company}</p>` : ''}
                ${inquiry.serviceType === 'toc' && inquiry.city ? 
                    `<p class="inquiry-city"><i class="fas fa-map-marker-alt"></i> ${inquiry.city}</p>` : ''}
            </div>
        </div>
    `;
}

// ===== 显示咨询详情 =====
function showInquiryDetail(id) {
    const inquiry = allInquiries.find(inq => inq.id === id);
    if (!inquiry) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>咨询详情</h2>
                <div class="modal-actions">
                    <button class="delete-btn-modal" data-inquiry-id="${inquiry.id}" title="删除此咨询">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h3>基本信息</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>姓名</label>
                            <p>${inquiry.name || '未提供'}</p>
                        </div>
                        <div class="detail-item">
                            <label>联系方式</label>
                            <p>${inquiry.contact || '未提供'}</p>
                        </div>
                        <div class="detail-item">
                            <label>邮箱</label>
                            <p>${inquiry.email || '未提供'}</p>
                        </div>
                        <div class="detail-item">
                            <label>服务类型</label>
                            <p><span class="inquiry-type ${inquiry.serviceType}">${inquiry.serviceType === 'tob' ? '企业咨询 (ToB)' : '个人定制 (ToC)'}</span></p>
                        </div>
                        <div class="detail-item">
                            <label>提交时间</label>
                            <p>${new Date(inquiry.createdAt).toLocaleString('zh-CN')}</p>
                        </div>
                    </div>
                </div>
                
                ${inquiry.serviceType === 'tob' ? `
                    <div class="detail-section">
                        <h3>企业信息</h3>
                        <div class="detail-item">
                            <label>公司名称及行业</label>
                            <p>${inquiry.company || '未提供'}</p>
                        </div>
                        <div class="detail-item">
                            <label>核心痛点</label>
                            <p>${inquiry.challenges || '未提供'}</p>
                        </div>
                        <div class="detail-item">
                            <label>合作目标</label>
                            <p>${inquiry.objectives || '未提供'}</p>
                        </div>
                    </div>
                ` : `
                    <div class="detail-section">
                        <h3>个人意向</h3>
                        <div class="detail-item">
                            <label>所在城市</label>
                            <p>${inquiry.city || '未提供'}</p>
                        </div>
                        <div class="detail-item">
                            <label>定制意向</label>
                            <p>${inquiry.vision || '未提供'}</p>
                        </div>
                        <div class="detail-item">
                            <label>推荐来源</label>
                            <p>${inquiry.referral || '未提供'}</p>
                        </div>
                    </div>
                `}
                
                ${inquiry.additional ? `
                    <div class="detail-section">
                        <h3>补充信息</h3>
                        <p>${inquiry.additional}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加删除按钮事件
    const deleteBtn = modal.querySelector('.delete-btn-modal');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const inquiryId = deleteBtn.dataset.inquiryId;
            deleteInquiry(inquiryId);
            closeModal();
        });
    }
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===== 筛选功能 =====
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            displayInquiries(filter);
        });
    });
}

// ===== 关闭模态框 =====
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// ===== 删除咨询 =====
async function deleteInquiry(inquiryId) {
    // 确认删除
    if (!confirm('确定要删除这条咨询记录吗？此操作无法撤销。')) {
        return;
    }
    
    try {
        console.log('🗑️ 开始删除咨询:', inquiryId);
        
        // 1. 从 localStorage 删除
        const localDataStr = localStorage.getItem('inquiries_backup');
        if (localDataStr) {
            const localData = JSON.parse(localDataStr);
            const filtered = localData.filter(inq => inq.id !== inquiryId);
            localStorage.setItem('inquiries_backup', JSON.stringify(filtered));
            console.log('✅ 已从 localStorage 删除');
        }
        
        // 2. 从 InstantDB 删除（如果有 instantDbId）
        const inquiry = allInquiries.find(inq => inq.id === inquiryId);
        if (inquiry && inquiry.instantDbId && db && tx && db.transact) {
            try {
                if (waitForConnection) {
                    await waitForConnection();
                }
                db.transact(
                    tx.inquiries[inquiry.instantDbId].delete()
                );
                console.log('✅ 已从 InstantDB 删除');
            } catch (error) {
                console.warn('⚠️ InstantDB 删除失败，但 localStorage 已删除:', error);
            }
        }
        
        // 3. 从内存中删除
        allInquiries = allInquiries.filter(inq => inq.id !== inquiryId);
        
        // 4. 更新显示
        updateStats();
        displayInquiries();
        
        // 5. 显示成功消息
        showSuccess('咨询记录已删除');
        
    } catch (error) {
        console.error('❌ 删除失败:', error);
        showError('删除失败，请重试。');
    }
}

// ===== 错误提示 =====
function showError(message) {
    const container = document.getElementById('inquiriesList');
    const localCount = JSON.parse(localStorage.getItem('inquiries_backup') || '[]').length;
    container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: left; font-size: 0.9rem;">
                <strong>调试信息：</strong><br>
                <small>请打开浏览器控制台（F12）查看详细日志</small><br>
                <small>LocalStorage 备份数据: ${localCount} 条</small>
            </div>
        </div>
    `;
}

// ===== 成功提示 =====
function showSuccess(message) {
    // 创建临时提示框
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 3秒后自动移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    loadInquiries();
    
    // 定期刷新数据（每30秒）
    setInterval(loadInquiries, 30000);
});

