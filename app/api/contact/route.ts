import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message, token } = body;

        if (!token || !message || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!process.env.TURNSTILE_SECRET_KEY) {
            return NextResponse.json({ error: 'Captcha is not configured' }, { status: 503 });
        }

        // 1. Verify Turnstile Token — secret stays on the server so bots cannot skip the widget
        const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: token,
            }),
        });

        const turnstileOutcome = await turnstileResult.json();

        if (!turnstileOutcome.success) {
            return NextResponse.json({ error: 'Invalid captcha' }, { status: 400 });
        }

        // 2. Send Telegram Message
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            const text = `📩 *New Message from Bardlabs*\n\n👤 *Name:* ${name || 'Anonymous'}\n📧 *Email:* ${email}\n\n📝 *Message:*\n${message}`;

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'Markdown',
                }),
            });
        } else {
            console.warn('Telegram credentials missing, skipping notification.');
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
