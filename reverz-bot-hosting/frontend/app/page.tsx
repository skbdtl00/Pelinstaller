'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Reverz Bot Hosting</h1>
          <p className="text-2xl mb-8">แพลตฟอร์มโฮสต์บอทที่ใช้งานง่าย ด้วยพลัง Pelican Panel</p>
          
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-semibold mb-6">คุณสมบัติหลัก</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">🎮 รองรับหลายภาษา</h3>
                <p>Node.js, Python และอื่นๆ อีกมากมาย</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">⚡ ง่ายและรวดเร็ว</h3>
                <p>สร้างเซิร์ฟเวอร์ได้ในไม่กี่คลิก</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">🔧 จัดการผ่าน Panel</h3>
                <p>ทุกฟีเจอร์ของเซิร์ฟเวอร์จัดการผ่าน Pelican Panel</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">💰 แพลนที่ยืดหยุ่น</h3>
                <p>เลือกแพลนที่เหมาะกับคุณ</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
            >
              สมัครสมาชิก
            </Link>
            <Link
              href="/login"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-400 transition"
            >
              เข้าสู่ระบบ
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-sm opacity-75">
              หมายเหตุ: ระบบเติมเงิน (Topup) จะเปิดให้บริการเร็วๆ นี้
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
