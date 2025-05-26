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
      console.error('API调用缺少必要参数: currentTask');
      return NextResponse.json(
        { error: '缺少必要参数: currentTask' },
        { status: 400 }
      );
    }

    if (!timerDuration || typeof timerDuration !== 'number') {
      console.error('API调用缺少必要参数: timerDuration');
      return NextResponse.json(
        { error: '缺少必要参数: timerDuration' },
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

    console.log(`正在调用DeepSeek API生成休息建议，任务: ${currentTask}, 时长: ${Math.floor(timerDuration / 60)}分钟`);
    
    try {
      // 严格按照OpenRouter官方示例格式创建请求
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Work Rest Reminder",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat-v3-0324",
          "messages": [
            {
              "role": "system",
              "content": "你是休息活动建议专家。每次生成3个简洁、多样化的5-10分钟休息活动建议。直接描述活动内容，不要使用特殊符号如方括号。不要解释原因或好处，只描述具体做法。用自然、简洁的语言，避免使用数字编号。每个建议控制在25字以内。"
            },
            {
              "role": "user",
              "content": `我刚刚完成了${currentTask}工作，专注了${Math.floor(timerDuration / 60)}分钟。请推荐3个简洁的5-10分钟休息活动，要直接描述做法，不要解释，不要使用括号等特殊符号。随机种子：${randomSeed}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '无法获取错误详情');
        console.error(`OpenRouter API错误: ${response.status} - ${errorText}`);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('DeepSeek API响应格式无效:', JSON.stringify(data));
        throw new Error('API响应格式无效');
      }
      
      console.log("DeepSeek API响应:", data.choices[0].message.content);
      
      // 使用更简单的分割逻辑，适应新的响应格式
      let suggestions = data.choices[0].message.content
        .split(/\n+|。|；|;/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5 && s.length < 30) // 过滤掉太短或太长的建议
        .map((s: string) => {
          // 移除特殊符号和数字编号
          return s.replace(/^\d+[\.\s、]+/, '')
                 .replace(/[\[\]「」()（）{}]/g, '')
                 .trim();
        });
      
      console.log("解析后的建议:", suggestions);

      // 确保必须有3个建议，不足的用多样化的默认建议补充
      const diverseDefaultSuggestions = [
        "播放轻快音乐随着节奏自由摆动身体约3分钟",
        "把纸张旋转180度用非惯用手写字或画简单图案",
        "闭上眼睛专注聆听环境中的5种不同声音",
        "站起来做几个简单的颈部和肩膀拉伸动作",
        "冲泡一杯花茶慢慢品味每一口的味道",
        "整理工作桌面让环境更整洁有序",
        "闭眼深呼吸专注于呼吸的节奏",
        "看向窗外寻找三个以前没注意的细节",
        "给朋友或家人发一条关心的消息",
        "练习眼球运动来缓解眼睛疲劳"
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
      
    } catch (apiError) {
      console.error("调用DeepSeek API时出错:", apiError);
      throw apiError; // 向上抛出错误以便被外层catch捕获
    }

  } catch (error) {
    console.error("REST建议API错误:", error);
    
    // 返回随机的多样化默认建议，已优化格式
    const diverseDefaultSuggestions = [
      "播放轻快音乐随着节奏自由摆动身体约3分钟",
      "把纸张旋转180度用非惯用手写字或画简单图案",
      "闭上眼睛专注聆听环境中的5种不同声音",
      "站起来做几个简单的颈部和肩膀拉伸动作",
      "冲泡一杯花茶慢慢品味每一口的味道",
      "整理工作桌面让环境更整洁有序",
      "闭眼深呼吸专注于呼吸的节奏",
      "看向窗外寻找三个以前没注意的细节",
      "给朋友或家人发一条关心的消息",
      "练习眼球运动来缓解眼睛疲劳"
    ];
    
    // 随机选择3个不同的建议
    const shuffledSuggestions = diverseDefaultSuggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    console.log("使用随机默认建议:", shuffledSuggestions);
    return NextResponse.json({ suggestions: shuffledSuggestions });
  }
} 