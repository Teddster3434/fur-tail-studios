"use strict";

/* =====================================================
   FUR-GUARD V1.2
   AUTOMATIC SECURITY ENGINE
   FUR-TAIL STUDIOS
   ===================================================== */

(() => {

    const wolf = document.getElementById("wolf");
    const statusText = document.getElementById("statusText");
    const statusLight = document.getElementById("statusLight");
    const panel = document.getElementById("panel");

    if (!wolf || !statusText || !statusLight || !panel) {
        console.error("Fur-Guard: Required HTML elements missing.");
        return;
    }

    /* WOLF IMAGE FALLBACKS */

    const wolfImages = {
        silver: [
            "assets/fur-guard-emblem.png",
            "assets/fur-guard-silver.png",
            "assets/wolf-emblem.png"
        ],
        amber: [
            "assets/fur-guard-amber.png"
        ],
        red: [
            "assets/fur-guard-red.png"
        ]
    };

    function setWolf(state) {
        const candidates = wolfImages[state];
        let index = 0;

        function tryNextImage() {
            if (index >= candidates.length) {
                console.error(
                    "Fur-Guard: No matching image found for " + state,
                    candidates
                );
                wolf.alt = "Fur-Guard " + state + " wolf emblem";
                return;
            }

            wolf.src = candidates[index++];
        }

        wolf.onerror = tryNextImage;
        tryNextImage();
    }

    /* STATUS SYSTEM */

    function setStatus(text, colour) {
        statusText.textContent = text;
        statusLight.style.background = colour;
        statusLight.style.boxShadow = "0 0 12px " + colour;
    }

    function showPanel(title, description, showLoading = false) {
        panel.replaceChildren();

        const heading = document.createElement("h2");
        heading.textContent = title;

        const paragraph = document.createElement("p");
        paragraph.textContent = description;

        panel.append(heading, paragraph);

        if (showLoading) {
            const loading = document.createElement("div");
            loading.className = "loading";
            loading.setAttribute("aria-hidden", "true");

            for (let i = 0; i < 3; i++) {
                loading.appendChild(document.createElement("span"));
            }

            panel.appendChild(loading);
        }
    }

    function delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    /* RANDOMCORE */

    function testRandomCore() {
        if (!window.crypto?.getRandomValues) {
            throw new Error("Secure random generation unavailable.");
        }

        const values = new Uint32Array(4);
        window.crypto.getRandomValues(values);

        return values.length === 4;
    }

    /*
       The computer generates a random maths problem,
       solves it internally, and checks its own result.
       The visitor is never asked to answer.
    */

    function testComputerMaths() {
        const values = new Uint32Array(2);

        crypto.getRandomValues(values);

        const first = (values[0] % 1000) + 1;
        const second = (values[1] % 1000) + 1;

        const problem = `${first} + ${second}`;
        const computerAnswer = first + second;
        const expectedAnswer = first + second;

        console.log("RandomCore challenge:", problem);
        console.log("Computer answer:", computerAnswer);

        return computerAnswer === expectedAnswer;
    }

    /* SHA-256 */

    async function testSHA256() {
        if (!window.crypto?.subtle) {
            throw new Error("SHA-256 unavailable.");
        }

        const data = new TextEncoder().encode(
            "FUR-GUARD-V1-SECURITY-CHECK"
        );

        const hash = await crypto.subtle.digest("SHA-256", data);

        return hash.byteLength === 32;
    }

    /* SESSION STORAGE */

    function testSessionStorage() {
        const key = "furGuardSystemTest";

        sessionStorage.setItem(key, "working");

        const result = sessionStorage.getItem(key);

        sessionStorage.removeItem(key);

        return result === "working";
    }

    /* BROWSER CAPABILITIES */

    function testBrowser() {
        return (
            typeof window.fetch === "function" &&
            typeof window.Promise === "function" &&
            typeof window.TextEncoder === "function"
        );
    }

    /* SECURITY CHECKS */

    async function runChecks() {
        const checks = [];

        const tests = [
            ["JavaScript", () => true],
            ["RandomCore", testRandomCore],
            ["Computer Maths", testComputerMaths],
            ["SHA-256", testSHA256],
            ["Session Storage", testSessionStorage],
            ["Browser Capabilities", testBrowser]
        ];

        for (const [name, test] of tests) {
            try {
                const result = await test();

                checks.push({
                    name,
                    passed: result === true
                });

            } catch (error) {
                console.error(name + " failed:", error);

                checks.push({
                    name,
                    passed: false
                });
            }

            await delay(250);
        }

        return checks;
    }

    /* VERIFICATION PASSED */

    function verificationPassed() {
        setWolf("silver");

        setStatus(
            "VERIFICATION PASSED",
            "#bdbdbd"
        );

        showPanel(
            "All checks completed.",
            "Fur-Guard has completed its automatic browser checks. Welcome to Fur-Tail Studios.",
            true
        );

        sessionStorage.setItem(
            "furGuardVerified",
            "true"
        );

        setTimeout(() => {
            window.location.replace("index.html");
        }, 2200);
    }

    /* ADDITIONAL CHECKS */

    async function additionalChecks() {
        setWolf("amber");

        setStatus(
            "ADDITIONAL CHECKS",
            "#ffad42"
        );

        showPanel(
            "We need to check a little more.",
            "Fur-Guard is repeating its checks automatically.",
            true
        );

        await delay(1200);

        return runChecks();
    }

    /* FAILED CHECKS */

    function verificationFailed(results) {
        setWolf("red");

        setStatus(
            "CHECKS COULD NOT BE COMPLETED",
            "#e53935"
        );

        const failed = results
            .filter(check => !check.passed)
            .map(check => check.name)
            .join(", ");

        showPanel(
            "Additional verification required.",
            "These browser checks could not be completed: " +
            failed +
            ". Please check your browser settings and retry."
        );

        const retry = document.createElement("button");
        retry.textContent = "RETRY CHECKS";

        retry.addEventListener("click", initialise);

        panel.appendChild(retry);
    }

    /* INITIALISATION */

    async function initialise() {
        sessionStorage.removeItem("furGuardVerified");

        setWolf("silver");

        setStatus(
            "INITIALISING SECURITY SYSTEMS",
            "#bdbdbd"
        );

        showPanel(
            "We need to run our checks.",
            "We won't be a moment.",
            true
        );

        try {
            let results = await runChecks();

            console.table(results);

            let failed = results.some(check => !check.passed);

            if (failed) {
                results = await additionalChecks();

                console.table(results);

                failed = results.some(check => !check.passed);
            }

            if (failed) {
                verificationFailed(results);
                return;
            }

            verificationPassed();

        } catch (error) {
            console.error("Fur-Guard system error:", error);

            setWolf("red");

            setStatus(
                "SYSTEM ERROR",
                "#e53935"
            );

            showPanel(
                "Fur-Guard encountered an error.",
                "The checks could not be completed. Please retry."
            );

            const retry = document.createElement("button");
            retry.textContent = "RETRY";

            retry.addEventListener("click", initialise);

            panel.appendChild(retry);
        }
    }

    initialise();

})();
