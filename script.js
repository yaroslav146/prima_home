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
