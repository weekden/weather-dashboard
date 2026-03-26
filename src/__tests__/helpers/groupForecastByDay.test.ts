import { groupForecastByDay } from '../../helpers/groupForecastByDay';
import type { ForecastDay, ForecastListItem } from '../../types/weather';

function makeItem(
  dt_txt: string,
  temp_max: number,
  temp_min: number,
  humidity: number,
  icon: string
): ForecastListItem {
  return { dt_txt, main: { temp_max, temp_min, humidity }, weather: [{ icon }] };
}

describe('groupForecastByDay', () => {
  it('returns empty array for empty input', () => {
    expect(groupForecastByDay([])).toEqual([]);
  });

  it('groups items by day and returns one entry per day', () => {
    const list = [
      makeItem('2024-03-26 09:00:00', 18, 12, 75, '02d'),
      makeItem('2024-03-26 15:00:00', 20, 11, 70, '03d'),
      makeItem('2024-03-27 09:00:00', 14, 8, 85, '10d'),
    ];

    const result = groupForecastByDay(list);

    expect(result).toHaveLength(2);
  });

  it('uses noon item icon when available', () => {
    const list = [
      makeItem('2024-03-26 09:00:00', 18, 12, 75, '02d'),
      makeItem('2024-03-26 12:00:00', 20, 13, 70, '01d'),
      makeItem('2024-03-26 15:00:00', 19, 12, 72, '03d'),
    ];

    const result = groupForecastByDay(list);

    expect(result[0]?.icon).toBe('01d');
  });

  it('falls back to first item icon when no noon slot', () => {
    const list = [
      makeItem('2024-03-26 09:00:00', 18, 12, 75, '02d'),
      makeItem('2024-03-26 15:00:00', 20, 11, 70, '03d'),
    ];

    const result = groupForecastByDay(list);

    expect(result[0]?.icon).toBe('02d');
  });

  it('computes tempHigh as max of temp_max across the day', () => {
    const list = [
      makeItem('2024-03-26 09:00:00', 15, 10, 70, '01d'),
      makeItem('2024-03-26 12:00:00', 22, 12, 65, '01d'),
      makeItem('2024-03-26 18:00:00', 18, 11, 68, '01d'),
    ];

    const result = groupForecastByDay(list);

    expect(result[0]?.tempHigh).toBe(22);
  });

  it('computes tempLow as min of temp_min across the day', () => {
    const list = [
      makeItem('2024-03-26 09:00:00', 15, 10, 70, '01d'),
      makeItem('2024-03-26 12:00:00', 22, 12, 65, '01d'),
      makeItem('2024-03-26 18:00:00', 18, 7, 68, '01d'),
    ];

    const result = groupForecastByDay(list);

    expect(result[0]?.tempLow).toBe(7);
  });

  it('computes humidity as rounded average across the day', () => {
    const list = [
      makeItem('2024-03-26 09:00:00', 15, 10, 75, '01d'),
      makeItem('2024-03-26 12:00:00', 22, 12, 70, '01d'),
    ];

    const result = groupForecastByDay(list);

    // (75 + 70) / 2 = 72.5 → rounds to 73
    expect(result[0]?.humidity).toBe(73);
  });

  it('rounds tempHigh and tempLow', () => {
    const list = [makeItem('2024-03-26 09:00:00', 18.7, 11.3, 70, '01d')];

    const result = groupForecastByDay(list);

    expect(result[0]?.tempHigh).toBe(19);
    expect(result[0]?.tempLow).toBe(11);
  });

  it('caps result at 5 days', () => {
    const list = [
      makeItem('2024-03-26 12:00:00', 20, 10, 70, '01d'),
      makeItem('2024-03-27 12:00:00', 18, 9, 72, '02d'),
      makeItem('2024-03-28 12:00:00', 16, 8, 74, '03d'),
      makeItem('2024-03-29 12:00:00', 14, 7, 76, '04d'),
      makeItem('2024-03-30 12:00:00', 12, 6, 78, '05d'),
      makeItem('2024-03-31 12:00:00', 10, 5, 80, '10d'),
    ];

    const result = groupForecastByDay(list);

    expect(result).toHaveLength(5);
  });

  it('returns ForecastDay objects with required fields', () => {
    const list = [makeItem('2024-03-26 12:00:00', 20, 10, 70, '01d')];

    const result = groupForecastByDay(list);

    expect(result[0]).toMatchObject<ForecastDay>({
      date: expect.any(String) as string,
      icon: '01d',
      tempHigh: 20,
      tempLow: 10,
      humidity: 70,
    });
    expect(result[0]?.date).not.toBe('');
  });
});
