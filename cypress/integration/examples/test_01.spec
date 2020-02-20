describe('Main Page', function() {
	beforeEach(() => { cy.visit("http://127.0.0.1:5500/html/index.html") })

	it('should do nothing by it self', function() {
		cy.get("h2").should("contain", "Open Weather App")
	}) 
	it('should process the location', function() {
		cy.get("#search-text").type("Berlin");

	})
})