// Função para buscar endereço pelo CEP
async function getAddressByCep() {
    let cep = document.getElementById("cep").value;

    // Remove hífen se existir
    cep = cep.replace(/-/g, '');

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.ok) {
            const resposta = await response.json();
            document.getElementById('logradouro').innerHTML = resposta.logradouro;
            document.getElementById('bairro').innerHTML = resposta.bairro;
            document.getElementById('uf').innerHTML = resposta.uf;
            console.log(resposta);
        } else {
            throw new Error('Error na resposta do servidor');
        }
    } catch (error) {
        console.error(error.message);
    }
}

// Função para buscar a previsão do tempo
async function getPrevisao() {
    const lat = document.getElementById("latitude").value;
    const long = document.getElementById("longitude").value;
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`);
        if (response.ok) {
            const resposta = await response.json();
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = "00";
            const data = `${year}-${month}-${day}T${hours}:${minutes}`;
            const matriz = resposta.hourly.time;
            const index = matriz.indexOf(data);

            if (index !== -1) {
                const position = matriz.findIndex((value) => value === data);
                document.getElementById('temperatura').innerHTML = `${resposta.hourly.temperature_2m[position]}°C`;
                console.log(resposta);
            } else {
                document.getElementById('resultado2').innerHTML = 'Consulta do tempo disponível a partir das 00:00 do dia seguinte.';
            }
        } else {
            throw new Error('Error na resposta do servidor');
        }
    } catch (error) {
        console.error(error.message);
        alert('Erro ao consultar a previsão do tempo.');
    }
}

// Função para validar campos e rolar para a seção de resultados
function start() {
    const latitude = document.getElementById('latitude');
    const longitude = document.getElementById('longitude');
    const cep = document.getElementById("cep");
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');

    // Remove hífen do CEP antes de validação
    let cepValue = cep.value.replace(/-/g, '');

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (nome.value.trim() && email.value.trim()) {
        if (cepValue) {
            if (cepValue.length === 8) { // Verifica o comprimento do CEP sem hífen
                getAddressByCep();

                if (latitude.value.trim() && longitude.value.trim()) {
                    if (latitude.value >= -90 && latitude.value <= 90 && longitude.value >= -180 && longitude.value <= 180) {
                        getPrevisao();
                        // Rola para a seção de resultados
                        scrollToSection('#resultado');
                    } else {
                        alert('Digite as coordenadas corretamente');
                    }
                } else {
                    document.getElementById('temperatura').innerHTML = "";
                }
            } else {
                alert('Digite o CEP completo no formato 12345678');
                // Rola para o campo de CEP se o comprimento estiver incorreto
                scrollToSection('#cep');
            }
        } else {
            document.getElementById('logradouro').innerHTML = "";
            document.getElementById('bairro').innerHTML = "";
            document.getElementById('uf').innerHTML = "";
        }
    } else {
        alert('Preencha todos os campos corretamente.');
        // Rola para o primeiro campo vazio
        if (!nome.value.trim()) scrollToSection('#nome');
        else if (!email.value.trim()) scrollToSection('#email');
        else if (!cep.value.trim()) scrollToSection('#cep');
        else if (!latitude.value.trim()) scrollToSection('#latitude');
        else if (!longitude.value.trim()) scrollToSection('#longitude');
    }
}

// Função para rolar para uma seção específica
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Remove caracteres não permitidos dos campos de texto
const nome = document.getElementById('nome');
const email = document.getElementById('email');

nome.addEventListener("input", function() {
    function espacesAndLetterOnly(chain) {
        return /^[a-zA-Z\s]+$/.test(chain);
    }

    if (!espacesAndLetterOnly(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z\s]+/g, "");
    }
});

email.addEventListener("input", function() {
    // Pode adicionar validação específica para email aqui, se necessário
});

// Adiciona um ouvinte de evento ao botão de enviar
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('button[type="button"]');
    submitButton.addEventListener('click', start);
});
