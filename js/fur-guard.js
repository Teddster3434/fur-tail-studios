
(() => {
    "use strict";

    const logo = document.querySelector(".logo");
    const status = document.querySelector(".status");
    const statusLight = document.querySelector(".status-light");
    const message = document.querySelector(".verification");

    if (!logo || !status || !statusLight || !message) {
        console.error("Fur-Guard: Required page elements are missing.");
        return;
    }

    // Create an accessible status label.
    const statusLabel = document.createElement("span");
    statusLabel.textContent = "INITIALISING";
    status.appendChild(statusLabel);

    function setStatus(text, colour) {
        statusLabel.textContent = text;
        statusLight.style.background = colour;
        statusLight.style.boxShadow = `0 0 12px ${colour}`;
    }

    function setWolf(state) {
        const images = {
            silver: "assets/fur-guard-silver.png",
            amber: "assets/fur-guard-amber.png",
            red: "assets/fur-guard-red.png"
        };

        logo.src = images[state];
        logo.alt = `Fur-Guard ${state} wolf emblem`;
    }

    function showMessage(heading, description) {
        message.replaceChildren();

        const title = document.createElement("h2");
        title.textContent = heading;

        const text = document.createElement("p");
        text.textContent = description;

        message.append(title, text);
    }

    // Secure random number generation.
    function secureRandom(max) {
        if (!window.crypto || !window.crypto.getRandomValues) {
            throw new Error("Secure random generation unavailable.");
        }

        const values = new Uint32Array(1);
        window.crypto.getRandomValues(values);

        return values[0] % max;
    }

    // Run browser capability checks.
    async function runChecks() {
        const results = [];

        // Check JavaScript execution.
        results.push({
            name: "JavaScript",
            passed: true
        });

        // Check secure random generation.
        try {
            secureRandom(100000);
            results.push({
                name: "Secure random",
                passed: true
            });
        } catch {
            results.push({
                name: "Secure random",
                passed: false
            });
        }

        // Check SHA-256.
        try {
            if (!crypto.subtle || !crypto.subtle.digest) {
                throw new Error("SHA-256 unavailable");
            }

            const data = new TextEncoder().encode("Fur-Guard V1");
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

        // Check session storage.
        try {
            const key = "furGuardTest";
            sessionStorage.setItem(key, "working");

            const passed = sessionStorage.getItem(key) === "working";
            sessionStorage.removeItem(key);

            results.push({
                name: "Session storage",
                passed
            });
        } catch {
            results.push({
                name: "Session storage",
                passed: false
            });
        }

        return results;
    }

    // Generate a fresh maths challenge.
    function generateChallenge() {
        let first;
        let second;
        let answer;
        let question;

        const previous = sessionStorage.getItem("furGuardPreviousChallenge");

        do {
            first = secureRandom(20) + 1;
            second = secureRandom(20) + 1;
            answer = first + second;
            question = `${first} + ${second}`;
        } while (question === previous);

        sessionStorage.setItem("furGuardPreviousChallenge", question);

        return { question, answer };
    }

    function showChallenge() {
        setWolf("silver");
        setStatus("AWAITING VERIFICATION", "#bdbdbd");

        showMessage(
            "One final check.",
            "Please solve the following maths question to continue."
        );

        const form = document.createElement("form");
        form.style.marginTop = "25px";

        const label = document.createElement("label");
        label.htmlFor = "fur-guard-answer";
        label.textContent = "Your answer:";
        label.style.display = "block";
        label.style.marginBottom = "10px";

        const challenge = generateChallenge();

        const question = document.createElement("p");
        question.textContent = challenge.question + " = ?";
        question.style.fontSize = "28px";
        question.style.marginBottom = "15px";

        const input = document.createElement("input");
        input.id = "fur-guard-answer";
        input.type = "number";
        input.inputMode = "numeric";
        input.required = true;
        input.autocomplete = "off";
        input.setAttribute("aria-label", "Answer to the maths question");
        input.style.padding = "12px";
        input.style.width = "150px";
        input.style.fontSize = "18px";
        input.style.textAlign = "center";
        input.style.borderRadius = "5px";

        const button = document.createElement("button");
        button.type = "submit";
        button.textContent = "VERIFY";
        button.style.display = "block";
        button.style.margin = "20px auto";
        button.style.padding = "13px 30px";
        button.style.cursor = "pointer";
        button.style.borderRadius = "5px";
        button.style.border = "1px solid #aaa";

        const feedback = document.createElement("p");
        feedback.setAttribute("aria-live", "polite");

        form.append(label, question, input, button, feedback);
        message.appendChild(form);

        input.focus();

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (Number(input.value) !== challenge.answer) {
                setWolf("amber");
                setStatus("ADDITIONAL CHECK REQUIRED", "#ffad42");
                feedback.textContent = "That answer wasn't correct. Please try again.";

                // Give the visitor a fresh challenge.
                showChallenge();
                return;
            }

            sessionStorage.setItem("furGuardVerified", "true");

            setWolf("silver");
            setStatus("VERIFICATION PASSED", "#bdbdbd");

            showMessage(
                "Verification complete.",
                "Your browser passed the Fur-Guard V1 checks."
            );

            const continueButton = document.createElement("button");
            continueButton.textContent = "CONTINUE TO FUR-TAIL STUDIOS";
            continueButton.style.padding = "14px 25px";
            continueButton.style.marginTop = "20px";
            continueButton.style.cursor = "pointer";

            continueButton.addEventListener("click", () => {
                window.location.href = "index.html";
            });

            message.appendChild(continueButton);
        });
    }

    // Start Fur-Guard.
    async function initialise() {
        setWolf("silver");
        setStatus("RUNNING SECURITY CHECKS", "#bdbdbd");

        showMessage(
            "We need to run our checks.",
            "We won't be a moment."
        );

        try {
            const results = await runChecks();
            const failed = results.filter(result => !result.passed);

            console.table(results);

            if (failed.length > 0) {
                setWolf("red");
                setStatus("CHECKS FAILED", "#e53935");

                showMessage(
                    "Additional checks required.",
                    "Some browser checks could not be completed. Please try another browser or enable the required browser features."
                );

                const retry = document.createElement("button");
                retry.textContent = "RETRY CHECKS";
                retry.style.padding = "13px 25px";
                retry.style.marginTop = "20px";
                retry.style.cursor = "pointer";

                retry.addEventListener("click", initialise);
                message.appendChild(retry);

                return;
            }

            showChallenge();

        } catch (error) {
            console.error("Fur-Guard error:", error);

            setWolf("red");
            setStatus("SYSTEM ERROR", "#e53935");

            showMessage(
                "Fur-Guard encountered an error.",
                "Please refresh the page and try again."
            );
        }
    }

    initialise();
})();
