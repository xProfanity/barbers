export const map_services = (services: Service[]) => `
	${services.sort((a, b) => b.booked - a.booked).map((service, index) => `
		<li data-id="${index}">
			<p class="name">${service.name}</p>
			<p>${service.description}</p>
			<div class="details">
				<span class="time">~ ${service.duration_minutes} mins</span>
				<span class="price">MWK ${parseInt(service.price).toLocaleString()}</span>
			</div>
			<div class="footer">
				<p hx-get="/api/bookings-count/${service.id}" hx-trigger="refresh-target from:#book-btn-${index+1} delay:500ms, load"></p>
				${service.booked ? (
					`<div class="booked-actions">
						<a hx-get="/api/appointment-details">View Appointment</a>
						<p>booked</p>
					</div>`
				) : (
					`<button
						id="book-btn-${index+1}"
						hx-post="/api/appointment"
						hx-vals="js:{service_id: ${service.id}}"
						hx-on::after-request="customToast('Cancel other appointment first', true)"
						hx-swap="outerHTML"
					>
						Book Now
					</button>`
				)}
			</div>
		</li>`
).join('')}
`
