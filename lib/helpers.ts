export const findSession = (sessionId: string) => {
	return {user: "404", id: "fym"}
}

export const safeHTML = (text: string) => {
	return String(text)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&`#39`;")
}
