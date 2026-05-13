const getStaticIndexPage = (title: string, content: string) => `
	<html>
		<head>
			<title>${title}</title>
			<link rel="stylesheet" href="/styles/global.css" >
			<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.10/dist/htmx.min.js" integrity="sha384-H5SrcfygHmAuTDZphMHqBJLc3FhssKjG7w/CeCpFReSfwBWDTKpkzPP8c+cLsK+V" crossorigin="anonymous"></script>
		</head>
		<body>${content}</body>
	</html>
`

export default getStaticIndexPage
