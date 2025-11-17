let activities = [
  { id: 1, name: 'Morning Run', duration: 30, calories: 350, time: 'morning' },
  { id: 2, name: 'Yoga Session', duration: 45, calories: 200, time: 'morning' },
  { id: 3, name: 'Cycling', duration: 60, calories: 500, time: 'afternoon' },
  { id: 4, name: 'Swimming', duration: 40, calories: 400, time: 'afternoon' },
  { id: 5, name: 'Weight Training', duration: 50, calories: 300, time: 'evening' },
  { id: 6, name: 'Walking', duration: 25, calories: 150, time: 'evening' }
];

let currentFilter = 'all';
let nextId = 7;

const modal = document.getElementById('addActivityModal');
const successModal = document.getElementById('successModal');
const addBtn = document.getElementById('addActivityBtn');
const closeBtn = document.getElementById('closeModal');
const closeSuccessBtn = document.getElementById('closeSuccessModal');
const form = document.getElementById('activityForm');

function renderActivities(filter = 'all') {
  const activitiesList = document.getElementById('activitiesList');

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(activity => activity.time === filter);

  if (filteredActivities.length === 0) {
    activitiesList.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: white; font-size: 1.2rem;">
        No activities found for this filter.
      </div>
    `;
    return;
  }

  activitiesList.innerHTML = filteredActivities.map(activity => `
    <div class="activity-item">
      <div class="activity-info">
        <h3>${activity.name}</h3>
        <div class="activity-details">
          <span>⏱️ ${activity.duration} minutes</span>
          <span>🔥 ${activity.calories} kcal</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span class="activity-badge ${activity.time}">${activity.time}</span>
        <button class="btn-delete" onclick="deleteActivity(${activity.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function deleteActivity(id) {
  activities = activities.filter(activity => activity.id !== id);
  saveActivities();
  renderActivities(currentFilter);
}

function saveActivities() {
  localStorage.setItem('fittrack_activities', JSON.stringify(activities));
}

function loadActivities() {
  const stored = localStorage.getItem('fittrack_activities');
  if (stored) {
    activities = JSON.parse(stored);
    if (activities.length > 0) {
      nextId = Math.max(...activities.map(a => a.id)) + 1;
    }
  }
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderActivities(currentFilter);
  });
});

addBtn.addEventListener('click', () => {
  modal.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});

closeSuccessBtn.addEventListener('click', () => {
  successModal.classList.remove('show');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
  if (e.target === successModal) {
    successModal.classList.remove('show');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('activityName').value.trim();
  const duration = parseInt(document.getElementById('activityDuration').value);
  const calories = parseInt(document.getElementById('activityCalories').value);
  const time = document.getElementById('activityTime').value;

  if (!name || !duration || !calories || !time) {
    alert('Please fill in all fields correctly.');
    return;
  }

  if (duration < 1) {
    alert('Duration must be at least 1 minute.');
    return;
  }

  if (calories < 1) {
    alert('Calories must be at least 1.');
    return;
  }

  const newActivity = {
    id: nextId++,
    name,
    duration,
    calories,
    time
  };

  activities.push(newActivity);
  saveActivities();
  renderActivities(currentFilter);

  form.reset();
  modal.classList.remove('show');
  successModal.classList.add('show');
});

window.deleteActivity = deleteActivity;

loadActivities();
renderActivities();
