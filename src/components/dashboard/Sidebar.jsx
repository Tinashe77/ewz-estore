import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 mt-1 text-sm rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-primary-700 text-white shadow-md font-semibold' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-700'
    }`;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        {user && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Logged in as</p>
            <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
          </div>
        )}
      </div>
      
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <div className="space-y-1">
          <NavLink to="/dashboard" end className={navLinkClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/dashboard/orders" className={navLinkClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span>Orders</span>
          </NavLink>

          <NavLink to="/dashboard/products" className={navLinkClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span>Products</span>
          </NavLink>

          <NavLink to="/dashboard/categories" className={navLinkClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span>Categories</span>
          </NavLink>

          <NavLink to="/dashboard/users" className={navLinkClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span>Users</span>
          </NavLink>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 rounded-lg transition-all duration-200 hover:bg-red-50 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
