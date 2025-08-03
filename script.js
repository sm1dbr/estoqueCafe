// Configurando Submit do formulário

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('estoqueForm');

    // --- Configurando adicionais ---


    const adicionalCheckbox = document.getElementById('adicional');
    const extrasContainer = document.getElementById('extrasContainer');

    function getItensSelecionados() {
        const itensCheckboxes = document.querySelectorAll('input[name="item"]:checked');
        
        const itensSelecionados = [];
        itensCheckboxes.forEach(function(checkbox) {
            itensSelecionados.push(checkbox.value);
        });
        
        return itensSelecionados;
    }

    const itensCheckboxes = document.querySelectorAll('input[name="item"]');
    itensCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', atualizarOpcoes);
    })

    // Vai mostrar ou ocultar ao clicar em Adicionar Mais

    adicionalCheckbox.addEventListener('change', function() {
        if (adicionalCheckbox.checked) {
            extrasContainer.style.display = 'flex'; 

            if (extraFields.children.length === 0) {
                addExtraField(getItensSelecionados());
            }
        } else {
            extrasContainer.style.display = 'none';
            extraFields.innerHTML = '';
        }
    });

    const addExtraBtn = document.getElementById('addExtraBtn');
    const extraFields = document.getElementById('extraFields');

    function addExtraField(itensSelecionados) {
        const extraField = document.createElement('div');
        extraField.style.display = 'flex';
        extraField.style.gap = '10px';
        extraField.style.marginBottom = '10px';

        //Seleção de itens
        const itemSelect = document.createElement('select');

        let optionsHTML = '<option value="" disabled selected hidden>Escolha o item</option>';
        itensSelecionados.forEach(item => {
            optionsHTML += `<option value="${item}">${item.charAt(0).toUpperCase() + item.slice(1)}</option>`;
        });

        itemSelect.innerHTML = optionsHTML;

        //Input de quantidade
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = '1';
        quantityInput.step = '1';
        quantityInput.placeholder = 'Qtd extra';
        quantityInput.required = true;


        //Adiciona no extraField
        extraField.appendChild(itemSelect);
        extraField.appendChild(quantityInput);

        //Adiciona no container de extras
        extraFields.appendChild(extraField);

    }

    //Função para atualizar as opções do adicionar mais caso ele seja atualizado já aberto

    function atualizarOpcoes() {
        const itensSelecionados = Array.from(document.querySelectorAll('input[name="item"]:checked'))
        .map(checkbox => checkbox.value);

        const selectsExtras = document.querySelectorAll('#extraFields select');

        selectsExtras.forEach(select => {
            const valorAtual = select.value;
            select.innerHTML = '<option value="" disabled hidden>Escolha o item</option>';

            itensSelecionados.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item.charAt(0).toUpperCase() + item.slice(1);
                select.appendChild(option);
            });

            //Tentar manter o valor selecionado
            if (itensSelecionados.includes(valorAtual)) {
                select.value = valorAtual;
            } else {
                select.value = ''; 
            }

        });


    }


    addExtraBtn.addEventListener('click', function() {
        addExtraField(getItensSelecionados());
    });


    // --- Envio do formulário ---



    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validando se pelo menos um item foi marcado
        const itensCheckboxes = document.querySelectorAll('input[name="item"]:checked');
        if (itensCheckboxes.length === 0) {
            alert('Por favor, selecione pelo menos um item.');
            return;
        }

        // Capturando o fornecedor
        const fornecedorSelect = document.querySelector('select[name="fornecedor"]');
        const fornecedor = fornecedorSelect.value;
        console.log('Fornecedor:', fornecedor);

        //Capturado itens selecionados e listando valores
        const itensSelecionados = [];

        itensCheckboxes.forEach(function(checkbox) {
            itensSelecionados.push(checkbox.value);
        });

        // Capturando observações
        const observacaoTextArea = document.querySelector('textarea[name="observacao"]');
        const observacao = observacaoTextArea.value;


        console.log('Observação: ', observacao);
        console.log('Itens Selecionados:', itensSelecionados);
        console.log('Formulário Enviado!');

        //Capturando campos adicionais
        const adicionais = [];

        const  extraFields = document.querySelectorAll('#extraFields > div');
        extraFields.forEach(function(field) {
            const itemSelect = field.querySelector('select');
            const quantityInput = field.querySelector('input[type="number"]');

            if(itemSelect.value && quantityInput.value) {
                adicionais.push({
                    item: itemSelect.value,
                    quantidade: parseInt(quantityInput.value)
                });
            }
        });

        console.log('Adicionais:', adicionais)

        // Modificar as quantidades caso algum adicional seja incluído

        const resultadoFinal = [];

        itensSelecionados.forEach(function(item) {
            const adicionalEncontrado = adicionais.find(extra => extra.item === item);

            if (adicionalEncontrado) {
                resultadoFinal.push({ item: item, quantidade: adicionalEncontrado.quantidade });
            } else {
                resultadoFinal.push({ item: item, quantidade: 1 });
            }
        })

        console.log('Resultado Final:', resultadoFinal);


        // --- Montando o JSON para envio Backend ---
        const dadosParaEnvio = {
            fornecedor: fornecedor,
            itens: resultadoFinal,
            observacao: observacao,
            dataHora: new Date().toISOString()
        };

        console.log('Dados para Envio:', JSON.stringify(dadosParaEnvio,null, 2));

        // Conectando com o Backend

        fetch('https://estoquecafebackend.onrender.com/api/entrega', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosParaEnvio)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert('Entrega registrada com sucesso!');
            window.location.reload();
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });

    });



});

