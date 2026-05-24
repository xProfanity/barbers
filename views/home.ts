const homePage = () => `
	<div class="container">
		<header>
			<div class="user-profile">
				<p>Hi <span hx-get="/api/user" hx-trigger="load"></span></p>
				<p class="caption">Are you ready to book?</p>	
			</div>

			<div>
				<button hx-post="/auth/sign-out">
					Sign Out
				</button>
			</div>
		</header>
		<hr />
		
		<div>
			<h1>Services</h1>
		</div>
	</div>
`

export default homePage
