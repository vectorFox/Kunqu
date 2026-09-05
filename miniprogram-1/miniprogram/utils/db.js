// 数据库操作封装
let db = null;
try {
  db = wx.cloud.database();
} catch (err) {
  console.warn('云数据库未初始化，将使用模拟数据');
}

/**
 * 用户数据管理
 */
const userDB = {
  // 获取用户信息
  async getUserInfo(openid) {
    try {
      if (!db) return null;
      const res = await db.collection('users').where({
        _openid: openid
      }).get();
      
      if (res.data.length > 0) {
        return res.data[0];
      }
      return null;
    } catch (err) {
      console.error('获取用户信息失败:', err);
      return null;
    }
  },

  // 创建或更新用户信息
  async saveUserInfo(userData) {
    try {
      if (!db) return null;
      const user = await this.getUserInfo(userData._openid);
      
      if (user) {
        // 更新
        await db.collection('users').doc(user._id).update({
          data: {
            ...userData,
            updateTime: new Date()
          }
        });
        return user._id;
      } else {
        // 创建
        const res = await db.collection('users').add({
          data: {
            ...userData,
            createTime: new Date(),
            updateTime: new Date()
          }
        });
        return res._id;
      }
    } catch (err) {
      console.error('保存用户信息失败:', err);
      throw err;
    }
  },

  // 更新游戏进度
  async updateProgress(openid, progress) {
    try {
      const user = await this.getUserInfo(openid);
      if (user) {
        await db.collection('users').doc(user._id).update({
          data: {
            currentChapter: progress.currentChapter,
            currentNode: progress.currentNode,
            score: progress.score,
            understandingValue: progress.understandingValue || 0,
            favorValue: progress.favorValue || 0,
            updateTime: new Date()
          }
        });
      }
    } catch (err) {
      console.error('更新进度失败:', err);
      throw err;
    }
  }
};

/**
 * 题库管理
 */
const quizDB = {
  // 获取题目
  async getQuiz(id) {
    try {
      if (!db) return null;
      const res = await db.collection('quiz').doc(id).get();
      return res.data;
    } catch (err) {
      console.error('获取题目失败:', err);
      return null;
    }
  },

  // 根据分类获取题目
  async getQuizByCategory(category) {
    try {
      if (!db) return [];
      const res = await db.collection('quiz').where({
        category: category
      }).get();
      return res.data;
    } catch (err) {
      console.error('获取题目失败:', err);
      return [];
    }
  },

  // 随机获取题目（添加超时保护）
  async getRandomQuiz(category, count = 1) {
    try {
      if (!db) {
        // 如果没有数据库，返回默认题目
        const QuizManager = require('./quiz.js').QuizManager;
        const quizMgr = new QuizManager();
        const defaultQuiz = quizMgr.getDefaultQuiz(category);
        return defaultQuiz ? [defaultQuiz] : [];
      }
      
      // 设置超时保护
      const res = await Promise.race([
        db.collection('quiz').where({
          category: category
        }).get(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]).catch(() => {
        return { data: [] };
      });
      
      const questions = res.data || [];
      if (questions.length === 0) {
        // 如果没有题目，返回默认题目
        const QuizManager = require('./quiz.js').QuizManager;
        const quizMgr = new QuizManager();
        const defaultQuiz = quizMgr.getDefaultQuiz(category);
        return defaultQuiz ? [defaultQuiz] : [];
      }
      
      // 随机选择（限制数组大小，避免性能问题）
      const selected = [];
      const maxQuestions = Math.min(questions.length, 50); // 限制最多50题
      const shuffled = questions.slice(0, maxQuestions).sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        selected.push(shuffled[i]);
      }
      
      return selected;
    } catch (err) {
      console.error('获取随机题目失败:', err);
      // 返回默认题目
      const QuizManager = require('./quiz.js').QuizManager;
      const quizMgr = new QuizManager();
      const defaultQuiz = quizMgr.getDefaultQuiz(category);
      return defaultQuiz ? [defaultQuiz] : [];
    }
  }
};

/**
 * 剧情数据管理
 */
const storyDB = {
  // 获取剧情节点
  async getStoryNode(id) {
    try {
      if (!db) return null;
      const res = await db.collection('story').doc(id).get();
      return res.data;
    } catch (err) {
      console.error('获取剧情节点失败:', err);
      return null;
    }
  },

  // 获取所有剧情节点（用于初始化）
  async getAllNodes() {
    try {
      if (!db) return [];
      const res = await db.collection('story').get();
      return res.data;
    } catch (err) {
      console.error('获取剧情节点失败:', err);
      return [];
    }
  }
};

/**
 * 学习档案管理
 */
const archiveDB = {
  // 保存已识别角色
  async saveCharacter(openid, characterData) {
    try {
      if (!db) return null;
      const res = await db.collection('archives').add({
        data: {
          _openid: openid,
          type: 'character',
          ...characterData,
          createTime: new Date()
        }
      });
      return res._id;
    } catch (err) {
      console.error('保存角色失败:', err);
      throw err;
    }
  },

  // 获取用户学习档案
  async getUserArchive(openid) {
    try {
      if (!db) return [];
      const res = await db.collection('archives').where({
        _openid: openid
      }).orderBy('createTime', 'desc').get();
      return res.data;
    } catch (err) {
      console.error('获取学习档案失败:', err);
      return [];
    }
  }
};

module.exports = {
  userDB,
  quizDB,
  storyDB,
  archiveDB
};

