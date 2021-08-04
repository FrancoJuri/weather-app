const form = document.getElementById('form');
const city = document.getElementById('city');
const divAlerts = document.getElementById('div-alerts');

form.addEventListener('submit', validateForm);

function validateForm(e){
    e.preventDefault();

    if(city.value.trim() === ''){
        printAlert('You must enter a city to continue', city);
        return;
    }

    consultarAPI(city.value.trim())
}

async function consultarAPI(el){
    try {
        const key = 'e2fd362b98bcf31009363518aedbff0b';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${el}&appid=${key}`);
        if(response.status === 404){
            printAlert('No city found', city);
            return;
        }
        
        sincronizarStorage();
    } catch (error) {
        printAlert('An error has ocurred', city);
    }
    
}

function sincronizarStorage(){
    localStorage.setItem('city', city.value.trim());
    window.location.href = 'weather.html';
}

function printAlert(msg, variableName){
    const alert = document.querySelector('.alert');
    if(!alert){
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show');
        const p = document.createElement('p');
        p.classList.add("text-center");
        p.textContent = msg;
        const buttonDismissible = document.createElement('button');
        buttonDismissible.classList.add('btn-close');
        buttonDismissible.setAttribute('data-bs-dismiss', 'alert');
        buttonDismissible.setAttribute('aria-label', 'Close');
        alert.appendChild(p);
        alert.appendChild(buttonDismissible);
        divAlerts.appendChild(alert);
        variableName.style.borderColor = 'red';
        variableName.addEventListener('input', () => {
            variableName.style.borderColor = '#ced4da';
            alert.classList.add('animation-eliminate-alert');
            setTimeout(() => {
                alert.remove();
            }, 300)
        });
        buttonDismissible.addEventListener('click', () => variableName.style.borderColor = '#ced4da');
    }
}