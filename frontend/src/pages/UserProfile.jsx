import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('Personal');
  const { userData } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileData, setProfileData] = useState({
    // Personal Info
    name: '',
    contactNumber: '',
    emailId: '',
    gender: 'Select Gender',
    dateOfBirth: '',
    bloodGroup: 'Select Blood Group',
    maritalStatus: 'Select Marital Status',
    height: '',
    weight: '',
    emergencyContact: '',
    location: '',
    
    // Medical Info
    allergies: '',
    currentMedications: '',
    pastMedications: '',
    chronicDiseases: '',
    injuries: '',
    surgeries: '',
    
    // Lifestyle Info
    smokingHabits: '',
    alcoholConsumption: '',
    activityLevel: '',
    foodPreference: '',
    occupation: ''
  });

  // Options for dropdowns
  const genderOptions = ['Select Gender', 'Male', 'Female', 'Other'];
  const bloodGroupOptions = ['Select Blood Group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const maritalStatusOptions = ['Select Marital Status', 'Single', 'Married', 'Divorced', 'Widowed'];

  useEffect(() => {
    if (userData) {
      setProfileData(prev => ({
        ...prev,
        name: userData.name || '',
        contactNumber: userData.phone || '',
        emailId: userData.email || '',
        // Reset other fields to their default values if not present in userData
        gender: userData.gender || 'Select Gender',
        bloodGroup: userData.bloodGroup || 'Select Blood Group',
        maritalStatus: userData.maritalStatus || 'Select Marital Status'
      }));
    }
  }, [userData]);

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const calculateCompletion = () => {
    const totalFields = Object.keys(profileData).length;
    const filledFields = Object.values(profileData).filter(value => {
      if (value === 'Select Gender' || value === 'Select Blood Group' || value === 'Select Marital Status') {
        return false;
      }
      return value && value.trim() !== '';
    }).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-700">Name</h2>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden">
          <input
            type="file"
            id="photo-upload"
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <label 
            htmlFor="photo-upload" 
            className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">add photo</span>
            )}
          </label>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-700">Contact Number</h2>
          <input
            type="tel"
            value={profileData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            placeholder="Enter your contact number"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-700">Email Id</h2>
          <input
            type="email"
            value={profileData.emailId}
            onChange={(e) => handleInputChange('emailId', e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Gender</h2>
          <select
            value={profileData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {genderOptions.map(option => (
              <option key={option} value={option === 'Select Gender' ? '' : option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Date of Birth</h2>
          <input
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Blood Group</h2>
          <select
            value={profileData.bloodGroup}
            onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {bloodGroupOptions.map(option => (
              <option key={option} value={option === 'Select Blood Group' ? '' : option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Marital Status</h2>
          <select
            value={profileData.maritalStatus}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {maritalStatusOptions.map(option => (
              <option key={option} value={option === 'Select Marital Status' ? '' : option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Height</h2>
          <input
            type="text"
            value={profileData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="Enter your height"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Weight</h2>
          <input
            type="text"
            value={profileData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="Enter your weight"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Emergency Contact</h2>
          <input
            type="tel"
            value={profileData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            placeholder="Enter emergency contact number"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Location</h2>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter your location"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-4">
      {[
        { label: 'Allergies', field: 'allergies' },
        { label: 'Current Medications', field: 'currentMedications' },
        { label: 'Past Medications', field: 'pastMedications' },
        { label: 'Chronic Diseases', field: 'chronicDiseases' },
        { label: 'Injuries', field: 'injuries' },
        { label: 'Surgeries', field: 'surgeries' }
      ].map(item => (
        <div key={item.field}>
          <h2 className="text-lg font-medium text-gray-700">{item.label}</h2>
          <input
            type="text"
            value={profileData[item.field]}
            onChange={(e) => handleInputChange(item.field, e.target.value)}
            placeholder={`Enter ${item.label.toLowerCase()}`}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  );

  const renderLifestyleInfo = () => (
    <div className="space-y-4">
      {[
        { label: 'Smoking Habits', field: 'smokingHabits' },
        { label: 'Alcohol consumption', field: 'alcoholConsumption' },
        { label: 'Activity level', field: 'activityLevel' },
        { label: 'Food Preference', field: 'foodPreference' },
        { label: 'Occupation', field: 'occupation' }
      ].map(item => (
        <div key={item.field}>
          <h2 className="text-lg font-medium text-gray-700">{item.label}</h2>
          <input
            type="text"
            value={profileData[item.field]}
            onChange={(e) => handleInputChange(item.field, e.target.value)}
            placeholder={`Enter ${item.label.toLowerCase()}`}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold ml-4">{profileData.name || 'Complete Your Profile'}</h1>
      </div>

      <div className="flex space-x-4 mb-6 border-b">
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

      <div className="mt-6">
        {activeTab === 'Personal' && renderPersonalInfo()}
        {activeTab === 'Medical' && renderMedicalInfo()}
        {activeTab === 'Lifestyle' && renderLifestyleInfo()}
      </div>

      <div className="mt-8">
        <button className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Complete profile
          <span className="ml-2 text-sm">{calculateCompletion()}% completed</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 