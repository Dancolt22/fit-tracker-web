import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AppContext = createContext();

// Dynamic date helpers to generate realistic demo data relative to today
const getPastDateStr = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const DEFAULT_PROFILE = {
  name: 'Alex Johnson',
  age: 27,
  weight: 76, // in kg
  targetCalories: 2200,
  targetWater: 2500, // ml
  targetWorkouts: 4, // per week
  targetSleep: 8 // hours
};

const DEFAULT_WORKOUTS = [
  { id: 'w1', name: 'Morning Trail Run', type: 'cardio', duration: 45, caloriesBurned: 450, date: getPastDateStr(4) },
  { id: 'w2', name: 'Upper Body Hypertrophy', type: 'strength', duration: 60, caloriesBurned: 350, date: getPastDateStr(3) },
  { id: 'w3', name: 'Hatha Yoga Session', type: 'flexibility', duration: 30, caloriesBurned: 120, date: getPastDateStr(2) },
  { id: 'w4', name: 'Evening Cycling', type: 'cardio', duration: 40, caloriesBurned: 380, date: getPastDateStr(1) },
  { id: 'w5', name: 'HIIT Cardio Circuit', type: 'cardio', duration: 30, caloriesBurned: 320, date: getPastDateStr(0) }
];

const DEFAULT_NUTRITION = [
  // 4 Days ago
  { id: 'n1', name: 'Oatmeal with Blueberries & Honey', mealType: 'breakfast', calories: 380, protein: 12, carbs: 65, fat: 8, date: getPastDateStr(4) },
  { id: 'n2', name: 'Grilled Chicken Salad', mealType: 'lunch', calories: 550, protein: 42, carbs: 15, fat: 22, date: getPastDateStr(4) },
  { id: 'n3', name: 'Baked Salmon with Sweet Potato', mealType: 'dinner', calories: 680, protein: 45, carbs: 40, fat: 26, date: getPastDateStr(4) },
  { id: 'n4', name: 'Greek Yogurt & Almonds', mealType: 'snack', calories: 250, protein: 18, carbs: 12, fat: 14, date: getPastDateStr(4) },
  
  // 3 Days ago
  { id: 'n5', name: 'Scrambled Eggs & Avocado Toast', mealType: 'breakfast', calories: 420, protein: 22, carbs: 32, fat: 24, date: getPastDateStr(3) },
  { id: 'n6', name: 'Quinoa & Black Bean Bowl', mealType: 'lunch', calories: 480, protein: 18, carbs: 68, fat: 12, date: getPastDateStr(3) },
  { id: 'n7', name: 'Lean Beef Sirloin & Broccoli', mealType: 'dinner', calories: 720, protein: 55, carbs: 15, fat: 34, date: getPastDateStr(3) },
  
  // 2 Days ago
  { id: 'n8', name: 'Protein Shake & Banana', mealType: 'breakfast', calories: 310, protein: 30, carbs: 38, fat: 4, date: getPastDateStr(2) },
  { id: 'n9', name: 'Turkey Wrap', mealType: 'lunch', calories: 450, protein: 28, carbs: 35, fat: 15, date: getPastDateStr(2) },
  { id: 'n10', name: 'Pasta Primavera with Chicken', mealType: 'dinner', calories: 690, protein: 38, carbs: 75, fat: 18, date: getPastDateStr(2) },

  // 1 Day ago
  { id: 'n11', name: 'Berry Smoothie Bowl', mealType: 'breakfast', calories: 340, protein: 8, carbs: 62, fat: 6, date: getPastDateStr(1) },
  { id: 'n12', name: 'Tuna Salad Wrap', mealType: 'lunch', calories: 430, protein: 32, carbs: 28, fat: 14, date: getPastDateStr(1) },
  { id: 'n13', name: 'Steak & Roasted Vegetables', mealType: 'dinner', calories: 750, protein: 48, carbs: 25, fat: 38, date: getPastDateStr(1) },
  { id: 'n14', name: 'Mixed Berries & Dark Chocolate', mealType: 'snack', calories: 180, protein: 2, carbs: 22, fat: 10, date: getPastDateStr(1) },

  // Today
  { id: 'n15', name: 'Peanut Butter Toast & Protein Shake', mealType: 'breakfast', calories: 450, protein: 35, carbs: 45, fat: 16, date: getPastDateStr(0) },
  { id: 'n16', name: 'Brown Rice & Chicken Breast', mealType: 'lunch', calories: 600, protein: 48, carbs: 55, fat: 12, date: getPastDateStr(0) }
];

const DEFAULT_WATER = [
  { date: getPastDateStr(4), amount: 2000 },
  { date: getPastDateStr(3), amount: 2600 },
  { date: getPastDateStr(2), amount: 1800 },
  { date: getPastDateStr(1), amount: 3000 },
  { date: getPastDateStr(0), amount: 1250 } // Hydration progress for today
];

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('fittrack_theme', 'dark');
  const [userProfile, setUserProfile] = useLocalStorage('fittrack_profile', DEFAULT_PROFILE);
  const [workouts, setWorkouts] = useLocalStorage('fittrack_workouts', DEFAULT_WORKOUTS);
  const [nutrition, setNutrition] = useLocalStorage('fittrack_nutrition', DEFAULT_NUTRITION);
  const [waterLogs, setWaterLogs] = useLocalStorage('fittrack_water', DEFAULT_WATER);

  // Sync theme changes with the DOM element for CSS styling rules
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateProfile = (updatedProfile) => {
    setUserProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  // Workout Actions
  const addWorkout = (workout) => {
    const newWorkout = {
      id: 'w_' + Math.random().toString(36).substr(2, 9),
      date: getPastDateStr(0), // default to today
      ...workout
    };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  // Nutrition Actions
  const addFoodEntry = (food) => {
    const newFood = {
      id: 'n_' + Math.random().toString(36).substr(2, 9),
      date: getPastDateStr(0), // default to today
      ...food
    };
    setNutrition(prev => [newFood, ...prev]);
  };

  const deleteFoodEntry = (id) => {
    setNutrition(prev => prev.filter(n => n.id !== id));
  };

  // Water Actions
  const logWater = (amount) => {
    const todayStr = getPastDateStr(0);
    setWaterLogs(prev => {
      const todayIndex = prev.findIndex(log => log.date === todayStr);
      if (todayIndex > -1) {
        // Update today's entry
        const updated = [...prev];
        updated[todayIndex] = {
          ...updated[todayIndex],
          amount: Math.max(0, updated[todayIndex].amount + amount)
        };
        return updated;
      } else {
        // Create new entry for today
        return [...prev, { date: todayStr, amount }];
      }
    });
  };

  // Helper values
  const getTodayStats = () => {
    const todayStr = getPastDateStr(0);

    const todayWorkouts = workouts.filter(w => w.date === todayStr);
    const todayFood = nutrition.filter(n => n.date === todayStr);
    const todayWaterLog = waterLogs.find(w => w.date === todayStr);

    const caloriesBurned = todayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const workoutMinutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
    
    const caloriesConsumed = todayFood.reduce((sum, n) => sum + n.calories, 0);
    const proteinConsumed = todayFood.reduce((sum, n) => sum + n.protein, 0);
    const carbsConsumed = todayFood.reduce((sum, n) => sum + n.carbs, 0);
    const fatConsumed = todayFood.reduce((sum, n) => sum + n.fat, 0);

    const waterConsumed = todayWaterLog ? todayWaterLog.amount : 0;

    return {
      caloriesBurned,
      workoutMinutes,
      caloriesConsumed,
      proteinConsumed,
      carbsConsumed,
      fatConsumed,
      waterConsumed
    };
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      userProfile,
      updateProfile,
      workouts,
      addWorkout,
      deleteWorkout,
      nutrition,
      addFoodEntry,
      deleteFoodEntry,
      waterLogs,
      logWater,
      getTodayStats,
      getPastDateStr
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
