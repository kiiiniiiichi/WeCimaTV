// ==UserScript==
// @name         Wecima Tube - TV Navigation + Adblock
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  TV remote navigation + basic ad-blocking for Wecima.tube on smart TVs or desktop browsers.
// @author       OpenAI
// @match        *://wecima.tube/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Inject TV-optimized CSS
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-size: 1.5rem !important;
            line-height: 1.6 !important;
            background-color: #000 !important;
        }

        a, button, .movie, .video-item, [tabindex] {
            outline: none !important;
            cursor: pointer !important;
        }

        a, button, .movie, .video-item {
            tabindex: 0 !important;
        }

        a:focus, button:focus, .movie:focus, .video-item:focus, [tabindex]:focus {
            outline: 4px solid #00aced !important;
            outline-offset: -4px;
            z-index: 9999 !important;
            transform: scale(1.05);
            transition: transform 0.2s ease, outline 0.2s ease;
        }

        .movie, .video-item {
            margin: 10px !important;
            width: 220px !important;
            height: auto !important;
        }

        .navbar a, .nav-link, .menu-item {
            font-size: 1.6rem !important;
            padding: 10px 20px !important;
            background-color: #111 !important;
            border-radius: 10px;
        }

        .navbar a:focus, .nav-link:focus, .menu-item:focus {
            background-color: #00aced !important;
            color: #fff !important;
        }

        /* Ad hiding rules */
        .adsbygoogle,
        .ad-banner,
        .ad-container,
        .ad-slot,
        .popup-overlay,
        .popup-ad,
        iframe[src*="ads"],
        iframe[src*="doubleclick"],
        script[src*="ads"],
        div[id*="ad"],
        div[class*="ad"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // Basic ad cleanup function
    function removeAds() {
        const adSelectors = [
            'iframe[src*="ads"]',
            'iframe[src*="doubleclick"]',
            'script[src*="ads"]',
            '[id*="ad"]',
            '[class*="ad"]',
            '.popup-overlay',
            '.popup-ad',
            '.ad-banner',
            '.adsbygoogle'
        ];
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    // Initial ad cleanup + periodic cleanup
    setInterval(removeAds, 2000); // Clean every 2 seconds

    // TV remote navigation
    const SELECTORS = 'a, button, .movie, .video-item, [tabindex]:not([tabindex="-1"])';
    let focusables = [];
    let currentIndex = 0;

    function updateFocusableElements() {
        focusables = Array.from(document.querySelectorAll(SELECTORS))
            .filter(el => el.offsetParent !== null);
    }

    function focusCurrent() {
        if (focusables[currentIndex]) {
            focusables[currentIndex].focus();
        }
    }

    function moveFocus(direction) {
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % focusables.length;
        } else if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + focusables.length) % focusables.length;
        }
        focusCurrent();
    }

    window.addEventListener('keydown', (e) => {
        if (!focusables.length) updateFocusableElements();

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                moveFocus('next');
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                moveFocus('prev');
                e.preventDefault();
                break;
            case 'Enter':
                if (document.activeElement) {
                    document.activeElement.click();
                }
                break;
            case 'Backspace':
            case 'Escape':
                window.history.back();
                break;
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        updateFocusableElements();
        focusCurrent();
        removeAds();
    });
})();
