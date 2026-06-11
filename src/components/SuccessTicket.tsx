import React from 'react';
import { 
  CheckCircle, Ticket, Printer, X, Calendar, 
  Clock, ShieldAlert, Cpu, User, FileText, Share2 
} from 'lucide-react';
import { Booking } from '../types';

interface SuccessTicketProps {
  booking: Booking;
  onClose: () => void;
  isNew?: boolean;
}

export default function SuccessTicket({ booking, onClose, isNew = false }: SuccessTicketProps) {
  
  // Custom print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="ticket-modal">
      <div className="glass-panel rounded-3xl max-w-md w-full shadow-2xl border border-white/10 overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Modal Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-blue-200/80 hover:text-white border border-white/10 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable ticket block */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          
          {/* Header success indicator (only seen if newly created) */}
          {isNew && (
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">ลงทะเบียนจองเครื่องจักรเรียบร้อย!</h3>
              <p className="text-xs text-blue-200/60 mt-1">กรุณาบันทึกหรือเก็บภาพหน้าจอนี้เพื่อแสดงต่อเจ้าหน้าที่คุมระบบ</p>
            </div>
          )}

          {/* Core Visual Boarding Pass Ticket */}
          <div className="bg-slate-950/60 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg relative overflow-hidden" id="printable-ticket">
            
            {/* Top branding bar */}
            <div className="bg-blue-950/70 border-b border-white/5 text-white p-4 text-center select-none">
              <p className="text-[10px] uppercase tracking-widest font-mono font-bold text-blue-400">ITC FABLAB PASS</p>
              <h4 className="font-bold text-sm tracking-wide mt-1 font-display">บัตรคิวและข้อกำหนดการจองเครื่องมือ</h4>
            </div>

            {/* Main ticket metadata */}
            <div className="p-5 space-y-4 text-xs">
              
              {/* Ticket ID & Created date */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <span className="text-blue-200/40 block text-[9px] uppercase tracking-wider">BOOKING ID</span>
                  <span className="font-mono font-bold text-white text-sm">#{booking.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-blue-200/40 block text-[9px] uppercase tracking-wider">STATUS</span>
                  <span className={`font-bold px-2 py-0.5 rounded-sm border ${
                    booking.status === 'approved' 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
                      : booking.status === 'pending'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/20'
                  }`}>
                    {booking.status === 'approved' ? 'อนุมัติแล้ว' : booking.status === 'pending' ? 'รออนุมัติ' : 'ยกเลิกแล้ว'}
                  </span>
                </div>
              </div>

              {/* Booker Profile details */}
              <div className="space-y-2.5 border-b border-white/10 pb-3.5">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-blue-200/40 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-blue-200/40 text-[10px] block uppercase tracking-wider">ผู้จัดทำและขอใช้สิทธิ์</span>
                    <strong className="text-white font-bold block text-sm font-display">{booking.booker.fullName}</strong>
                    <span className="text-blue-200/60 text-[11px] block">{booking.booker.classLevel}</span>
                    <span className="text-blue-200/60 text-[11px] block">สาขา {booking.booker.major}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-6">
                  <span className="text-blue-200/40 font-medium">โทร:</span>
                  <span className="text-white font-mono font-bold">{booking.booker.phone}</span>
                </div>
              </div>

              {/* Equipment Selected details */}
              <div className="border-b border-dashed border-white/10 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200/40 text-[10px] font-bold uppercase tracking-wider">MACHINE STATION</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <span className="font-bold text-white">{booking.machine}</span>
                  <span className="text-[10px] text-blue-200/70 bg-white/10 px-2 py-0.5 rounded">สเตชั่นห้องปฏิบัติการ</span>
                </div>
              </div>

              {/* Date & Time details */}
              <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-blue-200/40 text-[9px] block uppercase tracking-wider">DATE / วันเข้าใช้งาน</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white text-[11px]">
                      {new Date(booking.date).toLocaleDateString('th-TH', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short',
                        year: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-blue-200/40 text-[9px] block uppercase tracking-wider">TIME / เวลาใช้งาน</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="font-bold text-white text-[11px] font-mono">{booking.startTime} - {booking.endTime} น.</span>
                  </div>
                </div>
              </div>

              {/* Course & Project details */}
              <div className="space-y-1 pb-1">
                <span className="text-blue-200/40 text-[9px] block uppercase tracking-wider">PROJECT / วิชา / โครงงานวิจัย</span>
                <div className="flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-200/40 shrink-0 mt-0.5" />
                  <span className="font-bold text-white">{booking.subjectProject}</span>
                </div>
                
                {booking.purpose && (
                  <p className="text-blue-200/60 pl-5 text-[11px] leading-relaxed">
                    <strong className="text-blue-200/40 font-normal">วัตถุประสงค์: </strong>{booking.purpose}
                  </p>
                )}
                
                {booking.materials && (
                  <p className="text-blue-200/60 pl-5 text-[11px]">
                    <strong className="text-blue-200/40 font-normal">วัสดุรองรับการทดลอง: </strong>{booking.materials}
                  </p>
                )}
              </div>

            </div>

            {/* Tear line with circular punches representing visual ticket borders */}
            <div className="relative flex items-center justify-between select-none py-2 my-1">
              <div className="w-5 h-5 rounded-full bg-[#0b0f19] border-r border-white/10 -ml-2.5 z-10"></div>
              <div className="border-t border-dashed border-white/15 w-full h-0"></div>
              <div className="w-5 h-5 rounded-full bg-[#0b0f19] border-l border-white/10 -mr-2.5 z-10"></div>
            </div>

            {/* Bottom coupon: Guidelines & Mock barcode */}
            <div className="p-5 pt-2 bg-white/5 space-y-4">
              
              {/* Safety Regulations */}
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1.5 text-[10px] text-amber-200/85 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>กฎเหล็กความปลอดภัยใน Fablab</span>
                </div>
                <ul className="list-decimal pl-3.5 space-y-0.5">
                  <li>สวมแว่นตานิรภัยและรองเท้าหุ้มส้นตลอดเวลาปฏิบัติงาน</li>
                  <li>ห้ามสวมเครื่องประดับ ผ้าพันคอ หรือปล่อยผมยาวพาดใกล้เครื่องจักร</li>
                  <li>ห้ามปรับแต่งโปรแกรม CNC หรือจุดเลเซอร์โดยไม่ได้รับการรับรอง</li>
                  <li>เตรียมถังดับเพลิง CO2 และอุปกรณ์สกัดควันเมื่อตัดไม้หนา</li>
                </ul>
              </div>

              {/* Barcode and validation check */}
              <div className="text-center space-y-1">
                {/* Fake Barcode representation using CSS elements */}
                <div className="h-10 flex items-center justify-center gap-[1.5px] select-none mx-auto w-full max-w-[200px]">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4].map((width, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white h-full opacity-80" 
                      style={{ width: `${width}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-blue-200/40 select-none tracking-widest uppercase">
                  * ITC-FLAB-{booking.id}-{booking.date.replace(/-/g, '')} *
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Action Button footer */}
        <div className="p-5 border-t border-white/10 bg-slate-950/40 flex items-center gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 border border-blue-400/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์บัตร / บันทึกภาพ</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/10 text-blue-200 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <span>ปิดหน้าต่าง</span>
          </button>
        </div>

      </div>
    </div>
  );
}
