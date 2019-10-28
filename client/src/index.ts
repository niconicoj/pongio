// import { connect, play } from './networking';
// import { startRendering, stopRendering } from './render';
// import { startCapturingInput, stopCapturingInput } from './input';
import Assets from './Assets';
import Networking from './networking';
// import { initState } from './state';

const playMenu = document.getElementById('play-menu')
const mainSpinner = document.getElementById('main-spinner')
const playButton = document.getElementById('play-button');
const usernameInput = <HTMLInputElement> document.getElementById('username-input');


Promise.all([
    Assets.getInstance().downloadAssets(),
    Networking.getInstance().connect()
]).then(() => {
    playMenu.classList.add('is-active')
    mainSpinner.classList.add('is-hidden')
    //   usernameInput.focus();
    playButton.onclick = () => {
        // Play!
        Networking.getInstance().play(usernameInput.value)
        // play(usernameInput.value);
        // playMenu.classList.add('hidden');
        // initState();
        // startCapturingInput();
        // startRendering();
        // setLeaderboardHidden(false);
    };
});