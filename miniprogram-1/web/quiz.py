# 问答数据 - 与小程序版本保持一致

DEFAULT_QUIZZES = {
    'hangdang': {
        'id': 'quiz_hangdang_1',
        'question': '昆曲的行当分为哪五大类？',
        'type': 'single',
        'options': [
            'A. 生、旦、净、末、丑',
            'B. 生、旦、净、末、小',
            'C. 生、旦、净、末、武',
            'D. 生、旦、净、末、老'
        ],
        'answer': 0,
        'explanation': '昆曲行当分为生、旦、净、末、丑五大类，每一类都有其独特的表演特色和角色定位。',
        'category': 'hangdang'
    },
    'shuimo': {
        'id': 'quiz_shuimo_1',
        'question': '"水磨腔"的特点是什么？',
        'type': 'single',
        'options': [
            'A. 旋律婉转、节奏舒缓',
            'B. 节奏急促、音调高昂',
            'C. 音调低沉、节奏单一',
            'D. 旋律简单、节奏明快'
        ],
        'answer': 0,
        'explanation': '"水磨腔"的特点是旋律婉转、节奏舒缓，体现昆曲柔美的审美精神，如同水磨一般细腻。',
        'category': 'shuimo'
    },
    'character': {
        'id': 'quiz_character_1',
        'question': '杜丽娘是哪个剧目的主要角色？',
        'type': 'single',
        'options': [
            'A. 《牡丹亭》',
            'B. 《西厢记》',
            'C. 《桃花扇》',
            'D. 《长生殿》'
        ],
        'answer': 0,
        'explanation': '杜丽娘是明代剧作家汤显祖《牡丹亭》中的主要角色，是昆曲旦角的经典形象。',
        'category': 'character'
    },
    'general': {
        'id': 'quiz_general_1',
        'question': '昆曲起源于哪个朝代？',
        'type': 'single',
        'options': [
            'A. 唐代',
            'B. 宋代',
            'C. 元代',
            'D. 明代'
        ],
        'answer': 2,
        'explanation': '昆曲起源于元末明初的昆山地区，经过数百年的发展，形成了独特的艺术风格。',
        'category': 'general'
    }
}


class QuizManager:
    """问答管理器 - 与小程序版本保持一致"""
    
    def __init__(self):
        self.current_quiz = None
        self.quiz_history = []
    
    def get_quiz(self, category, count=1):
        """获取题目"""
        if category in DEFAULT_QUIZZES:
            self.current_quiz = DEFAULT_QUIZZES[category]
        else:
            self.current_quiz = DEFAULT_QUIZZES.get('general', DEFAULT_QUIZZES['general'])
        
        return self.current_quiz
    
    def check_answer(self, selected_index):
        """检查答案"""
        if not self.current_quiz:
            return {'isCorrect': False, 'correctAnswer': 0, 'explanation': ''}
        
        is_correct = selected_index == self.current_quiz['answer']
        
        # 记录答题历史
        self.quiz_history.append({
            'quiz': self.current_quiz,
            'selectedIndex': selected_index,
            'isCorrect': is_correct,
            'time': 'now'
        })
        
        return {
            'isCorrect': is_correct,
            'correctAnswer': self.current_quiz['answer'],
            'explanation': self.current_quiz['explanation'],
            'quiz': self.current_quiz
        }
    
    def get_history(self):
        """获取答题历史"""
        return self.quiz_history
    
    def get_accuracy(self):
        """获取正确率"""
        if len(self.quiz_history) == 0:
            return 0
        correct = sum(1 for item in self.quiz_history if item['isCorrect'])
        return round((correct / len(self.quiz_history)) * 100)
