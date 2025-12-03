export const CONFIG = {
    storageKey: 'myPlanningProData',
    apiKeyStorage: 'gemini_api_key',
    statusTypes: {
        WORK:   { id: 'WORK',   label: 'Bureau',      color: 'bg-white',        border: 'border-slate-200', text: 'text-slate-700', icon: 'fa-building' },
        REMOTE: { id: 'REMOTE', label: 'Télétravail', color: 'bg-purple-100',   border: 'border-purple-300', text: 'text-purple-700', icon: 'fa-house-laptop' },
        SCHOOL: { id: 'SCHOOL', label: 'Formation',   color: 'bg-orange-100',   border: 'border-orange-300', text: 'text-orange-700', icon: 'fa-graduation-cap' },
        LEAVE:  { id: 'LEAVE',  label: 'Congés',      color: 'bg-pink-100',     border: 'border-pink-300',   text: 'text-pink-700',   icon: 'fa-umbrella-beach' },
        HOLIDAY:{ id: 'HOLIDAY',label: 'Férié',       color: 'bg-red-50',       border: 'border-red-200',    text: 'text-red-600',    icon: 'fa-flag' },
        OFF:    { id: 'OFF',    label: 'Week-end',    color: 'bg-slate-100',    border: 'border-slate-200',  text: 'text-slate-400',  icon: 'fa-mug-hot' }
    }
};
