// BADideas GTM Landing — Shared JS
// Handles: lid tracking, form submission, feedback mode

(function() {
  'use strict';

  // ===== LID TRACKING =====
  const params = new URLSearchParams(window.location.search);
  const lid = params.get('lid');
  const version = document.body.dataset.version; // 'a' or 'b'

  // Log page view with lid
  if (lid) {
    console.log(`[TRACK] Page view: version=${version}, lid=${lid}`);
    // Could beacon to analytics endpoint here
  }

  // ===== EMAIL FORM SUBMISSION =====
  document.querySelectorAll('.email-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      const email = input.value.trim();

      if (!email) return;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            version,
            lid: lid || null,
            timestamp: new Date().toISOString()
          })
        });

        if (res.ok) {
          btn.textContent = 'Got it ✓';
          btn.classList.add('submitted');
          input.value = '';
          input.placeholder = 'We\'ll be in touch';
          input.disabled = true;
        } else {
          throw new Error('Submit failed');
        }
      } catch (err) {
        btn.textContent = 'Try again';
        btn.disabled = false;
        console.error('[SUBMIT ERROR]', err);
      }
    });
  });

  // ===== FEEDBACK MODE =====
  const isFeedback = window.location.pathname.includes('/feedback') || params.get('feedback') === 'true';

  if (isFeedback) {
    document.body.classList.add('feedback-mode');

    // Create feedback UI elements
    const banner = document.createElement('div');
    banner.className = 'feedback-banner';
    banner.textContent = '📝 Feedback mode — click any section to leave a comment';
    document.body.prepend(banner);

    const backdrop = document.createElement('div');
    backdrop.className = 'feedback-backdrop';
    document.body.appendChild(backdrop);

    const modal = document.createElement('div');
    modal.className = 'feedback-modal';
    modal.innerHTML = `
      <h4>Leave feedback</h4>
      <div class="section-label"></div>
      <textarea placeholder="What works? What doesn't? Be specific."></textarea>
      <input type="text" placeholder="Your name (optional)">
      <div class="btn-row">
        <button class="btn-primary btn-submit-feedback">Submit</button>
        <button class="btn-cancel">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);

    let activeSection = null;

    // Click handlers for sections
    document.querySelectorAll('[data-section]').forEach(el => {
      el.addEventListener('click', (e) => {
        // Don't trigger on form elements
        if (e.target.closest('form, input, button, textarea, a')) return;

        activeSection = el.dataset.section;
        modal.querySelector('.section-label').textContent = `Section: ${activeSection}`;
        modal.classList.add('active');
        backdrop.classList.add('active');
        modal.querySelector('textarea').focus();
      });
    });

    // Submit feedback
    modal.querySelector('.btn-submit-feedback').addEventListener('click', async () => {
      const comment = modal.querySelector('textarea').value.trim();
      const author = modal.querySelector('input[type="text"]').value.trim();

      if (!comment) return;

      try {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            version,
            section: activeSection,
            comment,
            author: author || 'anonymous',
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error('[FEEDBACK ERROR]', err);
      }

      // Close modal
      modal.classList.remove('active');
      backdrop.classList.remove('active');
      modal.querySelector('textarea').value = '';
      modal.querySelector('input[type="text"]').value = '';

      // Brief highlight to confirm
      const section = document.querySelector(`[data-section="${activeSection}"]`);
      if (section) {
        section.style.outline = '3px solid #22c55e';
        section.style.outlineOffset = '8px';
        setTimeout(() => {
          section.style.outline = '';
          section.style.outlineOffset = '';
        }, 1500);
      }
    });

    // Cancel
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
      modal.classList.remove('active');
      backdrop.classList.remove('active');
    });
    backdrop.addEventListener('click', () => {
      modal.classList.remove('active');
      backdrop.classList.remove('active');
    });
  }
})();
