"use strict";

/* =====================================================
   FUR-GUARD V1.1
   FUR-TAIL STUDIOS
   24H SAFETY THAT NEVER STOPS
   ===================================================== */

(() => {

    const wolf = document.getElementById("wolf");
    const statusText = document.getElementById("statusText");
    const statusLight = document.getElementById("statusLight");
    const panel = document.getElementById("panel");

    if (!wolf || !statusText || !statusLight || !panel) {
        console.error("FUR-GUARD: Required HTML elements missing.");
        return;
    }

    const WOLF_IMAGES = {
        silver: [
            "assets/fur-guard-silver.png",
            "assets/fur-guard-emblem.png",
            "assets/wolf-emblem.png"
        ],
        amber: [
            "assets/fur-guard-amber.png"
        ],
        red: [
            "assets/fur-guard-red.png"
        ]
    };

    let currentImageAttempts = 0;

    /* =====================================================
       WOLF IMAGE SYSTEM
       ===================================================== */

    function setWolf(state) {

        const sources = WOLF_IMAGES[state];

        if (!sources) return;

        currentImageAttempts = 0;

        wolf.onerror = () => {

            currentImageAttempts++;

            if (currentImageAttempts < sources.length) {

                wolf.src = sources[currentImageAttempts];

            } else {

                console.error(
                    "FUR-GUARD: Could not load wolf image:",
                    sources
                );

                wolf.alt = "Fur-Guard " + state + " wolf emblem";
            }
        };

        wolf.src = sources[0];
        wolf.alt = "Fur-Guard " + state + " wolf emblem";
    }

    /* =====================================================
       STATUS SYSTEM
       ===================================================== */

    function setStatus(text, colour) {

        statusText.textContent = text;

        statusLight.style.background = colour;
        statusLight.style.boxShadow =
            "0 0 12px " + colour;
    }

    function showPanel(title, description) {

        panel.replaceChildren();

        const heading = document.createElement("h2");
        heading.textContent = title;

        const paragraph = document.createElement("p");
        paragraph.textContent = description;

        panel.append(heading, paragraph);
    }

    /* =====================================================
       PAWSLVANIA LEGAL NOTICE
       ===================================================== */

    function createLegalNotice() {

        if (document.getElementById("pawslvania-notice")) {
            return;
        }

        const notice = document.createElement("div");

        notice.id = "pawslvania-notice";

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

    /* =====================================================
       RANDOMCORE
       Cryptographic random-number testing
       ===================================================== */

    function testRandomCore() {

        if (!window.crypto || !window.crypto.getRandomValues) {
            throw new Error("Secure random generation unavailable.");
        }

        const values = new Uint32Array(4);

        window.crypto.getRandomValues(values);

        return values.some(value => value >= 0);
    }

    /* =====================================================
       SHA-256 TEST
       ===================================================== */

    async function testSHA256() {

        if (!window.crypto || !window.crypto.subtle) {
            throw new Error("SHA-256 unavailable.");
        }

        const message = new TextEncoder().encode(
            "FUR-GUARD-SECURITY-TEST"
        );

        const result = await window.crypto.subtle.digest(
            "SHA-256",
            message
        );

        return result.byteLength === 32;
    }

    /* =====================================================
       SESSION STORAGE TEST
       ===================================================== */

    function testSessionStorage() {

        const key = "furGuardSystemTest";

        sessionStorage.setItem(key, "working");

        const result = sessionStorage.getItem(key);

        sessionStorage.removeItem(key);

        return result === "working";
    }

    /* =====================================================
       AUTOMATIC SECURITY CHECKS
       ===================================================== */

    async function runChecks() {

        const results = [];

        // JavaScript
        results.push({
            name: "JavaScript",
            passed: true
        });

        // RandomCore
        try {

            results.push({
                name: "RandomCore",
                passed: testRandomCore()
            });

        } catch (error) {

            results.push({
                name: "RandomCore",
                passed: false,
                error: error.message
            });

        }

        // SHA-256
        try {

            results.push({
                name: "SHA-256",
                passed: await testSHA256()
            });

        } catch (error) {

            results.push({
                name: "SHA-256",
                passed: false,
                error: error.message
            });

        }

        // Session storage
        try {

            results.push({
                name: "Session Storage",
                passed: testSessionStorage()
            });

        } catch (error) {

            results.push({
                name: "Session Storage",
                passed: false,
                error: error.message
            });

        }

        return results;
    }

    /* =====================================================
       ADDITIONAL CHECKS
       ===================================================== */

    async function additionalChecks() {

        setWolf("amber");

        setStatus(
            "ADDITIONAL CHECKS",
            "#ffad42"
        );

        showPanel(
            "We need to check a little more.",
            "Fur-Guard is retrying the browser security checks."
        );

        await new Promise(resolve => setTimeout(resolve, 1000));

        return runChecks();
    }

    /* =====================================================
       VERIFICATION PASSED
       ===================================================== */

    function verificationPassed() {

        setWolf("silver");

        setStatus(
            "VERIFICATION PASSED",
            "#bdbdbd"
        );

        showPanel(
            "You're cleared to enter.",
            "Fur-Guard has completed its browser checks. Redirecting you to Fur-Tail Studios."
        );

        sessionStorage.setItem(
            "furGuardVerified",
            "true"
        );

        setTimeout(() => {

            window.location.replace("index.html");

        }, 1800);
    }

    /* =====================================================
       VERIFICATION FAILED
       ===================================================== */

    function verificationFailed(results) {

        setWolf("red");

        setStatus(
            "CHECKS COULD NOT BE COMPLETED",
            "#e53935"
        );

        const failed = results
            .filter(result => !result.passed)
            .map(result => result.name)
            .join(", ");

        showPanel(
            "We need to run some more checks.",
            "These browser features could not be verified: " +
            failed +
            ". Please check your browser settings and retry."
        );

        const retry = document.createElement("button");

        retry.textContent = "RETRY CHECKS";

        retry.addEventListener("click", initialise);

        panel.appendChild(retry);
    }

    /* =====================================================
       INITIALISATION
       ===================================================== */

    async function initialise() {

        sessionStorage.removeItem("furGuardVerified");

        setWolf("silver");

        setStatus(
            "INITIALISING SECURITY SYSTEMS",
            "#bdbdbd"
        );

        showPanel(
            "We need to run our checks.",
            "We won't be a moment."
        );

        try {

            let results = await runChecks();

            console.table(results);

            let failed = results.some(
                result => !result.passed
            );

            // Retry automatically once if something fails.
            if (failed) {

                results = await additionalChecks();

                console.table(results);

                failed = results.some(
                    result => !result.passed
                );
            }

            if (failed) {

                verificationFailed(results);

                return;
            }

            verificationPassed();

        } catch (error) {

            console.error("FUR-GUARD ERROR:", error);

            setWolf("red");

            setStatus(
                "SYSTEM ERROR",
                "#e53935"
            );

            showPanel(
                "Fur-Guard encountered an error.",
                "The security checks could not be completed. Please retry."
            );

            const retry = document.createElement("button");

            retry.textContent = "RETRY";

            retry.addEventListener("click", initialise);

            panel.appendChild(retry);
        }
    }

    /* =====================================================
       START FUR-GUARD
       ===================================================== */

    createLegalNotice();

    initialise();

})();
