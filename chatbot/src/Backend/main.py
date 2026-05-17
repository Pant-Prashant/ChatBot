from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String
from sqlalchemy.orm import declarative_base, sessionmaker


class Request(BaseModel):
    name:str
    message:str

class IdPass(BaseModel):
    username:str
    password:str

chat_history={}

llm=ChatOpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="KEY",
  model="openai/gpt-oss-120b:free"
)

prompt = ChatPromptTemplate(
    [
        ("system",
         'You are a helpful AI assistant. User name: {user_name}. Keep answers short (2-3 lines). Be friendly and natural. Ask follow up questions sometimes'),
        MessagesPlaceholder(variable_name='history'),
        ('user', '{input}')
    ]
)

chain = prompt | llm

DATABASE_URL = "postgresql://postgres:password@localhost/chatbotdb"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class LoginInfoTable(Base):
    __tablename__="logininfo"
    name=Column(String, primary_key=True, unique=True)
    password=Column(String)

Base.metadata.create_all(bind=engine)

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {'message':'Welcome to the chatbot'}

@app.post("/sign-up")
def signup(signup_info:IdPass):
    db=SessionLocal()
    try:
        all_users=db.query(LoginInfoTable).all()

        for user in all_users:
            if user.name==signup_info.username:
                return {"message":"user already exists"}

        new_user=LoginInfoTable(
            name=signup_info.username,
            password=signup_info.password
        )
        db.add(new_user)
        db.commit()
        return {"message": "OK"}
    finally:
        db.close()

@app.post('/login')
def login(login_info:IdPass):
    db = SessionLocal()
    try:
        all_users = db.query(LoginInfoTable).all()

        for user in all_users:

            if user.name == login_info.username:
                if user.password == login_info.password:
                    return {"message": "OK"}
                else:
                    return {"message": "incorrect password"}

        return {"message": "user does not exists"}

    finally:
        db.close()


@app.post('/chat_request')
def chat_request(request:Request):
    user_name=request.name.lower()
    user_input=request.message

    if user_name not in chat_history:
        chat_history[user_name] = []

    try:
        reply = chain.invoke({
            'user_name' : user_name,
            'history' : chat_history[user_name],
            'input' : user_input
        })

    except Exception as e:
        return {"error": str(e)}

    chat_history[user_name].append(HumanMessage(content=user_input))
    chat_history[user_name].append(AIMessage(content=reply.content))

    return{'reply': reply.content}

def serialize(message, user):
    result=[]
    for m in message:
        if isinstance(m, AIMessage):
            role="AI"
        elif isinstance(m, HumanMessage):
            role=user
        result.append(
            {
             role:m.content}
        )
    return result

@app.get("/history/{user_name}")
def history(user_name: str):
    user=user_name.lower()
    if user not in chat_history:
        return {"error":"User does not exists."}
    return serialize(chat_history[user], user)
