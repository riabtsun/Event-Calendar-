let form = document.querySelector('#addEvent');

let calendarName = document.location.search;
calendarName = calendarName.replace('?', '');
calendarNameArr = calendarName.split('=')

calendarName = calendarNameArr[1];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let form = this;

  let inputName = form.querySelector('#name'),
    inputNameValue = inputName.value;

  let selectedUsers = form.querySelector('#users'),
    selectUsersValue = [...selectedUsers.selectedOptions];

  selectedUsersValue = selectUsersValue.map(function (option) {
    return option.value
  })

  let selectedDay = form.querySelector('#day'),
    selectedDayValue = selectedDay.value;

  let selectedHour = form.querySelector('#hours'),
    selectedHourValue = selectedHour.value;

  let data = JSON.parse(localStorage[calendarName]);

  if (data[selectedDayValue] && data[selectedDayValue][selectedHourValue]) {
    alert('Event for this day and hour already exist. Please, change day or hour.')
  } else {
    if (!data[selectedDayValue]) {
      data[selectedDayValue] = {};
    }
    data[selectedDayValue][selectedHourValue] = {
      name: inputNameValue,
      users: selectedUsersValue
    }

    localStorage[calendarName] = JSON.stringify(data)
  }
})