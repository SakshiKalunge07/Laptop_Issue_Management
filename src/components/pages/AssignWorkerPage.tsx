import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Page } from '../Sidebar';
import { Issue, Worker } from '../../types/issue';

interface AssignWorkerPageProps {
  onNavigate: (page: Page) => void;
  selectedIssue: Issue | null;
  workers: Worker[];
  onAssignWorker: (issueId: string, workerId: string) => Promise<void>;
}

export function AssignWorkerPage({ 
  onNavigate, 
  selectedIssue, 
  workers,
  onAssignWorker 
}: AssignWorkerPageProps) {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedIssue || !selectedWorker) {
      alert('Please select a worker');
      return;
    }

    setAssigning(true);
    try {
      await onAssignWorker(selectedIssue.id, selectedWorker);
      // Navigation handled by parent
    } catch (err) {
      console.error('Error assigning worker:', err);
    } finally {
      setAssigning(false);
    }
  };

  if (!selectedIssue) {
    return (
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1>Assign Worker</h1>
          <p className="text-muted-foreground">No issue selected</p>
        </div>
        <Button onClick={() => onNavigate('issue-list')}>Back to Issue List</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1>Assign Worker</h1>
        <p className="text-muted-foreground">Assign a worker to resolve this issue</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>Information about the issue to be assigned</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Issue ID</Label>
              <p>#{selectedIssue.id}</p>
            </div>
            <div>
              <Label>Title</Label>
              <p>{selectedIssue.title}</p>
            </div>
            <div>
              <Label>Description</Label>
              <p className="text-muted-foreground">{selectedIssue.description}</p>
            </div>
            <div>
              <Label>Brand</Label>
              <p>{selectedIssue.brand}</p>
            </div>
            <div>
              <Label>Reported By</Label>
              <p>{selectedIssue.reportedBy}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p>{selectedIssue.status}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Worker</CardTitle>
            <CardDescription>Choose a worker to assign to this issue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="worker">Available Workers</Label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker} disabled={assigning}>
                <SelectTrigger id="worker">
                  <SelectValue placeholder="Select a worker" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name} ({worker.assignedIssues} assigned)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleAssign} disabled={!selectedWorker || assigning}>
                {assigning ? 'Assigning...' : 'Assign Worker'}
              </Button>
              <Button variant="outline" onClick={() => onNavigate('issue-list')} disabled={assigning}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}