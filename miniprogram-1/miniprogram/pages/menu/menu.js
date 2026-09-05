// pages/menu/menu.js
const db = require('../../utils/db.js');
const userDB = db.userDB;

Page({
  data: {
    hasProgress: false,
    userInfo: null,
    currentChapter: null
  },

  onLoad: function (options) {
    this.checkUserProgress();
  },

  onShow: function () {
    this.checkUserProgress();
  },

  // 检查用户进度
  async checkUserProgress() {
    try {
      // 检查userDB是否可用
      if (!userDB) {
        console.warn('userDB未初始化，跳过进度检查');
        return;
      }

      // 获取用户openid
      const loginRes = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: { type: 'getOpenId' }
      }).catch(() => {
        // 如果云函数不存在，使用本地模拟
        return { result: { openid: 'mock_openid_' + Date.now() } };
      });

      const openid = loginRes.result.openid || 'guest';
      const user = await userDB.getUserInfo(openid);

      if (user && user.currentNode && user.currentNode !== 'start') {
        this.setData({
          hasProgress: true,
          userInfo: user,
          currentChapter: user.currentChapter || '第一章'
        });
      }
    } catch (err) {
      console.error('检查进度失败:', err);
    }
  },

  // 开始游戏
  startGame: function () {
    wx.navigateTo({
      url: '/pages/story/story?mode=new'
    });
  },

  // 继续游戏
  continueGame: function () {
    wx.navigateTo({
      url: '/pages/story/story?mode=continue'
    });
  },

  // 学习档案
  goToArchive: function () {
    wx.navigateTo({
      url: '/pages/archive/archive'
    });
  },

  // 设置
  goToSettings: function () {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  }
});

