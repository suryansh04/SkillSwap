import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background text-foreground">
      <Link to="/" className="fixed top-4 left-4 text-primary flex items-center gap-1">
        <ArrowLeft size={20} />
        Home
      </Link>
      {children}
    </div>
  );
};

export default AuthLayout;
