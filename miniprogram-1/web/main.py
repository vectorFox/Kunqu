"""
游园惊梦 - Web演示版
昆曲文化传承互动游戏后端服务
"""
import os
import uuid
import json
import hashlib
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import (
    init_db, get_or_create_user, update_user_progress,
    save_quiz_result, get_quiz_history, get_user_accuracy,
    clear_user_data
)
from story import StoryManager
from quiz import QuizManager

# 配置
ACCESS_PASSWORD = os.environ.get("KUNQU_ACCESS_PASSWORD", "enjian")
DB_PATH = os.path.join(os.path.dirname(__file__), 'kunqu.db')

# 初始化
init_db()
app = FastAPI(title="游园惊梦 - Web演示版")

# 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件和模板
static_dir = os.path.join(os.path.dirname(__file__), 'static')
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
templates = Jinja2Templates(directory=templates_dir)

# ==================== 工具函数 ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_auth(request: Request) -> bool:
    auth_cookie = request.cookies.get("kunqu_auth")
    if not auth_cookie:
        return False
    return auth_cookie == hash_password(ACCESS_PASSWORD)

def get_user_id(request: Request) -> str:
    user_id = request.cookies.get('user_id')
    if not user_id:
        user_id = str(uuid.uuid4())
    return user_id

def save_progress(user_id: str, story_mgr: StoryManager):
    state = story_mgr.get_game_state()
    update_user_progress(user_id, {
        'current_node': story_mgr.currentNodeId,
        'current_chapter': state.get('unlockedChapters', ['chapter1'])[-1],
        'score': state.get('score', 0),
        'understanding_value': state.get('understandingValue', 0),
        'favor_value': state.get('favorValue', 0),
        'unlocked_chapters': state.get('unlockedChapters', ['chapter1']),
        'unlocked_endings': state.get('unlockedEndings', [])
    })

# ==================== 认证 ====================

AUTH_COOKIE_NAME = "kunqu_auth"

@app.get("/auth")
def auth_page(request: Request):
    if verify_auth(request):
        return templates.TemplateResponse("menu.html", {"request": request, "user": {"username": "游客"}, "has_progress": False})
    return templates.TemplateResponse("auth.html", {"request": request, "error": ""})

@app.post("/api/auth/verify")
async def verify_password(req: dict, response: Response):
    if req.get("password") == ACCESS_PASSWORD:
        response.set_cookie(AUTH_COOKIE_NAME, hash_password(ACCESS_PASSWORD), max_age=60*60*24*7, httponly=True, path="/")
        return {"success": True}
    return {"success": False, "error": "密码错误"}

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie(AUTH_COOKIE_NAME, path="/")
    return {"success": True}

# 认证中间件
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.url.path.startswith("/static"):
        return await call_next(request)
    if request.url.path.startswith("/api"):
        return await call_next(request)
    if request.url.path in ["/auth", "/api/auth/verify"]:
        return await call_next(request)
    if not verify_auth(request):
        return templates.TemplateResponse("auth.html", {"request": request, "error": ""})
    return await call_next(request)

# ==================== 页面路由 ====================

@app.get("/")
def home(request: Request):
    user_id = get_user_id(request)
    user = get_or_create_user(user_id)
    return templates.TemplateResponse("menu.html", {
        "request": request,
        "user": user,
        "has_progress": bool(user.get('current_node') and user.get('current_node') != 'start')
    })

@app.get("/story")
def story_page(request: Request, mode: str = "new", node: str = ""):
    user_id = get_user_id(request)
    user = get_or_create_user(user_id)
    story_mgr = StoryManager()
    
    if node:
        story_mgr.set_current_node(node)
        story_mgr.set_game_state({
            'understandingValue': user.get('understanding_value', 0),
            'favorValue': user.get('favor_value', 0),
            'score': user.get('score', 0),
            'unlockedChapters': user.get('unlocked_chapters', ['chapter1']),
            'unlockedEndings': user.get('unlocked_endings', [])
        })
    elif mode == "continue" and user.get('current_node'):
        story_mgr.set_current_node(user['current_node'])
        story_mgr.set_game_state({
            'understandingValue': user.get('understanding_value', 0),
            'favorValue': user.get('favor_value', 0),
            'score': user.get('score', 0),
            'unlockedChapters': user.get('unlocked_chapters', ['chapter1']),
            'unlockedEndings': user.get('unlocked_endings', [])
        })
    else:
        story_mgr.reset()
    
    current_node = story_mgr.get_current_node()
    return templates.TemplateResponse("story.html", {
        "request": request,
        "user": user,
        "current_node": current_node,
        "available_options": story_mgr.get_available_options(current_node),
        "game_state": story_mgr.get_game_state(),
        "is_ending": current_node.get('type') == 'ending' if current_node else False
    })

@app.get("/quiz")
def quiz_page(request: Request, category: str = "general", next_node: str = ""):
    user_id = get_user_id(request)
    quiz_mgr = QuizManager()
    quiz = quiz_mgr.get_quiz(category)
    return templates.TemplateResponse("quiz.html", {
        "request": request,
        "user": get_or_create_user(user_id),
        "quiz": quiz,
        "next_node": next_node,
        "category": category
    })

@app.get("/archive")
def archive_page(request: Request):
    user_id = get_user_id(request)
    user = get_or_create_user(user_id)
    quiz_history = get_quiz_history(user_id)
    accuracy = get_user_accuracy(user_id)
    return templates.TemplateResponse("archive.html", {
        "request": request,
        "user": user,
        "quiz_history": quiz_history,
        "accuracy": accuracy,
        "total_quizzes": len(quiz_history)
    })

@app.get("/settings")
def settings_page(request: Request):
    user_id = get_user_id(request)
    return templates.TemplateResponse("settings.html", {
        "request": request,
        "user": get_or_create_user(user_id)
    })

# ==================== API 接口 ====================

class StoryRequest(BaseModel):
    user_id: str
    option_index: int = 0
    current_node_id: str
    game_state: dict = {}

class QuizRequest(BaseModel):
    user_id: str
    selected_index: int
    category: str
    next_node: str = ""

@app.post("/api/story/select")
async def select_option(req: StoryRequest):
    story_mgr = StoryManager()
    story_mgr.set_current_node(req.current_node_id)
    story_mgr.set_game_state(req.game_state)
    
    next_node = story_mgr.select_option(req.option_index)
    if not next_node:
        return {"success": False, "error": "选择失败"}
    
    save_progress(req.user_id, story_mgr)
    return {
        "success": True,
        "next_node": next_node,
        "game_state": story_mgr.get_game_state(),
        "available_options": story_mgr.get_available_options(next_node),
        "is_quiz": next_node.get('type') == 'quiz',
        "is_ending": next_node.get('type') == 'ending'
    }

@app.post("/api/story/advance")
async def advance_story(req: StoryRequest):
    story_mgr = StoryManager()
    story_mgr.set_current_node(req.current_node_id)
    story_mgr.set_game_state(req.game_state)
    
    next_node = story_mgr.advance()
    if not next_node:
        return {"success": False, "error": "当前节点无法继续推进"}
    
    save_progress(req.user_id, story_mgr)
    return {
        "success": True,
        "next_node": next_node,
        "game_state": story_mgr.get_game_state(),
        "available_options": story_mgr.get_available_options(next_node),
        "is_quiz": next_node.get('type') == 'quiz',
        "is_ending": next_node.get('type') == 'ending'
    }

@app.post("/api/story/restart")
async def restart_story(req: StoryRequest):
    story_mgr = StoryManager()
    story_mgr.reset()
    
    update_user_progress(req.user_id, {
        'current_node': 'start',
        'current_chapter': 'chapter1',
        'score': 0,
        'understanding_value': 0,
        'favor_value': 0,
        'unlocked_chapters': ['chapter1'],
        'unlocked_endings': []
    })
    
    return {
        "success": True,
        "current_node": story_mgr.get_current_node(),
        "game_state": story_mgr.get_game_state()
    }

@app.post("/api/quiz/answer")
async def submit_answer(req: QuizRequest):
    quiz_mgr = QuizManager()
    quiz_mgr.get_quiz(req.category)
    result = quiz_mgr.check_answer(req.selected_index)
    
    save_quiz_result(req.user_id, result['quiz'], req.selected_index, result['isCorrect'])
    
    if result['isCorrect']:
        user = get_or_create_user(req.user_id)
        update_user_progress(req.user_id, {
            'current_node': req.next_node or user.get('current_node', 'start'),
            'score': user.get('score', 0) + 10
        })
        result['score_added'] = 10
    
    return result

@app.post("/api/settings/clear")
async def clear_data(req: StoryRequest):
    clear_user_data(req.user_id)
    return {"success": True}

@app.post("/api/user/create")
async def create_user(response: Response):
    user_id = str(uuid.uuid4())
    get_or_create_user(user_id)
    response.set_cookie("user_id", user_id, max_age=60*60*24*30, httponly=True)
    return {"success": True, "user_id": user_id}

@app.get("/api/user/info")
def get_user_info(request: Request):
    user_id = get_user_id(request)
    user = get_or_create_user(user_id)
    return {"success": True, "user": user}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
