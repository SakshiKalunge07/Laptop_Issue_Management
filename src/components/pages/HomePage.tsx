import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Plus, List, Laptop } from 'lucide-react';
import { Page } from '../Sidebar';
import { Issue, UserRole } from '../../types/issue';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  issues: Issue[];
  userRole: UserRole;
}

export function HomePage({ onNavigate, issues, userRole }: HomePageProps) {
  const pendingCount = issues.filter(i => i.status === 'Pending').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;
  const hpCount = issues.filter(i => i.brand === 'HP').length;
  const dellCount = issues.filter(i => i.brand === 'Dell').length;
  const asusCount = issues.filter(i => i.brand === 'Asus').length;

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1>{userRole === 'manager' ? 'Manager Dashboard' : 'Worker Dashboard'}</h1>
        <p className="text-muted-foreground">Welcome to the Laptop Issue Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Issues</CardTitle>
            <CardDescription>All reported issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{issues.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Issues</CardTitle>
            <CardDescription>Awaiting resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-600">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolved Issues</CardTitle>
            <CardDescription>Successfully fixed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-green-600">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          {userRole === 'manager' && (
            <Button onClick={() => onNavigate('add-issue')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Issue
            </Button>
          )}
          <Button variant="outline" onClick={() => onNavigate('issue-list')}>
            <List className="mr-2 h-4 w-4" />
            View All Issues
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4">Issues by Brand</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onNavigate('hp-issues')}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <Laptop className="mr-2 h-5 w-5" />
                HP Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{hpCount}</div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onNavigate('dell-issues')}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <Laptop className="mr-2 h-5 w-5" />
                Dell Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{dellCount}</div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onNavigate('asus-issues')}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <Laptop className="mr-2 h-5 w-5" />
                Asus Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{asusCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
