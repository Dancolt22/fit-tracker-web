import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart 
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Droplet, 
  Flame 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Progress.css';

export default function Progress() {
  const { workouts, nutrition, waterLogs, getPastDateStr } = useApp();

  // Generate historical data for the last 5 days
  const chartData = Array.from({ length: 5 }).map((_, idx) => {
    // Indices 0 to 4 correspond to days from 4 days ago up to today
    const daysAgo = 4 - idx;
    const dateStr = getPastDateStr(daysAgo);

    // Format date for chart axis label (e.g., "Aug 02")
    const dateObj = new Date(dateStr);
    const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

    // Aggregate values for this date
    const dayWorkouts = workouts.filter(w => w.date === dateStr);
    const dayFood = nutrition.filter(n => n.date === dateStr);
    const dayWater = waterLogs.find(w => w.date === dateStr);

    const caloriesConsumed = dayFood.reduce((sum, n) => sum + n.calories, 0);
    const caloriesBurned = dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const minutesActive = dayWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const waterAmount = dayWater ? dayWater.amount : 0;

    return {
      date: label,
      Intake: caloriesConsumed,
      Burned: caloriesBurned,
      Active: minutesActive,
      Water: waterAmount
    };
  });

  // Calculate high-level performance metrics
  const avgIntake = Math.round(chartData.reduce((sum, d) => sum + d.Intake, 0) / chartData.length) || 0;
  const avgBurn = Math.round(chartData.reduce((sum, d) => sum + d.Burned, 0) / chartData.length) || 0;
  const avgActive = Math.round(chartData.reduce((sum, d) => sum + d.Active, 0) / chartData.length) || 0;
  const avgWater = Math.round(chartData.reduce((sum, d) => sum + d.Water, 0) / chartData.length) || 0;

  return (
    <div className="progress-wrapper fade-in">
      <header className="page-header">
        <h1 className="welcome-title">Progress Analytics</h1>
        <p className="welcome-subtitle">Visualize historical health trends, workout volumes, and calorie balances.</p>
      </header>

      {/* Average Performance Metrics */}
      <section className="averages-grid">
        <div className="glass-card stat-card card-hover-effect">
          <div className="card-top flex-between">
            <span className="card-lbl">Avg Calorie Intake</span>
            <Flame className="text-primary" size={16} />
          </div>
          <h2 className="card-val text-primary">{avgIntake} <span className="font-xs-label">kcal / day</span></h2>
        </div>

        <div className="glass-card stat-card card-hover-effect">
          <div className="card-top flex-between">
            <span className="card-lbl">Avg Calorie Burn</span>
            <Flame className="text-accent" size={16} />
          </div>
          <h2 className="card-val text-accent">{avgBurn} <span className="font-xs-label">kcal / day</span></h2>
        </div>

        <div className="glass-card stat-card card-hover-effect">
          <div className="card-top flex-between">
            <span className="card-lbl">Avg Active Time</span>
            <Activity className="text-warning" size={16} />
          </div>
          <h2 className="card-val text-warning">{avgActive} <span className="font-xs-label">mins / day</span></h2>
        </div>

        <div className="glass-card stat-card card-hover-effect">
          <div className="card-top flex-between">
            <span className="card-lbl">Avg Hydration</span>
            <Droplet className="text-secondary" size={16} />
          </div>
          <h2 className="card-val text-secondary">{avgWater} <span className="font-xs-label">ml / day</span></h2>
        </div>
      </section>

      {/* Recharts Sections */}
      <div className="charts-main-grid">
        
        {/* Chart 1: Energy Balance (Intake vs. Burn) */}
        <div className="glass-card chart-container-card card-hover-effect">
          <div className="chart-header flex-between">
            <div>
              <h3>Energy Balance</h3>
              <p>Comparison of logged food calories against burned workout calories.</p>
            </div>
            <TrendingUp size={16} className="text-primary" />
          </div>
          
          <div className="chart-render-area">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#f8fafc' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" fontSize={12} wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="Intake" fill="#10b981" name="Intake (kcal)" radius={[4, 4, 0, 0]} barSize={25} />
                <Line type="monotone" dataKey="Burned" stroke="#f43f5e" strokeWidth={3} name="Burned (kcal)" dot={{ fill: '#f43f5e', r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Active Minutes Consistency */}
        <div className="glass-card chart-container-card card-hover-effect">
          <div className="chart-header flex-between">
            <div>
              <h3>Active Minutes</h3>
              <p>Daily duration of high-intensity and aerobic activities logged.</p>
            </div>
            <Activity size={16} className="text-warning" />
          </div>

          <div className="chart-render-area">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#f8fafc' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="Active" fill="#f59e0b" name="Active Time (mins)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Hydration Trends */}
        <div className="glass-card chart-container-card full-width-chart card-hover-effect">
          <div className="chart-header flex-between">
            <div>
              <h3>Hydration Volumes</h3>
              <p>Daily intake tracking of water logged in milliliters.</p>
            </div>
            <Droplet size={16} className="text-secondary" />
          </div>

          <div className="chart-render-area">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#f8fafc' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
                <Area type="monotone" dataKey="Water" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" strokeWidth={2} name="Water (ml)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
