const advBtn = document.getElementById("advBtn");
const idEl = document.getElementById("idEl");
const quoteEl = document.getElementById("quoteEl");
let c = 0;

newQuote(); //get new quote when the page loads
advBtn.onclick = newQuote; //get new quote when the button is clicked

function newXHR(link) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${link}?=${new Date().getTime()}`); //append casual string to avoid cached result
        xhr.responseType = "json"
        xhr.onload = () => {
            if (xhr.status === 200) resolve(xhr.response)
            else reject(new Error("Unexpected error"))
        }
        xhr.send();
    })
}

function newQuote() {
    newXHR("https://api.adviceslip.com/advice")
        .then(
            response => {
                idEl.innerHTML = response.slip.id;
                quoteEl.textContent = response.slip.advice;
            },
            error => { console.error(error) }
        )
}