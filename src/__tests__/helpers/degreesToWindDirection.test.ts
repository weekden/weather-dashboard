import { degreesToWindDirection } from '../../helpers/degreesToWindDirection';

describe('degreesToWindDirection', () => {
  describe('cardinal and intercardinal directions', () => {
    it('0° → N ↑', () => {
      expect(degreesToWindDirection(0)).toBe('N ↑');
    });

    it('45° → NE ↗', () => {
      expect(degreesToWindDirection(45)).toBe('NE ↗');
    });

    it('90° → E →', () => {
      expect(degreesToWindDirection(90)).toBe('E →');
    });

    it('135° → SE ↘', () => {
      expect(degreesToWindDirection(135)).toBe('SE ↘');
    });

    it('180° → S ↓', () => {
      expect(degreesToWindDirection(180)).toBe('S ↓');
    });

    it('225° → SW ↙', () => {
      expect(degreesToWindDirection(225)).toBe('SW ↙');
    });

    it('270° → W ←', () => {
      expect(degreesToWindDirection(270)).toBe('W ←');
    });

    it('315° → NW ↖', () => {
      expect(degreesToWindDirection(315)).toBe('NW ↖');
    });
  });

  describe('edge cases', () => {
    it('360° wraps to N ↑', () => {
      expect(degreesToWindDirection(360)).toBe('N ↑');
    });

    it('negative degrees: -90° → W ←', () => {
      expect(degreesToWindDirection(-90)).toBe('W ←');
    });

    it('degrees > 360: 405° → NE ↗', () => {
      expect(degreesToWindDirection(405)).toBe('NE ↗');
    });
  });

  describe('rounding boundary', () => {
    it('22° rounds down → N ↑', () => {
      expect(degreesToWindDirection(22)).toBe('N ↑');
    });

    it('23° rounds up → NE ↗', () => {
      expect(degreesToWindDirection(23)).toBe('NE ↗');
    });
  });
});
