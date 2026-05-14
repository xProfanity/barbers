import {Hono} from "hono"
import {serveStatic} from "@hono/node-server/serve-static"

import getStaticIndexPage from "./views/index.ts"
import homePage from "./views/home.ts"
import authMiddleware from "./middlewares/authMiddleware.ts"
import notFoundPage from "./views/not-found.ts"
import registerPage from "./views/register.ts"

import loginUser from "./handlers/auth.ts"

const app = new Hono()

app.use(serveStatic({
	root: './public'
}))

app.notFound((c) => {
	return c.html(getStaticIndexPage("Skill Issue(404)", notFoundPage()))
})

app.use("/home", authMiddleware)

app.get("/", (c) => {
	return c.redirect("/home")
})

app.get("/home", (c) => {
	return c.html(getStaticIndexPage("Barbers - Home", homePage()))
})

app.route("/login", loginUser)

app.get("/register", (c) => {
	return c.html(getStaticIndexPage("Barbers - Register", registerPage()))
})

Bun.serve({
	port: process.env.PORT || 3000,
	fetch: app.fetch
})
