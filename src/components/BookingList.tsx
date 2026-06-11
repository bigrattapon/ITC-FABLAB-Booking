import React, { useState } from 'react';
import { 
  Search, BookOpen, Clock, Calendar, Trash2, 
  Download, Loader2, RefreshCw, XCircle, CheckCircle, 
  Tag, Award, User, Phone, SlidersHorizontal, Eye
} from 'lucide-react';
import { Booking, MachineType } from '../types';

interface BookingListProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onDeleteBooking: (id: string) => void;
  onResetMockData: () => void;
  onViewTicket: (booking: Booking) => void;
}

export default function BookingList({ 
  bookings, 
  onCancelBooking, 
  onDeleteBooking, 
  onResetMockData,
  onViewTicket
}: BookingListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMachine, setFilterMachine] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Search and filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.booker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.booker.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.subjectProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.materials && b.materials.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMachine = filterMachine === 'All' || b.machine === filterMachine;
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;

    return matchesSearch && matchesMachine && matchesStatus;
  });

  // Calculate stats
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const approvedCount = bookings.filter(b => b.status === 'approved').length;
  const printerCount = bookings.filter(b => b.machine === '3D Printer' && b.status !== 'cancelled').length;
  const laserCount = bookings.filter(b => b.machine === 'Laser cut' && b.status !== 'cancelled').length;
  const cncCount = bookings.filter(b => b.machine === 'CNC' && b.status !== 'cancelled').length;

  // Custom tool to export data to CSV
  const handleExportCSV = () => {
    // UTF-8 BOM to prevent MS Excel Thai character distortion/unreadable letters
    const BOM = '\uFEFF';
    let csvContent = 'ID,ชื่อผู้จอง,เบอร์ติดต่อ,ระดับชั้น,สาขา,เครื่องมือ,วันที่จอง,เวลาเริ่มต้น,เวลาสิ้นสุด,โครงงาน/รายวิชา,วัตถุประสงค์,วัสดุที่ใช้,สถานะ,สร้างเมื่อ\n';
    
    bookings.forEach((b) => {
      const row = [
        b.id,
        `"${b.booker.fullName.replace(/"/g, '""')}"`,
        `"${b.booker.phone}"`,
        `"${b.booker.classLevel}"`,
        `"${b.booker.major}"`,
        `"${b.machine}"`,
        b.date,
        b.startTime,
        b.endTime,
        `"${b.subjectProject.replace(/"/g, '""')}"`,
        `"${b.purpose.replace(/"/g, '""')}"`,
        `"${(b.materials || '').replace(/"/g, '""')}"`,
        b.status,
        b.createdAt
      ].join(',');
      csvContent += row + '\n';
    });

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ITC_FABLAB_Bookings_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Builder
  const renderStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs">
            <CheckCircle className="w-3 h-3" />
            <span>อนุมัติแล้ว</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>รออนุมัติ</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>ยกเลิกแล้ว</span>
          </span>
        );
    }
  };

  // Machine Label Badge Builder
  const getMachineDesign = (machine: MachineType) => {
    switch (machine) {
      case '3D Printer':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: '3D Printer' };
      case 'Laser cut':
        return { bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20', text: 'Laser Cut' };
      case 'CNC':
        return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', text: 'CNC Machine' };
    }
  };

  return (
    <div className="space-y-6" id="bookings-history-dashboard">
      
      {/* Visual Statistics Dashboard (Summary Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total reservations */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl transition-all hover:border-white/20">
          <div>
            <span className="block text-xs font-bold text-blue-200/50 uppercase tracking-wider">การจองทั้งหมด</span>
            <span className="text-2xl font-black text-white mt-1.5 block font-display">{totalCount} รายการ</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: 3D Printer count */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl transition-all hover:border-white/20">
          <div>
            <span className="block text-xs font-bold text-emerald-400/80 uppercase tracking-wider font-display">จอง 3D Printer</span>
            <span className="text-2xl font-black text-white mt-1.5 block font-display">{printerCount} ครั้ง</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Laser Cut count */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl transition-all hover:border-white/20">
          <div>
            <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wider font-display">จอง Laser Cut</span>
            <span className="text-2xl font-black text-white mt-1.5 block font-display">{laserCount} ครั้ง</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: CNC count */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl transition-all hover:border-white/20">
          <div>
            <span className="block text-xs font-bold text-amber-400 uppercase tracking-wider font-display">จองเครื่อง CNC</span>
            <span className="text-2xl font-black text-white mt-1.5 block font-display">{cncCount} ครั้ง</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl shadow-2xl border border-white/20 overflow-hidden mt-6">
        {/* Controls and Search Bar Header */}
        <div className="p-6 border-b border-white/10 bg-white/5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-lg font-display">ประวัติและคิวการจองใช้อุปกรณ์</h3>
              <p className="text-xs text-blue-200/60 mt-1">ตรวจสอบกำหนดการ กรองช่วงเวลา ข้อมูลผู้ใช้ หรือพิมพ์ใบแลกบัตรเข้าใช้ห้อง</p>
            </div>
            
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={onResetMockData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white/5 border border-white/10 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                title="รีเซ็ตข้อมูลเริ่มต้น"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>รีเซ็ตระบบ</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 border border-white/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออกรายงาน CSV</span>
              </button>
            </div>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search TextBox */}
            <div className="md:col-span-6 relative rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-300/40" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นชื่อผู้จอง, สาขา, โครงงาน, หรือวัสดุ..."
                className="block w-full pl-10 pr-3 py-2.5 rounded-xl text-xs glass-input focus:outline-hidden"
              />
            </div>

            {/* Filter Equipment */}
            <div className="md:col-span-3">
              <select
                value={filterMachine}
                onChange={(e) => setFilterMachine(e.target.value)}
                className="block w-full px-3 py-2.5 rounded-xl text-xs cursor-pointer glass-input focus:outline-hidden"
              >
                <option value="All" className="glass-dropdown-option">เครื่องมือทั้งหมด (All)</option>
                <option value="3D Printer" className="glass-dropdown-option">3D Printer</option>
                <option value="Laser cut" className="glass-dropdown-option">Laser cut</option>
                <option value="CNC" className="glass-dropdown-option">CNC</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="md:col-span-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full px-3 py-2.5 rounded-xl text-xs cursor-pointer glass-input focus:outline-hidden"
              >
                <option value="All" className="glass-dropdown-option">ทุกสถานะจอง (All)</option>
                <option value="approved" className="glass-dropdown-option">อนุมัติใช้บริการแล้ว</option>
                <option value="pending" className="glass-dropdown-option">รอเจ้าหน้าที่ตรวจสอบ</option>
                <option value="cancelled" className="glass-dropdown-option">ยกเลิกแล้ว</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List Display */}
        <div className="divide-y divide-white/10 bg-slate-900/10">
          {filteredBookings.length === 0 ? (
            <div className="p-16 text-center text-blue-200/40">
              <BookOpen className="w-12 h-12 stroke-[1.2] mx-auto mb-4 text-blue-200/20" />
              <p className="text-sm font-semibold">ไม่พบข้อมูลการจองตามเงื่อนไขที่ร้องขอ</p>
              <p className="text-xs text-blue-200/30 mt-1">ลองเปลี่ยนสถานะ เปลี่ยนคำค้นหา หรือสร้างรายการจองใหม่ด้านบน</p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const design = getMachineDesign(booking.machine);
              return (
                <div 
                  key={booking.id} 
                  className={`p-6 hover:bg-white/5 transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
                    booking.status === 'cancelled' ? 'opacity-50' : ''
                  }`}
                >
                  
                  {/* Left Column: Booker details & Machinery key */}
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-white/10 text-blue-200 px-2.5 py-0.5 rounded border border-white/5 shadow-inner">
                        #{booking.id}
                      </span>
                      
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${design.bg}`}>
                        {design.text}
                      </span>

                      {renderStatusBadge(booking.status)}
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base flex flex-wrap items-center gap-x-2 font-display">
                        <span>{booking.booker.fullName}</span>
                        <span className="text-xs font-normal text-blue-200/50">| {booking.booker.classLevel} สาขา {booking.booker.major}</span>
                      </h4>
                      <p className="text-sm font-medium text-blue-100 mt-1.5">
                        โครงงาน/วิชา: <strong className="text-blue-300 font-bold">{booking.subjectProject}</strong>
                      </p>
                      
                      {booking.purpose && (
                        <p className="text-xs text-blue-200/60 mt-1 flex items-start gap-1">
                          <span>วัตถุประสงค์:</span>
                          <span className="italic">{booking.purpose}</span>
                        </p>
                      )}

                      {booking.materials && (
                        <div className="text-[11px] text-blue-200/50 mt-2 flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 w-fit">
                          <span className="font-semibold text-blue-300 uppercase tracking-tight">วัสดุ:</span>
                          <span>{booking.materials}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Date details & Controller buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t border-dashed border-white/10 lg:border-none">
                    
                    {/* Schedule block */}
                    <div className="space-y-1 text-left lg:text-right">
                      <div className="flex items-center lg:justify-end gap-1.5 text-sm font-semibold text-white">
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{new Date(booking.date).toLocaleDateString('th-TH', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>

                      <div className="flex items-center lg:justify-end gap-1.5 text-xs font-bold text-blue-200/60 font-mono">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{booking.startTime} - {booking.endTime} น.</span>
                      </div>
                    </div>

                    {/* Operational control buttons */}
                    <div className="flex items-center gap-1.5 pt-2">
                      {/* Ticket Viewer */}
                      <button
                        onClick={() => onViewTicket(booking)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-all cursor-pointer border border-blue-500/10"
                        title="ดูบัตรคิวจอง"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>บัตรคิว</span>
                      </button>

                      {/* Cancel Booking (only shown if not cancelled) */}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-all cursor-pointer border border-amber-500/10"
                          title="ยกเลิกคำขอจอง"
                        >
                          <span>ยกเลิก</span>
                        </button>
                      )}

                      {/* Hard Delete button */}
                      <button
                        onClick={() => onDeleteBooking(booking.id)}
                        className="inline-flex items-center justify-center p-2 text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer border border-rose-500/10"
                        title="ลบรายการถาวร"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
