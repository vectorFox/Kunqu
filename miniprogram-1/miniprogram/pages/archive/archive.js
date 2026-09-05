// pages/archive/archive.js
const db = require('../../utils/db.js');
const archiveDB = db.archiveDB;
const userDB = db.userDB;

Page({
  data: {
    archiveList: [],
    userInfo: null,
    stats: {
      totalCharacters: 0,
      totalQuiz: 0,
      accuracy: 0
    }
  },

  onLoad: function (options) {
    this.loadArchive();
  },

  onShow: function () {
    this.loadArchive();
  },

  // 加载学习档案
  async loadArchive() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    try {
      // 获取用户openid
      const loginRes = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: { type: 'getOpenId' }
      }).catch(() => {
        return { result: { openid: 'guest' } };
      });

      const openid = loginRes.result.openid || 'guest';

      // 获取用户信息
      const user = await userDB.getUserInfo(openid);
      
      // 获取学习档案
      const archiveList = await archiveDB.getUserArchive(openid);

      // 计算统计数据
      const characters = archiveList.filter(item => item.type === 'character');
      const quizzes = archiveList.filter(item => item.type === 'quiz');

      this.setData({
        archiveList: archiveList,
        userInfo: user,
        stats: {
          totalCharacters: characters.length,
          totalQuiz: quizzes.length,
          accuracy: user && user.quizAccuracy ? user.quizAccuracy : 0
        }
      });
    } catch (err) {
      console.error('加载档案失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });

      // 使用示例数据
      this.setData({
        archiveList: this.getDefaultArchive(),
        stats: {
          totalCharacters: 3,
          totalQuiz: 5,
          accuracy: 80
        }
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 获取默认档案（示例）
  getDefaultArchive() {
    return [
      {
        id: 'char_1',
        type: 'character',
        name: '杜丽娘',
        role: '旦角',
        play: '《牡丹亭》',
        description: '明代剧作家汤显祖《牡丹亭》中的主要角色，是昆曲旦角的经典形象。',
        createTime: new Date()
      },
      {
        id: 'char_2',
        type: 'character',
        name: '柳梦梅',
        role: '生角',
        play: '《牡丹亭》',
        description: '《牡丹亭》中的男主角，是昆曲生角的代表形象。',
        createTime: new Date()
      }
    ];
  },

  // 查看详情
  viewDetail: function (e) {
    const item = e.currentTarget.dataset.item;
    
    wx.showModal({
      title: item.name || '详情',
      content: item.description || item.explanation || '暂无详细信息',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 返回
  goBack: function () {
    wx.navigateBack();
  }
});

