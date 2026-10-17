/**
 * Flashcard Controller: 3D Flip Card, Row Filters, Shuffle, Audio, Mastery Tracker
 */
import { KANA_DATA, KANA_ROWS, getFilteredKana } from './data.js';
import { soundCtrl } from './audio.js';

export class FlashcardController {
  constructor() {
    this.kanaType = 'hiragana'; // 'hiragana' | 'katakana' | 'mixed'
    this.mixedTypes = new Map(); // romaji -> 'hiragana' | 'katakana' (used in mixed mode)
    this.selectedRow = 'all';
    this.currentIndex = 0;
    this.cards = [];
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

    this.btnPrev = document.getElementById('fc-prev');
    this.btnNext = document.getElementById('fc-next');
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
    // Card flip on click
    if (this.cardElement) {
      this.cardElement.addEventListener('click', (e) => {
        // Prevent flip if clicking audio or mastered button directly
        if (e.target.closest('.no-flip')) return;
        this.toggleFlip();
      });
    }

    if (this.btnFlip) {
      this.btnFlip.addEventListener('click', () => this.toggleFlip());
    }

    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => this.prevCard());
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.nextCard());
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
          if (this.kanaType === 'mixed') this.rollMixedTypes();
          this.render();
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
        this.nextCard();
      } else if (e.code === 'ArrowLeft') {
        this.prevCard();
      } else if (e.code === 'KeyP') {
        this.playCurrentAudio();
      }
    });
  }

  updateCardSet() {
    this.cards = getFilteredKana(this.selectedRow);
    if (this.cards.length === 0) {
      this.cards = getFilteredKana('all');
    }
    this.currentIndex = 0;
    this.isFlipped = false;
    this.rollMixedTypes();
    this.render();
  }

  // In mixed mode each card is randomly shown as hiragana or katakana
  rollMixedTypes() {
    this.mixedTypes.clear();
    this.cards.forEach(card => {
      this.mixedTypes.set(card.romaji, Math.random() < 0.5 ? 'hiragana' : 'katakana');
    });
  }

  getCardType(card) {
    if (this.kanaType !== 'mixed') return this.kanaType;
    return this.mixedTypes.get(card.romaji) || 'hiragana';
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    if (this.cardElement) {
      this.cardElement.classList.toggle('flipped', this.isFlipped);
    }
    soundCtrl.playPop();
  }

  nextCard() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.resetFlipAndRender();
  }

  prevCard() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.resetFlipAndRender();
  }

  shuffleCards() {
    // Fisher-Yates shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    this.currentIndex = 0;
    this.rollMixedTypes();
    soundCtrl.playPop();
    this.resetFlipAndRender();
  }

  resetFlipAndRender() {
    this.isFlipped = false;
    if (this.cardElement) {
      this.cardElement.classList.remove('flipped');
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
    return this.cards[this.currentIndex] || null;
  }

  render() {
    const current = this.getCurrentCard();
    if (!current) return;

    const char = this.getCardType(current) === 'hiragana' ? current.hiragana : current.katakana;
    const altChar = this.getCardType(current) === 'hiragana' ? current.katakana : current.hiragana;

    if (this.cardFrontChar) this.cardFrontChar.textContent = char;
    if (this.cardBackRomaji) this.cardBackRomaji.textContent = current.romaji;
    if (this.cardBackAlt) this.cardBackAlt.textContent = altChar;

    if (this.counterEl) {
      this.counterEl.textContent = `${this.currentIndex + 1} / ${this.cards.length}`;
    }

    if (this.progressBar) {
      const pct = ((this.currentIndex + 1) / this.cards.length) * 100;
      this.progressBar.style.width = `${pct}%`;
    }

    this.updateMasteredUI();
  }
}
