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