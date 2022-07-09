'use strict';

// DOM insert point
const weeklyGraphEl = document.querySelector('.weekly-graph');

// fetch data HTTP request
const fetchData = async (path) => {
  try {
    const response = await fetch(path);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    alert('Something went wrong. Please try again');
  }
};

const barGraphData = await fetchData('./data.json');
console.log(barGraphData); // { day: string, amount: number }

// find highest spending day
const highestDay = barGraphData.reduce(
  (acc, cV, i) => {
    const highest =
      cV.amount > acc.amount // if current > prev amount, then highest === [current]
        ? { dayIndex: [i], amount: cV.amount }
        : cV.amount === acc.amount // if current === prev amount, then highest === [...prev, current]
        ? { dayIndex: [...acc.dayIndex, i], amount: cV.amount }
        : acc;
    return highest;
  },
  { dayIndex: [], amount: 0 }
);
console.log(highestDay);

// render bar graph items
const barGraph = barGraphData
  .map((dayData, i) => {
    const mostSpent = highestDay.dayIndex.includes(i);
    const barRatio = 100 / highestDay.amount;
    const barHeight = (dayData.amount * barRatio).toFixed(1);
    const bgColor = mostSpent ? 'hsl(186, 34%, 60%)' : 'hsl(10, 79%, 65%)';
    const divStyle = `style="height: ${barHeight}%; background-color: ${bgColor};"`;

    return `
    <li class="weekly-graph__item">
      <div class="weekly-graph__bar-container">
        <div class="weekly-graph__amount">$${dayData.amount}</div>
        <div class="weekly-graph__bar bar-${i}" ${divStyle}></div>
        <p class="weekly-graph__day day-${i}">${dayData.day}</p>
      </div>
    </li>
`;
  })
  .join('');

// insert into DOM
weeklyGraphEl.innerHTML = barGraph;
