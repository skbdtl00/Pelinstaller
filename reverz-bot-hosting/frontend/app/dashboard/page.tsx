'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { getAuthToken, getAuthUser, logout } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [servers, setServers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = getAuthUser();
    if (userData?.role === 'admin') {
      router.push('/admin');
      return;
    }

    setUser(userData);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const [serversData, plansData] = await Promise.all([
        ApiClient.getServers(token),
        ApiClient.getPlans(token)
      ]);

      setServers(serversData);
      setPlans(plansData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePowerAction = async (serverId: number, action: string) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await ApiClient.sendPowerAction(serverId, action, token);
      alert(`คำสั่ง ${action} ถูกส่งเรียบร้อยแล้ว`);
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleDeleteServer = async (serverId: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเซิร์ฟเวอร์นี้?')) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      await ApiClient.deleteServer(serverId, token);
      alert('ลบเซิร์ฟเวอร์เรียบร้อยแล้ว');
      loadDashboardData();
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
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              แดชบอร์ด - Reverz Bot Hosting
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                สวัสดี, {user?.username}
              </span>
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลผู้ใช้</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">ชื่อผู้ใช้</p>
              <p className="font-semibold">{user?.username}</p>
            </div>
            <div>
              <p className="text-gray-600">อีเมล</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">สถานะ</p>
              <p className="font-semibold">{user?.status === 'active' ? 'ใช้งานปกติ' : 'ถูกระงับ'}</p>
            </div>
          </div>
        </div>

        {/* Servers Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">เซิร์ฟเวอร์ของฉัน</h2>
            <button
              onClick={() => router.push('/dashboard/create-server')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + สร้างเซิร์ฟเวอร์ใหม่
            </button>
          </div>

          {servers.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              คุณยังไม่มีเซิร์ฟเวอร์ กดปุ่มด้านบนเพื่อสร้างเซิร์ฟเวอร์แรกของคุณ
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {servers.map((server) => (
                <div key={server.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{server.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>Runtime: {server.runtime}</p>
                    <p>สถานะ: {server.status === 'active' ? 'ใช้งาน' : 'ระงับ'}</p>
                    {server.plan && (
                      <p>แพลน: {server.plan.name}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePowerAction(server.id, 'start')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      เริ่ม
                    </button>
                    <button
                      onClick={() => handlePowerAction(server.id, 'restart')}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      รีสตาร์ท
                    </button>
                    <button
                      onClick={() => handlePowerAction(server.id, 'stop')}
                      className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                    >
                      หยุด
                    </button>
                    <button
                      onClick={() => handleDeleteServer(server.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plans Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">แพลนที่มีให้บริการ</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  ฿{plan.price}/เดือน
                </p>
                <ul className="space-y-1 text-sm text-gray-600 mb-4">
                  <li>CPU: {plan.cpu} vCore</li>
                  <li>RAM: {plan.ram} MB</li>
                  <li>Disk: {plan.disk} MB</li>
                  <li>Max Servers: {plan.max_servers}</li>
                </ul>
                {plan.tags && plan.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {plan.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mt-6">
          <p className="font-semibold">💡 เร็วๆ นี้</p>
          <p>ระบบเติมเงิน (Topup) และการต่ออายุแพลนจะเปิดให้บริการเร็วๆ นี้</p>
        </div>
      </div>
    </div>
  );
}
