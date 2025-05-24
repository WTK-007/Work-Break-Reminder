import { NextRequest, NextResponse } from 'next/server';

// 使用环境变量配置
const API_CONFIG = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
};

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
            "content": "你是一个有用的助手，专门建议5-10分钟的短暂休息活动。请保持建议简洁、实用且能让人感到放松。请用中文回答。请按照以下格式提供3个建议：\n1. [第一个建议]\n2. [第二个建议]\n3. [第三个建议]"
          },
          {
            "role": "user",
            "content": `我刚刚完成了"${currentTask}"的工作，专注了${Math.floor(timerDuration / 60)}分钟。请为我推荐3个可以在5-10分钟内完成的快速休息活动，帮助我放松和恢复精力。每个建议控制在1-2句话以内。`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    let suggestions = data.choices[0].message.content
      .split(/\d+\.\s*/)
      .filter(Boolean)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);
    
    // 确保必须有3个建议，不足的用默认建议补充
    const defaultSuggestions = [
      "起身在房间或办公室里简单走动一下，活动活动身体。",
      "做一些简单的伸展运动，放松颈部、肩膀和背部肌肉。",
      "让眼睛休息一下，看向20英尺外的地方20秒钟，缓解眼部疲劳。"
    ];
    
    // 如果生成的建议不足3个，用默认建议补充
    while (suggestions.length < 3) {
      const missingIndex = suggestions.length;
      if (missingIndex < defaultSuggestions.length) {
        suggestions.push(defaultSuggestions[missingIndex]);
      } else {
        suggestions.push(`额外的休息建议 ${missingIndex + 1}`);
      }
    }
    
    // 确保只有3个建议
    suggestions = suggestions.slice(0, 3);
    
    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error("Error fetching rest suggestions:", error);
    
    // 返回默认建议
    const defaultSuggestions = [
      "起身在房间或办公室里简单走动一下，活动活动身体。",
      "做一些简单的伸展运动，放松颈部、肩膀和背部肌肉。",
      "让眼睛休息一下，看向20英尺外的地方20秒钟，缓解眼部疲劳。"
    ];
    
    return NextResponse.json({ suggestions: defaultSuggestions });
  }
} 