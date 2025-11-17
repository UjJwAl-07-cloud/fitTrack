const weeklyData = {
  activities: [
    { day: 'Mon', duration: 45, calories: 450, steps: 8500 },
    { day: 'Tue', duration: 60, calories: 600, steps: 9200 },
    { day: 'Wed', duration: 30, calories: 350, steps: 7100 },
    { day: 'Thu', duration: 75, calories: 750, steps: 10500 },
    { day: 'Fri', duration: 50, calories: 500, steps: 8800 },
    { day: 'Sat', duration: 90, calories: 850, steps: 12000 },
    { day: 'Sun', duration: 40, calories: 400, steps: 7800 }
  ],
  calorieComparison: [
    { day: 'Mon', intake: 2100, burned: 450 },
    { day: 'Tue', intake: 2300, burned: 600 },
    { day: 'Wed', intake: 1900, burned: 350 },
    { day: 'Thu', intake: 2400, burned: 750 },
    { day: 'Fri', intake: 2200, burned: 500 },
    { day: 'Sat', intake: 2600, burned: 850 },
    { day: 'Sun', intake: 2000, burned: 400 }
  ]
};

function createBarChart(containerId, data, dataKey, color, maxValue = null) {
  const container = document.getElementById(containerId);
  const max = maxValue || Math.max(...data.map(item => item[dataKey]));

  container.innerHTML = data.map(item => {
    const percentage = (item[dataKey] / max) * 100;
    return `
      <div class="chart-bar" style="height: ${percentage}%; background: ${color};">
        <span class="bar-value">${item[dataKey]}</span>
      </div>
    `;
  }).join('');

  const labels = data.map(item => `<div class="bar-label">${item.day}</div>`).join('');
  container.innerHTML += `<div style="display: flex; width: 100%; justify-content: space-around; gap: 0.5rem;">${labels}</div>`;
}

function createComparisonChart() {
  const container = document.getElementById('comparisonChart');
  const maxValue = Math.max(
    ...weeklyData.calorieComparison.flatMap(item => [item.intake, item.burned])
  );

  container.innerHTML = weeklyData.calorieComparison.map(item => {
    const intakePercentage = (item.intake / maxValue) * 100;
    const burnedPercentage = (item.burned / maxValue) * 100;

    return `
      <div class="comparison-bar-group">
        <div class="comparison-label">${item.day}</div>
        <div class="comparison-bars">
          <div class="comparison-bar" style="width: ${intakePercentage}%; background: #FF5722;">
            ${item.intake}
          </div>
          <div class="comparison-bar" style="width: ${burnedPercentage}%; background: #4CAF50;">
            ${item.burned}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function calculateSummaryStats() {
  const totalActivities = weeklyData.activities.length;
  const totalCaloriesBurned = weeklyData.activities.reduce((sum, day) => sum + day.calories, 0);
  const avgDailySteps = Math.round(
    weeklyData.activities.reduce((sum, day) => sum + day.steps, 0) / weeklyData.activities.length
  );

  const maxActivityDay = weeklyData.activities.reduce((max, day) =>
    day.duration > max.duration ? day : max
  );

  document.getElementById('totalActivities').textContent = totalActivities;
  document.getElementById('totalCaloriesBurned').textContent = totalCaloriesBurned;
  document.getElementById('avgDailySteps').textContent = avgDailySteps.toLocaleString();
  document.getElementById('mostActiveDay').textContent = maxActivityDay.day;
}

function downloadSummary() {
  const modal = document.getElementById('downloadModal');
  modal.classList.add('show');

  console.log('Summary Data:', {
    weeklyData,
    totalActivities: document.getElementById('totalActivities').textContent,
    totalCaloriesBurned: document.getElementById('totalCaloriesBurned').textContent,
    avgDailySteps: document.getElementById('avgDailySteps').textContent,
    mostActiveDay: document.getElementById('mostActiveDay').textContent
  });
}

function resetDashboard() {
  const modal = document.getElementById('resetModal');
  modal.classList.add('show');
}

function confirmReset() {
  localStorage.removeItem('fittrack_activities');
  localStorage.removeItem('fittrack_meals');

  sessionStorage.clear();

  const modal = document.getElementById('resetModal');
  modal.classList.remove('show');

  alert('Dashboard has been reset! Redirecting to home page...');
  window.location.href = '/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  createBarChart('activityChart', weeklyData.activities, 'duration', '#4CAF50', 100);
  createBarChart('caloriesChart', weeklyData.activities, 'calories', '#FF9800', 1000);
  createBarChart('stepsChart', weeklyData.activities, 'steps', '#2196F3', 15000);
  createComparisonChart();
  calculateSummaryStats();

  document.getElementById('downloadBtn').addEventListener('click', downloadSummary);
  document.getElementById('resetBtn').addEventListener('click', resetDashboard);
  document.getElementById('confirmReset').addEventListener('click', confirmReset);

  document.getElementById('closeDownloadModal').addEventListener('click', () => {
    document.getElementById('downloadModal').classList.remove('show');
  });

  document.getElementById('cancelReset').addEventListener('click', () => {
    document.getElementById('resetModal').classList.remove('show');
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
    }
  });
});
