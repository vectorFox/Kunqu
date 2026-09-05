# 剧情数据 - 游园惊梦 Web版（简化版 - 减少抉择）

STORY_NODES = {
    # ========== 入门 ==========
    'start': {
        'id': 'start',
        'text': '清晨的雾气还未散尽，你踏入了昆山戏班的大门。青石板路还带着夜色的凉意，檐下的风铃随风轻晃，发出清脆的声响。远处传来吊嗓的声音，像一滴水落在玉盘上，清亮悠远。',
        'character': '旁白',
        'characterId': '',
        'next': 'arrive_hall',
        'background': 'rehearsal_hall',
    },
    'arrive_hall': {
        'id': 'arrive_hall',
        'text': '师父带着你穿过回廊，推开排练厅的门。屋内弥漫着淡淡的木香与墨气，书案上的小灯发出暖黄的光。窗外竹影婆娑，随着微风轻轻摆动。',
        'character': '旁白',
        'characterId': '',
        'next': 'teacher_welcome',
        'background': 'rehearsal_hall',
    },
    'teacher_welcome': {
        'id': 'teacher_welcome',
        'text': '师父转过身来，轻抚长须，温和地看着你："从今日起，你便是这戏班的一员了。昆曲之道，博大精深，不止是唱念做打，更是一口气、一段情、一种分寸。你先坐下，看看这屋子里的一切。"',
        'character': '师父',
        'characterId': 'master_li',
        'next': 'observe_room',
        'background': 'rehearsal_hall',
    },
    # 自动观察排练厅
    'observe_room': {
        'id': 'observe_room',
        'text': '你环顾四周，排练厅虽不大，却处处透着规矩。地面擦得发亮，衣架上的戏服叠得整齐。师父在一旁说道："昆曲有五大行当：生、旦、净、末、丑。生为男，旦为女，净为刚，末为长，丑为谐。你且记下。"',
        'character': '师父',
        'characterId': 'master_li',
        'next': 'meet_jin',
        'background': 'rehearsal_hall',
    },
    # 遇到金丽卿
    'meet_jin': {
        'id': 'meet_jin',
        'text': '这时，你注意到窗边站着一道身影——那是一名身着青色戏服的女子，正在练习水袖。她的每一个动作都如行云流水，水袖在空中划出优美的弧线。',
        'character': '旁白',
        'characterId': '',
        'next': 'jin_intro',
        'background': 'rehearsal_hall',
    },
    'jin_intro': {
        'id': 'jin_intro',
        'text': '师父低声说道："那是你的师姐金丽卿，专攻旦角，已有十年功底。你且看她的肩、肘、腕——水袖的要领，在于以意领气，以气领形。"',
        'character': '师父',
        'characterId': 'master_li',
        'next': 'jin_teach',
        'background': 'rehearsal_hall',
    },
    'jin_teach': {
        'id': 'jin_teach',
        'text': '金丽卿注意到你们，微微一笑："师父，这就是新来的师弟吗？"她转过身来，"水袖最难在于柔而不弱，力不透而意无穷。我教你几个基本动作吧。"',
        'character': '金丽卿',
        'characterId': 'jin_liqing',
        'next': 'learn_sleeve',
        'background': 'rehearsal_hall',
    },
    'learn_sleeve': {
        'id': 'learn_sleeve',
        'text': '金丽卿点点头："好，先从抖袖开始。你看——手臂放松，手腕要灵活，让水袖随着你的动作自然展开。"她示范了几个动作，白色的水袖在空中翻飞，如波浪般轻盈。',
        'character': '金丽卿',
        'characterId': 'jin_liqing',
        'next': 'practice_sleeve',
        'background': 'rehearsal_hall',
    },
    'practice_sleeve': {
        'id': 'practice_sleeve',
        'text': '你认真地模仿着，虽然动作还显生疏，但已能感受到其中韵律。金丽卿点点头："不错，学得很快。昆曲之道，不在一朝一夕。"',
        'character': '金丽卿',
        'characterId': 'jin_liqing',
        'next': 'talk_about_mudanting',
        'background': 'rehearsal_hall',
    },
    'talk_about_mudanting': {
        'id': 'talk_about_mudanting',
        'text': '"戏班里啊，每日练功虽辛苦，却也充实。"金丽卿说道，"我专攻旦角，尤其是青衣。青衣多演端庄稳重的女子，如《牡丹亭》里的杜丽娘。"',
        'character': '金丽卿',
        'characterId': 'jin_liqing',
        'next': 'mudanting_preview',
        'background': 'rehearsal_hall',
    },
    'mudanting_preview': {
        'id': 'mudanting_preview',
        'text': '"《牡丹亭》……"她的眼神变得温柔，"那是我最喜欢的戏。杜丽娘游园惊梦，情思暗生，那段戏，每每演绎，都能感受到她内心的情感。"',
        'character': '金丽卿',
        'characterId': 'jin_liqing',
        'next': 'first_quiz',
        'background': 'rehearsal_hall',
    },
    # 答题环节
    'first_quiz': {
        'id': 'first_quiz',
        'type': 'quiz',
        'quizCategory': 'hangdang',
        'text': '师父要考验你对昆曲行当的理解。',
        'next': 'after_quiz',
        'background': 'rehearsal_hall',
    },
    'after_quiz': {
        'id': 'after_quiz',
        'text': '师父满意地点点头："不错，你已记住基本。行当是昆曲的根基，日后还要多加体会。"',
        'character': '师父',
        'characterId': 'master_li',
        'next': 'learn_singing',
        'background': 'rehearsal_hall',
    },
    'learn_singing': {
        'id': 'learn_singing',
        'text': '"我再与你讲讲昆曲的唱腔。"师父说道，"昆曲最重"水磨腔"，旋律婉转，节奏舒缓，如同水磨一般细腻。唱的时候，要气息平稳，情感内敛。"',
        'character': '师父',
        'characterId': 'master_li',
        'next': 'day_end',
        'background': 'rehearsal_hall',
    },
    'day_end': {
        'id': 'day_end',
        'text': '日影西斜，师父说道："今日就到这里。昆曲之道，在于日积月累。你且回去歇息，明日再来。"',
        'character': '师父',
        'characterId': 'master_li',
        'next': 'invitation',
        'background': 'rehearsal_hall',
    },
    # 唯一的简单选择
    'invitation': {
        'id': 'invitation',
        'text': '师父起身欲走，却又停下："你可知近日班子里在排什么戏？"他微微一笑，"《牡丹亭》。你若想看，明日可以让你观摩。"',
        'character': '师父',
        'characterId': 'master_li',
        'next': 'mudanting',
        'background': 'rehearsal_hall',
    },
    # 牡丹亭表演
    'mudanting': {
        'id': 'mudanting',
        'text': '第二日，你来到排练厅。金丽卿已换好戏服，开始演绎《牡丹亭》中"游园惊梦"的经典片段。\n\n她的每一个动作都如诗如画，水袖翻转间，仿佛真的置身于那座花园之中。"原来姹紫嫣红开遍，似都付与断井颓垣……"她的唱腔婉转，如泣如诉。\n\n你看得入了神，仿佛看到了杜丽娘内心的情感——那种对爱情的向往与执着。',
        'character': '金丽卿',
        'characterId': 'jin_liqing',
        'next': 'ending_good',
        'background': 'stage',
    },

    # ========== 结局 ==========
    'ending_good': {
        'id': 'ending_good',
        'text': '戏毕，金丽卿看向你："师弟，你看到了什么？"\n\n你犹豫了一下答道："我看到了……情。"\n\n她笑了："不错。昆曲之道，不在技艺，而在真情。你已入门了。"\n\n师父在身后点点头："今日起，你便正式成为戏班的一员了。昆曲之路漫长，愿你一直走下去。"',
        'character': '旁白',
        'characterId': '',
        'type': 'ending',
        'endingName': '传承之路',
        'options': [],
        'background': 'stage',
    },
}


class StoryManager:
    """剧情管理器 - 简洁版"""
    
    def __init__(self):
        self.storyNodes = STORY_NODES
        self.currentNodeId = 'start'
        self.gameState = {
            'understandingValue': 0,
            'favorValue': 0,
            'score': 0,
            'unlockedChapters': ['chapter1'],
            'unlockedEndings': []
        }
    
    def get_current_node(self):
        return self.storyNodes.get(self.currentNodeId)
    
    def set_current_node(self, node_id):
        if node_id in self.storyNodes:
            self.currentNodeId = node_id
    
    def get_game_state(self):
        return self.gameState.copy()
    
    def set_game_state(self, state):
        if state:
            self.gameState = {**self.gameState, **state}
    
    def reset(self):
        self.currentNodeId = 'start'
        self.gameState = {
            'understandingValue': 0,
            'favorValue': 0,
            'score': 0,
            'unlockedChapters': ['chapter1'],
            'unlockedEndings': []
        }
    
    def check_condition(self, condition):
        if not condition:
            return True
        if condition.get('understandingValue') is not None:
            return self.gameState.get('understandingValue', 0) >= condition['understandingValue']
        if condition.get('favorValue') is not None:
            return self.gameState.get('favorValue', 0) >= condition['favorValue']
        return True
    
    def get_available_options(self, node):
        if not node or not node.get('options'):
            return []
        return [opt for opt in node['options'] if self.check_condition(opt.get('condition'))]
    
    def apply_effect(self, effect):
        if effect:
            for key, value in effect.items():
                if key in self.gameState:
                    self.gameState[key] += value
    
    def select_option(self, option_index):
        current_node = self.get_current_node()
        if not current_node or not current_node.get('options'):
            return None
        
        available_options = self.get_available_options(current_node)
        if option_index >= len(available_options):
            return None
        
        selected_option = available_options[option_index]
        
        if selected_option.get('effect'):
            self.apply_effect(selected_option['effect'])
        
        next_id = selected_option.get('next')
        if next_id:
            self.set_current_node(next_id)
            next_node = self.get_current_node()
            if next_node and next_node.get('effect'):
                self.apply_effect(next_node['effect'])
            return next_node
        
        return None
    
    def advance(self):
        """无选项时按节点 next 自动推进"""
        current_node = self.get_current_node()
        if not current_node:
            return None
        
        next_id = current_node.get('next')
        if not next_id:
            return None
        
        self.set_current_node(next_id)
        next_node = self.get_current_node()
        
        if next_node and next_node.get('effect'):
            self.apply_effect(next_node['effect'])
        
        return next_node
