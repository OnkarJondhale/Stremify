import { Link, useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

function Sidebar({ user, sidebarElements, isCollapsed, toggleSidebar }) {
    const { pathname } = useLocation(); 

    return (

        <div
            className={`hidden sm:flex flex-col h-full text-primary border-r border-secondary
                         transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
        >

            <div className={`flex items-center h-16 border-b border-secondary
                             ${isCollapsed ? 'justify-center' : 'justify-end'} p-2`}
            >
                <div onClick={toggleSidebar} className='text-primary cursor-pointer hover:bg-secondary/60 rounded-3xl p-2'>
                    {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {sidebarElements.map((item) => (
                    <Link
                        to={item.path}
                        key={item.label}
                        title={item.label} 
                        className={`flex items-center gap-4 p-3 my-1 rounded-lg cursor-pointer hover:bg-secondary/60
                                  ${pathname === item.path ? 'border-b' : ''}`}
                    >
                        {item.icon}
                        {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                    </Link>
                ))}
            </div>

            <div className="border-t border-secondary p-2">
                <Link
                    to="/profile"
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary
                              ${pathname === '/profile' ? 'bg-info/10' : ''}`}
                >
                    <img src={user?.avatar} alt="avatar" className="size-9 rounded-full" />
                    {!isCollapsed && (
                        <div className="whitespace-nowrap overflow-hidden">
                            <p className="font-semibold text-sm">{user?.username || "User Name"}</p>
                            <p className="text-xs text-primary-400">{user?.email || "user@email.com"}</p>
                        </div>
                    )}
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;