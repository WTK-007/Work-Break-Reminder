// 环境变量配置
// 此文件从环境变量中读取配置，适用于本地开发和生产环境

const ENV_CONFIG = {
  // OpenRouter API配置
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
};

module.exports = ENV_CONFIG; 