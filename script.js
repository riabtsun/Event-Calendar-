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

		let usersSelect = this.renderUsers();

		let addEventBtn = `<a class='btn' href="addEvent.html?calendar=${this.tableId}" target="_blank">Add event</a>`;

		let calendar__options = document.createElement('div');
		calendar__options.classList.add('calendar__options');
		calendar__options.append(usersSelect);
		calendar__options.innerHTML += addEventBtn;

		meetingRoom.append(calendar__options);
		meetingRoom.innerHTML += table;
	}

	infoCalendar(data) {
		let calendarInfo = data ? data : this.data;
		let table = document.querySelector(`#${this.tableId}`),
			tds = table.querySelectorAll('td:nth-child(n+2)');

		Calendar.emptyTDs(tds)

		for (let key in calendarInfo) {
			let day = calendarInfo[key];

			for (let hour in day) {
				let event = day[hour],
					currentTD = table.querySelector(`td[data-id=${key}-${hour}]`);

				if (event !== null) {
					currentTD.append(this.renderEvent(event));
				}

			}
		}
	}

	static emptyTDs(tds) {
		tds.forEach(function (td) {
			td.innerHTML = ``
		})
	}

	renderUsers(parentElement) {
		let calendarInfo = this.data;

		let users = [];

		for (let key in calendarInfo) {
			let day = calendarInfo[key]
			for (let hour in day) {
				users.push(day[hour].users)
			}
		}

		let all_users = users.flat().filter(
			function (value, index, self) {
				return self.indexOf(value) === index;
			}
		).map(function (user) {
			return `<option value='${user}'>${user}</option>`
		});
		all_users.unshift('<option vlue="all">All users</option>')

		let select = document.createElement('select');
		select.dataset.name = "usersSelect";
		select.dataset.id = this.tableId;
		select.innerHTML = all_users.join('');

		return select
	}

	static userEvents() {
		let userSelected = this.value,
			tableId = this.dataset.id;

		let data = JSON.parse(localStorage[tableId]);

		if (userSelected !== 'all') {
			for (let key in data) {
				let day = data[key];
				for (let hour in day) {
					let hourEvent = day[hour];
					if (!hourEvent.users.includes(userSelected)) {
						day[hour] = null;
					}
				}
			}
		}

		roomGreen.infoCalendar(data);
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

let roomGreen = new Calendar('roomGreen', ['monday', 'tuesday', 'wednesday', 'thirsday', 'friday', 'saturday', 'sunday'], { start: 10, end: 18 }, '#55da72 ');
roomGreen.data = dataGreenRoom;
roomGreen.renderCalendar();
roomGreen.infoCalendar();


// let roomRed = new Calendar('roomRed', ['wednesday', 'thursday',], { start: 9, end: 20 }, 'red');
// roomRed.data = dataRedRoom;
// roomRed.renderCalendar();
// roomRed.infoCalendar();

let cancelBTNs = document.querySelectorAll('.event__cancel');

cancelBTNs.forEach(function (btn) {
	btn.addEventListener('click', function () {
		Calendar.cancelEvent(btn);
	})
});

let usersSelects = document.querySelectorAll('select[data-name="usersSelect"]');
usersSelects.forEach(function (select) {
	select.addEventListener('change', Calendar.userEvents)
})
