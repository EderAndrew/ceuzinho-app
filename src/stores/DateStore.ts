import { create } from "zustand"

export interface DateState {
  currentDate: string;
  selectedDate: string;
  correctedDate: string;
  timezone: string;
  locale: string;
}

export interface DateStore extends DateState {
  // Actions
  setCurrentDate: (date: string) => void;
  setSelectedDate: (date: string) => void;
  setCorrectedDate: (date: string) => void;
  setTimezone: (timezone: string) => void;
  setLocale: (locale: string) => void;
  
  // Computed
  getFormattedDate: (date?: string, format?: 'short' | 'long' | 'time') => string;
  isToday: (date: string) => boolean;
  isFuture: (date: string) => boolean;
  isPast: (date: string) => boolean;
  getDateDifference: (date1: string, date2: string) => number; // em dias
  addDays: (date: string, days: number) => string;
  subtractDays: (date: string, days: number) => string;
  
  // Validation
  isValidDate: (date: string) => boolean;
  isWeekend: (date: string) => boolean;
  isBusinessDay: (date: string) => boolean;
}

export const useDateStore = create<DateStore>((set, get) => ({
  // Initial state
  currentDate: new Date().toISOString().split('T')[0],
  selectedDate: new Date().toISOString().split('T')[0],
  correctedDate: new Date().toISOString().split('T')[0],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  locale: 'pt-BR',

  // Actions
  setCurrentDate: (date) => set({ currentDate: date }),
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setCorrectedDate: (date) => set({ correctedDate: date }),
  
  setTimezone: (timezone) => set({ timezone }),
  
  setLocale: (locale) => set({ locale }),

  // Computed
  getFormattedDate: (date, format = 'short') => {
    const targetDate = date || get().selectedDate;
    const dateObj = new Date(targetDate);
    
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString(get().locale);
      case 'long':
        return dateObj.toLocaleDateString(get().locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'time':
        return dateObj.toLocaleTimeString(get().locale, {
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return dateObj.toLocaleDateString(get().locale);
    }
  },

  isToday: (date) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  },

  isFuture: (date) => {
    const today = new Date().toISOString().split('T')[0];
    return date > today;
  },

  isPast: (date) => {
    const today = new Date().toISOString().split('T')[0];
    return date < today;
  },

  getDateDifference: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  addDays: (date, days) => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj.toISOString().split('T')[0];
  },

  subtractDays: (date, days) => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() - days);
    return dateObj.toISOString().split('T')[0];
  },

  // Validation
  isValidDate: (date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  },

  isWeekend: (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDay();
    return day === 0 || day === 6; // Domingo ou Sábado
  },

  isBusinessDay: (date) => {
    return !get().isWeekend(date);
  }
}));

// Hook de compatibilidade
export const useDate = () => {
  const { selectedDate, setSelectedDate } = useDateStore();
  return {
    date: selectedDate,
    setDate: setSelectedDate
  };
};