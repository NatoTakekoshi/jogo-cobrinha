//Selecionando o elemento canvas (cenario onde a cobrinha anda)
const canvas = document.querySelector('canvas')

//criando um contexto no canvas (criando a cobrinha)
const ctx = canvas.getContext("2d")

//Pegando o campo onde vai ser apresentado o score durante o jogo
const score = document.querySelector(".score--value")

//Campo onde vai ser apresentado score do jogador apos o game over
const finalScore = document.querySelector(".final-score > span")

//menu que é apresentado apos perder a apartida
const menu = document.querySelector(".menu-screen")

//botao play que aparece na tela de game over
const buttonPlay = document.querySelector(".btn-play")

//Onde pegamos a dificuldade(velocidade) que o usuario selecionou
const dificuldade = document.querySelector("#dificuldade")

//Audios de comer e game over
const audio = new Audio('../assets/audio.mp3')
const audioGameOver = new Audio('../assets/sfx-defeat3.mp3')

//Verifica se alguma opcao de dificuldade foi selecionada e salva ela na variavel velocidade
function verificarRadio() {
    // Seleciona todos os radio buttons com o nome 'dificuldade'
    const radios = document.querySelectorAll('input[name="dificuldade"]');
    // Verifica se pelo menos um está checado
    const checado = Array.from(radios).some(radio => radio.checked);
    if (checado) {
        velocidade = document.querySelector('input[name="dificuldade"]:checked').value;
    }
    //return velocidade

  }

//definindo o tamnho do da area de jogo
const size = 30
//valocidade inicial da cobrinha
let velocidade = 100


//Posicao inicial da cobrinha
let cobra = [
    { x: 240, y:270}
]

//faz a soma dos pontos durante o jogo
const incrementScore = () =>{
    score.innerText = +score.innerText + 10
    score.innerText
}


//gera um numero aleatorio para usarmos na geração das comidas
const randomNumber = (min, max) =>{
    return Math.round(Math.random() * (max - min) + min)
}

//Gera a comida em uma posicao aleatoria do canvas
const randomPosition = () =>{
    const number = randomNumber(0, canvas.width - size)
    //precisa ser um multiplo de 30 pois o tamanho do canvas é 600 e cadas quadradinho tem o tamanho 30 (definido no size logo acima)
    return Math.round(number / 30) * 30
}

//gerando a comida e definindo sua cor
const comida = {
    x: randomPosition(),
    y: randomPosition(),
    color: "red"

}

//variavel usada para receber a direção acionado no teclado
let direcao 

//
let loopId

//desenhando a cobra no canvas
const desenhoCobra = () => {
    ctx.fillStyle = "#ddd"

    cobra.forEach((posicao, index)=>{

if(index == cobra.length -1){
    ctx.fillStyle="white"
}
        ctx.fillRect(posicao.x, posicao.y, size, size)
    })
    
}

//desenhando a comida no canvas
const desenharComida = () => {
    const{x,y,color}=comida

    ctx.shadowColor=color
    ctx.shadowBlur=10
    ctx.fillStyle = color
    ctx.fillRect(x,y, size, size)
    ctx.shadowBlur=0
}

//mover cobra
const moverCobra = () => {
    //se a variavel direcao nao tiver recebido valor, a cobra permanece parada
    if(!direcao) return
    const cabeca = cobra[cobra.length-1]

    //movendo a cobra de acordo com o valor da variavel direção, é adicionado um novo elemento no array e no fim é removido o elemento por ultimo
    if(direcao == "right"){
        cobra.push({x:cabeca.x + size,y: cabeca.y })
    }

    if(direcao == "left"){
        cobra.push({x:cabeca.x - size,y: cabeca.y })
    }

    if(direcao == "down"){
        cobra.push({x:cabeca.x,y: cabeca.y + size })
    }

    if(direcao == "up"){
        cobra.push({x:cabeca.x,y: cabeca.y - size })
    }

    //apagando o ultimo elemento da cobra
    cobra.shift()


}
//aplicando uma grade no canvas para melhorar a visualização
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for(let i =30; i< canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()

    }
}


//verica se a cabe da cobrinha é igual a posicao da frutinha, assim adicionando mais um elemento no array 
const checkEat = () =>{
    const cabeca = cobra[cobra.length-1]
    if(cabeca.x == comida.x && cabeca.y == comida.y){
        incrementScore()
        cobra.push(cabeca)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while(cobra.find((position) => position.x == x && position.y ==y)){
            x = randomPosition()
            y = randomPosition()
        

        }
            

        comida.x= x
        comida.y= y
        comida.color= "red"
    }

}

//criando colisao
const checkCollision = () =>{

    const cabeca = cobra[cobra.length-1]
    const canvasLimit =  canvas.width - size
    const neckIndex = cobra.length -2

    //verifica se a cabeça da cobra ultrapassa o tamanho do canas
    let wallCollision = cabeca.x < 0 || cabeca.x > canvasLimit || cabeca.y < 0 || cabeca.y > canvasLimit


    //verifica se a posicao da cabeça e igual a alguma outra posicao dentro do array da cobra 
    let selfCollision = cobra.find((position, index) => {
        return index < neckIndex && position.x == cabeca.x && position.y == cabeca.y
    })

    //S se algum dos dois retorna possitivo, toca a musica e chama o game over
    if (wallCollision || selfCollision){
        audioGameOver.play()
        gameOver()

    }
}

//funcao chamada apos o usurio perder
const gameOver= ()=>{
    //faz a cobrinha parar
    direcao = undefined
    //habilita o menu de game over
    menu.style.display = "flex"
    dificuldade.style.display="flex"
    //apresenta o score final
    finalScore.innerText=score.innerText
    //aplicar um desfoco no canvas para melhorar a visualização do game over
    canvas.style.filter ="blur(5px)"
    wallCollision=null
    //selfCollision=null
    
}


//loop utilizado para manter o jogo rodando
const gameLoop = () => {
    clearInterval(loopId)
    verificarRadio()
    ctx.clearRect(0,0, 600, 600)
    drawGrid()
    desenharComida()
    moverCobra()
    desenhoCobra()
    checkEat()
    checkCollision()
    //verificarRadio()
    
    
    //utilizado para definir o tem de chamada do loop, e com isso interferindo na velocidade da cobra
    loopId = setTimeout(() =>{
        gameLoop()
    }, velocidade)
    
}

gameLoop()

//adicionando na variavel direcao o valor que o usuario digitou na setinha
document.addEventListener("keydown", ({ key }) =>{
    if(key == "ArrowRight" && direcao != "left"){
        direcao = "right"
    }

    if(key == "ArrowLeft" && direcao != "right"){
        direcao = "left"
    }

    if(key == "ArrowUp" && direcao != "down"){
        direcao = "up"
    }

    if(key == "ArrowDown" && direcao != "up"){
        direcao = "down"
    }
})

//botao play da tela de menu.. redefinindo todos os atributos para iniciar uma nova partida
buttonPlay.addEventListener("click", () =>{
    score.innerText = "00"
    menu.style.display = "none"
    dificuldade.style.display="none"
    canvas.style.filter = "none"

    cobra = [{x:270, y:240}]

})




