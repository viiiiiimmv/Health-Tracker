import { Doctor, Appointment, Prescription, TimeSlot } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.9,
    experience: '15 years'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.8,
    experience: '12 years'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    avatar: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.9,
    experience: '10 years'
  },
  {
    id: '4',
    name: 'Dr. David Thompson',
    specialty: 'Orthopedic Surgeon',
    avatar: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.7,
    experience: '18 years'
  }
];

export const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  
  times.forEach(time => {
    slots.push({
      time,
      available: Math.random() > 0.3
    });
  });
  
  return slots;
};