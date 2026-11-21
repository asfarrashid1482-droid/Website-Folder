/**
 * Angels Beauty Corner - Interactive Engine
 * Standard: ECMAScript 5 (ES5) - Strict Mode
 * Currency: PKR / Rs. (Pakistani Rupee)
 * Features:
 *   - Dual-Mode Booking Engine (Salon Studio & VIP Home Concierge)
 *   - Service Selection & Prefill Scroll with PKR pricing
 *   - Live Pricing & Stylist Tier Calculations
 *   - Cosmetic Shopping Cart with PKR formatting
 */
(function () {
    'use strict';

    // Application state
    var bookingState = {
        mode: 'salon',
        serviceName: 'Bridal Makeup',
        basePrice: 18000,
        duration: '180 min',
        tierPrice: 0,
        tierName: 'Lead Bridal Artist',
        timeSlot: '10:00 AM',
        date: '2025-05-15'
    };

    var cart = {
        count: 0,
        subtotal: 0,
        items: []
    };

    // ES5 Helper: Format price with commas for PKR / Rs.
    function formatPrice(amount) {
        var val = Math.round(Number(amount) || 0);
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // ES5 Helper: Case-insensitive substring check
    function strContains(str, substr) {
        if (!str || !substr) {
            return false;
        }
        return String(str).toLowerCase().indexOf(String(substr).toLowerCase()) !== -1;
    }

    // ES5 Helper: Safe smooth scrolling into view
    function scrollToSection(targetId) {
        var el = document.getElementById(targetId);
        if (el) {
            if (typeof el.scrollIntoView === 'function') {
                try {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } catch (err) {
                    el.scrollIntoView(true);
                }
            } else {
                window.location.hash = '#' + targetId;
            }
        }
    }

    // Switch between Salon Studio & VIP Home Concierge
    function switchBookingMode(mode) {
        bookingState.mode = mode;
        var salonBtn = document.getElementById('tab-salon-btn');
        var homeBtn = document.getElementById('tab-home-btn');
        var homeFields = document.getElementById('home-service-fields');
        var summaryBadge = document.getElementById('summary-mode-badge');
        var travelFeeRow = document.getElementById('summary-travel-fee-row');

        if (mode === 'home') {
            if (homeBtn) {
                homeBtn.className = 'px-space-lg py-space-xs rounded-full font-label-md text-label-md transition-all duration-300 bg-primary text-on-primary shadow-sm flex items-center gap-space-xs';
            }
            if (salonBtn) {
                salonBtn.className = 'px-space-lg py-space-xs rounded-full font-label-md text-label-md transition-all duration-300 text-on-surface-variant hover:text-primary flex items-center gap-space-xs';
            }
            if (homeFields) {
                homeFields.className = homeFields.className.replace(/\bhidden\b/g, '').trim() + ' flex';
            }
            if (summaryBadge) {
                summaryBadge.textContent = 'Home Concierge';
                summaryBadge.className = 'font-label-sm text-label-sm px-space-sm py-0.5 rounded-full bg-primary text-on-primary uppercase font-bold';
            }
            if (travelFeeRow) {
                travelFeeRow.style.display = 'flex';
            }
        } else {
            if (salonBtn) {
                salonBtn.className = 'px-space-lg py-space-xs rounded-full font-label-md text-label-md transition-all duration-300 bg-primary text-on-primary shadow-sm flex items-center gap-space-xs';
            }
            if (homeBtn) {
                homeBtn.className = 'px-space-lg py-space-xs rounded-full font-label-md text-label-md transition-all duration-300 text-on-surface-variant hover:text-primary flex items-center gap-space-xs';
            }
            if (homeFields) {
                if (homeFields.className.indexOf('hidden') === -1) {
                    homeFields.className = (homeFields.className.replace(/\bflex\b/g, '').trim() + ' hidden').trim();
                }
            }
            if (summaryBadge) {
                summaryBadge.textContent = 'Salon Studio';
                summaryBadge.className = 'font-label-sm text-label-sm px-space-sm py-0.5 rounded-full bg-surface-container text-primary uppercase font-bold';
            }
            if (travelFeeRow) {
                travelFeeRow.style.display = 'none';
            }
        }
        updateSummary();
    }

    // Treatment chip selection
    function selectServiceItem(name, price, duration) {
        bookingState.serviceName = name;
        bookingState.basePrice = Number(price) || 0;
        bookingState.duration = duration || '60 min';

        var chips = document.querySelectorAll('.service-chip');
        var i;
        for (i = 0; i < chips.length; i++) {
            var chip = chips[i];
            var chipText = (chip.innerText || chip.textContent || '').replace(/\s+/g, ' ').trim();
            if (strContains(chipText, name) || strContains(name, chipText)) {
                chip.className = 'service-chip active text-left p-space-sm rounded-xl bg-primary text-on-primary font-label-sm text-label-sm transition-all shadow-sm';
            } else {
                chip.className = 'service-chip text-left p-space-sm rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm transition-all hover:bg-surface-container-high';
            }
        }

        updateSummary();
    }

    // Prefill booking from service cards and scroll to booking section
    function prefillBooking(name, price) {
        var dur = '60 min';
        if (strContains(name, 'Bridal')) {
            dur = '180 min';
        } else if (strContains(name, 'Color')) {
            dur = '120 min';
        } else if (strContains(name, 'Facial')) {
            dur = '75 min';
        } else if (strContains(name, 'Streaking')) {
            dur = '90 min';
        } else if (strContains(name, 'Cut') || strContains(name, 'Blowout') || strContains(name, 'Nail')) {
            dur = '45 min';
        }

        selectServiceItem(name, price, dur);
        scrollToSection('booking');
    }

    // Time slot selection
    function selectTimeSlot(el, time) {
        bookingState.timeSlot = time;
        var slots = document.querySelectorAll('.time-slot');
        var i;
        for (i = 0; i < slots.length; i++) {
            slots[i].className = 'time-slot px-space-xs py-space-sm bg-surface-container text-on-surface rounded-xl font-label-sm text-label-sm text-center hover:bg-surface-container-high';
        }
        if (el) {
            el.className = 'time-slot px-space-xs py-space-sm bg-primary text-on-primary rounded-xl font-label-sm text-label-sm text-center';
        }
        updateSummary();
    }

    // Stylist Tier Selection
    function updateTier(tierName, surcharge) {
        bookingState.tierName = tierName;
        bookingState.tierPrice = Number(surcharge) || 0;
        updateSummary();
    }

    // Live Summary calculation (PKR / Rs.)
    function updateSummary() {
        var sName = document.getElementById('summary-service-name');
        var sDur = document.getElementById('summary-service-duration');
        var sTier = document.getElementById('summary-tier-name');
        var sSlot = document.getElementById('summary-slot');
        var sTotal = document.getElementById('summary-total-price');

        if (sName) { sName.textContent = bookingState.serviceName; }
        if (sDur) { sDur.textContent = bookingState.duration; }
        if (sTier) { sTier.textContent = bookingState.tierName; }
        if (sSlot) { sSlot.textContent = bookingState.timeSlot; }

        var travelFee = (bookingState.mode === 'home') ? 2000 : 0;
        var total = bookingState.basePrice + bookingState.tierPrice + travelFee;
        if (sTotal) {
            sTotal.textContent = 'Rs. ' + formatPrice(total);
        }
    }

    // Confirm Appointment
    function confirmBooking() {
        var nameInput = document.getElementById('booking-name');
        var phoneInput = document.getElementById('booking-phone');
        var dateInput = document.getElementById('booking-date');
        var addressInput = document.getElementById('home-address');

        var clientName = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
        var clientPhone = (phoneInput && phoneInput.value) ? phoneInput.value.trim() : '';
        var appointmentDate = (dateInput && dateInput.value) ? dateInput.value : bookingState.date;

        if (bookingState.mode === 'home' && addressInput && !addressInput.value.trim()) {
            alert('Please enter your destination address for VIP At-Home Concierge service.');
            addressInput.focus();
            return;
        }

        var travelFee = (bookingState.mode === 'home') ? 2000 : 0;
        var total = bookingState.basePrice + bookingState.tierPrice + travelFee;
        var travelText = bookingState.mode === 'home' ? ' (VIP At-Home Concierge)' : ' (Salon Studio Visit)';
        var msg = 'Thank you' + (clientName ? ', ' + clientName : '') + '!\n\n' +
                  'Your appointment for ' + bookingState.serviceName + travelText + '\n' +
                  'Date: ' + appointmentDate + ' at ' + bookingState.timeSlot + '\n' +
                  'Stylist: ' + bookingState.tierName + '\n' +
                  'Total Estimated Price: Rs. ' + formatPrice(total) + '\n\n' +
                  'Our VIP concierge will text confirmation to ' + (clientPhone || 'your phone') + ' within 15 minutes.';
        alert(msg);
    }

    // Shopping Cart (PKR / Rs.)
    function addToCart(title, price) {
        var numPrice = Number(price) || 0;
        cart.count += 1;
        cart.subtotal += numPrice;
        cart.items.push({ title: title, price: numPrice });

        var countEl = document.getElementById('cart-item-count');
        var subtotalEl = document.getElementById('cart-subtotal');
        var headerBadge = document.getElementById('header-cart-badge');

        if (countEl) {
            countEl.textContent = cart.count + (cart.count === 1 ? ' Item' : ' Items');
        }
        if (subtotalEl) {
            subtotalEl.textContent = 'Rs. ' + formatPrice(cart.subtotal);
        }
        if (headerBadge) {
            headerBadge.textContent = String(cart.count);
        }

        alert('Added "' + title + '" (Rs. ' + formatPrice(numPrice) + ') to cart.\n' +
              'Total Cart: ' + cart.count + ' item(s) • Rs. ' + formatPrice(cart.subtotal));
    }

    // Search handler
    function handleSearchClick() {
        var query = prompt('Search our salon services or cosmetic products:');
        if (query && query.trim()) {
            var q = query.trim().toLowerCase();
            if (strContains('services haircut bridal makeup manicure mehendi facial skin hair styling blowout', q)) {
                scrollToSection('services');
            } else if (strContains('products lipstick foundation mascara palette brush blush mist liner cosmetics', q)) {
                scrollToSection('products');
            } else {
                alert('Showing results for "' + query + '". Explore our services and cosmetics below.');
                scrollToSection('services');
            }
        }
    }


    // Expose methods to global window for inline onclick handlers
    window.switchBookingMode = switchBookingMode;
    window.selectServiceItem = selectServiceItem;
    window.prefillBooking = prefillBooking;
    window.selectTimeSlot = selectTimeSlot;
    window.updateTier = updateTier;
    window.updateSummary = updateSummary;
    window.confirmBooking = confirmBooking;
    window.addToCart = addToCart;
    window.scrollToSection = scrollToSection;
    window.handleSearchClick = handleSearchClick;

    // Bind DOM event listeners
    function init() {
        // Navigation links smooth scroll
        var navLinks = document.querySelectorAll('a[data-path]');
        var i;
        for (i = 0; i < navLinks.length; i++) {
            (function (link) {
                link.onclick = function (e) {
                    var path = link.getAttribute('data-path');
                    if (path) {
                        if (e && e.preventDefault) {
                            e.preventDefault();
                        } else {
                            window.event.returnValue = false;
                        }
                        scrollToSection(path);
                    }
                };
            })(navLinks[i]);
        }

        // Newsletter forms
        var forms = document.getElementsByTagName('form');
        for (i = 0; i < forms.length; i++) {
            forms[i].onsubmit = function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
                alert('Thank you for subscribing to Angels Beauty Corner newsletter! Exclusive previews will be emailed to you.');
                return false;
            };
        }

        // Date input change
        var dateInput = document.getElementById('booking-date');
        if (dateInput) {
            dateInput.onchange = function () {
                bookingState.date = this.value;
            };
        }


        // Compute initial summary
        updateSummary();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', init, false);
    } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState === 'complete') {
                init();
            }
        });
    }
})();
