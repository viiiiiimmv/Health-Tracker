import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Pill as Pills, Clock, Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Prescription, Medication } from '../types';
import { Transition, TransitionStatus } from 'react-transition-group';
import { mockDoctors } from '../data/mockData';

const initialPrescription = {
  doctorId: '',
  doctorName: '',
  date: '',
  medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
  instructions: '',
};

export const Prescriptions: React.FC = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<any>(initialPrescription);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const meds = [...form.medications];
    meds[idx][e.target.name] = e.target.value;
    setForm({ ...form, medications: meds });
  };

  const addMedication = () => {
    setForm({ ...form, medications: [...form.medications, { name: '', dosage: '', frequency: '', duration: '' }] });
  };

  const removeMedication = (idx: number) => {
    const meds = form.medications.filter((_: any, i: number) => i !== idx);
    setForm({ ...form, medications: meds });
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = mockDoctors.find(d => d.id === e.target.value);
    setForm({
      ...form,
      doctorId: selected?.id || '',
      doctorName: selected?.name || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    let updated: Prescription[];
    if (editing) {
      updated = prescriptions.map((p) => (p.id === editing.id ? { ...form, id: editing.id } : p));
    } else {
      updated = [
        ...prescriptions,
        { ...form, id: Date.now().toString() },
      ];
    }
    setPrescriptions(updated);
    localStorage.setItem(`prescriptions_${user.id}`, JSON.stringify(updated));
    setShowModal(false);
    setEditing(null);
    setForm(initialPrescription);
    setToast(editing ? 'Prescription updated!' : 'Prescription added!');
    setTimeout(() => setToast(null), 2000);
  };

  const handleEdit = (prescription: Prescription) => {
    setEditing(prescription);
    setForm(prescription);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    const updated = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(updated);
    localStorage.setItem(`prescriptions_${user.id}`, JSON.stringify(updated));
    setShowConfirm(null);
    setToast('Prescription deleted!');
    setTimeout(() => setToast(null), 2000);
  };

  // Placeholder for modal and card UI
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="text-gray-600 mt-2">
            View and manage your medical prescriptions
          </p>
        </div>
        <div className="space-y-6">
          {prescriptions.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Prescriptions Found
                </h3>
                <p className="text-gray-600">
                  Your prescriptions from doctors will appear here
                </p>
              </div>
            </Card>
          ) : (
            prescriptions.map((prescription) => (
              <Card key={prescription.id} className="transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Prescription #{prescription.id}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{prescription.doctorName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(prescription.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(prescription)} aria-label="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowConfirm(prescription.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setExpanded(expanded === prescription.id ? null : prescription.id)} aria-label="Expand">
                      {expanded === prescription.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {/* Expandable details */}
                <Transition in={expanded === prescription.id} timeout={200} unmountOnExit>
                  {(state: TransitionStatus) => (
                    <div className={`mt-4 transition-all duration-300 ${state === 'entered' ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                            <Pills className="h-5 w-5 mr-2 text-blue-600" />
                            Medications
                          </h4>
                          <div className="space-y-4">
                            {prescription.medications.map((medication, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-900 mb-2">
                                  {medication.name}
                                </h5>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Dosage:</span> {medication.dosage}
                                  </div>
                                  <div>
                                    <span className="font-medium">Duration:</span> {medication.duration}
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-medium">Frequency:</span> {medication.frequency}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-green-600" />
                            Instructions
                          </h4>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">
                              {prescription.instructions}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Prescription issued on {new Date(prescription.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Transition>
                {/* Delete confirmation dialog */}
                {showConfirm === prescription.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                      <h3 className="text-lg font-semibold mb-4">Delete Prescription?</h3>
                      <p className="mb-6 text-gray-600">Are you sure you want to delete this prescription?</p>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowConfirm(null)}>Cancel</Button>
                        <Button variant="primary" onClick={() => handleDelete(prescription.id)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
      {/* Floating Add Button */}
      <button
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-50 flex items-center"
        onClick={() => { setEditing(null); setForm(initialPrescription); setShowModal(true); }}
        aria-label="Add Prescription"
      >
        <Plus className="h-6 w-6" />
      </button>
      {/* Modal for add/edit prescription */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl animate-slide-up border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">{editing ? 'Edit' : 'Add'} Prescription</h2>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor</label>
              <div className="relative">
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleDoctorChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 pr-10 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  <option value="" disabled>Select a doctor</option>
                  {mockDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialty})
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown className="h-5 w-5" />
                </span>
              </div>
              {form.doctorId && (
                <div className="flex items-center mt-2 space-x-3 p-2 bg-blue-50 rounded-lg">
                  <img
                    src={mockDoctors.find(d => d.id === form.doctorId)?.avatar}
                    alt={mockDoctors.find(d => d.id === form.doctorId)?.name}
                    className="w-10 h-10 rounded-full object-cover border border-blue-200"
                  />
                  <div>
                    <div className="font-medium text-blue-700">{mockDoctors.find(d => d.id === form.doctorId)?.name}</div>
                    <div className="text-xs text-gray-500">{mockDoctors.find(d => d.id === form.doctorId)?.specialty}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleInput} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Medications</label>
              {form.medications.map((med: Medication, idx: number) => (
                <div key={idx} className="flex flex-col space-y-2 mb-2">
                  <input type="text" name="name" placeholder="Name" value={med.name} onChange={e => handleMedChange(idx, e)} required className="border rounded-lg px-2 py-1 bg-gray-50" />
                  <input type="text" name="dosage" placeholder="Dosage" value={med.dosage} onChange={e => handleMedChange(idx, e)} required className="border rounded-lg px-2 py-1 bg-gray-50" />
                  <input type="text" name="frequency" placeholder="Frequency" value={med.frequency} onChange={e => handleMedChange(idx, e)} required className="border rounded-lg px-2 py-1 bg-gray-50" />
                  <input type="text" name="duration" placeholder="Duration" value={med.duration} onChange={e => handleMedChange(idx, e)} required className="border rounded-lg px-2 py-1 bg-gray-50" />
                  {form.medications.length > 1 && (
                    <button type="button" onClick={() => removeMedication(idx)} className="text-red-500 px-2 font-bold self-end">&times;</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addMedication} className="text-blue-600 hover:underline text-sm mt-1">+ Add Medication</button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions</label>
              <textarea name="instructions" value={form.instructions} onChange={handleInput} required className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" type="button" onClick={() => { setShowModal(false); setEditing(null); setForm(initialPrescription); }}>Cancel</Button>
              <Button variant="primary" type="submit">{editing ? 'Update' : 'Add'}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};