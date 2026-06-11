import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, History, Sparkles, MapPin, 
  Clock, Phone, Wrench, HelpCircle, 
  ExternalLink, Layers, GraduationCap, AlertCircle
} from 'lucide-react';
import { Booking } from './types';
import { INITIAL_BOOKINGS } from './data/mockBookings';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import SuccessTicket from './components/SuccessTicket';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const [isNewTicket, setIsNewTicket] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('itc_fablab_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (err) {
        setBookings(INITIAL_BOOKINGS);
      }
    } else {
      setBookings(INITIAL_BOOKINGS);
      localStorage.setItem('itc_fablab_bookings', JSON.stringify(INITIAL_BOOKINGS));
    }
  }, []);

  // Save to localStorage when bookings change
  const updateBookingsState = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('itc_fablab_bookings', JSON.stringify(newBookings));
  };

  // Show status toasts
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Create new booking
  const handleCreateBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    // Generate unique ID like B-XXX
    const nextNum = bookings.length > 0
      ? Math.max(...bookings.map(b => {
          const num = parseInt(b.id.split('-')[1]);
          return isNaN(num) ? 0 : num;
        })) + 1
      : 1;
    
    const formattedId = `B-${String(nextNum).padStart(3, '0')}`;

    const newBooking: Booking = {
      ...newBookingData,
      id: formattedId,
      status: 'approved', // Pre-authorise booking directly for outstanding user gratification
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    updateBookingsState(updated);
    
    // Open printable board-pass ticket modal
    setSelectedTicket(newBooking);
    setIsNewTicket(true);
    triggerToast(`จองเครื่องมือสำเร็จ คิวของคุณคือ #${formattedId}`, 'success');
  };

  // Cancel booking (change status to cancelled)
  const handleCancelBooking = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return { ...b, status: 'cancelled' as const };
      }
      return b;
    });
    updateBookingsState(updated);
    triggerToast(`ยกเลิกคิวจอง #${id} เรียบร้อยแล้ว`, 'info');
  };

  // Delete booking from database
  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    updateBookingsState(updated);
    triggerToast(`ลบข้อมูลการจอง #${id} แล้ว`, 'error');
  };

  // Reset localStorage datasets to initial mock bookings
  const handleResetMockData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลและคืนค่าระบบกลับสู่สถานะเริ่มต้นใช่หรือไม่? (การจองที่คุณสร้างขึ้นจะถูกล้างออก)')) {
      updateBookingsState(INITIAL_BOOKINGS);
      triggerToast('รีเซ็ตฐานข้อมูลการจองเรียบร้อยแล้ว', 'info');
    }
  };

  return (
    <div className="min-h-screen text-slate-100 pb-16 font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce cursor-pointer max-w-sm" onClick={() => setToast(null)}>
          <div className="p-4 rounded-2xl shadow-2xl border border-white/20 bg-slate-900/80 backdrop-blur-md flex items-center gap-3 text-white">
            <AlertCircle className={`w-5 h-5 shrink-0 ${
              toast.type === 'success' ? 'text-emerald-400' : toast.type === 'error' ? 'text-rose-400' : 'text-blue-400'
            }`} />
            <p className="text-xs font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Main Branding Header Section */}
      <header className="relative pt-12 pb-6 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl border border-white/20">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Innovative Technology Center</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight" id="main-brand-header">
                ITC FABLAB Booking Portal
              </h1>
              <p className="text-blue-200/70 text-xs md:text-sm max-w-xl leading-relaxed">
                ศูนย์แบ่งปันการเรียนรู้และสร้างสรรค์นวัตกรรมดิจิทัลสำหรับนักคิด นักประดิษฐ์ 
                รองรับกระบวนการขึ้นรูปชิ้นงาน 3D Printing, แกะสลัก Laser Cut และขึ้นโมเดลกัดระดับอุตสาหกรรม
              </p>
            </div>

            {/* Fablab Status Quick Badges */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2.5 shrink-0 max-w-sm w-full md:w-auto">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>ตึก 3 ชั้น 2 ห้องคณะเทคโนโลยีวิศวมหาลัย</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>จันทร์ - ศุกร์ | เวลา 09.00 - 16.00 น.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Line ID: <strong className="text-white font-bold select-all">@itcfablab</strong></span>
              </div>
            </div>
          </div>

          {/* Segment controls tab switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('form')}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'form' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 border border-white/20' 
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
              id="tab-btn-form"
            >
              <PlusCircle className="w-4 h-4" />
              <span>📝 สร้างคำขอจองเครื่องจักร</span>
            </button>
            
            <button
              onClick={() => setActiveTab('list')}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'list' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 border border-white/20' 
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
              id="tab-btn-list"
            >
              <History className="w-4 h-4" />
              <span>📊 คิวและสถิติการใช้งาน ({bookings.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Grid Layout */}
      <main className="max-w-4xl mx-auto px-4 mt-2 relative z-20">
        
        {/* Dynamic renders based on active tab */}
        {activeTab === 'form' ? (
          <div className="space-y-6">
            <BookingForm 
              onSuccess={handleCreateBooking} 
              existingBookings={bookings}
            />
            
            {/* Quick Informational Notice cards below form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-3xl flex gap-4 border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">การเตรียมชิ้นงานและไฟล์โมเดล</h4>
                  <p className="text-xs text-blue-200/70 mt-1.5 leading-relaxed">
                    กรุณาเซฟข้อมูลเป็นนามสกุลไฟล์สากล เช่น สำหรับ 3D Printer แนะนำเป็น .STL / .3MF, 
                    สำหรับ Laser cut แนะนำเป็น .SVG / .DXF และ CNC เป็น .GCODE บันทึกใส่ Flash drive มาแสดงขณะเข้าจุดบริการ
                  </p>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-3xl flex gap-4 border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">ข้อกำหนดการใช้งานวิจัย/วิชาเรียน</h4>
                  <p className="text-xs text-blue-200/70 mt-1.5 leading-relaxed">
                    ระบบจะทำการล็อกโควตาจองตามเวลารายบุคคลเพื่อเฉลี่ยอุปกรณ์ให้รอบด้าน 
                    หากไม่สามารถเข้ามาตามกําหนดการได้ กรุณากดยกเลิกหรือแจ้งล่วงหน้าอย่างน้อย 2 ชั่วโมงผ่านทางไลน์แอดสถานีงาน
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <BookingList 
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onDeleteBooking={handleDeleteBooking}
            onResetMockData={handleResetMockData}
            onViewTicket={(booking) => {
              setSelectedTicket(booking);
              setIsNewTicket(false);
            }}
          />
        )}

      </main>

      {/* Ticket Overlay popup Modal rendering conditionally */}
      {selectedTicket && (
        <SuccessTicket 
          booking={selectedTicket} 
          isNew={isNewTicket}
          onClose={() => {
            setSelectedTicket(null);
            setIsNewTicket(false);
          }} 
        />
      )}

      {/* Humble aesthetic footer */}
      <footer className="text-center mt-16 text-xs text-blue-200/40 max-w-md mx-auto space-y-2">
        <p>© 2026 Innovation Technology Center (ITC) FABLAB. All Rights Reserved.</p>
        <p className="text-[10px]">ระบบถูกสร้างขึ้นเพื่อบริหารการทำแล็บ วงจรฝึกงาน และโครงสร้างชิ้นงานสามมิติ</p>
      </footer>

    </div>
  );
}
