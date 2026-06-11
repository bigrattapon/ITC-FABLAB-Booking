import { MachineDetails, Booking } from '../types';

export const MACHINES: MachineDetails[] = [
  {
    id: '3D Printer',
    name: '3D Printer',
    thaiName: 'เครื่องพิมพ์ 3 มิติ',
    description: 'High-precision FDM 3D printer for prototyping plastic materials.',
    thaiDescription: 'เครื่องพิมพ์ระบบเส้นใยพลาสติก ความละเอียดสูง เหมาะสำหรับงานขึ้นรูปชิ้นงานต้นแบบ',
    image: '3d_printer',
    specs: [
      'เส้นใยที่รองรับ: PLA, ABS, PETG, TPU',
      'ขนาดฐานพิมพ์สูงสุด: 256 x 256 x 256 มม.',
      'ความละเอียดเลเยอร์: 0.08 - 0.28 มม.',
      'ระบบควบคุมผ่าน Cloud และแผงหน้าจอสัมผัส'
    ],
    maxDailyHours: 8
  },
  {
    id: 'Laser cut',
    name: 'Laser cut',
    thaiName: 'เครื่องตัด CO2 เลเซอร์',
    description: 'High-speed CO2 laser cutter and engraver for organic materials.',
    thaiDescription: 'เครื่องตัดและแกะสลักเลเซอร์ CO2 สำหรับงานไม้ อะคริลิก และแผ่นพลาสติกอโลหะ',
    image: 'laser_cut',
    specs: [
      'วัสดุที่รองรับ: อะคริลิก, ไม้อัด, หนัง, กระดาษการ์ด (ห้ามนำโลหะเข้าเครื่อง)',
      'ขนาดพื้นที่ทำงานสูงสุด: 900 x 600 มม.',
      'กำลังเลเซอร์ CO2: 100 วัตต์',
      'รองรับไฟล์รูปแบบ: .DXF, .AI, .SVG, .PDF'
    ],
    maxDailyHours: 4
  },
  {
    id: 'CNC',
    name: 'CNC',
    thaiName: 'เครื่องกัด CNC',
    description: '3-Axis milling machine for carving wood, plastics and soft metals.',
    thaiDescription: 'เครื่องกัดสลักคอมพิวเตอร์แบบ 3 แกน สำหรับงานเจาะและกัดผิวหน้าชิ้นงาน',
    image: 'cnc',
    specs: [
      'วัสดุที่รองรับ: ไม้จริง, แผ่นพลาสติกวิศวกรรม, แผ่นอะคริลิก, แผ่นวงจรพิมพ์ PCB',
      'ขนาดพื้นที่ทำงานสูงสุด: 300 x 180 x 45 มม.',
      'กำลังมอเตอร์แกนหมุน: 500 วัตต์ (ความเร็วสูงสุด 12,000 รอบ/นาที)',
      'รองรับไฟล์รูปแบบ: .GCODE, .NC, .TXT'
    ],
    maxDailyHours: 4
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'B-001',
    booker: {
      fullName: 'สมชาย สายเทค',
      phone: '0812345678',
      classLevel: 'ปวส. ชั้นปีที่ 2',
      major: 'เทคโนโลยีคอมพิวเตอร์'
    },
    machine: '3D Printer',
    date: '2026-06-08',
    startTime: '09:00',
    endTime: '12:00',
    subjectProject: 'โครงงานหุ่นยนต์กวาดขยะอัตโนมัติ',
    purpose: 'พิมพ์ล้อรถหุ่นยนต์และข้อต่อโครงสร้างพลาสติก',
    materials: 'เส้นพลาสติก PLA สีขาว 50 กรัม',
    status: 'approved',
    createdAt: '2026-06-07T08:30:00Z'
  },
  {
    id: 'B-002',
    booker: {
      fullName: 'ณิชา ดีไซน์',
      phone: '0956781234',
      classLevel: 'ปริญญาตรี ชั้นปีที่ 3',
      major: 'วิศวกรรมการออกแบบผลิตภัณฑ์'
    },
    machine: 'Laser cut',
    date: '2026-06-09',
    startTime: '13:00',
    endTime: '15:00',
    subjectProject: 'วิชา Product Shell Prototyping',
    purpose: 'ตัดแผ่นอะคริลิกใสหนา 3 มม. เพื่อประกอบกล่องบรรจุภัณฑ์',
    materials: 'แผ่นอะคริลิกใส 3 มม. ขนาด 40x40 ซม.',
    status: 'approved',
    createdAt: '2026-06-08T09:12:00Z'
  },
  {
    id: 'B-003',
    booker: {
      fullName: 'นพพล เครื่องกล',
      phone: '0867891234',
      classLevel: 'มัธยมศึกษาปีที่ 6',
      major: 'แผนการเรียนวิทย์-คณิต'
    },
    machine: 'CNC',
    date: '2026-06-10',
    startTime: '10:00',
    endTime: '12:00',
    subjectProject: 'โครงงานสะพานไม้จำลองย่อส่วน',
    purpose: 'จำลองสลักยึดและคานรับน้ำหนักโครงจากไม้จริง',
    materials: 'ไม้สนนอก 5 ชิ้น ขนาด 5x10x1 ซม.',
    status: 'approved',
    createdAt: '2026-06-09T14:45:00Z'
  },
  {
    id: 'B-004',
    booker: {
      fullName: 'กิตติภพ อิเล็กทรอนิกส์',
      phone: '0624567890',
      classLevel: 'ปวช. ชั้นปีที่ 3',
      major: 'สาขาไฟฟ้าและอิเล็กทรอนิกส์'
    },
    machine: 'CNC',
    date: '2026-06-11',
    startTime: '14:00',
    endTime: '16:00',
    subjectProject: 'วิชาการออกแบบแผ่นวงจรพิมพ์ขั้นสูง',
    purpose: 'กัดแผ่นวงจรพิมพ์สองหน้า (PCB Double-Sided Board) สลักลายวงจร',
    materials: 'แผ่นทองแดง PCB หนา 1.5 มม. ขนาด 10x15 ซม.',
    status: 'pending',
    createdAt: '2026-06-11T02:15:00Z'
  },
  {
    id: 'B-005',
    booker: {
      fullName: 'พิมลภัส นักคิด',
      phone: '0890123456',
      classLevel: 'มัธยมศึกษาปีที่ 3',
      major: 'วิทยาลุยพัฒนาวิชาการ'
    },
    machine: 'Laser cut',
    date: '2026-06-12',
    startTime: '09:00',
    endTime: '11:00',
    subjectProject: 'วิชาห้องเรียนอิสระวิทยาศาสตร์ปฐมวัย',
    purpose: 'สลักลายไม้และตัดชิ้นส่วนไม้บัลซ่าออกแบบโมเดลลูกข่าง',
    materials: 'แผ่นไม้บัลซ่าหนา 2 มม.',
    status: 'approved',
    createdAt: '2026-06-10T10:00:00Z'
  }
];
