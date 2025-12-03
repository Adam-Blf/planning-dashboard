export class DateUtils {
    static getFrenchHolidays(year) {
        const holidays = {
            [`${year}-01-01`]: "Nouvel An",
            [`${year}-05-01`]: "Fête du Travail",
            [`${year}-05-08`]: "Victoire 1945",
            [`${year}-07-14`]: "Fête Nationale",
            [`${year}-08-15`]: "Assomption",
            [`${year}-11-01`]: "Toussaint",
            [`${year}-11-11`]: "Armistice",
            [`${year}-12-25`]: "Noël"
        };

        // Easter (Algorithme de Gauss)
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const n = Math.floor((h + l - 7 * m + 114) / 31);
        const p = (h + l - 7 * m + 114) % 31;

        const easterMonth = n; // 3 = March, 4 = April
        const easterDay = p + 1;

        const easterDate = new Date(year, easterMonth - 1, easterDay);

        // Lundi de Pâques (+1j)
        const easterMonday = new Date(easterDate);
        easterMonday.setDate(easterMonday.getDate() + 1);
        holidays[DateUtils.formatDate(easterMonday)] = "Lundi de Pâques";

        // Ascension (+39j)
        const ascension = new Date(easterDate);
        ascension.setDate(ascension.getDate() + 39);
        holidays[DateUtils.formatDate(ascension)] = "Ascension";

        // Lundi de Pentecôte (+50j)
        const pentecost = new Date(easterDate);
        pentecost.setDate(pentecost.getDate() + 50);
        holidays[DateUtils.formatDate(pentecost)] = "Lundi de Pentecôte";

        return holidays;
    }

    static formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    static isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6; // 0=Sun, 6=Sat
    }
}

export class Toast {
    static show(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');

        const colors = {
            info: 'bg-slate-800 text-white',
            success: 'bg-emerald-600 text-white',
            error: 'bg-red-600 text-white',
            warning: 'bg-orange-500 text-white'
        };

        const icons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle'
        };

        toast.className = `${colors[type]} px-4 py-3 rounded shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-x-full opacity-0`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type]}"></i>
            <span class="text-sm font-medium">${message}</span>
        `;

        container.appendChild(toast);

        // Animate In
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });

        // Auto Remove
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}
