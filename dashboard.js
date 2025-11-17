const dailyData = {
  steps: 7850,
  stepsGoal: 10000,
  calories: 1850,
  caloriesGoal: 2500,
  water: 6,
  waterGoal: 8,
  activeMinutes: 45,
  weeklyAvgSteps: 8200,
  streakDays: 12
};

function updateClock() {
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  document.getElementById('liveClock').textContent = now.toLocaleTimeString('en-US', options);
}

function setCircularProgress(circleId, value, goal) {
  const circle = document.getElementById(circleId);
  const percentage = Math.min((value / goal) * 100, 100);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (percentage / 100) * circumference;

  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 100);
}

function animateValue(elementId, start, end, duration) {
  const element = document.getElementById(elementId);
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;
    if (current === end) {
      clearInterval(timer);
    }
  }, stepTime);
}

function initDashboard() {
  updateClock();
  setInterval(updateClock, 1000);

  animateValue('stepsValue', 0, dailyData.steps, 1500);
  animateValue('caloriesValue', 0, dailyData.calories, 1500);
  animateValue('waterValue', 0, dailyData.water, 1500);
  animateValue('activeMinutes', 0, dailyData.activeMinutes, 1500);
  animateValue('weeklyAvgSteps', 0, dailyData.weeklyAvgSteps, 1500);
  animateValue('streakDays', 0, dailyData.streakDays, 1500);

  setCircularProgress('stepsCircle', dailyData.steps, dailyData.stepsGoal);
  setCircularProgress('caloriesCircle', dailyData.calories, dailyData.caloriesGoal);
  setCircularProgress('waterCircle', dailyData.water, dailyData.waterGoal);
}

document.addEventListener('DOMContentLoaded', initDashboard);
