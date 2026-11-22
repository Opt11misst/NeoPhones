/* =========================================================
   theme.js - перемикач світлої / темної теми (ЛР №1)

   Підключення: в <head> КОЖНОЇ сторінки, ПІСЛЯ усіх css:
     <link rel="stylesheet" href="theme.css">
     <script src="theme.js"></script>

   Що робить:
   1. Одразу (до малювання сторінки) ставить html[data-theme] зі
      збереженого вибору - тому не буде "миготіння" світлою темою.
   2. Додає повзунок у кінець <nav class="bottom_info">.
   3. Запам'ятовує вибір у localStorage (ключ спільний з магазином).
   ========================================================= */
(function () {
    'use strict';

    var KEY = 'neophones-theme';
    var root = document.documentElement;

    function read() {
        try { return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'; }
        catch (e) { return 'light'; }
    }

    function save(value) {
        try { localStorage.setItem(KEY, value); } catch (e) { /* без збереження теж працює */ }
    }

    var theme = read();
    root.setAttribute('data-theme', theme);          // до першого малювання

    var SUN = '<svg class="theme-ico theme-ico--sun" viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="4.2" fill="currentColor"/>' +
        '<g stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
        '<path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7"/>' +
        '</g></svg>';

    var MOON = '<svg class="theme-ico theme-ico--moon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M20.6 14.2A8.6 8.6 0 1 1 9.8 3.4a7 7 0 0 0 10.8 10.8z" fill="currentColor"/></svg>';

    function apply(next, animate) {
        if (animate) {
            root.classList.add('theme-anim');
            setTimeout(function () { root.classList.remove('theme-anim'); }, 500);
        }
        theme = next;
        root.setAttribute('data-theme', next);
        var switches = document.querySelectorAll('.theme-switch');
        for (var i = 0; i < switches.length; i++) {
            switches[i].setAttribute('aria-checked', next === 'dark' ? 'true' : 'false');
        }
    }

    function build() {
        var nav = document.querySelector('nav.bottom_info');
        if (!nav || nav.querySelector('.theme-toggle')) return;

        var box = document.createElement('div');
        box.className = 'theme-toggle';
        box.innerHTML =
            '<button class="theme-toggle__icon" type="button" aria-label="Тема оформлення" ' +
                'aria-expanded="false" aria-controls="theme-pop">' + SUN + MOON + '</button>' +
            '<div class="theme-toggle__pop" id="theme-pop">' +
                '<span class="theme-toggle__label">Темна тема</span>' +
                '<button class="theme-switch" type="button" role="switch" aria-label="Темна тема" ' +
                    'aria-checked="' + (theme === 'dark') + '">' +
                    '<span class="theme-switch__knob">' + SUN + MOON + '</span>' +
                '</button>' +
            '</div>';
        nav.appendChild(box);

        var icon = box.querySelector('.theme-toggle__icon');
        var sw = box.querySelector('.theme-switch');

        function setOpen(open) {
            box.classList.toggle('is-open', open);
            icon.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        sw.addEventListener('click', function () {
            var next = theme === 'dark' ? 'light' : 'dark';
            apply(next, true);
            save(next);
        });

        // на телефоні повзунок "вилазить" після натискання на іконку
        icon.addEventListener('click', function () { setOpen(!box.classList.contains('is-open')); });
        document.addEventListener('click', function (e) {
            if (!box.contains(e.target)) setOpen(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    // вибір, зроблений в іншій вкладці / на іншій сторінці
    window.addEventListener('storage', function (e) {
        if (e.key === KEY) apply(e.newValue === 'dark' ? 'dark' : 'light', true);
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
    else build();
})();
