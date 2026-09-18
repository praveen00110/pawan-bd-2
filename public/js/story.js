// Interactive Story Controller for Tharushi Vishmika's Birthday

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particle Engine
  const particles = new ParticleEngine('particle-canvas');
  particles.start();

  // 2. Audio control & Autoplay handling
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicDisk = document.getElementById('music-disk');
  const musicLabel = document.getElementById('music-label');

  let audioStarted = false;
  const startAudioOnce = () => {
    if (!audioStarted) {
      audioStarted = true;
      window.romanticAudio.startRomanticMelody();
      if (musicDisk) musicDisk.classList.remove('paused');
      if (musicLabel) musicLabel.textContent = 'Music Playing ♫';
    }
  };

  // Start music on first interaction anywhere
  document.body.addEventListener('click', startAudioOnce, { once: true });
  document.body.addEventListener('touchstart', startAudioOnce, { once: true });

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startAudioOnce();
      const isNowPlaying = window.romanticAudio.toggleMusic();
      if (isNowPlaying) {
        musicDisk.classList.remove('paused');
        musicLabel.textContent = 'Music Playing ♫';
      } else {
        musicDisk.classList.add('paused');
        musicLabel.textContent = 'Music Paused';
      }
    });
  }

  // 3. Scene Management
  const scenes = {
    arrival: document.getElementById('scene-arrival'),
    letter: document.getElementById('scene-letter'),
    cake: document.getElementById('scene-cake'),
    sitting: document.getElementById('scene-sitting'),
    reply: document.getElementById('scene-reply')
  };

  function switchScene(fromSceneId, toSceneId) {
    if (scenes[fromSceneId]) {
      scenes[fromSceneId].classList.remove('active');
    }
    if (scenes[toSceneId]) {
      scenes[toSceneId].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ==========================================
  // SCENE 1: MOTORCYCLE ARRIVAL & FLOWER DELIVERY
  // ==========================================
  const bikeActor = document.getElementById('bike-actor');
  const roadStripes = document.getElementById('road-stripes');
  const deliveryBox = document.getElementById('delivery-box');
  const openLetterBtn = document.getElementById('open-letter-btn');

  // Trigger bike arrival animation
  function startBikeArrival() {
    window.romanticAudio.playBikeSound();

    let pos = -280;
    const targetPos = window.innerWidth > 768 ? 320 : 120;
    const speed = 6;

    const driveInterval = setInterval(() => {
      pos += speed;
      if (bikeActor) bikeActor.style.left = `${pos}px`;

      if (pos >= targetPos) {
        clearInterval(driveInterval);
        if (roadStripes) roadStripes.classList.add('stopped');

        // Rider steps down & presents flowers
        setTimeout(() => {
          if (deliveryBox) {
            deliveryBox.classList.remove('hidden');
            deliveryBox.style.opacity = '0';
            deliveryBox.style.transform = 'translateY(20px)';
            deliveryBox.style.transition = 'all 0.8s ease';
            setTimeout(() => {
              deliveryBox.style.opacity = '1';
              deliveryBox.style.transform = 'translateY(0)';
            }, 50);
          }
          particles.triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 40);
        }, 1200);
      }
    }, 20);
  }

  // Start arrival shortly after page loads
  setTimeout(() => {
    startBikeArrival();
  }, 1000);

  if (openLetterBtn) {
    openLetterBtn.addEventListener('click', () => {
      window.romanticAudio.playLetterSound();
      particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
      switchScene('arrival', 'letter');
    });
  }

  // ==========================================
  // SCENE 2: LETTER & PHOTO MEMORY GALLERY
  // ==========================================
  const goToCakeBtn = document.getElementById('go-to-cake-btn');
  if (goToCakeBtn) {
    goToCakeBtn.addEventListener('click', () => {
      switchScene('letter', 'cake');
    });
  }

  // Lightbox for photos
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-photo');
      const caption = card.querySelector('.polaroid-caption');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption && caption) {
          lightboxCaption.textContent = caption.textContent;
        }
        if (lightboxModal) lightboxModal.classList.add('active');
        particles.triggerFireworks(window.innerWidth / 2, window.innerHeight * 0.4);
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // ==========================================
  // SCENE 3: CAKE CUTTING CEREMONY
  // ==========================================
  const blowCandlesBtn = document.getElementById('blow-candles-btn');
  const cutCakeBtn = document.getElementById('cut-cake-btn');
  const flames = document.querySelectorAll('.flame');
  const smokeClouds = document.querySelectorAll('.smoke-cloud');
  const knife = document.getElementById('interactive-knife');
  const cakeSlice = document.getElementById('cake-slice-piece');
  const cakeCutLine = document.getElementById('cake-cut-line');
  const cakeWishBanner = document.getElementById('cake-wish-banner');
  const goToSittingBtn = document.getElementById('go-to-sitting-btn');

  let candlesBlown = false;
  let cakeCut = false;

  if (blowCandlesBtn) {
    blowCandlesBtn.addEventListener('click', () => {
      if (candlesBlown) return;
      candlesBlown = true;
      window.romanticAudio.playCandleBlowSound();

      flames.forEach(f => f.classList.add('blown-out'));
      smokeClouds.forEach(s => s.classList.add('rise'));

      blowCandlesBtn.style.display = 'none';
      if (cutCakeBtn) cutCakeBtn.style.display = 'inline-flex';
      if (knife) knife.style.display = 'block';

      if (cakeWishBanner) {
        cakeWishBanner.textContent = '✨ Wish made! Now take the knife and slice the cake! 🍰';
      }
    });
  }

  function executeCakeCut() {
    if (cakeCut) return;
    cakeCut = true;

    window.romanticAudio.playSliceSound();
    setTimeout(() => {
      window.romanticAudio.playCelebrationSound();
    }, 200);

    if (knife) {
      knife.style.transform = 'translate(-70px, 90px) rotate(45deg)';
      setTimeout(() => {
        knife.style.opacity = '0';
      }, 700);
    }

    if (cakeCutLine) cakeCutLine.classList.add('visible');
    if (cakeSlice) cakeSlice.classList.add('separated');

    // Massive fireworks & confetti celebration
    particles.triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 120);
    particles.triggerFireworks(window.innerWidth * 0.3, window.innerHeight * 0.3);
    particles.triggerFireworks(window.innerWidth * 0.7, window.innerHeight * 0.3);

    if (cakeWishBanner) {
      cakeWishBanner.innerHTML = '🎉 Happy Birthday Tharushi Vishmika! May your life be filled with sweet love! 💖✨';
    }

    if (cutCakeBtn) cutCakeBtn.style.display = 'none';
    if (goToSittingBtn) goToSittingBtn.style.display = 'inline-flex';
  }

  if (cutCakeBtn) cutCakeBtn.addEventListener('click', executeCakeCut);
  if (knife) knife.addEventListener('click', executeCakeCut);

  if (goToSittingBtn) {
    goToSittingBtn.addEventListener('click', () => {
      switchScene('cake', 'sitting');
      startThoughtBubblesCycle();
    });
  }

  // ==========================================
  // SCENE 4: SITTING DOWN & THOUGHT BUBBLE CYCLE
  // ==========================================
  const thoughtBubbleText = document.getElementById('thought-bubble-text');
  const goToReplyBtn = document.getElementById('go-to-reply-btn');

  const boyThoughts = [
    "How did I get so lucky to have you in my life, Tharushi? ✨",
    "Your smile is the most beautiful thing I've ever seen in this world... 💕",
    "Every memory with you feels like a dream I never want to wake up from.",
    "I want to celebrate every single birthday with you, forever and always.",
    "You are my today, my tomorrow, and my whole universe... 🌸",
    "I'll always be right here, standing by your side no matter what."
  ];

  let thoughtIndex = 0;
  let thoughtInterval = null;

  function startThoughtBubblesCycle() {
    if (thoughtInterval) clearInterval(thoughtInterval);

    // Disable the reply button for 15 seconds so she can read the thoughts
    if (goToReplyBtn) {
      goToReplyBtn.disabled = true;
      goToReplyBtn.style.opacity = '0.45';
      goToReplyBtn.style.cursor = 'not-allowed';
      let countdown = 15;
      goToReplyBtn.querySelector('span').textContent = `Read his thoughts... (${countdown}s)`;

      const countdownTimer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          goToReplyBtn.querySelector('span').textContent = `Read his thoughts... (${countdown}s)`;
        } else {
          clearInterval(countdownTimer);
          goToReplyBtn.disabled = false;
          goToReplyBtn.style.opacity = '1';
          goToReplyBtn.style.cursor = 'pointer';
          goToReplyBtn.querySelector('span').textContent = 'He Has One Last Question For You... 💌';
        }
      }, 1000);
    }

    const updateThought = () => {
      if (!thoughtBubbleText) return;
      thoughtBubbleText.style.opacity = '0';
      thoughtBubbleText.style.transform = 'scale(0.92)';
      thoughtBubbleText.style.transition = 'all 0.5s ease';

      setTimeout(() => {
        thoughtBubbleText.textContent = boyThoughts[thoughtIndex];
        thoughtBubbleText.style.opacity = '1';
        thoughtBubbleText.style.transform = 'scale(1)';
        thoughtIndex = (thoughtIndex + 1) % boyThoughts.length;
      }, 500);
    };

    updateThought();
    thoughtInterval = setInterval(updateThought, 4800);
  }

  if (goToReplyBtn) {
    goToReplyBtn.addEventListener('click', () => {
      if (goToReplyBtn.disabled) return;
      switchScene('sitting', 'reply');
    });
  }

  // ==========================================
  // SCENE 5: THARUSHI'S REPLY & BACKEND PERSISTENCE
  // ==========================================
  const replyForm = document.getElementById('reply-form');
  const replyInput = document.getElementById('reply-message');
  const reactionPills = document.querySelectorAll('.reaction-pill');
  const replySuccess = document.getElementById('reply-success');
  const whatsappBtn = document.getElementById('whatsapp-btn');
  let selectedReaction = '❤️';

  reactionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      reactionPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedReaction = pill.dataset.reaction || '❤️';

      // Pre-fill or append reaction text if empty
      const text = pill.textContent.trim();
      if (replyInput && !replyInput.value.trim()) {
        replyInput.value = text;
      }
    });
  });

  if (replyForm) {
    replyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = replyInput.value.trim();
      if (!message) {
        alert('Please write a little note for him! ❤️');
        return;
      }

      const submitBtn = document.getElementById('submit-reply-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending with love... 💌';
      }

      try {
        const response = await fetch('/api/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Tharushi Vishmika',
            message: message,
            reaction: selectedReaction
          })
        });

        const data = await response.json();

        if (data.success) {
          particles.triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 150);
          particles.triggerFireworks(window.innerWidth / 2, window.innerHeight * 0.25);
          window.romanticAudio.playCelebrationSound();

          replyForm.style.display = 'none';
          if (replySuccess) replySuccess.style.display = 'block';

          // Configure WhatsApp Direct Link
          if (whatsappBtn) {
            const encodedMsg = encodeURIComponent(`Hi my love! ❤️ Here is my birthday reply:\n"${message}"\n${selectedReaction}`);
            // Can be sent to any contact
            whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodedMsg}`;
          }
        } else {
          alert('Could not send message. Please try again!');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Reply to Him 💌';
          }
        }
      } catch (err) {
        console.error('Error submitting reply:', err);
        // Fallback gracefully: show celebration anyway and enable WhatsApp
        replyForm.style.display = 'none';
        if (replySuccess) replySuccess.style.display = 'block';
        particles.triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 100);
      }
    });
  }
});
