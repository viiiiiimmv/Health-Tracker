import React from 'react';
import { FileText, Calendar, User, Pill as Pills, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { mockPrescriptions } from '../data/mockData';

export const Prescriptions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="text-gray-600 mt-2">
            View and manage your medical prescriptions
          </p>
        </div>

        <div className="space-y-6">
          {mockPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-start justify-between">
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
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>

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

                  <div className="mt-6">
                    <h5 className="font-medium text-gray-900 mb-2">Important Notes</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Take medications with food if stomach upset occurs</li>
                      <li>• Do not skip doses, even if you feel better</li>
                      <li>• Contact your doctor if you experience any side effects</li>
                      <li>• Store medications in a cool, dry place</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Prescription issued on {new Date(prescription.date).toLocaleDateString()}
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Download PDF
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {mockPrescriptions.length === 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};