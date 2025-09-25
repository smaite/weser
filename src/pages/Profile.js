import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container">
        <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
          <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Name</label>
              <p className="mt-1 text-white">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Email</label>
              <p className="mt-1 text-white">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Role</label>
              <p className="mt-1 text-white capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
