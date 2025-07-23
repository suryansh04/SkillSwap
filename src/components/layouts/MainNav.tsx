import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const MainNav = ({ isLoggedIn }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm p-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">SkillSwap</Link>
        <div className="space-x-4">
          {!isLoggedIn ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
