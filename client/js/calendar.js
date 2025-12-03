import { CONFIG } from './config.js';
import { DateUtils } from './utils.js';

export class Calendar {
    constructor(state, app) {
        this.state = state;
        this.app = app; // Reference to App to trigger events
        this.grid = document.getElementById('calendar-grid');
        this.monthDisplay = document.getElementById('current-month-display');
    }

    render() {
        this.grid.innerHTML = '';
        const year = this.state.currentDate.getFullYear();
        const month = this.state.currentDate.getMonth();

        // Update Header
        const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(this.state.currentDate);
        this.monthDisplay.textContent = monthName;

        // Holidays for this year
        const holidays = DateUtils.getFrenchHolidays(year);

        // Grid Logic
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0)
        let startDay = firstDayOfMonth.getDay() - 1;
        if (startDay === -1) startDay = 6;

        // Empty cells before
        for (let i = 0; i < startDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'bg-transparent';
            this.grid.appendChild(empty);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dateStr = DateUtils.formatDate(date);
            const isWeekend = DateUtils.isWeekend(date);
            const holidayName = holidays[dateStr];

            // Determine Status
            let statusId = this.state.getStatus(dateStr);

            // Default logic if no manual status
            if (!statusId) {
                if (holidayName) statusId = 'HOLIDAY';
                else if (isWeekend) statusId = 'OFF';
                else statusId = 'WORK';
            }

            const statusConfig = CONFIG.statusTypes[statusId] || CONFIG.statusTypes.WORK;

            // Create Element
            const cell = document.createElement('div');
            cell.className = `calendar-day border rounded-lg p-2 flex flex-col justify-between cursor-pointer select-none ${statusConfig.color} ${statusConfig.border} ${statusConfig.text}`;
            cell.dataset.date = dateStr;

            // Content
            const header = document.createElement('div');
            header.className = 'flex justify-between items-start';

            const dayNum = document.createElement('span');
            dayNum.className = `font-bold text-lg ${dateStr === DateUtils.formatDate(new Date()) ? 'bg-brand-500 text-white w-7 h-7 rounded-full flex items-center justify-center -ml-1 -mt-1 shadow-sm' : ''}`;
            dayNum.textContent = d;

            header.appendChild(dayNum);

            if (holidayName) {
                const hIcon = document.createElement('i');
                hIcon.className = 'fa-solid fa-star text-yellow-400 text-xs';
                hIcon.title = holidayName;
                header.appendChild(hIcon);
            }

            cell.appendChild(header);

            // Icon/Label
            const content = document.createElement('div');
            content.className = 'text-center mt-2';
            content.innerHTML = `<i class="fa-solid ${statusConfig.icon} text-xl opacity-50 mb-1"></i>`;

            // Optional: Label for non-work
            if (statusId !== 'WORK' && statusId !== 'OFF') {
                const badge = document.createElement('div');
                badge.className = 'status-badge bg-white/50';
                badge.textContent = statusConfig.label;
                content.appendChild(badge);
            }

            if (holidayName) {
                const badge = document.createElement('div');
                badge.className = 'status-badge bg-red-100 text-red-600';
                badge.textContent = holidayName.length > 10 ? holidayName.substring(0, 8) + '...' : holidayName;
                content.appendChild(badge);
            }

            cell.appendChild(content);

            // Events
            cell.addEventListener('mousedown', () => this.app.handleStartPaint(dateStr));
            cell.addEventListener('mouseenter', () => this.app.handlePaint(dateStr));

            this.grid.appendChild(cell);
        }
    }
}
