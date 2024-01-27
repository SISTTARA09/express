var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile, writeFile } from "node:fs/promises";
function readDataBase(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileContent = yield readFile(path, "utf8");
            return JSON.parse(fileContent);
        }
        catch (err) {
            throw new Error(err.message);
        }
    });
}
function editDataBase(path, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield writeFile(path, data);
            return 'editDataBase was successfully completed!!';
        }
        catch (err) {
            throw new Error(err.message);
        }
    });
}
export { readDataBase, editDataBase };
