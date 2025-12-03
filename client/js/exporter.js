import { CONFIG } from './config.js';
import { Toast } from './utils.js';

export class Exporter {
    static exportToICS(state) {
        const events = [];
        const data = state.data;

        // Header
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//MyPlanningPro//FR',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        // Iterate over all stored dates
        Object.keys(data).forEach(dateStr => {
            const entry = data[dateStr];
            if (!entry || !entry.status) return;

            const statusConfig = CONFIG.statusTypes[entry.status];
            if (!statusConfig) return;

            // Skip WORK if desired, or include everything. 
            // Usually people want to export specific statuses like REMOTE, LEAVE.
            // Let's export everything except default WORK to keep it clean, or maybe everything?
            // User request: "Génération de fichiers .ics ... selon le statut filtré" -> Implicitly maybe all non-standard?
            // Let's export REMOTE, LEAVE, SCHOOL, HOLIDAY. Skip WORK and OFF.
            if (entry.status === 'WORK' || entry.status === 'OFF') return;

            const date = new Date(dateStr);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            const start = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            // ICS all-day events usually use DTSTART;VALUE=DATE:YYYYMMDD
            // But for simplicity with timezones, let's use simple date strings
            const dtStart = dateStr.replace(/-/g, '');
            const dtEnd = nextDay.toISOString().split('T')[0].replace(/-/g, '');

            icsContent.push('BEGIN:VEVENT');
            icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
            icsContent.push(`DTEND;VALUE=DATE:${dtEnd}`);
            icsContent.push(`SUMMARY:${statusConfig.label}`);
            icsContent.push(`DESCRIPTION:Statut: ${statusConfig.label}`);
            icsContent.push('UID:' + dateStr + '@myplanningpro');
            icsContent.push('STATUS:CONFIRMED');
            icsContent.push('END:VEVENT');
        });

        icsContent.push('END:VCALENDAR');

        const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'planning.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Toast.show('Export .ics généré !', 'success');
    }
}
