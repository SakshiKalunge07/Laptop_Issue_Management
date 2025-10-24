import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Issue, Brand } from '../../types/issue';

interface BrandIssuesPageProps {
  brand: Brand;
  issues: Issue[];
}

export function BrandIssuesPage({ brand, issues }: BrandIssuesPageProps) {
  const brandIssues = issues.filter(issue => issue.brand === brand);
  const pendingCount = brandIssues.filter(i => i.status === 'Pending').length;
  const resolvedCount = brandIssues.filter(i => i.status === 'Resolved').length;

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1>{brand} Issues</h1>
        <p className="text-muted-foreground">All issues related to {brand} laptops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total {brand} Issues</CardTitle>
            <CardDescription>All reported issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{brandIssues.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
            <CardDescription>Awaiting resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-600">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolved</CardTitle>
            <CardDescription>Successfully fixed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-green-600">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brandIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No {brand} issues found
                </TableCell>
              </TableRow>
            ) : (
              brandIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>#{issue.id}</TableCell>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell className="max-w-xs">{issue.description}</TableCell>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
