const loginPage = () => `
	<div class="container">
		<div class="container-login">
			<img
				src="/barbers.png"
				width="600"
			/>

			<form>
				<label>Phone Number</label>
				<input
					class="text-input"
					type="tel"
					name="phone"
					required
				/>
				<label>Password</label>
				<input
					class="text-input"
					type="password"
					name="password"
					required
				/>

				<p class="error"></p>

				<div class="buttons">
					<button hx-post="/auth/login" hx-target=".error">Login</button>
					<a href="/auth/register">I don't have an account</a>
				</div>
			</form>
		</div>
	</div>
`

export default loginPage
