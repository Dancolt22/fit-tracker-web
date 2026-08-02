import React, { useState } from 'react';
import { 
  Flame, 
  Droplet, 
  Clock, 
  Plus, 
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

export default function Dashboard() {
  const { userProfile, getTodayStats, logWater, addWorkout } = useApp();
  const today = getTodayStats();

  // Quick workout log state
  const [showLogModal, setShowLogModal] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    type: 'cardio',
    duration: '',
    caloriesBurned: ''
  });

  // Calculate percentages
  const caloriePercent = Math.min(100, Math.round((today.caloriesConsumed / userProfile.targetCalories) * 100)) || 0;
  const waterPercent = Math.min(100, Math.round((today.waterConsumed / userProfile.targetWater) * 100)) || 0;
  const activePercent = Math.min(100, Math.round((today.workoutMinutes / 60) * 100)) || 0; // default 60min target

  const handleQuickWorkoutSubmit = (e) => {
    e.preventDefault();
    if (!workoutForm.name || !workoutForm.duration) return;
    
    // Estimate calories burned if not entered (approx 8.5 kcal per min for cardio)
    const durationNum = parseInt(workoutForm.duration, 10);
    const estCalories = workoutForm.caloriesBurned 
      ? parseInt(workoutForm.caloriesBurned, 10) 
      : Math.round(durationNum * (workoutForm.type === 'strength' ? 6 : 8.5));

    addWorkout({
      name: workoutForm.name,
      type: workoutForm.type,
      duration: durationNum,
      caloriesBurned: estCalories
    });

    setWorkoutForm({ name: '', type: 'cardio', duration: '', caloriesBurned: '' });
    setShowLogModal(false);
  };

  return (
    <div className="dashboard-wrapper fade-in">
      {/* Top Banner section */}
      <header className="dashboard-header flex-between">
        <div>
          <h1 className="welcome-title">Hey, {userProfile.name}! 👋</h1>
          <p className="welcome-subtitle">Here is your wellness summary for today.</p>
        </div>
        <div className="streak-badge animate-pulse-slow">
          <Award size={18} />
          <span>5 Day Streak</span>
        </div>
      </header>

      {/* Progress Cards */}
      <section className="progress-ring-section">
        {/* Calorie Ring */}
        <div className="progress-widget glass-card card-hover-effect">
          <div className="widget-header">
            <Flame className="icon-burn" size={20} />
            <h3>Calories Consumed</h3>
          </div>
          <div className="circle-container">
            <svg className="progress-ring" viewBox="0 0 120 120" width="100%" height="100%" style={{ maxWidth: '120px', maxHeight: '120px' }}>
              <circle className="ring-bg" cx="60" cy="60" r="50" />
              <circle 
                className="ring-bar ring-burn" 
                cx="60" 
                cy="60" 
                r="50" 
                style={{ strokeDashoffset: 314 - (314 * caloriePercent) / 100 }}
              />
            </svg>
            <div className="circle-text">
              <span className="circle-number">{caloriePercent}%</span>
            </div>
          </div>
          <div className="widget-footer">
            <p className="stat-desc">Target: <strong>{userProfile.targetCalories} kcal</strong></p>
            <span className="badge badge-accent">{today.caloriesConsumed} / {userProfile.targetCalories} kcal</span>
          </div>
        </div>

        {/* Hydration Ring */}
        <div className="progress-widget glass-card card-hover-effect">
          <div className="widget-header">
            <Droplet className="icon-hydration" size={20} />
            <h3>Hydration</h3>
          </div>
          <div className="circle-container">
            <svg className="progress-ring" viewBox="0 0 120 120" width="100%" height="100%" style={{ maxWidth: '120px', maxHeight: '120px' }}>
              <circle className="ring-bg" cx="60" cy="60" r="50" />
              <circle 
                className="ring-bar ring-hydration" 
                cx="60" 
                cy="60" 
                r="50" 
                style={{ strokeDashoffset: 314 - (314 * waterPercent) / 100 }}
              />
            </svg>
            <div className="circle-text">
              <span className="circle-number">{waterPercent}%</span>
            </div>
          </div>
          <div className="widget-footer">
            <div className="water-log-controls flex-center">
              <button className="btn btn-outline btn-sm" onClick={() => logWater(250)}>+250ml</button>
              <button className="btn btn-outline btn-sm" onClick={() => logWater(500)}>+500ml</button>
            </div>
            <span className="badge badge-secondary">{today.waterConsumed} / {userProfile.targetWater} ml</span>
          </div>
        </div>

        {/* Active Minutes Ring */}
        <div className="progress-widget glass-card card-hover-effect">
          <div className="widget-header">
            <Clock className="icon-active" size={20} />
            <h3>Active Minutes</h3>
          </div>
          <div className="circle-container">
            <svg className="progress-ring" viewBox="0 0 120 120" width="100%" height="100%" style={{ maxWidth: '120px', maxHeight: '120px' }}>
              <circle className="ring-bg" cx="60" cy="60" r="50" />
              <circle 
                className="ring-bar ring-active" 
                cx="60" 
                cy="60" 
                r="50" 
                style={{ strokeDashoffset: 314 - (314 * activePercent) / 100 }}
              />
            </svg>
            <div className="circle-text">
              <span className="circle-number">{activePercent}%</span>
            </div>
          </div>
          <div className="widget-footer">
            <p className="stat-desc">Daily Target: <strong>60 mins</strong></p>
            <span className="badge badge-primary">{today.workoutMinutes} / 60 mins</span>
          </div>
        </div>
      </section>

      {/* Stats Cards & Quick Logger */}
      <div className="dashboard-grid">
        {/* Quick Log Activities */}
        <div className="glass-card flex-column logger-card card-hover-effect">
          <div className="card-heading flex-between">
            <h3>Quick Activities</h3>
            <Sparkles className="icon-sparkle" size={16} />
          </div>
          <p className="card-desc">Log your active workouts or exercises easily.</p>
          <div className="logger-action-buttons">
            <button className="btn btn-primary" onClick={() => setShowLogModal(true)}>
              <Plus size={18} />
              <span>Log Activity</span>
            </button>
            <div className="quick-hydrate-panel glass-card">
              <span className="hydrate-label">Log Quick Sip</span>
              <div className="hydrate-actions">
                <button className="btn btn-outline" onClick={() => logWater(100)}>+100ml</button>
                <button className="btn btn-outline" onClick={() => logWater(-250)} disabled={today.waterConsumed < 250}>Undo</button>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Card */}
        <div className="glass-card insight-card card-hover-effect">
          <div className="card-heading flex-between">
            <h3>Daily Wellness Tips</h3>
            <TrendingUp size={16} className="text-primary" />
          </div>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-dot dot-primary"></span>
              <p>You have burned <strong>{today.caloriesBurned} kcal</strong> today! Nice work keeping active.</p>
            </div>
            <div className="tip-item">
              <span className="tip-dot dot-secondary"></span>
              {today.waterConsumed >= userProfile.targetWater ? (
                <p>Hydration goal met! You are doing great!</p>
              ) : (
                <p>You still need <strong>{Math.max(0, userProfile.targetWater - today.waterConsumed)} ml</strong> of water to hit your daily goal.</p>
              )}
            </div>
            <div className="tip-item">
              <span className="tip-dot dot-accent"></span>
              <p>Try stretching for 5 minutes after sitting down for long periods.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Log Activity Modal */}
      {showLogModal && (
        <div className="modal-backdrop" onClick={() => setShowLogModal(false)}>
          <div className="modal-content glass-card fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>Log Workout Activity</h2>
              <button className="btn-close" onClick={() => setShowLogModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleQuickWorkoutSubmit}>
              <div className="form-group">
                <label>Workout Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Swimming, Weightlifting" 
                  value={workoutForm.name} 
                  onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                  required 
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={workoutForm.type}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                  >
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (mins)</label>
                  <input 
                    type="number" 
                    placeholder="30" 
                    min="1"
                    value={workoutForm.duration} 
                    onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Calories Burned (optional)</label>
                <input 
                  type="number" 
                  placeholder="Leave empty for auto estimation" 
                  value={workoutForm.caloriesBurned} 
                  onChange={(e) => setWorkoutForm({ ...workoutForm, caloriesBurned: e.target.value })}
                />
              </div>
              <div className="modal-footer flex-end">
                <button type="button" className="btn btn-outline" onClick={() => setShowLogModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
