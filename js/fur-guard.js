"use strict";

(() => {
    const wolf = document.getElementById("wolf");
    const statusText = document.getElementById("statusText");
    const statusLight = document.getElementById("statusLight");
    const panel = document.getElementById("panel");

    if (!wolf || !statusText || !statusLight || !panel) {
        console.error("Fur-Guard: Required HTML elements are missing.");
        return;
    }

    const images = {
        silver: "assets/fur-guard-silver.png",
        amber: "assets/fur-guard-amber.png",
        red: "assets/fur-guard-red.png"
    };

    function setWolf(state) {
        wolf.src = images[state];
        wolf.alt = "Fur-Guard " + state + " wolf";
    }

    function setStatus(text, colour) {
        statusText.textContent = text;
        statusLight.style.background = colour;
        statusLight.style.boxShadow = "0 0 12px " + colour;
    }

    function showPanel(title, description) {
        panel.replaceChildren();

        const heading = document.createElement("h2");
        heading.textContent = title;

        const paragraph = document.createElement("p");
        paragraph.textContent = description;

        panel.append(heading, paragraph);
    }

    function secureRandom(max) {
        if (!crypto || !crypto.getRandomValues) {
            throw new Error("Secure random unavailable");
        }

        const values = new Uint32Array(1);
        crypto.getRandomValues(values);

        return values[0] % max;
    }

    function generateChallenge() {
        let first;
        let second;
        let question;

        const previous = sessionStorage.getItem(
            "furGuardPreviousChallenge"
        );

        do {
            first = secureRandom(20) + 1;
            second = secureRandom(20) + 1;
            question = `${first} + ${second}`;
        } while (question === previous);

        sessionStorage.setItem(
            "furGuardPreviousChallenge",
            question
        );

        return {
            question,
            answer: first + second
        };
    }

    async function runChecks() {
        const results = [];

        results.push({
            name: "JavaScript",
            passed: true
        });

        try {
            secureRandom(100000);

            results.push({
                name: "RandomCore",
                passed: true
            });
        } catch {
            results.push({
                name: "RandomCore",
                passed: false
            });
        }

        try {
            if (!crypto.subtle) {
                throw new Error("SHA-256 unavailable");
            }

            const data = new TextEncoder().encode("FUR-GUARD-V1");

            await crypto.subtle.digest("SHA-256", data);

            results.push({
                name: "SHA-256",
                passed: true
            });
        } catch {
            results.push({
                name: "SHA-256",
                passed: false
            });
        }

        try {
            sessionStorage.setItem("furGuardTest", "working");

            const passed =
                sessionStorage.getItem("furGuardTest") === "working";

            sessionStorage.removeItem("furGuardTest");

            results.push({
                name: "Session Storage",
                passed
            });
        } catch {
            results.push({
                name: "Session Storage",
                passed: false
            });
        }

        return results;
    }

    function createLegalNotice() {
        const notice = document.createElement("div");

        notice.style.cssText = `
            margin-top: 25px;
            padding: 12px;
            border: 1px solid #555;
            border-radius: 8px;
            color: #aaa;
            font-size: 11px;
            line-height: 1.7;
        `;

        const heading = document.createElement("strong");
        heading.textContent = "PAWSLVANIA SECURITY NOTICE";

        const joke = document.createElement("p");
        joke.textContent =
            '"In pawslvania touching this is a FEDARAL crime and WILL remove your treets"';

        notice.append(heading, joke);

        document.querySelector(".container").appendChild(notice);
    }

    function showChallenge() {
        setWolf("silver");
        setStatus("AWAITING VERIFICATION", "#bbbbbb");

        showPanel(
            "One final check.",
            "Please solve this question to continue."
        );

        const challenge = generateChallenge();

        const form = document.createElement("form");

        const question = document.createElement("p");
        question.textContent = challenge.question + " = ?";
        question.style.fontSize = "30px";

        const label = document.createElement("label");
        label.htmlFor = "furGuardAnswer";
        label.textContent = "Your answer: ";

        const input = document.createElement("input");
        input.id = "furGuardAnswer";
        input.type = "number";
        input.inputMode = "numeric";
        input.required = true;
        input.autocomplete = "off";

        const feedback = document.createElement("p");
        feedback.setAttribute("aria-live", "polite");

        const button = document.createElement("button");
        button.type = "submit";
        button.textContent = "VERIFY";

        form.append(question, label, input, feedback, button);
        panel.appendChild(form);

        input.focus();

        form.addEventListener("submit", event => {
            event.preventDefault();

            if (Number(input.value) !== challenge.answer) {
                setWolf("amber");
                setStatus("ADDITIONAL CHECK REQUIRED", "#ffad42");

                feedback.textContent =
                    "Incorrect answer. Please try another challenge.";

                setTimeout(showChallenge, 1000);
                return;
            }

            sessionStorage.setItem("furGuardVerified", "true");

            setWolf("silver");
            setStatus("VERIFICATION PASSED", "#bbbbbb");

            showPanel(
                "Verification complete.",
                "Your browser passed the Fur-Guard V1 checks."
            );

            const continueButton = document.createElement("button");
            continueButton.textContent = "CONTINUE TO FUR-TAIL STUDIOS";

            continueButton.addEventListener("click", () => {
                window.location.href = "index.html";
            });

            panel.appendChild(continueButton);
        });
    }

    async function initialise() {
        setWolf("silver");
        setStatus("RUNNING SECURITY CHECKS", "#bbbbbb");

        showPanel(
            "We need to run our checks.",
            "We won't be a moment."
        );

        try {
            const results = await runChecks();

            console.table(results);

            const failed = results.filter(result => !result.passed);

            if (failed.length > 0) {
                setWolf("red");
                setStatus("SECURITY CHECK FAILED", "#e53935");

                showPanel(
                    "Additional checks required.",
                    "Some browser features could not be verified."
                );

                const retry = document.createElement("button");
                retry.textContent = "RETRY CHECKS";
                retry.addEventListener("click", initialise);

                panel.appendChild(retry);
                return;
            }

            showChallenge();

        } catch (error) {
            console.error("Fur-Guard error:", error);

            setWolf("red");
            setStatus("SYSTEM ERROR", "#e53935");

            showPanel(
                "Fur-Guard encountered an error.",
                "Please refresh and try again."
            );
        }
    }

    createLegalNotice();
    initialise();
})();
