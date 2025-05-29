import { NextRequest, NextResponse } from 'next/server';

// 直接使用环境变量而不是配置文件
const API_CONFIG = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
};

export async function POST(request: NextRequest) {
  try {
    const { currentTask, timerDuration } = await request.json();

    // 验证输入
    if (!currentTask || typeof currentTask !== 'string') {
      console.error('API call missing required parameter: currentTask');
      return NextResponse.json(
        { error: 'Missing required parameter: currentTask' },
        { status: 400 }
      );
    }

    if (!timerDuration || typeof timerDuration !== 'number') {
      console.error('API call missing required parameter: timerDuration');
      return NextResponse.json(
        { error: 'Missing required parameter: timerDuration' },
        { status: 400 }
      );
    }

    // 检查API Key是否配置
    if (!API_CONFIG.OPENROUTER_API_KEY) {
      console.error('OpenRouter API Key not configured in environment variables');
      return NextResponse.json(
        { error: 'OpenRouter API Key not configured' },
        { status: 500 }
      );
    }

    // 添加时间戳和随机元素来确保每次生成不同的建议
    const timestamp = new Date().toISOString();
    const randomSeed = Math.floor(Math.random() * 1000);

    console.log(`Calling DeepSeek API to generate break suggestions, Task: ${currentTask}, Duration: ${Math.floor(timerDuration / 60)} minutes`);
    
    try {
      // 严格按照OpenRouter官方示例格式创建请求
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "FocusFlow Break Suggestions",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat-v3-0324",
          "messages": [
            {
              "role": "system",
              "content": "You are a break activity expert. Generate 3 concise, diverse 5-10 minute break activities. Describe the activity directly without special symbols like brackets. Don't explain reasons or benefits, just describe what to do. Use natural, concise language, avoid using numbers. Keep each suggestion under 25 words."
            },
            {
              "role": "user",
              "content": `I just finished working on ${currentTask} for ${Math.floor(timerDuration / 60)} minutes. Please recommend 3 concise 5-10 minute break activities. Describe what to do directly, no explanations, no special symbols like brackets. Random seed: ${randomSeed}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to get error details');
        console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('Invalid DeepSeek API response format:', JSON.stringify(data));
        throw new Error('Invalid API response format');
      }
      
      console.log("DeepSeek API response:", data.choices[0].message.content);
      
      // 使用更简单的分割逻辑，适应新的响应格式
      let suggestions = data.choices[0].message.content
        .split(/\n+|。|；|;|\.|!/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5 && s.length < 50) // 过滤掉太短或太长的建议
        .map((s: string) => {
          // 移除特殊符号和数字编号
          return s.replace(/^\d+[\.\s\-]+/, '')
                 .replace(/[\[\]「」()（）{}]/g, '')
                 .trim();
        });
      
      console.log("Parsed suggestions:", suggestions);

      // 确保必须有3个建议，不足的用多样化的默认建议补充
      const diverseDefaultSuggestions = [
        "Take a 5-minute walk outside for fresh air and light exercise",
        "Do simple neck and shoulder stretches to release tension",
        "Practice deep breathing exercises for 3 minutes",
        "Make a cup of tea and sip it mindfully",
        "Look out the window and find three things you haven't noticed before",
        "Do some light desk exercises or gentle yoga poses",
        "Listen to a favorite song and move to the rhythm",
        "Write down three things you're grateful for today",
        "Tidy up your workspace to create a cleaner environment",
        "Close your eyes and practice a brief meditation"
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
      
      console.log("Final suggestions returned:", suggestions);
      return NextResponse.json({ suggestions });
      
    } catch (apiError) {
      console.error("Error calling DeepSeek API:", apiError);
      throw apiError; // 向上抛出错误以便被外层catch捕获
    }

  } catch (error) {
    console.error("REST suggestions API error:", error);
    
    // 返回随机的多样化默认建议，已优化格式
    const diverseDefaultSuggestions = [
      "Take a 5-minute walk outside for fresh air and light exercise",
      "Do simple neck and shoulder stretches to release tension",
      "Practice deep breathing exercises for 3 minutes",
      "Make a cup of tea and sip it mindfully",
      "Look out the window and find three things you haven't noticed before",
      "Do some light desk exercises or gentle yoga poses",
      "Listen to a favorite song and move to the rhythm",
      "Write down three things you're grateful for today",
      "Tidy up your workspace to create a cleaner environment",
      "Close your eyes and practice a brief meditation"
    ];
    
    // 随机选择3个不同的建议
    const shuffledSuggestions = diverseDefaultSuggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    console.log("Using random default suggestions:", shuffledSuggestions);
    return NextResponse.json({ suggestions: shuffledSuggestions });
  }
} 