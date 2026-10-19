/**
 * Flashcard Controller: 3D Flip Card, Row Filters, Shuffle, Audio, Mastery Tracker
 * Swipe right (or →) = know it, card leaves the round.
 * Swipe left (or ←) = don't know, card comes back a few cards later.
 */
import { KANA_DATA, KANA_ROWS, getFilteredKana } from './data.js';
import { soundCtrl } from './audio.js';

export class FlashcardController {
  constructor() {
    this.kanaType = 'hiragana'; // 'hiragana' | 'katakana' | 'mixed'
    this.selectedRow = 'all';
    this.cards = [];   // full set for the selected row
    this.queue = [];   // cards still to pass this round; queue[0] is shown
    this.passed = 0;
    this.isAnimating = false;
    this.isFlipped = false;
    this.masteredMap = JSON.parse(localStorage.getItem('kana_mastered') || '{}');

    this.initDOM();
    this.bindEvents();
    this.updateCardSet();
  }

  initDOM() {
    this.cardElement = document.getElementById('flashcard');
    this.cardFrontChar = document.getElementById('fc-front-char');
    this.cardBackRomaji = document.getElementById('fc-back-romaji');
    this.cardBackAlt = document.getElementById('fc-back-alt');

    this.sceneElement = document.getElementById('flashcard-scene');
    this.doneElement = document.getElementById('fc-done');
    this.btnRestart = document.getElementById('fc-restart');
    this.btnAgain = document.getElementById('fc-again');
    this.btnKnow = document.getElementById('fc-know');
    this.btnShuffle = document.getElementById('fc-shuffle');
    this.btnFlip = document.getElementById('fc-flip');
    this.btnAudio = document.getElementById('fc-audio');
    this.btnMastered = document.getElementById('fc-mastered');

    this.counterEl = document.getElementById('fc-counter');
    this.progressBar = document.getElementById('fc-progress-bar');
    this.rowSelect = document.getElementById('fc-row-select');
    this.typeSelector = document.getElementById('fc-type-selector');

    // Populate row dropdown
    if (this.rowSelect) {
      this.rowSelect.innerHTML = KANA_ROWS.map(
        row => `<option value="${row.id}">${row.label}</option>`
      ).join('');
    }
  }

  bindEvents() {
    // Tap to flip, drag sideways to answer
    this.bindSwipe();

    if (this.btnFlip) {
      this.btnFlip.addEventListener('click', () => this.toggleFlip());
    }

    if (this.btnAgain) {
      this.btnAgain.addEventListener('click', () => this.answer(false));
    }

    if (this.btnKnow) {
      this.btnKnow.addEventListener('click', () => this.answer(true));
    }

    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => this.shuffleCards());
    }

    if (this.btnShuffle) {
      this.btnShuffle.addEventListener('click', () => this.shuffleCards());
    }

    if (this.btnAudio) {
      this.btnAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playCurrentAudio();
      });
    }

    if (this.btnMastered) {
      this.btnMastered.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMastered();
      });
    }

    if (this.rowSelect) {
      this.rowSelect.addEventListener('change', (e) => {
        this.selectedRow = e.target.value;
        this.updateCardSet();
      });
    }

    if (this.typeSelector) {
      this.typeSelector.addEventListener('change', (e) => {
        if (e.target.name === 'kana-type') {
          this.kanaType = e.target.value;
          this.updateCardSet(); // deck size changes (mixed = both scripts)
        }
      });
    }

    // Keyboard navigation (ArrowLeft, ArrowRight, Space)
    window.addEventListener('keydown', (e) => {
      const activeTab = document.querySelector('.tab-content.active');
      if (!activeTab || activeTab.id !== 'tab-flashcards') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleFlip();
      } else if (e.code === 'ArrowRight') {
        this.answer(true);
      } else if (e.code === 'ArrowLeft') {
        this.answer(false);
      } else if (e.code === 'KeyP') {
        this.playCurrentAudio();
      }
    });
  }

  // Each card is a kana entry plus the script it is shown in.
  // Mixed mode holds both scripts, so the deck is twice as long, shuffled together.
  updateCardSet() {
    let kana = getFilteredKana(this.selectedRow);
    if (kana.length === 0) {
      kana = getFilteredKana('all');
    }
    const types = this.kanaType === 'mixed' ? ['hiragana', 'katakana'] : [this.kanaType];
    this.cards = types.flatMap(type => kana.map(k => ({ ...k, type })));
    if (this.kanaType === 'mixed') this.shuffleDeck();
    this.startRound();
  }

  startRound() {
    this.queue = [...this.cards];
    this.passed = 0;
    this.resetFlipAndRender();
  }

  shuffleDeck() {
    // Fisher-Yates shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  getCardType(card) {
    return card.type;
  }

  bindSwipe() {
    const scene = this.sceneElement;
    if (!scene) return;
    const THRESHOLD = 80;
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dragging = false;

    scene.addEventListener('pointerdown', (e) => {
      if (this.isAnimating || e.target.closest('.no-flip') || !this.getCurrentCard()) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      dx = 0;
      scene.setPointerCapture(e.pointerId);
      scene.style.transition = 'none';
    });

    scene.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      this.setDragOffset(dx);
    });

    const end = (e) => {
      if (!dragging) return;
      dragging = false;
      const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (dx > THRESHOLD) {
        this.answer(true);
      } else if (dx < -THRESHOLD) {
        this.answer(false);
      } else {
        scene.style.transition = '';
        this.setDragOffset(0);
        if (moved < 8 && e.type === 'pointerup') this.toggleFlip();
      }
    };
    scene.addEventListener('pointerup', end);
    scene.addEventListener('pointercancel', end);
  }

  setDragOffset(dx) {
    if (!this.sceneElement) return;
    this.sceneElement.style.transform = dx
      ? `translateX(${dx}px) rotate(${dx / 20}deg)`
      : '';
    // Fade in the ✓ / ✗ hint as the card is dragged
    this.sceneElement.style.setProperty('--know', Math.max(0, Math.min(dx / 80, 1)));
    this.sceneElement.style.setProperty('--again', Math.max(0, Math.min(-dx / 80, 1)));
  }

  /** known = true: passed, leaves the round. false: comes back a few cards later. */
  answer(known) {
    const current = this.getCurrentCard();
    if (!current || this.isAnimating) return;
    this.isAnimating = true;

    const key = `${this.getCardType(current)}_${current.romaji}`;
    this.masteredMap[key] = known;
    localStorage.setItem('kana_mastered', JSON.stringify(this.masteredMap));

    if (known) {
      soundCtrl.playCorrect(1);
    } else {
      soundCtrl.playPop();
    }

    // Fly the card off-screen, then swap in the next one
    const scene = this.sceneElement;
    const dir = known ? 1 : -1;
    if (scene) {
      scene.style.transition = 'transform 0.25s ease-in, opacity 0.25s ease-in';
      scene.style.transform = `translateX(${dir * 120}%) rotate(${dir * 18}deg)`;
      scene.style.opacity = '0';
    }

    setTimeout(() => {
      this.queue.shift();
      if (known) {
        this.passed++;
      } else {
        // Re-insert a few cards later so it comes back soon
        this.queue.splice(Math.min(3, this.queue.length), 0, current);
      }

      this.resetFlipAndRender();
      if (scene) {
        scene.style.transition = 'none';
        this.setDragOffset(0);
        scene.style.transform = 'scale(0.94)';
        void scene.offsetWidth; // apply before animating back in
        scene.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        scene.style.transform = '';
        scene.style.opacity = '';
      }
      this.isAnimating = false;
    }, 250);
  }

  toggleFlip() {
    if (!this.getCurrentCard()) return;
    this.isFlipped = !this.isFlipped;
    if (this.cardElement) {
      this.cardElement.classList.toggle('flipped', this.isFlipped);
    }
    soundCtrl.playPop();
  }

  shuffleCards() {
    this.shuffleDeck();
    soundCtrl.playPop();
    this.startRound();
  }

  resetFlipAndRender() {
    this.isFlipped = false;
    if (this.cardElement) {
      // Snap back to the front without playing the flip animation
      this.cardElement.style.transition = 'none';
      this.cardElement.classList.remove('flipped');
      void this.cardElement.offsetWidth;
      this.cardElement.style.transition = '';
    }
    this.render();
  }

  toggleMastered() {
    const current = this.getCurrentCard();
    if (!current) return;
    const key = `${this.getCardType(current)}_${current.romaji}`;
    this.masteredMap[key] = !this.masteredMap[key];
    localStorage.setItem('kana_mastered', JSON.stringify(this.masteredMap));
    this.updateMasteredUI();
    soundCtrl.playCorrect(1);
  }

  updateMasteredUI() {
    const current = this.getCurrentCard();
    if (!current || !this.btnMastered) return;
    const key = `${this.getCardType(current)}_${current.romaji}`;
    const isMastered = !!this.masteredMap[key];
    this.btnMastered.classList.toggle('active', isMastered);
    this.btnMastered.textContent = isMastered ? '★' : '☆';
  }

  playCurrentAudio() {
    const current = this.getCurrentCard();
    if (!current) return;
    const char = this.getCardType(current) === 'hiragana' ? current.hiragana : current.katakana;
    soundCtrl.speak(char);
  }

  getCurrentCard() {
    return this.queue[0] || null;
  }

  render() {
    const total = this.cards.length;
    if (this.counterEl) this.counterEl.textContent = `${this.passed} / ${total}`;
    if (this.progressBar) this.progressBar.style.width = `${(this.passed / total) * 100}%`;

    const current = this.getCurrentCard();
    const done = !current;
    if (this.sceneElement) this.sceneElement.classList.toggle('hidden', done);
    if (this.doneElement) this.doneElement.classList.toggle('hidden', !done);
    if (done) return;

    const char = this.getCardType(current) === 'hiragana' ? current.hiragana : current.katakana;
    const altChar = this.getCardType(current) === 'hiragana' ? current.katakana : current.hiragana;

    if (this.cardFrontChar) this.cardFrontChar.textContent = char;
    if (this.cardBackRomaji) this.cardBackRomaji.textContent = current.romaji;
    if (this.cardBackAlt) this.cardBackAlt.textContent = altChar;

    this.updateMasteredUI();
  }
}
