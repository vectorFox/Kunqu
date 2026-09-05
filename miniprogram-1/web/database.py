import sqlite3
import os
from datetime import datetime
from typing import Optional, List, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), 'kunqu.db')

def get_db_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """初始化数据库"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 用户表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,
            username TEXT,
            current_chapter TEXT DEFAULT 'chapter1',
            current_node TEXT DEFAULT 'start',
            score INTEGER DEFAULT 0,
            understanding_value INTEGER DEFAULT 0,
            favor_value INTEGER DEFAULT 0,
            unlocked_chapters TEXT DEFAULT '["chapter1"]',
            unlocked_endings TEXT DEFAULT '[]',
            create_time TEXT DEFAULT CURRENT_TIMESTAMP,
            update_time TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 答题历史表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            quiz_id TEXT NOT NULL,
            question TEXT NOT NULL,
            selected_answer INTEGER,
            correct_answer INTEGER,
            is_correct INTEGER,
            category TEXT,
            create_time TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 角色档案表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS archives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            name TEXT,
            description TEXT,
            create_time TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def get_or_create_user(user_id: str, username: str = "游客") -> Dict[str, Any]:
    """获取或创建用户"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 尝试获取用户
    cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
    user = cursor.fetchone()
    
    if user:
        conn.close()
        return dict(user)
    
    # 创建新用户
    cursor.execute('''
        INSERT INTO users (user_id, username)
        VALUES (?, ?)
    ''', (user_id, username))
    conn.commit()
    
    cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    return dict(user)

def update_user_progress(user_id: str, progress: Dict[str, Any]) -> bool:
    """更新用户进度"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    import json
    
    cursor.execute('''
        UPDATE users SET
            current_chapter = ?,
            current_node = ?,
            score = ?,
            understanding_value = ?,
            favor_value = ?,
            unlocked_chapters = ?,
            unlocked_endings = ?,
            update_time = CURRENT_TIMESTAMP
        WHERE user_id = ?
    ''', (
        progress.get('current_chapter', 'chapter1'),
        progress.get('current_node', 'start'),
        progress.get('score', 0),
        progress.get('understanding_value', 0),
        progress.get('favor_value', 0),
        json.dumps(progress.get('unlocked_chapters', ['chapter1'])),
        json.dumps(progress.get('unlocked_endings', [])),
        user_id
    ))
    
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    
    return affected > 0

def save_quiz_result(user_id: str, quiz: Dict[str, Any], selected_answer: int, is_correct: bool) -> bool:
    """保存答题结果"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO quiz_history 
        (user_id, quiz_id, question, selected_answer, correct_answer, is_correct, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        quiz.get('id', ''),
        quiz.get('question', ''),
        selected_answer,
        quiz.get('answer', 0),
        1 if is_correct else 0,
        quiz.get('category', 'general')
    ))
    
    conn.commit()
    conn.close()
    return True

def get_quiz_history(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """获取答题历史"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM quiz_history
        WHERE user_id = ?
        ORDER BY create_time DESC
        LIMIT ?
    ''', (user_id, limit))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def get_user_accuracy(user_id: str) -> int:
    """获取用户正确率"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT COUNT(*) as total,
               SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
        FROM quiz_history
        WHERE user_id = ?
    ''', (user_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    if result['total'] == 0:
        return 0
    
    return round(result['correct'] / result['total'] * 100)

def save_archive(user_id: str, archive_type: str, name: str, description: str = "") -> bool:
    """保存学习档案"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO archives (user_id, type, name, description)
        VALUES (?, ?, ?, ?)
    ''', (user_id, archive_type, name, description))
    
    conn.commit()
    conn.close()
    return True

def get_archives(user_id: str) -> List[Dict[str, Any]]:
    """获取学习档案"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM archives
        WHERE user_id = ?
        ORDER BY create_time DESC
    ''', (user_id,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def clear_user_data(user_id: str) -> bool:
    """清除用户数据"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM quiz_history WHERE user_id = ?', (user_id,))
    cursor.execute('DELETE FROM archives WHERE user_id = ?', (user_id,))
    cursor.execute('''
        UPDATE users SET
            current_chapter = 'chapter1',
            current_node = 'start',
            score = 0,
            understanding_value = 0,
            favor_value = 0,
            unlocked_chapters = '["chapter1"]',
            unlocked_endings = '[]',
            update_time = CURRENT_TIMESTAMP
        WHERE user_id = ?
    ''', (user_id,))
    
    conn.commit()
    conn.close()
    return True
