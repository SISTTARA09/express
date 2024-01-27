import { readFile, writeFile } from "node:fs/promises";

async function readDataBase(path: string): Promise<any> {
	try {
		const fileContent: string = await readFile(path, "utf8");
		return JSON.parse(fileContent);
	} catch (err: any) {
		throw new Error(err.message);
	}
}
async function editDataBase(path: string, data: any): Promise<string> {
	try {
		await writeFile(path, data);
		return "editDataBase was successfully completed!!";
	} catch (err: any) {
		throw new Error(err.message);
	}
}

export { readDataBase, editDataBase };
