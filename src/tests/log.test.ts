import { describe, it, expect, vi } from 'vitest'
import { eppsLog, eppsLogError } from '../utils/log'

describe('log', () => {
    it('should log a message with default styles', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        eppsLog('Test message');
        expect(consoleSpy).toHaveBeenCalledWith(
            '%c%s',
            'background-color: #ffec73; color: green; padding: 1px; margin-right: 5px; font-size: 12px',
            ' [🍍⚡ Epps! plugin] - Test message ',
            undefined
        );
        consoleSpy.mockRestore();
    });

    it('should log a message with custom styles', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        eppsLog('Test message', undefined, { bgColor: '#000000', color: '#ffffff', icon: '🔥' });
        expect(consoleSpy).toHaveBeenCalledWith(
            '%c%s',
            'background-color: #000000; color: #ffffff; padding: 1px; margin-right: 5px; font-size: 12px',
            ' [🔥 Epps! plugin] - Test message ',
            undefined
        );
        consoleSpy.mockRestore();
    });
});

describe('eppsLogError', () => {
    it('should log an error message with error styles', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        eppsLogError('Test error');
        expect(consoleSpy).toHaveBeenCalledWith(
            '%c%s',
            'background-color: #d24545; color: white; padding: 1px; margin-right: 5px; font-size: 12px',
            ' [🍍⚠️ Epps! plugin] - Test error ',
            undefined
        );
        consoleSpy.mockRestore();
    });
});