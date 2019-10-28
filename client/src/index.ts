import Assets from './Assets';
import Networking from './networking';

const playMenu = document.getElementById('play-menu')
const mainSpinner = document.getElementById('main-spinner')
const playButton = document.getElementById('play-button');
const usernameInput = <HTMLInputElement> document.getElementById('username-input');
const spinnerMessage = document.getElementById('spinner-message')

Promise.all([
    Assets.getInstance().downloadAssets(),
    Networking.getInstance().connect()
]).then(() => {
    console.log('app initialized')
    playMenu.classList.add('is-active')
    mainSpinner.classList.add('is-hidden')
    //   usernameInput.focus();
    playButton.onclick = () => {
        playMenu.classList.remove('is-active')
        mainSpinner.classList.remove('is-hidden')
        spinnerMessage.innerHTML = "searching for a room..."
        Networking.getInstance().play(usernameInput.value)
    };
});