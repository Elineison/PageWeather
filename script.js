

async function getAddressByCep() {
    const cep = document.getElementById("cep").value;
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.ok) {
            const resposta = await response.json();
            document.getElementById('logradouro').innerHTML = resposta.logradouro;
            document.getElementById('bairro').innerHTML = resposta.bairro;
            document.getElementById('uf').innerHTML = resposta.uf;
            console.log(resposta);
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error(error.message);
    };
}

async function getPrevisao() {
    const lat = document.getElementById("latitude").value;
    const long = document.getElementById("longitude").value;
    try{
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`);
        if (response.ok){
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
                const position = matriz.findIndex((value) => value == data);
                document.getElementById('temperatura').innerHTML = `${resposta.hourly.temperature_2m[position]}°C`;  
                console.log(resposta);             
            }else{
                document.getElementById('resultado2').innerHTML = 'Consulta do tempo disponivel a partir das 00:00 do día seguinte.';
            };

            };
        }catch (error){
                console.log(alert(error));
            };
        }

        const email = document.getElementById('email');
        const nome = document.getElementById('nome');
        [nome].forEach((input) =>{

        input.addEventListener("input", function() {
        function espacesAndLetterOnly(chain) {
            return /^[a-zA-Z\s]+$/.test(chain);
        }

        if (!espacesAndLetterOnly(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z\s]+/g, "");
        }
        });

        });

        function start(){
            const latitude = document.getElementById('latitude');
            const longitude = document.getElementById('longitude');
            const cep = document.getElementById("cep");
        

            if(nome.value.length > 0 && email.value.length > 0){
                if (cep.value.length > 0){
                    if (cep.value.length == 8){
                        getAddressByCep();
                    }else{
                        alert('Digite o cep completo');
                    }};
                if (cep.value.length == 0){
                    document.getElementById('logradouro').innerHTML = "";
                    document.getElementById('bairro').innerHTML = "";
                    document.getElementById('uf').innerHTML = "";
                };

                if (latitude.value.length > 0 && longitude.value.length > 0) {
                    if (latitude.value >= -90 && latitude.value <= 90 && longitude.value >= -180 && longitude.value <= 180) {
                        getPrevisao();
                    } else {
                        alert('Digite as coordenadas corretamente');
                    };
                };
                
                if (latitude.value.length == 0 || longitude.value.length ==0){
                    document.getElementById('temperatura').innerHTML = ""; 
                };
                    
            }else{
                alert('prencha todos os campos');
            };
        }
    
