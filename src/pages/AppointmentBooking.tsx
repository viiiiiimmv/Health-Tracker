import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Star, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { mockDoctors, generateTimeSlots } from '../data/mockData';
import { Doctor, TimeSlot } from '../types';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';

export const AppointmentBooking: React.FC = () => {
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isBooked, setIsBooked] = useState(false);

  // Add state for appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (!user) return [];
    const data = localStorage.getItem(`appointments_${user.id}`);
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    if (user) {
      const data = localStorage.getItem(`appointments_${user.id}`);
      setAppointments(data ? JSON.parse(data) : []);
    }
  }, [user]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    if (date) {
      setTimeSlots(generateTimeSlots(date));
    }
  };

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime && reason && user) {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        status: 'upcoming',
        reason,
      };
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      localStorage.setItem(`appointments_${user.id}`, JSON.stringify(updatedAppointments));
      window.dispatchEvent(new Event('storage')); // Notify other tabs/components
      setTimeout(() => {
        setIsBooked(true);
      }, 1000);
    }
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setTimeSlots([]);
    setIsBooked(false);
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Appointment Booked!
          </h2>
          <p className="text-gray-600 mb-6">
            Your appointment with {selectedDoctor?.name} has been confirmed for{' '}
            {new Date(selectedDate).toLocaleDateString()} at {selectedTime}.
          </p>
          <div className="space-y-3">
            <Button onClick={resetForm} variant="outline" className="w-full">
              Book Another Appointment
            </Button>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-2">
            Select a doctor and schedule your visit
          </p>
        </div>

        {/* Doctor Selection */}
        <Card className="w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Choose Your Doctor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all w-full ${
                  selectedDoctor?.id === doctor.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{doctor.rating}</span>
                      </div>
                      <span>{doctor.experience} experience</span>
                    </div>
                  </div>
                  {selectedDoctor?.id === doctor.id && (
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Date Selection */}
        <Card className="w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card className="w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Time</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? 'primary' : 'outline'}
                  className="w-full"
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </Card>
        )}

        <Card className="w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reason for Visit</h2>
          <Input
            label="Reason"
            placeholder="Brief description of your concern"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mb-4"
          />
        </Card>

        <Button
          onClick={handleBookAppointment}
          className="w-full py-3 text-lg"
          disabled={
            !selectedDoctor || !selectedDate || !selectedTime || !reason
          }
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
};