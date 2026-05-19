import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  User as UserIcon,
  ShoppingBag,
  Truck,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ZoomIn,
  ShieldCheck,
  MoreVertical,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";

const getBackendURL = () => {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname.startsWith("192.168.");
  return isLocal 
    ? `http://${window.location.hostname}:5000` 
    : "https://rokn-elsaada-backend.vercel.app";
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/admin/orders?status=${statusFilter}`
        : "/admin/orders";
      const res = await axios.get(url);
      setOrders(res.data.orders || []);
      if (res.data.orders?.length > 0 && !selectedOrder) {
        setSelectedOrder(res.data.orders[0]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/admin/orders/${id}/status`, { status: newStatus });
      fetchOrders();
      // تحديث الطلب المختار أيضاً
      if (selectedOrder?._id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      alert("خطأ في تحديث الحالة");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
      shipped: "bg-blue-50 text-blue-700 border-blue-100",
      delivered: "bg-green-50 text-green-700 border-green-100",
      cancelled: "bg-red-50 text-red-700 border-red-100",
      returned: "bg-orange-50 text-orange-700 border-orange-100",
    };
    const labels = {
      pending: "قيد الانتظار",
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      cancelled: "ملغي",
      returned: "مرتجع",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <header className="mb-8 sm:mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="text-right">
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-stone-800 mb-2">
              إدارة الطلبات
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-stone-500">
              متابعة حالة الطلبات والتحقق من عمليات الدفع لعملاء ركن السعادة.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80">
              <input
                type="text"
                placeholder="بحث برقم الطلب (ID) أو اسم العميل..."
                className="w-full bg-white border border-stone-200 rounded-xl pr-12 pl-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
                size={18}
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm font-bold text-stone-600 outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-10 text-right"
              >
                <option value="">كل الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
                <option value="returned">مرتجع</option>
                <option value="cancelled">ملغي</option>
              </select>
              <Filter
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders Table Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Mobile View: Order Cards */}
            <div className="block sm:hidden space-y-3">
              {loading ? (
                <div className="bg-white py-12 rounded-2xl text-center text-stone-400 border border-stone-100 text-xs italic animate-pulse">
                  جاري تحميل الطلبات...
                </div>
              ) : orders.length > 0 ? (
                orders
                  .filter((o) => {
                    const s = searchTerm.toLowerCase();
                    return (
                      o._id.toLowerCase().includes(s) ||
                      o._id.slice(-6).toLowerCase().includes(s) ||
                      (o.fullName && o.fullName.toLowerCase().includes(s)) ||
                      (o.user?.name && o.user.name.toLowerCase().includes(s))
                    );
                  })
                  .map((order) => (
                    <div
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-white p-4 rounded-xl border transition-all text-right shadow-sm space-y-3 cursor-pointer ${selectedOrder?._id === order._id ? "border-primary ring-2 ring-primary/10" : "border-stone-100"}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary text-xs uppercase">
                          #{order._id.slice(-6)}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-primary">
                          {(order.fullName || order.user?.name || "ع")[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-stone-700">
                            {order.fullName || order.user?.name || "عميل مجهول"}
                          </p>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-stone-50 text-xs">
                        <div>
                          <span className="text-stone-400 font-bold ml-1">
                            المجموع:
                          </span>
                          <span className="font-black text-stone-800">
                            {order.finalPrice} جنيه
                          </span>
                        </div>
                        <span className="text-primary font-bold flex items-center gap-1">
                          تفاصيل <Eye size={14} />
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="bg-white py-12 rounded-2xl text-center text-stone-400 border border-stone-100 text-xs italic">
                  لا توجد طلبات حالياً
                </div>
              )}
            </div>

            {/* Desktop View: Full Table */}
            <div className="hidden sm:block bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100">
                    <th className="px-6 py-5 font-bold text-stone-400 text-sm">
                      رقم الطلب
                    </th>
                    <th className="px-6 py-5 font-bold text-stone-400 text-sm">
                      العميل
                    </th>
                    <th className="px-6 py-5 font-bold text-stone-400 text-sm">
                      التاريخ
                    </th>
                    <th className="px-6 py-5 font-bold text-stone-400 text-sm">
                      الإجمالي
                    </th>
                    <th className="px-6 py-5 font-bold text-stone-400 text-sm">
                      الحالة
                    </th>
                    <th className="px-6 py-5 font-bold text-stone-400 text-sm text-center">
                      عرض
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-20 text-center text-stone-400"
                      >
                        جاري تحميل الطلبات...
                      </td>
                    </tr>
                  ) : orders.length > 0 ? (
                    orders
                      .filter((o) => {
                        const s = searchTerm.toLowerCase();
                        return (
                          o._id.toLowerCase().includes(s) ||
                          o._id.slice(-6).toLowerCase().includes(s) ||
                          (o.fullName &&
                            o.fullName.toLowerCase().includes(s)) ||
                          (o.user?.name &&
                            o.user.name.toLowerCase().includes(s))
                        );
                      })
                      .map((order) => (
                        <tr
                          key={order._id}
                          onClick={() => setSelectedOrder(order)}
                          className={`hover:bg-primary/5 cursor-pointer transition-all ${selectedOrder?._id === order._id ? "bg-primary/5" : ""}`}
                        >
                          <td className="px-6 py-4 font-bold text-primary text-sm uppercase">
                            #{order._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-primary">
                                {(order.fullName || order.user?.name || "ع")[0]}
                              </div>
                              <span className="font-bold text-sm text-stone-700">
                                {order.fullName ||
                                  order.user?.name ||
                                  "عميل مجهول"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-stone-500 font-bold">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 font-bold text-stone-800">
                            {order.finalPrice} جنيه
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="p-2 text-stone-300 hover:text-primary transition-colors">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-20 text-center text-stone-400"
                      >
                        لا توجد طلبات حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Sidebar Area */}
          <aside className="space-y-8">
            {selectedOrder ? (
              <div className="bg-white rounded-[40px] shadow-2xl border border-[#eddec5] overflow-hidden sticky top-24">
                <div className="p-8 bg-[#f5ece7]/50 border-b border-[#eddec5]">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      طلب رقم #{selectedOrder._id.slice(-8)}
                    </span>
                    <button className="text-stone-400 hover:text-stone-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-800">
                    {selectedOrder.fullName || selectedOrder.user?.name}
                  </h2>
                  <p className="text-stone-500 text-sm font-bold flex items-center gap-2 mt-2">
                    <Phone size={14} />
                    {selectedOrder.phone}
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Payment Proof for Vodafone Cash/InstaPay */}
                  {(selectedOrder.paymentMethod === "vodafone_cash" ||
                    selectedOrder.paymentMethod === "instapay") && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-stone-800 flex items-center gap-2">
                          <ShieldCheck className="text-primary" size={18} />
                          إثبات الدفع (
                          {selectedOrder.paymentMethod === "vodafone_cash"
                            ? "فودافون كاش"
                            : "انستا باي"}
                          )
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedOrder.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                        >
                          {selectedOrder.isPaid ? "مؤكد" : "غير مؤكد"}
                        </span>
                      </div>

                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group relative shadow-inner">
                        {selectedOrder.paymentProof ? (
                          <>
                            <img
                              src={
                                selectedOrder.paymentProof.startsWith("http")
                                  ? selectedOrder.paymentProof
                                  : `${getBackendURL()}/${selectedOrder.paymentProof.replace(/\\/g, "/")}`
                              }
                              alt="إثبات الدفع"
                              className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-pointer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a
                                href={
                                  selectedOrder.paymentProof.startsWith("http")
                                    ? selectedOrder.paymentProof
                                    : `${getBackendURL()}/${selectedOrder.paymentProof.replace(/\\/g, "/")}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white p-3 rounded-full text-primary shadow-xl"
                              >
                                <ZoomIn size={20} />
                              </a>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                            <XCircle size={40} />
                            <p className="text-xs mt-2 font-bold">
                              لا توجد صورة إثبات
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-800 flex items-center gap-2">
                      <ShoppingBag className="text-primary" size={18} />
                      محتويات الطلب
                    </h3>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedOrder.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl"
                        >
                          <img
                            src={item.image}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 text-right">
                            <p className="text-xs font-bold text-stone-700 line-clamp-1">
                              {item.name}
                            </p>
                            {item.size && (
                              <span className="inline-block px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded-full mb-0.5">
                                المقاس: {item.size}
                              </span>
                            )}
                            <p className="text-[10px] text-stone-400">
                              {item.quantity} × {item.price} جنيه
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-stone-50 p-6 rounded-3xl space-y-3 border border-stone-100">
                    <div className="flex items-center gap-2 text-stone-400 mb-2">
                      <MapPin size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        عنوان الشحن
                      </span>
                    </div>
                    <p className="text-sm font-bold text-stone-700 leading-relaxed">
                      {selectedOrder.shippingAddress}
                    </p>
                  </div>

                  {/* Summary and Actions */}
                  <div className="pt-6 border-t border-stone-100 space-y-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-stone-400">الإجمالي:</span>
                      <span className="text-primary">
                        {selectedOrder.finalPrice} جنيه
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) =>
                          handleUpdateStatus(selectedOrder._id, e.target.value)
                        }
                        className="col-span-2 w-full bg-stone-900 text-white rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-primary/50 text-center appearance-none cursor-pointer"
                      >
                        <option value="pending">
                          تغيير الحالة: قيد الانتظار
                        </option>
                        <option value="shipped">تغيير الحالة: تم الشحن</option>
                        <option value="delivered">
                          تغيير الحالة: تم التوصيل
                        </option>
                        <option value="returned">تغيير الحالة: مرتجع</option>
                        <option value="cancelled">
                          تغيير الحالة: إلغاء الطلب
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-12 text-center border-2 border-dashed border-stone-100 text-stone-400">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold text-sm">
                  اختر طلباً من الجدول لعرض تفاصيله بالكامل هنا
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-stone-900 text-white rounded-[32px] p-8 shadow-xl">
              <h3 className="font-bold text-lg mb-6">ملخص اليوم</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-400 text-sm">
                    بانتظار المراجعة
                  </span>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    {orders.filter((o) => o.status === "pending").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400 text-sm">تم الشحن</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                    {orders.filter((o) => o.status === "shipped").length}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-800">
                  <span className="text-stone-100 text-sm font-bold">
                    إجمالي المبيعات
                  </span>
                  <span className="text-primary font-bold">
                    {orders.reduce((acc, curr) => acc + curr.finalPrice, 0)}{" "}
                    جنيه
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8a4853; border-radius: 10px; }
      `,
        }}
      />
    </AdminLayout>
  );
};

export default AdminOrders;
