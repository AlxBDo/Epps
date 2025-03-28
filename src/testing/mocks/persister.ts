import Persister from "../../services/Persister";
import { ClientStorage } from "../../types/storage";
import { localStorageMock } from "./localStorage";

export default class PersisterMock extends Persister {
    override defineDb(): ClientStorage {
        return localStorageMock
    }
}