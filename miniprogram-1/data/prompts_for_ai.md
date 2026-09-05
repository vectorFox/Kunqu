# AI图片生成提示词（可直接复制使用）

## 📸 背景图片 - 排练厅

### 中文提示词（适用于中文AI）
```
明朝风格的传统昆曲排练厅，古木书案陈设，淡黄色柔光照明，窗外竹影婆娑，墙上挂着历代名角画像，角落摆放戏曲道具，水墨画风格，淡青色和米白色调，柔和的自然光，优雅的文人气息，9:16竖屏比例
```

### 英文提示词（适用于Sora/DALL-E/Midjourney）
```
Traditional Kunqu opera rehearsal hall in Ming Dynasty style, ancient wooden desk and furnishings, soft yellow lighting, bamboo shadows outside the window, portraits of famous actors on the wall, opera props in the corner, Chinese ink painting style, light cyan (#B8D4D0) and beige (#F5F0E8) color palette, soft natural light from top left at 45 degrees, elegant scholarly atmosphere, 9:16 vertical aspect ratio, high quality, detailed
```

**Midjourney 参数建议：**
```
--ar 9:16 --style raw --v 6 --quality 2
```

---

## 🎨 前景装饰 - 排练厅装饰层

### 中文提示词
```
昆曲排练厅前景装饰，折扇形边框元素，淡墨渲染的梅花纹理，水袖流线装饰，古典花窗纹样，半透明效果，淡青色和朱砂红点缀，留白构图，优雅的层次感，PNG透明背景
```

### 英文提示词
```
Kunqu rehearsal hall foreground decoration, folding fan-shaped border elements, light ink-rendered plum blossom textures, water sleeve flowing line decorations, classical flower window patterns, semi-transparent overlay effect (50-70% opacity), light cyan (#B8D4D0) and vermillion red (#C85554) accents, white space composition, elegant layering, PNG transparent background, 9:16 aspect ratio
```

**技术参数：**
- 格式：PNG（透明背景）
- 透明度：50-70%
- 尺寸：1080×1920

---

## 👨 人物立绘 - 李师父

### 中文提示词
```
明朝昆曲班主，五十余岁，面容慈祥，长须花白，目光温和，身穿深色长衫，腰间素色腰带，半身像，中国传统人物画风格，淡墨渲染，淡青色和米白色调，背景虚化，柔和的自然光，文人气质，优雅的笔触，3:4比例
```

### 英文提示词
```
Ming Dynasty Kunqu opera master, in his fifties, kind and gentle face, white long beard, warm eyes, wearing dark long gown, plain belt at waist, half-body portrait, traditional Chinese figure painting style, light ink rendering, light cyan (#B8D4D0) and beige (#F5F0E8) color palette, blurred background, soft natural light, scholarly temperament, elegant brushstrokes, 3:4 aspect ratio, high quality portrait
```

**Midjourney 参数建议：**
```
--ar 3:4 --style raw --v 6 --quality 2
```

**颜色参考：**
- 主色：黛蓝 #2C5F5F
- 辅助：淡青 #B8D4D0
- 背景：米白 #F5F0E8

---

## 👩 人物立绘 - 金丽卿

### 中文提示词
```
明朝昆曲旦角演员，二十三四岁，面容清秀，眉目如画，身穿青色戏服，水袖飘逸，半身像，中国传统人物画风格，淡墨渲染，淡青色和粉白色调，背景虚化，柔和的自然光，优雅的戏曲美感，细腻的笔触，3:4比例
```

### 英文提示词
```
Ming Dynasty Kunqu opera dan role actress, twenty-three or twenty-four years old, beautiful and delicate face, painted eyebrows, wearing cyan opera costume with flowing water sleeves, half-body portrait, traditional Chinese figure painting style, light ink rendering, light cyan (#B8D4D0) and pink-white (#F5F0E8) color palette, blurred background, soft natural light, elegant opera beauty, delicate brushstrokes, 3:4 aspect ratio, high quality portrait
```

**Midjourney 参数建议：**
```
--ar 3:4 --style raw --v 6 --quality 2
```

**颜色参考：**
- 主色：淡青 #B8D4D0
- 辅助：米白 #F5F0E8
- 装饰：淡米色 #E8E0D0

---

## 📋 使用说明

### 对于 ChatGPT (DALL-E)
1. 直接复制中文或英文提示词
2. 可以添加："请生成一张符合以上描述的图片"
3. 建议指定尺寸："尺寸为1080×1920像素"

### 对于 Sora
1. 使用英文提示词
2. 可以添加视频参数："静止画面，高质量"
3. 建议添加："detailed, professional, cinematic"

### 对于 Midjourney
1. 使用英文提示词
2. 添加参数：`--ar 9:16 --style raw --v 6 --quality 2`
3. 可以添加：`--seed [随机数]` 来保持一致性

### 对于 Stable Diffusion
1. 使用英文提示词
2. 添加负面提示词：
   ```
   negative prompt: ugly, blurry, low quality, distorted, modern, western style
   ```
3. 建议模型：Chinese traditional painting models

---

## 🎨 配色方案（供参考）

所有图片应遵循以下配色：

**主色调：**
- 淡青：`#B8D4D0` (Light Cyan)
- 米白：`#F5F0E8` (Beige)
- 黛蓝：`#2C5F5F` (Dark Cyan)
- 朱砂红：`#C85554` (Vermillion Red)

**辅助色：**
- 青灰：`#6B8E8E` (Gray Cyan)
- 淡米色：`#E8E0D0` (Light Beige)

---

## 📐 图片规格

| 类型 | 尺寸 | 比例 | 格式 | 用途 |
|------|------|------|------|------|
| 背景图 | 1080×1920 | 9:16 | JPG/PNG | 游戏背景 |
| 前景装饰 | 1080×1920 | 9:16 | PNG | 前景叠加层 |
| 人物立绘 | 600×800 | 3:4 | PNG | 人物显示 |

---

## ✅ 检查清单

生成图片后，请确认：
- [ ] 背景图符合昆曲排练厅的场景
- [ ] 前景装饰为透明PNG格式
- [ ] 人物立绘为半身像，背景虚化
- [ ] 所有图片配色符合昆曲美学风格
- [ ] 图片尺寸符合要求
- [ ] 图片质量清晰，无明显瑕疵

---

## 💡 提示

如果生成的图片不够理想，可以尝试：
1. 添加更多细节描述（如"细腻的笔触"、"优雅的构图"）
2. 指定具体的艺术风格（如"宋代文人画风格"）
3. 调整光照描述（如"柔和的左上角45度自然光"）
4. 强调色彩要求（如"以淡青色和米白色为主"）

