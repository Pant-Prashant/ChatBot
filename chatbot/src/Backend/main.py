from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware



class Request(BaseModel):
    name:str
    message:str

class LoginInfo(BaseModel):
    username:str
    password:str

chat_history={}

llm=ChatOpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="ENTER YOUR API KEY",
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

@app.post('/login')
def login(logininfo:LoginInfo):


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
