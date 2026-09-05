// pages/story/story.js
const StoryManager = require('../../utils/story.js').StoryManager;
const db = require('../../utils/db.js');
const quizDB = db.quizDB;

Page({
  data: {
    currentNode: null,
    availableOptions: [],
    characterName: '',
    storyText: '',
    isShowingQuiz: false,
    isEnding: false,
    gameState: {
      understandingValue: 0,
      favorValue: 0,
      score: 0
    },
    showMenu: false,
    showMasterLi: false,
    showJinLiqing: false
  },

  storyManager: null,

  onLoad: function (options) {
    const mode = options.mode || 'new';
    this.initStory(mode);
  },

  // 初始化剧情
  async initStory(mode) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    try {
      // 设置超时保护
      const initPromise = (async () => {
        this.storyManager = new StoryManager();
        await this.storyManager.init();

        if (mode === 'continue') {
          // 尝试加载存档，设置超时
          try {
            const loginRes = await Promise.race([
              wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: { type: 'getOpenId' }
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
            ]).catch(() => {
              return { result: { openid: 'guest' } };
            });
            
            const openid = loginRes.result.openid || 'guest';
            const loaded = await Promise.race([
              this.storyManager.loadProgress(openid),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
            ]).catch(() => false);
            
            if (!loaded) {
              this.storyManager.setCurrentNode('start');
            }
          } catch (err) {
            console.warn('加载存档失败，使用新游戏:', err);
            this.storyManager.setCurrentNode('start');
          }
        } else {
          this.storyManager.setCurrentNode('start');
        }
      })();

      // 设置总超时时间
      await Promise.race([
        initPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('初始化超时')), 5000))
      ]);

      this.updateStoryDisplay();
    } catch (err) {
      console.error('初始化失败:', err);
      // 即使失败也尝试显示默认内容
      if (!this.storyManager) {
        this.storyManager = new StoryManager();
        this.storyManager.storyNodes = this.storyManager.getDefaultStory();
        this.storyManager.setCurrentNode('start');
        this.updateStoryDisplay();
      }
      wx.showToast({
        title: '加载失败，使用默认内容',
        icon: 'none',
        duration: 2000
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 更新剧情显示（添加防抖保护）
  updateStoryDisplay() {
    // 防止重复调用
    if (this._updating) {
      return;
    }
    this._updating = true;

    try {
      if (!this.storyManager) {
        console.error('StoryManager未初始化');
        return;
      }

      const currentNode = this.storyManager.getCurrentNode();
      
      // 检查节点是否存在
      if (!currentNode) {
        console.error('当前节点不存在');
        wx.showToast({
          title: '剧情数据加载失败',
          icon: 'none'
        });
        return;
      }
      
      const availableOptions = this.storyManager.getAvailableOptions(currentNode);
      const gameState = this.storyManager.getGameState();

      // 检查是否是问答节点
      if (currentNode.type === 'quiz') {
        this.showQuiz(currentNode);
        return;
      }

      // 检查是否是结局
      if (currentNode.type === 'ending') {
        this.setData({
          isEnding: true,
          currentNode: currentNode,
          storyText: currentNode.text || '',
          characterName: currentNode.character || '旁白',
          gameState: gameState
        });
        return;
      }

      // 判断显示哪些人物
      const showMasterLi = currentNode.characterId === 'master_li' || 
                           currentNode.character === '师父' ||
                           currentNode.secondaryCharacterId === 'master_li';
      const showJinLiqing = currentNode.characterId === 'jin_liqing' || 
                            currentNode.secondaryCharacterId === 'jin_liqing' ||
                            currentNode.character === '金丽卿' ||
                            currentNode.secondaryCharacter === '金丽卿';

      this.setData({
        currentNode: currentNode,
        availableOptions: availableOptions,
        storyText: currentNode.text || '',
        characterName: currentNode.character || '旁白',
        gameState: gameState,
        isShowingQuiz: false,
        isEnding: false,
        showMasterLi: showMasterLi,
        showJinLiqing: showJinLiqing
      });
    } catch (err) {
      console.error('更新显示失败:', err);
    } finally {
      // 延迟重置标志，防止快速连续调用
      setTimeout(() => {
        this._updating = false;
      }, 100);
    }
  },

  // 显示问答
  async showQuiz(storyNode) {
    try {
      // 设置超时保护
      const quiz = await Promise.race([
        quizDB.getRandomQuiz(storyNode.quizCategory || 'general', 1),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]);
      
      if (quiz && quiz.length > 0) {
        // 跳转到问答页面
        wx.redirectTo({
          url: `/pages/quiz/quiz?category=${storyNode.quizCategory || 'general'}&nextNode=${storyNode.next || ''}&returnTo=story`
        });
      } else {
        throw new Error('未获取到题目');
      }
    } catch (err) {
      console.error('显示问答失败:', err);
      // 如果问答失败，直接跳转到下一个节点
      if (storyNode.next) {
        this.storyManager.setCurrentNode(storyNode.next);
        this.updateStoryDisplay();
      } else {
        // 如果没有下一个节点，返回继续学习
        this.storyManager.setCurrentNode('continue_learning');
        this.updateStoryDisplay();
      }
    }
  },

  // 选择选项（添加防抖保护）
  onSelectOption: function (e) {
    // 防止重复点击
    if (this._selecting) {
      return;
    }
    this._selecting = true;

    const index = parseInt(e.currentTarget.dataset.index);
    const option = this.data.availableOptions[index];
    
    if (!option || index === undefined || isNaN(index)) {
      console.error('选项选择失败:', index, option);
      this._selecting = false;
      return;
    }

    console.log('选择选项:', index, option.text);

    // 标记选中状态
    const options = this.data.availableOptions.map((item, i) => {
      return {
        ...item,
        selected: i === index
      };
    });
    
    this.setData({
      availableOptions: options
    });

    // 延迟执行，等待动画
    setTimeout(() => {
      try {
        if (!this.storyManager) {
          throw new Error('StoryManager未初始化');
        }

        const nextNode = this.storyManager.selectOption(index);
        
        if (nextNode) {
          // 更新游戏状态显示
          const gameState = this.storyManager.getGameState();
          this.setData({
            gameState: gameState
          });
          
          this.updateStoryDisplay();
          // 异步保存进度，不阻塞UI
          setTimeout(() => {
            this.autoSave();
          }, 500);
        } else {
          console.error('获取下一个节点失败');
          wx.showToast({
            title: '剧情节点不存在',
            icon: 'none'
          });
        }
      } catch (err) {
        console.error('处理选项失败:', err);
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        });
      } finally {
        // 延迟重置标志
        setTimeout(() => {
          this._selecting = false;
        }, 500);
      }
    }, 200);
  },

  // 自动保存（添加超时保护）
  async autoSave() {
    // 防止频繁保存
    if (this._saving) {
      return;
    }
    this._saving = true;

    try {
      // 设置超时保护
      const loginRes = await Promise.race([
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: { type: 'getOpenId' }
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]).catch(() => {
        return { result: { openid: 'guest' } };
      });
      
      const openid = loginRes.result.openid || 'guest';
      
      // 保存进度也设置超时
      await Promise.race([
        this.storyManager.saveProgress(openid),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]).catch((err) => {
        console.warn('保存进度超时或失败:', err);
      });
    } catch (err) {
      console.error('自动保存失败:', err);
    } finally {
      setTimeout(() => {
        this._saving = false;
      }, 1000);
    }
  },

  // 显示菜单
  toggleMenu: function () {
    this.setData({
      showMenu: !this.data.showMenu
    });
  },

  // 返回主菜单
  goToMenu: function () {
    wx.navigateBack();
  },

  // 重新开始
  restartGame: function () {
    wx.showModal({
      title: '确认',
      content: '确定要重新开始游戏吗？当前进度将丢失。',
      success: (res) => {
        if (res.confirm) {
          this.storyManager.setCurrentNode('start');
          this.storyManager.setGameState({
            understandingValue: 0,
            favorValue: 0,
            score: 0,
            unlockedChapters: ['chapter1']
          });
          this.updateStoryDisplay();
          this.setData({ showMenu: false });
        }
      }
    });
  },

  // 结局后返回
  onEndingConfirm: function () {
    this.autoSave();
    wx.navigateBack();
  }
});

