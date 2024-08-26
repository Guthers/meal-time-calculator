document.getElementById("wakeup-time").addEventListener("input", () => {
  calculateMealTimes();
  createHourLines();
  updateIndicator();
});

const MEAL_BREAKFAST = "Breakfast";
const MEAL_MMS = "Mid-morning Snack";
const MEAL_LUNCH = "Lunch";
const MEAL_AS = "Afternoon Snack";
const MEAL_DINNER = "Dinner";

const getMealTimes = (wakeupTime) => {
  const breakfastTime = new Date(wakeupTime.getTime() + 1 * 60 * 60 * 1000);
  const midMorningSnackTime = new Date(
    breakfastTime.getTime() + 3 * 60 * 60 * 1000
  );
  const lunchTime = new Date(breakfastTime.getTime() + 5 * 60 * 60 * 1000);
  const arvoSnackTime = new Date(lunchTime.getTime() + 3 * 60 * 60 * 1000);
  const dinnerTime = new Date(lunchTime.getTime() + 5 * 60 * 60 * 1000);

  return {
    [MEAL_BREAKFAST]: {
      time: breakfastTime,
      rangeStart: wakeupTime,
      rangeEnd: new Date(wakeupTime.getTime() + 1 * 60 * 60 * 1000),
    },
    [MEAL_MMS]: {
      time: midMorningSnackTime,
      rangeStart: new Date(breakfastTime.getTime() + 2 * 60 * 60 * 1000),
      rangeEnd: new Date(breakfastTime.getTime() + 3 * 60 * 60 * 1000),
    },
    [MEAL_LUNCH]: {
      time: lunchTime,
      rangeStart: new Date(breakfastTime.getTime() + 4 * 60 * 60 * 1000),
      rangeEnd: new Date(breakfastTime.getTime() + 5 * 60 * 60 * 1000),
    },
    [MEAL_AS]: {
      time: arvoSnackTime,
      rangeStart: new Date(lunchTime.getTime() + 2 * 60 * 60 * 1000),
      rangeEnd: new Date(lunchTime.getTime() + 3 * 60 * 60 * 1000),
    },
    [MEAL_DINNER]: {
      time: dinnerTime,
      rangeStart: new Date(lunchTime.getTime() + 4 * 60 * 60 * 1000),
      rangeEnd: new Date(lunchTime.getTime() + 5 * 60 * 60 * 1000),
    },
  };
};

const calculateMealTimes = () => {
  const wakeupTimeInput = document.getElementById("wakeup-time").value;
  if (!wakeupTimeInput) {
    return;
  }

  const wakeupTime = new Date(`1970-01-01T${wakeupTimeInput}:00`);
  const mealTimes = getMealTimes(wakeupTime);

  const mealTimesDiv = document.getElementById("meal-times");
  mealTimesDiv.innerHTML = "";

  for (let meal in mealTimes) {
    const mealTime = mealTimes[meal];
    const timeStr = formatTime(mealTime.time);
    const rangeStartStr = formatTime(mealTime.rangeStart);
    const rangeEndStr = formatTime(mealTime.rangeEnd);
    let rangeStr = `Between ${rangeStartStr} and ${rangeEndStr}`;

    if (meal === MEAL_BREAKFAST) {
      rangeStr = "Within an hour of waking up";
    }

    mealTimesDiv.innerHTML += `
            <div class="meal-time">
                <strong>${meal}</strong>: ${timeStr}
                <div class="range">${rangeStr}</div>
            </div>
        `;
  }
};

const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const setWakeupTime = (time) => {
  document.getElementById("wakeup-time").value = time;
  // Trigger the input event to recalculate meal times if necessary
  document.getElementById("wakeup-time").dispatchEvent(new Event("input"));
};

function updateIndicator() {
  const wakeupTimeInput = document.getElementById("wakeup-time").value;
  if (!wakeupTimeInput) {
    return;
  }

  const wakeupTime = new Date(`1970-01-01T${wakeupTimeInput}:00`);

  // if (wakeupTime.getHours() > 13) {
  //   return;
  // }
  
  const startHour = getStartHour();
  const startOfDay = new Date(new Date("1970-01-01T00:00:00").setHours(startHour));


  const endOfDay = new Date("1970-01-02T00:00:00");
  const indicatorContainer = document.getElementById("indicator-container");

  const totalDuration = endOfDay.getTime() - startOfDay.getTime();

  // Remove existing indicators
  const existingIndicators =
    indicatorContainer.getElementsByClassName("indicator");
  while (existingIndicators.length > 0) {
    existingIndicators[0].remove();
  }

  function addIndicator(time, className, label) {
    const start = time.rangeStart;
    const end = time.rangeEnd;

    const duration = end.getTime() - start.getTime();
    const left =
      ((start.getTime() - startOfDay.getTime()) / totalDuration) * 100;
    const width = (duration / totalDuration) * 100;

    const indicator = document.createElement("div");
    indicator.className = `indicator ${className}`;
    indicator.style.left = `${left}%`;
    indicator.style.width = `${width}%`;
    indicator.innerHTML = `<span>${label}</span>`;
    indicatorContainer.appendChild(indicator);
  }

  const mealTimes = getMealTimes(wakeupTime);

  const breakfastTime = mealTimes[MEAL_BREAKFAST];
  const midMorningSnackTime = mealTimes[MEAL_MMS];
  const lunchTime = mealTimes[MEAL_LUNCH];
  const arvoSnackTime = mealTimes[MEAL_AS];
  const dinnerTime = mealTimes[MEAL_DINNER];

  addIndicator(breakfastTime, "breakfast", "Breakfast");
  addIndicator(midMorningSnackTime, "mid-morning-snack", "Mid-morning Snack");
  addIndicator(lunchTime, "lunch", "Lunch");
  addIndicator(arvoSnackTime, "afternoon-snack", "Afternoon Snack");
  addIndicator(dinnerTime, "dinner", "Dinner");
}

const getStartHour = () => {
  const wakeupTimeInput = document.getElementById("wakeup-time").value;
  if (wakeupTimeInput) {
    const wakeupHour = new Date(`1970-01-01T${wakeupTimeInput}:00`).getHours();

    if (wakeupHour <= 2) {
        return wakeupHour;
    }
    return wakeupHour - 2;
  }
  return 0
};

function createHourLines() {
  const indicatorContainer = document.getElementById("indicator-container");
  indicatorContainer.replaceChildren([])

  const startHour = getStartHour();

  for (let i = startHour; i < 24; i++) {
    const hourLine = document.createElement("div");
    hourLine.className = "hour-line";

    const hourLabel = document.createElement("div");
    hourLabel.className = "hour-label";
    hourLabel.innerText = `${i}:00`;

    hourLine.appendChild(hourLabel);
    indicatorContainer.appendChild(hourLine);
  }
}

// Create hour lines on page load
createHourLines();
