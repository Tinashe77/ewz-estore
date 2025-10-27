import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { createAdminUser } from '../../services/users';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
    shopId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createAdminUser(token, formData);

      if (response.data) {
        alert('User created successfully!');
        navigate('/dashboard/users');
      } else {
        setError(response.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Failed to create user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/dashboard/users')} className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to User List
      </button>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Admin/Staff User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="w-full px-3 py-2 border rounded-lg" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="w-full px-3 py-2 border rounded-lg" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-3 py-2 border rounded-lg" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full px-3 py-2 border rounded-lg" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full px-3 py-2 border rounded-lg" />
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
              <option value="staff">Staff</option>
              <option value="shop_manager">Shop Manager</option>
              <option value="admin">Admin</option>
            </select>
            {formData.role === 'shop_manager' && (
              <input type="text" name="shopId" value={formData.shopId} onChange={handleChange} placeholder="Shop ID" required className="w-full px-3 py-2 border rounded-lg" />
            )}
          </div>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
