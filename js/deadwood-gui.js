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
        crewHub: document.getElementById("deadwood-crew-hub"),
        cattleAmount: document.getElementById("deadwood-cattle-amount"),
        cattleStats: document.getElementById("deadwood-cattle-stats"),
        items: document.getElementById("deadwood-items"),
        wagonMeters: document.getElementById("deadwood-wagon-meters"),
        crewCards: document.getElementById("deadwood-crew-cards"),
        crewDetail: document.getElementById("deadwood-crew-detail"),
        crewDetailClose: document.getElementById("deadwood-crew-detail-close"),
        crewDetailIcon: document.getElementById("deadwood-crew-detail-icon"),
        crewDetailName: document.getElementById("deadwood-crew-detail-name"),
        crewDetailRole: document.getElementById("deadwood-crew-detail-role"),
        crewDetailStatus: document.getElementById("deadwood-crew-detail-status"),
        crewDetailStats: document.getElementById("deadwood-crew-detail-stats"),
        crewDetailFate: document.getElementById("deadwood-crew-detail-fate"),
        commandHint: document.getElementById("deadwood-command-hint"),
        commandButtons: document.getElementById("deadwood-command-buttons"),
        alerts: document.getElementById("deadwood-alerts"),
        reportLog: document.getElementById("deadwood-report-log"),
        reportPanel: document.getElementById("deadwood-report-panel"),
        underbar: document.getElementById("deadwood-gui-underbar"),
        crewWheelPanel: document.getElementById("deadwood-crew-wheel-panel"),
        stage: document.querySelector(".deadwood-gui-stage"),
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

    const itemIcons = {
        food: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M224,104h-8.37a88,88,0,0,0-175.26,0H32a8,8,0,0,0-8,8,104.35,104.35,0,0,0,56,92.28V208a16,16,0,0,0,16,16h64a16,16,0,0,0,16-16v-3.72A104.35,104.35,0,0,0,232,112,8,8,0,0,0,224,104Zm-24.46,0H148.12a71.84,71.84,0,0,1,41.27-29.57A71.45,71.45,0,0,1,199.54,104ZM173.48,56.23q2.75,2.25,5.27,4.75a87.92,87.92,0,0,0-49.15,43H100.1A72.26,72.26,0,0,1,168,56C169.83,56,171.66,56.09,173.48,56.23ZM128,40a71.87,71.87,0,0,1,19,2.57A88.36,88.36,0,0,0,83.33,104H56.46A72.08,72.08,0,0,1,128,40Zm36.66,152A8,8,0,0,0,160,199.3V208H96v-8.7A8,8,0,0,0,91.34,192a88.29,88.29,0,0,1-51-72H215.63A88.29,88.29,0,0,1,164.66,192Z"/></svg>`,
        blightedFood: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M92,104a28,28,0,1,0,28,28A28,28,0,0,0,92,104Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,92,144Zm72-40a28,28,0,1,0,28,28A28,28,0,0,0,164,104Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,164,144ZM128,16C70.65,16,24,60.86,24,116c0,34.1,18.27,66,48,84.28V216a16,16,0,0,0,16,16h80a16,16,0,0,0,16-16V200.28C213.73,182,232,150.1,232,116,232,60.86,185.35,16,128,16Zm44.12,172.69a8,8,0,0,0-4.12,7V216H152V192a8,8,0,0,0-16,0v24H120V192a8,8,0,0,0-16,0v24H88V195.69a8,8,0,0,0-4.12-7C56.81,173.69,40,145.84,40,116c0-46.32,39.48-84,88-84s88,37.68,88,84C216,145.83,199.19,173.69,172.12,188.69Z"/></svg>`,
        ammo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M232,120h-8.34A96.14,96.14,0,0,0,136,32.34V24a8,8,0,0,0-16,0v8.34A96.14,96.14,0,0,0,32.34,120H24a8,8,0,0,0,0,16h8.34A96.14,96.14,0,0,0,120,223.66V232a8,8,0,0,0,16,0v-8.34A96.14,96.14,0,0,0,223.66,136H232a8,8,0,0,0,0-16Zm-96,87.6V200a8,8,0,0,0-16,0v7.6A80.15,80.15,0,0,1,48.4,136H56a8,8,0,0,0,0-16H48.4A80.15,80.15,0,0,1,120,48.4V56a8,8,0,0,0,16,0V48.4A80.15,80.15,0,0,1,207.6,120H200a8,8,0,0,0,0,16h7.6A80.15,80.15,0,0,1,136,207.6ZM128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z"/></svg>`,
        supplies: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"/></svg>`,
        cash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28h-4v8a8,8,0,0,1-16,0v-8H104a8,8,0,0,1,0-16h36a12,12,0,0,0,0-24H116a28,28,0,0,1,0-56h4V72a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H116a12,12,0,0,0,0,24h24A28,28,0,0,1,168,148Z"/></svg>`,
        whiskey: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M245.66,42.34l-32-32a8,8,0,0,0-11.32,11.32l1.48,1.47L148.65,64.51l-38.22,7.65a8.05,8.05,0,0,0-4.09,2.18L23,157.66a24,24,0,0,0,0,33.94L64.4,233a24,24,0,0,0,33.94,0l83.32-83.31a8,8,0,0,0,2.18-4.09l7.65-38.22,41.38-55.17,1.47,1.48a8,8,0,0,0,11.32-11.32ZM96,107.31,148.69,160,104,204.69,51.31,152ZM81.37,224a7.94,7.94,0,0,1-5.65-2.34L34.34,180.28a8,8,0,0,1,0-11.31L40,163.31,92.69,216,87,221.66A8,8,0,0,1,81.37,224ZM177.6,99.2a7.92,7.92,0,0,0-1.44,3.23l-7.53,37.63L160,148.69,107.31,96l8.63-8.63,37.63-7.53a7.92,7.92,0,0,0,3.23-1.44l58.45-43.84,6.19,6.19Z"/></svg>`,
        blessedGrain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M208,56a87.53,87.53,0,0,0-31.85,6c-14.32-29.7-43.25-44.46-44.57-45.12a8,8,0,0,0-7.16,0c-1.33.66-30.25,15.42-44.57,45.12A87.53,87.53,0,0,0,48,56a8,8,0,0,0-8,8v80a88,88,0,0,0,176,0V64A8,8,0,0,0,208,56ZM120,215.56A72.1,72.1,0,0,1,56,144V128.44A72.1,72.1,0,0,1,120,200Zm0-66.1a88,88,0,0,0-64-37.09V72.44A72.1,72.1,0,0,1,120,144ZM94.15,69.11c9.22-19.21,26.41-31.33,33.85-35.9,7.44,4.58,24.63,16.7,33.84,35.9A88.61,88.61,0,0,0,128,107.36,88.57,88.57,0,0,0,94.15,69.11ZM200,144a72.1,72.1,0,0,1-64,71.56V200a72.1,72.1,0,0,1,64-71.56Zm0-31.63a88,88,0,0,0-64,37.09V144a72.1,72.1,0,0,1,64-71.56Z"/></svg>`,
        wardingOil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118,16.53,13,72,60.75,72,118A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"/></svg>`,
    };

    const wagonVisualTopOffset = 58;
    const wagonMeterGap = 8;

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
        alertQueue: [],
        visibleAlerts: [],
        alertPopulateTimerId: null,
        alertDismissTimerIds: {},
        nextAlertId: 1,
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
        guiOnboarding: {
            active: false,
            step: "intro-1",
            startingCash: 0,
            submitting: false,
            baseQuantities: {
                food: 0,
                ammo: 0,
                supplies: 0,
                whiskey: 0,
                grain: 0,
                oil: 0,
            },
            selections: {
                food: 0,
                ammo: 0,
                supplies: 0,
                whiskey: 0,
                grain: 0,
                oil: 0,
            },
        },
        endGameModalRunId: null,
    };

    const storeCatalog = [
        { key: "food", label: "Food", command: "food", price: 1, iconKey: "food" },
        { key: "ammo", label: "Ammo", command: "ammo", price: 2, iconKey: "ammo" },
        { key: "supplies", label: "Supplies", command: "supplies", price: 4, iconKey: "supplies" },
        { key: "whiskey", label: "Whiskey", command: "whiskey", price: 15, iconKey: "whiskey" },
        { key: "grain", label: "Blessed Grain", command: "blessed grain", price: 20, iconKey: "blessedGrain" },
        { key: "oil", label: "Warding Oil", command: "warding oil", price: 25, iconKey: "wardingOil" },
    ];

    const marketMetaByCommand = {
        food: { label: "Food", iconKey: "food" },
        ammo: { label: "Ammo", iconKey: "ammo" },
        supplies: { label: "Supplies", iconKey: "supplies" },
        oil: { label: "Warding Oil", iconKey: "wardingOil" },
        "warding oil": { label: "Warding Oil", iconKey: "wardingOil" },
        grain: { label: "Blessed Grain", iconKey: "blessedGrain" },
        "blessed grain": { label: "Blessed Grain", iconKey: "blessedGrain" },
        charm: { label: "Charm", customIconKey: "charm" },
        vigil: { label: "Vigil", customIconKey: "vigil" },
        tonic: { label: "Tonic", customIconKey: "tonic" },
        mirror: { label: "Mirror", customIconKey: "mirror" },
        nails: { label: "Nails", customIconKey: "nails" },
        blessing: { label: "Blessing", customIconKey: "blessing" },
        cache: { label: "Cache", customIconKey: "cache" },
    };

    const cattleCostIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M104,192a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16H96A8,8,0,0,1,104,192Zm72-8H160a8,8,0,0,0,0,16h16a8,8,0,0,0,0-16Zm-76-48a12,12,0,1,0-12-12A12,12,0,0,0,100,136Zm56,0a12,12,0,1,0-12-12A12,12,0,0,0,156,136Zm88.39-13.88A16,16,0,0,1,232,128H200v32a40,40,0,0,1-24,72H80a40,40,0,0,1-24-72V128H24A16,16,0,0,1,8.31,109,56.13,56.13,0,0,1,63.22,64h1.64A55.83,55.83,0,0,1,48,24a8,8,0,0,1,16,0,40,40,0,0,0,40,40h48a40,40,0,0,0,40-40,8,8,0,0,1,16,0,55.83,55.83,0,0,1-16.86,40h1.64a56.13,56.13,0,0,1,54.91,45A15.82,15.82,0,0,1,244.39,122.12ZM72,152.8a40.57,40.57,0,0,1,8-.8h96a40.57,40.57,0,0,1,8,.8V104a24,24,0,0,0-24-24H96a24,24,0,0,0-24,24ZM56,112v-8a39.81,39.81,0,0,1,8-24h-.8A40.09,40.09,0,0,0,24,112Zm144,80a24,24,0,0,0-24-24H80a24,24,0,0,0,0,48h96A24,24,0,0,0,200,192Zm32-80a40.08,40.08,0,0,0-39.2-32H192a39.81,39.81,0,0,1,8,24v8Z"/></svg>`;

    function ensureEndGameModalRefs() {
        if (refs.endgameModal) {
            return;
        }

        const rootEl = document.createElement("section");
        rootEl.className = "deadwood-gui-endgame-modal";
        rootEl.id = "deadwood-gui-endgame-modal";
        rootEl.hidden = true;
        rootEl.innerHTML = `
            <div class="deadwood-gui-endgame-panel">
                <div id="deadwood-gui-endgame-kicker" class="deadwood-gui-endgame-kicker">Run Complete</div>
                <h2 id="deadwood-gui-endgame-title" class="deadwood-gui-endgame-title">The Trail Is Done</h2>
                <p id="deadwood-gui-endgame-copy" class="deadwood-gui-endgame-copy"></p>
                <div id="deadwood-gui-endgame-report" class="deadwood-gui-endgame-report"></div>
                <div class="deadwood-gui-endgame-score-head">
                    <span>Final Score</span>
                    <strong id="deadwood-gui-endgame-score">0</strong>
                </div>
                <div id="deadwood-gui-endgame-breakdown" class="deadwood-gui-endgame-breakdown"></div>
                <div class="deadwood-gui-endgame-actions">
                    <button type="button" id="deadwood-gui-endgame-close">Close</button>
                </div>
            </div>
        `;

        refs.stage.appendChild(rootEl);
        refs.endgameModal = rootEl;
        refs.endgameKicker = rootEl.querySelector("#deadwood-gui-endgame-kicker");
        refs.endgameTitle = rootEl.querySelector("#deadwood-gui-endgame-title");
        refs.endgameCopy = rootEl.querySelector("#deadwood-gui-endgame-copy");
        refs.endgameReport = rootEl.querySelector("#deadwood-gui-endgame-report");
        refs.endgameScore = rootEl.querySelector("#deadwood-gui-endgame-score");
        refs.endgameBreakdown = rootEl.querySelector("#deadwood-gui-endgame-breakdown");
        refs.endgameClose = rootEl.querySelector("#deadwood-gui-endgame-close");
    }

    function formatScoreDelta(value) {
        const rounded = Math.round(value * 10) / 10;
        const asText = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
        return `${rounded > 0 ? "+" : ""}${asText}`;
    }

    function endGameScoreBreakdown(report) {
        if (!report || !report.summary || report.summary.score === null) {
            return [];
        }

        const summary = report.summary;
        const crewEnd = report.crew?.end || [];
        const leaderAlive = crewEnd.some(member => member.alive && member.isLeader);
        const nonLeaderAlive = crewEnd.filter(member => member.alive && !member.isLeader).length;
        const thwartedRobberies = report.counters?.events?.["night-robbery-thwarted"] || 0;
        const perfectHunts = report.counters?.hunt?.perfectHunts || 0;
        const weekPenalty = Math.max(0, summary.weekEnded - 20) * 30;

        return [
            { label: "Cattle remaining", value: summary.cattleRemaining * 1.5 },
            { label: "Cash remaining", value: summary.cashRemaining * 1.0 },
            { label: "Leader survived", value: leaderAlive ? 80 : 0 },
            { label: "Crew survived", value: nonLeaderAlive * 35 },
            { label: "Wagon condition", value: summary.wagonCondition * 0.8 },
            { label: "Morale", value: summary.morale * 0.5 },
            { label: "Wagon sanctity", value: summary.wagonSanctity * 0.35 },
            { label: "Robberies thwarted", value: Math.max(0, thwartedRobberies) * 10 },
            { label: "Perfect hunts", value: Math.max(0, perfectHunts) * 25 },
            { label: "Late week penalty", value: -weekPenalty },
        ].filter(entry => Math.round(entry.value * 10) / 10 !== 0);
    }

    function crewOutcomeLabel(lossType) {
        if (lossType === "death") return "Dead";
        if (lossType === "desertion") return "Deserted";
        if (lossType === "exile") return "Exiled";
        return "Unknown";
    }

    function endGameCrewOutcomes(report) {
        const endCrew = report?.crew?.end || [];
        const losses = report?.crew?.losses || [];
        const lossById = new Map();
        losses.forEach(loss => {
            lossById.set(loss.memberId, loss);
        });

        return endCrew.map(member => {
            const loss = lossById.get(member.id);
            if (loss) {
                return {
                    name: member.name,
                    role: member.role,
                    state: crewOutcomeLabel(loss.type),
                    detail: loss.detail || "Lost on the trail.",
                };
            }

            return {
                name: member.name,
                role: member.role,
                state: member.alive ? "Alive" : "Gone",
                detail: member.alive ? "Still with the wagon at run end." : "Gone from the trail.",
            };
        });
    }

    function renderEndGameModal(snapshot) {
        ensureEndGameModalRefs();
        const report = App.deadwood?.getRunReport ? App.deadwood.getRunReport() : null;
        const shouldShow = Boolean(report && report.summary && snapshot && snapshot.active === false);
        if (!shouldShow) {
            refs.endgameModal.hidden = true;
            refs.gui.classList.remove("is-endgame-open");
            return;
        }

        const effectiveReport = report;
        const runId = effectiveReport?.runId || "run-ended";
        if (state.endGameModalRunId === runId && !refs.endgameModal.hidden) {
            return;
        }

        state.endGameModalRunId = runId;
        const score = effectiveReport?.summary?.score;
        const outcome = effectiveReport?.summary?.outcome || "quit";
        const failureCause = effectiveReport?.summary?.failureCause || null;
        const breakdown = endGameScoreBreakdown(effectiveReport);
        const positives = breakdown.filter(entry => entry.value > 0);
        const negatives = breakdown.filter(entry => entry.value < 0);
        const ordered = positives.concat(negatives);

        refs.endgameKicker.textContent = outcome === "victory" ? "Victory" : "Run Complete";
        refs.endgameTitle.textContent = outcome === "victory" ? "You Reached The Silver Fold" : "The Trail Took Its Due";
        refs.endgameCopy.textContent = outcome === "victory"
            ? "The herd survives the long drive west. Count what remains and mark the score."
            : `The drive ended${failureCause ? ` (${String(failureCause).replace(/-/g, " ")})` : ""}. Gather the tally and try again.`;
        refs.endgameScore.textContent = score === null ? "0" : String(score);
        if (outcome === "victory") {
            refs.endgameReport.innerHTML = "";
        } else {
            const crewOutcomes = endGameCrewOutcomes(effectiveReport);
            refs.endgameReport.innerHTML = `
                <div class="deadwood-gui-endgame-report-title">In Memoriam</div>
                ${crewOutcomes.length
                    ? crewOutcomes.map(entry => `
                        <div class="deadwood-gui-endgame-report-line">
                            <strong>${escapeHtml(entry.name)} (${escapeHtml(titleCaseCommand(entry.role))}) - ${escapeHtml(entry.state)}</strong>
                            <div>${escapeHtml(entry.detail)}</div>
                        </div>
                    `).join("")
                    : '<div class="deadwood-gui-endgame-report-line">No crew records available for this run.</div>'}
            `;
        }
        refs.endgameBreakdown.hidden = ordered.length === 0;
        refs.endgameBreakdown.innerHTML = ordered.length
            ? ordered.map(entry => `
                <div class="deadwood-gui-endgame-line">
                    <span>${escapeHtml(entry.label)}</span>
                    <strong class="${entry.value > 0 ? "is-positive" : "is-negative"}">${escapeHtml(formatScoreDelta(entry.value))}</strong>
                </div>
            `).join("")
            : "";

        refs.endgameModal.hidden = false;
        refs.gui.classList.add("is-endgame-open");
    }

    const marketCustomIcons = {
        charm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M208,88h-56V32a8,8,0,0,0-16,0V88H80a8,8,0,0,0,0,16h56v56a8,8,0,0,0,16,0V104h56a8,8,0,0,0,0-16ZM128,184a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184Zm88-64H192a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM64,120H40a8,8,0,0,0,0,16H64a8,8,0,0,0,0-16Z"/></svg>`,
        vigil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M128,24C74,24,30.9,66.56,24.39,120.26a8,8,0,0,0,0,1.48C30.9,175.44,74,218,128,218s97.1-42.56,103.61-96.26a8,8,0,0,0,0-1.48C225.1,66.56,182,24,128,24Zm0,178c-44.37,0-80.54-34.88-87.45-80C47.46,76.88,83.63,42,128,42s80.54,34.88,87.45,80C208.54,167.12,172.37,202,128,202Zm0-128a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,74Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,154Z"/></svg>`,
        tonic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M176,24H80A24,24,0,0,0,56,48v12a24,24,0,0,0,16,22.63V224a8,8,0,0,0,16,0V184h80v40a8,8,0,0,0,16,0V82.63A24,24,0,0,0,200,60V48A24,24,0,0,0,176,24Zm8,36a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8Zm-16,108H88V84h80Z"/></svg>`,
        mirror: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M128,24A72,72,0,0,0,56,96c0,35.33,25.5,64.84,59,71.15V192H96a8,8,0,0,0,0,16h19.31L98.34,224.69a8,8,0,1,0,11.32,11.31L128,217.66,146.34,236a8,8,0,0,0,11.32-11.31L140.69,208H160a8,8,0,0,0,0-16H141V167.15c33.5-6.31,59-35.82,59-71.15A72,72,0,0,0,128,24Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,152Z"/></svg>`,
        nails: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M238.63,73.37a8,8,0,0,0-11.31,0L192,108.69,147.31,64l35.32-35.31a8,8,0,0,0-11.31-11.32L136,52.69,103.31,20a8,8,0,0,0-11.31,11.31L124.69,64,108.69,80,76,47.31A8,8,0,0,0,64.69,58.63L97.37,91.31,64,124.69,31.31,92A8,8,0,0,0,20,103.31L52.69,136,17.37,171.31a8,8,0,0,0,11.31,11.32L64,147.31,108.69,192,73.37,227.31a8,8,0,0,0,11.31,11.32L120,203.31,152.69,236a8,8,0,0,0,11.31-11.31L131.31,192,147.31,176,180,208.69A8,8,0,0,0,191.31,197.37L158.63,164.69,192,131.31,224.69,164A8,8,0,0,0,236,152.69L203.31,120l35.32-35.31A8,8,0,0,0,238.63,73.37ZM136,164,92,120l44-44,44,44Z"/></svg>`,
        blessing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M128,24a8,8,0,0,0-8,8V72H80a8,8,0,0,0,0,16h40v40a8,8,0,0,0,16,0V88h40a8,8,0,0,0,0-16H136V32A8,8,0,0,0,128,24ZM56,136a8,8,0,0,0-8,8v16a64,64,0,0,0,128,0V144a8,8,0,0,0-16,0v16a48,48,0,0,1-96,0V144A8,8,0,0,0,56,136Zm144,0a8,8,0,0,0-8,8v16a48,48,0,0,1-24,41.57,8,8,0,1,0,8,13.85A64,64,0,0,0,208,160V144A8,8,0,0,0,200,136Z"/></svg>`,
        cache: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M216,56H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56Zm0,16v26.11l-69.34,42.57a8,8,0,0,1-8.38,0L40,98.11V72ZM40,200V116.89l89.94,55.18a24,24,0,0,0,25.12,0L216,116.89V200Z"/></svg>`,
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

    function titleCaseStatus(raw) {
        return String(raw || "")
            .toLowerCase()
            .split(/[\s_]+/)
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    const herdStatusTones = new Set(["steady", "worn", "shaken", "breaking"]);

    function normalizeHerdTone(tone) {
        return herdStatusTones.has(tone) ? tone : "steady";
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function ensureOnboardingRefs() {
        if (refs.onboarding) {
            return;
        }

        const rootEl = document.createElement("section");
        rootEl.className = "deadwood-gui-onboarding";
        rootEl.id = "deadwood-gui-onboarding";
        rootEl.hidden = true;
        rootEl.setAttribute("aria-live", "polite");
        rootEl.innerHTML = `
            <div class="deadwood-gui-onboarding-panel">
                <div id="deadwood-gui-onboarding-kicker" class="deadwood-gui-onboarding-kicker">Deadwood Trail</div>
                <h2 id="deadwood-gui-onboarding-title" class="deadwood-gui-onboarding-title">1888</h2>
                <div id="deadwood-gui-onboarding-copy" class="deadwood-gui-onboarding-copy"></div>
                <div id="deadwood-gui-store" class="deadwood-gui-store" hidden>
                    <div class="deadwood-gui-store-head">
                        <strong id="deadwood-gui-store-cash">$0</strong>
                        <span>remaining cash</span>
                    </div>
                    <div id="deadwood-gui-store-items" class="deadwood-gui-store-items"></div>
                    <button type="button" id="deadwood-gui-store-start" class="deadwood-gui-store-start">Start Trail</button>
                </div>
                <p id="deadwood-gui-onboarding-prompt" class="deadwood-gui-onboarding-prompt">Press Space to continue.</p>
            </div>
        `;
        refs.stage.appendChild(rootEl);
        refs.onboarding = rootEl;
        refs.onboardingKicker = rootEl.querySelector("#deadwood-gui-onboarding-kicker");
        refs.onboardingTitle = rootEl.querySelector("#deadwood-gui-onboarding-title");
        refs.onboardingCopy = rootEl.querySelector("#deadwood-gui-onboarding-copy");
        refs.onboardingPrompt = rootEl.querySelector("#deadwood-gui-onboarding-prompt");
        refs.onboardingStore = rootEl.querySelector("#deadwood-gui-store");
        refs.onboardingStoreCash = rootEl.querySelector("#deadwood-gui-store-cash");
        refs.onboardingStoreItems = rootEl.querySelector("#deadwood-gui-store-items");
        refs.onboardingStoreStart = rootEl.querySelector("#deadwood-gui-store-start");
    }

    function ensureMarketModalRefs() {
        if (refs.marketModal) {
            return;
        }

        const rootEl = document.createElement("section");
        rootEl.className = "deadwood-gui-market-modal";
        rootEl.id = "deadwood-gui-market-modal";
        rootEl.hidden = true;
        rootEl.innerHTML = `
            <div class="deadwood-gui-market-panel">
                <div id="deadwood-gui-market-kicker" class="deadwood-gui-market-kicker">Merchant</div>
                <h2 id="deadwood-gui-market-title" class="deadwood-gui-market-title">Trade Offers</h2>
                <div id="deadwood-gui-market-copy" class="deadwood-gui-market-copy"></div>
                <div id="deadwood-gui-market-available" class="deadwood-gui-market-available"></div>
                <div id="deadwood-gui-market-items" class="deadwood-gui-market-items"></div>
                <div class="deadwood-gui-market-actions">
                    <button type="button" id="deadwood-gui-market-back" class="deadwood-gui-market-back">Leave Market</button>
                </div>
            </div>
        `;

        refs.stage.appendChild(rootEl);
        refs.marketModal = rootEl;
        refs.marketKicker = rootEl.querySelector("#deadwood-gui-market-kicker");
        refs.marketTitle = rootEl.querySelector("#deadwood-gui-market-title");
        refs.marketCopy = rootEl.querySelector("#deadwood-gui-market-copy");
        refs.marketAvailable = rootEl.querySelector("#deadwood-gui-market-available");
        refs.marketItems = rootEl.querySelector("#deadwood-gui-market-items");
        refs.marketBack = rootEl.querySelector("#deadwood-gui-market-back");
    }

    function tradeDescriptionByCommand() {
        const map = {};
        const marketHeaderIndex = (() => {
            for (let index = state.outputLines.length - 1; index >= 0; index -= 1) {
                if (state.outputLines[index] === "[MARKET]" || state.outputLines[index] === "[MERCHANT]") {
                    return index;
                }
            }
            return -1;
        })();

        if (marketHeaderIndex < 0) {
            return map;
        }

        for (let index = marketHeaderIndex + 1; index < state.outputLines.length; index += 1) {
            const line = state.outputLines[index];
            const match = line.match(/^([A-Z ]+)\s*-\s*(.+)$/);
            if (!match) {
                continue;
            }

            const command = match[1].trim().toLowerCase();
            map[command] = match[2].trim();
        }

        return map;
    }

    function tradeRowModel(command, descriptionByCommand) {
        const key = command.toLowerCase();
        const meta = marketMetaByCommand[key] || { label: titleCaseCommand(command), iconKey: "supplies" };
        const description = descriptionByCommand[key] || "";
        const costMatch = description.match(/COST\s+([^,]+)/i);
        const gainMatch = description.match(/GAIN\s+(\d+)/i);
        const costLabel = costMatch ? costMatch[1].trim() : "";
        const quantityLabel = gainMatch ? `x${gainMatch[1]}` : "";
        const isCattleCost = /cattle/i.test(costLabel);
        const iconSvg = meta.customIconKey
            ? (marketCustomIcons[meta.customIconKey] || itemIcons.supplies)
            : (itemIcons[meta.iconKey] || itemIcons.supplies);

        return {
            command,
            label: meta.label,
            iconSvg,
            costLabel,
            quantityLabel,
            isCattleCost,
        };
    }

    function canonicalTradeOfferCommand(command) {
        const normalized = String(command || "").toLowerCase();
        if (normalized === "blessed grain") {
            return "grain";
        }
        if (normalized === "warding oil") {
            return "oil";
        }
        return normalized;
    }

    function renderMarketModal(snapshot) {
        ensureMarketModalRefs();
        const visible = !state.guiOnboarding.active && snapshot && snapshot.active && snapshot.phase === "trade";
        refs.marketModal.hidden = !visible;
        refs.gui.classList.toggle("is-market-modal-open", visible);
        if (!visible) {
            return;
        }

        const available = new Set(snapshot.availableCommands);
        const offerCommands = [];
        const seenOffers = new Set();
        snapshot.availableCommands
            .filter(command => !["back", "status", "help", "quit"].includes(command))
            .forEach(command => {
                const canonical = canonicalTradeOfferCommand(command);
                if (seenOffers.has(canonical)) {
                    return;
                }
                seenOffers.add(canonical);
                offerCommands.push(available.has(canonical) ? canonical : command);
            });

        const offers = offerCommands.map(command => tradeRowModel(command, tradeDescriptionByCommand()));

        refs.marketKicker.textContent = snapshot.location.current === "EL PASO" ? "Merchant" : "Market";
        refs.marketTitle.textContent = snapshot.location.current === "EL PASO" ? "El Paso Offers" : "Trading Post Offers";
        refs.marketCopy.innerHTML = state.latestReportLines.slice(-3).map(line => `<p>${escapeHtml(line)}</p>`).join("") || "<p>Choose one offer at a time.</p>";
        const usesCattle = offers.some(offer => offer.isCattleCost);
        refs.marketAvailable.innerHTML = usesCattle
            ? `<span class="deadwood-gui-market-cattle-icon">${cattleCostIcon}</span><strong>${snapshot.cattle.amount}</strong><span>available cattle</span>`
            : `<strong>$${snapshot.items.cash}</strong><span>available cash</span>`;
        refs.marketItems.innerHTML = offers.map(offer => `
            <div class="deadwood-gui-market-row">
                <span class="deadwood-gui-market-row-icon">${offer.iconSvg}</span>
                <span class="deadwood-gui-market-row-name">${escapeHtml(offer.label)}${offer.quantityLabel ? ` <small>(${escapeHtml(offer.quantityLabel)})</small>` : ""}</span>
                <span class="deadwood-gui-market-row-cost">
                    ${offer.isCattleCost ? `<span class="deadwood-gui-market-cattle-icon">${cattleCostIcon}</span>` : "$"}
                    ${escapeHtml(offer.costLabel.replace(/\$/g, "").replace(/\s*CATTLE/i, "").trim())}
                </span>
                <button type="button" data-market-command="${offer.command}" ${available.has(offer.command) ? "" : "disabled"}>Acquire</button>
            </div>
        `).join("");
    }

    function onboardingSpent() {
        return storeCatalog.reduce((total, item) => {
            const baseQuantity = state.guiOnboarding.baseQuantities[item.key] || 0;
            const selectedQuantity = state.guiOnboarding.selections[item.key] || 0;
            const purchasedQuantity = Math.max(0, selectedQuantity - baseQuantity);
            return total + (purchasedQuantity * item.price);
        }, 0);
    }

    function onboardingRemainingCash() {
        return Math.max(0, state.guiOnboarding.startingCash - onboardingSpent());
    }

    function renderOnboardingStore() {
        if (!refs.onboardingStoreItems || !refs.onboardingStoreCash) {
            return;
        }

        const remainingCash = onboardingRemainingCash();
        refs.onboardingStoreCash.textContent = `$${remainingCash}`;
        refs.onboardingStoreItems.innerHTML = storeCatalog.map(item => {
            const quantity = state.guiOnboarding.selections[item.key] || 0;
            const minimumQuantity = state.guiOnboarding.baseQuantities[item.key] || 0;
            const disableMinus = quantity <= minimumQuantity;
            const disablePlus = remainingCash < item.price;
            return `
                <div class="deadwood-gui-store-row" data-store-item="${item.key}">
                    <span class="deadwood-gui-store-row-icon">${itemIcons[item.iconKey] || ""}</span>
                    <span class="deadwood-gui-store-row-name">${escapeHtml(item.label)}</span>
                    <span class="deadwood-gui-store-row-price">$${item.price}</span>
                    <div class="deadwood-gui-store-row-stepper">
                        <button type="button" data-store-action="dec" data-store-item="${item.key}" ${disableMinus ? "disabled" : ""}>-</button>
                        <span aria-label="${escapeHtml(`${item.label} quantity`)}">${quantity}</span>
                        <button type="button" data-store-action="inc" data-store-item="${item.key}" ${disablePlus ? "disabled" : ""}>+</button>
                    </div>
                </div>
            `;
        }).join("");
        refs.onboardingStoreStart.disabled = state.guiOnboarding.submitting;
    }

    function renderOnboarding() {
        ensureOnboardingRefs();
        const isVisible = state.presentationMode === "gui" && state.guiOnboarding.active;

        refs.onboarding.hidden = !isVisible;
        refs.gui.classList.toggle("is-onboarding", isVisible);
        if (!isVisible) {
            return;
        }

        if (state.guiOnboarding.step === "intro-1") {
            refs.onboardingKicker.textContent = "Deadwood Trail";
            refs.onboardingTitle.textContent = "1888";
            refs.onboardingCopy.innerHTML = [
                "San Antonio is the last place the sun still feels honest.",
                "You are driving 500 untainted cattle to the Silver Fold in Nevada.",
                "The herd is the score. Everything else exists to get them there.",
            ].map(line => `<p>${escapeHtml(line)}</p>`).join("");
            refs.onboardingPrompt.textContent = "Press Space to continue.";
            refs.onboardingStore.hidden = true;
            return;
        }

        if (state.guiOnboarding.step === "intro-2") {
            refs.onboardingKicker.textContent = "Outfitting";
            refs.onboardingTitle.textContent = "You Are To Outfit The Drive";
            refs.onboardingCopy.innerHTML = [
                "The merchant insists on a starter kit before you can shop freely.",
                `Starter kit issued: ${state.guiOnboarding.baseQuantities.food} food, ${state.guiOnboarding.baseQuantities.ammo} ammo, ${state.guiOnboarding.baseQuantities.supplies} supplies.`,
                "You are to outfit this drive for the long westward push.",
                `After mandatory supplies, you are left with $${state.guiOnboarding.startingCash}.`,
            ].map(line => `<p>${escapeHtml(line)}</p>`).join("");
            refs.onboardingPrompt.textContent = "Press Space to open the store.";
            refs.onboardingStore.hidden = true;
            return;
        }

        refs.onboardingKicker.textContent = "Store Ledger";
        refs.onboardingTitle.textContent = "Choose Your Supplies";
        refs.onboardingCopy.innerHTML = "<p>Buy what you need. Remaining cash updates live.</p>";
        refs.onboardingPrompt.textContent = "Use + and - to set quantity, then start the trail.";
        refs.onboardingStore.hidden = false;
        renderOnboardingStore();
    }

    function resetGuiOnboarding(snapshot = null) {
        state.guiOnboarding.active = true;
        state.guiOnboarding.step = "intro-1";
        state.guiOnboarding.startingCash = snapshot?.items?.cash ?? 0;
        state.guiOnboarding.submitting = false;
        state.guiOnboarding.baseQuantities.food = snapshot?.items?.food ?? 0;
        state.guiOnboarding.baseQuantities.ammo = snapshot?.items?.ammo ?? 0;
        state.guiOnboarding.baseQuantities.supplies = snapshot?.items?.supplies ?? 0;
        state.guiOnboarding.baseQuantities.whiskey = snapshot?.items?.whiskey ?? 0;
        state.guiOnboarding.baseQuantities.grain = snapshot?.items?.blessedGrain ?? 0;
        state.guiOnboarding.baseQuantities.oil = snapshot?.items?.wardingOil ?? 0;
        storeCatalog.forEach(item => {
            state.guiOnboarding.selections[item.key] = state.guiOnboarding.baseQuantities[item.key] || 0;
        });
        renderOnboarding();
    }

    function setBanner(text) {
        if (!text) {
            return;
        }

        refs.bannerText.textContent = text;
    }

    function setWagonMeterAnchor(x, wagonY) {
        if (!refs.wagonMeters) {
            return;
        }

        refs.wagonMeters.style.setProperty("--wagon-meter-x", `${Math.round(x)}px`);
        refs.wagonMeters.style.setProperty("--wagon-meter-y", `${Math.round(wagonY - wagonVisualTopOffset - wagonMeterGap)}px`);
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
        state.lastAlertSignature = "";
        state.alertQueue = [];
        state.visibleAlerts = [];
        if (state.alertPopulateTimerId) {
            window.clearTimeout(state.alertPopulateTimerId);
            state.alertPopulateTimerId = null;
        }
        Object.values(state.alertDismissTimerIds).forEach(timerId => {
            window.clearTimeout(timerId);
        });
        state.alertDismissTimerIds = {};
        if (refs.alerts) {
            refs.alerts.innerHTML = "";
        }
        if (state.openCrewId !== null && refs.crewDetail) {
            closeCrewDetail();
        }
        setBanner("The trail waits on your next order.");
        if (refs.reportLog) {
            refs.reportLog.innerHTML = "";
        }
        renderOnboarding();
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
        // Prompt transitions usually mean command availability changed.
        // Pull a fresh snapshot so command buttons update immediately.
        syncSnapshot();
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
        renderOnboarding();

        refs.gui.setAttribute("aria-hidden", mode === "gui" ? "false" : "true");

        if (mode === "gui") {
            document.body.classList.add("deadwood-mode-gui");
            refs.launcher.hidden = true;
            ensurePhaser();
            window.requestAnimationFrame(() => {
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
                state.endGameModalRunId = null;
            }

            setPresentation(mode);
            await App.deadwood.start({
                debugMode: Boolean(options.debugMode),
                renderMode: mode,
            });
            syncSnapshot();
            if (mode === "gui") {
                resetGuiOnboarding(App.deadwood.getUiSnapshot ? App.deadwood.getUiSnapshot() : null);
            }
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
            return `
                <div class="deadwood-gui-item-tile" data-item="${key}" data-label="${escapeHtml(label)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(`${label}: ${formatted}`)}">
                    <span class="deadwood-gui-item-icon">${itemIcons[key]}</span>
                    <span class="deadwood-gui-item-label">${escapeHtml(label)}</span>
                    <strong>${escapeHtml(formatted)}</strong>
                </div>
            `;
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
        
        function renderVisibleAlerts() {
            refs.alerts.innerHTML = state.visibleAlerts.map(alert => `
                <div class="deadwood-gui-alert kind-${alert.kind}">
                    <div class="deadwood-gui-alert-kind">${alert.kind}</div>
                    <div>${escapeHtml(alert.text)}</div>
                </div>
            `).join("");
        }

        function processAlertQueue() {
            if (state.visibleAlerts.length > 0) {
                return;
            }

            if (state.alertQueue.length === 0) {
                state.alertPopulateTimerId = null;
                return;
            }

            const alert = state.alertQueue.shift();
            state.visibleAlerts.push(alert);
            renderVisibleAlerts();
            state.alertDismissTimerIds[alert.id] = window.setTimeout(() => {
                state.visibleAlerts = state.visibleAlerts.filter(entry => entry.id !== alert.id);
                delete state.alertDismissTimerIds[alert.id];
                renderVisibleAlerts();
                if (state.alertPopulateTimerId) {
                    window.clearTimeout(state.alertPopulateTimerId);
                }
                state.alertPopulateTimerId = window.setTimeout(() => {
                    state.alertPopulateTimerId = null;
                    processAlertQueue();
                }, 1250);
            }, 5000);
        }

        if (!alerts.length) {
            state.lastAlertSignature = "";
            return;
        }

        if (signature === state.lastAlertSignature) {
            return;
        }

        const activeSignatures = new Set([
            ...state.visibleAlerts.map(alert => `${alert.kind}:${alert.text}`),
            ...state.alertQueue.map(alert => `${alert.kind}:${alert.text}`),
        ]);

        alerts.forEach(alert => {
            const alertSignature = `${alert.kind}:${alert.text}`;
            if (activeSignatures.has(alertSignature)) {
                return;
            }
            activeSignatures.add(alertSignature);
            state.alertQueue.push({
                id: state.nextAlertId,
                kind: alert.kind,
                text: alert.text,
            });
            state.nextAlertId += 1;
        });

        processAlertQueue();
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
        if (state.guiOnboarding.active) {
            refs.commandHint.textContent = "Complete the outfit sequence to begin issuing trail orders.";
            return;
        }

        if (!snapshot || !snapshot.active) {
            refs.commandHint.textContent = "Start a new GUI run or switch back to the terminal shell.";
            return;
        }

        if (snapshot.phase === "outfit" && snapshot.availableCommands.length === 0) {
            refs.commandHint.textContent = "The merchant is waiting on a quantity. Use Open Shell to type a number for now.";
            return;
        }

        if (snapshot.phase === "trade" && snapshot.availableCommands.length === 0) {
            refs.commandHint.textContent = "Pick how much to buy. Use Open Shell to type a number for now.";
            return;
        }

        if (snapshot.phase === "trade") {
            refs.commandHint.textContent = "Choose an offer in the trade modal.";
            return;
        }

        if (snapshot.phase === "outfit") {
            refs.commandHint.textContent = "Click a supply button to start a purchase. For numeric amounts, use Open Shell until buttons support them.";
            return;
        }

        refs.commandHint.textContent = state.promptVisible
            ? "Choose a command button below. Use Open Shell if you need to type a full command."
            : "The engine is resolving the last order.";
    }

    function renderCommandButtons(snapshot) {
        if (state.guiOnboarding.active || (snapshot && snapshot.phase === "trade")) {
            refs.commandButtons.innerHTML = "";
            return;
        }

        const models = commandButtonModels(snapshot);
        const bottomMeta = [];
        const primary = [];
        models.forEach(model => {
            if (model.command === "help" || model.command === "quit") {
                bottomMeta.push(model);
                return;
            }
            primary.push(model);
        });

        const primaryHtml = primary.map(model => `
            <button type="button" class="${model.cssClass}" data-command="${model.command}">${model.label}</button>
        `).join("");

        const bottomMetaHtml = bottomMeta.length
            ? `
                <div class="deadwood-gui-command-secondary">
                    ${bottomMeta.map(model => `
                        <button type="button" class="${model.cssClass} is-secondary-meta" data-command="${model.command}">${model.label}</button>
                    `).join("")}
                </div>
            `
            : "";

        refs.commandButtons.innerHTML = `${primaryHtml}${bottomMetaHtml}`;
    }

    function renderSnapshot(snapshot) {
        state.snapshot = snapshot;

        if (!snapshot) {
            return;
        }

        if (state.guiOnboarding.active && snapshot.phase !== "outfit") {
            state.guiOnboarding.active = false;
            renderOnboarding();
        }

        if (state.guiOnboarding.active && state.guiOnboarding.step !== "store" && snapshot.phase === "outfit") {
            state.guiOnboarding.startingCash = snapshot.items.cash;
            renderOnboarding();
        }

        setSummaryText(refs.week, snapshot.trail.week);
        setSummaryText(refs.miles, `${Math.min(snapshot.trail.miles, snapshot.trail.destinationMiles)}/${snapshot.trail.destinationMiles}`);
        refs.location.textContent = snapshot.location.current;
        refs.nextLocation.textContent = snapshot.location.next
            ? `${snapshot.location.next} (${snapshot.location.milesToNext} mi)`
            : "Destination Reached";

        const morale = snapshot.crew.morale;
        const fear = snapshot.crew.fear;

        // Dynamic "Mood Glow" for the D-shape hub
        let moodColor1 = "rgba(76, 175, 80, 0.25)"; // Default steady green glow
        let moodColor2 = "rgba(18, 40, 18, 0.95)";
        
        if (fear >= 70) {
            moodColor1 = "rgba(240, 58, 58, 0.35)"; // Dark crimson glow (High Fear)
            moodColor2 = "rgba(60, 10, 10, 0.95)";
        } else if (fear >= 40 || morale <= 30) {
            moodColor1 = "rgba(242, 208, 36, 0.25)"; // Amber/Orange glow (Worn/Shaken)
            moodColor2 = "rgba(60, 35, 10, 0.95)";
        } else if (morale >= 70) {
            moodColor1 = "rgba(118, 227, 70, 0.35)"; // Brighter green glow (High Morale)
            moodColor2 = "rgba(25, 60, 25, 0.95)";
        }

        refs.crewHub.style.background = `
            radial-gradient(circle at 34% 18%, rgba(255, 255, 255, 0.08), transparent 17%),
            linear-gradient(180deg, ${moodColor1}, ${moodColor2})
        `;
        refs.crewHub.style.setProperty("--crew-morale-deg", `${clamp(morale, 0, 100) * 0.9}deg`);
        refs.crewHub.style.setProperty("--crew-fear-deg", `${clamp(fear, 0, 100) * 0.9}deg`);
        refs.crewHub.style.setProperty("--crew-hub-core", moodColor2);
        refs.crewHub.innerHTML = `
            <div class="deadwood-gui-crew-hub-metrics" aria-label="Crew totals">
                <div class="deadwood-gui-crew-hub-metric is-morale">
                    <span>Morale</span>
                    <strong>${morale}</strong>
                </div>
                <div class="deadwood-gui-crew-hub-metric is-fear">
                    <span>Fear</span>
                    <strong>${fear}</strong>
                </div>
            </div>
        `;

        refs.cattleAmount.textContent = `${snapshot.cattle.amount}`;
        refs.cattleStats.innerHTML = [
            buildStatRowWithStatus(
                "Health",
                snapshot.cattle.health,
                snapshot.cattle.conditionLabel,
                normalizeHerdTone(snapshot.cattle.conditionTone),
                "fill-health",
                snapshot.cattle.health,
                snapshot.cattle.health <= 40,
                false
            ),
            buildStatRowWithStatus(
                "Stress",
                snapshot.cattle.stress,
                snapshot.cattle.stressLabel,
                normalizeHerdTone(snapshot.cattle.stressTone),
                "fill-fear",
                snapshot.cattle.stress,
                false,
                snapshot.cattle.stress >= 70
            ),
            buildStatRow(
                "Fatigue",
                `${snapshot.cattle.fatigue}`,
                "fill-hunger",
                snapshot.cattle.fatigue,
                false,
                snapshot.cattle.fatigue >= 70
            ),
            buildStatRow(
                "Blight",
                `${snapshot.cattle.blight}`,
                "fill-structure",
                snapshot.cattle.blight,
                false,
                snapshot.cattle.blight >= 70
            )
        ].join("");

        refs.wagonMeters.innerHTML = [
            buildStatRow("Structure", snapshot.wagon.structure, "fill-structure", snapshot.wagon.structure, snapshot.wagon.structure <= 40, false),
            buildStatRow("Sanctity", snapshot.wagon.sanctity, "fill-sanctity", snapshot.wagon.sanctity, snapshot.wagon.sanctity <= 15, false)
        ].join("");

        renderItems(snapshot);
        renderCrewCards(snapshot);
        renderAlerts(snapshot);
        renderReportLog();
        renderCommandButtons(snapshot);
        updateCommandHint(snapshot);
        renderMarketModal(snapshot);
        renderEndGameModal(snapshot);

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

        state.latestReportLines = [];
        state.captureReportBlock = true;
        renderReportLog();
        return App.deadwood.handleInput(input);
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
            const wagonX = width * 0.74;
            const wagonY = height * 0.55;
            this.wagon.setPosition(wagonX, wagonY);
            this.cattle.setPosition(width * 0.55, height * 0.56);
            setWagonMeterAnchor(wagonX, wagonY);
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
        if (refs.wagonMeters) {
            setWagonMeterAnchor(refs.canvas.clientWidth * 0.74, refs.canvas.clientHeight * 0.55);
        }
        updateCrewWheelScale();
    }

    function updateCrewWheelScale() {
        if (!refs.crewWheelPanel || !refs.underbar || !refs.reportPanel) {
            return;
        }

        const baseScale = 0.6875;
        const compactScale = window.innerHeight <= 780 ? 0.54 : window.innerHeight <= 900 ? 0.62 : baseScale;
        const minScale = window.innerWidth <= 720 ? 0.5 : 0.42;
        const top = refs.underbar.getBoundingClientRect().top;
        const reportTop = refs.reportPanel.getBoundingClientRect().top;
        const availableHeight = Math.max(0, reportTop - top - 8);
        const maxAllowedScale = availableHeight > 0 ? Math.min(baseScale, availableHeight / 352) : baseScale;
        const nextScale = clamp(Math.min(compactScale, maxAllowedScale), minScale, baseScale);
        refs.crewWheelPanel.style.setProperty("--crew-wheel-scale", `${nextScale}`);
        if (state.openCrewId !== null) {
            positionCrewDetailNearWheel();
        }
    }

    function positionCrewDetailNearWheel() {
        if (!refs.crewDetail || !refs.crewWheelPanel || !refs.stage) {
            return;
        }

        const stageRect = refs.stage.getBoundingClientRect();
        const wheelRect = refs.crewWheelPanel.getBoundingClientRect();
        const detailStyles = window.getComputedStyle(refs.crewDetail);
        const detailScale = Number.parseFloat(detailStyles.getPropertyValue("--crew-detail-scale")) || 1;
        const detailWidth = refs.crewDetail.offsetWidth * detailScale;
        const detailHeight = refs.crewDetail.offsetHeight * detailScale;
        const gutter = 10;
        const edgePadding = 8;

        let left = wheelRect.right - stageRect.left + gutter;
        const maxLeft = stageRect.width - detailWidth - edgePadding;
        left = clamp(left, edgePadding, Math.max(edgePadding, maxLeft));

        let top = wheelRect.top - stageRect.top;
        const maxTop = stageRect.height - detailHeight - edgePadding;
        top = clamp(top, edgePadding, Math.max(edgePadding, maxTop));

        refs.crewDetail.style.left = `${Math.round(left)}px`;
        refs.crewDetail.style.top = `${Math.round(top)}px`;
        refs.crewDetail.style.bottom = "auto";
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

    function buildStatRowWithStatus(label, valueNum, statusRaw, statusTone, fillClass, pct, isLow, isHigh) {
        const dangerClass = isLow ? " is-low" : isHigh ? " is-high" : "";
        const pillText = titleCaseStatus(statusRaw);
        const ariaValue = `${valueNum} ${pillText}`;
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
                    <span class="deadwood-crew-detail-stat-value deadwood-gui-stat-value-with-badge" aria-label="${escapeHtml(ariaValue)}">
                        <span class="deadwood-gui-stat-value-num">${escapeHtml(String(valueNum))}</span>
                        <span class="deadwood-crew-detail-status-badge tone-${statusTone}">${escapeHtml(pillText)}</span>
                    </span>
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
        window.requestAnimationFrame(positionCrewDetailNearWheel);
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

        if (!state.guiOnboarding.active || state.presentationMode !== "gui") {
            return;
        }

        if (event.key !== " " && event.code !== "Space") {
            return;
        }

        const target = event.target;
        if (target && target.closest && target.closest(".deadwood-gui-store")) {
            return;
        }

        event.preventDefault();
        if (state.guiOnboarding.step === "intro-1") {
            state.guiOnboarding.step = "intro-2";
            renderOnboarding();
            return;
        }

        if (state.guiOnboarding.step === "intro-2") {
            state.guiOnboarding.step = "store";
            renderOnboarding();
        }
    });

    refs.commandButtons.addEventListener("click", event => {
        if (state.guiOnboarding.active) {
            return;
        }

        const button = event.target.closest("button[data-command]");
        if (!button) {
            return;
        }

        submitGuiCommand(button.dataset.command);
    });

    refs.stage.addEventListener("click", async event => {
        if (!state.guiOnboarding.active || state.guiOnboarding.step !== "store" || state.guiOnboarding.submitting) {
            return;
        }

        const actionButton = event.target.closest("button[data-store-action]");
        if (actionButton) {
            const item = storeCatalog.find(entry => entry.key === actionButton.dataset.storeItem);
            if (!item) {
                return;
            }

            const current = state.guiOnboarding.selections[item.key] || 0;
            const minimumQuantity = state.guiOnboarding.baseQuantities[item.key] || 0;
            if (actionButton.dataset.storeAction === "dec") {
                state.guiOnboarding.selections[item.key] = Math.max(minimumQuantity, current - 1);
                renderOnboardingStore();
                return;
            }

            if (actionButton.dataset.storeAction === "inc" && onboardingRemainingCash() >= item.price) {
                state.guiOnboarding.selections[item.key] = current + 1;
                renderOnboardingStore();
            }
            return;
        }

        if (!event.target.closest("#deadwood-gui-store-start")) {
            return;
        }

        state.guiOnboarding.submitting = true;
        state.guiOnboarding.active = false;
        renderOnboarding();

        for (const item of storeCatalog) {
            const selectedQuantity = state.guiOnboarding.selections[item.key] || 0;
            const baseQuantity = state.guiOnboarding.baseQuantities[item.key] || 0;
            const quantityToBuy = Math.max(0, selectedQuantity - baseQuantity);
            if (quantityToBuy > 0) {
                await submitGuiCommand(`buy ${item.command} ${quantityToBuy}`);
            }
        }

        await submitGuiCommand("start");
    });

    refs.stage.addEventListener("click", event => {
        if (event.target.closest("#deadwood-gui-endgame-close")) {
            if (refs.endgameModal) {
                refs.endgameModal.hidden = true;
            }
            refs.gui.classList.remove("is-endgame-open");
            return;
        }

        const acquireButton = event.target.closest("button[data-market-command]");
        if (acquireButton) {
            submitGuiCommand(acquireButton.dataset.marketCommand);
            return;
        }

        if (event.target.closest("#deadwood-gui-market-back")) {
            submitGuiCommand("back");
        }
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

    window.addEventListener("deadwood:ui-snapshot", () => {
        window.requestAnimationFrame(updateCrewWheelScale);
    });

    let resumedFromRefresh = false;
    if (App.deadwood && typeof App.deadwood.resumeSavedRun === "function") {
        resumedFromRefresh = App.deadwood.resumeSavedRun();
    }

    if (resumedFromRefresh && App.deadwood && App.deadwood.getUiSnapshot) {
        const restoredSnapshot = App.deadwood.getUiSnapshot();
        const restoredMode = restoredSnapshot && restoredSnapshot.active && restoredSnapshot.renderMode === "gui"
            ? "gui"
            : "launcher";
        setPresentation(restoredMode);
        syncSnapshot();
        if (restoredMode === "gui") {
            if (restoredSnapshot && restoredSnapshot.phase === "outfit") {
                resetGuiOnboarding(restoredSnapshot);
            }
            setBanner("Resumed your previous run after refresh.");
        }
    } else {
        setPresentation("launcher");
        setBanner("Choose the shell or the graphical trail view.");
    }

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
