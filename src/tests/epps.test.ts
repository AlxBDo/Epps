import { describe, it, expect, beforeEach } from 'vitest';
import { Epps } from '../plugins/epps';
import ParentStore from '../plugins/parentStore';
import { useWebUserStore, WebUserState, WebUserStore } from '../stores/webuser';
import { useErrorsStore } from '../stores/errors';
import { EppsStore } from '../types';
import { createPinia, setActivePinia } from 'pinia';


describe('Epps', () => {
    let epps: Epps;
    let parentStores: ParentStore[];

    beforeEach(() => {
        setActivePinia(createPinia());

        parentStores = [
            new ParentStore('webuser', useWebUserStore),
            new ParentStore('errors', useErrorsStore),
        ];

        epps = new Epps({
            actionsToExtends: ['setData'],
            parentsStores: parentStores,
        });
    });

    it('should initialize with the correct properties', () => {
        expect(epps.actionsToExtends).toEqual(['setData']);
        expect(epps.persist).toBeUndefined();
        expect(epps.propertiesToRename).toBeUndefined();
    });

    it('should build stores with the correct childId', () => {
        const childId = 'testChild';
        epps.childId = childId;
        epps.buildStores();

        const stores = epps.parentsStores();
        expect(stores).toHaveLength(parentStores.length);
        stores.forEach((store, index) => {
            expect(store).toBeDefined();
            expect(store.$id).toBe(`${parentStores[index].id}${childId}`);
        });
    });

    it('should get a store by id', () => {
        const childId = 'testChild';
        const store = epps.getStore('webuser', childId) as EppsStore<WebUserStore, WebUserState>;
        expect(store).toBeDefined();
        expect(store?.$id).toBe(`webuser${childId}`);
    });

    it('should get a store by index', () => {
        const childId = 'testChild';
        const store = epps.getStore(0, childId) as EppsStore<WebUserStore, WebUserState>;

        expect(store).toBeDefined();
        expect(store?.$id).toBe(`webuser${childId}`);
    });

    it('should return undefined if the store is not found', () => {
        const childId = 'testChild';
        const store = epps.getStore('nonexistent', childId);
        expect(store).toBeUndefined();
    });

    it('should return all stores', () => {
        const childId = 'testChild';
        const stores = epps.getStores(childId);
        expect(stores).toHaveLength(parentStores.length);
        stores.forEach((store, index) => {
            expect(store).toBeDefined();
            expect(store.$id).toBe(`${parentStores[index].id}${childId}`);
        });
    });
});
