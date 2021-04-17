const dataGreenRoom = {
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

const dataRedRoom = {
	wednesday:
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
	thursday: {
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
	constructor(tableId, days = [], hours = {}, eventColor) {
		this.tableId = tableId;
		this.days = days;
		this.hours = hours;
		this.eventColor = eventColor;
	}

	set data(data) {
		if (!localStorage[this.tableId]) {
			localStorage.setItem(this.tableId, JSON.stringify(data));
		}
	}

	get data() {
		return JSON.parse(localStorage[this.tableId]);
	}

	renderCalendar() {
		let thead = this.days.
			map(function (day) {
				return `<th>${day}</th>`;
			});

		let tbody = [];

		for (let i = this.hours.start; i <= this.hours.end; i++) {
			let tds = this.days
				.map(function (day) {
					return `<td data-id=${day}-${i}></td>`;
				})
				.join('');

			let tr = `<tr><td>${i}:00</td>${tds}</tr>`;
			tbody.push(tr);
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
		meetingRoom.innerHTML += table;
	}

	infoCalendar() {
		let calendarInfo = this.data;
		this.renderUsers()

		for (let key in calendarInfo) {
			let day = calendarInfo[key];

			for (let hour in day) {
				let event = day[hour];
				let table = document.querySelector(`#${this.tableId}`),
					currentTD = table.querySelector(`td[data-id=${key}-${hour}]`);

				currentTD.append(this.renderEvent(event));
			}
		}
	}

	renderUsers() {
		let calendarInfo = this.data;

		let users = [];

		for (let key in calendarInfo) {
			let day = calendarInfo[key]
			for (let hour in day) {
				users.push(day[hour].users)
			}
		}
		// 29:55
		let all_users = users.flat().filter(
			function (value, index, self) {
				return self.indexOf(value) === index;
			}
		)
	}

	renderEvent(event) {
		let eventDiv = document.createElement('div');
		eventDiv.classList.add('event');
		eventDiv.style.backgroundColor = this.eventColor;

		let cancelBtn = document.createElement('button');
		cancelBtn.classList.add('event__cancel');
		cancelBtn.innerHTML = `x`;

		let name = document.createElement('p');
		name.classList.add('event__name');
		name.innerHTML = `<b>${event.name}</b>`;

		let users = document.createElement('p');
		users.classList.add('event__users');
		users.innerHTML = event.users.join(', ');

		eventDiv.append(name, users, cancelBtn);

		return eventDiv;
	}

	static cancelEvent(cancelBtn) {
		let currentTD = cancelBtn.closest('td'),
			currentTDid = currentTD.dataset.id,
			table = currentTD.closest('table'),
			tableId = table.id;

		let data = currentTDid.split('-');

		let day = data[0],
			hour = data[1];

		let calendar = JSON.parse(localStorage[tableId]);
		delete calendar[day][hour];
		localStorage[tableId] = JSON.stringify(calendar);

		currentTD.innerHTML = ``;
	}
}

let roomGreen = new Calendar('roomGreen', ['monday', 'tuesday', 'friday'], { start: 10, end: 18 }, '#55da72 ');
roomGreen.data = dataGreenRoom;
roomGreen.renderCalendar();
roomGreen.infoCalendar();


let roomRed = new Calendar('roomRed', ['wednesday', 'thursday',], { start: 9, end: 20 }, 'red');
roomRed.data = dataRedRoom;
roomRed.renderCalendar();
roomRed.infoCalendar();

let cancelBTNs = document.querySelectorAll('.event__cancel');

cancelBTNs.forEach(function (btn) {
	btn.addEventListener('click', function () {
		Calendar.cancelEvent(btn);
	})
})
