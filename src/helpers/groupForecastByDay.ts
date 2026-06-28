import type { ForecastDay, ForecastListItem } from '../types/weather';

export function groupForecastByDay(list: ForecastListItem[]): ForecastDay[] {
  const dayMap = new Map<string, ForecastListItem[]>();

  for (const item of list) {
    const day = item.dt_txt.slice(0, 10);
    const existing = dayMap.get(day);
    if (existing !== undefined) {
      existing.push(item);
    } else {
      dayMap.set(day, [item]);
    }
  }

  const result: ForecastDay[] = [];

  for (const [, items] of dayMap) {
    const first = items[0];
    if (first === undefined) continue;

    const noon = items.find((i) => i.dt_txt.endsWith('12:00:00'));
    const iconItem = noon ?? first;

    const tempHigh = Math.round(Math.max(...items.map((i) => i.main.temp_max)));
    const tempLow = Math.round(Math.min(...items.map((i) => i.main.temp_min)));
    const humidity = Math.round(items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length);

    result.push({
      date: new Date(first.dt_txt).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      icon: iconItem.weather[0]?.icon ?? '',
      tempHigh,
      tempLow,
      humidity,
    });

    if (result.length === 5) break;
  }

  return result;
}
