import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Page } from '../Sidebar';
import { Issue } from '../../types/issue';
import { CheckCircle2 } from 'lucide-react';

interface WorkerPanelPageProps {
  onNavigate: (page: Page) => void;
  issues: Issue[];
  onMarkResolved: (issueId: string) => Promise<void>;
}

export function WorkerPanelPage({ onNavigate, issues, onMarkResolved }: WorkerPanelPageProps) {
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const assignedIssues = issues.filter(issue => issue.assignedTo);

  const handleResolve = async (issueId: string) => {
    setResolvingId(issueId);
    try {
      await onMarkResolved(issueId);
    } catch (err) {
      console.error('Error resolving issue:', err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1>Worker Panel</h1>
        <p className="text-muted-foreground">Manage assigned issues and update status</p>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No issues assigned yet
                </TableCell>
              </TableRow>
            ) : (
              assignedIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>#{issue.id}</TableCell>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{issue.description}</TableCell>
                  <TableCell>{issue.brand}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={issue.status === 'Resolved' ? 'default' : 'destructive'}
                      className={issue.status === 'Resolved' ? 'bg-green-600' : 'bg-red-600'}
                    >
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{issue.assignedTo}</TableCell>
                  <TableCell>
                    {issue.status === 'Pending' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(issue.id)}
                        disabled={resolvingId === issue.id}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {resolvingId === issue.id ? 'Resolving...' : 'Mark Resolved'}
                      </Button>
                    ) : (
                      <Badge variant="default" className="bg-green-600">
                        Completed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}