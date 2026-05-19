import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const chartContainerRef = useRef(null);

  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const dayNames = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get(
          `/admin/stats?month=${selectedMonth}&year=${selectedYear}`,
        );
        setStats(statsRes.data);
        setRecentOrders(statsRes.data.recentOrders || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, [selectedMonth, selectedYear]);

  // التمرير لليوم الحالي عند تحميل البيانات
  useEffect(() => {
    if (chartContainerRef.current && chartData.length > 0 && stats) {
      const timer = setTimeout(() => {
        const today = new Date().getDate();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        if (selectedMonth === currentMonth && selectedYear === currentYear) {
          const container = chartContainerRef.current;
          const scrollWidth = container.scrollWidth;
          const clientWidth = container.clientWidth;
          const totalDays = chartData.length;

          // في الـ RTL، اليوم 1 يكون في أقصى اليسار واليوم 31 في أقصى اليمين (بداية السكرول)
          // نحسب موقع اليوم من اليسار
          const dayIndex = today - 1;
          const itemWidth = scrollWidth / totalDays;
          const dayPosFromLeft = dayIndex * itemWidth;

          // السكرول في الـ RTL يبدأ من 0 (اليمين) ويتجه للسالب (اليسار)
          // المسافة من اليمين = العرض الكلي - (موقع اليوم + نصف العرض ليظهر في المنتصف)
          const targetScrollFromRight =
            scrollWidth - dayPosFromLeft - clientWidth / 2;

          container.scrollTo({
            left: -targetScrollFromRight,
            behavior: "smooth",
          });
        }
      }, 800); // زيادة التوقيت لضمان رندر الشارت بالكامل
      return () => clearTimeout(timer);
    }
  }, [stats, selectedMonth, selectedYear]);

  // تجهيز بيانات الرسم البياني اليومي للشهر المختار
  const getDaysInMonth = () => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  };

  const chartData = React.useMemo(
    () =>
      Array.from({ length: getDaysInMonth() }, (_, i) => {
        const day = i + 1;
        const date = new Date(selectedYear, selectedMonth - 1, day);
        const dayName = dayNames[date.getDay()];
        const dayStats = stats?.dailySales?.find((d) => d._id.day === day);
        return {
          name: `${dayName} ${day}`, // اسم فريد لمنع تداخل البيانات في الـ Tooltip
          dayName: dayName,
          day: day,
          sales: dayStats?.sales || 0,
          orders: dayStats?.orders || 0,
        };
      }),
    [stats, selectedMonth, selectedYear],
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-primary font-headline-md">
        جاري تحميل لوحة التحكم...
      </div>
    );

  return (
    <AdminLayout>
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 sm:mb-12 gap-6 text-right">
        <div>
          <h2 className="font-headline-lg text-2xl sm:text-3xl text-stone-800">
            نظرة عامة على المتجر
          </h2>
          <p className="font-body-md text-sm sm:text-base text-stone-500 mt-1">
            مرحباً بك مجدداً، إليك ملخص أداء النظام وتحليل المبيعات
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center w-full xl:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="flex-1 sm:flex-initial bg-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl shadow-sm border border-stone-100 text-xs sm:text-sm font-bold text-stone-600 outline-none focus:ring-1 focus:ring-primary"
          >
            {monthNames.map((name, i) => (
              <option key={i} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="flex-1 sm:flex-initial bg-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl shadow-sm border border-stone-100 text-xs sm:text-sm font-bold text-stone-600 outline-none focus:ring-1 focus:ring-primary"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            onClick={() => window.location.reload()}
            className="bg-white p-2.5 sm:p-3 rounded-xl shadow-sm border border-stone-100 text-stone-600 hover:text-primary transition-all"
            title="تحديث البيانات"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">refresh</span>
          </button>
          <button className="w-full sm:w-auto bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            <span className="text-xs sm:text-sm font-bold">تصدير التقرير</span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 text-right">
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-[24px] lg:rounded-[32px] shadow-sm border border-stone-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-1.5 sm:p-2.5 lg:p-3 bg-primary/10 rounded-lg sm:rounded-xl text-primary">
              <span className="material-symbols-outlined text-base sm:text-lg lg:text-xl">
                account_balance_wallet
              </span>
            </div>
          </div>
          <p className="text-stone-500 text-[10px] sm:text-xs lg:text-sm mb-1 font-bold">
            إجمالي المبيعات (المؤكدة)
          </p>
          <h3 className="text-sm sm:text-xl lg:text-2xl font-black text-primary font-headline-md">
            {stats?.totalRevenue || 0} ج.م
          </h3>
        </div>

        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-[24px] lg:rounded-[32px] shadow-sm border border-stone-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-1.5 sm:p-2.5 lg:p-3 bg-stone-100 rounded-lg sm:rounded-xl text-stone-600">
              <span className="material-symbols-outlined text-base sm:text-lg lg:text-xl">shopping_cart</span>
            </div>
          </div>
          <p className="text-stone-500 text-[10px] sm:text-xs lg:text-sm mb-1 font-bold">
            إجمالي الطلبات
          </p>
          <h3 className="text-sm sm:text-xl lg:text-2xl font-black text-stone-800 font-headline-md">
            {stats?.totalOrders || 0} طلب
          </h3>
        </div>

        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-[24px] lg:rounded-[32px] shadow-sm border border-stone-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-1.5 sm:p-2.5 lg:p-3 bg-stone-100 rounded-lg sm:rounded-xl text-stone-600">
              <span className="material-symbols-outlined text-base sm:text-lg lg:text-xl">person</span>
            </div>
          </div>
          <p className="text-stone-500 text-[10px] sm:text-xs lg:text-sm mb-1 font-bold">المستخدمين</p>
          <h3 className="text-sm sm:text-xl lg:text-2xl font-black text-stone-800 font-headline-md">
            {stats?.totalUsers || 0}
          </h3>
        </div>

        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-[24px] lg:rounded-[32px] shadow-sm border border-stone-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-1.5 sm:p-2.5 lg:p-3 bg-orange-50 rounded-lg sm:rounded-xl text-orange-600">
              <span className="material-symbols-outlined text-base sm:text-lg lg:text-xl">
                assignment_return
              </span>
            </div>
          </div>
          <p className="text-stone-500 text-[10px] sm:text-xs lg:text-sm mb-1 font-bold">
            الطلبات المرتجعة
          </p>
          <h3 className="text-sm sm:text-xl lg:text-2xl font-black text-stone-800 font-headline-md">
            {stats?.totalReturned || 0} طلب
          </h3>
        </div>
      </div>

      {/* Charts & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 text-right">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-10 gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-800 font-headline-md">
                تحليل الإنتاجية اليومية
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold mt-1">
                عرض جميع الطلبات لشهر {monthNames[selectedMonth - 1]}
              </p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary"></span> عدد
                الطلبات
              </span>
            </div>
          </div>

          <div
            ref={chartContainerRef}
            className="h-80 w-full mt-4 overflow-x-auto no-scrollbar scroll-smooth"
          >
            <div
              style={{
                width: `${Math.max(100, (chartData.length / 7) * 100)}%`,
                minWidth: "100%",
              }}
            >
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f1f1"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={({ x, y, payload }) => {
                        const parts = payload.value.split(" ");
                        const name = parts[0];
                        const day = parts[1];
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text
                              x={0}
                              y={0}
                              dy={16}
                              textAnchor="middle"
                              fill="#a8a29e"
                              fontSize={10}
                              fontWeight="bold"
                            >
                              {name}
                            </text>
                            <text
                              x={0}
                              y={15}
                              dy={16}
                              textAnchor="middle"
                              fill="#B76E79"
                              fontSize={10}
                              fontWeight="bold"
                            >
                              {day}
                            </text>
                          </g>
                        );
                      }}
                      interval={0}
                      height={60}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#a8a29e",
                        fontSize: 11,
                        fontWeight: "600",
                      }}
                      dx={-15}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(183, 110, 121, 0.05)" }}
                      formatter={(value, name) => {
                        if (name === "عدد الطلبات")
                          return [value + " طلبات", "عدد الطلبات"];
                        return [value, name];
                      }}
                      contentStyle={{
                        borderRadius: "20px",
                        border: "none",
                        boxShadow:
                          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                        direction: "rtl",
                        padding: "15px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(8px)",
                      }}
                      itemStyle={{ fontWeight: "bold", fontSize: "13px" }}
                    />
                    <Bar
                      dataKey="orders"
                      name="عدد الطلبات"
                      fill="#e5d5d7"
                      radius={[10, 10, 0, 0]}
                      barSize={40}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.orders > 0
                              ? entry.orders ===
                                Math.max(...chartData.map((d) => d.orders))
                                ? "#B76E79"
                                : "#e5d5d7"
                              : "#f5f5f5"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 text-right flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-800 font-headline-md mb-4 sm:mb-8">
              إحصائيات سريعة
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-6">
              <div className="p-3 sm:p-6 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-100 flex flex-col justify-center">
                <p className="text-[9px] sm:text-xs font-bold text-stone-400 uppercase mb-1 sm:mb-2 leading-tight">
                  أعلى شهر مبيعات
                </p>
                <h4 className="text-sm sm:text-xl font-black text-stone-800">
                  {stats?.monthlySales?.length > 0
                    ? monthNames[
                        stats.monthlySales.reduce((prev, curr) =>
                          prev.sales > curr.sales ? prev : curr,
                        )._id.month - 1
                      ]
                    : "..."}
                </h4>
              </div>
              <div className="p-3 sm:p-6 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-100 flex flex-col justify-center">
                <p className="text-[9px] sm:text-xs font-bold text-stone-400 uppercase mb-1 sm:mb-2 leading-tight">
                  <span className="hidden sm:inline">إجمالي عدد الطلبات للشهر المختار</span>
                  <span className="sm:hidden">طلبات الشهر المختار</span>
                </p>
                <h4 className="text-sm sm:text-xl font-black text-primary font-headline-md">
                  {stats?.currentMonthOrders || 0} طلب
                </h4>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 sm:mt-10 py-3 sm:py-4 bg-stone-800 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-stone-900 transition-all text-xs sm:text-sm shadow-lg">
            تحميل التقرير التفصيلي
          </button>
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 text-right">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-stone-800 font-headline-md">
            آخر الطلبات
          </h3>
          <Link
            to="/admin/orders"
            className="text-primary font-bold text-xs sm:text-sm hover:underline"
          >
            مشاهدة الكل
          </Link>
        </div>

        {/* Mobile View: Clean & Elegant Order Cards */}
        <div className="block sm:hidden space-y-3">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-3 text-right"
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-stone-800 text-xs">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                      order.status === "delivered"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {order.status === "delivered" ? "مكتمل" : "قيد المعالجة"}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-stone-800">
                    {order.fullName || order.user?.name || "عميل"}
                  </p>
                  {order.user?.email && (
                    <p className="text-[9px] text-stone-400 mt-0.5 select-all">
                      {order.user.email}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-[10px]">
                  <span className="text-stone-500 font-bold">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                  <span className="font-black text-primary text-xs">
                    {order.finalPrice} ج.م
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-stone-400 text-xs italic">
              لا توجد طلبات حديثة حالياً
            </div>
          )}
        </div>

        {/* Desktop View: Full Grid Table */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="text-stone-400 text-[10px] uppercase tracking-widest border-b border-stone-50">
                  <th className="pb-4 font-bold text-right">رقم الطلب</th>
                  <th className="pb-4 font-bold text-right">العميل</th>
                  <th className="pb-4 font-bold text-center">التاريخ</th>
                  <th className="pb-4 font-bold text-center">المبلغ</th>
                  <th className="pb-4 font-bold text-left">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-stone-50/50 transition-all"
                    >
                      <td className="py-4 sm:py-5 font-black text-stone-800 text-xs sm:text-sm">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-4 sm:py-5">
                        <p className="text-xs sm:text-sm font-bold text-stone-800">
                          {order.fullName || order.user?.name || "عميل"}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-stone-400">
                          {order.user?.email || ""}
                        </p>
                      </td>
                      <td className="py-4 sm:py-5 text-xs sm:text-sm text-stone-500 font-bold text-center">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-4 sm:py-5 font-black text-primary text-center text-xs sm:text-sm">
                        {order.finalPrice} ج.م
                      </td>
                      <td className="py-4 sm:py-5 text-left">
                        <span
                          className={`px-3 sm:px-4 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase ${
                            order.status === "delivered"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {order.status === "delivered"
                            ? "مكتمل"
                            : "قيد المعالجة"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-20 text-center text-stone-300 italic"
                    >
                      لا توجد طلبات حديثة حالياً
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
