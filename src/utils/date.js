// src/utils/date.js

/**
 * Mengubah string tanggal menjadi format log 24 Jam
 * Contoh: 17/01/2026, 23:57:04
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'NEVER';
  
  return new Date(dateString).toLocaleString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false // Format 24 Jam
  });
};

/**
 * Mengubah string tanggal menjadi format YYYY-MM-DD
 * Digunakan untuk nilai default pada <input type="date">
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};