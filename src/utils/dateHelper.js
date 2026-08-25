/**
 * Sharjah EPA Date Filtering Engine
 * Handles date range calculations across all platform telemetry, work orders, calibrations, and procurement data.
 */

export const REF_TODAY = '2026-08-25';

export function isDateInRange(dateInput, filter = 'TODAY', customStart = '2026-08-25', customEnd = '2026-08-25') {
  if (!dateInput) return true;
  if (filter === 'ALL') return true;

  // Extract clean YYYY-MM-DD
  let cleanDate = '';
  if (typeof dateInput === 'string') {
    cleanDate = dateInput.split('T')[0].split(' ')[0];
  } else if (dateInput instanceof Date) {
    cleanDate = dateInput.toISOString().split('T')[0];
  }

  if (!cleanDate) return true;

  const targetTime = new Date(cleanDate).getTime();
  const todayTime = new Date(REF_TODAY).getTime();

  if (isNaN(targetTime)) return true;

  if (filter === 'TODAY') {
    return cleanDate === REF_TODAY;
  }

  if (filter === '7D') {
    const start7 = new Date('2026-08-19').getTime();
    return targetTime >= start7 && targetTime <= todayTime;
  }

  if (filter === '15D') {
    const start15 = new Date('2026-08-11').getTime();
    return targetTime >= start15 && targetTime <= todayTime;
  }

  if (filter === '30D') {
    const start30 = new Date('2026-07-27').getTime();
    return targetTime >= start30 && targetTime <= todayTime;
  }

  if (filter === 'CUSTOM') {
    const start = customStart ? new Date(customStart).getTime() : 0;
    const end = customEnd ? new Date(customEnd).getTime() : Infinity;
    return targetTime >= start && targetTime <= end;
  }

  return true;
}

export function getDateRangeLabel(filter = 'TODAY', customStart = null, customEnd = null) {
  switch (filter) {
    case 'TODAY': return 'Today (25 Aug 2026)';
    case '7D': return 'Last 7 Days (19 - 25 Aug 2026)';
    case '15D': return 'Last 15 Days (11 - 25 Aug 2026)';
    case '30D': return 'Last 30 Days (27 Jul - 25 Aug 2026)';
    case 'ALL': return 'All Time Historical Data';
    case 'CUSTOM': return customStart && customEnd ? `${customStart} to ${customEnd}` : 'Custom Date Range';
    default: return 'Today (25 Aug 2026)';
  }
}
