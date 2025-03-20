describe('Performance Test', () => {
  it('should load the page within 15000ms and process "Taylor Swift" quickly', () => {
    // Measure page load performance
    const pageLoadStart = Date.now();
    cy.visit('http://localhost:3000'); 

    cy.window().then(() => {
      const loadTime = Date.now() - pageLoadStart;
      cy.log(`Page load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(15000);
    });


    cy.get('input[placeholder="Enter an artist name (e.g. Drake)"]').type('Taylor Swift');
    const actionStart = Date.now();
    cy.get('button').contains('Analyze').click();


    cy.contains('Taylor Swift', { timeout: 15000 }).should('be.visible').then(() => {
      const actionTime = Date.now() - actionStart;
      cy.log(`Analysis action time: ${actionTime}ms`);

      expect(actionTime).to.be.lessThan(15000);
    });
  });
});
