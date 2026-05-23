const homePage = () => `
	<div class="container">
		<header>
			<div class="user-profile">
				<p>Hi <span hx-get="/api/user" hx-trigger="load"></span></p>
				<p>Are you ready to book?</p>	
			</div>

			<div>
				<button hx-get="/auth/sign-out">
					Sign Out
				</button>
			</div>
		</header>
	</div>
`

export default homePage
