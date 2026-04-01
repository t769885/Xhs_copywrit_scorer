// 笔记分析器 - 分析小红书笔记结构并生成优化建议

export interface AnalysisResult {
  score: number;
  scoreLabel: string;
  issues: Issue[];
  modifications: {
    beginning: Modification;
    middle: Modification;
    end: Modification;
  };
  titles: {
    hot: string[];
    painPoint: string[];
    curiosity: string[];
  };
  tags: string[];
  coverText: string;
}

export interface Issue {
  title: string;
  suggestion: string;
}

export interface Modification {
  original: string;
  optimized: string;
}

// 分析笔记结构
export function analyzeNote(content: string, topic?: string, audience?: string, product?: string): AnalysisResult {
  const trimmedContent = content.trim();
  const wordCount = trimmedContent.length;
  
  // 基础评分计算
  let score = 70;
  const issues: Issue[] = [];
  
  // 检测开头
  const firstSentence = trimmedContent.split(/[。！？.!?\n]/)[0] || '';
  const hasHook = checkHasHook(firstSentence);
  
  // 检测产品信息
  const hasProduct = product || checkHasProduct(trimmedContent);
  
  // 检测结尾
  const lastSentence = trimmedContent.split(/[。！？.!?\n]/).filter(s => s.trim()).pop() || '';
  const hasCTA = checkHasCTA(lastSentence);
  
  // 检测分段
  const paragraphs = trimmedContent.split('\n').filter(p => p.trim());
  const hasGoodStructure = paragraphs.length >= 3;
  
  // 检测表情符号
  const emojiCount = (trimmedContent.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  const hasEmojis = emojiCount >= 2;
  
  // 计算分数
  if (hasHook) score += 8;
  else issues.push({
    title: '开头缺乏吸引力',
    suggestion: '用具体场景或痛点开场，比如"姐妹们，我真的踩坑了..."'
  });
  
  if (hasProduct) score += 8;
  else issues.push({
    title: '产品/结论信息不够突出',
    suggestion: '在第二段明确提及产品名或核心结论'
  });
  
  if (hasCTA) score += 7;
  else issues.push({
    title: '结尾没有行动号召',
    suggestion: '添加互动问题或购买引导，如"你们有类似经历吗？"'
  });
  
  if (hasGoodStructure) score += 4;
  else score -= 3;
  
  if (hasEmojis) score += 3;
  
  // 字数调整
  if (wordCount < 150) {
    score -= 5;
    if (!issues.find(i => i.title.includes('开头'))) {
      issues.push({
        title: '内容篇幅偏短',
        suggestion: '建议扩展到150-300字，增加细节描述'
      });
    }
  } else if (wordCount > 500) {
    score -= 3;
    if (!issues.find(i => i.title.includes('结构'))) {
      issues.push({
        title: '内容篇幅偏长',
        suggestion: '小红书用户偏好精简内容，建议控制在300字以内'
      });
    }
  }
  
  // 确保分数在0-100之间
  score = Math.max(0, Math.min(100, score));
  
  // 评分标签
  let scoreLabel = '需要优化';
  if (score >= 80) scoreLabel = '优秀';
  else if (score >= 60) scoreLabel = '良好';
  
  // 如果问题不足3个，补充通用问题
  while (issues.length < 3) {
    if (!issues.find(i => i.title.includes('表情'))) {
      issues.push({
        title: '表情符号使用不足',
        suggestion: '适当添加2-3个相关emoji，提升视觉吸引力'
      });
    } else if (!issues.find(i => i.title.includes('分段'))) {
      issues.push({
        title: '段落结构可优化',
        suggestion: '每2-3句话换行，提升阅读体验'
      });
    } else {
      issues.push({
        title: '关键词布局可加强',
        suggestion: '在开头和结尾重复核心关键词，提升搜索排名'
      });
    }
  }
  
  // 限制为3个问题
  const topIssues = issues.slice(0, 3);
  
  // 生成修改建议
  const modifications = generateModifications(trimmedContent, topic, product);
  
  // 生成标题
  const titles = generateTitles(topic, product, audience);
  
  // 生成标签
  const tags = generateTags(topic, product);
  
  // 生成封面文案
  const coverText = generateCoverText(topic, product, audience);
  
  return {
    score,
    scoreLabel,
    issues: topIssues,
    modifications,
    titles,
    tags,
    coverText
  };
}

// 检查是否有吸引人的开头
function checkHasHook(sentence: string): boolean {
  const hookPatterns = [
    /姐妹/i, /家人们/i, /谁懂/i, /真的/i, /居然/i, /竟然/i,
    /踩坑/i, /避雷/i, /救命/i, /绝了/i, /天呐/i, /震惊/i,
    /没想到/i, /才发现/i, /必须/i, /一定要/i, /千万别/i,
    /[0-9]+/  // 包含数字
  ];
  return hookPatterns.some(pattern => pattern.test(sentence));
}

// 检查是否有产品信息
function checkHasProduct(content: string): boolean {
  const productPatterns = [
    /品牌/i, /产品/i, /商品/i, /东西/i, /这款/i, /这个/i,
    /用了/i, /买了/i, /入手/i, /推荐/i, /安利/i, /测评/i,
    /效果/i, /使用/i, /体验/i
  ];
  return productPatterns.some(pattern => pattern.test(content));
}

// 检查是否有行动号召
function checkHasCTA(sentence: string): boolean {
  const ctaPatterns = [
    /问/i, /评论/i, /留言/i, /私信/i, /戳/i, /点/i,
    /试试/i, /看看/i, /关注/i, /收藏/i, /点赞/i,
    /你们/i, /大家/i, /有人/i, /有没/i, /吗/i, /呢/i
  ];
  return ctaPatterns.some(pattern => pattern.test(sentence));
}

// 生成修改建议
function generateModifications(content: string, topic?: string, product?: string): AnalysisResult['modifications'] {
  const sentences = content.split(/[。！？.!?]/).filter(s => s.trim());
  const firstSentence = sentences[0] || '';
  const lastSentence = sentences[sentences.length - 1] || '';
  
  // 开头修改
  const beginning: Modification = {
    original: firstSentence || '（未检测到开头内容）',
    optimized: generateOptimizedBeginning(firstSentence, topic, product)
  };
  
  // 中段修改
  const middleIndex = Math.floor(sentences.length / 2);
  const middleSentence = sentences[middleIndex] || '';
  const middle: Modification = {
    original: middleSentence || '（未检测到中段内容）',
    optimized: generateOptimizedMiddle(middleSentence, product)
  };
  
  // 结尾修改
  const end: Modification = {
    original: lastSentence || '（未检测到结尾内容）',
    optimized: generateOptimizedEnd(lastSentence, topic)
  };
  
  return { beginning, middle, end };
}

function generateOptimizedBeginning(_original: string, topic?: string, product?: string): string {
  const hooks = [
    `姐妹们，关于${topic || '这个'}我必须说几句实话`,
    `刚${product ? '用完' + product : '经历完'}，我真的被惊艳到了`,
    `踩了无数次坑，终于找到${topic || '正确的方法'}`,
    `谁懂啊！${topic || '这个'}真的绝了`,
    `花了冤枉钱才明白，${topic || '这件事'}要这样做`
  ];
  return hooks[Math.floor(Math.random() * hooks.length)];
}

function generateOptimizedMiddle(_original: string, product?: string): string {
  if (product) {
    return `${product}的核心优势在于____，用了____天后明显感觉到____，特别是____这个功能，真的解决了我____的痛点`;
  }
  return `关键是掌握了____这个方法，具体步骤是：首先____，然后____，最后____。整个过程只需要____分钟，效果却超出预期`;
}

function generateOptimizedEnd(_original: string, topic?: string): string {
  const ctas = [
    `你们${topic ? '对' + topic : ''}有什么疑问吗？评论区见`,
    `觉得有用的话记得收藏，免得找不到了`,
    `有类似经历的姐妹评论区聊聊，我们一起交流`,
    `想要了解更多细节，可以私信我哦`,
    `你们还想看什么内容？评论区告诉我`
  ];
  return ctas[Math.floor(Math.random() * ctas.length)];
}

// 生成标题
function generateTitles(topic?: string, product?: string, audience?: string): AnalysisResult['titles'] {
  const t = topic || '';
  const p = product || '';
  const a = audience || '新手';
  
  const hot = [
    `${a}必看！${t}保姆级教程`,
    `${p || t}真实测评，不吹不黑`,
    `踩坑10次总结出的${t}经验`,
    `${a}也能学会的${t}方法`
  ];
  
  const painPoint = [
    `${t}总是做不好？原因在这里`,
    `为什么你的${t}没效果？`,
    `${a}最容易犯的${t}错误`,
    `${p || ''}买错了真的很亏`
  ];
  
  const curiosity = [
    `关于${t}，没人告诉你的真相`,
    `${t}的正确打开方式`,
    `原来${t}可以这么简单`,
    `${a}不知道的超实用技巧`
  ];
  
  return { hot, painPoint, curiosity };
}

// 生成标签
function generateTags(topic?: string, product?: string): string[] {
  const baseTags = ['小红书运营', '笔记优化', '内容创作', '爆款标题', '新手博主', '涨粉技巧', '文案写作'];
  
  const specificTags: string[] = [];
  if (topic) {
    specificTags.push(topic);
    specificTags.push(`${topic}教程`);
  }
  if (product) {
    specificTags.push(product);
    specificTags.push('好物推荐');
    specificTags.push('产品测评');
  }
  
  return [...specificTags, ...baseTags].slice(0, 10);
}

// 生成封面文案
function generateCoverText(topic?: string, product?: string, audience?: string): string {
  const templates = [
    `${audience || '新手'}必看！${topic || product || '这个'}方法太绝了`,
    `踩坑10次才总结出的${topic || '经验'}`,
    `${product || topic || '这个'}真的好用，亲测有效`,
    `关于${topic || '这件事'}，没人告诉你的真相`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// 检查是否需要补充信息
export function needsMoreInfo(content: string): boolean {
  return content.trim().length < 80;
}
