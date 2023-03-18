function selectCategory(elementHTML){

    // -- Buscar o innerHTML(foods/drinks) do botão e retirar a primeira letra de forma a comparar
    let category = elementHTML.innerHTML;
    category = category.substring(0, category.length - 1);

    // -- Criar um array com os items, ao ir buscar o id da div principal 
    let items = Array.from(document.getElementById('items').children);

    // -- Percorrer o array criado e mostrar os items todos antes de acionar qualquer evento onClick
    items.forEach(element => element.style.display='flex');

    // -- Filtrar para mostrar os items desejados, comparando a variável category com o innerHTML da class categories do item
    items.filter((element) => element.querySelector('.categories').innerHTML !== category)
    .forEach(element => element.style.display='none');
}