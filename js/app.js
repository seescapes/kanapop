/**
 * Application Entrypoint & Tab Switcher
 */
import { soundCtrl } from './audio.js';
import { FlashcardController } from './flashcard.js';
import { BubblePopGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Controllers
  const flashcardCtrl = new FlashcardController();
  const gameCtrl = new BubblePopGame();

  // Tab Navigation
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetTabId);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // If switching away from game, pause it
      if (targetTabId !== 'tab-game' && gameCtrl.isPlaying && !gameCtrl.isPaused) {
        gameCtrl.togglePause();
      }

      soundCtrl.playPop();
    });
  });

  // Sound & Voice Toggle Buttons in Header
  const btnToggleSfx = document.getElementById('btn-toggle-sfx');
  const btnToggleVoice = document.getElementById('btn-toggle-voice');

  if (btnToggleSfx) {
    btnToggleSfx.addEventListener('click', () => {
      soundCtrl.sfxEnabled = !soundCtrl.sfxEnabled;
      btnToggleSfx.classList.toggle('muted', !soundCtrl.sfxEnabled);
    });
  }

  if (btnToggleVoice) {
    btnToggleVoice.addEventListener('click', () => {
      soundCtrl.voiceEnabled = !soundCtrl.voiceEnabled;
      btnToggleVoice.classList.toggle('muted', !soundCtrl.voiceEnabled);
    });
  }
});
