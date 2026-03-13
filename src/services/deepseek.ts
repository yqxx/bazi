const API_BASE = 'https://api.deepseek.com'

export interface BaziRequest {
  name?: string
  gender?: 'male' | 'female' | 'other'
  birthday: string // ISO 字符串，如 1995-08-12T14:30
  city?: string // 出生地（省市区拼接）
  topic?: string
  question?: string
}

export interface BaziResult {
  summary: string
  career?: string
  love?: string
  wealth?: string
  health?: string
  advice?: string
  rawText: string
}

function buildPrompt(payload: BaziRequest): string {
  const { name, gender, birthday, city, topic, question } = payload
  return `
你是一个专业的中国传统命理师，精通子平八字、十神、用神、大运流年等。
现在请你根据下面的信息，进行严谨的八字命盘分析，并用温柔、疗愈、积极的口吻输出结果。

- 姓名（可选）：${name || '未提供'}
- 性别（可选）：${gender || '未提供'}
- 公历出生时间（精确到时辰，24 小时制）：${birthday}
- 出生地（可选）：${city || '未提供'}
- 想聊聊的主题（可选）：${topic || '未提供'}
- 用户的具体困惑（可选）：${question || '未提供'}

要求：
1. 先简要说明命局整体格局与性格气质，用 2-3 段话。
2. 分为几个小节：事业与学业、感情与婚姻、财富与消费习惯、健康与身心状态、适合的发展方向与建议。
3. 每个小节用小标题 + 几条要点的形式呈现。
4. 尽量使用“你”“ta”这样的第二人称表达，语气温柔、有烟火气，但不要迷信恐吓。
5. 如果信息不全（例如没有时辰），请先礼貌地说明局限性，再尽量给出趋势性的判断。

请直接输出分析内容，无需再重复用户提供的信息。
  `.trim()
}

export async function analyzeBaziWithDeepSeek(payload: BaziRequest): Promise<BaziResult> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  console.log('apiKey',apiKey)
  if (!apiKey) {
    throw new Error('缺少 DeepSeek API Key，请在 .env 中配置 VITE_DEEPSEEK_API_KEY')
  }

  const prompt = buildPrompt(payload)

  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            '你是一位温柔且专业的传统命理师，擅长用浅显易懂又不吓人的方式讲解八字命理，重点给出安定人心的建议。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      top_p: 0.9,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`DeepSeek 请求失败：${res.status} ${text}`)
  }

  const data = await res.json()
  const content: string =
    data?.choices?.[0]?.message?.content ||
    '抱歉，暂时没有获取到有效的命理分析结果，请稍后再试。'

  return {
    summary: '基于你提供的出生信息，为你做了一份温柔的八字解读：',
    rawText: content,
  }
}

