from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker, relationship
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
import enum

# Database Configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./laptop_management.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    reported_issues = relationship("Issue", back_populates="reporter", foreign_keys="Issue.reporter_id")

class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    status = Column(String, default="Pending", nullable=False)
    reportedBy = Column(String, nullable=False)  # Changed from reported_by to reportedBy
    assignedTo = Column(String, nullable=True)    # Changed from assigned_to to assignedTo
    reporter_id = Column(String, ForeignKey("users.id"), nullable=True)
    createdAt = Column(String, nullable=False)    # Changed from created_at to createdAt
    
    reporter = relationship("User", back_populates="reported_issues", foreign_keys=[reporter_id])

class Worker(Base):
    __tablename__ = "workers"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    assignedIssues = Column(Integer, default=0)  # Changed from assigned_issues to assignedIssues

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    role: str

    class Config:
        from_attributes = True

class IssueCreate(BaseModel):
    title: str
    description: str
    brand: str
    reported_by: str

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    brand: Optional[str] = None
    status: Optional[str] = None
    assignedTo: Optional[str] = None

class IssueResponse(BaseModel):
    id: str
    title: str
    description: str
    brand: str
    status: str
    reportedBy: str
    assignedTo: Optional[str] = None
    createdAt: str

    class Config:
        from_attributes = True

class WorkerCreate(BaseModel):
    name: str

class WorkerResponse(BaseModel):
    id: str
    name: str
    assignedIssues: int

    class Config:
        from_attributes = True

# FastAPI App
app = FastAPI(title="Laptop Issue Management API", version="1.0.0")

# CORS Configuration - UPDATED for port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize sample data
def init_sample_data(db: Session):
    # Check if data already exists
    if db.query(User).first():
        return
    
    # Create sample users
    sample_users = [
        User(id='1', username='admin', password='admin123', name='Admin Manager', role='manager'),
        User(id='2', username='mike', password='mike123', name='Mike Johnson', role='worker'),
        User(id='3', username='sarah', password='sarah123', name='Sarah Davis', role='worker'),
    ]
    
    for user in sample_users:
        db.add(user)
    
    # Create sample workers
    sample_workers = [
        Worker(id='1', name='Mike Johnson', assignedIssues=2),
        Worker(id='2', name='Sarah Davis', assignedIssues=1),
        Worker(id='3', name='Tom Anderson', assignedIssues=0),
        Worker(id='4', name='Lisa Martinez', assignedIssues=0),
    ]
    
    for worker in sample_workers:
        db.add(worker)
    
    # Create sample issues
    sample_issues = [
        Issue(id='1', title='Screen flickering issue', description='Laptop screen flickers when running graphics-intensive applications', 
              brand='HP', status='Pending', reportedBy='John Doe', createdAt='2025-10-01', reporter_id='1'),
        Issue(id='2', title='Battery draining quickly', description='Battery life reduced to 2 hours from original 8 hours',
              brand='Dell', status='Resolved', reportedBy='Jane Smith', assignedTo='Mike Johnson', createdAt='2025-09-28', reporter_id='1'),
        Issue(id='3', title='Keyboard keys not working', description='Several keys (A, S, D) not responding',
              brand='Asus', status='Pending', reportedBy='Bob Wilson', createdAt='2025-10-02', reporter_id='1'),
        Issue(id='4', title='Overheating problem', description='Laptop gets extremely hot during normal usage',
              brand='HP', status='Resolved', reportedBy='Alice Brown', assignedTo='Sarah Davis', createdAt='2025-09-25', reporter_id='1'),
        Issue(id='5', title='WiFi connectivity issues', description='Cannot connect to WiFi networks consistently',
              brand='Dell', status='Pending', reportedBy='Charlie Green', assignedTo='Mike Johnson', createdAt='2025-10-03', reporter_id='2'),
        Issue(id='6', title='Touchpad not responsive', description='Touchpad freezes randomly',
              brand='Asus', status='Pending', reportedBy='David Lee', createdAt='2025-10-04', reporter_id='2'),
        Issue(id='7', title='No sound from speakers', description='Audio output not working through built-in speakers',
              brand='HP', status='Pending', reportedBy='Emma White', createdAt='2025-10-05', reporter_id='3'),
        Issue(id='8', title='Blue screen errors', description='Random BSOD errors occurring daily',
              brand='Dell', status='Pending', reportedBy='Frank Miller', createdAt='2025-10-04', reporter_id='3'),
    ]
    
    for issue in sample_issues:
        db.add(issue)
    
    db.commit()

# Initialize data on startup
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        init_sample_data(db)
    finally:
        db.close()

# Root Endpoint
@app.get("/")
def root():
    return {
        "message": "Laptop Issue Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# User Endpoints
@app.post("/api/users/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Generate new ID
    last_user = db.query(User).order_by(User.id.desc()).first()
    new_id = str(int(last_user.id) + 1) if last_user else "1"
    
    db_user = User(
        id=new_id,
        username=user.username,
        password=user.password,
        name=user.name,
        role=user.role
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/api/users/login", response_model=UserResponse)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == credentials.username,
        User.password == credentials.password
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return user

@app.get("/api/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Issue Endpoints
@app.post("/api/issues", response_model=IssueResponse)
def create_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    # Generate new ID
    last_issue = db.query(Issue).order_by(Issue.id.desc()).first()
    new_id = str(int(last_issue.id) + 1) if last_issue else "1"
    
    db_issue = Issue(
        id=new_id,
        title=issue.title,
        description=issue.description,
        brand=issue.brand,
        reportedBy=issue.reported_by,  # Map from reported_by to reportedBy
        status="Pending",
        createdAt=datetime.now().strftime('%Y-%m-%d')
    )
    
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    
    return db_issue

@app.get("/api/issues", response_model=List[IssueResponse])
def get_issues(
    status: Optional[str] = None,
    brand: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Issue)
    
    if status:
        query = query.filter(Issue.status == status)
    if brand:
        query = query.filter(Issue.brand == brand)
    
    issues = query.all()
    return issues

@app.get("/api/issues/{issue_id}", response_model=IssueResponse)
def get_issue(issue_id: str, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue

@app.put("/api/issues/{issue_id}", response_model=IssueResponse)
def update_issue(issue_id: str, issue_update: IssueUpdate, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    update_data = issue_update.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_issue, key, value)
    
    db.commit()
    db.refresh(db_issue)
    
    return db_issue

@app.put("/api/issues/{issue_id}/assign/{worker_name}")
def assign_worker(issue_id: str, worker_name: str, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db_issue.assignedTo = worker_name
    
    # Update worker's assigned issues count
    worker = db.query(Worker).filter(Worker.name == worker_name).first()
    if worker:
        worker.assignedIssues += 1
    
    db.commit()
    db.refresh(db_issue)
    
    return {"message": "Worker assigned successfully", "issue": db_issue}

@app.put("/api/issues/{issue_id}/resolve")
def resolve_issue(issue_id: str, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # Store the assigned worker name before resolving
    assigned_worker_name = db_issue.assignedTo
    
    # Mark issue as resolved
    db_issue.status = "Resolved"
    
    # Decrease the worker's assigned issues count
    if assigned_worker_name:
        worker = db.query(Worker).filter(Worker.name == assigned_worker_name).first()
        if worker and worker.assignedIssues > 0:
            worker.assignedIssues -= 1
    
    db.commit()
    db.refresh(db_issue)
    
    return {"message": "Issue resolved successfully", "issue": db_issue}

@app.delete("/api/issues/{issue_id}")
def delete_issue(issue_id: str, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db.delete(db_issue)
    db.commit()
    
    return {"message": "Issue deleted successfully"}

# Worker Endpoints
@app.get("/api/workers", response_model=List[WorkerResponse])
def get_workers(db: Session = Depends(get_db)):
    workers = db.query(Worker).all()
    return workers

@app.post("/api/workers", response_model=WorkerResponse)
def create_worker(worker: WorkerCreate, db: Session = Depends(get_db)):
    # Generate new ID
    last_worker = db.query(Worker).order_by(Worker.id.desc()).first()
    new_id = str(int(last_worker.id) + 1) if last_worker else "1"
    
    db_worker = Worker(
        id=new_id,
        name=worker.name,
        assignedIssues=0
    )
    
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    
    return db_worker

# Statistics Endpoint
@app.get("/api/statistics")
def get_statistics(db: Session = Depends(get_db)):
    total_issues = db.query(Issue).count()
    pending_issues = db.query(Issue).filter(Issue.status == "Pending").count()
    resolved_issues = db.query(Issue).filter(Issue.status == "Resolved").count()
    
    hp_issues = db.query(Issue).filter(Issue.brand == "HP").count()
    dell_issues = db.query(Issue).filter(Issue.brand == "Dell").count()
    asus_issues = db.query(Issue).filter(Issue.brand == "Asus").count()
    
    return {
        "total_issues": total_issues,
        "pending_issues": pending_issues,
        "resolved_issues": resolved_issues,
        "brand_stats": {
            "HP": hp_issues,
            "Dell": dell_issues,
            "Asus": asus_issues
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)