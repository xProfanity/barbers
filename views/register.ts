const registerPage = () => `
	<div class="container">
		<div class="container-login">
			<img
				src="/barbers.png"
				width="600"
			/>

			<form>
				<label>Username</label>
				<input
					class="text-input"
					type="text"
					name="username"
					required
				/>
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
				<button hx-post="/auth/register" hx-target=".error">Register</button>
				<a href="/auth/login">I already have an account</a>
			</div>
			</form>
		</div>
	</div>
`

export default registerPage

