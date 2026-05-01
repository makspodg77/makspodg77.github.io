type style = { name: string, path: string };

const styles: style[] = [
    { name: "Modern", path: "../style-1.css" },
    { name: "Y2K", path: "../style-2.css" },
    { name: "remix", path: "../style-3.css" }
];

const generateButtons = (): void => {
    const btnContainer = document.getElementById("btnContainer");

    styles.forEach((s: style) => {
        const btn = document.createElement("button");
        btn.textContent = s.name;
        btn.onclick = () => changeStylesheet(s.path);

        btnContainer?.appendChild(btn);
    })
}

const addStylesheet =  (h: HTMLHeadElement, p: string): void => {
    const newStylesheet = document.createElement("link");
    newStylesheet.rel = "stylesheet";
    newStylesheet.href = p;

    h.appendChild(newStylesheet);
}

const changeStylesheet = (p: string): void => {
    const head = document.getElementsByTagName("head")[0];
    const oldStylesheet = head.getElementsByTagName("link")[0];

    if (!oldStylesheet) return addStylesheet(head, p);

    if (oldStylesheet.href === p) return;

    head.removeChild(oldStylesheet);

    addStylesheet(head, p)
}

changeStylesheet(styles[0].path);
generateButtons();