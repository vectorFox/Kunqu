// pages/admin/admin.js
Page({
  data: {
    isAdmin: false,
    adminPassword: 'kunqu2024', // 实际应用中应从服务器获取
    stats: {
      totalUsers: 0,
      totalQuiz: 0,
      totalStory: 0
    }
  },

  onLoad: function (options) {
    this.checkAdmin();
  },

  // 检查管理员权限
  checkAdmin: function () {
    const isAdmin = wx.getStorageSync('isAdmin') || false;
    this.setData({
      isAdmin: isAdmin
    });

    if (!isAdmin) {
      this.showLogin();
    } else {
      this.loadStats();
    }
  },

  // 显示登录界面
  showLogin: function () {
    wx.showModal({
      title: '管理员登录',
      editable: true,
      placeholderText: '请输入管理员密码',
      success: (res) => {
        if (res.confirm && res.content === this.data.adminPassword) {
          wx.setStorageSync('isAdmin', true);
          this.setData({
            isAdmin: true
          });
          this.loadStats();
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        } else if (res.confirm) {
          wx.showToast({
            title: '密码错误',
            icon: 'none'
          });
          this.showLogin();
        } else {
          wx.navigateBack();
        }
      }
    });
  },

  // 加载统计数据
  async loadStats() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    try {
      // 这里可以调用云函数获取统计数据
      // 暂时使用模拟数据
      this.setData({
        stats: {
          totalUsers: 0,
          totalQuiz: 0,
          totalStory: 0
        }
      });
    } catch (err) {
      console.error('加载统计失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 管理题库
  manageQuiz: function () {
    wx.showToast({
      title: '题库管理功能开发中',
      icon: 'none'
    });
  },

  // 管理剧情
  manageStory: function () {
    wx.showToast({
      title: '剧情管理功能开发中',
      icon: 'none'
    });
  },

  // 查看用户数据
  viewUsers: function () {
    wx.showToast({
      title: '用户数据查看功能开发中',
      icon: 'none'
    });
  },

  // 退出登录
  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出管理员模式吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('isAdmin');
          this.setData({
            isAdmin: false
          });
          wx.navigateBack();
        }
  }
    });
  }
});
