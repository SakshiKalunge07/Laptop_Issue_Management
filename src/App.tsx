import { useState, useEffect } from 'react';
import { Sidebar, Page } from './components/Sidebar';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { HomePage } from './components/pages/HomePage';
import { AddIssuePage } from './components/pages/AddIssuePage';
import { IssueListPage } from './components/pages/IssueListPage';
import { AssignWorkerPage } from './components/pages/AssignWorkerPage';
import { WorkerPanelPage } from './components/pages/WorkerPanelPage';
import { BrandIssuesPage } from './components/pages/BrandIssuesPage';
import { Issue, Brand, User, UserRole, Worker } from './types/issue';
import { api } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load data when user logs in
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [issuesData, workersData] = await Promise.all([
        api.getIssues(),
        api.getWorkers()
      ]);
      setIssues(issuesData);
      setWorkers(workersData);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page: Page, issueId?: string) => {
    if (!currentUser && page !== 'login' && page !== 'register') {
      setCurrentPage('login');
      return;
    }
    
    if (currentUser?.role === 'worker' && page === 'add-issue') {
      return;
    }

    setCurrentPage(page);
    if (issueId) {
      setSelectedIssueId(issueId);
    }
  };

  const handleLogin = async (username: string, password: string): Promise<User | null> => {
    try {
      const user = await api.login(username, password);
      setCurrentUser(user);
      setCurrentPage('home');
      return user;
    } catch (err) {
      console.error('Login error:', err);
      return null;
    }
  };

  const handleRegister = async (newUser: { 
    username: string; 
    password: string; 
    name: string; 
    role: UserRole 
  }) => {
    try {
      await api.register(newUser);
      alert('Registration successful! Please login.');
      setCurrentPage('login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      alert(errorMessage);
      console.error('Registration error:', err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIssues([]);
    setWorkers([]);
    setCurrentPage('login');
  };

  const handleAddIssue = async (newIssue: { 
    title: string; 
    description: string; 
    brand: Brand; 
    reportedBy: string 
  }) => {
    try {
      const createdIssue = await api.createIssue({
        title: newIssue.title,
        description: newIssue.description,
        brand: newIssue.brand,
        reported_by: newIssue.reportedBy
      });
      
      setIssues([...issues, createdIssue]);
      alert('Issue created successfully!');
      setCurrentPage('issue-list');
    } catch (err) {
      console.error('Error creating issue:', err);
      throw err; // Let the page handle the error
    }
  };

  const handleAssignWorker = async (issueId: string, workerId: string) => {
    try {
      const worker = workers.find(w => w.id === workerId);
      if (!worker) return;

      const result = await api.assignWorker(issueId, worker.name);
      
      setIssues(issues.map(issue => 
        issue.id === issueId 
          ? result.issue
          : issue
      ));

      setWorkers(workers.map(w =>
        w.id === workerId
          ? { ...w, assignedIssues: w.assignedIssues + 1 }
          : w
      ));
      
      alert('Worker assigned successfully!');
      setCurrentPage('issue-list');
    } catch (err) {
      console.error('Error assigning worker:', err);
      alert('Failed to assign worker. Please try again.');
    }
  };

  const handleMarkResolved = async (issueId: string) => {
    try {
      const issue = issues.find(i => i.id === issueId);
      const assignedWorkerName = issue?.assignedTo;
      
      const result = await api.resolveIssue(issueId);
      
      setIssues(issues.map(issue =>
        issue.id === issueId
          ? result.issue
          : issue
      ));
      
      // Decrease the worker's assigned count in local state
      if (assignedWorkerName) {
        setWorkers(workers.map(worker =>
          worker.name === assignedWorkerName && worker.assignedIssues > 0
            ? { ...worker, assignedIssues: worker.assignedIssues - 1 }
            : worker
        ));
      }
      
      alert('Issue marked as resolved!');
    } catch (err) {
      console.error('Error resolving issue:', err);
      alert('Failed to mark issue as resolved. Please try again.');
    }
  };

  const selectedIssue = selectedIssueId ? issues.find(i => i.id === selectedIssueId) || null : null;

  const renderPage = () => {
    if (currentPage === 'login') {
      return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
    
    if (currentPage === 'register') {
      return <RegisterPage onNavigate={handleNavigate} onRegister={handleRegister} />;
    }

    if (!currentUser) {
      return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }

    if (loading && issues.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium">Loading...</div>
            <p className="text-muted-foreground mt-2">Please wait while we load your data</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} issues={issues} userRole={currentUser.role} />;
      case 'add-issue':
        if (currentUser.role !== 'manager') {
          return <HomePage onNavigate={handleNavigate} issues={issues} userRole={currentUser.role} />;
        }
        return <AddIssuePage onNavigate={handleNavigate} onAddIssue={handleAddIssue} />;
      case 'issue-list':
        return <IssueListPage onNavigate={handleNavigate} issues={issues} userRole={currentUser.role} />;
      case 'assign-worker':
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