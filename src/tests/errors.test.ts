import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorsStore, ErrorsState, useErrorsStore, IError } from '../stores/errors';
import { EppsStore } from '../types';
import { createAppAndPinia } from './utils/beforeEach';

describe('useErrorsStore', () => {
    const errors: IError[] = [
        { id: '1', level: 1, message: 'Test error 1' },
        { id: '2', level: 2, message: 'Test error 2' },
        { id: '3', level: 3, message: 'Test error 3' },
        { id: '4', level: 4, message: 'Test error 4' }
    ]

    let store: EppsStore<ErrorsStore, ErrorsState>

    beforeEach(() => {
        createAppAndPinia()

        if (!store) {
            store = useErrorsStore('test') as EppsStore<ErrorsStore, ErrorsState>
        }
    });

    it('should add an error with default level', () => {
        store.addError({ id: '1', message: 'Test error' });
        expect((store.getErrors() as IError[])[0]).toEqual({ id: '1', level: 1, message: 'Test error' });
    });

    it('Cannot add an error that already exists', () => {
        store.addError({ id: '1', message: 'Test error' });
        expect((store.getErrors() as IError[]).length).toBe(1);
    });

    it('should add an error with specified level', () => {
        store.addError(errors[1]);
        expect((store.getErrors() as IError[])[1]).toEqual(errors[1]);
    });

    it('should throw an error if id is missing', () => {
        const error = { id: '', message: 'Test error' };
        expect(() => store.addError(error)).toThrow('testStore - addError - Error: id is required');
    });

    it('should get an error by id', () => {
        expect(store.getErrorById('2')).toEqual(errors[1]);
    });

    it('should return undefined if error id does not exist', () => {
        const retrievedError = store.getErrorById('non-existent-id');
        expect(retrievedError).toBeUndefined();
    });

    it('should remove an error with specified id', () => {
        store.removeError({ id: '1' });
        expect(store.getErrorById('1')).toBeUndefined()
        expect(store.getErrors()).toEqual([errors[1]]);
    });

    it('should check if there is an error with a specific level', () => {
        expect(store.hasError(2)).toBe(true);
        expect(store.hasError(4)).toBe(false);
    });

    it('should get errors with a specific level', () => {
        store.setErrors(errors);
        expect(store.getErrorsByLevel(1)).toStrictEqual(errors);
        expect(store.getErrorsByLevel(2, '>')).toStrictEqual([errors[2], errors[3]]);
        expect(store.getErrorsByLevel(2, '<=')).toStrictEqual([errors[0], errors[1]]);
        expect(store.getErrorsByLevel(2, '<')).toStrictEqual([errors[0]]);
    });

    it('should return false if no errors are present', () => {
        store.clearErrors()
        expect(store.hasError()).toBe(false);
    });
});