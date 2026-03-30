/* =============================================
   DUNLAP GARDINER LLP – MAIN SCRIPT
   ============================================= */

(function () {
  'use strict';

  /* --- Sticky Header --- */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile Menu --- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Active Nav Link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Scroll Reveal --- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.practice-card, .value-card, .attorney-card, .staff-card, .forum-article, .office-card').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* --- Contact Form (static / no backend) --- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      const originalText = btn.textContent;

      btn.textContent = 'Message Sent!';
      btn.style.background = '#2d7a4f';
      btn.style.borderColor = '#2d7a4f';
      btn.style.color = '#fff';
      btn.disabled = true;

      const note = contactForm.querySelector('.form-note');
      if (note) note.textContent = 'Thank you! An attorney will be in touch shortly.';

      setTimeout(() => {
        contactForm.reset();
        btn.textContent = originalText;
        btn.style.cssText = '';
        btn.disabled = false;
        if (note) note.textContent = 'Your information is confidential. No attorney-client relationship is formed without a written retainer.';
      }, 4000);
    });
  }

  /* --- Smooth anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Counter animation --- */
  function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value.toLocaleString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/[^0-9]/g, '');
        const suffix = el.textContent.replace(/[0-9]/g, '').trim();
        el.dataset.suffix = suffix;
        animateCounter(el, parseInt(raw, 10));
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

  /* --- Chatbot Widget --- */
  (function () {
    // Knowledge base
    const KB = [
      {
        keys: ['hours', 'open', 'office hours', 'time', 'schedule', 'when'],
        answer: 'Our offices are open <strong>Monday – Friday, 9:00 AM – 5:00 PM</strong>. You can also schedule a consultation by calling <a href="tel:7704895122">770-489-5122</a>.'
      },
      {
        keys: ['phone', 'call', 'number', 'contact', 'reach', 'telephone'],
        answer: 'You can reach us at <a href="tel:7704895122"><strong>770-489-5122</strong></a>. Our offices are open Monday – Friday, 9:00 AM – 5:00 PM.'
      },
      {
        keys: ['email', 'megan', 'kelly'],
        answer: 'You can email us at <a href="mailto:Megan@dunlapgardiner.com">Megan@dunlapgardiner.com</a> or <a href="mailto:Kelly@dunlapgardiner.com">Kelly@dunlapgardiner.com</a>.'
      },
      {
        keys: ['hiram', 'address', 'location', 'office', 'where', 'mcdonough'],
        answer: 'We have two offices:<br>• <strong>Hiram:</strong> 5604 Wendy Bagwell Parkway, Hiram, GA 30141<br>• <strong>McDonough:</strong> 330 Griffin Street, McDonough, GA 30253'
      },
      {
        keys: ['hoa', 'homeowner', 'association', 'condo', 'bylaw', 'covenant', 'assessment', 'dues'],
        answer: 'We provide comprehensive <strong>Homeowner Association Law</strong> services including covenant drafting, bylaw enforcement, delinquent dues collection, election disputes, violation enforcement, and full HOA representation across Georgia. Brian Gardiner is a recognized authority in this area.'
      },
      {
        keys: ['collection', 'debt', 'creditor', 'receivable', 'judgment', 'recover', 'owed'],
        answer: 'We handle <strong>Collections & Civil Litigation</strong>: accounts receivable recovery, debt collection, judgment enforcement, FDCPA defense, settlement negotiations, and trial representation in state and federal courts.'
      },
      {
        keys: ['bankruptcy', 'chapter', 'discharge', 'creditor rights', 'proof of claim', 'automatic stay'],
        answer: 'For <strong>Creditor Bankruptcy Law</strong>, we represent creditors throughout Georgia bankruptcy proceedings — proof of claims, objections to discharge, writs of possession, lift of automatic stay motions, and more. Our attorneys are members of the Creditor\'s Rights Section of the State Bar of Georgia.'
      },
      {
        keys: ['finance', 'bank', 'auto dealer', 'dealership', 'repossession', 'deficiency', 'fdcpa'],
        answer: 'We provide <strong>Finance & Auto Dealer Representation</strong> for banks, finance companies, and dealerships — covering collections, FDCPA defense, repossession matters, deficiency balance claims, and regulatory compliance.'
      },
      {
        keys: ['criminal', 'dui', 'drug', 'misdemeanor', 'felony', 'defense', 'forfeiture', 'arrest', 'charged'],
        answer: 'Our <strong>Criminal Law</strong> practice includes vigorous defense for DUI, drug crimes, asset forfeiture, misdemeanors, and constitutional issues. Attorney Joel Glaze leads our criminal defense practice.'
      },
      {
        keys: ['business', 'corporation', 'llc', 'formation', 'contract', 'startup', 'company'],
        answer: 'We offer <strong>Business Law</strong> services including corporation and LLC formation, contract drafting and review, business dispute resolution, general counsel services, and commercial collections for Atlanta-area companies.'
      },
      {
        keys: ['practice', 'area', 'service', 'specialize', 'what do you', 'handle', 'help with'],
        answer: 'Dunlap Gardiner handles: <strong>HOA Law, Collections & Civil Litigation, Creditor Bankruptcy, Finance & Auto Dealer Representation, Criminal Law, and Business Law</strong>. Visit our <a href="practice-areas.html">Practice Areas</a> page to learn more.'
      },
      {
        keys: ['wesley', 'dunlap', 'wes', 'founding partner', 'partner'],
        answer: '<strong>Wesley C. Dunlap</strong> is a Founding Partner, graduating Magna Cum Laude from Georgia State University College of Law. He specializes in finance company representation, HOA law, and civil litigation. His pre-law career in auto finance gives the firm unmatched insight into financial institutions.'
      },
      {
        keys: ['brian', 'gardiner', 'sb 46', 'legislation'],
        answer: '<strong>Brian M. Gardiner</strong> is a Founding Partner who has served as lead counsel in 4,000+ cases. He is an expert in community associations and creditor representation. He drafted SB 46, signed into law by Governor Deal in 2017, addressing HOA common areas and election procedures.'
      },
      {
        keys: ['evan', 'barnard'],
        answer: '<strong>Evan Barnard</strong> is a Senior Associate who has been with the firm since 2009. He handles HOA defense and creditor representation across 25+ Georgia counties.'
      },
      {
        keys: ['joel', 'glaze'],
        answer: '<strong>Joel Glaze</strong> is an Associate focusing on criminal defense, DUI, investment advisor regulation, and constitutional issues in accountability courts.'
      },
      {
        keys: ['sam', 'jordan', 'patent', 'ip', 'intellectual property'],
        answer: '<strong>Sam Jordan</strong> is an Associate (Texas A&M Law, J.D. 2025) with a background in biological engineering, patent law, and IP litigation.'
      },
      {
        keys: ['attorney', 'lawyer', 'staff', 'team', 'who'],
        answer: 'Our team includes five attorneys: <strong>Wesley C. Dunlap</strong> and <strong>Brian M. Gardiner</strong> (Founding Partners), <strong>Evan Barnard</strong> (Senior Associate), <strong>Joel Glaze</strong> (Associate), and <strong>Sam Jordan</strong> (Associate). View the full team on our <a href="staff.html">Staff page</a>.'
      },
      {
        keys: ['founded', 'history', 'since', 'established', 'story', 'about', '2009'],
        answer: 'Dunlap Gardiner, LLP was founded in <strong>2009</strong> in Douglasville, Georgia by Wesley Dunlap and Brian Gardiner after graduating from Georgia State University College of Law. The firm relocated to Hiram in 2014 and has since grown to five attorneys and a support staff of twenty.'
      },
      {
        keys: ['georgia', 'county', 'counties', 'serve', 'area', 'location'],
        answer: 'We serve clients across Georgia, including: Dallas/Paulding, Carrollton/Carroll, Newnan/Coweta, Decatur/DeKalb, Douglasville/Douglas, Atlanta/Fulton, Jonesboro/Clayton, Fayetteville/Fayette, McDonough/Henry, Marietta/Cobb, Hiram, and many more.'
      },
      {
        keys: ['payment', 'pay', 'invoice', 'fee', 'cost', 'affordable'],
        answer: 'Dunlap Gardiner is committed to affordable representation. For online payments, visit our <a href="https://quickclick.com/cart/cart.php?action=show_information&internal_key=637d9338dd69ad5d1107f1c3999a2876&internal_timestamp=1774908357&tid=cae1f6b2b108de3710eef4111a261aae" target="_blank" rel="noopener">Online Payment Center</a>.'
      },
      {
        keys: ['consultation', 'appointment', 'meet', 'talk', 'discuss'],
        answer: 'To schedule a consultation, call us at <a href="tel:7704895122"><strong>770-489-5122</strong></a> or visit our <a href="contact.html">Contact page</a>. We\'re available Monday – Friday, 9:00 AM – 5:00 PM.'
      },
      {
        keys: ['cai', 'community association institute', 'affiliation', 'member', 'state bar', 'federal'],
        answer: 'Dunlap Gardiner is a member of the <strong>Community Association Institute (CAI)</strong> and the Creditor\'s Rights Section of the State Bar of Georgia. We are licensed before all Georgia courts and the Northern, Middle, and Southern Districts of Georgia\'s federal courts.'
      }
    ];

    const FALLBACK = 'I\'m not sure about that, but our team is happy to help! Call us at <a href="tel:7704895122"><strong>770-489-5122</strong></a> or visit our <a href="contact.html">Contact page</a>.';

    const GREETINGS = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'];

    const SUGGESTIONS = ['Office hours', 'Contact info', 'Practice areas', 'Meet the attorneys', 'Our locations'];

    function getBotReply(input) {
      const lower = input.toLowerCase().trim();
      if (GREETINGS.some(g => lower.includes(g))) {
        return 'Hello! Welcome to <strong>Dunlap Gardiner, LLP</strong>. I can answer questions about our attorneys, practice areas, office locations, and more. How can I help you today?';
      }
      for (const entry of KB) {
        if (entry.keys.some(k => lower.includes(k))) {
          return entry.answer;
        }
      }
      return FALLBACK;
    }

    // Build widget HTML
    const toggle = document.createElement('button');
    toggle.id = 'dg-chatbot-toggle';
    toggle.setAttribute('aria-label', 'Open chat assistant');
    toggle.innerHTML = '💬';

    const win = document.createElement('div');
    win.id = 'dg-chatbot-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat with Dunlap Gardiner');
    win.innerHTML = `
      <div class="dg-chat-header">
        <span class="dg-chat-header-icon">⚖</span>
        <div class="dg-chat-header-text">
          <strong>Dunlap Gardiner Assistant</strong>
          <small>Ask me anything about our firm</small>
        </div>
        <button class="dg-chat-close" id="dg-chat-close" aria-label="Close chat">✕</button>
      </div>
      <div class="dg-chat-messages" id="dg-chat-messages"></div>
      <div class="dg-chat-suggestions" id="dg-chat-suggestions"></div>
      <div class="dg-chat-input-row">
        <input type="text" id="dg-chat-input" placeholder="Ask a question…" autocomplete="off" maxlength="200" />
        <button id="dg-chat-send" aria-label="Send">➤</button>
      </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(win);

    const messagesEl = document.getElementById('dg-chat-messages');
    const inputEl = document.getElementById('dg-chat-input');
    const sendBtn = document.getElementById('dg-chat-send');
    const closeBtn = document.getElementById('dg-chat-close');
    const suggestionsEl = document.getElementById('dg-chat-suggestions');

    function addMessage(html, type) {
      const el = document.createElement('div');
      el.className = 'dg-msg dg-msg-' + type;
      el.innerHTML = html;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showSuggestions(items) {
      suggestionsEl.innerHTML = '';
      items.forEach(text => {
        const chip = document.createElement('button');
        chip.className = 'dg-chip';
        chip.textContent = text;
        chip.addEventListener('click', () => {
          handleSend(text);
        });
        suggestionsEl.appendChild(chip);
      });
    }

    function handleSend(text) {
      const msg = (text || inputEl.value).trim();
      if (!msg) return;
      addMessage(msg, 'user');
      inputEl.value = '';
      suggestionsEl.innerHTML = '';
      setTimeout(() => {
        addMessage(getBotReply(msg), 'bot');
        showSuggestions(SUGGESTIONS);
      }, 320);
    }

    toggle.addEventListener('click', () => {
      const isOpen = win.classList.toggle('open');
      toggle.innerHTML = isOpen ? '✕' : '💬';
      toggle.setAttribute('aria-label', isOpen ? 'Close chat assistant' : 'Open chat assistant');
      if (isOpen && messagesEl.children.length === 0) {
        addMessage('Hello! Welcome to <strong>Dunlap Gardiner, LLP</strong>. I\'m here to answer questions about our attorneys, practice areas, office locations, and more. How can I help you?', 'bot');
        showSuggestions(SUGGESTIONS);
      }
    });

    closeBtn.addEventListener('click', () => {
      win.classList.remove('open');
      toggle.innerHTML = '💬';
      toggle.setAttribute('aria-label', 'Open chat assistant');
    });

    sendBtn.addEventListener('click', () => handleSend());
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  })();

})();
