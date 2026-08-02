import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Apple, 
  Flame, 
  Activity, 
  TrendingDown, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Nutrition.css';

export default function Nutrition() {
  const { nutrition, addFoodEntry, deleteFoodEntry, userProfile, getTodayStats } = useApp();
  const today = getTodayStats();

  // Modal toggle & form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [foodForm, setFoodForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  // Dynamic calculations
  const totalCalories = today.caloriesConsumed;
  const remainingCalories = userProfile.targetCalories - totalCalories;
  
  // Suggested target macros (standard ratios)
  const targetProtein = Math.round(userProfile.weight * 2.0); // 2g per kg
  const targetFat = Math.round((userProfile.targetCalories * 0.25) / 9); // 25% of calories
  const targetCarbs = Math.round((userProfile.targetCalories - (targetProtein * 4) - (targetFat * 9)) / 4);

  const proteinPercent = Math.min(100, Math.round((today.proteinConsumed / targetProtein) * 100)) || 0;
  const carbsPercent = Math.min(100, Math.round((today.carbsConsumed / targetCarbs) * 100)) || 0;
  const fatPercent = Math.min(100, Math.round((today.fatConsumed / targetFat) * 100)) || 0;

  // Filter food items logged TODAY
  const getTodayMealsByType = (type) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return nutrition.filter(n => n.date === todayStr && n.mealType === type);
  };

  const handleOpenAddModal = (mealType) => {
    setActiveMealType(mealType);
    setShowAddModal(true);
  };

  const handleAddFoodSubmit = (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.calories) return;

    addFoodEntry({
      name: foodForm.name,
      mealType: activeMealType,
      calories: parseInt(foodForm.calories, 10),
      protein: foodForm.protein ? parseInt(foodForm.protein, 10) : 0,
      carbs: foodForm.carbs ? parseInt(foodForm.carbs, 10) : 0,
      fat: foodForm.fat ? parseInt(foodForm.fat, 10) : 0
    });

    // Reset Form
    setFoodForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowAddModal(false);
  };

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', desc: 'First meal of the day' },
    { id: 'lunch', label: 'Lunch', desc: 'Mid-day meal' },
    { id: 'dinner', label: 'Dinner', desc: 'Evening meal' },
    { id: 'snack', label: 'Snacks & Extras', desc: 'Bites between meals' }
  ];

  return (
    <div className="nutrition-wrapper fade-in">
      <header className="page-header">
        <h1 className="welcome-title">Nutrition Tracker</h1>
        <p className="welcome-subtitle">Log meals, balance macronutrients, and monitor your calorie budget.</p>
      </header>

      {/* Calories Budget Dashboard */}
      <section className="budget-dashboard glass-card">
        <div className="budget-primary-panel">
          <div className="budget-formula">
            <div className="formula-block">
              <span className="formula-num">{userProfile.targetCalories}</span>
              <span className="formula-lbl">Goal Limit</span>
            </div>
            <span className="formula-sign">-</span>
            <div className="formula-block">
              <span className="formula-num text-primary">{totalCalories}</span>
              <span className="formula-lbl">Food Intake</span>
            </div>
            <span className="formula-sign">=</span>
            <div className="formula-block">
              <span className={`formula-num ${remainingCalories >= 0 ? 'text-secondary' : 'text-accent'}`}>
                {remainingCalories}
              </span>
              <span className="formula-lbl">Remaining</span>
            </div>
          </div>
          
          <div className="budget-progress-bar-container">
            <div 
              className={`budget-progress-bar ${remainingCalories < 0 ? 'bg-accent' : 'bg-primary'}`} 
              style={{ width: `${Math.min(100, (totalCalories / userProfile.targetCalories) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Macro trackers */}
        <div className="macros-breakdown-grid">
          <div className="macro-bar-widget">
            <div className="flex-between font-sm">
              <span className="macro-name">Protein</span>
              <span className="macro-val">{today.proteinConsumed}g / {targetProtein}g</span>
            </div>
            <div className="macro-bar-track">
              <div className="macro-bar-fill fill-protein" style={{ width: `${proteinPercent}%` }}></div>
            </div>
          </div>

          <div className="macro-bar-widget">
            <div className="flex-between font-sm">
              <span className="macro-name">Carbohydrates</span>
              <span className="macro-val">{today.carbsConsumed}g / {targetCarbs}g</span>
            </div>
            <div className="macro-bar-track">
              <div className="macro-bar-fill fill-carbs" style={{ width: `${carbsPercent}%` }}></div>
            </div>
          </div>

          <div className="macro-bar-widget">
            <div className="flex-between font-sm">
              <span className="macro-name">Fats</span>
              <span className="macro-val">{today.fatConsumed}g / {targetFat}g</span>
            </div>
            <div className="macro-bar-track">
              <div className="macro-bar-fill fill-fat" style={{ width: `${fatPercent}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Meal Logs */}
      <section className="meal-categories-grid">
        {mealTypes.map((type) => {
          const meals = getTodayMealsByType(type.id);
          const mealCalories = meals.reduce((sum, m) => sum + m.calories, 0);

          return (
            <div key={type.id} className="glass-card meal-category-card card-hover-effect">
              <div className="meal-card-header flex-between">
                <div>
                  <h3 className="meal-label">{type.label}</h3>
                  <p className="meal-desc">{type.desc}</p>
                </div>
                <div className="flex-center gap-sm">
                  <span className="meal-kcal-sum">{mealCalories} kcal</span>
                  <button 
                    className="btn-add-food bg-primary-glow text-primary"
                    onClick={() => handleOpenAddModal(type.id)}
                    title={`Add food to ${type.label}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Food Items List */}
              <div className="meals-list">
                {meals.length > 0 ? (
                  meals.map((food) => (
                    <div key={food.id} className="food-item flex-between">
                      <div className="food-info">
                        <span className="food-name">{food.name}</span>
                        <div className="food-macros font-xs">
                          <span>P: {food.protein}g</span> &bull; 
                          <span>C: {food.carbs}g</span> &bull; 
                          <span>F: {food.fat}g</span>
                        </div>
                      </div>
                      <div className="food-actions flex-center">
                        <span className="food-calories">{food.calories} kcal</span>
                        <button 
                          className="btn-delete-food"
                          onClick={() => deleteFoodEntry(food.id)}
                          title="Delete food entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-meal flex-center">
                    <Apple size={28} className="icon-empty-meal" />
                    <span>No food logged</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content glass-card fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>Log Food for {mealTypes.find(t => t.id === activeMealType)?.label}</h2>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddFoodSubmit}>
              <div className="form-group">
                <label>Food Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Scrambled Eggs, Avocado Toast" 
                  value={foodForm.name} 
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Calories (kcal)</label>
                <input 
                  type="number" 
                  placeholder="250" 
                  min="0"
                  value={foodForm.calories} 
                  onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                  required 
                />
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    value={foodForm.protein} 
                    onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    value={foodForm.carbs} 
                    onChange={(e) => setFoodForm({ ...foodForm, carbs: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Fat (g)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    value={foodForm.fat} 
                    onChange={(e) => setFoodForm({ ...foodForm, fat: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Food</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
