from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import User, Todo
from schemas import UserCreate, TodoCreate, TodoUpdate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_user(db: AsyncSession, username: str):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalars().first()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: UserCreate):
    hashed_password = pwd_context.hash(user.password1)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_todos(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(Todo)
        .where(Todo.owner_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def create_user_todo(db: AsyncSession, todo: TodoCreate, user_id: int):
    db_todo = Todo(**todo.model_dump(), owner_id=user_id)
    db.add(db_todo)
    await db.commit()
    await db.refresh(db_todo)
    return db_todo

async def get_todo(db: AsyncSession, todo_id: int, user_id: int):
    result = await db.execute(
        select(Todo)
        .where(Todo.id == todo_id)
        .where(Todo.owner_id == user_id)
    )
    return result.scalars().first()

async def update_todo(db: AsyncSession, db_todo: Todo, todo: TodoUpdate):
    update_data = todo.model_dump(exclude_defaults=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    db.add(db_todo)
    await db.commit()
    await db.refresh(db_todo)
    return db_todo

async def delete_todo(db: AsyncSession, db_todo: Todo):
    await db.delete(db_todo)
    await db.commit()