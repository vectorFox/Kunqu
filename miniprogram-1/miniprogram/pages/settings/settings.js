// pages/settings/settings.js
Page({
  data: {
    musicEnabled: true,
    textSpeed: 'medium', // slow, medium, fast
    language: 'zh', // zh, en
    autoPlay: false
  },

  onLoad: function (options) {
    this.loadSettings();
  },

  // 加载设置
  loadSettings: function () {
    try {
      const musicEnabled = wx.getStorageSync('musicEnabled');
      const textSpeed = wx.getStorageSync('textSpeed');
      const language = wx.getStorageSync('language');
      const autoPlay = wx.getStorageSync('autoPlay');

      this.setData({
        musicEnabled: musicEnabled !== '' ? musicEnabled : true,
        textSpeed: textSpeed || 'medium',
        language: language || 'zh',
        autoPlay: autoPlay !== '' ? autoPlay : false
      });
    } catch (err) {
      console.error('加载设置失败:', err);
    }
  },

  // 切换音乐
  toggleMusic: function () {
    const newValue = !this.data.musicEnabled;
    this.setData({
      musicEnabled: newValue
    });
    wx.setStorageSync('musicEnabled', newValue);
    
    wx.showToast({
      title: newValue ? '音乐已开启' : '音乐已关闭',
      icon: 'none',
      duration: 1500
    });
  },

  // 切换文本速度
  changeTextSpeed: function (e) {
    const speed = e.currentTarget.dataset.speed;
    this.setData({
      textSpeed: speed
    });
    wx.setStorageSync('textSpeed', speed);
    
    const speedText = {
      slow: '慢速',
      medium: '中速',
      fast: '快速'
    };
    
    wx.showToast({
      title: `文本速度：${speedText[speed]}`,
      icon: 'none',
      duration: 1500
    });
  },

  // 切换语言
  toggleLanguage: function () {
    const newLang = this.data.language === 'zh' ? 'en' : 'zh';
    this.setData({
      language: newLang
    });
    wx.setStorageSync('language', newLang);
    
    wx.showToast({
      title: newLang === 'zh' ? '已切换为中文' : 'Switched to English',
      icon: 'none',
      duration: 1500
    });
  },

  // 切换自动播放
  toggleAutoPlay: function () {
    const newValue = !this.data.autoPlay;
    this.setData({
      autoPlay: newValue
    });
    wx.setStorageSync('autoPlay', newValue);
    
    wx.showToast({
      title: newValue ? '自动播放已开启' : '自动播放已关闭',
      icon: 'none',
      duration: 1500
    });
  },

  // 清除数据
  clearData: function () {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有游戏数据吗？此操作不可恢复。',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync();
            wx.showToast({
              title: '数据已清除',
              icon: 'success'
            });
            
            // 重置设置
            this.setData({
              musicEnabled: true,
              textSpeed: 'medium',
              language: 'zh',
              autoPlay: false
            });
          } catch (err) {
            wx.showToast({
              title: '清除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 关于
  showAbout: function () {
    wx.showModal({
      title: '关于游园惊梦',
      content: '昆曲文化传承 · 学术展示项目\n\n通过互动游戏的形式，感受和理解昆曲的艺术魅力。\n\n版本：v1.0.0',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 返回
  goBack: function () {
    wx.navigateBack();
  }
});
