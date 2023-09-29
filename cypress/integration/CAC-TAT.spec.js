/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000
    
    beforeEach(function(){
        cy.visit('./src/index.html')
    })
    
    it('verifica o título da aplicação', () => {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
        cy.get('#title')
            .should(($titlrH1) => {
                expect($titlrH1[0].innerText).to.equal('CAC TAT')
            })
            .should('be.visible')
    })

    it('preenche os campos obrigatórios e envia o formulário', () => {
        //const longText = 'Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste,v Teste, Teste, Teste, Teste,Teste, Teste, v v v v v vTeste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste'
        const longText = Cypress._.repeat('0123456789', 20)

        cy.clock()
        cy.get('#firstName').type('Lawrense')
        cy.get('#lastName').type('Marçal Cantão')
        cy.get('#email').type('teste@teste.com')
        cy.get('#open-text-area')
            .invoke('val', longText)
            .type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    });

    it('exibe mensagem de erro ao submeter o fimulário com um e-mail com formatção errada', () => {
        cy.clock()
        cy.get('#firstName').type('Lawrense')
        cy.get('#lastName').type('Marçal Cantão')
        cy.get('#email').type('teste@teste')
        cy.get('#open-text-area').type("Teste")
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    });

    it('campo telefone continua vazio quando preenchido com valor não-numérico', () => {
        cy.get('#phone')
            .type('abchsjgjsjdkgjjk')
            .should('have.value', '')
    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
        cy.get('#firstName').type('Lawrense')
        cy.get('#lastName').type('Marçal Cantão')
        cy.get('#email').type('teste@teste')
        cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('#open-text-area').type("Teste")
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
            .type('Lawrense')
            .should('have.value', 'Lawrense')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Marçal Cantão')
            .should('have.value', 'Marçal Cantão')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('teste@teste.com')
            .should('have.value', 'teste@teste.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('34999558877')
            .should('have.value', '34999558877')
            .clear()
            .should('have.value', '')
        
    });

    it('exibir mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    });

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    });

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    });

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    });

    it('marca cada tipo de entendimento', () => {
        cy.get('input[type="radio"][name="atendimento-tat"]')
            .should('have.length', 3)
            .each(($radio) => {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    });

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    });

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    });

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    });

    Cypress._.times(5, () => {
        it('testando possibilidades utilizando comandos avançados', () => {
            cy.get('div#support-type')
                .children()
                .eq(2)
                .children()
                .check()
        });
    });

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
            .selectFile('@sampleFile')
            .should(($input) => {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    });

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    });

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        
        cy.contains('CAC TAT - Política de privacidade').should('be.visible')
        cy.contains('Talking About Testing').should('be.visible')
    });

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    });

    it('fazer o CAT aparecer', () => {
        cy.get('#cat')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .contains('🐈')
        .invoke('hide')
        .should('not.be.visible')
    });

    it.only('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should((response) => {
                const { status, statusText, body } = response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })
        cy.get('#title')
            .invoke('text', '🐈')
            .should('have.text', '🐈')
    });
  })
  