// ==UserScript==
// @name Pendoria Ethereal Highlight
// @namespace http://pendoria.net/
// @version 1.0
// @author Puls3
// @include /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @homepage https://github.com/xPuls3/Pendoria-Ethereal-Highlight
// @supportURL https://github.com/xPuls3/Pendoria-Ethereal-Highlight/issues
// @downloadURL https://github.com/xPuls3/Pendoria-Ethereal-Highlight/raw/master/script.user.js
// @updateURL https://github.com/xPuls3/Pendoria-Ethereal-Highlight/raw/master/script.user.js
// @icon https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/master/favicon.ico
// @grant none
// @run-at document-start
// @description Highlights the names of fellow Ethereal guild members on the market.
// ==/UserScript==

// Pendoria Ethereal Highlight is only officially distributed on GitHub!
// - https://github.com/xPuls3/Pendoria-Ethereal-Highlight/

// This script was created by Puls3!
// - Puls3 on Pendoria

let originalAjaxPost = null;
let members = null;

window.addEventListener("DOMContentLoaded", () => {
    initiate();
})

function initiate() {

    originalAjaxPost = window["ajaxPost"];

    const styleElement = document.createElement("style");
    styleElement.innerText = ".elite-ethereal-member { color: lime !important; }"

    document.head.append(styleElement)

    window["jQuery"].post("https://pendoria.net/guild/members", (data) => {

        const doc = new DOMParser().parseFromString(data, "text/html");
        const elems = doc.querySelectorAll("span.chat-username");

        console.log(elems)

        members = [];

        for (let i = 0; i < elems.length; i++) {

            const elem = elems[i];

            const id = elem.parentElement.getAttribute("data-player-id");
            const name = elem.textContent;

            // Debug Purposes Only
            // console.log(`Player #${id}; ${name} (Ethereal Member)`);

            members.push({
                id: id,
                username: name,
            })

        }

        console.log("Loaded Ethereal guild members from remote registry.");
        window["ajaxPost"] = newAjaxPost;

    })

}

function newAjaxPost(...args) {

    if (!args[0].startsWith("/market/")) return originalAjaxPost(...args);
    if (!args[0].includes("/display/")) return originalAjaxPost(...args);

    originalAjaxPost(args[0], (data) => {

        if (!(typeof data === "string")) return args[1](data);
        if (!args[0].includes("/display/")) return args[1](data);

        let newData = data;

        for (let i = 0; i <= members.length; i++) {

            if (i === members.length) return args[1](newData);

            const playerId = String(members[i].id);
            const regex = new RegExp(`data-player-id=\"${playerId}\">`, "gi");
            newData = newData.replace(regex, `data-player-id=\"${playerId}\" class=\"elite-ethereal-member\"`)

        }

    }, (args[2] || undefined))

}
