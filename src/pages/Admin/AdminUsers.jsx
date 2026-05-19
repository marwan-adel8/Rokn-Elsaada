import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { 
  Users, 
  UserX, 
  UserCheck, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldAlert,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, active, banned

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id) => {
    const result = await Swal.fire({
      title: 'تأكيد الإجراء',
      text: 'هل أنت متأكد من تغيير حالة حظر هذا المستخدم؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B76E79',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، تأكيد',
      cancelButtonText: 'إلغاء'
    });
    
    if (!result.isConfirmed) return;

    try {
      const res = await axios.put(`/admin/users/${id}/block`);
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: res.data.isBlocked } : u));
      Swal.fire({ icon: 'success', title: 'نجاح', text: 'تم تغيير حالة المستخدم بنجاح.', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: error.response?.data?.message || 'حدث خطأ أثناء حظر/إلغاء حظر المستخدم', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
    }
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: '⚠️ تحذير: حذف المستخدم سيؤدي لحذف كل بياناته بشكل نهائي.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      Swal.fire({ icon: 'success', title: 'تم الحذف', text: 'تم حذف المستخدم نهائياً.', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: error.response?.data?.message || 'حدث خطأ أثناء الحذف', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'active') return matchesSearch && !user.isBlocked;
    if (activeFilter === 'banned') return matchesSearch && user.isBlocked;
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => !u.isBlocked).length,
    banned: users.filter(u => u.isBlocked).length
  };

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-10">
        {/* Header & Stats */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="text-right">
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-stone-800 flex items-center gap-2 sm:gap-3">
              <Users className="text-primary" size={28} />
              إدارة المستخدمين
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-stone-500 mt-1">إدارة حسابات العملاء، حظر المتجاوزين، وحذف الحسابات غير المرغوب فيها</p>
          </div>

          <div className="flex gap-3 sm:gap-4 w-full xl:w-auto">
            <div className="flex-1 xl:flex-none bg-emerald-50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-emerald-100 text-center">
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">نشط</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-700">{stats.active}</p>
            </div>
            <div className="flex-1 xl:flex-none bg-red-50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-red-100 text-center">
              <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">محظور</p>
              <p className="text-xl sm:text-2xl font-black text-red-700">{stats.banned}</p>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[24px] shadow-sm border border-stone-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text"
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-stone-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
            />
          </div>

          <div className="flex bg-stone-50 p-1 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              الكل
            </button>
            <button 
              onClick={() => setActiveFilter('active')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              نشط
            </button>
            <button 
              onClick={() => setActiveFilter('banned')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'banned' ? 'bg-white text-red-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              محظور
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-stone-400">
              <div className="w-10 h-10 border-4 border-stone-100 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold">جاري تحميل المستخدمين...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-0">
              {/* Mobile View: User Cards */}
              <div className="block sm:hidden space-y-3 p-4 bg-stone-50/30">
                {filteredUsers.map(user => (
                  <div key={user._id} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm space-y-3 text-right">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 text-xs sm:text-sm">{user.name}</p>
                          <p className="text-[9px] text-stone-400 mt-0.5">ID: {user._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${user.isBlocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {user.isBlocked ? 'محظور' : 'نشط'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2.5 border-t border-stone-50 text-[11px] text-stone-600">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-stone-300" />
                        <span className="select-all">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-stone-300" />
                        <span>{user.phone || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-400">
                        <Calendar size={12} className="text-stone-300" />
                        <span>انضم في: {new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-stone-50">
                      <button 
                        onClick={() => toggleBlock(user._id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${user.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'}`}
                      >
                        {user.isBlocked ? <UserCheck size={12} /> : <UserX size={12} />}
                        <span>{user.isBlocked ? 'تفعيل' : 'حظر'}</span>
                      </button>
                      <button 
                        onClick={() => deleteUser(user._id)}
                        className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Trash2 size={12} />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Grid Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50 border-b border-stone-100">
                      <th className="px-8 py-5 font-bold text-stone-400 text-xs uppercase">المستخدم</th>
                      <th className="px-8 py-5 font-bold text-stone-400 text-xs uppercase">التواصل</th>
                      <th className="px-8 py-5 font-bold text-stone-400 text-xs uppercase">تاريخ التسجيل</th>
                      <th className="px-8 py-5 font-bold text-stone-400 text-xs uppercase">الحالة</th>
                      <th className="px-8 py-5 font-bold text-stone-400 text-xs uppercase text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredUsers.map(user => (
                      <tr key={user._id} className="hover:bg-stone-50/50 transition-all group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-stone-800">{user.name}</p>
                              <p className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500 inline-block mt-1 font-bold">ID: {user._id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-stone-600">
                              <Mail size={14} className="text-stone-300" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-stone-600">
                              <Phone size={14} className="text-stone-300" />
                              {user.phone || '—'}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <Calendar size={14} className="text-stone-300" />
                            {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${user.isBlocked ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${user.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                            {user.isBlocked ? 'محظور' : 'نشط'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => toggleBlock(user._id)}
                              title={user.isBlocked ? 'إلغاء الحظر' : 'حظر المستخدم'}
                              className={`p-2.5 rounded-xl transition-all ${user.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'}`}
                            >
                              {user.isBlocked ? <UserCheck size={18} /> : <UserX size={18} />}
                            </button>
                            <button 
                              onClick={() => deleteUser(user._id)}
                              title="حذف نهائي"
                              className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-stone-300 space-y-4">
              <div className="bg-stone-50 p-6 rounded-full">
                <Search size={48} />
              </div>
              <p className="font-bold text-lg text-stone-400">لا يوجد مستخدمين يطابقون بحثك</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
