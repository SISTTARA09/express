import express, { Router, Request, Response } from "express";
import { log } from "node:console";
import { editDataBase, readDataBase } from "./methods.js";
import _ from "lodash";
import bodyParser from "body-parser";
/// IMPORTS
const PORT: number = 4000; // port
const app: any = express(); // app
const router: any = Router(); // router

interface List {
	id: number;
	title: string;
}

app.use(bodyParser.json()); // body parser
app.use("/", router);


// this gets the database path
const DB_PATH: string = process.cwd() + "/src/json/lists.json";
///

router
	.get("/", async (req: Request, res: Response): Promise<void> => {
		const { id } = req.query;
		const LISTS_FROM_DB: List[] = await readDataBase(DB_PATH);
		// if there are an Id
		if (id) {
			try {
				const targetList: List | undefined = _.find(LISTS_FROM_DB, {
					id: Number(id),
				});
				// handling if the target list is found
				if (targetList) {
					res.json(targetList);
					return;
				}
				/// if the target list is not found
				res.status(400).send("list Not Found");
			} catch (err: any) {
				throw new Error(err.message);
			}
		}
		/// else
		res.json(LISTS_FROM_DB);
	})
	.post("/lists", async (req: Request, res: Response) => {
		const upCommingList: any = req.body;
		const LISTS_FROM_DB : List[] = await readDataBase(DB_PATH);
		if (upCommingList) {
			try {
				LISTS_FROM_DB.push({ id: LISTS_FROM_DB.length + 1, ...upCommingList });
				const response: string = await editDataBase(
					DB_PATH,
					JSON.stringify(LISTS_FROM_DB)
				);
				res.status(201).send(response);
			} catch (err: any) {
				throw new Error(err.message);
			}
		}
	})
	.delete("/lists", async (req: Request, res: Response) => {
		const { searchId } = req.query;
		if (Number.isNaN(Number(searchId))) {
			res.status(400).send("Invalid search ID");
		}
		try {
			const LISTS_FROM_DB: any = await readDataBase(DB_PATH);
			const targetTask: any = _.find(LISTS_FROM_DB, { id: Number(searchId) });
			const NEW_TASKS_LIST: any = _.filter(
				LISTS_FROM_DB,
				(task) => task !== targetTask
			);
			await editDataBase(DB_PATH, JSON.stringify(NEW_TASKS_LIST));
			res.status(204).send("Task Deleted Successfully :)");
		} catch (err: any) {
			throw new Error(err.message);
		}
	})
	.patch("/lists", async (req: Request, res: Response) => {
		const { searchId } = req.query;
		const newData: any = req.body;
		if (Number.isNaN(Number(searchId))) {
			res.status(400).send("Invalid search ID");
		}
		try {
			const LISTS_FROM_DB: any = await readDataBase(DB_PATH);
			let targetTask = _.find(LISTS_FROM_DB, { id: Number(searchId) });
			targetTask = {
				...targetTask,
				...newData,
			};
			LISTS_FROM_DB[Number(searchId) - 1] = targetTask;
			await editDataBase(DB_PATH, JSON.stringify(LISTS_FROM_DB));
			res.status(201).send("The task was successfully updated:)");
		} catch (err: any) {
			res.status(500).send(`Internal Server Error:${err.message}`);
			throw new Error(err.message);
		}
	});
// LISTEN
app.listen(PORT, () => log(`listening on port ${PORT}`));
