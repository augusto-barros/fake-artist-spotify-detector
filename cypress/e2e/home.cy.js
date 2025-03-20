describe('Button Test', () => {
    // Intercept the API request and return a fake response
    beforeEach(() => {
      cy.intercept('POST', '/api/check-artist', {
        statusCode: 200,
        body: {
          artistName: 'Drake',
          fakeScore: 20,
          analysis: 'Likely Authentic',
          spotifyInfo: {
            photo: '/drake.jpg',
            followers: 1000000,
            monthlyListeners: 500000,
          },

        },
      }).as('checkArtist');
    });
  
    it('should display the analysis result after clicking the button', () => {
      cy.visit('http://localhost:3000');
  

      cy.get('input[placeholder="Enter an artist name (e.g. Drake)"]').type('Drake');
  

      cy.get('button').contains('Analyze').click();
  

      cy.wait('@checkArtist');
  

      cy.contains('Drake').should('be.visible');
      cy.contains('Likely Authentic').should('be.visible');
  

      cy.get('div[style*="width: 20%"]').should('exist');
    });
  });
  