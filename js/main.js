// ─── Load HTML partials ──────────────────────────────────────────
async function loadPartial(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(`partials/${file}`);
    if (!res.ok) throw new Error(`Failed to load ${file}`);
    el.innerHTML = await res.text();
  } catch (e) {
    console.error(e);
  }
}

async function loadAllPartials() {
  await Promise.all([
    loadPartial('partial-header',   'header.html'),
    loadPartial('partial-divider',  'divider.html'),
    loadPartial('partial-intro',    'intro.html'),
    loadPartial('partial-projects', 'projects.html'),
    loadPartial('partial-footer',   'footer.html'),
    loadPartial('partial-modal',    'modal.html'),
  ]);
  initFooterYear();
  renderProjects();
  initModal();
}

// ─── Footer year ─────────────────────────────────────────────────
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ─── Projects data ───────────────────────────────────────────────
// Add new projects here as objects in this array
const projects = [
  {
    title: 'Bromsgrove Flooring & Co',
    desc: 'Full brochure site for a family-run flooring business in Worcestershire. Sliding hero, expandable photo galleries across four flooring types, WhatsApp booking integration, and full SEO metadata for local search.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Local SEO', 'Responsive'],
    url: 'bromsgrove-flooring.co.uk',
    href: 'https://bromsgrove-flooring.co.uk',
    featured: true
  },
];

function renderProjects() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (projects.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'add-card';
    empty.style.cssText = 'min-height:260px;grid-column:span 2;';
    empty.innerHTML = `
      <div class="add-icon" style="width:48px;height:48px;font-size:1.4rem;">+</div>
      <span class="add-label">Your first project</span>
      <p style="font-family:'DM Mono',monospace;font-size:0.62rem;color:var(--muted);margin-top:0.25rem;text-align:center;line-height:1.8;">Send it over and it'll appear here</p>
    `;
    grid.appendChild(empty);
  } else {
    projects.forEach((p, i) => {
      const card = document.createElement('a');
      card.href = p.href || '#';
      if (p.href) card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'project-card' + (p.featured ? ' featured' : '');
      card.innerHTML = `
        <div class="card-top">
          <span class="card-index">${String(i + 1).padStart(3, '0')}</span>
        </div>
        <div class="card-title">${p.title}</div>
        <p class="card-desc">${p.desc}</p>
        <div class="card-bottom">
          <div class="card-tags">
            ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          <span class="card-url">${p.url}</span>
        </div>
        <div class="card-view-btn">
          <span class="view-btn-inner">View project ↗</span>
        </div>
      `;

      // Shared toggle function
      function toggleCard() {
        if (card.classList.contains('touched')) {
          card.classList.remove('touched');
        } else {
          document.querySelectorAll('.project-card.touched').forEach(c => c.classList.remove('touched'));
          card.classList.add('touched');
        }
      }

      // Track touch movement to distinguish taps from scrolls
      let touchStartY = 0;
      let touchStartX = 0;
      let touchMoved  = false;
      let isTouchDevice = false;

      card.addEventListener('touchstart', (e) => {
        isTouchDevice = true;
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchMoved  = false;
      }, { passive: true });

      card.addEventListener('touchmove', (e) => {
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        if (dy > 8 || dx > 8) touchMoved = true;
      }, { passive: true });

      card.addEventListener('touchend', (e) => {
        if (touchMoved) return;
        e.preventDefault(); // prevents the click event firing after touchend
        toggleCard();
      });

      // Desktop only — click handler (skipped on touch devices since touchend handles it)
      card.addEventListener('click', (e) => {
        if (isTouchDevice) return; // touch already handled via touchend
        if (e.target.closest('.card-view-btn')) return; // let button click through
        e.preventDefault();
        toggleCard();
      });

      // View project button — always navigates, both touch and desktop
      const viewBtn = card.querySelector('.card-view-btn');
      viewBtn.style.pointerEvents = 'auto';
      viewBtn.addEventListener('touchend', (e) => {
        if (touchMoved) return;
        e.stopPropagation();
        e.preventDefault();
        window.open(card.href, '_blank');
      });
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(card.href, '_blank');
      });

      grid.appendChild(card);
    });

    // "More coming" card
    const add = document.createElement('div');
    add.className = 'add-card';
    add.innerHTML = `<div class="add-icon">+</div><span class="add-label">More coming</span>`;
    grid.appendChild(add);
  }

  // Update project count in header
  const countEl = document.getElementById('project-count');
  if (countEl) {
    countEl.textContent =
      projects.length === 0 ? '— projects' :
      projects.length === 1 ? '1 project' :
      `${projects.length} projects`;
  }
}

// ─── Modal ───────────────────────────────────────────────────────
function initModal() {
  const modal = document.getElementById('quoteModal');
  if (!modal) return;

  // Close on overlay backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  });

  // Prevent page scroll bleed-through on touch
  modal.addEventListener('touchmove', function(e) {
    if (e.target === this) e.preventDefault();
  }, { passive: false });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  });
}

function openModal() {
  const modal = document.getElementById('quoteModal');
  if (modal) {
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  }
}

function closeModal() {
  const modal = document.getElementById('quoteModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
}

function submitQuote() {
  const name     = document.getElementById('f-name').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const business = document.getElementById('f-business').value.trim();
  const type     = document.getElementById('f-type').value;
  const budget   = document.getElementById('f-budget').value;
  const existing = document.getElementById('f-existing').value;
  const desc     = document.getElementById('f-desc').value.trim();
  const timeline = document.getElementById('f-timeline').value;

  if (!name)  { document.getElementById('f-name').focus();  return; }
  if (!email || !email.includes('@')) { document.getElementById('f-email').focus(); return; }

  const subject = encodeURIComponent('Website enquiry from ' + name + (business ? ' — ' + business : ''));
  const body    = encodeURIComponent(
    'Name: '     + name  + '\n' +
    'Email: '    + email + '\n' +
    (business ? 'Business/Project: ' + business + '\n' : '') +
    (type     ? 'Website type: '     + type     + '\n' : '') +
    (budget   ? 'Budget: '           + budget   + '\n' : '') +
    (existing ? 'Existing website: ' + existing + '\n' : '') +
    (timeline ? 'Timeline: '         + timeline + '\n' : '') +
    (desc     ? '\nProject details:\n' + desc     : '')
  );

  window.location.href = 'mailto:altlabcreations@gmail.com?subject=' + subject + '&body=' + body;

  setTimeout(() => {
    document.getElementById('formView').style.display = 'none';
    document.getElementById('successView').classList.add('show');
  }, 600);
}

// ─── Boot ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadAllPartials);
