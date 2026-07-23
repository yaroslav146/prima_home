function filterTools(category) {
    let tools = document.querySelectorAll(".tool");

    tools.forEach(tool => {
        if (category === "all" || tool.classList.contains(category)) {
            tool.classList.remove("hide");
        } else {
            tool.classList.add("hide");
        }
    });
}

function updateSidebarSection() {
    const sectionLinks = document.querySelectorAll('.sidebar-nav a');
    if (!sectionLinks.length) {
        return;
    }

    const sections = Array.from(sectionLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    sectionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const section = document.querySelector(this.getAttribute('href'));
        if (!section) return;

        const sectionCenter =
            section.offsetTop + section.offsetHeight / 2;

        const screenCenter =
            window.innerHeight / 2;

        let target =
            sectionCenter - screenCenter;


        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        target = Math.max(0, Math.min(target, maxScroll));


        window.scrollTo({
            top: target,
            behavior: "smooth"
        });
    });
});

    function refreshActive() {
        const threshold = window.innerHeight * 0.6;
        let activeSection = sections[0];

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= threshold && rect.bottom > 0) {
                activeSection = section;
            }
        });

        sectionLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + activeSection.id);
        });
    }

    window.addEventListener('scroll', refreshActive, { passive: true });
    window.addEventListener('resize', refreshActive);
    refreshActive();
}

document.addEventListener('DOMContentLoaded', updateSidebarSection);



// MUSIC PLAYER
// ===== Список песен =====
const songs = [
    {
        title: "Unshatter",
        file: "music/Unshatter.mp3"
    },
    {
        title: "No More Sorrow",
        file: "music/No More Sorrow.mp3"
    },
    {
        title: "Faint",
        file: "music/Faint.mp3"
    },
    {
        title: "METAMORPHOSIS",
        file: "music/METAMORPHOSIS.mp3"
    },
    {
        title: "YOASOBI - 勇者",
        file: "music/勇者.mp3"
    },
    {
        title: "И солнце взойдет",
        file: "music/солнце взойдет.mp3"
    },
    {
        title: "DAMIDAMI",
        file: "music/DAMIDAMI.mp3"
    },
    {
        title: "Burning Desires",
        file: "music/Burning Desires.mp3"
    },
    {
        title: "60%的遐想",
        file: "music/lorem.mp3"
    },
    {
        title: "Cyberpunk",
        file: "music/Cyberpunk.mp3"
    },
    {
        title: "Distortion!!",
        file: "music/Distortion!!.mp3"
    },
    {
        title: "Звезда по имени Солнце",
        file: "music/Солнце.mp3"
    },
    {
        title: "Спокойная ночь",
        file: "music/Спокойная ночь.mp3"
    },
    {
        title: "Komarovo",
        file: "music/Komarovo.mp3"
    },
    {
        title: "9mm",
        file: "music/9mm.mp3"
    },
    {
        title: "Down Under",
        file: "music/Down Under.mp3"
    },
    {
        title: "不可思議のカルテ",
        file: "music/adurinaj.mp3"
    },
    {
        title: "Aria Math",
        file: "music/Aria Math.mp3"
    },
];

// ===== Получение элементов =====
const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progress = document.getElementById("progress");

const songName = document.getElementById("song-name");
const nextSong = document.getElementById("next-song");

const record = document.querySelector(".record");

const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");

// ===== Индекс текущей песни =====
let currentSong = 0;

// ===== Загрузка песни =====
function loadSong(index) {

    audio.src = songs[index].file;

    songName.textContent = songs[index].title;

    const nextIndex = (index + 1) % songs.length;

    nextSong.textContent = "Next: " + songs[nextIndex].title;

    progress.value = 0;
}

// Загружаем первую песню
loadSong(currentSong);

// ===== Play / Pause =====
playBtn.addEventListener("click", () => {

    if (audio.paused) {

        audio.play();

        playBtn.textContent = "⏸";

        record.classList.add("playing");

    } else {

        audio.pause();

        playBtn.textContent = "▶";

        record.classList.remove("playing");
    }

});

// ===== Следующая песня =====
nextBtn.addEventListener("click", () => {

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);

    audio.play();

    playBtn.textContent = "⏸";

    record.classList.add("playing");

});

// ===== Предыдущая песня =====
prevBtn.addEventListener("click", () => {

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);

    audio.play();

    playBtn.textContent = "⏸";

    record.classList.add("playing");

});

// ===== Автоматическое переключение =====
audio.addEventListener("ended", () => {

    nextBtn.click();

});

// ===== Обновление полосы прогресса =====
audio.addEventListener("timeupdate", () => {

    if(audio.duration){

        progress.value = audio.currentTime / audio.duration * 100;

        currentTimeText.textContent =
            formatTime(audio.currentTime);

        durationText.textContent =
            formatTime(audio.duration);

    }

});

// ===== Перемотка =====
progress.addEventListener("input", () => {

    if (audio.duration) {

        audio.currentTime = (progress.value / 100) * audio.duration;

    }

});

function formatTime(seconds){

    let min = Math.floor(seconds / 60);

    let sec = Math.floor(seconds % 60);

    if(sec < 10){
        sec = "0" + sec;
    }

    return min + ":" + sec;

}

