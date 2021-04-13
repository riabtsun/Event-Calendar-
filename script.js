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
	constructor(calendar, tableId) {
		this.calendar = calendar;
		this.tableId = tableId;
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
		let calendarInfo = this.calendar;
		for (let key in calendarInfo) {
			let day = calendarInfo[key];
			for (let hour in day) {
				let event = day[hour]
				let table = document.querySelector(`#${this.tableId}`),
					currentTd = table.querySelector(`td[data-id=${key}-${hour}]`);
				currentTd.innerHTML = this.renderEvent(event);
			}
		}
	}
	renderEvent(event) {
		let deleteBtn = document.createElement('button');
		deleteBtn.classList.add('event__delete');
		deleteBtn.innerHTML = 'X';
		deleteBtn.addEventListener('click', this.cancelEvent);

		let eventDiv = document.createElement('div');
		eventDiv.classList.add('event');
		eventDiv.append(deleteBtn)

		let eventRender = `<div class='event'>
			<p class='event__name'>${event.name}</p>
			<p class='event__users'>${event.users.join(', ')}</p>
		</div>`;
		return eventRender;
	}
	cancelEvent() {

	}
}

let mettingCalendar = new Calendar(data, 'roomGreen');
console.log(mettingCalendar);

mettingCalendar.renderCalendar();
mettingCalendar.infoCalendar();

// time 1:00:00