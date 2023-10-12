let sidebar = document.querySelector('.sidebar');
let menu = document.querySelector('.menu');
let player = document.querySelector('.video-player');

// Rating Value
let rateName = document.querySelector('#name');

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
rateName.value = title.innerText;

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
        rateName.value = text;
        let icon = selected_video.querySelector('i');
        icon.classList.remove('fa-circle-play');
        icon.classList.add('fa-pause');
        let link = selected_video.querySelector('p').innerText;
        main_video.src = link;
        hide();
    }
})

function previous() {
    let current = document.querySelector('.active');
    if(current.id != "1"){
        let newId = current.id - 1;
        let target;
        for(all_video of video){
            if(all_video.id ===`${newId}`){
                target = all_video;
            }
            all_video.classList.remove('active');
            let icon = all_video.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-circle-play');
        }
        target.classList.add('active');
        let text = target.querySelector('h5').innerText;
        title.innerText = text;
        rateName.value = text;
        let icon = target.querySelector('i');
        icon.classList.remove('fa-circle-play');
        icon.classList.add('fa-pause');
        let link = target.querySelector('p').innerText;
        main_video.src = link;
    }
}

function next() {
    let current = document.querySelector('.active');
    let newId = current.id - 1 + 2;
        let target;
        for(all_video of video){
            if(all_video.id ===`${newId}`){
                target = all_video;
            }
            all_video.classList.remove('active');
            let icon = all_video.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-circle-play');
        }
        target.classList.add('active');
        let text = target.querySelector('h5').innerText;
        title.innerText = text;
        rateName.value = text;
        let icon = target.querySelector('i');
        icon.classList.remove('fa-circle-play');
        icon.classList.add('fa-pause');
        let link = target.querySelector('p').innerText;
        main_video.src = link;
}

