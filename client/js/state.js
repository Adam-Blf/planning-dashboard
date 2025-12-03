import { CONFIG } from './config.js';

export class State {
    constructor() {
        this.data = this.load();
        this.currentDate = new Date();
        this.selectedTool = 'REMOTE'; // Default tool
        this.isDragging = false;
        this.theme = localStorage.getItem('theme') || 'system';
    }

    load() {
        const stored = localStorage.getItem(CONFIG.storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    save() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.data));
        // We might need a way to notify listeners if we decouple strictly, 
        // but for now we'll call updates manually from App.
    }

    setStatus(dateStr, statusId) {
        if (!this.data[dateStr]) this.data[dateStr] = {};
        this.data[dateStr].status = statusId;
        this.save();
    }

    getStatus(dateStr) {
        return this.data[dateStr]?.status || null;
    }

    getApiKey() {
        return localStorage.getItem(CONFIG.apiKeyStorage) || CONFIG.DEFAULT_API_KEY || '';
    }

    setApiKey(key) {
        localStorage.setItem(CONFIG.apiKeyStorage, key);
    }
}
