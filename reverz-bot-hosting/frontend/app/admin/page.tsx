'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getAuthUser, logout, isAdmin } from '@/lib/auth';
import { ApiClient } from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServers: 0,
    totalPlans: 0,
    activeServers: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = getAuthUser();
    if (!userData || userData.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUser(userData);
    loadAdminData();
  }, [router]);

  const loadAdminData = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const [usersData, serversData, plansData] = await Promise.all([
        ApiClient.getUsers(token),
        ApiClient.getServers(token),
        ApiClient.getPlans(token)
      ]);

      setUsers(usersData);
      setServers(serversData);
      setPlans(plansData);

      setStats({
        totalUsers: usersData.length,
        totalServers: serversData.length,
        totalPlans: plansData.length,
        activeServers: serversData.filter((s: any) => s.status === 'active').length
      });
    } catch (err: any) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      await ApiClient.deleteUser(userId, token);
      alert('ลบผู้ใช้เรียบร้อยแล้ว');
      loadAdminData();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleSuspendUser = async (userId: number) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await ApiClient.suspendUser(userId, token);
      alert('ระงับผู้ใช้เรียบร้อยแล้ว');
      loadAdminData();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleUnsuspendUser = async (userId: number) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await ApiClient.unsuspendUser(userId, token);
      alert('ยกเลิกการระงับผู้ใช้เรียบร้อยแล้ว');
      loadAdminData();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบแพลนนี้?')) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      await ApiClient.deletePlan(planId, token);
      alert('ลบแพลนเรียบร้อยแล้ว');
      loadAdminData();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleSuspendServer = async (serverId: number) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await ApiClient.suspendServer(serverId, token);
      alert('ระงับเซิร์ฟเวอร์เรียบร้อยแล้ว');
      loadAdminData();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleUnsuspendServer = async (serverId: number) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await ApiClient.unsuspendServer(serverId, token);
      alert('ยกเลิกการระงับเซิร์ฟเวอร์เรียบร้อยแล้ว');
      loadAdminData();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              🛠️ Admin Dashboard - Reverz Bot Hosting
            </h1>
            <div className="flex items-center gap-4">
              <span>Admin: {user?.username}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">ผู้ใช้ทั้งหมด</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">เซิร์ฟเวอร์ทั้งหมด</p>
            <p className="text-3xl font-bold text-green-600">{stats.totalServers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">เซิร์ฟเวอร์ที่ใช้งาน</p>
            <p className="text-3xl font-bold text-purple-600">{stats.activeServers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">แพลนทั้งหมด</p>
            <p className="text-3xl font-bold text-orange-600">{stats.totalPlans}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              ภาพรวม
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              ผู้ใช้
            </button>
            <button
              onClick={() => setActiveTab('servers')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'servers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              เซิร์ฟเวอร์
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'plans'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              แพลน
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">ภาพรวมระบบ</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">ผู้ใช้ล่าสุด</h3>
                    <ul className="space-y-2">
                      {users.slice(0, 5).map((u) => (
                        <li key={u.id} className="text-sm">
                          {u.username} ({u.email}) - {u.role}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">เซิร์ฟเวอร์ล่าสุด</h3>
                    <ul className="space-y-2">
                      {servers.slice(0, 5).map((s) => (
                        <li key={s.id} className="text-sm">
                          {s.name} - {s.runtime} ({s.status})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">จัดการผู้ใช้</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">ชื่อผู้ใช้</th>
                        <th className="p-2 text-left">อีเมล</th>
                        <th className="p-2 text-left">บทบาท</th>
                        <th className="p-2 text-left">สถานะ</th>
                        <th className="p-2 text-left">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b">
                          <td className="p-2">{u.id}</td>
                          <td className="p-2">{u.username}</td>
                          <td className="p-2">{u.email}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              u.role === 'support' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              u.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {u.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                            </span>
                          </td>
                          <td className="p-2 space-x-2">
                            {u.status === 'active' ? (
                              <button
                                onClick={() => handleSuspendUser(u.id)}
                                className="text-orange-600 hover:underline"
                              >
                                ระงับ
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnsuspendUser(u.id)}
                                className="text-green-600 hover:underline"
                              >
                                ยกเลิกระงับ
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-600 hover:underline"
                            >
                              ลบ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Servers Tab */}
            {activeTab === 'servers' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">จัดการเซิร์ฟเวอร์</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">ชื่อ</th>
                        <th className="p-2 text-left">ผู้ใช้</th>
                        <th className="p-2 text-left">Runtime</th>
                        <th className="p-2 text-left">สถานะ</th>
                        <th className="p-2 text-left">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servers.map((s) => (
                        <tr key={s.id} className="border-b">
                          <td className="p-2">{s.id}</td>
                          <td className="p-2">{s.name}</td>
                          <td className="p-2">{s.user?.username || 'N/A'}</td>
                          <td className="p-2">{s.runtime}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              s.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {s.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                            </span>
                          </td>
                          <td className="p-2 space-x-2">
                            {s.status === 'active' ? (
                              <button
                                onClick={() => handleSuspendServer(s.id)}
                                className="text-orange-600 hover:underline"
                              >
                                ระงับ
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnsuspendServer(s.id)}
                                className="text-green-600 hover:underline"
                              >
                                ยกเลิกระงับ
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">จัดการแพลน</h2>
                  <button
                    onClick={() => router.push('/admin/create-plan')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    + สร้างแพลนใหม่
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          plan.visibility === 'public' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {plan.visibility === 'public' ? 'สาธารณะ' : 'ซ่อน'}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mb-4">
                        ฿{plan.price}/เดือน
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600 mb-4">
                        <li>CPU: {plan.cpu} vCore</li>
                        <li>RAM: {plan.ram} MB</li>
                        <li>Disk: {plan.disk} MB</li>
                        <li>Max Servers: {plan.max_servers}</li>
                      </ul>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">การดำเนินการด่วน</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/create-plan')}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700"
            >
              สร้างแพลนใหม่
            </button>
            <button
              onClick={() => router.push('/admin/config')}
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700"
            >
              ตั้งค่า API
            </button>
            <button
              onClick={() => router.push('/admin/create-user')}
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700"
            >
              สร้างผู้ใช้ใหม่
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
