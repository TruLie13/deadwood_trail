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
        crewMoraleBar: document.getElementById("deadwood-crew-morale-bar"),
        crewFearBar: document.getElementById("deadwood-crew-fear-bar"),
        cattleAmount: document.getElementById("deadwood-cattle-amount"),
        cattleHealth: document.getElementById("deadwood-cattle-health"),
        cattleStress: document.getElementById("deadwood-cattle-stress"),
        cattleFatigue: document.getElementById("deadwood-cattle-fatigue"),
        cattleBlight: document.getElementById("deadwood-cattle-blight"),
        cattleHealthBar: document.getElementById("deadwood-cattle-health-bar"),
        cattleStressBar: document.getElementById("deadwood-cattle-stress-bar"),
        cattleFatigueBar: document.getElementById("deadwood-cattle-fatigue-bar"),
        wagonStructure: document.getElementById("deadwood-wagon-structure"),
        wagonSanctity: document.getElementById("deadwood-wagon-sanctity"),
        wagonStructureBar: document.getElementById("deadwood-wagon-structure-bar"),
        wagonSanctityBar: document.getElementById("deadwood-wagon-sanctity-bar"),
        items: document.getElementById("deadwood-items"),
        crewCards: document.getElementById("deadwood-crew-cards"),
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
    };

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function setMeter(el, value) {
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

    function renderCrewCards(snapshot) {
        refs.crewCards.innerHTML = snapshot.crew.cards.map(card => `
            <article class="deadwood-gui-card">
                <div class="deadwood-gui-card-header">
                    <div>
                        <div class="deadwood-gui-card-name">${card.name}</div>
                        <div class="deadwood-gui-card-role">${card.role}${card.isLeader ? " / leader" : ""}</div>
                    </div>
                    <div class="deadwood-gui-card-status tone-${card.statusTone}">${card.statusLabel}</div>
                </div>
                <div class="deadwood-gui-card-metrics">
                    <div><span>Health</span><strong>${card.health}</strong></div>
                    <div><span>Morale</span><strong>${card.morale}</strong></div>
                    <div><span>Fear</span><strong>${card.fear}</strong></div>
                    <div><span>Hunger</span><strong>${card.hunger}</strong></div>
                </div>
            </article>
        `).join("");
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
        refs.crewFear.textContent = `${snapshot.crew.fear} / ${snapshot.crew.fearLabel}`;
        setMeter(refs.crewMoraleBar, snapshot.crew.morale);
        setMeter(refs.crewFearBar, snapshot.crew.fear);

        refs.cattleAmount.textContent = `${snapshot.cattle.amount}`;
        refs.cattleHealth.textContent = `${snapshot.cattle.health} / ${snapshot.cattle.conditionLabel}`;
        refs.cattleStress.textContent = `${snapshot.cattle.stress} / ${snapshot.cattle.stressLabel}`;
        refs.cattleFatigue.textContent = `${snapshot.cattle.fatigue}`;
        refs.cattleBlight.textContent = `${snapshot.cattle.blight}`;
        setMeter(refs.cattleHealthBar, snapshot.cattle.health);
        setMeter(refs.cattleStressBar, snapshot.cattle.stress);
        setMeter(refs.cattleFatigueBar, snapshot.cattle.fatigue);

        refs.wagonStructure.textContent = `${snapshot.wagon.structure}`;
        refs.wagonSanctity.textContent = `${snapshot.wagon.sanctity}`;
        setMeter(refs.wagonStructureBar, snapshot.wagon.structure);
        setMeter(refs.wagonSanctityBar, snapshot.wagon.sanctity);

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
