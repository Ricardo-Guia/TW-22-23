const generateKeyBtn = document.getElementById("generateKey")
generateKeyBtn.addEventListener('click', () => generateKey())

const tbody = document.getElementsByTagName('tbody')[0];

function generateKey() {
    // gerar uma key euromilhoes
    const key = {
        numeros: generateNumbers(1, 50, 5),
        estrelas: generateNumbers(1, 10, 2),
        write: function (arrayNumbers) {
            return arrayNumbers.join(', ')
        },
        sort: function (arrayNumbers) {
            return arrayNumbers.sort((a, b) => a - b);
        }
    }

    tbody.innerHTML = tbody.innerHTML + "<tr>" +
        "<td>" + key.write(key.numeros) + " => " + key.write(key.estrelas) + "</td>" +
        "<td>" + key.write(key.sort(key.numeros)) + "</td>" +
        "<td>" + key.write(key.sort(key.estrelas)) + "</td>" +
        "</tr>"

}

function generateNumbers(min, max, length) {
    const numbers = []

    while (numbers.length < length) {
        const number = Math.round(Math.random() * (max - min) + min);

        if (!numbers.includes(number)) {
            numbers.push(number)
        }
    }

    return numbers;
}

function cleanKeys() {
    tbody.innerHTML = '';
}
