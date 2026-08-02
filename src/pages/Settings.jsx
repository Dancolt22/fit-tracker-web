import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Check, 
  Info 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Settings.css';

export default function Settings() {
  const { userProfile, updateProfile, theme, toggleTheme } = useApp();

  // Local form state initialized from global profile context
  const [profileForm, setProfileForm] = useState({
    name: userProfile.name || '',
    age: userProfile.age || '',
    weight: userProfile.weight || '',
    targetCalories: userProfile.targetCalories || '',
    targetWater: userProfile.targetWater || '',
    targetWorkouts: userProfile.targetWorkouts || '',
    targetSleep: userProfile.targetSleep || ''
  });

  // Success indicator state
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Cast input strings back to appropriate numbers
    updateProfile({
      name: profileForm.name,
      age: parseInt(profileForm.age, 10) || 0,
      weight: parseInt(profileForm.weight, 10) || 0,
      targetCalories: parseInt(profileForm.targetCalories, 10) || 2000,
      targetWater: parseInt(profileForm.targetWater, 10) || 2000,
      targetWorkouts: parseInt(profileForm.targetWorkouts, 10) || 4,
      targetSleep: parseInt(profileForm.targetSleep, 10) || 8
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000); // clear banner after 3 seconds
  };

  return (
    <div className="settings-wrapper fade-in">
      <header className="page-header">
        <h1 className="welcome-title">Settings</h1>
        <p className="welcome-subtitle">Manage your personal metrics, targets, and display configurations.</p>
      </header>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="success-banner flex-between fade-in">
          <div className="flex-center gap-sm">
            <Check size={18} />
            <span>Profile and health targets saved successfully!</span>
          </div>
          <button className="btn-close-banner" onClick={() => setSaveSuccess(false)}>&times;</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form-layout">
        
        {/* Left Side: General Profile & Theme */}
        <div className="settings-column">
          {/* Profile Details */}
          <div className="glass-card settings-card">
            <div className="settings-card-header">
              <User className="text-primary" size={20} />
              <h3>Personal Profile</h3>
            </div>
            <p className="settings-card-desc">Your weight and age are used to estimate daily active calorie burns.</p>
            
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required 
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Age (years)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="120"
                  value={profileForm.age}
                  onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input 
                  type="number" 
                  min="20" 
                  max="300"
                  value={profileForm.weight}
                  onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Theme Preferences */}
          <div className="glass-card settings-card">
            <div className="settings-card-header">
              <SettingsIcon className="text-secondary" size={20} />
              <h3>Display Options</h3>
            </div>
            <p className="settings-card-desc">Switch between theme skins to match your preference.</p>
            
            <div className="theme-select-panel flex-between">
              <span>Color Mode Theme</span>
              <button 
                type="button" 
                className="btn btn-outline theme-toggle-action"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={16} className="text-warning" />
                    <span>Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={16} className="text-secondary" />
                    <span>Switch to Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Goals Customizer */}
        <div className="settings-column">
          <div className="glass-card settings-card">
            <div className="settings-card-header">
              <Target className="text-accent" size={20} />
              <h3>Daily & Weekly Targets</h3>
            </div>
            <p className="settings-card-desc">Set limits and target thresholds to dynamically feed your dashboard metrics.</p>

            <div className="form-group">
              <label>Daily Calorie Budget Limit (kcal)</label>
              <input 
                type="number" 
                min="500" 
                max="10000"
                value={profileForm.targetCalories}
                onChange={(e) => setProfileForm({ ...profileForm, targetCalories: e.target.value })}
                required 
              />
            </div>

            <div className="form-group">
              <label>Daily Water Hydration Goal (ml)</label>
              <input 
                type="number" 
                min="500" 
                max="8000"
                value={profileForm.targetWater}
                onChange={(e) => setProfileForm({ ...profileForm, targetWater: e.target.value })}
                required 
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Weekly Workout Goal (count)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="14"
                  value={profileForm.targetWorkouts}
                  onChange={(e) => setProfileForm({ ...profileForm, targetWorkouts: e.target.value })}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Daily Sleep Target (hours)</label>
                <input 
                  type="number" 
                  min="2" 
                  max="18"
                  value={profileForm.targetSleep}
                  onChange={(e) => setProfileForm({ ...profileForm, targetSleep: e.target.value })}
                  required 
                />
              </div>
            </div>

            {/* Explanatory Notice */}
            <div className="info-block">
              <Info size={18} className="text-secondary flex-shrink-0" />
              <p className="info-text">
                Health goals are synced instantly. Check your Dashboard and Progress tabs to see changes updated immediately!
              </p>
            </div>
          </div>

          <div className="settings-actions flex-end">
            <button type="submit" className="btn btn-primary btn-save">
              Save Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
