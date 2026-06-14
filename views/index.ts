const getStaticIndexPage = (title: string, content: string) => `
	<html>
		<head>
			<title>${title}</title>
			<link rel="stylesheet" href="/styles/global.css" >
			<link rel="stylesheet" href="/styles/main.css" >
			<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
			<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.10/dist/htmx.min.js" integrity="sha384-H5SrcfygHmAuTDZphMHqBJLc3FhssKjG7w/CeCpFReSfwBWDTKpkzPP8c+cLsK+V" crossorigin="anonymous"></script>
		</head>
		<body>
			<main>
				${content}
			</main>
		<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
		<script>
			function customToast(text, isError = false) {
				Toastify({
					text,
					gravity: 'top',
					position: 'center',
					style: {
						background: isError ? '#ED4337' : '#C7A0D5'
					} 
				}).showToast()
			}
		</script>
		</body>
	</html>
`

export default getStaticIndexPage
