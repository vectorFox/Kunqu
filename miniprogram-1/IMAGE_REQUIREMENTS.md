# 图片需求清单

本文档记录小程序开发过程中需要的所有图片资源，开发阶段使用文字替代，后续需要画师绘制。

## 第一幕：初入戏班

### 1. 背景图片

**文件路径：** `miniprogram/images/main_background.png`

**位置：** `pages/story/story.wxml` 第4行

**描述：** 
- 明朝风格的传统昆曲排练厅
- 古木书案陈设，淡黄色柔光照明
- 窗外竹影婆娑
- 墙上挂着历代名角画像
- 角落摆放戏曲道具
- 水墨画风格，淡青色和米白色调

**尺寸：** 1080×1920 (9:16竖屏)

**风格：** 中国水墨画风格，柔和的自然光

**当前替代：** CSS渐变背景 + "排练厅场景"文字提示

---

### 2. 前景装饰图片

**文件路径：** `miniprogram/images/foreground_decoration.png`

**位置：** `pages/story/story.wxml` 第9行

**描述：**
- 昆曲排练厅前景装饰
- 折扇形边框元素
- 淡墨渲染的梅花纹理
- 水袖流线装饰
- 古典花窗纹样
- 半透明效果（50-70%透明度）

**尺寸：** 1080×1920 (9:16竖屏)

**格式：** PNG（透明背景）

**当前替代：** CSS装饰图案

---

### 3. 人物立绘 - 李师父

**文件路径：** `miniprogram/images/lishifu.png`

**位置：** `pages/story/story.wxml` 第16行（当前为文字描述）

**描述：**
- 明朝昆曲班主，五十余岁
- 面容慈祥，长须花白，目光温和
- 身穿深色长衫，腰间素色腰带
- 半身像（胸以上）
- 中国传统人物画风格

**尺寸：** 600×800 (3:4比例)

**位置：** 左侧10%位置

**当前替代：** 文字描述卡片（显示人物名称和外观描述）

---

### 4. 人物立绘 - 金丽卿

**文件路径：** `miniprogram/images/jinliqing.png`

**位置：** `pages/story/story.wxml` 第22行（当前为文字描述）

**描述：**
- 明朝昆曲旦角演员，二十三四岁
- 面容清秀，眉目如画
- 身穿青色戏服，水袖飘逸
- 半身像（胸以上）
- 中国传统人物画风格

**尺寸：** 600×800 (3:4比例)

**位置：** 右侧10%位置

**当前替代：** 文字描述卡片（显示人物名称和外观描述）

---

## 其他页面

### 5. 主菜单背景（可选）

**位置：** `pages/menu/menu.wxml`

**描述：** 昆曲舞台幕布半掩，淡粉光晕

**当前替代：** CSS渐变背景

**优先级：** 低（当前CSS效果已足够）

---

### 6. 学习档案图标（可选）

**位置：** `pages/archive/archive.wxml` 第41-46行

**描述：** 角色和题目的图标

**当前替代：** Emoji表情符号（🎭 📝）

**优先级：** 低（当前Emoji已足够）

---

## 图片要求

### 文件大小限制
- **单张图片：** < 200KB
- **总大小：** < 2MB（小程序限制）

### 格式要求
- **背景图：** JPG或PNG（建议JPG以减小体积）
- **人物立绘：** PNG（支持透明背景）
- **装饰元素：** PNG（透明背景）

### 配色方案
- **主色调：**
  - 淡青：`#B8D4D0`
  - 米白：`#F5F0E8`
  - 黛蓝：`#2C5F5F`
  - 朱砂红：`#C85554`
- **辅助色：**
  - 青灰：`#6B8E8E`
  - 淡米色：`#E8E0D0`

### 风格要求
- 中国水墨画风格
- 淡墨渲染效果
- 柔和的自然光
- 优雅的文人气息
- 符合昆曲美学

---

## 添加图片后的代码修改

### 背景图片
在 `pages/story/story.wxml` 第4行，将：
```xml
<view class="background-layer">
  <view class="background-text">排练厅场景</view>
</view>
```
改为：
```xml
<image class="background-layer" 
       src="/images/main_background.png" 
       mode="aspectFill"></image>
```

### 前景装饰
在 `pages/story/story.wxml` 第9行，将：
```xml
<view class="foreground-layer"></view>
```
改为：
```xml
<image class="foreground-layer" 
       src="/images/foreground_decoration.png" 
       mode="aspectFill"></image>
```

### 人物立绘
在 `pages/story/story.wxml` 第16行和第22行，将文字描述改为：
```xml
<image class="character-image master-li {{showMasterLi ? 'show' : 'hide'}}"
       src="/images/lishifu.png" 
       mode="aspectFit"></image>
```

并更新对应的CSS样式（移除文字样式，恢复图片样式）。

---

## 开发阶段说明

当前所有图片位置都使用文字或CSS替代，确保：
1. 功能完整可用
2. 界面美观
3. 文件大小符合要求
4. 便于后续替换

所有需要图片的位置都在代码中标注了 `TODO` 注释，方便后续查找和替换。

