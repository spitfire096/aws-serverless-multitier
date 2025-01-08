// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { fetchUserProfile, updateUserProfile } from '../services/apiService'

const Profile = () => {
  const auth = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formState, setFormState] = useState({})

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = auth.user?.profile?.sub
        const data = await fetchUserProfile(userId)
        setProfile(data)
        setFormState(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (auth.isAuthenticated) {
      loadProfile()
    }
  }, [auth])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const userId = auth.user?.profile?.sub
      await updateUserProfile(userId, formState)
      setProfile(formState)
      setEditMode(false)
    } catch (err) {
      console.error('Update failed', err)
    }
  }

  if (loading) return <div>Loading profile...</div>
  if (!profile) return <div>No profile found.</div>

  return (
    <div>
      <h2>Profile Page</h2>
      {editMode ? (
        <div>
          {/* Render form fields for editing profile */}
          <label>
            Name:
            <input 
              name="name" 
              value={formState.name || ''} 
              onChange={handleInputChange} 
            />
          </label>
          <br />
          <label>
            Email:
            <input 
              name="email" 
              value={formState.email || ''} 
              onChange={handleInputChange} 
            />
          </label>
          <br />
          <label>
            Address:
            <input 
              name="address" 
              value={formState.address || ''} 
              onChange={handleInputChange} 
            />
          </label>
          <br />
          <label>
            Phone:
            <input 
              name="phone" 
              value={formState.phone || ''} 
              onChange={handleInputChange} 
            />
          </label>
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Address:</strong> {profile.address || 'Not provided'}</p>
          <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  )
}

export default Profile
