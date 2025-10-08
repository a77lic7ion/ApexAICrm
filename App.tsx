import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, useResolvedPath, useMatch } from 'react-router-dom';
import { db, populate } from './services/db';
import { DashboardIcon, TasksIcon, StaffIcon, ProjectsIcon } from './components/icons';
import { Dashboard } from './components/Dashboard';
import { StaffManagement } from './components/StaffManagement';
import { TaskManagement } from './components/TaskManagement';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import ThemeSwitcher from './components/ThemeSwitcher';

const App: React.FC = () => {
    useEffect(() => {
        populate();
    }, []);

    return (
        <ThemeProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="tasks" element={<TaskManagement />} />
                        <Route path="staff" element={<StaffManagement />} />
                         <Route path="projects" element={
                            <div className="p-6">
                                <h1 className="text-2xl font-bold">Projects</h1>
                                <p>Projects section is under construction.</p>
                            </div>
                        } />
                    </Route>
                </Routes>
            </HashRouter>
        </ThemeProvider>
    );
};


const Layout: React.FC = () => {
    const { theme } = useTheme();
    return (
        <div className={`flex flex-col h-screen bg-[--background] text-[--text] transition-colors duration-300 ${theme}`}>
            <Navbar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

const Navbar: React.FC = () => {
    return (
        <header className="h-16 flex items-center justify-between px-6 bg-[--secondary-green] border-b border-[--border] shrink-0">
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-bold text-[--primary-green]">ApexCrmTask</h1>
                <nav className="flex items-center gap-2">
                    <NavbarLink to="/" icon={<DashboardIcon />} label="Dashboard" />
                    <NavbarLink to="/tasks" icon={<TasksIcon />} label="Tasks" />
                    <NavbarLink to="/projects" icon={<ProjectsIcon />} label="Projects" />
                    <NavbarLink to="/staff" icon={<StaffIcon />} label="Staff" />
                </nav>
            </div>
            <div className="flex items-center">
                <ThemeSwitcher />
            </div>
        </header>
    );
};

interface NavbarLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ to, icon, label }) => {
    const resolvedPath = useResolvedPath(to);
    const match = useMatch({ path: resolvedPath.pathname, end: true });

    const activeClass = "bg-[--accent-green]/30 text-[--primary-green]";
    const inactiveClass = "hover:bg-[--accent-green]/20";
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.hash = to;
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-left ${match ? activeClass : inactiveClass}`
            }
        >
            <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
            <span>{label}</span>
        </button>
    );
};


export default App;