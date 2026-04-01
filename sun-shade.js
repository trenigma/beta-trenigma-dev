/**
 * sun-shade.js
 * BETA — beta.trenigma.dev
 *
 * Real-time sun/shade calculations for crag walls.
 * Solar position math based on SunCalc by Vladimir Agafonkin (MIT license).
 *
 * Requires crag-meta.js loaded first (needs lat, lng, sun_bearing).
 *
 * USAGE:
 *   Include after crag-meta.js in any tools/*.html page:
 *     <script src="../crag-meta.js"></script>
 *     <script src="../sun-shade.js"></script>
 *
 *   Then call after renderCragMeta():
 *     renderSunShade(CRAG_ID);
 *
 * BEHAVIOR:
 *   - Crags with sun_bearing: shows "in sun" / "in shade" + next transition time
 *   - Crags without sun_bearing (Mixed): shows sun compass position + sunset time
 *   - Auto-refreshes every 5 minutes
 *   - All times displayed in Pacific time (all BETA crags are PT)
 */

(function () {
  'use strict';

  // ============================================================
  // SOLAR POSITION MATH
  // Based on SunCalc by Vladimir Agafonkin — BSD 2-Clause license
  // https://github.com/mourner/suncalc
  // ============================================================

  var RAD = Math.PI / 180;
  var DAY_MS = 1000 * 60 * 60 * 24;
  var J1970 = 2440588;
  var J2000 = 2451545;
  var OBLIQUITY = 23.4397 * RAD;

  function toJulian(date) { return date.valueOf() / DAY_MS - 0.5 + J1970; }
  function toDays(date) { return toJulian(date) - J2000; }

  function solarMeanAnomaly(d) { return (357.5291 + 0.98560028 * d) * RAD; }

  function eclipticLongitude(M) {
    var C = (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * RAD;
    return M + C + 102.9372 * RAD + Math.PI;
  }

  function sunCoords(d) {
    var M = solarMeanAnomaly(d);
    var L = eclipticLongitude(M);
    return {
      dec: Math.asin(Math.sin(OBLIQUITY) * Math.sin(L)),
      ra: Math.atan2(Math.sin(L) * Math.cos(OBLIQUITY), Math.cos(L))
    };
  }

  function siderealTime(d, lw) {
    return (280.16 + 360.9856235 * d) * RAD - lw;
  }

  /**
   * Get sun position for a given date and location.
   * Returns { altitude, bearing } in degrees.
   *   altitude: degrees above horizon (negative = below)
   *   bearing:  compass degrees from north (0=N, 90=E, 180=S, 270=W)
   */
  function getSunPosition(date, lat, lng) {
    var lw = -lng * RAD;
    var phi = lat * RAD;
    var d = toDays(date);
    var c = sunCoords(d);
    var H = siderealTime(d, lw) - c.ra;

    var sinPhi = Math.sin(phi);
    var cosPhi = Math.cos(phi);
    var sinDec = Math.sin(c.dec);
    var cosDec = Math.cos(c.dec);
    var cosH = Math.cos(H);

    var altitude = Math.asin(sinPhi * sinDec + cosPhi * cosDec * cosH);
    var azimuth = Math.atan2(Math.sin(H), cosH * sinPhi - Math.tan(c.dec) * cosPhi);

    return {
      altitude: altitude / RAD,
      bearing: (azimuth / RAD + 180 + 360) % 360
    };
  }

  // ============================================================
  // SUN / SHADE LOGIC
  // ============================================================

  /**
   * Is the wall in direct sun?
   * A wall is "in sun" when the sun is above the horizon AND within
   * 90 degrees of the wall's outward-facing bearing.
   *
   * Analogy: stand at the base looking outward from the wall.
   * If you can see the sun in your field of view (180 degrees wide),
   * the wall is getting hit.
   */
  function isWallInSun(sunBearing, sunAltitude, wallBearing) {
    if (sunAltitude <= 0) return false;
    var delta = Math.abs(sunBearing - wallBearing);
    if (delta > 180) delta = 360 - delta;
    return delta < 90;
  }

  /**
   * Convert compass bearing to cardinal direction string.
   */
  function bearingToCardinal(bearing) {
    var dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(((bearing % 360) + 360) % 360 / 22.5) % 16];
  }

  /**
   * Step forward in time to find when sun/shade status flips.
   * Returns a Date or null if no transition within 24h.
   */
  function findNextTransition(now, lat, lng, wallBearing, currentlyInSun) {
    var STEP = 5 * 60 * 1000; // 5 minutes
    var MAX_STEPS = 288;      // 24 hours
    var t = now.getTime();

    for (var i = 0; i < MAX_STEPS; i++) {
      t += STEP;
      var pos = getSunPosition(new Date(t), lat, lng);
      var inSun = isWallInSun(pos.bearing, pos.altitude, wallBearing);
      if (inSun !== currentlyInSun) {
        return new Date(t);
      }
    }
    return null;
  }

  /**
   * Find sunset (or sunrise if sun is already down).
   * Returns { type: 'sunset'|'sunrise', time: Date } or null.
   */
  function findSunEvent(now, lat, lng) {
    var STEP = 5 * 60 * 1000;
    var MAX_STEPS = 288;
    var t = now.getTime();
    var currentAlt = getSunPosition(now, lat, lng).altitude;
    var sunUp = currentAlt > 0;
    var lookingFor = sunUp ? 'sunset' : 'sunrise';

    for (var i = 0; i < MAX_STEPS; i++) {
      t += STEP;
      var alt = getSunPosition(new Date(t), lat, lng).altitude;
      if (sunUp && alt <= 0) return { type: 'sunset', time: new Date(t) };
      if (!sunUp && alt > 0) return { type: 'sunrise', time: new Date(t) };
    }
    return null;
  }

  // ============================================================
  // TIME FORMATTING
  // ============================================================

  /**
   * Format time in Pacific timezone.
   * All BETA crags (Cascades, Central OR, Squamish) are in Pacific time.
   */
  function formatTime(date) {
    try {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Los_Angeles'
      });
    } catch (e) {
      // Fallback if timezone not supported
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  }

  // ============================================================
  // STYLES
  // ============================================================

  function injectStyles() {
    if (document.getElementById('sun-shade-styles')) return;
    var style = document.createElement('style');
    style.id = 'sun-shade-styles';
    style.textContent = [
      '.sun-shade {',
      '  margin: var(--space-md, 1rem) 0;',
      '  padding: var(--space-md, 1rem);',
      '  background: var(--clr-surface, rgba(255,255,255,0.03));',
      '  border: 1px solid var(--clr-border, rgba(255,255,255,0.08));',
      '  border-radius: var(--radius, 8px);',
      '}',
      '.sun-shade__label {',
      '  font-size: 0.75rem;',
      '  font-weight: 600;',
      '  letter-spacing: 0.05em;',
      '  text-transform: uppercase;',
      '  color: var(--clr-muted, #888);',
      '  margin-bottom: var(--space-sm, 0.5rem);',
      '}',
      '.sun-shade__status {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 0.5rem;',
      '  font-size: 1rem;',
      '  line-height: 1.4;',
      '}',
      '.sun-shade__icon {',
      '  font-size: 1.25rem;',
      '}',
      '.sun-shade__transition {',
      '  margin-top: var(--space-xs, 0.25rem);',
      '  padding-left: 2rem;',
      '  font-size: 0.875rem;',
      '  color: var(--clr-muted, #888);',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  // ============================================================
  // UI RENDERING
  // ============================================================

  var refreshTimer = null;

  function renderSunShade(cragId) {
    var meta = (typeof CRAG_META !== 'undefined') ? CRAG_META[cragId] : null;
    if (!meta || meta.lat == null || meta.lng == null) return;

    injectStyles();

    var now = new Date();
    var sunPos = getSunPosition(now, meta.lat, meta.lng);
    var sunUp = sunPos.altitude > 0;
    var html = '';

    html += '<div class="sun-shade">';
    html += '<div class="sun-shade__label">Sun exposure</div>';

    if (meta.sun_bearing != null) {
      // ---- SINGLE-ASPECT CRAG: sun/shade verdict ----
      var inSun = isWallInSun(sunPos.bearing, sunPos.altitude, meta.sun_bearing);
      var icon = inSun ? '☀️' : '🌑';
      var status = inSun ? 'in sun' : 'in shade';

      html += '<div class="sun-shade__status">';
      html += '<span class="sun-shade__icon">' + icon + '</span>';
      html += '<span>' + meta.aspect + '-facing wall currently <strong>' + status + '</strong></span>';
      html += '</div>';

      if (sunUp) {
        var transition = findNextTransition(now, meta.lat, meta.lng, meta.sun_bearing, inSun);
        if (transition) {
          var verb = inSun ? 'Enters shade' : 'Gets sun';
          html += '<div class="sun-shade__transition">' + verb + ' around ' + formatTime(transition) + '</div>';
        }
        var sunset = findSunEvent(now, meta.lat, meta.lng);
        if (sunset) {
          html += '<div class="sun-shade__transition">Sunset around ' + formatTime(sunset.time) + '</div>';
        }
      } else {
        var sunrise = findSunEvent(now, meta.lat, meta.lng);
        if (sunrise) {
          html += '<div class="sun-shade__transition">Sunrise around ' + formatTime(sunrise.time) + '</div>';
        }
      }

    } else {
      // ---- MIXED-ASPECT CRAG: show sun position ----
      if (sunUp) {
        var cardinal = bearingToCardinal(sunPos.bearing);
        var alt = Math.round(sunPos.altitude);

        html += '<div class="sun-shade__status">';
        html += '<span class="sun-shade__icon">☀️</span>';
        html += '<span>Sun is to the <strong>' + cardinal + '</strong> at ' + alt + '° elevation</span>';
        html += '</div>';

        var sunset = findSunEvent(now, meta.lat, meta.lng);
        if (sunset) {
          html += '<div class="sun-shade__transition">Sunset around ' + formatTime(sunset.time) + '</div>';
        }
      } else {
        html += '<div class="sun-shade__status">';
        html += '<span class="sun-shade__icon">🌑</span>';
        html += '<span>Sun is below the horizon</span>';
        html += '</div>';

        var sunrise = findSunEvent(now, meta.lat, meta.lng);
        if (sunrise) {
          html += '<div class="sun-shade__transition">Sunrise around ' + formatTime(sunrise.time) + '</div>';
        }
      }
    }

    html += '</div>';

    // ---- INSERT INTO PAGE ----
    var target = document.getElementById('sunShadeDisplay');
    if (!target) {
      // Auto-create container after the crag info section
      var infoDisplay = document.getElementById('cragInfoDisplay');
      if (infoDisplay) {
        target = document.createElement('div');
        target.id = 'sunShadeDisplay';
        infoDisplay.parentNode.insertBefore(target, infoDisplay.nextSibling);
      }
    }
    if (target) target.innerHTML = html;

    // ---- AUTO-REFRESH every 5 minutes ----
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(function () {
      renderSunShade(cragId);
    }, 5 * 60 * 1000);
  }

  // Expose globally
  window.renderSunShade = renderSunShade;

})();