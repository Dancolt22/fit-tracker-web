import React, { useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  Plus, 
  Trash2, 
  Search,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Workouts.css';

// A mock library of standard exercises to guide the user/student
const PRESET_EXERCISES = [
  { name: 'Running (Outdoor)', type: 'cardio', caloriesPerMin: 10 },
  { name: 'Weightlifting (Hypertrophy)', type: 'strength', caloriesPerMin: 5.5 },
  { name: 'HIIT Workout', type: 'cardio', caloriesPerMin: 11 },
  { name: 'Yoga Vinyasa', type: 'flexibility', caloriesPerMin: 4 },
  { name: 'Bicycling (Moderate)', type: 'cardio', caloriesPerMin: 8 },
  { name: 'Bodyweight Calisthenics', type: 'strength', caloriesPerMin: 6.5 },
  { name: 'Pilates Workout', type: 'flexibility', caloriesPerMin: 4.5 },
  { name: 'Swimming (Freestyle)', type: 'cardio', caloriesPerMin: 9.5 }
];

export default function Workouts() {
  const { workouts, addWorkout, deleteWorkout, userProfile } = useApp();
  
  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('cardio');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  
  // Search state for preset exercises
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate summaries
  const totalWorkouts = workouts.length;
  const totalBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !duration) return;

    const durationNum = parseInt(duration, 10);
    const estCalories = caloriesBurned 
      ? parseInt(caloriesBurned, 10) 
      : Math.round(durationNum * (type === 'strength' ? 6 : type === 'flexibility' ? 4.5 : 9));

    addWorkout({
      name,
      type,
      duration: durationNum,
      caloriesBurned: estCalories
    });

    // Reset Form
    setName('');
    setType('cardio');
    setDuration('');
    setCaloriesBurned('');
  };

  const handleSelectPreset = (preset) => {
    setName(preset.name);
    setType(preset.type);
    if (duration) {
      // Calculate suggested calories based on preset
      const min = parseInt(duration, 10);
      setCaloriesBurned(Math.round(min * preset.caloriesPerMin));
    }
  };

  // Recalculate suggested calories if duration change
  const handleDurationChange = (e) => {
    const val = e.target.value;
    setDuration(val);
    
    // If a preset is currently loaded, calculate estimated burn dynamically
    const matchedPreset = PRESET_EXERCISES.find(p => p.name === name);
    if (matchedPreset && val) {
      setCaloriesBurned(Math.round(parseInt(val, 10) * matchedPreset.caloriesPerMin));
    }
  };

  // Filter preset exercises
  const filteredPresets = PRESET_EXERCISES.filter(preset => 
    preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    preset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="workouts-wrapper fade-in">
      <header className="page-header">
        <h1 className="welcome-title">Workout Tracker</h1>
        <p className="welcome-subtitle">Log physical activities and track energy output.</p>
      </header>

      {/* Workout Stat Cards */}
      <section className="workouts-summary-grid">
        <div className="glass-card summary-card card-hover-effect">
          <div className="summary-icon bg-accent-glow text-accent">
            <Flame size={24} />
          </div>
          <div className="summary-data">
            <span className="summary-val">{totalBurned}</span>
            <span className="summary-lbl">Total kcal Burned</span>
          </div>
        </div>

        <div className="glass-card summary-card card-hover-effect">
          <div className="summary-icon bg-primary-glow text-primary">
            <Dumbbell size={24} />
          </div>
          <div className="summary-data">
            <span className="summary-val">{totalWorkouts}</span>
            <span className="summary-lbl">Logged Workouts</span>
          </div>
        </div>

        <div className="glass-card summary-card card-hover-effect">
          <div className="summary-icon bg-secondary-glow text-secondary">
            <Clock size={24} />
          </div>
          <div className="summary-data">
            <span className="summary-val">{totalDuration} min</span>
            <span className="summary-lbl">Total Active Time</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Form / Presets on Left, History table on Right */}
      <div className="workouts-content-grid">
        
        {/* Left Side: Logger Form & Presets */}
        <div className="workouts-actions-sidebar">
          {/* Logger Form */}
          <div className="glass-card log-form-card">
            <h3>Log a Workout</h3>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="form-group">
                <label>Workout Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Speed Running, Weightlifting" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label>Exercise Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (mins)</label>
                  <input 
                    type="number" 
                    placeholder="30" 
                    min="1" 
                    value={duration} 
                    onChange={handleDurationChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Calories Burned (kcal)</label>
                  <input 
                    type="number" 
                    placeholder="Auto estimated" 
                    min="1"
                    value={caloriesBurned} 
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                <Plus size={18} />
                <span>Log Exercise</span>
              </button>
            </form>
          </div>

          {/* Quick Presets Search */}
          <div className="glass-card presets-card">
            <div className="flex-between preset-header">
              <h3>Quick Guide & Presets</h3>
              <Sparkles size={16} className="text-warning" />
            </div>
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search presets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="presets-list">
              {filteredPresets.map((preset) => (
                <div 
                  key={preset.name} 
                  className="preset-item flex-between"
                  onClick={() => handleSelectPreset(preset)}
                >
                  <div>
                    <span className="preset-name">{preset.name}</span>
                    <span className={`badge badge-sm font-xs ${
                      preset.type === 'strength' ? 'badge-primary' : 
                      preset.type === 'flexibility' ? 'badge-warning' : 'badge-accent'
                    }`}>{preset.type}</span>
                  </div>
                  <span className="preset-kcal">{preset.caloriesPerMin} kcal/m</span>
                </div>
              ))}
              {filteredPresets.length === 0 && (
                <p className="no-results">No presets match your search.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Log History Table */}
        <div className="glass-card history-card">
          <h3>Workout History</h3>
          <p className="history-desc">Review your logged workouts. Delete logs using the actions column.</p>
          
          <div className="history-table-container">
            {workouts.length > 0 ? (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Energy Burned</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout.id} className="history-row">
                      <td className="col-date">
                        <div className="date-cell">
                          <Calendar size={14} className="text-secondary" />
                          <span>{workout.date}</span>
                        </div>
                      </td>
                      <td className="col-name">{workout.name}</td>
                      <td>
                        <span className={`badge ${
                          workout.type === 'strength' ? 'badge-primary' : 
                          workout.type === 'flexibility' ? 'badge-warning' : 'badge-accent'
                        }`}>
                          {workout.type}
                        </span>
                      </td>
                      <td>
                        <div className="duration-cell">
                          <Clock size={14} className="text-secondary" />
                          <span>{workout.duration} mins</span>
                        </div>
                      </td>
                      <td className="col-calories font-bold text-accent">
                        {workout.caloriesBurned} kcal
                      </td>
                      <td>
                        <button 
                          className="btn-delete"
                          onClick={() => deleteWorkout(workout.id)}
                          title="Delete workout entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-history flex-center">
                <Dumbbell size={48} className="icon-empty animate-pulse-slow" />
                <h4>No workouts logged yet</h4>
                <p>Use the logging form on the left or click a preset to log your first activity!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
