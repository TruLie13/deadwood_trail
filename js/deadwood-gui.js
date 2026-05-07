const DeadwoodGui = (() => {
    const root = window;
    const refs = {
        launcher: document.getElementById("deadwood-launcher"),
        gui: document.getElementById("deadwood-gui"),
        canvas: document.getElementById("deadwood-gui-canvas"),
        bannerText: document.getElementById("deadwood-gui-banner-text"),
        week: document.getElementById("deadwood-week"),
        miles: document.getElementById("deadwood-miles"),
        location: document.getElementById("deadwood-location"),
        nextLocation: document.getElementById("deadwood-next-location"),
        crewMorale: document.getElementById("deadwood-crew-morale"),
        crewFear: document.getElementById("deadwood-crew-fear"),
        cattleAmount: document.getElementById("deadwood-cattle-amount"),
        cattleHealth: document.getElementById("deadwood-cattle-health"),
        cattleStress: document.getElementById("deadwood-cattle-stress"),
        cattleFatigue: document.getElementById("deadwood-cattle-fatigue"),
        cattleBlight: document.getElementById("deadwood-cattle-blight"),
        items: document.getElementById("deadwood-items"),
        crewCards: document.getElementById("deadwood-crew-cards"),
        crewDetail: document.getElementById("deadwood-crew-detail"),
        crewDetailClose: document.getElementById("deadwood-crew-detail-close"),
        crewDetailIcon: document.getElementById("deadwood-crew-detail-icon"),
        crewDetailName: document.getElementById("deadwood-crew-detail-name"),
        crewDetailRole: document.getElementById("deadwood-crew-detail-role"),
        crewDetailStatus: document.getElementById("deadwood-crew-detail-status"),
        crewDetailStats: document.getElementById("deadwood-crew-detail-stats"),
        crewDetailFate: document.getElementById("deadwood-crew-detail-fate"),
        commandForm: document.getElementById("deadwood-command-form"),
        commandInput: document.getElementById("deadwood-command-input"),
        commandHint: document.getElementById("deadwood-command-hint"),
        commandButtons: document.getElementById("deadwood-command-buttons"),
        alerts: document.getElementById("deadwood-alerts"),
        reportLog: document.getElementById("deadwood-report-log"),
        newRun: document.getElementById("deadwood-gui-new-run"),
        openShell: document.getElementById("deadwood-gui-open-shell"),
    };

    const itemOrder = [
        ["food", "Food"],
        ["blightedFood", "Blighted Food"],
        ["ammo", "Ammo"],
        ["supplies", "Supplies"],
        ["cash", "Cash"],
        ["whiskey", "Whiskey"],
        ["blessedGrain", "Blessed Grain"],
        ["wardingOil", "Warding Oil"],
    ];

    const locationThemes = {
        "SAN ANTONIO": { sky: 0x86b8da, sun: 0xf1e39a, mesa: 0x6886b2, field: 0x58af0b, trail: 0x8a5a20, scrub: 0x85cd43, accent: 0x4f3514 },
        "PAINTED CANYONS": { sky: 0x89bad7, sun: 0xfbe2ad, mesa: 0xcb6f3f, field: 0x5aaa11, trail: 0x8d541d, scrub: 0x94d34f, accent: 0x7b3920 },
        "EL PASO": { sky: 0xa8c8d8, sun: 0xf8e8b8, mesa: 0x8ea39e, field: 0x68b719, trail: 0x7c6030, scrub: 0xafd86d, accent: 0x63645f },
        "STAKED PLAINS": { sky: 0x90afc3, sun: 0xf0dd9c, mesa: 0x786a5f, field: 0x648b18, trail: 0x6a4b27, scrub: 0x93ba44, accent: 0x4d3e31 },
        "TRADING POST OF THE DAMNED": { sky: 0x7b8795, sun: 0xe0c98d, mesa: 0x4f4b52, field: 0x4c6f10, trail: 0x5d3622, scrub: 0x7ca63b, accent: 0x241418 },
        "NEVADA SALT FLATS": { sky: 0xc7d6df, sun: 0xf8eed0, mesa: 0x9d9ca5, field: 0x799821, trail: 0x77614c, scrub: 0xbdd27e, accent: 0x706f7a },
        "THE SILVER FOLD": { sky: 0xd8e5ed, sun: 0xffffff, mesa: 0xb4bac6, field: 0x6ba11f, trail: 0x8a6a3c, scrub: 0xd1e69b, accent: 0xcfd6f4 },
    };

    const crewRoleIcons = {
        leader: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
                <path fill="currentColor" d="M216,120a8,8,0,0,0-6.78,3.76A179.9,179.9,0,0,1,195.41,143L178.32,53.07a16,16,0,0,0-25.72-9.55l-.13.1L128,64,103.53,43.62l-.13-.1a16,16,0,0,0-25.72,9.53L60.59,143a179.27,179.27,0,0,1-13.81-19.25A8,8,0,0,0,40,120a40,40,0,0,0,0,80H216a40,40,0,0,0,0-80ZM93.41,56,117.88,76.4l.12.1a15.92,15.92,0,0,0,20,0l.12-.1L162.59,56l13.68,72H79.73ZM40,184a24,24,0,0,1-4.14-47.64C51.28,159.83,67.73,174.65,82.4,184Zm88,0c-.33,0-25.49-.4-53.86-26.6L76.68,144H179.31l2.54,13.35a113.28,113.28,0,0,1-27.35,19C139.1,183.77,128.06,184,128,184Zm88,0H173.6c14.67-9.35,31.12-24.17,46.54-47.64A24,24,0,0,1,216,184Z"/>
            </svg>
        `,
        scout: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
                <path fill="currentColor" d="M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"/>
            </svg>
        `,
        drover: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
                <path fill="currentColor" d="M205.73,59.93C184.85,47.08,157.24,40,128,40S71.15,47.08,50.27,59.93C28.17,73.52,16,92,16,112S28.17,150.44,50.27,164c19,11.67,43.49,18.56,69.73,19.73v0a37.35,37.35,0,0,1-18.58,33c-14.64,8.86-34.62,9.52-49.72,1.64a8,8,0,1,0-7.4,14.18A66.4,66.4,0,0,0,75,240a67.31,67.31,0,0,0,34.74-9.5c17-10.27,26.29-26.86,26.29-46.7v0c26.24-1.17,50.76-8.06,69.73-19.73C227.83,150.44,240,132,240,112S227.83,73.52,205.73,59.93ZM67.41,155.18c5.24-9.55,15.44-12,23.53-11,10.9,1.42,21.86,9.13,26.61,23.42C99.11,166.45,81.85,162.16,67.41,155.18Zm129.94-4.77c-16.95,10.43-39.17,16.53-63.13,17.43a54.37,54.37,0,0,0-11.39-23.07A47.17,47.17,0,0,0,93,128.35c-17-2.2-31.72,5.11-39.38,18.7C39.64,137,32,124.73,32,112c0-14.21,9.47-27.86,26.65-38.43C77.05,62.23,101.68,56,128,56S179,62.23,197.35,73.55C214.53,84.12,224,97.77,224,112S214.53,139.84,197.35,150.41Z"/>
            </svg>
        `,
        hunter: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
                <path fill="currentColor" d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z"/>
            </svg>
        `,
        hand: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
                <path fill="currentColor" d="M251.34,112,183.88,44.08a96.1,96.1,0,0,0-135.77,0l-.09.09L34.25,58.4A8,8,0,0,0,45.74,69.53L59.47,55.35a79.92,79.92,0,0,1,18.71-13.9L124.68,88l-96,96a16,16,0,0,0,0,22.63l20.69,20.69a16,16,0,0,0,22.63,0l96-96,14.34,14.34h0L200,163.3a16,16,0,0,0,22.63,0l28.69-28.69A16,16,0,0,0,251.34,112ZM60.68,216,40,195.31l68-68L128.68,148ZM162.34,114.32,140,136.67,119.31,116l22.35-22.35a8,8,0,0,0,0-11.32L94.32,35a80,80,0,0,1,78.23,20.41l44.22,44.51L188,128.66l-14.34-14.34A8,8,0,0,0,162.34,114.32Zm49,37.66-12-12L228,111.25l12,12Z"/>
            </svg>
        `,
    };

    const crewWheelSlots = [
        { x: "43px", y: "45px" },
        { x: "112px", y: "95px" },
        { x: "138px", y: "176px" },
        { x: "112px", y: "257px" },
        { x: "43px", y: "307px" },
    ];

    const crewWheelSlotsCompact = [
        { x: "39px", y: "44px" },
        { x: "102px", y: "90px" },
        { x: "126px", y: "164px" },
        { x: "102px", y: "238px" },
        { x: "39px", y: "284px" },
    ];

    const state = {
        snapshot: null,
        outputLines: [],
        latestReportLines: [],
        captureReportBlock: false,
        lastAlertSignature: "",
        promptVisible: false,
        presentationMode: "launcher",
        phaserGame: null,
        scene: null,
        launchInFlight: false,
        lastMiles: 0,
        // crewFateLog: maps crew id -> { lossType, detail } for gone members
        crewFateLog: {},
        // crewAliveMap: tracks previous alive status to detect transitions
        crewAliveMap: {},
        // currently open crew detail id
        openCrewId: null,
    };

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function setMeter(el, value) {
        if (!el) {
            return;
        }
        el.style.width = `${clamp(value, 0, 100)}%`;
    }

    function titleCaseCommand(command) {
        return command
            .split(" ")
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function setBanner(text) {
        if (!text) {
            return;
        }

        refs.bannerText.textContent = text;
    }

    function isGuiMode() {
        return state.presentationMode === "gui";
    }

    function clearOutput() {
        state.outputLines = [];
        state.latestReportLines = [];
        state.captureReportBlock = false;
        state.crewFateLog = {};
        state.crewAliveMap = {};
        if (state.openCrewId !== null && refs.crewDetail) {
            closeCrewDetail();
        }
        setBanner("The trail waits on your next order.");
        if (refs.reportLog) {
            refs.reportLog.innerHTML = "";
        }
    }

    function isSectionHeader(line) {
        return /^\[[A-Z ]+\]$/.test(line);
    }

    function isStatusLikeLine(line) {
        return (
            /^WEEK \d+/i.test(line) ||
            /^FOOD \d+/i.test(line) ||
            /^BLIGHTED FOOD \d+/i.test(line) ||
            /^AMMO \d+/i.test(line) ||
            /^SUPPLIES \d+/i.test(line) ||
            /^WHISKEY \d+/i.test(line) ||
            /^BLESSED GRAIN \d+/i.test(line) ||
            /^WARDING OIL \d+/i.test(line) ||
            /^CASH /i.test(line) ||
            /^CREW: /i.test(line) ||
            /^WAGON: /i.test(line) ||
            /^CATTLE \d+/i.test(line) ||
            /^HERD: /i.test(line) ||
            /^BLIGHT \d+/i.test(line)
        );
    }

    function pushOutputLine(line) {
        const normalized = String(line || "").replace(/\s+/g, " ").trim();
        if (!normalized) {
            return;
        }

        state.outputLines.push(normalized);
        if (state.outputLines.length > 80) {
            state.outputLines.shift();
        }

        if (isSectionHeader(normalized) || isStatusLikeLine(normalized)) {
            state.captureReportBlock = false;
        } else if (
            state.captureReportBlock &&
            !normalized.startsWith("[WARNING]") &&
            !normalized.startsWith("[NOTICE]")
        ) {
            state.latestReportLines.push(normalized);
            state.latestReportLines = state.latestReportLines.slice(-6);
        }

        setBanner(normalized);
        renderReportLog();
    }

    function setPromptState(visible) {
        state.promptVisible = Boolean(visible);
        if (visible) {
            state.captureReportBlock = false;
        }
        updateCommandHint(state.snapshot);
    }

    root.DeadwoodUiBridge = {
        clearOutput,
        pushLine: pushOutputLine,
        setPromptState,
    };

    function setPresentation(mode) {
        state.presentationMode = mode;
        App.presentationMode = mode;
        document.body.classList.remove("deadwood-mode-shell", "deadwood-mode-gui");

        refs.gui.setAttribute("aria-hidden", mode === "gui" ? "false" : "true");

        if (mode === "gui") {
            document.body.classList.add("deadwood-mode-gui");
            refs.launcher.hidden = true;
            ensurePhaser();
            window.requestAnimationFrame(() => {
                refs.commandInput.focus();
                resizePhaser();
            });
            return;
        }

        if (mode === "shell") {
            document.body.classList.add("deadwood-mode-shell");
            refs.launcher.hidden = true;
            window.requestAnimationFrame(() => {
                Term.focus();
                Term.windowResize();
            });
            return;
        }

        refs.launcher.hidden = false;
    }

    async function launchMode(mode, options = {}) {
        if (!App.deadwood || state.launchInFlight) {
            return;
        }

        state.launchInFlight = true;

        try {
            if (App.deadwood.isActive()) {
                await App.deadwood.stop("RUN COMPLETE.");
            }

            if (mode === "gui") {
                clearOutput();
            }

            setPresentation(mode);
            await App.deadwood.start({
                debugMode: Boolean(options.debugMode),
                renderMode: mode,
            });
            syncSnapshot();
        } finally {
            state.launchInFlight = false;
        }
    }

    async function openShellConsole() {
        if (state.launchInFlight) {
            return;
        }

        state.launchInFlight = true;

        try {
            if (App.deadwood?.isActive()) {
                await App.deadwood.stop("RUN COMPLETE.");
            }

            setPresentation("shell");
            if (!Term.ready) {
                Term.prompt();
            }
        } finally {
            state.launchInFlight = false;
        }
    }

    function syncSnapshot() {
        if (!App.deadwood || !App.deadwood.getUiSnapshot) {
            return;
        }

        renderSnapshot(App.deadwood.getUiSnapshot());
    }

    function setSummaryText(el, value, suffix = "") {
        el.textContent = `${value}${suffix}`;
    }

    function renderItems(snapshot) {
        refs.items.innerHTML = itemOrder.map(([key, label]) => {
            const value = snapshot.items[key];
            const formatted = key === "cash" ? `$${value}` : `${value}`;
            return `<div><span>${label}</span><strong>${formatted}</strong></div>`;
        }).join("");
    }

    function detectCrewFateFromOutput(member) {
        const nameKey = member.name.split(" ")[0].toUpperCase();
        // Walk recent output lines in reverse to find the first CREW LOSS line
        // that mentions this member's name.
        for (let i = state.outputLines.length - 1; i >= 0; i -= 1) {
            const line = state.outputLines[i];
            if (line.includes("CREW LOSS:") && line.toUpperCase().includes(nameKey)) {
                // Strip the "CREW LOSS: NAME DIES/DESERTS/IS EXILED." prefix
                const detail = line.replace(/^CREW LOSS:\s*/i, "").trim();
                let lossType = "gone";
                if (/\bTAKES THEIR OWN LIFE\b/i.test(detail)) {
                    lossType = "suicide";
                } else if (/\bMUTINOUS\b/i.test(detail) || /\bMUTINY\b/i.test(detail)) {
                    lossType = "mutinied";
                } else if (/\bDIES\b/i.test(detail)) {
                    lossType = "death";
                } else if (/\bDESERTS\b/i.test(detail)) {
                    lossType = "desertion";
                } else if (/\bEXILED\b/i.test(detail)) {
                    lossType = "exiled";
                }
                return { lossType, detail };
            }
        }
        return null;
    }

    function renderCrewCards(snapshot) {
        const cards = snapshot.crew.cards;
        if (!cards.length) {
            refs.crewCards.innerHTML = "";
            return;
        }

        // Detect newly-gone crew and log their fate from output lines
        cards.forEach(card => {
            const wasAlive = state.crewAliveMap[card.id];
            if (wasAlive === true && !card.alive) {
                const fate = detectCrewFateFromOutput(card);
                if (fate) {
                    state.crewFateLog[card.id] = fate;
                }
            }
            state.crewAliveMap[card.id] = card.alive;
        });

        const slots = window.innerWidth <= 720 ? crewWheelSlotsCompact : crewWheelSlots;

        refs.crewCards.innerHTML = cards.map((card, index) => {
            const slot = slots[index] ?? slots[slots.length - 1];
            const icon = crewRoleIcons[card.role] ?? "";
            const isSelected = state.openCrewId === card.id;

            return `
                <button
                    type="button"
                    class="deadwood-gui-crew-node${card.alive ? "" : " is-gone"}${isSelected ? " is-selected" : ""}"
                    data-crew-id="${card.id}"
                    data-status-tone="${card.statusTone || (card.alive ? 'steady' : 'gone')}"
                    style="--slot-x:${slot.x}; --slot-y:${slot.y};"
                    aria-label="${escapeHtml(`${card.name}, ${card.role}, ${card.statusLabel}`)}"
                    aria-pressed="${isSelected}"
                    title="${escapeHtml(`${card.name} \u00b7 ${card.role} \u00b7 ${card.statusLabel}`)}"
                >
                    ${icon}
                </button>
            `;
        }).join("");

        // Keep detail panel fresh if it is open
        if (state.openCrewId !== null) {
            const openCard = cards.find(c => c.id === state.openCrewId);
            if (openCard) {
                populateCrewDetail(openCard);
            } else {
                closeCrewDetail();
            }
        }
    }

    function renderAlerts(snapshot) {
        const alerts = snapshot.alerts
            .slice()
            .sort((left, right) => {
                if (left.kind === right.kind) {
                    return 0;
                }

                return left.kind === "warning" ? -1 : 1;
            })
            .slice(0, 3);

        const signature = alerts.map(alert => `${alert.kind}:${alert.text}`).join("|");
        if (!alerts.length) {
            refs.alerts.innerHTML = "";
            state.lastAlertSignature = "";
            return;
        }

        if (signature === state.lastAlertSignature) {
            return;
        }

        refs.alerts.innerHTML = alerts.map(alert => `
            <div class="deadwood-gui-alert kind-${alert.kind}">
                <div class="deadwood-gui-alert-kind">${alert.kind}</div>
                <div>${escapeHtml(alert.text)}</div>
            </div>
        `).join("");
        state.lastAlertSignature = signature;
    }

    function renderReportLog() {
        const lines = state.latestReportLines.slice(-6);

        if (lines.length === 0) {
            refs.reportLog.innerHTML = '<div class="deadwood-gui-report-line">The drive is quiet. Choose the next order.</div>';
            return;
        }

        refs.reportLog.innerHTML = lines.map(line => `
            <div class="deadwood-gui-report-line">${escapeHtml(line)}</div>
        `).join("");
    }

    function commandButtonModels(snapshot) {
        if (!snapshot || !snapshot.active) {
            return [];
        }

        const available = new Set(snapshot.availableCommands);
        const models = [];

        function add(command, label, cssClass = "") {
            if (!available.has(command) || models.some(model => model.command === command)) {
                return;
            }

            models.push({ command, label: label || titleCaseCommand(command), cssClass });
        }

        if (snapshot.phase === "outfit") {
            add("food", "Food");
            add("ammo", "Ammo");
            add("supplies", "Supplies");
            add("whiskey", "Whiskey");
            if (available.has("blessed grain") || available.has("grain")) {
                models.push({ command: available.has("blessed grain") ? "blessed grain" : "grain", label: "Blessed Grain", cssClass: "" });
            }
            if (available.has("warding oil") || available.has("oil")) {
                models.push({ command: available.has("warding oil") ? "warding oil" : "oil", label: "Warding Oil", cssClass: "" });
            }
            add("start", "Start Trail");
        } else if (snapshot.phase === "trade") {
            ["food", "ammo", "supplies", "mirror", "nails", "charm", "vigil", "tonic", "blessing", "cache"].forEach(command => {
                add(command);
            });
            if (available.has("blessed grain") || available.has("grain")) {
                models.push({ command: available.has("blessed grain") ? "blessed grain" : "grain", label: "Blessed Grain", cssClass: "" });
            }
            if (available.has("warding oil")) {
                models.push({ command: "warding oil", label: "Warding Oil", cssClass: "" });
            } else if (available.has("oil")) {
                models.push({ command: "oil", label: "Oil", cssClass: "" });
            }
        } else if (snapshot.phase === "encounter") {
            if (available.has("passage")) add("passage", "Passage");
            if (available.has("ward")) add("ward", "Ward");
            if (available.has("provender")) add("provender", "Provender");
            if (available.has("refuse")) add("refuse", "Refuse");
            if (available.has("tithe")) add("tithe", "Tithe");
            if (available.has("confess")) add("confess", "Confess");
            if (available.has("pass by")) add("pass by", "Pass By");
            if (available.has("follow")) add("follow", "Follow");
            if (available.has("bargain")) add("bargain", "Bargain");
            if (available.has("drive off")) add("drive off", "Drive Off");
        } else if (snapshot.phase === "scout") {
            if (available.has("face it")) add("face it", "Face It");
            if (available.has("detour")) add("detour", "Detour");
        } else {
            snapshot.availableCommands.forEach(command => {
                if (["face", "pass", "drive", "long way", "buy"].includes(command)) {
                    return;
                }

                add(command);
            });
        }

        ["back", "status", "help", "quit"].forEach(command => {
            if (available.has(command) && !models.some(model => model.command === command)) {
                models.push({ command, label: titleCaseCommand(command), cssClass: "is-meta" });
            }
        });

        return models;
    }

    function updateCommandHint(snapshot) {
        if (!snapshot || !snapshot.active) {
            refs.commandHint.textContent = "Start a new GUI run or switch back to the terminal shell.";
            return;
        }

        if (snapshot.phase === "outfit" && snapshot.availableCommands.length === 0) {
            refs.commandHint.textContent = "The merchant is waiting on a number. Type the amount and send it.";
            return;
        }

        if (snapshot.phase === "trade" && snapshot.availableCommands.length === 0) {
            refs.commandHint.textContent = "Choose the quantity to buy, then send the number.";
            return;
        }

        if (snapshot.phase === "outfit") {
            refs.commandHint.textContent = "Click a supply to start a purchase, then enter the amount.";
            return;
        }

        refs.commandHint.textContent = state.promptVisible
            ? "Buttons cover common actions. Type raw commands when you need exact input."
            : "The engine is resolving the last order.";
    }

    function renderCommandButtons(snapshot) {
        const models = commandButtonModels(snapshot);
        refs.commandButtons.innerHTML = models.map(model => `
            <button type="button" class="${model.cssClass}" data-command="${model.command}">${model.label}</button>
        `).join("");
    }

    function renderSnapshot(snapshot) {
        state.snapshot = snapshot;

        if (!snapshot) {
            return;
        }

        setSummaryText(refs.week, snapshot.trail.week);
        setSummaryText(refs.miles, `${snapshot.trail.miles}/${snapshot.trail.destinationMiles}`);
        refs.location.textContent = snapshot.location.current;
        refs.nextLocation.textContent = snapshot.location.next
            ? `${snapshot.location.next} (${snapshot.location.milesToNext} mi)`
            : "Destination Reached";

        refs.crewMorale.textContent = `${snapshot.crew.morale}`;
        refs.crewFear.textContent = `${snapshot.crew.fear}`;

        refs.cattleAmount.textContent = `${snapshot.cattle.amount}`;
        refs.cattleHealth.textContent = `${snapshot.cattle.health} / ${snapshot.cattle.conditionLabel}`;
        refs.cattleStress.textContent = `${snapshot.cattle.stress} / ${snapshot.cattle.stressLabel}`;
        refs.cattleFatigue.textContent = `${snapshot.cattle.fatigue}`;
        refs.cattleBlight.textContent = `${snapshot.cattle.blight}`;

        renderItems(snapshot);
        renderCrewCards(snapshot);
        renderAlerts(snapshot);
        renderReportLog();
        renderCommandButtons(snapshot);
        updateCommandHint(snapshot);

        if (state.scene && state.scene.applySnapshot) {
            state.scene.applySnapshot(snapshot, state.lastMiles);
        }
        state.lastMiles = snapshot.trail.miles;

        if (!snapshot.active) {
            setBanner("Run complete. Start another drive or return to the shell.");
        }
    }

    function submitGuiCommand(command) {
        if (!App.deadwood || !App.deadwood.isActive()) {
            return;
        }

        const input = String(command || "").trim();
        if (!input) {
            return;
        }

        refs.commandInput.value = "";
        state.latestReportLines = [];
        state.captureReportBlock = true;
        renderReportLog();
        App.deadwood.handleInput(input);
    }

    function ensurePhaser() {
        if (state.phaserGame || !refs.canvas || typeof Phaser === "undefined") {
            return;
        }

        function TrailScene() {
            Phaser.Scene.call(this, { key: "TrailScene" });
        }

        TrailScene.prototype = Object.create(Phaser.Scene.prototype);
        TrailScene.prototype.constructor = TrailScene;

        TrailScene.prototype.create = function () {
            state.scene = this;
            this.scrollImpulse = 0;
            this.themeName = "SAN ANTONIO";
            this.theme = locationThemes[this.themeName];
            this.isNight = false;

            this.sky = this.add.rectangle(0, 0, 10, 10, this.theme.sky).setOrigin(0, 0);
            this.sun = this.add.circle(120, 88, 42, this.theme.sun).setAlpha(0.9);
            this.moon = this.add.circle(120, 88, 30, 0xf1f3ff).setAlpha(0);
            this.starField = this.add.group();
            for (let index = 0; index < 24; index += 1) {
                const star = this.add.rectangle(0, 0, Phaser.Math.Between(2, 4), Phaser.Math.Between(2, 4), 0xf3f6ff).setAlpha(0);
                this.starField.add(star);
            }
            this.field = this.add.rectangle(0, 0, 10, 10, this.theme.field).setOrigin(0, 0);
            this.trail = this.add.rectangle(0, 0, 10, 10, this.theme.trail).setOrigin(0, 0);
            this.nightVeil = this.add.rectangle(0, 0, 10, 10, 0x09111d, 0).setOrigin(0, 0);

            this.farObjects = [];
            this.midObjects = [];
            this.nearObjects = [];
            this.createParallaxLayer(this.farObjects, 5, 180, 230, 80, 150, this.theme.mesa, 0.18);
            this.createParallaxLayer(this.midObjects, 7, 120, 170, 34, 64, this.theme.accent, 0.4);
            this.createParallaxLayer(this.nearObjects, 10, 70, 130, 16, 30, this.theme.scrub, 1);

            this.landmark = this.add.container(180, 0);
            this.drawLandmark(this.themeName);

            this.wagon = this.createWagon();
            this.cattle = this.createCattle();
            this.tweens.add({
                targets: [this.wagon, this.cattle],
                y: "+=4",
                duration: 850,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });

            this.scale.on("resize", this.layoutScene, this);
            this.layoutScene({ width: this.scale.width, height: this.scale.height });
            if (state.snapshot) {
                this.applySnapshot(state.snapshot, state.snapshot.trail.miles);
            }
        };

        TrailScene.prototype.createParallaxLayer = function (bucket, count, minWidth, maxWidth, minHeight, maxHeight, color, factor) {
            for (let index = 0; index < count; index += 1) {
                const width = Phaser.Math.Between(minWidth, maxWidth);
                const height = Phaser.Math.Between(minHeight, maxHeight);
                const graphic = this.add.rectangle(index * (maxWidth + 50), 0, width, height, color).setOrigin(0.5, 1);
                bucket.push({ sprite: graphic, factor, width });
            }
        };

        TrailScene.prototype.createWagon = function () {
            const container = this.add.container(0, 0);
            const cover = this.add.rectangle(0, -34, 80, 42, 0xf1ece8).setStrokeStyle(4, 0x222222);
            const bed = this.add.rectangle(-2, 0, 96, 26, 0x7a4a1f).setStrokeStyle(4, 0x20150d);
            const frame = this.add.rectangle(18, -4, 16, 14, 0x2b1b12);
            const wheelLeft = this.add.circle(-28, 16, 15, 0x1b1b1b).setStrokeStyle(4, 0xe8e1d7);
            const wheelRight = this.add.circle(28, 16, 15, 0x1b1b1b).setStrokeStyle(4, 0xe8e1d7);
            const pole = this.add.rectangle(-66, 0, 52, 4, 0x5a391b).setOrigin(0, 0.5);
            container.add([pole, cover, bed, frame, wheelLeft, wheelRight]);
            return container;
        };

        TrailScene.prototype.createCattle = function () {
            const container = this.add.container(0, 0);
            const body = this.add.ellipse(0, 0, 52, 26, 0xf3e8de).setStrokeStyle(3, 0x24211f);
            const head = this.add.circle(-30, -4, 11, 0xf3e8de).setStrokeStyle(3, 0x24211f);
            const leg1 = this.add.rectangle(-14, 18, 4, 18, 0x24211f);
            const leg2 = this.add.rectangle(4, 18, 4, 18, 0x24211f);
            const horn1 = this.add.triangle(-38, -12, 0, 0, 10, -8, 12, 4, 0xd09a6f);
            const horn2 = this.add.triangle(-22, -12, 0, 0, -10, -8, -12, 4, 0xd09a6f);
            const tail = this.add.rectangle(28, -8, 4, 16, 0x24211f).setAngle(30);
            container.add([tail, body, head, leg1, leg2, horn1, horn2]);
            return container;
        };

        TrailScene.prototype.drawLandmark = function (location) {
            this.landmark.removeAll(true);
            const theme = locationThemes[location] || locationThemes["SAN ANTONIO"];

            if (location === "PAINTED CANYONS") {
                this.landmark.add(this.add.rectangle(-28, -40, 34, 90, 0xc86434).setOrigin(0.5, 1));
                this.landmark.add(this.add.rectangle(10, -20, 26, 70, 0xdf8a48).setOrigin(0.5, 1));
            } else if (location === "EL PASO") {
                this.landmark.add(this.add.rectangle(0, -14, 76, 26, 0xe9ece2).setOrigin(0.5, 1));
                this.landmark.add(this.add.rectangle(-18, -42, 18, 24, 0x837c67).setOrigin(0.5, 1));
                this.landmark.add(this.add.rectangle(18, -42, 18, 24, 0x837c67).setOrigin(0.5, 1));
            } else if (location === "STAKED PLAINS") {
                for (let index = 0; index < 6; index += 1) {
                    this.landmark.add(this.add.rectangle(-44 + (index * 18), -16 - (index % 2 ? 8 : 0), 5, 54, 0x2f2520).setOrigin(0.5, 1));
                }
            } else if (location === "TRADING POST OF THE DAMNED") {
                this.landmark.add(this.add.rectangle(0, -18, 78, 30, 0x291c18).setOrigin(0.5, 1));
                this.landmark.add(this.add.rectangle(-22, -48, 10, 38, 0x160d0e).setOrigin(0.5, 1));
                this.landmark.add(this.add.rectangle(22, -48, 10, 38, 0x160d0e).setOrigin(0.5, 1));
            } else if (location === "NEVADA SALT FLATS") {
                this.landmark.add(this.add.rectangle(-14, -26, 22, 72, 0xd7d6de).setOrigin(0.5, 1));
                this.landmark.add(this.add.rectangle(18, -12, 18, 52, 0xb8b7c0).setOrigin(0.5, 1));
            } else if (location === "THE SILVER FOLD") {
                this.landmark.add(this.add.rectangle(0, -26, 86, 62, 0xf2f5ff).setOrigin(0.5, 1).setStrokeStyle(4, 0xc0cade));
            } else {
                this.landmark.add(this.add.rectangle(0, -20, 96, 34, theme.accent).setOrigin(0.5, 1));
            }
        };

        TrailScene.prototype.applyTheme = function (location) {
            this.themeName = locationThemes[location] ? location : "SAN ANTONIO";
            this.theme = locationThemes[this.themeName];
            this.sky.setFillStyle(this.theme.sky);
            this.sun.setFillStyle(this.theme.sun);
            this.field.setFillStyle(this.theme.field);
            this.trail.setFillStyle(this.theme.trail);
            this.farObjects.forEach(object => object.sprite.setFillStyle(this.theme.mesa));
            this.midObjects.forEach(object => object.sprite.setFillStyle(this.theme.accent));
            this.nearObjects.forEach(object => object.sprite.setFillStyle(this.theme.scrub));
            this.drawLandmark(this.themeName);
        };

        TrailScene.prototype.setLighting = function (isNight) {
            this.isNight = isNight;
            this.sun.setAlpha(isNight ? 0.08 : 0.92);
            this.moon.setAlpha(isNight ? 0.9 : 0);
            this.nightVeil.setAlpha(isNight ? 0.52 : 0);

            this.starField.getChildren().forEach(star => {
                star.setAlpha(isNight ? Phaser.Math.FloatBetween(0.5, 1) : 0);
            });

            this.field.setFillStyle(isNight ? Phaser.Display.Color.GetColor(58, 86, 24) : this.theme.field);
            this.trail.setFillStyle(isNight ? Phaser.Display.Color.GetColor(86, 61, 36) : this.theme.trail);
            this.farObjects.forEach(object => object.sprite.setFillStyle(isNight ? Phaser.Display.Color.GetColor(73, 75, 97) : this.theme.mesa));
            this.midObjects.forEach(object => object.sprite.setFillStyle(isNight ? Phaser.Display.Color.GetColor(48, 43, 53) : this.theme.accent));
            this.nearObjects.forEach(object => object.sprite.setFillStyle(isNight ? Phaser.Display.Color.GetColor(93, 126, 50) : this.theme.scrub));
        };

        TrailScene.prototype.layoutScene = function (gameSize) {
            const width = gameSize.width;
            const height = gameSize.height;
            const horizon = Math.round(height * 0.52);
            const trailHeight = Math.max(46, Math.round(height * 0.14));

            this.sky.setSize(width, horizon).setPosition(0, 0);
            this.field.setSize(width, height - horizon).setPosition(0, horizon);
            this.trail.setSize(width, trailHeight).setPosition(0, height - trailHeight);
            this.nightVeil.setSize(width, height).setPosition(0, 0);
            this.sun.setPosition(width * 0.16, height * 0.22);
            this.moon.setPosition(width * 0.18, height * 0.2);

            this.starField.getChildren().forEach((star, index) => {
                star.setPosition(
                    30 + ((index * 73) % Math.max(80, width - 60)),
                    24 + ((index * 41) % Math.max(60, horizon - 36))
                );
            });

            this.farObjects.forEach((object, index) => {
                object.sprite.y = horizon + 10;
                if (!object.sprite.x) {
                    object.sprite.x = index * 210;
                }
            });
            this.midObjects.forEach((object, index) => {
                object.sprite.y = horizon + 8;
                if (!object.sprite.x) {
                    object.sprite.x = index * 150;
                }
            });
            this.nearObjects.forEach((object, index) => {
                object.sprite.y = height - trailHeight - 8;
                if (!object.sprite.x) {
                    object.sprite.x = index * 100;
                }
            });

            this.landmark.y = horizon + 4;
            this.wagon.setPosition(width * 0.74, height * 0.55);
            this.cattle.setPosition(width * 0.55, height * 0.56);
        };

        TrailScene.prototype.applySnapshot = function (snapshot, previousMiles) {
            if (!snapshot) {
                return;
            }

            this.applyTheme(snapshot.location.current);
            this.setLighting(snapshot.phase === "night" || snapshot.phase === "blight");

            const deltaMiles = Math.max(0, snapshot.trail.miles - previousMiles);
            if (deltaMiles > 0) {
                this.scrollImpulse = Math.min(180, this.scrollImpulse + (deltaMiles * 3.2));
            }
        };

        TrailScene.prototype.recycleLayer = function (bucket, width, speed, minYJitter) {
            let rightEdge = 0;
            bucket.forEach(object => {
                rightEdge = Math.max(rightEdge, object.sprite.x + object.width);
            });

            bucket.forEach(object => {
                object.sprite.x -= speed * object.factor;
                if (object.sprite.x + object.width < -40) {
                    object.sprite.x = rightEdge + Phaser.Math.Between(50, 140);
                    object.sprite.y += Phaser.Math.Between(-minYJitter, minYJitter);
                    rightEdge = object.sprite.x + object.width;
                }
            });
        };

        TrailScene.prototype.update = function (_time, delta) {
            if (state.promptVisible) {
                this.scrollImpulse = 0;
                return;
            }

            const width = this.scale.width;
            const speed = this.scrollImpulse * (delta / 16.6667);
            this.scrollImpulse *= 0.955;

            if (speed <= 0.12) {
                return;
            }

            this.recycleLayer(this.farObjects, width, speed, 2);
            this.recycleLayer(this.midObjects, width, speed, 6);
            this.recycleLayer(this.nearObjects, width, speed, 5);

            this.landmark.x -= speed * 0.72;
            if (this.landmark.x < -120) {
                this.landmark.x = width + 140;
            }
        };

        state.phaserGame = new Phaser.Game({
            type: Phaser.AUTO,
            parent: refs.canvas,
            backgroundColor: "#7db7d8",
            scale: {
                mode: Phaser.Scale.RESIZE,
                width: refs.canvas.clientWidth || 960,
                height: refs.canvas.clientHeight || 540,
            },
            scene: [TrailScene],
            render: {
                pixelArt: true,
                antialias: false,
            },
        });
    }

    function resizePhaser() {
        if (!state.phaserGame) {
            return;
        }

        state.phaserGame.scale.resize(refs.canvas.clientWidth, refs.canvas.clientHeight);
    }

    // ── Crew detail card ─────────────────────────────

    function buildStatRow(label, value, fillClass, pct, isLow, isHigh) {
        const dangerClass = isLow ? " is-low" : isHigh ? " is-high" : "";
        return `
            <div class="deadwood-crew-detail-stat">
                <span class="deadwood-crew-detail-stat-label">${label}</span>
                <div class="deadwood-crew-detail-stat-bar-wrap">
                    <div class="deadwood-crew-detail-stat-bar" aria-hidden="true">
                        <div
                            class="deadwood-crew-detail-stat-bar-fill ${fillClass}${dangerClass}"
                            style="width:${pct}%"
                        ></div>
                    </div>
                    <span class="deadwood-crew-detail-stat-value">${value}</span>
                </div>
            </div>
        `;
    }

    function populateCrewDetail(card) {
        const icon = crewRoleIcons[card.role] ?? "";
        const isGone = !card.alive;
        const tone = card.statusTone || (isGone ? "gone" : "steady");
        const fate = state.crewFateLog[card.id] ?? null;

        refs.crewDetailIcon.innerHTML = icon;
        refs.crewDetailIcon.className = `deadwood-crew-detail-icon${isGone ? " is-gone" : ""}`;

        refs.crewDetailName.textContent = card.name;

        const roleLabel = card.isLeader && card.role !== "leader" ? `${card.role} · Leader` : card.role;
        refs.crewDetailRole.textContent = roleLabel;
        refs.crewDetailRole.className = `deadwood-crew-detail-role${isGone ? " is-gone" : ""}`;

        const displayStatus = (isGone && fate) ? fate.lossType : card.statusLabel;
        refs.crewDetailStatus.textContent = displayStatus;
        refs.crewDetailStatus.className = `deadwood-crew-detail-status-badge tone-${tone}`;

        if (isGone) {
            // Gone crew: show grayed-out zeroed stats
            refs.crewDetailStats.innerHTML = [
                buildStatRow("Health",  0,  "fill-health",  0,  true,  false),
                buildStatRow("Morale",  0,  "fill-morale",  0,  true,  false),
                buildStatRow("Fear",    0,  "fill-fear",    0,  false, false),
                buildStatRow("Hunger",  0,  "fill-hunger",  0,  false, false),
            ].join("");
        } else {
            refs.crewDetailStats.innerHTML = [
                buildStatRow("Health", card.health, "fill-health", card.health,
                    card.health <= 40, false),
                buildStatRow("Morale", card.morale, "fill-morale", card.morale,
                    card.morale <= 30, false),
                buildStatRow("Fear",   card.fear,   "fill-fear",   card.fear,
                    false, card.fear >= 70),
                buildStatRow("Hunger", card.hunger, "fill-hunger", card.hunger,
                    false, card.hunger >= 70),
            ].join("");
        }

        // Fate/reason section
        if (isGone && fate) {
            // Strip the leading "NAME DIES/DESERTS." part to isolate the narrative
            const namePart = card.name + " ";
            let detail = fate.detail;
            // Try to remove the first sentence if it's just "NAME DIES."
            const sentenceEnd = detail.indexOf(". ");
            if (sentenceEnd !== -1 && sentenceEnd < namePart.length + 20) {
                detail = detail.slice(sentenceEnd + 2);
            }
            refs.crewDetailFate.hidden = false;
            refs.crewDetailFate.innerHTML = `
                <span class="deadwood-crew-detail-fate-label">${fate.lossType}</span>
                ${escapeHtml(detail)}
            `;
        } else {
            refs.crewDetailFate.hidden = true;
        }
    }

    function openCrewDetail(card) {
        state.openCrewId = card.id;
        populateCrewDetail(card);
        refs.crewDetail.hidden = false;
        refs.crewDetail.removeAttribute("aria-hidden");
        refs.crewDetailClose.focus();
    }

    function closeCrewDetail() {
        state.openCrewId = null;
        refs.crewDetail.hidden = true;
        refs.crewDetail.setAttribute("aria-hidden", "true");
        // Remove is-selected from all nodes
        refs.crewCards.querySelectorAll(".deadwood-gui-crew-node.is-selected").forEach(btn => {
            btn.classList.remove("is-selected");
            btn.setAttribute("aria-pressed", "false");
        });
    }

    refs.crewCards.addEventListener("click", event => {
        const button = event.target.closest("button[data-crew-id]");
        if (!button || !state.snapshot) {
            return;
        }

        const id = Number(button.dataset.crewId);
        if (state.openCrewId === id) {
            closeCrewDetail();
            return;
        }

        const card = state.snapshot.crew.cards.find(c => c.id === id);
        if (!card) {
            return;
        }

        openCrewDetail(card);
        // Sync selected state on buttons
        refs.crewCards.querySelectorAll("button[data-crew-id]").forEach(btn => {
            const selected = Number(btn.dataset.crewId) === id;
            btn.classList.toggle("is-selected", selected);
            btn.setAttribute("aria-pressed", String(selected));
        });
    });

    refs.crewDetailClose.addEventListener("click", () => {
        closeCrewDetail();
    });

    // Close on Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && state.openCrewId !== null) {
            closeCrewDetail();
        }
    });

    // ── Command form ─────────────────────────────────

    refs.commandForm.addEventListener("submit", event => {
        event.preventDefault();
        submitGuiCommand(refs.commandInput.value);
    });

    refs.commandButtons.addEventListener("click", event => {
        const button = event.target.closest("button[data-command]");
        if (!button) {
            return;
        }

        submitGuiCommand(button.dataset.command);
    });

    refs.newRun.addEventListener("click", () => {
        launchMode("gui");
    });

    refs.openShell.addEventListener("click", () => {
        openShellConsole();
    });

    refs.launcher.addEventListener("click", event => {
        const shellButton = event.target.closest("[data-open-shell]");
        if (shellButton) {
            openShellConsole();
            return;
        }

        const button = event.target.closest("[data-launch-mode]");
        if (!button) {
            return;
        }

        launchMode(button.dataset.launchMode);
    });

    window.addEventListener("deadwood:ui-snapshot", event => {
        renderSnapshot(event.detail);
    });

    window.addEventListener("resize", () => {
        resizePhaser();
    });

    setPresentation("launcher");
    setBanner("Choose the shell or the graphical trail view.");

    App.deadwoodGui = {
        launchMode,
        openShellConsole,
        syncSnapshot,
        setPresentation,
    };

    if (App.deadwood && App.deadwood.getUiSnapshot) {
        syncSnapshot();
    }

    return App.deadwoodGui;
})();
