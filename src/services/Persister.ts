import WindowStorage from './WindowStorage'
import { AllowedKeyPath, ClientStorage, StorageItem } from '../types/storage'
import IndexedDB from './IndexedDB'
import { log, eppsLogError } from '../utils/log'
import { localStorageMock } from '../testing/mocks/localStorage'

export type DbOptions = {
    keyPath?: AllowedKeyPath
    name: string
}

export default class Persister {
    private _db: ClientStorage
    private _db_options: DbOptions

    get dbName(): string {
        return this._db_options.name
    }

    constructor(dbOptions: DbOptions) {
        if (!dbOptions) {
            throw new Error('DbOptions is required')
        }

        this._db_options = dbOptions
        this._db = this.defineDb()
    }

    defineDb(): ClientStorage {
        let { keyPath, name } = this._db_options
        let db: ClientStorage

        switch (name) {
            case 'localStorage': case 'sessionStorage':
                db = new WindowStorage(name)
                break;
            default:
                if (!keyPath) {
                    keyPath = 'storeName'
                }
                db = new IndexedDB(name, { keyPath })
        }
        return db
    }

    getItem(itemKey: string): Promise<StorageItem | undefined> {
        return new Promise((resolve, reject) => {
            if (!this._db) { return reject('No db found') }

            try {
                return this._db.getItem(itemKey).then(item => resolve(item))
            } catch (e) {
                reject(e)
            }
        })
    }

    removeItem(itemKey: string) {
        this._db.removeItem(itemKey)
    }


    setItem(key: string, item: any) {
        if (this._db instanceof IndexedDB) {
            try {
                this._db.getItem(key).then(persistedItem => {
                    if (persistedItem) {
                        const db = this._db as IndexedDB
                        db.updateItem(persistedItem)
                    } else {
                        this._db.setItem({ storeName: key, ...item })
                    }
                })
            } catch (e) {
                eppsLogError('Persister - setItem Error', e)
                this._db.setItem({ storename: key, ...item })
            }
        } else {
            this._db.setItem(item, key)
        }
    }
}