import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Page } from '../Sidebar';
import { UserRole } from '../../types/issue';
import { Alert, AlertDescription } from '../ui/alert';
import { UserPlus } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: Page) => void;
  onRegister: (user: { username: string; password: string; name: string; role: UserRole }) => void;
}

export function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('manager');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword || !name) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    onRegister({ username, password, name, role });
    onNavigate('login');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <UserPlus className="h-12 w-12" />
          </div>
          <CardTitle className="text-3xl">Create New Account</CardTitle>
          <CardDescription>Register as Manager or Worker</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Select Role</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="manager" id="manager" />
                  <Label htmlFor="manager" className="flex-1 cursor-pointer">
                    <div>Manager</div>
                    <p className="text-muted-foreground">Can add issues, assign workers, and manage all tasks</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="worker" id="worker" />
                  <Label htmlFor="worker" className="flex-1 cursor-pointer">
                    <div>Worker</div>
                    <p className="text-muted-foreground">Can view and resolve assigned issues</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onNavigate('login')}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
