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
				/>
				<label>Phone Number</label>
				<input
					class="text-input"
					type="text"
					name="phone"
				/>
				<label>Password</label>
				<input
					class="text-input"
					type="password"
					name="password"
				/>

			<p class="error"></p>
				
			<div class="buttons">
				<button>Register</button>
				<a href="/login">I already have an account</a>
			</div>
			</form>
		</div>
	</div>
`

export default registerPage

