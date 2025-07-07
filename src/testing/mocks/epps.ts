import { Epps } from "../../plugins/epps";
import Crypt from "../../services/Crypt";
import PersisterMock from "./persister";

export function createPluginMock(dbName: string, cryptKey?: string) {
    let crypt: Crypt | undefined

    if (cryptKey) {
        crypt = new Crypt(cryptKey)
    }
    const epps = new Epps(new PersisterMock({ name: dbName }), crypt)

    return epps.plugin.bind(epps)
}