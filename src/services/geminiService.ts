import type { WordPairData } from '../types';

const WORD_PAIRS = [
  { civilian: '可乐', undercover: '雪碧' },
  { civilian: '口香糖', undercover: '泡泡糖' },
  { civilian: '辣椒', undercover: '芥末' },
  { civilian: '结婚', undercover: '订婚' },
  { civilian: '小笼包', undercover: '灌汤包' },
  { civilian: '端午节', undercover: '中秋节' },
  { civilian: '幼儿园', undercover: '托儿所' },
  { civilian: '海豚', undercover: '海狮' },
  { civilian: '蜘蛛侠', undercover: '蝙蝠侠' },
  { civilian: '孟姜女', undercover: '潘金莲' },
  { civilian: '裸奔', undercover: '裸泳' },
  { civilian: '成吉思汗', undercover: '努尔哈赤' },
  { civilian: '眉毛', undercover: '睫毛' },
  { civilian: '蝴蝶', undercover: '蜜蜂' },
  { civilian: '天天向上', undercover: '快乐大本营' },
  { civilian: '麻辣烫', undercover: '啵啵鸡' },
  { civilian: '漫威', undercover: 'DC' },
  { civilian: '伴娘', undercover: '丫鬟' },
  { civilian: '小红书', undercover: '朋友圈' },
  { civilian: '广场舞', undercover: '迪斯科' },
  { civilian: '拼多多', undercover: '闲鱼' },
  { civilian: '拔草', undercover: '排雷' },
  { civilian: '苹果', undercover: '华为' },
  { civilian: '种草', undercover: '安利' },
  { civilian: '海王', undercover: '渣男' },
  { civilian: '抖音', undercover: '快手' },
  { civilian: '喜茶', undercover: '奈雪' },
  { civilian: '脱口秀', undercover: '相声' },
  { civilian: '杠精', undercover: '键盘侠' },
  { civilian: '哈利波特', undercover: '指环王' },
  { civilian: '显眼包', undercover: '出头鸟' },
  { civilian: 'ChatGPT', undercover: 'Siri' },
  { civilian: '螺蛳粉', undercover: '臭豆腐' },
  { civilian: '淘宝', undercover: '京东' },
  { civilian: '画大饼', undercover: '吹牛皮' },
  { civilian: '普信男', undercover: '妈宝男' },
  { civilian: '电子榨菜', undercover: '下饭神剧' },
  { civilian: '围炉煮茶', undercover: '露营咖啡' },
  { civilian: '山姆', undercover: '开市客' },
  { civilian: '打工人', undercover: '乙方' },
  { civilian: '考研', undercover: '考公' },
  { civilian: '摸鱼', undercover: '躺平' },
  { civilian: '霸总', undercover: '爹味' },
  { civilian: '黑粉', undercover: '水军' },
  { civilian: '翻车', undercover: '塌房' },
  { civilian: '琵琶', undercover: '古筝' },
  { civilian: '哪吒', undercover: '红孩儿' },
  { civilian: '守株待兔', undercover: '刻舟求剑' },
  { civilian: '唐僧', undercover: '法海' },
  { civilian: '盘丝洞', undercover: '女儿国' },
  { civilian: '草船借箭', undercover: '空城计' },
  { civilian: '圣旨', undercover: '奏折' },
  { civilian: '丝绸之路', undercover: '茶马古道' },
  { civilian: '腾云驾雾', undercover: '呼风唤雨' }
];

export const generateWordPair = async (difficulty: 'easy' | 'hard' = 'easy'): Promise<WordPairData> => {
  // 模拟异步操作，保持接口兼容
  return new Promise((resolve) => {
    const randomIndex = Math.floor(Math.random() * WORD_PAIRS.length);
    const pair = WORD_PAIRS[randomIndex];
    
    resolve({
      topic: '综合', // 通用主题
      words: {
        civilian: pair.civilian,
        undercover: pair.undercover
      }
    });
  });
};
