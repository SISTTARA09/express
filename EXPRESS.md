# Express Cour

## Basic Usage

```js
import express, {Router} from "express";

const PORT: number = 4000; // port
const app: any = express(); // app
const router: any = Router(); // router
```

## Status Code

```js
// status code
/*
200 // for get success
201 // for create success
204 // for delete success

301 Moved Permanently // redirect to new URL permanently

400 Bad request
401 // Unauthorized // The request requires authentication.
404 // for get Not Found

500 // for internal server error
*/
```
