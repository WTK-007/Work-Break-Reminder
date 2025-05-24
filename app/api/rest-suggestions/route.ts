import { NextRequest, NextResponse } from 'next/server';

// 在开发环境中尝试读取本地配置
let API_CONFIG: any = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
};

// 如果是开发环境且没有环境变量，尝试使用本地配置
if (process.env.NODE_ENV === 'development' && !process.env.OPENROUTER_API_KEY) {
  try {
    // 尝试使用已知的本地配置
    API_CONFIG = {
      OPENROUTER_API_KEY: "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",
      OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1"
    };
    console.log('使用本地开发配置');
  } catch (e) {
    console.log('无法读取本地配置，使用环境变量');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { currentTask, timerDuration } = await request.json();

    // 检查API Key是否配置
    if (!API_CONFIG.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API Key not configured' },
        { status: 500 }
      );
    }

    // 添加时间戳和随机元素来确保每次生成不同的建议
    const timestamp = new Date().toISOString();
    const randomSeed = Math.floor(Math.random() * 1000);

    console.log(`正在调用DeepSeek API生成休息建议，任务: ${currentTask}, 时长: ${Math.floor(timerDuration / 60)}分钟`);

    const response = await fetch(API_CONFIG.OPENROUTER_BASE_URL + "/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
        "X-Title": "Work Rest Reminder",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat-v3-0324",
        "messages": [
          {
            "role": "system",
            "content": "你是一个创意的休息活动建议专家。每次请生成完全不同的、创新的5-10分钟休息活动建议。要考虑多样性：身体活动、心理放松、眼部休息、社交互动、创意活动等不同类型。请用中文回答，格式：\n1. [建议]\n2. [建议]\n3. [建议]\n\n重要：每次都要提供完全不同的活动，避免重复常见建议。"
          },
          {
            "role": "user",
            "content": `现在是${timestamp}，我刚刚完成了"${currentTask}"的工作，专注了${Math.floor(timerDuration / 60)}分钟。请为我推荐3个创新的、与众不同的5-10分钟休息活动。请确保建议具有创意和多样性，不要总是推荐相同的活动类型。随机种子：${randomSeed}`
          }
        ],
        "temperature": 0.9, // 增加创造性
        "max_tokens": 200
      })
    });

    if (!response.ok) {
      console.error(`OpenRouter API错误: ${response.status}`);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("DeepSeek API响应:", data.choices[0].message.content);
    
    let suggestions = data.choices[0].message.content
      .split(/\d+\.\s*/)
      .filter(Boolean)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);
    
    console.log("解析后的建议:", suggestions);

    // 确保必须有3个建议，不足的用多样化的默认建议补充
    const diverseDefaultSuggestions = [
      "尝试5分钟的深呼吸冥想，专注于呼吸节奏。",
      "播放一首喜欢的音乐，随着节拍轻松摆动身体。",
      "给朋友或家人发一条关心的消息。",
      "观察窗外的景色，寻找三个之前没注意到的细节。",
      "做一些简单的颈部和肩膀拉伸运动。",
      "喝一杯温水，慢慢品味每一口。",
      "整理一下工作桌面，让环境更整洁。",
      "练习几分钟正念，专注当下的感受。",
      "阅读几页轻松的文章或小故事。",
      "做几个简单的眼球运动练习。"
    ];
    
    // 随机选择不同的默认建议
    const shuffledDefaults = diverseDefaultSuggestions.sort(() => Math.random() - 0.5);
    
    // 如果生成的建议不足3个，用随机的默认建议补充
    while (suggestions.length < 3) {
      const missingIndex = suggestions.length;
      suggestions.push(shuffledDefaults[missingIndex % shuffledDefaults.length]);
    }
    
    // 确保只有3个建议
    suggestions = suggestions.slice(0, 3);
    
    console.log("最终返回的建议:", suggestions);
    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error("调用DeepSeek API时出错:", error);
    
    // 返回随机的多样化默认建议
    const diverseDefaultSuggestions = [
      "尝试5分钟的深呼吸冥想，专注于呼吸节奏。",
      "播放一首喜欢的音乐，随着节拍轻松摆动身体。",
      "给朋友或家人发一条关心的消息。",
      "观察窗外的景色，寻找三个之前没注意到的细节。",
      "做一些简单的颈部和肩膀拉伸运动。",
      "喝一杯温水，慢慢品味每一口。",
      "整理一下工作桌面，让环境更整洁。",
      "练习几分钟正念，专注当下的感受。",
      "阅读几页轻松的文章或小故事。",
      "做几个简单的眼球运动练习。"
    ];
    
    // 随机选择3个不同的建议
    const shuffledSuggestions = diverseDefaultSuggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    console.log("使用随机默认建议:", shuffledSuggestions);
    return NextResponse.json({ suggestions: shuffledSuggestions });
  }
} 