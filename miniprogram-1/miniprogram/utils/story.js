// 剧情脚本管理
const db = require('./db.js');
const storyDB = db.storyDB;

/**
 * 剧情状态机
 */
class StoryManager {
  constructor() {
    this.storyNodes = {}; // 缓存所有剧情节点
    this.currentNodeId = null;
    this.gameState = {
      understandingValue: 0, // 理解值
      favorValue: 0, // 好感值
      score: 0, // 积分
      unlockedChapters: ['chapter1'], // 已解锁章节
      unlockedEndings: [] // 已解锁结局
    };
  }

  // 初始化剧情数据（添加超时保护）
  async init() {
    try {
      // 设置超时保护，避免数据库查询阻塞
      const nodes = await Promise.race([
        storyDB.getAllNodes(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]).catch(() => {
        // 超时或失败时返回空数组
        return [];
      });

      if (nodes && nodes.length > 0) {
        nodes.forEach(node => {
          if (node && node.id) {
            this.storyNodes[node.id] = node;
          }
        });
      }
      
      // 如果没有数据，使用本地示例数据
      if (Object.keys(this.storyNodes).length === 0) {
        this.storyNodes = this.getDefaultStory();
      }
      
      // 确保设置初始节点
      if (!this.currentNodeId) {
        this.currentNodeId = 'start';
      }
      
      return true;
    } catch (err) {
      console.error('初始化剧情失败:', err);
      // 使用本地默认数据
      this.storyNodes = this.getDefaultStory();
      // 确保设置初始节点
      if (!this.currentNodeId) {
        this.currentNodeId = 'start';
      }
      return true;
    }
  }

  // 获取默认剧情数据（示例）
  getDefaultStory() {
    return {
      'start': {
        id: 'start',
        text: '你是一名初入昆山戏班的新学徒。今日，师父将你带到排练厅，厅内古木书案、灯光淡黄，窗外竹影婆娑。师父轻抚长须，温和地看着你说道："孩子，从今日起，你便是这戏班的一员了。昆曲之道，博大精深，你需用心体会。"',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '仔细观察排练厅的环境',
            next: 'observe',
            condition: null,
            effect: { understandingValue: 1 }
          },
          {
            text: '主动向师父请教昆曲的基本知识',
            next: 'ask_teacher',
            condition: null,
            effect: { understandingValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'observe': {
        id: 'observe',
        text: '你仔细环顾四周。排练厅虽不大，却处处透着雅致。你注意到厅内有一名青衣正在练习水袖，动作如行云流水，每一个转身都带着说不出的韵味。师父轻声说道："这是你的师姐金丽卿，她专攻旦角，已有十年功底。"',
        character: '师父',
        characterId: 'master_li',
        secondaryCharacter: '金丽卿',
        secondaryCharacterId: 'jin_liqing',
        options: [
          {
            text: '继续观察她的动作，学习她的技巧',
            next: 'watch_practice',
            condition: null,
            effect: { understandingValue: 2 }
          },
          {
            text: '主动上前询问她是否不适',
            next: 'ask_health',
            condition: null,
            effect: { favorValue: 2, understandingValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'watch_practice': {
        id: 'watch_practice',
        text: '你专注地观察着金丽卿的每一个动作。她的水袖如云似雾，在空中划出优美的弧线。她注意到你的目光，停下动作，对你微微一笑："师弟，看得很认真呢。水袖的要领在于"以意领气，以气领形"，你要用心感受。"',
        character: '金丽卿',
        characterId: 'jin_liqing',
        options: [
          {
            text: '虚心请教水袖的练习方法',
            next: 'learn_sleeve',
            condition: null,
            effect: { understandingValue: 2, favorValue: 1 }
          },
          {
            text: '感谢她的指导，继续观察',
            next: 'continue_observe',
            condition: null,
            effect: { understandingValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'ask_health': {
        id: 'ask_health',
        text: '你走上前去，关切地问道："师姐，我看你练习了很久，是否需要休息一下？"金丽卿停下动作，转过身来，眼中闪过一丝惊讶，随即露出温和的笑容："多谢师弟关心。练习昆曲确实需要专注，但也要注意劳逸结合。你初来乍到，有什么不懂的可以问我。"',
        character: '金丽卿',
        characterId: 'jin_liqing',
        secondaryCharacter: '师父',
        secondaryCharacterId: 'master_li',
        options: [
          {
            text: '询问关于旦角的表演技巧',
            next: 'learn_dan',
            condition: null,
            effect: { understandingValue: 2, favorValue: 2 }
          },
          {
            text: '询问她最喜欢的剧目',
            next: 'ask_favorite',
            condition: null,
            effect: { favorValue: 2 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'learn_sleeve': {
        id: 'learn_sleeve',
        text: '金丽卿耐心地为你讲解："水袖的练习，首先要从基础的"抖袖"开始。手臂要放松，手腕要灵活，让水袖随着你的动作自然展开。"她示范了几个动作，你认真地记下。',
        character: '金丽卿',
        characterId: 'jin_liqing',
        options: [
          {
            text: '继续学习',
            next: 'continue_learning',
            condition: null,
            effect: { understandingValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'continue_observe': {
        id: 'continue_observe',
        text: '你继续仔细观察，心中默默记下每一个动作的细节。师父在一旁看着，满意地点点头："很好，观察力是学习昆曲的第一步。"',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '继续学习',
            next: 'continue_learning',
            condition: null,
            effect: { understandingValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'learn_dan': {
        id: 'learn_dan',
        text: '金丽卿说："旦角是昆曲中非常重要的行当，主要扮演女性角色。旦角分为青衣、花旦、老旦等。青衣多扮演端庄稳重的女性，花旦则多扮演活泼可爱的少女。我专攻青衣，最擅长的就是《牡丹亭》中的杜丽娘。"她的眼中闪烁着对艺术的热爱。',
        character: '金丽卿',
        characterId: 'jin_liqing',
        options: [
          {
            text: '继续学习',
            next: 'continue_learning',
            condition: null,
            effect: { understandingValue: 2, favorValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'ask_favorite': {
        id: 'ask_favorite',
        text: '金丽卿眼中露出温柔的神色："我最喜欢的是《牡丹亭》。杜丽娘这个角色，既有少女的纯真，又有对爱情的执着。每次演到"游园惊梦"这一段，我都能感受到她内心的情感。"',
        character: '金丽卿',
        characterId: 'jin_liqing',
        options: [
          {
            text: '继续学习',
            next: 'continue_learning',
            condition: null,
            effect: { understandingValue: 1, favorValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'ask_teacher': {
        id: 'ask_teacher',
        text: '你恭敬地向师父行礼，问道："师父，弟子初来乍到，不知昆曲之道，当从何处学起？"师父微笑着看着你："昆曲之道，在于"水磨腔"的婉转、节奏的舒缓。你先要理解行当分类，才能深入其中。行当分为生、旦、净、末、丑五大类，每一类都有其独特的表演特色。"',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '询问行当分类的具体内容',
            next: 'quiz_hangdang',
            condition: null
          },
          {
            text: '询问水磨腔的特点和由来',
            next: 'quiz_shuimo',
            condition: null
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'quiz_hangdang': {
        id: 'quiz_hangdang',
        type: 'quiz',
        quizCategory: 'hangdang',
        text: '师父要考验你对昆曲行当的理解。',
        next: 'after_quiz_hangdang',
        background: 'rehearsal_hall'
      },
      'quiz_shuimo': {
        id: 'quiz_shuimo',
        type: 'quiz',
        quizCategory: 'shuimo',
        text: '师父要考验你对"水磨腔"的理解。',
        next: 'after_quiz_shuimo',
        background: 'rehearsal_hall'
      },
      'after_quiz_hangdang': {
        id: 'after_quiz_hangdang',
        text: '师父点点头："不错，你对行当已有初步了解。昆曲行当分为生、旦、净、末、丑五大类，每一类都有其独特的表演特色。生角多扮演男性角色，旦角多扮演女性角色，净角多扮演性格刚烈的角色，末角多扮演中老年男性，丑角则多扮演滑稽角色。"你认真地记下师父的话。',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '继续学习',
            next: 'continue_learning',
            condition: null,
            effect: {
              understandingValue: 1,
              score: 10
            }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'after_quiz_shuimo': {
        id: 'after_quiz_shuimo',
        text: '师父满意地说："水磨腔"是昆曲的核心特色，其特点是旋律婉转、节奏舒缓，如同水磨一般细腻。这种唱腔要求演员有深厚的功底，能够将情感融入每一个音符之中。"',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '继续学习',
            next: 'continue_learning',
            condition: null,
            effect: {
              understandingValue: 1,
              score: 10
            }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'continue_learning': {
        id: 'continue_learning',
        text: '随着学习的深入，你逐渐理解了昆曲的"人、情、境、艺"。师父说："真正的昆曲，在于情景交融，在于情感的表达。每一出戏，都是对人生、对情感的深刻诠释。"',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '体验《牡丹亭》片段',
            next: 'mudanting',
            condition: { understandingValue: 3 }
          },
          {
            text: '继续练习基本功',
            next: 'practice',
            condition: null
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'practice': {
        id: 'practice',
        text: '你在师父的指导下，开始练习基本功。虽然动作还不熟练，但你已经感受到了昆曲的魅力。师父鼓励道："勤能补拙，只要用心练习，终会有所成就。"',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '继续练习',
            next: 'practice_more',
            condition: null,
            effect: { understandingValue: 1 }
          },
          {
            text: '询问何时可以学戏',
            next: 'ask_when',
            condition: null
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'practice_more': {
        id: 'practice_more',
        text: '经过一段时间的练习，你的基本功有了明显的进步。师父和金丽卿都对你的努力表示赞赏。',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '准备体验《牡丹亭》',
            next: 'mudanting',
            condition: { understandingValue: 4 },
            effect: {
              understandingValue: 1,
              favorValue: 1
            }
          },
          {
            text: '继续学习',
            next: 'continue_learning',
            condition: null,
            effect: {
              understandingValue: 1,
              favorValue: 1
            }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'ask_when': {
        id: 'ask_when',
        text: '师父说："学戏需要循序渐进。先打好基础，再学唱腔，最后才能学戏。你现在已经掌握了基本要领，待理解值达到一定水平，就可以体验经典剧目了。"',
        character: '师父',
        characterId: 'master_li',
        options: [
          {
            text: '继续努力练习',
            next: 'practice_more',
            condition: null,
            effect: { understandingValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'peaceful'
      },
      'mudanting': {
        id: 'mudanting',
        text: '你来到《牡丹亭》的排练现场。金丽卿正在演绎杜丽娘"游园惊梦"的经典片段。她的表演如诗如画，每一个动作、每一句唱词都充满了情感。你仿佛看到了那个在花园中游玩的少女，看到了她对爱情的向往与执着。春梦无痕，情思暗生……',
        character: '金丽卿',
        characterId: 'jin_liqing',
        options: [
          {
            text: '沉浸其中，感受情感',
            next: 'ending_good',
            condition: { understandingValue: 5, favorValue: 3 },
            effect: { understandingValue: 2 }
          },
          {
            text: '观察技巧，学习表演',
            next: 'ending_technique',
            condition: null,
            effect: { understandingValue: 1 }
          }
        ],
        background: 'rehearsal_hall',
        music: 'dramatic'
      },
      'ending_good': {
        id: 'ending_good',
        text: '你深深理解了昆曲的"情"与"境"。在杜丽娘的情思中，你感受到了昆曲艺术的精髓。这是一条传承之路，你将继续前行。',
        character: '旁白',
        type: 'ending',
        endingName: '传承之路',
        options: [],
        background: 'stage',
        music: 'ending'
      },
      'ending_technique': {
        id: 'ending_technique',
        text: '你专注于技巧的学习，虽然掌握了表演的方法，但似乎还未完全理解昆曲的情感内核。也许，下一次会有更深的体悟。',
        character: '旁白',
        type: 'ending',
        endingName: '再遇牡丹亭',
        options: [],
        background: 'stage',
        music: 'ending'
      }
    };
  }

  // 获取当前节点
  getCurrentNode() {
    if (!this.currentNodeId) {
      this.currentNodeId = 'start';
    }
    return this.storyNodes[this.currentNodeId];
  }

  // 设置当前节点
  setCurrentNode(nodeId) {
    this.currentNodeId = nodeId;
  }

  // 检查条件是否满足
  checkCondition(condition) {
    if (!condition) return true;
    
    if (condition.understandingValue !== undefined) {
      return this.gameState.understandingValue >= condition.understandingValue;
    }
    if (condition.favorValue !== undefined) {
      return this.gameState.favorValue >= condition.favorValue;
    }
    if (condition.score !== undefined) {
      return this.gameState.score >= condition.score;
    }
    
    return true;
  }

  // 获取可用选项（过滤不满足条件的选项）
  getAvailableOptions(node) {
    if (!node || !node.options) return [];
    
    return node.options.filter(option => {
      return this.checkCondition(option.condition);
    });
  }

  // 选择选项
  selectOption(optionIndex) {
    const currentNode = this.getCurrentNode();
    if (!currentNode || !currentNode.options) return null;
    
    const availableOptions = this.getAvailableOptions(currentNode);
    const selectedOption = availableOptions[optionIndex];
    
    if (!selectedOption) return null;
    
    // 应用选项效果
    if (selectedOption.effect) {
      Object.keys(selectedOption.effect).forEach(key => {
        this.gameState[key] = (this.gameState[key] || 0) + selectedOption.effect[key];
      });
    }
    
    // 跳转到下一个节点
    if (selectedOption.next) {
      this.setCurrentNode(selectedOption.next);
      const nextNode = this.getCurrentNode();
      
      // 应用节点效果（如果节点本身有effect）
      if (nextNode && nextNode.effect) {
        Object.keys(nextNode.effect).forEach(key => {
          this.gameState[key] = (this.gameState[key] || 0) + nextNode.effect[key];
        });
      }
      
      return nextNode;
    }
    
    return null;
  }

  // 获取游戏状态
  getGameState() {
    return { ...this.gameState };
  }

  // 设置游戏状态（用于加载存档）
  setGameState(state) {
    this.gameState = { ...this.gameState, ...state };
  }

  // 保存进度
  async saveProgress(openid) {
    try {
      const db = require('./db.js');
      await db.userDB.updateProgress(openid, {
        currentChapter: this.gameState.unlockedChapters[this.gameState.unlockedChapters.length - 1],
        currentNode: this.currentNodeId,
        score: this.gameState.score,
        understandingValue: this.gameState.understandingValue,
        favorValue: this.gameState.favorValue
      });
    } catch (err) {
      console.error('保存进度失败:', err);
    }
  }

  // 加载进度
  async loadProgress(openid) {
    try {
      const db = require('./db.js');
      const user = await db.userDB.getUserInfo(openid);
      if (user) {
        this.currentNodeId = user.currentNode || 'start';
        this.setGameState({
          understandingValue: user.understandingValue || 0,
          favorValue: user.favorValue || 0,
          score: user.score || 0,
          unlockedChapters: user.unlockedChapters || ['chapter1']
        });
        return true;
      }
    } catch (err) {
      console.error('加载进度失败:', err);
    }
    return false;
  }
}

module.exports = {
  StoryManager
};

