import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Page } from '../Sidebar';
import { Brand } from '../../types/issue';

interface AddIssuePageProps {
  onNavigate: (page: Page) => void;
  onAddIssue: (issue: { title: string; description: string; brand: Brand; reportedBy: string }) => void;
}

export function AddIssuePage({ onNavigate, onAddIssue }: AddIssuePageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState<Brand>('HP');
  const [reportedBy, setReportedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIssue({ title, description, brand, reportedBy });
    onNavigate('issue-list');
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1>Add New Issue</h1>
        <p className="text-muted-foreground">Report a new laptop issue</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>Fill in the information about the laptop issue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the problem"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Laptop Brand</Label>
              <Select value={brand} onValueChange={(value) => setBrand(value as Brand)}>
                <SelectTrigger id="brand">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HP">HP</SelectItem>
                  <SelectItem value="Dell">Dell</SelectItem>
                  <SelectItem value="Asus">Asus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportedBy">Reported By</Label>
              <Input
                id="reportedBy"
                placeholder="Your name"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Submit Issue</Button>
              <Button type="button" variant="outline" onClick={() => onNavigate('home')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
