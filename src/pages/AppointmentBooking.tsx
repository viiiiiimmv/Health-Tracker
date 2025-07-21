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
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-2">
            Select a doctor and schedule your visit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Selection */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Choose Your Doctor
              </h2>
              <div className="space-y-4">
                {mockDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
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

            {/* Date and Time Selection */}
            {selectedDoctor && (
              <Card className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Select Date & Time
                </h2>
                
                <div className="mb-6">
                  <Input
                    type="date"
                    label="Appointment Date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    icon={<Calendar className="h-5 w-5 text-gray-400" />}
                  />
                </div>

                {timeSlots.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`p-3 text-sm rounded-lg border transition-all ${
                            slot.available
                              ? selectedTime === slot.time
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Appointment Summary
              </h2>
              
              {selectedDoctor ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedDoctor.name}
                      </p>
                      <p className="text-sm text-blue-600">
                        {selectedDoctor.specialty}
                      </p>
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{selectedTime}</span>
                    </div>
                  )}

                  <div className="mt-6">
                    <Input
                      label="Reason for Visit"
                      placeholder="Brief description of your concern"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mb-4"
                    />
                  </div>

                  <Button
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTime || !reason}
                    className="w-full"
                    size="lg"
                  >
                    Book Appointment
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a doctor to continue</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};