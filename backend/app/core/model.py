from sqlalchemy import Column, String, Float, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID 
import datetime
import uuid
from app.core.database import Base

class PredictionRecord(Base):
    __tablename__ = "predictions" 

    # IDs
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    tenant_id = Column(UUID(as_uuid=True), default=uuid.uuid4) 
    user_id = Column(UUID(as_uuid=True), default=uuid.uuid4)
    
    # AI Data
    classe = Column(String(1)) 
    confidence = Column(Float)
    
    # --- NEW COLUMNS ADDED ---
    decision = Column(String) 
    image_path = Column(String, nullable=True) # It's nullable because they are currently NULL
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), default=uuid.uuid4) # Links them to a company
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_pwd = Column(String, nullable=False)
    role = Column(String(20), default="operator")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), index=True)
    type = Column(String(50))
    threshold = Column(Float)
    triggered = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)