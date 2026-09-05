// pages/quiz/quiz.js
const QuizManager = require('../../utils/quiz.js').QuizManager;

Page({
  data: {
    quiz: null,
    selectedIndex: -1,
    showResult: false,
    isCorrect: false,
    explanation: '',
    nextNode: null,
    returnTo: 'story'
  },

  quizManager: null,

  onLoad: function (options) {
    const category = options.category || 'general';
    this.nextNode = options.nextNode || null;
    this.returnTo = options.returnTo || 'story';
    
    this.initQuiz(category);
  },

  // 初始化问答
  async initQuiz(category) {
    wx.showLoading({
      title: '加载题目...',
      mask: true
    });

    try {
      this.quizManager = new QuizManager();
      const quiz = await this.quizManager.getQuiz(category);
      
      this.setData({
        quiz: quiz,
        selectedIndex: -1,
        showResult: false
      });
    } catch (err) {
      console.error('初始化问答失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 选择答案
  onSelectAnswer: function (e) {
    if (this.data.showResult) return;

    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index
    });

    // 检查答案
    const result = this.quizManager.checkAnswer(index);
    
    // 延迟显示结果
    setTimeout(() => {
      this.setData({
        showResult: true,
        isCorrect: result.isCorrect,
        explanation: result.explanation
      });

      // 答对奖励
      if (result.isCorrect) {
        // 可以在这里更新游戏状态
        this.updateGameScore(10);
      }
    }, 500);
  },

  // 更新游戏分数
  async updateGameScore(score) {
    try {
      // 这里可以调用云函数更新用户分数
      // 暂时只做本地处理
      console.log('获得分数:', score);
    } catch (err) {
      console.error('更新分数失败:', err);
    }
  },

  // 继续游戏
  onContinue: function () {
    if (this.returnTo === 'story' && this.nextNode) {
      // 返回剧情页面并跳转到下一个节点
      wx.navigateBack({
        success: () => {
          // 通过事件通知剧情页面跳转
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 1];
          if (prevPage && prevPage.route === 'pages/story/story') {
            prevPage.jumpToNode && prevPage.jumpToNode(this.nextNode);
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },

  // 重新答题（同一题目）
  onRetry: function () {
    this.setData({
      selectedIndex: -1,
      showResult: false
    });
  }
});

