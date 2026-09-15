/**
 * Daily Streak Manager for SignVerse
 * Calculates and updates user login / learning streak based on calendar days.
 */

export const updateStreak = () => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const lastDate = localStorage.getItem('lastStreakDate');
    let currentStreak = parseInt(localStorage.getItem('userStreak'), 10) || 0;

    if (!lastDate) {
      // First time user / new streak initialization
      currentStreak = 1;
    } else if (lastDate === today) {
      // Logged in on the same day: Keep existing streak (min 1)
      currentStreak = currentStreak > 0 ? currentStreak : 1;
    } else {
      // Check difference in days
      const lastLogin = new Date(lastDate);
      const currentLogin = new Date(today);
      const diffTime = currentLogin.getTime() - lastLogin.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive next-day login: Increment streak
        currentStreak += 1;
      } else if (diffDays > 1) {
        // Missed one or more days: Reset streak to 1
        currentStreak = 1;
      }
    }

    localStorage.setItem('userStreak', currentStreak.toString());
    localStorage.setItem('lastStreakDate', today);
    return currentStreak;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 1;
  }
};

export const getStreak = () => {
  return parseInt(localStorage.getItem('userStreak'), 10) || 1;
};
