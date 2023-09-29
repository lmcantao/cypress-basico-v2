/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
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
        const longText = 'Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste,v Teste, Teste, Teste, Teste,Teste, Teste, v v v v v vTeste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste'
        cy.get('#firstName').type('Lawrense')
        cy.get('#lastName').type('Marçal Cantão')
        cy.get('#email').type('teste@teste.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    });

    it('exibe mensagem de erro ao submeter o fimulário com um e-mail com formatção errada', () => {
        cy.get('#firstName').type('Lawrense')
        cy.get('#lastName').type('Marçal Cantão')
        cy.get('#email').type('teste@teste')
        cy.get('#open-text-area').type("Teste")
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    });

    it('campo telefone continua vazio quando preenchido com valor não-numérico', () => {
        cy.get('#phone')
            .type('abchsjgjsjdkgjjk')
            .should('have.value', '')
    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Lawrense')
        cy.get('#lastName').type('Marçal Cantão')
        cy.get('#email').type('teste@teste')
        cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('#open-text-area').type("Teste")
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
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
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    });

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
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

    it('testando possibilidades utilizando comandos avançados', () => {
        cy.get('div#support-type')
            .children()
            .eq(2)
            .children()
            .check()
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
  })
  