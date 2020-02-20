describe('Enter a location', function () {
    it( 'if country code is given it shows the lacation weathter', function () {
           cy.visit('/') 
           cy.get('#search-text').type('Berlin')
    }); 
});