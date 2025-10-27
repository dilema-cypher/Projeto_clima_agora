// Minha chave da API openWelther
const chaveAPI = "bc839c382e49e66b787b7ab41bc12748"
//elemento do DOM que serão usados e manipulados
const input = document.getElementById("cidade-input");
const btn = document.getElementById('buscar-btn');
const localEPais = document.getElementById("local-pais");
const temp = document.getElementById("temp");
const descricao = document.getElementById("descricao");
const senTermica = document.getElementById("sensacao-termica");
const statusMsg = document.getElementById("mensagem-status");
const climaInfo = document.getElementById("clima-info");

// btn com evento de click para executar a função buscarClima
btn.addEventListener("click", buscarClima);

async function buscarClima(){
    let cidade = input.value.trim(); // captura os valores do input e retira espaços vazios no começo e fim
    
    //verifica se ja foi escrito algo no input antes de dar sequencia!
    if(!cidade){
        statusMsg.innerHTML = "Digite o nome de uma cidade!"
        statusMsg.style.color = "red"
        return
    }
    // usando uma url especifica do openweather para buscar dados de longitude e latitude de uma cidade para achar todas as cidades.
    const urlGeocoding = `https://api.openweathermap.org/geo/1.0/direct?q=${cidade},BR&limit=1&appid=${chaveAPI}`;
    let respostaGeocoding = await fetch(urlGeocoding);

    let dadosLocalizacao = await respostaGeocoding.json();
    console.log(dadosLocalizacao)

    let lat = dadosLocalizacao[0].lat;
    let lon = dadosLocalizacao[0].lon;



    //construi nossa url com base na longitude, latitude e nossa chave api
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${chaveAPI}`;

    //bloco try e catch onde onde maior parte do codigo roda e busca capturar eventuais erros e depois apresenta los
    try{

        // envia a requisição pelo fetch ate a API e depois a devolve, como isso pode demorar
        // deve se usar o await, depois que retorna e guardado no let resposta
        let resposta = await fetch(url);
        
        //Procura um erro simples quando a cidade não é encontrada e cria um erro que podemos usar depois no catch
        if(!resposta.ok){
            throw new Error("Cidade não encontrada")
        }else{
            statusMsg.innerHTML="Cidade encontrada";
            statusMsg.style.color = "grey";
        }

        //Caso o if seja true e não false da sequencia no código e transforma a resposta em um formato json de dados
        let dados = await resposta.json();

        // Armazenando os dados da nossa api que queremos usar no html
        const Ncidade = dados.name;
        const pais = dados.sys.country;
        const temperatura = dados.main.temp;
        const description = dados.weather[0].description;
        const sensacao = dados.main.feels_like;
        
        //Inserindo os dados atraves do innerHTML para o DOM
        localEPais.innerHTML = `${Ncidade}, ${pais}`;
        temp.innerHTML = `${parseInt(temperatura)}`;
        descricao.innerHTML = `${description}`;
        senTermica.innerHTML =`${parseInt(sensacao)}`;
        climaInfo.style.display = "block"

    }catch(erro){
        //Tratando e apresentando o erro de forma mais segura e inteligente para o usuario
        console.error(erro);
        statusMsg.innerHTML=erro;
        statusMsg.style.color = "red";
    }
}