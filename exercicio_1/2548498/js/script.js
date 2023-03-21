
function selectCategory(categoryBtn) {
    const categoryString = categoryBtn.innerText;

    // reset aos butoes previamente clicados
    Array.from(document.getElementsByClassName('nav-button')).forEach((btn)=>{
        btn.style.backgroundColor = "#a97a3c";
    })

    // marcar o butão clicado
    categoryBtn.style.backgroundColor = '#f6a36f';

    // Selecionar os items do nosso document
    let items = Array.from(document.getElementsByClassName('item'));

    // verificar se cada item
    items.forEach((item) => {

        // determinar a sua categoria
        const itemCategory = item.querySelector('.categories').innerText

        // comparar a categoria deste item com a recebido lá em cima por parametro
        if (itemCategory === categoryString) {
            // se for Mostro
            item.style.display = 'flex'
        } else {
            // Se não for escondo
            item.style.display = 'none'
        }
    })
}
