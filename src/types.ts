export interface BookerInfo {
  fullName: string;
  phone: string;
  classLevel: string;
  major: string;
  isCustomClass?: boolean;
}

export type MachineType = '3D Printer' | 'Laser cut' | 'CNC';

export interface MachineDetails {
  id: MachineType;
  name: string;
  thaiName: string;
  description: string;
  thaiDescription: string;
  image: string;
  specs: string[];
  maxDailyHours: number;
}

export interface Booking {
  id: string;
  booker: BookerInfo;
  machine: MachineType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  subjectProject: string;
  purpose: string;
  materials?: string;
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: string;
}
