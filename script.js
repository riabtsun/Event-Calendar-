const data = {
	monday:
	{
		10: {
			name: 'Daily Meeting',
			users: ['Anna', 'Ivan']
		},
		18: {
			name: 'Scrum Meeting',
			users: ['Anna', 'Oleg']
		}
	}
	,
	friday: {
		13: {
			name: 'Grooming',
			users: ['Irina', 'Ivan']
		},
		18:
		{
			name: 'Scrum Meeting',
			users: ['Anna', 'Irina']
		}
	}
};


const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const mettingHours = {
	start: 10,
	end: 18
}

class Calendar {
	constructor(tableId) {
		this.tableId = tableId;
	}

	set data(data) {
		if (!localStorage.calendar) {
			localStorage.setItem('calendar', JSON.stringify(data));
		}
	}

	get data() {
		return JSON.parse(localStorage.calendar)
	}

	renderCalendar() {
		let thead = days.map(day => `<th>${day}</th>`)

		let tbody = [];
		for (let i = mettingHours.start; i <= mettingHours.end; i++) {

			let tds = days.map(day => `<td data-id=${day}-${i}></td>`).join('');

			let tr = `<tr><td>${i}:00</td>${tds}</tr>`;
			tbody.push(tr)
		}

		let table = `<table id='${this.tableId}'>
			<thead>
				<th>Name</th>
				${thead.join('')}
			</thead>
			<tbody>
			${tbody.join('')}
			</tbody>
		</table>`;

		let meetingRoom = document.querySelector('#meetingRoom');
		meetingRoom.innerHTML = table;
	}

	infoCalendar() {
		let calendarInfo = this.data;
		for (let key in calendarInfo) {
			let day = calendarInfo[key];
			for (let hour in day) {
				let event = day[hour]
				let table = document.querySelector(`#${this.tableId}`),
					currentTd = table.querySelector(`td[data-id=${key}-${hour}]`);
				currentTd.append(this.renderEvent(event));
			}
		}
	}

	renderEvent(event) {
		let eventDiv = document.createElement('div');
		eventDiv.classList.add('event');

		let deleteBtn = document.createElement('button');
		deleteBtn.classList.add('event__delete');
		deleteBtn.innerHTML = 'x';
		deleteBtn.addEventListener('click', this.cancelEvent);

		let name = document.createElement('p');
		name.classList.add(`event__name`);
		name.innerHTML = `<b>${event.name}</b>`;

		let users = document.createElement('p');
		users.classList.add(`event__users`);
		users.innerHTML = event.users.join(', ');

		eventDiv.append(name, users, deleteBtn);

		return eventDiv;
	}

	cancelEvent() {
		let cancelBtn = this;
		let currentTD = cancelBtn.closest('td'),
			currentTDid = currentTD.dataset.id;

		let data = currentTDid.split('-');
		let day = data[0],
			hour = data[1];

		let calendar = JSON.parse(localStorage.calendar);
		delete calendar[day][hour];
		localStorage.calendar = JSON.stringify(calendar);

		currentTD.innerHTML = '';
	}
}

let mettingCalendar = new Calendar('roomGreen');
mettingCalendar.data = data;
console.log(mettingCalendar);

mettingCalendar.renderCalendar();
mettingCalendar.infoCalendar();

// time 1:48:00