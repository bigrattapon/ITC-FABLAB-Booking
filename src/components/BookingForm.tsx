import React, { useState, useEffect } from 'react';
import { 
  User, Phone, GraduationCap, BookOpen, Calendar, Clock, 
  Cpu, Check, AlertTriangle, ChevronRight, ChevronLeft, 
  Sparkles, Layers, Wrench, HelpCircle
} from 'lucide-react';
import { BookerInfo, MachineType, Booking } from '../types';
import { MACHINES } from '../data/mockBookings';

interface BookingFormProps {
  onSuccess: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  existingBookings: Booking[];
}

export default function BookingForm({ onSuccess, existingBookings }: BookingFormProps) {
  const [step, setStep] = useState<number>(1);
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [customClassLevel, setCustomClassLevel] = useState('');
  const [major, setMajor] = useState('');
  const [customMajor, setCustomMajor] = useState('');
  
  const [selectedMachine, setSelectedMachine] = useState<MachineType>('3D Printer');
  
  // Date and Time States
  // Default to today or next weekday
  const getInitialDateStr = () => {
    const today = new Date();
    // if weekend, push to next Monday
    const day = today.getDay();
    if (day === 0) today.setDate(today.getDate() + 1); // Sunday -> Monday
    else if (day === 6) today.setDate(today.getDate() + 2); // Saturday -> Monday
    
    return today.toISOString().split('T')[0];
  };
  
  const [bookingDate, setBookingDate] = useState(getInitialDateStr());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  
  // Project detail states
  const [subjectProject, setSubjectProject] = useState('');
  const [purpose, setPurpose] = useState('');
  const [materials, setMaterials] = useState('');
  
  // Validation error state
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string | null>(null);

  // Class and Major Preset Options
  const CLASS_OPTIONS = [
    'มัธยมศึกษาตอนต้น (ม.1 - ม.3)',
    'มัธยมศึกษาตอนปลาย (ม.4 - ม.6)',
    'ปวช. (ประกาศนียบัตรวิชาชีพ)',
    'ปวส. (ประกาศนียบัตรวิชาชีพชั้นสูง)',
    'ปริญญาตรี',
    'บุคลากร / อาจารย์',
    'อื่นๆ (ระบุเอง)'
  ];

  const MAJOR_OPTIONS = [
    'เทคโนโลยีคอมพิวเตอร์ / เทคโนโลยีสารสนเทศ',
    'ไฟฟ้าและอิเล็กทรอนิกส์',
    'วิศวกรรมเครื่องกล / เมคาทรอนิกส์',
    'วิศวกรรมโยธา / สถาปัตยกรรม',
    'ออกแบบผลิตภัณฑ์ / ศิลปประยุกต์',
    'วิทยาศาสตร์และเทคโนโลยี',
    'ทั่วไป / อื่นๆ'
  ];

  // Helper values for times
  const START_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  const END_TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // Clear errors when changing steps or values
  useEffect(() => {
    setError(null);
  }, [step, fullName, phone, classLevel, customClassLevel, major, customMajor, selectedMachine, bookingDate, startTime, endTime, subjectProject]);

  // Handle slot conflict checks
  useEffect(() => {
    setWarnings(null);
    if (!bookingDate) return;

    // Check if the date is a weekend (0 = Sunday, 6 = Saturday)
    const dateObj = new Date(bookingDate);
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setWarnings('⚠️ FABLAB ปิดให้บริการในวันเสาร์-อาทิตย์ กรุณาเลือกวันจันทร์-ศุกร์');
      return;
    }

    // Check conflict
    const conflicts = existingBookings.filter(b => {
      if (b.status === 'cancelled') return false;
      if (b.machine !== selectedMachine) return false;
      if (b.date !== bookingDate) return false;

      // Overlap calculation: Max(start1, start2) < Min(end1, end2)
      const s1 = parseFloat(startTime.replace(':', '.'));
      const e1 = parseFloat(endTime.replace(':', '.'));
      const s2 = parseFloat(b.startTime.replace(':', '.'));
      const e2 = parseFloat(b.endTime.replace(':', '.'));

      return Math.max(s1, s2) < Math.min(e1, e2);
    });

    if (conflicts.length > 0) {
      const names = conflicts.map(c => c.booker.fullName).join(', ');
      setWarnings(`⚠️ ช่วงเวลานี้มีการจองเครื่องนี้แล้วโดย คุณ ${names} (แนะนำให้เลือกวันอื่นหรือปรับช่วงเวลาเพื่อหลีกเลี่ยงคิวซ้อนกัน)`);
    }
  }, [bookingDate, startTime, endTime, selectedMachine, existingBookings]);

  const handleNextStep = () => {
    if (step === 1) {
      // Validate Booker Info
      if (!fullName.trim()) {
        setError('กรุณากรอกชื่อ - นามสกุล');
        return;
      }
      if (!phone.trim()) {
        setError('กรุณากรอกเบอร์โทรติดต่อ');
        return;
      }
      const cleanPhone = phone.replace(/[- ]/g, '');
      if (!/^\d{9,10}$/.test(cleanPhone)) {
        setError('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (ตัวเลข 9-10 หลัก)');
        return;
      }
      if (!classLevel) {
        setError('กรุณาเลือกระดับชั้น');
        return;
      }
      if (classLevel === 'อื่นๆ (ระบุเอง)' && !customClassLevel.trim()) {
        setError('กรุณาระบุระดับชั้นของคุณ');
        return;
      }
      if (!major) {
        setError('กรุณาเลือกสาขา/แผนกวิชา');
        return;
      }
      if (major === 'ทั่วไป / อื่นๆ' && !customMajor.trim()) {
        setError('กรุณาระบุสาขาของคุณ');
        return;
      }
    } else if (step === 2) {
      // Machine selection validated by state default
      if (!selectedMachine) {
        setError('กรุณาเลือกเครื่องจักรอุปกรณ์');
        return;
      }
    } else if (step === 3) {
      // Validate date and time
      if (!bookingDate) {
        setError('กรุณาเลือกวันที่ต้องการจอง');
        return;
      }

      // Check if selected date is in the weekend
      const selectedDay = new Date(bookingDate).getDay();
      if (selectedDay === 0 || selectedDay === 6) {
        setError('ขออภัย! FABLAB ปิดให้บริการวันเสาร์-อาทิตย์ กรุณาเลือกวันจันทร์-ศุกร์ เท่านั้น');
        return;
      }

      const sHour = parseInt(startTime.split(':')[0]);
      const eHour = parseInt(endTime.split(':')[0]);

      if (eHour <= sHour) {
        setError('เวลาสิ้นสุดการใช้งานต้องมากกว่าเวลาเริ่มต้น');
        return;
      }

      // Prevent reservations in the past
      const todayStr = new Date().toISOString().split('T')[0];
      if (bookingDate < todayStr) {
        setError('ไม่สามารถจองวันย้อนหลังได้ กรุณาเลือกวันที่ปัจจุบันหรืออนาคต');
        return;
      }
    } else if (step === 4) {
      // Validate subject/project
      if (!subjectProject.trim()) {
        setError('กรุณากรอกข้อมูล รายวิชา / โครงงาน');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check
    if (!subjectProject.trim()) {
      setError('กรุณากรอกข้อมูล รายวิชา / โครงงาน');
      return;
    }

    const finalClassLevel = classLevel === 'อื่นๆ (ระบุเอง)' ? customClassLevel : classLevel;
    const finalMajor = major === 'ทั่วไป / อื่นๆ' ? customMajor : major;

    const bookingPayload = {
      booker: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        classLevel: finalClassLevel.trim(),
        major: finalMajor.trim()
      },
      machine: selectedMachine,
      date: bookingDate,
      startTime,
      endTime,
      subjectProject: subjectProject.trim(),
      purpose: purpose.trim() || 'ใช้งานประดิษฐ์และทดสอบเพื่อวิชาเรียน/โครงงาน',
      materials: materials.trim() || 'วัสดุตนเอง'
    };

    onSuccess(bookingPayload);
    
    // Reset wizard variables but keep booker details for easy next booking
    setStep(1);
    setSubjectProject('');
    setPurpose('');
    setMaterials('');
  };

  const activeMachineData = MACHINES.find(m => m.id === selectedMachine);

  return (
    <div className="glass-panel overflow-hidden rounded-3xl border border-white/20 shadow-2xl" id="booking-container-form">
      {/* High-tech cyan/blue progress highlight line */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 shadow-lg"></div>
      
      <div className="p-6 md:p-8 border-b border-white/10 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3" />
              <span>ITC FABLAB Reservation System</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display animate-fade-in" id="form-title">
              จองใช้งานเครื่องมือ ITC FABLAB
            </h1>
            <p className="text-blue-200/70 text-xs md:text-sm mt-1 leading-relaxed">
              แบบฟอร์มขอใช้บริการเครื่องจักร Fablab สำหรับสถาบันนวัตกรรมและเทคโนโลยี
            </p>
          </div>
          
          {/* Visual Step Progress */}
          <div className="flex items-center gap-2 self-start md:self-center">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step === num 
                      ? 'bg-blue-500 text-white ring-4 ring-blue-500/30' 
                      : step > num 
                        ? 'bg-emerald-500 text-white shadow-md' 
                        : 'bg-white/10 text-blue-200/40'
                  }`}
                >
                  {step > num ? <Check className="w-4 h-4" /> : num}
                </div>
                {num < 4 && (
                  <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${step > num ? 'bg-emerald-400/80' : 'bg-white/10'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        
        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 rounded-2xl flex items-start gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">ตรวจสอบข้อมูล:</span> {error}
            </div>
          </div>
        )}

        {/* Warnings / Conflicts notification banner */}
        {warnings && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="text-sm font-medium">
              {warnings}
            </div>
          </div>
        )}

        {/* ================= STEP 1: BOOKER INFO ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                <User className="w-5 h-5 text-blue-400" />
                <span>ขั้นตอนที่ 1: ข้อมูลผู้จองประกอบการใช้งาน</span>
              </h2>
              <p className="text-xs text-blue-200/50 mt-1">กรุณากรอกข้อมูลส่วนตัวเพื่อยืนยันตัวตนสำหรับใช้บริการเครื่องจักรในคลาสเรียน</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-100">
                  ชื่อ - นามสกุล <span className="text-rose-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-300/40" />
                  </div>
                  <input
                    type="text"
                    required
                    id="input-fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="เช่น สมชาย สายเทคโนโลยี"
                    className="block w-full pl-10 pr-3 py-3 rounded-xl focus:outline-hidden text-sm glass-input"
                  />
                </div>
              </div>

              {/* Phone Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-100">
                  เบอร์โทรติดต่อ <span className="text-rose-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-blue-300/40" />
                  </div>
                  <input
                    type="tel"
                    required
                    id="input-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="เช่น 0812345678"
                    className="block w-full pl-10 pr-3 py-3 rounded-xl focus:outline-hidden text-sm glass-input"
                  />
                </div>
              </div>

              {/* Class Level Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-100">
                  ระดับชั้น <span className="text-rose-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-blue-300/40" />
                  </div>
                  <select
                    id="select-classlevel"
                    value={classLevel}
                    onChange={(e) => {
                       setClassLevel(e.target.value);
                       if (e.target.value !== 'อื่นๆ (ระบุเอง)') {
                         setCustomClassLevel('');
                       }
                    }}
                    className="block w-full pl-10 pr-10 py-3 rounded-xl focus:outline-hidden text-sm appearance-none cursor-pointer glass-input"
                  >
                    <option value="" className="glass-dropdown-option">-- เลือกระดับชั้น --</option>
                    {CLASS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="glass-dropdown-option">{opt}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-blue-200/40">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                
                {/* Custom class input nested */}
                {classLevel === 'อื่นๆ (ระบุเอง)' && (
                  <input
                    type="text"
                    required
                    value={customClassLevel}
                    onChange={(e) => setCustomClassLevel(e.target.value)}
                    placeholder="กรุณาระบุระดับชั้นวิชาเรียนของคุณ"
                    className="block w-full mt-2 p-3 rounded-xl focus:outline-hidden text-sm glass-input animate-fade-in"
                  />
                )}
              </div>

              {/* Major / Department */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-100">
                  สาขา / ภาควิชา <span className="text-rose-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-blue-300/40" />
                  </div>
                  <select
                    id="select-major"
                    value={major}
                    onChange={(e) => {
                       setMajor(e.target.value);
                       if (e.target.value !== 'ทั่วไป / อื่นๆ') {
                         setCustomMajor('');
                       }
                    }}
                    className="block w-full pl-10 pr-10 py-3 rounded-xl focus:outline-hidden text-sm appearance-none cursor-pointer glass-input"
                  >
                    <option value="" className="glass-dropdown-option">-- เลือกสาขาวิชา --</option>
                    {MAJOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="glass-dropdown-option">{opt}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-blue-200/40">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Custom major input nested */}
                {major === 'ทั่วไป / อื่นๆ' && (
                  <input
                    type="text"
                    required
                    value={customMajor}
                    onChange={(e) => setCustomMajor(e.target.value)}
                    placeholder="กรุณาระบุชื่อสาขา/คณะของคุณ"
                    className="block w-full mt-2 p-3 rounded-xl focus:outline-hidden text-sm glass-input animate-fade-in"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: MACHINE SELECT ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                <Cpu className="w-5 h-5 text-blue-400" />
                <span>ขั้นตอนที่ 2: เลือกเครื่องจักรและอุปกรณ์ใน Fablab</span>
              </h2>
              <p className="text-xs text-blue-200/50 mt-1">เลือกเครื่องมือไฮเทคที่ต้องการใช้งานสำหรับการพัฒนาโครงงานของคุณ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MACHINES.map((machine) => {
                const isSelected = selectedMachine === machine.id;
                return (
                  <button
                    key={machine.id}
                    type="button"
                    onClick={() => setSelectedMachine(machine.id)}
                    className={`text-left rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer relative flex flex-col justify-between h-full ${
                      isSelected 
                        ? 'border-blue-400 bg-blue-500/15 shadow-xl shadow-blue-500/10 ring-1 ring-white/15' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Checkmark indicator */}
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-blue-500 text-white scale-100 ring-2 ring-white/20 shadow-md' : 'bg-white/10 text-white/10 scale-90'
                    }`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    <div>
                      {/* Icons based on Machine */}
                      <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center font-bold transition-colors ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-300'
                      }`}>
                        {machine.id === '3D Printer' && <Layers className="w-6 h-6" />}
                        {machine.id === 'Laser cut' && <Cpu className="w-6 h-6" />}
                        {machine.id === 'CNC' && <Wrench className="w-6 h-6" />}
                      </div>

                      <h3 className="font-bold text-white text-lg leading-tight flex items-baseline gap-1.5 font-display">
                        {machine.id}
                        <span className="text-xs font-normal text-blue-200/50">({machine.thaiName})</span>
                      </h3>
                      
                      <p className="text-blue-200/70 text-xs mt-2.5 line-clamp-2">
                        {machine.thaiDescription}
                      </p>
                    </div>

                    {/* Badge details */}
                    <div className="mt-5 pt-3 border-t border-white/10 w-full flex items-center justify-between text-xs text-blue-200/40">
                      <span>โควตาจองสูงสุด</span>
                      <span className="font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                        {machine.maxDailyHours} ชม. / วัน
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Spec details of the selected machine */}
            {activeMachineData && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mt-6 animate-fade-in text-white shadow-inner">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300/40 mb-2">Specifications</h4>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <h5 className="font-bold text-white text-sm">{activeMachineData.name} ({activeMachineData.thaiName})</h5>
                  <span className="text-xs text-sky-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full font-medium">อุปกรณ์ผ่านการสอบเทียบ / พร้อมใช้งาน</span>
                </div>
                <ul className="text-xs text-blue-200/80 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {activeMachineData.specs.map((spec, idx) => (
                    <li key={idx} className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-xs"></span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: DATE & TIME ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>ขั้นตอนที่ 3: กำหนด วัน - เวลา จองใช้เครื่องมือ</span>
              </h2>
              <p className="text-xs text-blue-200/50 mt-1">เลือกวันที่ต้องการเข้ารับบริการ (อนุญาตเฉพาะวันจันทร์ - วันศุกร์ เวลา 09.00 - 16.00 น.)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-100 flex justify-between items-center">
                  <span>เลือกวันใช้บริการ (จันทร์ - ศุกร์) <span className="text-rose-400">*</span></span>
                  <span className="text-xs text-blue-200/60 bg-white/10 border border-white/5 px-2 py-0.5 rounded-md">หยุดเสาร์-อาทิตย์</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-blue-300/40" />
                  </div>
                  <input
                    type="date"
                    required
                    id="input-date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 rounded-xl focus:outline-hidden text-sm appearance-none cursor-pointer glass-input"
                  />
                </div>
                
                {/* Micro calendar note */}
                <p className="text-[11px] text-blue-200/45">
                  * กรุณาจองล่วงหน้าอย่างน้อย 1 วัน เพื่อจัดเตรียมวัสดุและอุปกรณ์ความปลอดภัยประจําสถานี
                </p>
              </div>

              {/* Time Sliders */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Start time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-100">
                      ระบุเวลาเริ่มต้น (Start) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-blue-300/40" />
                      </div>
                      <select
                        id="select-starttime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 rounded-xl focus:outline-hidden text-sm appearance-none cursor-pointer glass-input"
                      >
                        {START_TIMES.map((time) => (
                          <option key={time} value={time} className="glass-dropdown-option">{time} น.</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-blue-200/40">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* End time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-100">
                      ระบุเวลาสิ้นสุด (End) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-blue-300/40" />
                      </div>
                      <select
                        id="select-endtime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 rounded-xl focus:outline-hidden text-sm appearance-none cursor-pointer glass-input"
                      >
                        {END_TIMES.map((time) => (
                          <option key={time} value={time} className="glass-dropdown-option">{time} น.</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-blue-200/40">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlight banner of active time constraint */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-blue-200 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs animate-pulse"></div>
                  <div>
                    <span>ช่วงเวลาจองสูงสุด: </span>
                    <strong className="text-white font-bold font-mono">
                      {(() => {
                        const s = parseFloat(startTime.replace(':', '.'));
                        const e = parseFloat(endTime.replace(':', '.'));
                        const diff = e - s;
                        return diff > 0 ? `${diff.toFixed(1).replace('.0', '')} ชั่วโมง` : 'เวลาไม่ถูกต้อง';
                      })()}
                    </strong>
                    <span> ในพื้นที่จัดสรร ITC FABLAB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: COURSE & PROJECT DETAILS ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>ขั้นตอนที่ 4: รายละเอียดวิชาการ / วัตถุประสงค์โครงการ</span>
              </h2>
              <p className="text-xs text-blue-200/50 mt-1">ระบุรายละเอียดของการทดลองเพื่อเป็นข้อมูลการบันทึกจัดเตรียมสถานีงานและแนะแนวป้องกันอันตราย</p>
            </div>

            <div className="space-y-4">
              {/* Subject or Project Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-100">
                  ชื่อรายวิชา / ชื่อโครงงานพัฒนานวัตกรรม <span className="text-rose-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-blue-300/40" />
                  </div>
                  <input
                    type="text"
                    required
                    id="input-project"
                    value={subjectProject}
                    onChange={(e) => setSubjectProject(e.target.value)}
                    placeholder="เช่น โครงงานแขนกลผู้ป่วยกล้ามเนื้อล้า หรือ รายวิชา วิศวกรรมกลไกแอดวานซ์"
                    className="block w-full pl-10 pr-3 py-3 rounded-xl focus:outline-hidden text-sm glass-input"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-100">
                  วัตถุประสงค์ / ชิ้นงานที่ต้องการสร้างสรรค์ (ระบุพอสังเขป)
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="เช่น ต้องการสร้างเฟรมเครื่องบินกระดาษอโลหะ เพื่อทดสอบแรงต้านในอุโมงค์ลม"
                  rows={3}
                  className="block w-full p-3.5 rounded-xl focus:outline-hidden text-sm glass-input"
                />
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-100">
                  ระบุชื่อวัสดุ หรือประเภทชิ้นงานอ้างอิงที่เตรียมนํามาแปรรูป
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="เช่น เส้นใยพลาสติก PLA จากภายนอก หรือ แผ่นอะคริลิกสีส้มขนาด 30x30 ซม."
                  className="block w-full p-3.5 rounded-xl text-sm glass-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons footer inside cards */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-white/10 hover:bg-white/10 text-blue-200 hover:text-white rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>กลับ</span>
              </button>
            )}
          </div>

          <div>
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/15"
              >
                <span>ถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                id="btn-submit-booking"
                className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-500 to-indigo-650 hover:opacity-95 hover:scale-101 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20"
              >
                <Check className="w-4 h-4" />
                <span>ส่งใบจองใช้บริการ</span>
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
