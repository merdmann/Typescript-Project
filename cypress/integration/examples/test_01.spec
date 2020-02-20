describe('Main Page', function() {
	beforeEach(() => { cy.visit("http://127.0.0.1:5500/html/index.html") })

	it('should do nothing', function() {
		console.log('Hallo') 
		cy.get("h2").should("contain", "Open Weather App")
	}) 
})