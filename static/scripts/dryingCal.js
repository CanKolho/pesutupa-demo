const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventSubmit = document.querySelector(".add-event-btn "),
  selectStart = document.querySelector('#select-start-drying'),
  selectEnd = document.querySelector('#select-end-drying'),
  selectElement = document.querySelector('#select-apartment-drying');

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dryingRes = [];
getEventsFromAPI();

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay(); // Updated to start on Monday
  const nextDays = 7 - ((lastDay.getDay() + 6) % 7) - 1; // Updated for Monday start

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = (day === 0 ? 6 : day - 1); x > 0; x--) { // Updated for Monday start
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day 
    let event = false;
    dryingRes.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  const filteredEvents = dryingRes.filter((event) => {
    return date === event.day && month + 1 === event.month && year === event.year;
  });

  // Sort the filtered events by year, month, day, and time
  filteredEvents.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    if (a.month !== b.month) {
      return a.month - b.month;
    }
    if (a.day !== b.day) {
      return a.day - b.day;
    }

    // Compare event times
    const timeA = a.time.split(" - ")[0]; // Start time
    const timeB = b.time.split(" - ")[0]; // End time
    const timePartsA = timeA.split(":");
    const timePartsB = timeB.split(":");
    const hourA = parseInt(timePartsA[0], 10);
    const minuteA = parseInt(timePartsA[1], 10);
    const hourB = parseInt(timePartsB[0], 10);
    const minuteB = parseInt(timePartsB[1], 10);

    if (hourA !== hourB) {
      return hourA - hourB;
    }

    return minuteA - minuteB;
  });

  filteredEvents.forEach((event) => {
    events += `<div class="event">
        <div class="title">
          <i class="fas fa-circle"></i>
          <h3 class="event-title">${event.title}</h3>
        </div>
        <div class="event-time">
          <span class="event-time">${event.time}</span>
        </div>
    </div>`;
  });

  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  }

  eventsContainer.innerHTML = events;
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});


//function to add event to dryingRes
addEventSubmit.addEventListener("click", () => {
  const eventTitle = selectElement.value;
  const eventTimeFrom = selectStart.value;
  const eventTimeTo = selectEnd.value;
  if (eventTitle === "Apartment" || eventTimeFrom === "Start time" || eventTimeTo === "End time") {
    alert("Please fill all the fields");
    return;
  }

  //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59 ||
    timeToArr[0] < timeFromArr[0] ||
    (timeToArr[0] === timeFromArr[0] && timeToArr[1] < timeFromArr[1])
  ) {
    alert("Invalid Time Format");
    return;
  }

  const newEvent = {
    title: eventTitle,
    time: eventTimeFrom + " - " + eventTimeTo,
    start_time: `${year}-${month + 1}-${activeDay} ${eventTimeFrom}`,
    end_time: `${year}-${month + 1}-${activeDay} ${eventTimeTo}`,    
  };

  const jsonData = JSON.stringify(newEvent);

  const apiUrl = '/api/dryingroom';

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonData
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw err; });
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    dryingRes.push(data);
    updateEvents(activeDay);
  })
  .catch(error => {
    console.log('Error:', error);
    window.alert(error.error);
  });

  addEventWrapper.classList.remove("active");
  selectElement.value = "Apartment";
  selectStart.value = "Start time";
  selectEnd.value = "End time";

  const customSelectApartment = selectElement.parentNode.querySelector(".select-selected"),
   customSelectStart = selectStart.parentNode.querySelector(".select-selected"),
   customSelectEnd = selectEnd.parentNode.querySelector(".select-selected");

  customSelectApartment.innerHTML = "Apartment";
  customSelectStart.innerHTML = "Start time";
  customSelectEnd.innerHTML = "End time";
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

function getEventsFromAPI() {
  const apiUrl = '/api/dryingroom';

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      dryingRes.length = 0;
      dryingRes.push(...data);
      console.log('init', dryingRes);

      initCalendar()
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const letters = ['A', 'B', 'C'];

function generateApartmentOptions(selectElement) {
  letters.forEach(letter => {
  for (let j = 16; j <= 30; j ++) {
      let option = document.createElement('option');
      option.value =  letter + j
      option.text = letter + j

      selectElement.appendChild(option);
    }
  });
  }

  function generateStartTimeOptions(selectElement) {
    for (let hour = 6; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        let option = document.createElement('option');
        option.value = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
        option.text = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
        selectElement.appendChild(option);
      }
    }
  }

  function generateEndTimeOptions(selectElement) {
    for (let hour = 6; hour <= 22; hour++) {
        let minuteStart = 0;
        if (hour === 6) {
            minuteStart = 15;
        }

        for (let minute = minuteStart; minute < 60; minute += 15) {
          if (hour === 22 && minute > 0) {
            break;
        }

        let option = document.createElement('option');
        option.value = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
        option.text = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
        selectElement.appendChild(option);
        }
    }
  }

  generateApartmentOptions(selectElement);
  generateStartTimeOptions(selectStart);
  generateEndTimeOptions(selectEnd);

  var x, i, j, l, ll, selElmnt, a, b, c;
  /*look for any elements with the class "custom-select":*/
  x = document.getElementsByClassName("custom-select");
  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
      /*for each option in the original select element,
      create a new DIV that will act as an option item:*/
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function(e) {
          /*when an item is clicked, update the original select box,
          and the selected item:*/
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
  }
  function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
/*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);