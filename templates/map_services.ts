export const map_services = (services: Service[]) => `
	${services.map((service, index) => `
		<li data-id="${index}">
			<p class="name">${service.name}</p>
			<p>${service.description}</p>
			<div class="details">
				<span class="time">~ ${service.duration_minutes} mins</span>
				<span class="price">MWK ${parseInt(service.price).toLocaleString()}</span>
			</div>
			<div class="footer">
				<p hx-get="/api/bookings-count/${service.total_bookings}" hx-trigger="load"></p>
				<button>Book Now</button>
			</div>
		</li>`
).join('')}
`
