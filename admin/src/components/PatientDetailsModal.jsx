import React, { useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'

const PatientDetailsModal = ({ patient, onClose }) => {
  const { calculateAge } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('Personal')

  if (!patient) return null

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{patient.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Age</p>
            <p className="font-medium">{calculateAge(patient.dob)} years</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium">{patient.gender || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Blood Group</p>
            <p className="font-medium">{patient.bloodGroup || 'Not specified'}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{patient.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{patient.email}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">Address</p>
            <p className="font-medium">
              {patient.address?.line1}<br />
              {patient.address?.line2}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Emergency Contact</h3>
        <div className="text-sm">
          <p className="text-gray-500">Emergency Contact Number</p>
          <p className="font-medium">{patient.emergencyContact || 'Not provided'}</p>
        </div>
      </div>
    </div>
  )

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Medical Information</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Height</p>
            <p className="font-medium">{patient.height || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Weight</p>
            <p className="font-medium">{patient.weight || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Allergies</p>
            <p className="font-medium">{patient.allergies || 'None specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Current Medications</p>
            <p className="font-medium">{patient.currentMedications || 'None specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Past Medications</p>
            <p className="font-medium">{patient.pastMedications || 'None specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Chronic Diseases</p>
            <p className="font-medium">{patient.chronicDiseases || 'None specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Injuries</p>
            <p className="font-medium">{patient.injuries || 'None specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Surgeries</p>
            <p className="font-medium">{patient.surgeries || 'None specified'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLifestyleInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Lifestyle Information</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Smoking Habits</p>
            <p className="font-medium">{patient.smokingHabits || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Alcohol Consumption</p>
            <p className="font-medium">{patient.alcoholConsumption || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Activity Level</p>
            <p className="font-medium">{patient.activityLevel || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Food Preference</p>
            <p className="font-medium">{patient.foodPreference || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Occupation</p>
            <p className="font-medium">{patient.occupation || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Patient Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex space-x-4 px-6 pt-4 border-b">
          {['Personal', 'Medical', 'Lifestyle'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'Personal' && renderPersonalInfo()}
          {activeTab === 'Medical' && renderMedicalInfo()}
          {activeTab === 'Lifestyle' && renderLifestyleInfo()}
        </div>
      </div>
    </div>
  )
}

export default PatientDetailsModal 