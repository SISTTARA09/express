var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express, { Router } from "express";
import { log } from "node:console";
import { editDataBase, readDataBase } from "./methods.js";
import _ from "lodash";
import bodyParser from "body-parser";
const PORT = 4000;
const app = express();
const router = Router();
app.use(bodyParser.json());
app.use("/", router);
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
const DB_PATH = process.cwd() + "/src/json/lists.json";
router
    .get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const LISTS_FROM_DB = yield readDataBase(DB_PATH);
    if (id) {
        try {
            const targetList = _.find(LISTS_FROM_DB, { id: Number(id) });
            if (targetList) {
                res.json(targetList);
                return;
            }
            return res.status(400).send("list Not Found");
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    res.json(LISTS_FROM_DB);
}))
    .post("/lists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let upCommingList = req.body;
    const LISTS_FROM_DB = yield readDataBase(DB_PATH);
    if (upCommingList) {
        try {
            LISTS_FROM_DB.push(Object.assign({ id: LISTS_FROM_DB.length + 1 }, upCommingList));
            const response = yield editDataBase(DB_PATH, JSON.stringify(LISTS_FROM_DB));
            res.status(201).send(response);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
}))
    .delete("/lists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchId } = req.query;
    if (Number.isNaN(Number(searchId))) {
        res.status(400).send("Invalid search ID");
    }
    try {
        const LISTS_FROM_DB = yield readDataBase(DB_PATH);
        const targetTask = _.find(LISTS_FROM_DB, { id: Number(searchId) });
        const NEW_TASKS_LIST = _.filter(LISTS_FROM_DB, (task) => task !== targetTask);
        yield editDataBase(DB_PATH, JSON.stringify(NEW_TASKS_LIST));
        res.status(204).send("Task Deleted Successfully :)");
    }
    catch (err) {
        throw new Error(err.message);
    }
}))
    .patch("/lists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchId } = req.query;
    const newData = req.body;
    if (Number.isNaN(Number(searchId))) {
        res.status(400).send("Invalid search ID");
    }
    try {
        const LISTS_FROM_DB = yield readDataBase(DB_PATH);
        let targetTask = _.find(LISTS_FROM_DB, { id: Number(searchId) });
        targetTask = Object.assign(Object.assign({}, targetTask), newData);
        LISTS_FROM_DB[searchId - 1] = targetTask;
        yield editDataBase(DB_PATH, JSON.stringify(LISTS_FROM_DB));
        res.status(201).send("The task was successfully updated:)");
    }
    catch (err) {
        res.status(500).send("Internal Server Error: ", err.message);
        throw new Error(err.message);
    }
}));
app.listen(PORT, () => log(`listening on port ${PORT}`));
