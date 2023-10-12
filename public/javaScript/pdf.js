let sidebar = document.querySelector('.sidebar');
let menu = document.querySelector('.menu');
let player = document.querySelector('.video-player');

function hide() {
    sidebar.classList.toggle("hide");
    player.classList.toggle("hide");
}

let cross = document.querySelector('#cross');
cross.addEventListener("click", hide);

menu.addEventListener("click", hide);



// Playlist

const main_video = document.querySelector('.video-link');
const title = document.querySelector('.playing-title');


let video = document.querySelectorAll('.video');

video.forEach(selected_video => {
    selected_video.onclick = () => {
        for(all_video of video){
            all_video.classList.remove('active');
            let icon = all_video.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-circle-play');
        }
        selected_video.classList.add('active');
        let text = selected_video.querySelector('h5').innerText;
        title.innerText = text;
        let icon = selected_video.querySelector('i');
        icon.classList.remove('fa-circle-play');
        icon.classList.add('fa-pause');
        let link = selected_video.querySelector('p').innerText;
        main_video.src = link;
        hide();
    }
})