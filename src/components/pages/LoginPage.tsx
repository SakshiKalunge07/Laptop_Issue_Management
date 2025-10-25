import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Page } from '../Sidebar';
import { User } from '../../types/issue';
import { Alert, AlertDescription } from '../ui/alert';
import { LogIn } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLogin: (username: string, password: string) => Promise<User | null>;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const user = await onLogin(username, password);
      if (!user) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <LogIn className="h-12 w-12" />
          </div>
          <CardTitle className="text-3xl">Laptop Issue Management System</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-muted-foreground mb-2">Don't have an account?</p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('register')}
                disabled={loading}
              >
                Register New Account
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Demo credentials:
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Manager:</strong> admin / admin123
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Worker:</strong> mike / mike123
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}