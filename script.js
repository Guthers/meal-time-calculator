
const calculateMealTimes = () => {
    const wakeupTimeInput = document.getElementById('wakeup-time').value;
    if (!wakeupTimeInput) {
        return;
    }

    const wakeupTime = new Date(`1970-01-01T${wakeupTimeInput}:00`);

    const breakfastTime = new Date(wakeupTime.getTime() + 1 * 60 * 60 * 1000);
    const midMorningSnackTime = new Date(breakfastTime.getTime() + 3 * 60 * 60 * 1000);
    const lunchTime = new Date(breakfastTime.getTime() + 5 * 60 * 60 * 1000);
    const arvoSnackTime = new Date(lunchTime.getTime() + 3 * 60 * 60 * 1000);
    const dinnerTime = new Date(lunchTime.getTime() + 5 * 60 * 60 * 1000);

    const mealTimes = {
        'Breakfast': {
            time: breakfastTime,
            rangeStart: new Date(wakeupTime.getTime() + 1 * 60 * 60 * 1000),
            rangeEnd: new Date(wakeupTime.getTime() + 1 * 60 * 60 * 1000),
        },
        'Mid-morning Snack': {
            time: midMorningSnackTime,
            rangeStart: new Date(breakfastTime.getTime() + 2 * 60 * 60 * 1000),
            rangeEnd: new Date(breakfastTime.getTime() + 3 * 60 * 60 * 1000),
        },
        'Lunch': {
            time: lunchTime,
            rangeStart: new Date(breakfastTime.getTime() + 4 * 60 * 60 * 1000),
            rangeEnd: new Date(breakfastTime.getTime() + 5 * 60 * 60 * 1000),
        },
        'Afternoon Snack': {
            time: arvoSnackTime,
            rangeStart: new Date(lunchTime.getTime() + 2 * 60 * 60 * 1000),
            rangeEnd: new Date(lunchTime.getTime() + 3 * 60 * 60 * 1000),
        },
        'Dinner': {
            time: dinnerTime,
            rangeStart: new Date(lunchTime.getTime() + 4 * 60 * 60 * 1000),
            rangeEnd: new Date(lunchTime.getTime() + 5 * 60 * 60 * 1000),
        }
    };

    const mealTimesDiv = document.getElementById('meal-times');
    mealTimesDiv.innerHTML = '';

    for (let meal in mealTimes) {
        const mealTime = mealTimes[meal];
        const timeStr = formatTime(mealTime.time);
        const rangeStartStr = formatTime(mealTime.rangeStart);
        const rangeEndStr = formatTime(mealTime.rangeEnd);
        let rangeStr = `Between ${rangeStartStr} and ${rangeEndStr}`;

        if (meal === "Breakfast") {
            rangeStr = "Within an hour of waking up";
        }

        mealTimesDiv.innerHTML += `
            <div class="meal-time">
                <strong>${meal}</strong>: ${timeStr}
                <div class="range">${rangeStr}</div>
            </div>
        `;
    }
}

const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

const setWakeupTime = (time) => {
    document.getElementById('wakeup-time').value = time;
    // Trigger the input event to recalculate meal times if necessary
    document.getElementById('wakeup-time').dispatchEvent(new Event('input'));
}