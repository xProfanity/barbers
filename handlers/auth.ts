import {Hono} from "hono"
import getStaticIndexPage from "../views/index.ts"
import loginPage from "../views/login.ts"

const app = new Hono()


app.get("/", (c) => {
	return c.html(getStaticIndexPage("Barbers - Login", loginPage()))
})

app.post("/", async (c) => {

	const body = await c.req.formData();

	return c.json(body)
})

export default app
