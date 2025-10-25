import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Page } from '../Sidebar';
import { Issue, UserRole } from '../../types/issue';

interface IssueListPageProps {
  onNavigate: (page: Page, issueId?: string) => void;
  issues: Issue[];
  userRole: UserRole;
}

export function IssueListPage({ onNavigate, issues, userRole }: IssueListPageProps) {
  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1>All Issues</h1>
        <p className="text-muted-foreground">
          {userRole === 'manager' ? 'Manage and assign laptop issues' : 'View all laptop issues'}
        </p>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Date</TableHead>
              {userRole === 'manager' && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>#{issue.id}</TableCell>
                <TableCell>{issue.title}</TableCell>
                <TableCell>{issue.brand}</TableCell>
                <TableCell>
                  <Badge 
                    variant={issue.status === 'Resolved' ? 'default' : 'destructive'}
                    className={issue.status === 'Resolved' ? 'bg-green-600' : 'bg-red-600'}
                  >
                    {issue.status}
                  </Badge>
                </TableCell>
                <TableCell>{issue.reportedBy}</TableCell>
                <TableCell>{issue.assignedTo || '-'}</TableCell>
                <TableCell>{issue.createdAt}</TableCell>
                {userRole === 'manager' && (
                  <TableCell>
                    {issue.status === 'Pending' && !issue.assignedTo && (
                      <Button
                        size="sm"
                        onClick={() => onNavigate('assign-worker', issue.id)}
                      >
                        Assign Worker
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}