const form = document.querySelector('.search-form')
const recipeList = document.querySelector('.recipe-list')
const recipeDetails = document.querySelector('.recipe-details')

form.addEventListener('submit', function(event) {
    event.preventDefault()
    const inputValue = event.target[0].value

    searchRecipes(inputValue)
})
/* função que pega todas as receitas que contem o ingrediente que o usuário digitou no input e coloca na tela*/
async function searchRecipes(ingredient) {
    recipeList.innerHTML = `<p>Carregando Receitas...</p>`
    try{
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)

        const data = await response.json ()

        showRecipes(data.meals)  
    } catch(err){
        recipeList.innerHTML = `<p>Nenhuma receita encontrada</p>`
    }
}

function showRecipes(recipes) {
    /* o innerHTML vai pegar as informações do servidor e vai injetar na minha div recipe-list*/
    recipeList.innerHTML = recipes.map(item => `
        <div class="recipe-card" onClick="getRecipesDetails(${item.idMeal})">
        <img src="${item.strMealThumb}" alt="receita-foto">
        <h3>${item.strMeal}</h3>        
        </div>        
        `
        
    ).join('')
}

/* função que pega as informações da receita que o usuário clicar e coloca na tela do usuário de forma detalhada*/
async function getRecipesDetails(id) {
    const response = await fetch(`https:www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)

    const data = await response.json ()
    const recipe = data.meals[0]

    let ingredients = ''

/*o for vai passar por todos os i começando pelo 1 item da lista,  o i<=20 significa que irá passar até 20 (nessa API temos apenas 20 itens), i++ é igual a i+1, fazendo isso o for n irá mostrar itens vazios*/
    for(let i = 1; i <= 20; i++){
        if(recipe[`strIngredient${i}`]){
           ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`
        } else {
            break;
        }
    }

    recipeDetails.innerHTML = `

    <h2>${recipe.strMeal}</h2>
    <img src="${recipe.strMealThumb}" alt=${recipe.strMeal}>
    <h3>Categoria: ${recipe.strCategory}</h3>
    <h3>Origem: ${recipe.strArea}</h3>
    <h3>Ingredientes:</h3>
    <ul>${ingredients}</ul>
    <h3>Instruções:</h3>
    <p>${recipe.strInstructions}</p>
    <p>Tags: ${recipe.strTags}</p>
    <p>Vídeo: <a href="${recipe.strYoutube}" target="_blank">Assista no Youtube</a></p>
    `
}

