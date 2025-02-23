import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('Personal');
  const { userData, backendUrl, token, loadUserProfileData } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});
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
        gender: userData.gender || 'Select Gender',
        dateOfBirth: userData.dob || '',
        bloodGroup: userData.bloodGroup || 'Select Blood Group',
        maritalStatus: userData.maritalStatus || 'Select Marital Status',
        height: userData.height || '',
        weight: userData.weight || '',
        emergencyContact: userData.emergencyContact || '',
        location: userData.address?.line1 || '',
        allergies: userData.allergies || '',
        currentMedications: userData.currentMedications || '',
        pastMedications: userData.pastMedications || '',
        chronicDiseases: userData.chronicDiseases || '',
        injuries: userData.injuries || '',
        surgeries: userData.surgeries || '',
        smokingHabits: userData.smokingHabits || '',
        alcoholConsumption: userData.alcoholConsumption || '',
        activityLevel: userData.activityLevel || '',
        foodPreference: userData.foodPreference || '',
        occupation: userData.occupation || ''
      }));
    }
  }, [userData]);

  const navigate = useNavigate();

  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!profileData.name.trim()) newErrors.name = 'Name is required';
    if (!profileData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!/^\d{10}$/.test(profileData.contactNumber)) newErrors.contactNumber = 'Invalid contact number';
    if (!profileData.emailId.trim()) newErrors.emailId = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(profileData.emailId)) newErrors.emailId = 'Invalid email format';
    if (profileData.gender === 'Select Gender') newErrors.gender = 'Please select gender';
    if (!profileData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (profileData.bloodGroup === 'Select Blood Group') newErrors.bloodGroup = 'Please select blood group';
    if (profileData.maritalStatus === 'Select Marital Status') newErrors.maritalStatus = 'Please select marital status';
    if (!profileData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!/^\d{10}$/.test(profileData.emergencyContact)) newErrors.emergencyContact = 'Invalid emergency contact';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMedicalInfo = () => {
    const newErrors = {};
    if (!profileData.allergies.trim()) newErrors.allergies = 'Please specify allergies or write None';
    if (!profileData.currentMedications.trim()) newErrors.currentMedications = 'Please specify current medications or write None';
    if (!profileData.chronicDiseases.trim()) newErrors.chronicDiseases = 'Please specify chronic diseases or write None';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLifestyleInfo = () => {
    const newErrors = {};
    if (!profileData.smokingHabits.trim()) newErrors.smokingHabits = 'Please specify smoking habits';
    if (!profileData.alcoholConsumption.trim()) newErrors.alcoholConsumption = 'Please specify alcohol consumption';
    if (!profileData.activityLevel.trim()) newErrors.activityLevel = 'Please specify activity level';
    if (!profileData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeTab === 'Personal' && validatePersonalInfo()) {
      setActiveTab('Medical');
    } else if (activeTab === 'Medical' && validateMedicalInfo()) {
      setActiveTab('Lifestyle');
    }
  };

  const handlePrevious = () => {
    if (activeTab === 'Medical') {
      setActiveTab('Personal');
    } else if (activeTab === 'Lifestyle') {
      setActiveTab('Medical');
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!validateLifestyleInfo()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('phone', profileData.contactNumber);
      formData.append('address', JSON.stringify({
        line1: profileData.location,
        line2: ''
      }));
      formData.append('gender', profileData.gender);
      formData.append('dob', profileData.dateOfBirth);
      formData.append('bloodGroup', profileData.bloodGroup);
      formData.append('height', profileData.height);
      formData.append('weight', profileData.weight);
      formData.append('emergencyContact', profileData.emergencyContact);
      formData.append('allergies', profileData.allergies);
      formData.append('currentMedications', profileData.currentMedications);
      formData.append('pastMedications', profileData.pastMedications);
      formData.append('chronicDiseases', profileData.chronicDiseases);
      formData.append('injuries', profileData.injuries);
      formData.append('surgeries', profileData.surgeries);
      formData.append('smokingHabits', profileData.smokingHabits);
      formData.append('alcoholConsumption', profileData.alcoholConsumption);
      formData.append('activityLevel', profileData.activityLevel);
      formData.append('foodPreference', profileData.foodPreference);
      formData.append('occupation', profileData.occupation);

      if (selectedImage) {
        const imageFile = await fetch(selectedImage).then(r => r.blob());
        formData.append('image', imageFile);
      }

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: { token }
      });

      if (data.success) {
        toast.success('Profile updated successfully');
        await loadUserProfileData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-8">
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-700">Name</h2>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your name"
            className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
            className={`w-full p-2 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-700">Email Id</h2>
          <input
            type="email"
            value={profileData.emailId}
            onChange={(e) => handleInputChange('emailId', e.target.value)}
            placeholder="Enter your email"
            className={`w-full p-2 border ${errors.emailId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.emailId && <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Gender</h2>
          <select
            value={profileData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className={`w-full p-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {genderOptions.map(option => (
              <option key={option} value={option === 'Select Gender' ? '' : option}>
                {option}
              </option>
            ))}
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Date of Birth</h2>
          <input
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={`w-full p-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Blood Group</h2>
          <select
            value={profileData.bloodGroup}
            onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
            className={`w-full p-2 border ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {bloodGroupOptions.map(option => (
              <option key={option} value={option === 'Select Blood Group' ? '' : option}>
                {option}
              </option>
            ))}
          </select>
          {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Marital Status</h2>
          <select
            value={profileData.maritalStatus}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className={`w-full p-2 border ${errors.maritalStatus ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {maritalStatusOptions.map(option => (
              <option key={option} value={option === 'Select Marital Status' ? '' : option}>
                {option}
              </option>
            ))}
          </select>
          {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Height (cm)</h2>
          <input
            type="number"
            value={profileData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="Enter your height in cm"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">Weight (kg)</h2>
          <input
            type="number"
            value={profileData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="Enter your weight in kg"
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
            className={`w-full p-2 border ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
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
        { label: 'Allergies', field: 'allergies', placeholder: 'List your allergies or write None' },
        { label: 'Current Medications', field: 'currentMedications', placeholder: 'List your current medications or write None' },
        { label: 'Past Medications', field: 'pastMedications', placeholder: 'List your past medications or write None' },
        { label: 'Chronic Diseases', field: 'chronicDiseases', placeholder: 'List any chronic diseases or write None' },
        { label: 'Injuries', field: 'injuries', placeholder: 'List any significant injuries or write None' },
        { label: 'Surgeries', field: 'surgeries', placeholder: 'List any surgeries or write None' }
      ].map(item => (
        <div key={item.field}>
          <h2 className="text-lg font-medium text-gray-700">{item.label}</h2>
          <input
            type="text"
            value={profileData[item.field]}
            onChange={(e) => handleInputChange(item.field, e.target.value)}
            placeholder={item.placeholder}
            className={`w-full p-2 border ${errors[item.field] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors[item.field] && <p className="text-red-500 text-sm mt-1">{errors[item.field]}</p>}
        </div>
      ))}
    </div>
  );

  const renderLifestyleInfo = () => (
    <div className="space-y-4">
      {[
        { label: 'Smoking Habits', field: 'smokingHabits', placeholder: 'Specify your smoking habits' },
        { label: 'Alcohol Consumption', field: 'alcoholConsumption', placeholder: 'Specify your alcohol consumption' },
        { label: 'Activity Level', field: 'activityLevel', placeholder: 'Describe your physical activity level' },
        { label: 'Food Preference', field: 'foodPreference', placeholder: 'Specify your food preferences' },
        { label: 'Occupation', field: 'occupation', placeholder: 'Enter your occupation' }
      ].map(item => (
        <div key={item.field}>
          <h2 className="text-lg font-medium text-gray-700">{item.label}</h2>
          <input
            type="text"
            value={profileData[item.field]}
            onChange={(e) => handleInputChange(item.field, e.target.value)}
            placeholder={item.placeholder}
            className={`w-full p-2 border ${errors[item.field] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors[item.field] && <p className="text-red-500 text-sm mt-1">{errors[item.field]}</p>}
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
        <h1 className="text-2xl font-bold ml-4">Complete Your Profile</h1>
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

      <div className="mt-8 flex justify-between">
        {activeTab !== 'Personal' && (
          <button
            onClick={handlePrevious}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        {activeTab === 'Lifestyle' ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-auto"
          >
            Save Profile
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-auto"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 