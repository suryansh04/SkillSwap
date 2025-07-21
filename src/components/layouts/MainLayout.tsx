import { MainNav } from './MainNav';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
};

export default MainLayout;
