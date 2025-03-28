import { Epps } from "../../plugins/epps";
import Crypt from "../../services/Crypt";
import PersisterMock from "./persister";

export function createPluginMock(dbName: string, cryptIv?: string, cryptKey?: string) {
    let crypt: Crypt | undefined

    if (cryptIv && cryptKey) {
        crypt = new Crypt(cryptKey, cryptIv)
    }
    const epps = new Epps(new PersisterMock({ name: dbName }), crypt)

    return epps.plugin.bind(epps)
}