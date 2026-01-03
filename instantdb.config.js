// InstantDB Configuration
// Public ID: 091dee0e-9e50-47f5-babf-a0b29687ce9e

// 使用 core 包而不是 react 包，因为我们在 vanilla JS 中不需要 React hooks
import { init, id, tx } from '@instantdb/core';

export const APP_ID = '091dee0e-9e50-47f5-babf-a0b29687ce9e';

// 注意：当前版本的 @instantdb/react 不导出 i（schema 构建器）
// 根据文档，schema 主要用于 TypeScript 类型检查，不是运行时必需的
// InstantDB 是 schemaless 的，可以直接使用

// 初始化 InstantDB（不使用 schema，因为 i 不可用）
const db = init({ appId: APP_ID });

// 连接状态管理
let isConnected = false;
let connectionCheckInterval = null;

// 检查 InstantDB 连接状态
function checkConnection() {
    try {
        // InstantDB 的连接状态可以通过检查 db 的内部状态来判断
        // 如果 db 有 _ws 或类似的连接对象，可以检查其状态
        if (db && typeof db === 'object') {
            // 尝试访问内部连接状态（如果可用）
            // 注意：这是 InstantDB 的内部实现，可能在不同版本中有所不同
            const hasConnection = db._ws || db._connection || db._client;
            if (hasConnection) {
                isConnected = true;
                return true;
            }
        }
        return false;
    } catch (error) {
        console.warn('⚠️ 检查连接状态时出错:', error);
        return false;
    }
}

// 等待 InstantDB 连接建立
async function waitForConnection(maxWaitTime = 5000) {
    const startTime = Date.now();
    
    // 立即检查一次
    if (checkConnection()) {
        isConnected = true;
        console.log('✅ InstantDB 已连接');
        return true;
    }
    
    // 轮询检查连接状态
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (checkConnection()) {
                isConnected = true;
                clearInterval(checkInterval);
                console.log('✅ InstantDB 连接已建立');
                resolve(true);
            } else if (Date.now() - startTime > maxWaitTime) {
                clearInterval(checkInterval);
                console.warn('⚠️ InstantDB 连接超时，继续尝试保存数据');
                resolve(false);
            }
        }, 100); // 每100ms检查一次
    });
}

// 启动连接状态监控
function startConnectionMonitoring() {
    if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
    }
    
    // 每2秒检查一次连接状态
    connectionCheckInterval = setInterval(() => {
        const wasConnected = isConnected;
        const nowConnected = checkConnection();
        
        if (!wasConnected && nowConnected) {
            console.log('✅ InstantDB 连接已建立');
        } else if (wasConnected && !nowConnected) {
            console.warn('⚠️ InstantDB 连接已断开');
        }
        
        isConnected = nowConnected;
    }, 2000);
    
    // 初始检查
    checkConnection();
}

// 启动监控
startConnectionMonitoring();

export { db, id, tx, waitForConnection, checkConnection, isConnected };

