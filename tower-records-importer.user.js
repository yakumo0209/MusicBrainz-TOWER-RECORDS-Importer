// ==UserScript==
// @name         MusicBrainz: TOWER RECORDS ONLINE Importer
// @version      1.0
// @match        https://tower.jp/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    function text(el) { return el ? el.textContent.trim() : ''; }

    function getJSONLD() {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const s of scripts) {
            try {
                const json = JSON.parse(s.textContent);
                if (Array.isArray(json)) {
                    for (const item of json) if (item['@type'] === 'Product') return item;
                }
                if (json['@type'] === 'Product') return json;
            } catch (e) {}
        }
        return null;
    }

    function parseDate(str) {
        if (!str) return {};
        const m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return {};
        return { year: m[1], month: m[2], day: m[3] };
    }

    function getArtist(json) {
        return json?.byArtist?.name || text(document.querySelector('a[href*="/artist/"]')) || '';
    }

    function getCatalogNumber() {
        const tdList = document.querySelectorAll('td.TOL-item-info-PC-tab-basic-info-table-column');
        for (const td of tdList) {
            if (td.textContent.includes('規格品番')) {
                return td.nextElementSibling?.textContent.trim() || '';
            }
        }
        return '';
    }

    function parseLengthToMs(lengthStr) {
        const parts = lengthStr.split(':').map(p => parseInt(p, 10));
        if (parts.length === 2) return (parts[0]*60 + parts[1]) * 1000;
        if (parts.length === 3) return (parts[0]*3600 + parts[1]*60 + parts[2]) * 1000;
        return undefined;
    }

    // メディアごとに分けてトラック取得
    function getMediaList() {
        const mediaSpans = document.querySelectorAll('.text-size-16.is-bold');
        const mediaList = [];

        mediaSpans.forEach((span) => {
            const match = span.textContent.match(/^\d+\.\[(.+?)\]/);
            if (!match) return;
            let format = match[1].trim();

            // 変換処理
            if (format === 'CDシングル') format = 'CD';
            if (format === 'CDアルバム') format = 'CD';
            if (format === 'DVD') format = 'DVD-Video';
            if (format === 'Blu-ray Disc') format = 'Blu-ray';
            if (format === '書籍') format = null;
            if (format === 'グッズ') format = null;


            // 直下の ol > li からトラック取得
            const mediumLi = span.closest('li')?.querySelectorAll('ol > li.TOL-item-info-PC-tab-recorded-contents-list-track-item');
            if (!mediumLi) return;

            const tracks = [];
            mediumLi.forEach((li) => {
                const titleEl = li.querySelector('.TOL-item-info-PC-tab-recorded-contents-list-track-title');
                const lengthEl = li.querySelector('.TOL-item-info-PC-tab-recorded-contents-list-track-length');
                if (!titleEl) return;
                const title = titleEl.textContent.trim();
                const lengthMs = lengthEl ? parseLengthToMs(lengthEl.textContent.trim()) : undefined;
                tracks.push({ title, lengthMs });
            });

            mediaList.push({ format, tracks });
        });

        return mediaList;
    }

    function buildForm(data) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://musicbrainz.org/release/add';
        form.target = '_blank';

        function add(name, value) {
            if (!value) return;
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        }

        add('name', data.title);
        add('artist_credit.names.0.name', data.artist);
        add('artist_credit.names.0.artist.name', data.artist);

        add('events.0.date.year', data.date.year);
        add('events.0.date.month', data.date.month);
        add('events.0.date.day', data.date.day);
        add('events.0.country', 'JP');

        add('status', 'official');
        add('labels.0.name', data.label);
        add('labels.0.catalog_number', data.catalogNumber);
        if (data.barcode) add('barcode', data.barcode);

        // メディアごとにトラック追加
        data.media.forEach((medium, mi) => {
            add(`mediums.${mi}.format`, medium.format);
            medium.tracks.forEach((t, i) => {
                add(`mediums.${mi}.track.${i}.name`, t.title);
                add(`mediums.${mi}.track.${i}.artist_credit.names.0.name`, data.artist);
                if (t.lengthMs) add(`mediums.${mi}.track.${i}.length`, t.lengthMs);
            });
        });

        add('urls.0.url', location.href);
        add('urls.0.link_type', 79);

        add('edit_note', `Imported with TOWER RECORDS ONLINE Importer (https://github.com/yakumo0209/MusicBrainz-TOWER-RECORDS-Importer/blob/main/tower-records-importer.user.js).
Data from ${location.href}.`);

        document.body.appendChild(form);
        form.submit();
    }

    function createButton(data) {
        const btn = document.createElement('button');
        btn.textContent = 'Import to MB';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '50px',
            right: '50px',
            zIndex: '99999',
            padding: '10px 14px',
            background: '#ff6600',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        btn.onclick = () => buildForm(data);
        document.body.appendChild(btn);
    }

    function init() {
        const json = getJSONLD();
        const data = {
            title: json?.name || text(document.querySelector('h1')),
            artist: getArtist(json),
            date: parseDate(json?.releaseDate),
            label: json?.brand?.name || '',
            catalogNumber: getCatalogNumber(),
            barcode: json?.sku || '',
            media: getMediaList()
        };

        createButton(data);
    }

    // Load + 2.5秒遅延で確実にDOM取得
    window.addEventListener('load', () => setTimeout(init, 2500));
})();
