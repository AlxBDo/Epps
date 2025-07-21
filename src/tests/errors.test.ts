import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { ErrorsStore, ErrorsState, useErrorsStore } from '../stores/errors';
import { EppsStore } from '../types';

describe('useErrorsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should add an error with default level', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;
        const error = { id: '1', message: 'Test error' };

        store.addError(error);

        expect(store.errors).toHaveLength(1);
        expect(store.errors[0]).toEqual({ ...error, level: 1 });
    });

    it('should add an error with specified level', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;
        const error = { id: '2', level: 2, message: 'Test error' };

        store.addError(error);

        expect(store.errors).toHaveLength(1);
        expect(store.errors[0]).toEqual(error);
    });

    it('should throw an error if id is missing', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;
        const error = { id: '', message: 'Test error' };

        expect(() => store.addError(error)).toThrow('testStore - addError - Error: id is required');
    });

    it('should get an error by id', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;
        const error = { id: '3', message: 'Test error' };

        store.addError(error);

        const retrievedError = store.getError('3');
        expect(retrievedError).toEqual({ ...error, level: 1 });
    });

    it('should return undefined if error id does not exist', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;

        const retrievedError = store.getError('non-existent-id');
        expect(retrievedError).toBeUndefined();
    });

    it('should get errors by level', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;
        const error1 = { id: '4', level: 1, message: 'Test error 1' };
        const error2 = { id: '5', level: 2, message: 'Test error 2' };

        store.addError(error1);
        store.addError(error2);

        const errors = store.getErrors(2, 'level');
        expect(errors).toHaveLength(1);
        expect(errors[0]).toEqual(error2);
    });

    it('should throw an error if level is not a number', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;

        expect(() => store.getErrors('invalid', 'level')).toThrow('testStore - getErrors - level is number but its value is : invalid');
    });

    it('should check if there is an error with a specific level', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;
        const error = { id: '6', level: 3, message: 'Test error' };

        store.addError(error);

        expect(store.hasError(2)).toBe(true);
        expect(store.hasError(4)).toBe(false);
    });

    it('should return false if no errors are present', () => {
        const store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>;

        expect(store.hasError()).toBe(false);
    });
});