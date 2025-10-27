import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUserById, updateUserStatus, updateUserRole } from '../../services/users';

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserById(token, userId);
      if (response.data) {
        setUser(response.data);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('Failed to fetch user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    let reason = '';
    if (newStatus === 'suspended') {
      reason = prompt('Please provide a reason for suspending the user:');
      if (reason === null) return;
    }

    if (window.confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
      try {
        const response = await updateUserStatus(token, userId, newStatus, reason);
        if (response.success) {
          fetchUser();
        } else {
          alert('Failed to update status: ' + (response.message || 'Unknown error'));
        }
      } catch (err) {
        alert('Failed to update status: ' + err.message);
      }
    }
  };

  const handleRoleChange = async (newRole) => {
    if (window.confirm(`Are you sure you want to change the role to "${newRole.replace(/_/g, ' ')}"?`)) {
      try {
        const response = await updateUserRole(token, userId, newRole);
        if (response.success) {
          fetchUser();
        } else {
          alert('Failed to update role: ' + (response.message || 'Unknown error'));
        }
      } catch (err) {
        alert('Failed to update role: ' + err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status) => ({
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    deleted: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800');

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
        <button onClick={() => navigate('/dashboard/users')} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Back to Users
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <button onClick={() => navigate('/dashboard/users')} className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to User List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {user.firstName} {user.lastName}
          </h1>
          <div className="space-y-4">
            <div><span className="text-sm text-gray-600">Email:</span><p className="font-medium">{user.email}</p></div>
            <div><span className="text-sm text-gray-600">Phone:</span><p className="font-medium">{user.phone || 'N/A'}</p></div>
            {user.shopId && <div><span className="text-sm text-gray-600">Shop ID:</span><p className="font-mono text-xs">{user.shopId}</p></div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Status & Role</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Status</label>
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Role:</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium capitalize">
                  {user.role.replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Role</label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="shop_manager">Shop Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-600">User ID:</span><p className="font-mono text-xs mt-1">{user._id}</p></div>
              <div><span className="text-gray-600">Joined:</span><p className="font-medium mt-1">{formatDate(user.createdAt)}</p></div>
              <div><span className="text-gray-600">Last Updated:</span><p className="font-medium mt-1">{formatDate(user.updatedAt)}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
