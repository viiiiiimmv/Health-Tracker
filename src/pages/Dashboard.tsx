import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, FileText, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRef } from 'react';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState(user || {});
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const data = localStorage.getItem(`appointments_${user.id}`);
      setAppointments(data ? JSON.parse(data) : []);
      const handleStorage = () => {
        const updated = localStorage.getItem(`appointments_${user.id}`);
        setAppointments(updated ? JSON.parse(updated) : []);
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const data = localStorage.getItem(`prescriptions_${user.id}`);
      setPrescriptions(data ? JSON.parse(data) : []);
      const handleStorage = () => {
        const updated = localStorage.getItem(`prescriptions_${user.id}`);
        setPrescriptions(updated ? JSON.parse(updated) : []);
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, [user]);

  const handleProfileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser = { ...user, ...profileForm };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setShowProfileModal(false);
    window.location.reload(); // To update AuthContext and UI (simple approach)
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your health management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-20 h-20 object-cover rounded-full" />
                  ) : (
                    <User className="h-10 w-10 text-blue-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{user?.phone}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Born: {user?.dateOfBirth}</span>
                  </div>
                </div>
                <Button className="mt-4 w-full" variant="outline" onClick={() => { setProfileForm(user || {}); setShowProfileModal(true); }}>
                  Edit Profile
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/appointments">
                  <Button variant="outline" className="w-full justify-start mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/prescriptions">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Prescriptions
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {nextAppointment && (
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Next Appointment
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{nextAppointment.doctorName}</span>
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {nextAppointment.specialty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(nextAppointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{nextAppointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>Reason: {nextAppointment.reason}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-2">Status</div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Confirmed
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Upcoming Appointments */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Appointments
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAll(true)}>
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.doctorName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.specialty}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{new Date(appointment.date).toLocaleDateString()}</p>
                        <p>{appointment.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {upcomingAppointments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No upcoming appointments</p>
                    <Button className="mt-4" onClick={() => navigate('/appointments')}>
                      Book Your First Appointment
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {showAll && (
              <Card className="fixed inset-0 z-50 bg-white bg-opacity-95 overflow-y-auto p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">All Appointments</h2>
                  <Button variant="ghost" onClick={() => setShowAll(false)}>Close</Button>
                </div>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No appointments found.<br />
                      <Button className="mt-4" onClick={() => { setShowAll(false); navigate('/appointments'); }}>
                        Book Appointment
                      </Button>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {appointment.doctorName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.specialty}
                            </p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <p>{new Date(appointment.date).toLocaleDateString()}</p>
                            <p>{appointment.time}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Reason: {appointment.reason}</div>
                        <div className="text-xs text-gray-400">Status: {appointment.status}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button variant="outline" onClick={() => { setShowAll(false); navigate('/appointments'); }}>
                    Go to Book Appointment Page
                  </Button>
                </div>
              </Card>
            )}
            {/* Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingAppointments.length}
                </p>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
              </Card>
              <Card className="text-center">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                <p className="text-sm text-gray-600">Active Prescriptions</p>
              </Card>
              
              <Card className="text-center">
                <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-sm text-gray-600">Healthcare Providers</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slide-up border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Edit Profile</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
              <input type="text" name="firstName" value={profileForm.firstName || ''} onChange={handleProfileInput} required className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
              <input type="text" name="lastName" value={profileForm.lastName || ''} onChange={handleProfileInput} required className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={profileForm.email || ''} onChange={handleProfileInput} required className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={profileForm.phone || ''} onChange={handleProfileInput} required className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={profileForm.dateOfBirth || ''} onChange={handleProfileInput} required className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Avatar Image Link</label>
              <input type="url" name="avatar" value={profileForm.avatar || ''} onChange={handleProfileInput} placeholder="https://example.com/avatar.jpg" className="w-full border rounded-lg px-3 py-2 bg-gray-50" ref={avatarInputRef} />
              {profileForm.avatar && (
                <div className="flex justify-center mt-2">
                  <img src={profileForm.avatar} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover border border-blue-200" />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" type="button" onClick={() => setShowProfileModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};