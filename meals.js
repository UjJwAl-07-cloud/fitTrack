let meals = {
  breakfast: [
    { id: 1, name: 'Oatmeal with Berries', calories: 250 },
    { id: 2, name: 'Greek Yogurt', calories: 150 },
    { id: 3, name: 'Orange Juice', calories: 110 }
  ],
  lunch: [
    { id: 4, name: 'Grilled Chicken Salad', calories: 400 },
    { id: 5, name: 'Brown Rice', calories: 220 },
    { id: 6, name: 'Steamed Broccoli', calories: 55 }
  ],
  dinner: [
    { id: 7, name: 'Baked Salmon', calories: 350 },
    { id: 8, name: 'Quinoa', calories: 180 },
    { id: 9, name: 'Mixed Vegetables', calories: 90 }
  ]
};

let nextId = 10;
let currentMealType = '';

const modal = document.getElementById('addMealModal');
const closeBtn = document.getElementById('closeMealModal');
const form = document.getElementById('mealForm');

function calculateTotalCalories() {
  const total = Object.values(meals).flat().reduce((sum, item) => sum + item.calories, 0);
  document.getElementById('totalCalories').textContent = total;
}

function calculateMealTotal(mealType) {
  const total = meals[mealType].reduce((sum, item) => sum + item.calories, 0);
  document.getElementById(`${mealType}Total`).textContent = total;
}

function renderMeals() {
  ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
    const container = document.getElementById(`${mealType}Items`);

    if (meals[mealType].length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #999;">
          No items added yet
        </div>
      `;
    } else {
      container.innerHTML = meals[mealType].map(item => `
        <div class="meal-item">
          <span class="meal-item-name">${item.name}</span>
          <div>
            <span class="meal-item-calories">${item.calories} kcal</span>
            <button class="btn-remove-meal" onclick="removeMeal('${mealType}', ${item.id})">Remove</button>
          </div>
        </div>
      `).join('');
    }

    calculateMealTotal(mealType);
  });

  calculateTotalCalories();
}

function removeMeal(mealType, itemId) {
  meals[mealType] = meals[mealType].filter(item => item.id !== itemId);
  saveMeals();
  renderMeals();
}

function saveMeals() {
  localStorage.setItem('fittrack_meals', JSON.stringify(meals));
}

function loadMeals() {
  const stored = localStorage.getItem('fittrack_meals');
  if (stored) {
    meals = JSON.parse(stored);
    const allIds = Object.values(meals).flat().map(item => item.id);
    if (allIds.length > 0) {
      nextId = Math.max(...allIds) + 1;
    }
  }
}

document.querySelectorAll('.btn-add-meal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    currentMealType = e.target.dataset.meal;
    modal.classList.add('show');
  });
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('mealItemName').value.trim();
  const calories = parseInt(document.getElementById('mealItemCalories').value);

  if (!name || !calories) {
    alert('Please fill in all fields correctly.');
    return;
  }

  if (calories < 1) {
    alert('Calories must be at least 1.');
    return;
  }

  const newItem = {
    id: nextId++,
    name,
    calories
  };

  meals[currentMealType].push(newItem);
  saveMeals();
  renderMeals();

  form.reset();
  modal.classList.remove('show');
});

window.removeMeal = removeMeal;

loadMeals();
renderMeals();
