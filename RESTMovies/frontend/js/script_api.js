fetch('http://localhost:3000/api/movies/', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
.then(response => response.json())
.then(response => console.log(response) );

function createMovie(){

    fetch('http://localhost:3000/api/movies/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "imdb_rating": "9.2",
            "title": "CRIADO POR POST no JS",
            "release_year": "2000",
            "genres_id": "2"
        })
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        alert("ID do filme criado: " + response.id );
    } );
}