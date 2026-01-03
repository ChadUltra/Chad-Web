// Vercel Serverless Function for sending confirmation emails via Resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            {
                status: 405,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    try {
        // 解析请求体
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return new Response(
                JSON.stringify({ error: 'Invalid JSON in request body' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        
        const { name, email, serviceType } = body;

        // 验证必需字段
        if (!name || !email || !serviceType) {
            return new Response(
                JSON.stringify({ 
                    error: 'Missing required fields',
                    required: ['name', 'email', 'serviceType']
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email format' }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 确定服务类型描述
        const serviceTypeText = serviceType === 'tob' 
            ? '企业咨询 (ToB)' 
            : '个人定制 (ToC)';
        const serviceTypeEn = serviceType === 'tob'
            ? 'Corporate Consulting (ToB)'
            : 'Private Excellence (ToC)';

        // 发送者邮箱（从环境变量获取，或使用默认值）
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

        // 发送邮件
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: '感谢您的咨询申请 / Thank You for Your Inquiry',
            html: `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>确认邮件</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #00d4ff;
        }
        .header h1 {
            color: #1a1a1a;
            font-size: 24px;
            margin: 0;
            font-weight: 700;
        }
        .content {
            margin-bottom: 30px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
        }
        .message {
            font-size: 15px;
            color: #555;
            margin-bottom: 20px;
            line-height: 1.8;
        }
        .service-info {
            background-color: #f8f9fa;
            border-left: 4px solid #00d4ff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .service-info strong {
            color: #00d4ff;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #888;
            font-size: 14px;
        }
        .signature {
            margin-top: 30px;
            font-style: italic;
            color: #666;
        }
        .signature-name {
            font-weight: 600;
            color: #1a1a1a;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Chad Guo</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                <p>尊敬的 ${name}，</p>
                <p>Dear ${name},</p>
            </div>
            
            <div class="message">
                <p>感谢您提交咨询申请。我已收到您的信息，并将尽快与您取得联系。</p>
                <p>Thank you for submitting your inquiry. I have received your information and will contact you as soon as possible.</p>
            </div>
            
            <div class="service-info">
                <p><strong>服务类型 / Service Type:</strong></p>
                <p>${serviceTypeText} / ${serviceTypeEn}</p>
            </div>
            
            <div class="message">
                <p>我通常会在 <strong>48 小时内</strong>亲自回复您的咨询。在此期间，如有任何紧急问题，请随时通过您提供的联系方式与我联系。</p>
                <p>I typically respond to inquiries within <strong>48 hours</strong>. If you have any urgent questions during this time, please feel free to contact me using the contact information you provided.</p>
            </div>
            
            <div class="message">
                <p>期待与您的深度合作。</p>
                <p>Looking forward to working with you.</p>
            </div>
        </div>
        
        <div class="footer">
            <div class="signature">
                <p class="signature-name">Chad Guo</p>
                <p>智启全球，境无止境。</p>
                <p>Empowering Global Ambition, Curating Extraordinary Life.</p>
                <p style="margin-top: 10px; font-size: 12px;">只为远见者服务。Exclusively for the Visionaries.</p>
            </div>
        </div>
    </div>
</body>
</html>
            `,
        });

        if (error) {
            console.error('Resend API error:', error);
            return new Response(
                JSON.stringify({ 
                    error: 'Failed to send email',
                    details: error.message 
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        console.log('Email sent successfully:', data);
        return new Response(
            JSON.stringify({ 
                success: true, 
                messageId: data?.id,
                message: 'Confirmation email sent successfully' 
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Error in send-confirmation-email:', error);
        return new Response(
            JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

