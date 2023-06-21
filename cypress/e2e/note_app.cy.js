describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Roman',
      username: 'Test',
      password: 'dNX3sTE3',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })
  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki 2023'
    )
  })
  it('login form can be opened', function () {
    cy.contains('log in').click()
  })

  it('user can login', function () {
    cy.contains('log in').click()
    cy.get('#username').type('Test')
    cy.get('#password').type('dNX3sTE3')
    cy.get('#login-button').click()

    cy.contains('Roman logged in')
  })

  it('login fails with wrong password', function () {
    cy.contains('log in').click()
    cy.get('#username').type('Test')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error').contains('Wrong credentials')
    cy.get('html').should('not.contain', 'Roman logged in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'Test', password: 'dNX3sTE3' })
    })

    it('a new note can be created', function () {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })
    describe('and a note exists', function () {
      beforeEach(function () {
        cy.createNote({ content: 'another note cypress', important: true })
      })
      it('it can be made not important', function () {
        /*  cy.contains('another note cypress')
          .parent()
          .within(() => {
            cy.contains('make not important').click()
          })
          .within(() => {
            cy.contains('make important').click()
          }) */
        cy.contains('another note cypress')
          .contains('make not important')
          .click()
        cy.contains('another note cypress').contains('make important')
      })
    })
    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function () {
        cy.contains('second note').contains('make important').click()

        cy.contains('second note').contains('make not important')
      })
    })
  })
})
