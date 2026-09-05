// 问答模块管理
const db = require('./db.js');
const quizDB = db.quizDB;

/**
 * 问答管理器
 */
class QuizManager {
  constructor() {
    this.currentQuiz = null;
    this.quizHistory = [];
  }

  // 获取题目
  async getQuiz(category, count = 1) {
    try {
      const quizzes = await quizDB.getRandomQuiz(category, count);
      if (quizzes.length > 0) {
        this.currentQuiz = quizzes[0];
        return this.currentQuiz;
      }
      
      // 如果没有数据库数据，使用默认题目
      return this.getDefaultQuiz(category);
    } catch (err) {
      console.error('获取题目失败:', err);
      return this.getDefaultQuiz(category);
    }
  }

  // 获取默认题目（示例）
  getDefaultQuiz(category) {
    const defaultQuizzes = {
      'hangdang': {
        id: 'quiz_hangdang_1',
        question: '昆曲的行当分为哪五大类？',
        type: 'single',
        options: [
          'A. 生、旦、净、末、丑',
          'B. 生、旦、净、末、小',
          'C. 生、旦、净、末、武',
          'D. 生、旦、净、末、老'
        ],
        answer: 0,
        explanation: '昆曲行当分为生、旦、净、末、丑五大类，每一类都有其独特的表演特色和角色定位。',
        category: 'hangdang'
      },
      'shuimo': {
        id: 'quiz_shuimo_1',
        question: '"水磨腔"的特点是什么？',
        type: 'single',
        options: [
          'A. 旋律婉转、节奏舒缓',
          'B. 节奏急促、音调高昂',
          'C. 音调低沉、节奏单一',
          'D. 旋律简单、节奏明快'
        ],
        answer: 0,
        explanation: '"水磨腔"的特点是旋律婉转、节奏舒缓，体现昆曲柔美的审美精神，如同水磨一般细腻。',
        category: 'shuimo'
      },
      'character': {
        id: 'quiz_character_1',
        question: '杜丽娘是哪个剧目的主要角色？',
        type: 'single',
        options: [
          'A. 《牡丹亭》',
          'B. 《西厢记》',
          'C. 《桃花扇》',
          'D. 《长生殿》'
        ],
        answer: 0,
        explanation: '杜丽娘是明代剧作家汤显祖《牡丹亭》中的主要角色，是昆曲旦角的经典形象。',
        category: 'character'
      },
      'general': {
        id: 'quiz_general_1',
        question: '昆曲起源于哪个朝代？',
        type: 'single',
        options: [
          'A. 唐代',
          'B. 宋代',
          'C. 元代',
          'D. 明代'
        ],
        answer: 2,
        explanation: '昆曲起源于元末明初的昆山地区，经过数百年的发展，形成了独特的艺术风格。',
        category: 'general'
      }
    };

    return defaultQuizzes[category] || defaultQuizzes['general'];
  }

  // 检查答案
  checkAnswer(selectedIndex) {
    if (!this.currentQuiz) return false;
    
    const isCorrect = selectedIndex === this.currentQuiz.answer;
    
    // 记录答题历史
    this.quizHistory.push({
      quiz: this.currentQuiz,
      selectedIndex: selectedIndex,
      isCorrect: isCorrect,
      time: new Date()
    });
    
    return {
      isCorrect: isCorrect,
      correctAnswer: this.currentQuiz.answer,
      explanation: this.currentQuiz.explanation,
      quiz: this.currentQuiz
    };
  }

  // 获取答题历史
  getHistory() {
    return this.quizHistory;
  }

  // 获取正确率
  getAccuracy() {
    if (this.quizHistory.length === 0) return 0;
    const correct = this.quizHistory.filter(item => item.isCorrect).length;
    return Math.round((correct / this.quizHistory.length) * 100);
  }
}

module.exports = {
  QuizManager
};

