export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/**
 * Send chat messages to OpenAI's Chat Completions API using the
 * environment variable `OPENAI_API_KEY` for authentication. The
 * response is streamed and yielded chunk by chunk.
 */
export async function* sendChat(messages: ChatMessage[]): AsyncGenerator<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not set');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages
        })
    });

    if (!response.ok || !response.body) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) {
                continue;
            }
            const data = trimmed.replace(/^data:\s*/, '');
            if (data === '[DONE]') {
                return;
            }
            try {
                const json = JSON.parse(data);
                const text = json.choices?.[0]?.delta?.content;
                if (text) {
                    yield text;
                }
            } catch {
                // ignore malformed JSON chunks
            }
        }
    }
}
