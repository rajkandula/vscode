export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  role: 'assistant';
  content: string;
}

export class OpenAIError extends Error {
  status?: number;
  data?: any;
  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'OpenAIError';
    this.status = status;
    this.data = data;
  }
}

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.VITE_OPENAI_API_KEY;

export async function sendChat(
  messages: ChatMessage[],
  onToken?: (token: string) => void
): Promise<ChatResponse> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY ?? ''}`,
      },
      body: JSON.stringify({ model: 'gpt-3.5-turbo', stream: true, messages }),
    });

    if (!res.ok) {
      let errData: any;
      try {
        errData = await res.json();
      } catch {
        errData = await res.text();
      }
      const msg = errData?.error?.message || res.statusText;
      throw new OpenAIError(msg, res.status, errData);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('stream')) {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let message = '';
      let buffer = '';
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.replace(/^data:\s*/, '');
            if (data === '[DONE]') {
              reader.cancel();
              return { role: 'assistant', content: message };
            }
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                message += delta;
                onToken?.(delta);
              }
            } catch {
              // ignore parse errors
            }
          }
        }
        if (buffer.length) {
          const trimmed = buffer.trim();
          if (trimmed.startsWith('data:')) {
            const data = trimmed.replace(/^data:\s*/, '');
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                message += delta;
                onToken?.(delta);
              }
            } catch {
              // ignore
            }
          }
        }
      }
      return { role: 'assistant', content: message };
    } else {
      const data = await res.json();
      const message = data.choices?.[0]?.message ?? { role: 'assistant', content: '' };
      return message;
    }
  } catch (err: any) {
    if (err instanceof OpenAIError) {
      throw err;
    }
    throw new OpenAIError(err?.message || 'OpenAI request failed');
  }
}

