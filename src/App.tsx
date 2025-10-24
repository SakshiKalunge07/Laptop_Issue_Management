import { useState } from 'react';
import { Sidebar, Page } from './components/Sidebar';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { HomePage } from './components/pages/HomePage';
import { AddIssuePage } from './components/pages/AddIssuePage';
import { IssueListPage } from './components/pages/IssueListPage';
import { AssignWorkerPage } from './components/pages/AssignWorkerPage';
import { WorkerPanelPage } from './components/pages/WorkerPanelPage';
import { BrandIssuesPage } from './components/pages/BrandIssuesPage';
import { mockIssues, mockWorkers, mockUsers } from './data/mockData';
import { Issue, Brand, User, UserRole } from './types/issue';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [workers, setWorkers] = useState(mockWorkers);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const handleNavigate = (page: Page, issueId?: string) => {
    // Prevent navigation to protected pages if not logged in
    if (!currentUser && page !== 'login' && page !== 'register') {
      setCurrentPage('login');
      return;
    }
    
    // Prevent workers from accessing manager-only pages
    if (currentUser?.role === 'worker' && page === 'add-issue') {
      return;
    }

    setCurrentPage(page);
    if (issueId) {
      setSelectedIssueId(issueId);
    }
  };

  const handleLogin = (username: string, password: string): User | null => {
    const user = users.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      setCurrentUser(user);
      setCurrentPage('home');
      return user;
    }
    
    return null;
  };

  const handleRegister = (newUser: { username: string; password: string; name: string; role: UserRole }) => {
    // Check if username already exists
    const existingUser = users.find(u => u.username === newUser.username);
    if (existingUser) {
      alert('Username already exists');
      return;
    }

    const user: User = {
      id: String(users.length + 1),
      ...newUser,
    };
    
    setUsers([...users, user]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleAddIssue = (newIssue: { title: string; description: string; brand: Brand; reportedBy: string }) => {
    const issue: Issue = {
      id: String(issues.length + 1),
      ...newIssue,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setIssues([...issues, issue]);
  };

  const handleAssignWorker = (issueId: string, workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, assignedTo: worker.name }
        : issue
    ));

    setWorkers(workers.map(w =>
      w.id === workerId
        ? { ...w, assignedIssues: w.assignedIssues + 1 }
        : w
    ));
  };

  const handleMarkResolved = (issueId: string) => {
    setIssues(issues.map(issue =>
      issue.id === issueId
        ? { ...issue, status: 'Resolved' as const }
        : issue
    ));
  };

  const selectedIssue = selectedIssueId ? issues.find(i => i.id === selectedIssueId) || null : null;

  const renderPage = () => {
    // Show login/register pages without authentication
    if (currentPage === 'login') {
      return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
    
    if (currentPage === 'register') {
      return <RegisterPage onNavigate={handleNavigate} onRegister={handleRegister} />;
    }

    // All other pages require authentication
    if (!currentUser) {
      return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} issues={issues} userRole={currentUser.role} />;
      case 'add-issue':
        // Only managers can access this page
        if (currentUser.role !== 'manager') {
          return <HomePage onNavigate={handleNavigate} issues={issues} userRole={currentUser.role} />;
        }
        return <AddIssuePage onNavigate={handleNavigate} onAddIssue={handleAddIssue} />;
      case 'issue-list':
        return <IssueListPage onNavigate={handleNavigate} issues={issues} userRole={currentUser.role} />;
      case 'assign-worker':
        // Only managers can access this page
        if (currentUser.role !== 'manager') {
          return <IssueListPage onNavigate={handleNavigate} issues={issues} userRole={currentUser.role} />;
        }
        return (
          <AssignWorkerPage
            onNavigate={handleNavigate}
            selectedIssue={selectedIssue}
            workers={workers}
            onAssignWorker={handleAssignWorker}
          />
        );
      case 'worker-panel':
        return <WorkerPanelPage onNavigate={handleNavigate} issues={issues} onMarkResolved={handleMarkResolved} />;
      case 'hp-issues':
        return <BrandIssuesPage brand="HP" issues={issues} />;
      case 'dell-issues':
        return <BrandIssuesPage brand="Dell" issues={issues} />;
      case 'asus-issues':
        return <BrandIssuesPage brand="Asus" issues={issues} />;
      default:
        return <HomePage onNavigate={handleNavigate} issues={issues} userRole={currentUser.role} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {currentUser && (
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          userRole={currentUser.role}
          userName={currentUser.name}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
    </div>
  );
}
