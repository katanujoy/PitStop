from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ChatMessage, User
from ..schemas import ChatMessageCreate, ChatMessage as ChatMessageSchema
from ..dependencies import get_current_user
from typing import List
import json

router = APIRouter(prefix="/chat", tags=["chat"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", user_id)
            await manager.broadcast(f"Client #{user_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        await manager.broadcast(f"Client #{user_id} left the chat")

@router.post("/messages/", response_model=ChatMessageSchema)
async def create_message(
    message: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_message = ChatMessage(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        request_id=message.request_id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Notify receiver via WebSocket if online
    message_json = json.dumps({
        "sender_id": db_message.sender_id,
        "content": db_message.content,
        "created_at": db_message.created_at.isoformat()
    })
    await manager.send_personal_message(message_json, db_message.receiver_id)
    
    return db_message

@router.get("/messages/{request_id}", response_model=List[ChatMessageSchema])
async def get_messages(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ChatMessage).filter(
        (ChatMessage.request_id == request_id) &
        ((ChatMessage.sender_id == current_user.id) | 
         (ChatMessage.receiver_id == current_user.id))
    ).order_by(ChatMessage.created_at.asc()).all()
