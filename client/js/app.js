import { CONFIG } from './config.js';
import { DateUtils, Toast } from './utils.js';
import { State } from './state.js';
import { Calendar } from './calendar.js';
import { GeminiService } from './gemini.js';
import { Exporter } from './exporter.js';

class App {
    constructor() {
        this.state = new State();
        this.calendar = new Calendar(this.state, this);

        this.init();
    }

    init() {
        this.initTheme();
        this.renderTools();
        this.bindEvents();
        this.calendar.render();
        this.updateStats();

        // Load API Key into input if exists
        const apiKeyInput = document.getElementById('api-key-input');
        if (apiKeyInput) {
            apiKeyInput.value = this.state.getApiKey();
        }
    }

    initTheme() {
        const stored = this.state.theme;
        if (stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.updateThemeIcon();
    }

    toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            this.state.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            this.state.theme = 'dark';
        }
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const btn = document.getElementById('btn-theme-toggle');
        if (btn) {
            const isDark = document.documentElement.classList.contains('dark');
            btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        }
    }

    renderTools() {
        const container = document.getElementById('tools-container');
        container.innerHTML = '';

        Object.values(CONFIG.statusTypes).forEach(type => {
            if (type.id === 'HOLIDAY' || type.id === 'OFF') return;

            const btn = document.createElement('button');
            btn.className = `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all border-2 ${this.state.selectedTool === type.id ? 'border-brand-500 bg-slate-800' : 'border-transparent hover:bg-slate-800'}`;
            btn.onclick = () => {
                this.state.selectedTool = type.id;
                this.renderTools(); // Re-render to update active state
            };

            btn.innerHTML = `
                <div class="w-6 h-6 rounded flex items-center justify-center ${type.color} ${type.text}">
                    <i class="fa-solid ${type.icon} text-xs"></i>
                </div>
                <span class="text-sm font-medium ${this.state.selectedTool === type.id ? 'text-white' : 'text-slate-400'}">${type.label}</span>
                ${this.state.selectedTool === type.id ? '<i class="fa-solid fa-check text-brand-500 ml-auto"></i>' : ''}
            `;
            container.appendChild(btn);
        });
    }

    bindEvents() {
        // Global Mouse Up for painting
        document.addEventListener('mouseup', () => {
            this.state.isDragging = false;
        });

        // Navigation
        document.getElementById('btn-prev-month').onclick = () => {
            this.state.currentDate.setMonth(this.state.currentDate.getMonth() - 1);
            this.calendar.render();
            this.updateStats();
        };
        document.getElementById('btn-next-month').onclick = () => {
            this.state.currentDate.setMonth(this.state.currentDate.getMonth() + 1);
            this.calendar.render();
            this.updateStats();
        };
        document.getElementById('btn-today').onclick = () => {
            this.state.currentDate = new Date();
            this.calendar.render();
            this.updateStats();
        };

        // Settings Modal
        document.getElementById('btn-settings').onclick = () => this.openModal('settings-modal');
        document.getElementById('close-settings-modal').onclick = () => this.closeModal('settings-modal');
        document.getElementById('btn-save-settings').onclick = () => this.saveSettings();

        // Theme Toggle
        const themeBtn = document.getElementById('btn-theme-toggle');
        if (themeBtn) themeBtn.onclick = () => this.toggleTheme();

        // AI Modal
        document.getElementById('btn-ai-assist').onclick = () => this.openModal('ai-modal');
        document.getElementById('close-ai-modal').onclick = () => this.closeModal('ai-modal');
        document.getElementById('btn-ai-oof').onclick = () => this.triggerAI('oof');
        document.getElementById('btn-ai-checklist').onclick = () => this.triggerAI('checklist');

        // Export
        const exportBtn = document.getElementById('btn-export');
        if (exportBtn) exportBtn.onclick = () => Exporter.exportToICS(this.state);
    }

    handleStartPaint(dateStr) {
        this.state.isDragging = true;
        this.applyStatus(dateStr);
    }

    handlePaint(dateStr) {
        if (this.state.isDragging) {
            this.applyStatus(dateStr);
        }
    }

    applyStatus(dateStr) {
        this.state.setStatus(dateStr, this.state.selectedTool);
        this.calendar.render();
        this.updateStats();
    }

    updateStats() {
        const container = document.getElementById('stats-container');
        container.innerHTML = '';

        const year = this.state.currentDate.getFullYear();
        const counts = { WORK: 0, REMOTE: 0, SCHOOL: 0, LEAVE: 0 };

        for (let m = 0; m < 12; m++) {
            const days = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= days; d++) {
                const date = new Date(year, m, d);
                const dateStr = DateUtils.formatDate(date);
                let status = this.state.getStatus(dateStr);
                if (!status) {
                    if (!DateUtils.isWeekend(date) && !DateUtils.getFrenchHolidays(year)[dateStr]) {
                        status = 'WORK';
                    }
                }
                if (counts[status] !== undefined) counts[status]++;
            }
        }

        const makeBar = (label, count, color, total) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return `
                <div>
                    <div class="flex justify-between text-xs mb-1">
                        <span class="text-slate-400">${label}</span>
                        <span class="text-white font-bold">${count}j</span>
                    </div>
                    <div class="w-full bg-slate-700 rounded-full h-1.5">
                        <div class="bg-${color}-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        };

        container.innerHTML += makeBar('Télétravail', counts.REMOTE, 'purple', 220);
        container.innerHTML += makeBar('Bureau', counts.WORK, 'indigo', 220);
        container.innerHTML += makeBar('Congés', counts.LEAVE, 'pink', 25);
    }

    openModal(id) {
        const modal = document.getElementById(id);
        modal.classList.remove('hidden');
        const content = modal.querySelector('div[class*="transform"]');
        if (content) content.classList.remove('scale-95', 'opacity-0');
    }

    closeModal(id) {
        document.getElementById(id).classList.add('hidden');
    }

    saveSettings() {
        const key = document.getElementById('api-key-input').value.trim();
        this.state.setApiKey(key);
        this.closeModal('settings-modal');
        Toast.show('Paramètres sauvegardés', 'success');
    }

    async triggerAI(type) {
        const apiKey = this.state.getApiKey();
        // Note: We allow apiKey to be empty now, because we might use the server proxy.
        // The GeminiService will handle the fallback.

        const resultArea = document.getElementById('ai-result');
        const textarea = resultArea.querySelector('textarea');

        let prompt = "";
        const context = "Tu es un assistant RH utile. ";

        if (type === 'oof') {
            prompt = `${context} Rédige un message d'absence (Out of Office) professionnel et courtois pour mes congés. Utilise un ton professionnel mais chaleureux. Ne mets pas de placeholders [Date], invente des dates fictives si besoin ou laisse générique.`;
        } else if (type === 'checklist') {
            prompt = `${context} Génère une checklist de 5 points essentiels à vérifier avant de partir en télétravail ou en congés (ex: redirection mail, dossiers partagés, etc.). Format liste à puces.`;
        }

        textarea.value = "Génération en cours avec Gemini...";
        resultArea.classList.remove('hidden');

        try {
            const text = await GeminiService.generate(prompt, apiKey);
            textarea.value = text;
            Toast.show('Génération réussie !', 'success');
        } catch (e) {
            textarea.value = "Erreur: " + e.message;
            Toast.show('Erreur lors de la génération', 'error');
        }
    }
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
