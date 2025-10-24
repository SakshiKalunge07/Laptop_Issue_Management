import { Home, List, Laptop, Users, Plus, LogIn, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { UserRole } from '../types/issue';

export type Page = 
  | 'login'
  | 'register'
  | 'home'
  | 'add-issue'
  | 'issue-list'
  | 'assign-worker'
  | 'worker-panel'
  | 'hp-issues'
  | 'dell-issues'
  | 'asus-issues';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: UserRole | null;
  userName: string | null;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, userRole, userName, onLogout }: SidebarProps) {
  // All navigation items
  const allNavItems = [
    { id: 'home' as Page, label: 'Home', icon: Home },
    { id: 'add-issue' as Page, label: 'Add Issue', icon: Plus, managerOnly: true },
    { id: 'issue-list' as Page, label: 'Issue List', icon: List },
    { id: 'worker-panel' as Page, label: 'Worker Panel', icon: Users },
  ];

  // Filter items based on role
  const navItems = allNavItems.filter(item => 
    !item.managerOnly || userRole === 'manager'
  );

  const brandItems = [
    { id: 'hp-issues' as Page, label: 'HP Issues', icon: Laptop },
    { id: 'dell-issues' as Page, label: 'Dell Issues', icon: Laptop },
    { id: 'asus-issues' as Page, label: 'Asus Issues', icon: Laptop },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-sidebar-foreground px-3 mb-2">Laptop Issue Manager</h2>
        {userName && (
          <div className="px-3 mt-2">
            <p className="text-sm text-muted-foreground">
              {userName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        <div className="mb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="px-3 mb-2 text-muted-foreground">Brand Filters</p>
          {brandItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {userRole && (
        <div className="pt-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
