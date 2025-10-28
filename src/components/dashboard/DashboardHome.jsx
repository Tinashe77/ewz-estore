import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getDashboardOverview } from '../../services/admin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, detail, icon, color }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 transition-all hover:shadow-lg group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        {detail && <p className="text-sm text-gray-500">{detail}</p>}
      </div>
      <div className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center group-hover:${color.bgHover} transition-colors`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      setError('No authentication token available');
      setLoading(false);
    }
  }, [token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data with token:', token ? 'Token exists' : 'No token');
      const response = await getDashboardOverview(token);
      console.log('Dashboard API response:', response);
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to fetch dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency) => {
    const curr = currency || dashboardData?.summary?.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="flex gap-4">
          <button 
            onClick={fetchDashboardData} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};

  // Default values if API doesn't return data
  const defaultSummary = {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    activeProducts: 0,
    lowStockProducts: 0
  };

  const finalSummary = { ...defaultSummary, ...summary };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'Admin'} 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(finalSummary.totalRevenue, finalSummary.currency)}
          detail={`Currency: ${finalSummary.currency || 'USD'}`}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color={{bg: 'bg-blue-50', bgHover: 'bg-blue-100'}}
        />
        
        <StatCard 
          title="Total Orders" 
          value={finalSummary.totalOrders || '0'} 
          detail={`${finalSummary.pendingOrders || 0} pending`}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          } 
          color={{bg: 'bg-purple-50', bgHover: 'bg-purple-100'}} 
        />
        
        <StatCard 
          title="Total Customers" 
          value={finalSummary.totalCustomers || '0'} 
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
          color={{bg: 'bg-green-50', bgHover: 'bg-green-100'}} 
        />
        
        <StatCard 
          title="Active Products" 
          value={finalSummary.activeProducts || '0'} 
          detail={`${finalSummary.lowStockProducts || 0} low stock`}
          icon={
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          } 
          color={{bg: 'bg-orange-50', bgHover: 'bg-orange-100'}} 
        />
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
          {dashboardData?.salesByCategory ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(dashboardData.salesByCategory).map(([name, value]) => ({ name, value }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                  formatter={(value) => formatCurrency(value)} 
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>No sales data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          {dashboardData?.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.topProducts.slice(0, 5).map((product, index) => (
                <div key={product._id || product.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(product.pricing?.sellingPrice, product.pricing?.currency)}</p>
                    </div>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="text-sm font-semibold text-indigo-600">{product.salesCount || 0} sold</p>
                    <p className="text-xs text-gray-500">{product.inventory?.availableStock || 0} in stock</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>No product data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Link 
            to="/dashboard/orders" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all orders
          </Link>
        </div>
        
        {dashboardData?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Order ID</th>
                  <th scope="col" className="px-6 py-3">Customer</th>
                  <th scope="col" className="px-6 py-3">Total</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order._id || order.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.orderNumber || order._id?.substring(0, 8) || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {order.user?.email || order.customerInfo?.email || order.customer?.email || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(order.pricing?.total || order.total || 0, order.pricing?.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/dashboard/orders/${order._id || order.id}`}
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>No recent orders</p>
            </div>
          </div>
        )}
      </div>

      {/* Debug Information (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
          <details>
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Debug Information (Development Only)
            </summary>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify({ 
                hasToken: !!token, 
                hasUser: !!user, 
                hasDashboardData: !!dashboardData,
                dashboardData: dashboardData 
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;