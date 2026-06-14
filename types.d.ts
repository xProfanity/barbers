declare interface LoginFormData {
	phone: string
	password: string
}

declare interface Service {
	id: number
  name: string
  description: string 
	duration_minutes: number
  price: string
  active: number
	total_bookings: number
	booked: boolean
}

declare interface User {
	username: string
	id: number
	role: string
	phone: string
}
