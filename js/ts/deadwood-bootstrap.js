"use strict";
(() => {
    const root = window;
    const variant = "Deadwood Trail";
    root.DeadwoodTrail = {
        variant,
        tsBootstrapLoadedAt: new Date().toISOString(),
        upstreamShell: "attilabuti/Oregon-Trail-Browser",
        uiPlan: "Keep terminal-style MVP; revisit fuller GUI after mechanics are validated.",
    };
    document.documentElement.dataset.variant = "deadwood-trail";
    document.title = variant;
    const badge = document.createElement("div");
    badge.id = "deadwood-bootstrap-badge";
    badge.textContent = "Deadwood Trail TS bootstrap active";
    const style = document.createElement("style");
    style.textContent = `
        #deadwood-bootstrap-badge {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 50;
            padding: 6px 10px;
            border: 1px solid rgba(204, 204, 238, 0.35);
            background: rgba(20, 20, 20, 0.88);
            color: #cce;
            font: 12px/1.2 monospace;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            box-shadow: 0 0 18px rgba(0, 0, 0, 0.35);
            pointer-events: none;
        }

        @media (max-width: 700px) {
            #deadwood-bootstrap-badge {
                top: auto;
                right: 8px;
                bottom: 8px;
                left: 8px;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(badge);
    console.info("[Deadwood Trail] TypeScript bootstrap loaded.");
})();
//# sourceMappingURL=deadwood-bootstrap.js.map