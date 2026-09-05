# 第一幕图片生成提示词

## 背景图片

### 排练厅背景
**中文提示词：**
```
明朝风格的传统昆曲排练厅，古木书案陈设，淡黄色柔光照明，窗外竹影婆娑，墙上挂着历代名角画像，角落摆放戏曲道具，水墨画风格，淡青色和米白色调，柔和的自然光，优雅的文人气息
```

**English Prompt:**
```
Traditional Kunqu opera rehearsal hall in Ming Dynasty style, ancient wooden desk and furnishings, soft yellow lighting, bamboo shadows outside the window, portraits of famous actors on the wall, opera props in the corner, ink painting style, light cyan and beige tones, soft natural light, elegant scholarly atmosphere
```

**技术参数：**
- 风格：中国水墨画风格
- 色调：淡青 (#B8D4D0)、米白 (#F5F0E8)、淡米色 (#E8E0D0)
- 比例：9:16（竖屏）
- 光照：左上角45度自然光
- 细节：留白构图，虚化背景

---

## 前景装饰

### 排练厅前景装饰
**中文提示词：**
```
昆曲排练厅前景装饰，折扇形边框元素，淡墨渲染的梅花纹理，水袖流线装饰，古典花窗纹样，半透明效果，淡青色和朱砂红点缀，留白构图，优雅的层次感
```

**English Prompt:**
```
Kunqu rehearsal hall foreground decoration, folding fan-shaped border elements, light ink-rendered plum blossom textures, water sleeve flowing line decorations, classical flower window patterns, semi-transparent effect, light cyan and vermillion red accents, white space composition, elegant layering
```

**技术参数：**
- 用途：前景装饰层（半透明叠加）
- 元素：折扇、梅花、水袖、花窗
- 颜色：淡青 (#B8D4D0)、朱砂红 (#C85554)
- 透明度：50-70%

---

## 人物立绘

### 1. 李师父（Master Li）

**中文提示词：**
```
明朝昆曲班主，五十余岁，面容慈祥，长须花白，目光温和，身穿深色长衫，腰间素色腰带，半身像，中国传统人物画风格，淡墨渲染，淡青色和米白色调，背景虚化，柔和的自然光，文人气质，优雅的笔触
```

**English Prompt:**
```
Ming Dynasty Kunqu opera master, in his fifties, kind face, white long beard, gentle eyes, wearing dark long gown, plain belt at waist, half-body portrait, traditional Chinese figure painting style, light ink rendering, light cyan and beige tones, blurred background, soft natural light, scholarly temperament, elegant brushstrokes
```

**技术参数：**
- 位置：左侧或居中
- 表情：慈祥温和
- 比例：3:4（半身像）
- 色调：黛蓝 (#2C5F5F)、淡青 (#B8D4D0)、米白 (#F5F0E8)

---

### 2. 金丽卿（Jin Liqing）

**中文提示词：**
```
明朝昆曲旦角演员，二十三四岁，面容清秀，眉目如画，身穿青色戏服，水袖飘逸，半身像，中国传统人物画风格，淡墨渲染，淡青色和粉白色调，背景虚化，柔和的自然光，优雅的戏曲美感，细腻的笔触
```

**English Prompt:**
```
Ming Dynasty Kunqu opera dan role actress, twenty-three or twenty-four years old, beautiful face, painted eyebrows, wearing cyan opera costume, flowing water sleeves, half-body portrait, traditional Chinese figure painting style, light ink rendering, light cyan and pink-white tones, blurred background, soft natural light, elegant opera beauty, delicate brushstrokes
```

**技术参数：**
- 位置：右侧或居中
- 表情：优雅温婉
- 比例：3:4（半身像）
- 色调：淡青 (#B8D4D0)、米白 (#F5F0E8)、淡米色 (#E8E0D0)
- 服装：青色戏服，水袖飘逸

---

## 使用建议

### 对于 ChatGPT/DALL-E
- 使用中文或英文提示词均可
- 建议添加风格关键词：`Chinese ink painting`, `elegant`, `soft colors`
- 可以指定色彩：`color palette: light cyan #B8D4D0, beige #F5F0E8`

### 对于 Sora/Midjourney
- 使用英文提示词效果更好
- 可以添加技术参数：`--ar 9:16 --style chinese --v 6`
- 建议添加质量提示：`high quality`, `detailed`, `professional`

### 图片规格
- 背景图：1080×1920（9:16竖屏）
- 人物立绘：600×800（3:4半身像）
- 前景装饰：1080×1920（半透明PNG格式）

---

## 配色参考

- **主色调**：
  - 淡青：`#B8D4D0`
  - 米白：`#F5F0E8`
  - 黛蓝：`#2C5F5F`
  - 朱砂红：`#C85554`

- **辅助色**：
  - 青灰：`#6B8E8E`
  - 淡米色：`#E8E0D0`

