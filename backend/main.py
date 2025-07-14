from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from typing import Annotated, List

from models import Base
from database import engine, get_db
from schemas import (
    UserCreate, UserResponse, Token, TodoCreate, TodoResponse, TodoUpdate
)
from crud import (
    get_user, get_user_by_email, create_user,
    get_todos, create_user_todo, get_todo, update_todo, delete_todo
)
from auth import (
    authenticate_user, create_access_token, get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)



app = FastAPI()

# Настройки CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создание таблиц при старте
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Регистрация пользователя
@app.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Проверка совпадения паролей
    if user.password1 != user.password2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Проверка уникальности email
    db_user = await get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Проверка уникальности username
    db_user = await get_user(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    return await create_user(db=db, user=user)

# Получение токена
@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Получение текущего пользователя
@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

# CRUD операции для Todo

# Создание Todo
@app.post("/todos/", response_model=TodoResponse)
async def create_todo(
    todo: Annotated[TodoCreate, Depends()],
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await create_user_todo(db=db, todo=todo, user_id=current_user.id)

# Получение списка Todo
@app.get("/todos/", response_model=List[TodoResponse])
async def read_todos(
    skip: int = 0, limit: int = 100,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    todos = await get_todos(db, user_id=current_user.id, skip=skip, limit=limit)
    return todos

# Получение конкретного Todo
@app.get("/todos/{todo_id}", response_model=TodoResponse)
async def read_todo(
    todo_id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    db_todo = await get_todo(db, todo_id=todo_id, user_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found or you are not its owner")
    return db_todo

# Обновление Todo
@app.patch("/todos/{todo_id}", response_model=TodoResponse)
async def update_todo_item(
    todo_id: int,
    todo: Annotated[TodoUpdate, Depends()],
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    db_todo = await get_todo(db, todo_id=todo_id, user_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found or you are not its owner")
    return await update_todo(db=db, db_todo=db_todo, todo=todo)

# Удаление Todo
@app.delete("/todos/{todo_id}")
async def delete_todo_item(
    todo_id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    db_todo = await get_todo(db, todo_id=todo_id, user_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found or you are not its owner")
    await delete_todo(db=db, db_todo=db_todo)
    return {"message": "Todo deleted successfully"}