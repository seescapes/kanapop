/**
 * Bubble Pop Game Engine:
 * - Dynamic bubble physics & spawning
 * - Particle explosion on pop
 * - Combo multipliers & audio cues
 * - Health / Lives system (3 hearts)
 * - High score persistence
 */
import { KANA_DATA, KANA_ROWS, getFilteredKana } from './data.js';
import { soundCtrl } from './audio.js';

export class BubblePopGame {
  constructor() {
    this.kanaType = 'hiragana'; // 'hiragana' | 'katakana' | 'mixed'
    this.selectedRow = 'all';
    this.isPlaying = false;
    this.isPaused = false;

    // Game stats
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('kana_bubble_highscore') || '0', 10);
    this.lives = 3;
    this.maxLives = 3;
    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.totalAttempts = 0;
    this.missedItems = new Set();

    // Mechanics
    this.currentTarget = null;
    this.bubbles = [];
    this.particles = [];
    this.lastSpawnTime = 0;
    this.baseSpeed = 1.3;
    this.speedMultiplier = 1.0;
    this.animationFrameId = null;

    this.initDOM();
    this.bindEvents();
    this.updateHighScoreDisplay();
  }

  initDOM() {
    this.arena = document.getElementById('game-arena');
    this.targetRomajiEl = document.getElementById('target-romaji');
    this.targetTypeEl = document.getElementById('target-type');
    this.btnReplayVoice = document.getElementById('btn-replay-voice');

    this.scoreEl = document.getElementById('game-score');
    this.highScoreEl = document.getElementById('game-highscore');
    this.comboBadge = document.getElementById('combo-badge');
    this.comboCountEl = document.getElementById('combo-count');
    this.heartsContainer = document.getElementById('hearts-container');

    this.btnStart = document.getElementById('btn-start-game');
    this.btnPause = document.getElementById('btn-pause-game');
    this.gameControlsBar = document.getElementById('game-controls-bar');
    this.gameOverlay = document.getElementById('game-start-overlay');
    this.gameOverModal = document.getElementById('game-over-modal');

    // Game over elements
    this.finalScoreEl = document.getElementById('final-score');
    this.finalHighScoreEl = document.getElementById('final-highscore');
    this.finalAccuracyEl = document.getElementById('final-accuracy');
    this.finalMaxComboEl = document.getElementById('final-max-combo');
    this.missedReviewList = document.getElementById('missed-review-list');
    this.btnRestart = document.getElementById('btn-restart-game');

    // Filter selects in game settings
    this.gameRowSelect = document.getElementById('game-row-select');
    this.gameTypeSelect = document.getElementById('game-type-select');

    if (this.gameRowSelect) {
      this.gameRowSelect.innerHTML = KANA_ROWS.map(
        row => `<option value="${row.id}">${row.label}</option>`
      ).join('');
    }
  }

  bindEvents() {
    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => this.startGame());
    }

    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => {
        this.gameOverModal.classList.add('hidden');
        this.startGame();
      });
    }

    if (this.btnPause) {
      this.btnPause.addEventListener('click', () => this.togglePause());
    }

    if (this.btnReplayVoice) {
      this.btnReplayVoice.addEventListener('click', () => {
        if (this.currentTarget) {
          const char = this.currentTarget.type === 'hiragana'
            ? this.currentTarget.data.hiragana
            : this.currentTarget.data.katakana;
          soundCtrl.speak(char);
        }
      });
    }

    if (this.gameRowSelect) {
      this.gameRowSelect.addEventListener('change', (e) => {
        this.selectedRow = e.target.value;
      });
    }

    if (this.gameTypeSelect) {
      this.gameTypeSelect.addEventListener('change', (e) => {
        this.kanaType = e.target.value;
      });
    }

    // Touch & Click event handling on arena
    if (this.arena) {
      const handlePop = (e) => {
        if (!this.isPlaying || this.isPaused) return;
        const bubbleEl = e.target.closest('.kana-bubble');
        if (!bubbleEl) return;

        const bubbleId = parseInt(bubbleEl.dataset.id, 10);
        this.popBubble(bubbleId, bubbleEl);
      };

      this.arena.addEventListener('pointerdown', handlePop);
    }
  }

  updateHighScoreDisplay() {
    if (this.highScoreEl) {
      this.highScoreEl.textContent = this.highScore;
    }
  }

  updateHearts() {
    if (!this.heartsContainer) return;
    let html = '';
    for (let i = 0; i < this.maxLives; i++) {
      if (i < this.lives) {
        html += '<span class="heart active">❤️</span>';
      } else {
        html += '<span class="heart empty">🖤</span>';
      }
    }
    this.heartsContainer.innerHTML = html;
  }

  startGame() {
    this.isPlaying = true;
    this.isPaused = false;
    this.score = 0;
    this.lives = this.maxLives;
    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.totalAttempts = 0;
    this.speedMultiplier = 1.0;
    this.missedItems.clear();

    if (this.gameOverlay) this.gameOverlay.classList.add('hidden');
    if (this.gameOverModal) this.gameOverModal.classList.add('hidden');

    this.scoreEl.textContent = '0';
    this.updateHearts();
    this.updateComboUI();

    // Clear existing bubbles
    this.clearBubbles();
    this.nextTarget();

    this.lastSpawnTime = performance.now();
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));

    soundCtrl.playPop();
  }

  togglePause() {
    if (!this.isPlaying) return;
    this.isPaused = !this.isPaused;
    if (this.btnPause) {
      this.btnPause.textContent = this.isPaused ? '▶ เล่นต่อ' : '⏸ พักเกม';
    }
    if (!this.isPaused) {
      this.lastSpawnTime = performance.now();
      this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
    }
  }

  nextTarget() {
    const pool = getFilteredKana(this.selectedRow);
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    let type = this.kanaType;
    if (type === 'mixed') {
      type = Math.random() > 0.5 ? 'hiragana' : 'katakana';
    }

    this.currentTarget = {
      data: chosen,
      type: type
    };

    if (this.targetRomajiEl) {
      this.targetRomajiEl.textContent = chosen.romaji.toUpperCase();
    }

    if (this.targetTypeEl) {
      this.targetTypeEl.textContent = type === 'hiragana' ? 'Hiragana (ひらがな)' : 'Katakana (カタカナ)';
    }

    // Play Japanese audio for new target
    const char = type === 'hiragana' ? chosen.hiragana : chosen.katakana;
    soundCtrl.speak(char);

    // Ensure a target bubble exists or is spawned promptly
    this.ensureTargetBubbleExists();
  }

  ensureTargetBubbleExists() {
    const hasTarget = this.bubbles.some(b => b.isTarget);
    if (!hasTarget) {
      this.spawnBubble(true);
    }
  }

  spawnBubble(forceTarget = false) {
    if (!this.currentTarget || !this.arena) return;

    const pool = getFilteredKana(this.selectedRow);
    const isTarget = forceTarget || Math.random() < 0.35; // 35% chance of target bubble

    let itemData;
    let itemType = this.currentTarget.type;

    if (isTarget) {
      itemData = this.currentTarget.data;
    } else {
      // Pick random non-target
      const others = pool.filter(p => p.romaji !== this.currentTarget.data.romaji);
      itemData = others.length > 0
        ? others[Math.floor(Math.random() * others.length)]
        : pool[Math.floor(Math.random() * pool.length)];
    }

    const char = itemType === 'hiragana' ? itemData.hiragana : itemData.katakana;
    const arenaRect = this.arena.getBoundingClientRect();
    const bubbleSize = Math.min(Math.max(arenaRect.width * 0.18, 64), 92);

    const minX = 10;
    const maxX = arenaRect.width - bubbleSize - 10;
    const startX = minX + Math.random() * Math.max(maxX - minX, 10);
    const startY = arenaRect.height + 10;

    // Speeds scale smoothly with player score
    const speed = (this.baseSpeed + Math.random() * 0.8) * this.speedMultiplier;
    const wobbleSpeed = 0.03 + Math.random() * 0.02;
    const wobbleAmp = 15 + Math.random() * 20;

    const bubbleId = Date.now() + Math.floor(Math.random() * 10000);

    const bubbleEl = document.createElement('div');
    bubbleEl.className = `kana-bubble bubble-color-${Math.floor(Math.random() * 5)}`;
    bubbleEl.dataset.id = bubbleId;
    bubbleEl.style.width = `${bubbleSize}px`;
    bubbleEl.style.height = `${bubbleSize}px`;
    bubbleEl.style.left = `${startX}px`;
    bubbleEl.style.top = `${startY}px`;

    bubbleEl.innerHTML = `
      <span class="bubble-char">${char}</span>
      <div class="bubble-shine"></div>
    `;

    this.arena.appendChild(bubbleEl);

    this.bubbles.push({
      id: bubbleId,
      element: bubbleEl,
      char: char,
      romaji: itemData.romaji,
      isTarget: isTarget,
      x: startX,
      y: startY,
      size: bubbleSize,
      speed: speed,
      wobbleSpeed: wobbleSpeed,
      wobbleAmp: wobbleAmp,
      wobbleOffset: Math.random() * Math.PI * 2
    });
  }

  popBubble(bubbleId, bubbleEl) {
    const index = this.bubbles.findIndex(b => b.id === bubbleId);
    if (index === -1) return;

    const bubble = this.bubbles[index];
    this.totalAttempts++;

    // Create pop particles
    this.createBurstParticles(bubble.x + bubble.size / 2, bubble.y + bubble.size / 2);

    if (bubble.isTarget) {
      // CORRECT!
      this.correctCount++;
      this.combo++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      // Combo multipliers: 1x, 2x (combo>=3), 3x (combo>=6), 5x (combo>=10)
      let multiplier = 1;
      if (this.combo >= 10) multiplier = 5;
      else if (this.combo >= 6) multiplier = 3;
      else if (this.combo >= 3) multiplier = 2;

      const gainedScore = 100 * multiplier;
      this.score += gainedScore;
      this.scoreEl.textContent = this.score;

      // Gradually increase speed as score builds up (capped at 2.4x)
      this.speedMultiplier = Math.min(1.0 + (this.score / 3000) * 0.8, 2.4);

      soundCtrl.playPop();
      soundCtrl.playCorrect(this.combo);

      if (this.combo === 5 || this.combo === 10 || this.combo === 15) {
        soundCtrl.playComboStreak();
      }

      this.showFloatingText(`+${gainedScore}`, bubble.x, bubble.y, 'correct');
      this.updateComboUI();

      // Remove popped bubble
      this.removeBubble(index);

      // Transition to next target!
      this.nextTarget();
    } else {
      // WRONG!
      this.combo = 0;
      this.lives--;
      this.updateHearts();
      this.updateComboUI();

      this.missedItems.add(this.currentTarget.data);
      soundCtrl.playPop();
      soundCtrl.playWrong();

      this.showFloatingText('ผิด! -1❤️', bubble.x, bubble.y, 'wrong');
      this.shakeArena();

      this.removeBubble(index);

      if (this.lives <= 0) {
        this.handleGameOver();
      }
    }
  }

  removeBubble(index) {
    if (index >= 0 && index < this.bubbles.length) {
      const b = this.bubbles[index];
      if (b.element && b.element.parentNode) {
        b.element.parentNode.removeChild(b.element);
      }
      this.bubbles.splice(index, 1);
    }
  }

  clearBubbles() {
    this.bubbles.forEach(b => {
      if (b.element && b.element.parentNode) {
        b.element.parentNode.removeChild(b.element);
      }
    });
    this.bubbles = [];
  }

  updateComboUI() {
    if (!this.comboBadge) return;
    if (this.combo >= 3) {
      this.comboBadge.classList.remove('hidden');
      if (this.comboCountEl) {
        this.comboCountEl.textContent = `${this.combo}x Combo!`;
      }
      this.comboBadge.classList.add('pulse');
    } else {
      this.comboBadge.classList.add('hidden');
      this.comboBadge.classList.remove('pulse');
    }
  }

  createBurstParticles(centerX, centerY) {
    if (!this.arena) return;
    const colors = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#ffffff'];

    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'pop-particle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 6 + Math.random() * 8;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.backgroundColor = color;
      p.style.left = `${centerX}px`;
      p.style.top = `${centerY}px`;

      const angle = Math.random() * Math.PI * 2;
      const velocity = 40 + Math.random() * 80;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;

      this.arena.appendChild(p);

      p.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
      ], {
        duration: 400 + Math.random() * 200,
        easing: 'cubic-bezier(0, .9, .57, 1)'
      }).onfinish = () => {
        if (p.parentNode) p.parentNode.removeChild(p);
      };
    }
  }

  showFloatingText(text, x, y, type = 'correct') {
    if (!this.arena) return;
    const floatEl = document.createElement('div');
    floatEl.className = `floating-score ${type}`;
    floatEl.textContent = text;
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;

    this.arena.appendChild(floatEl);

    floatEl.animate([
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(-40px)', opacity: 0 }
    ], {
      duration: 700,
      easing: 'ease-out'
    }).onfinish = () => {
      if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
    };
  }

  shakeArena() {
    if (!this.arena) return;
    this.arena.classList.add('shake');
    setTimeout(() => {
      this.arena.classList.remove('shake');
    }, 400);
  }

  handleGameOver() {
    this.isPlaying = false;
    cancelAnimationFrame(this.animationFrameId);
    soundCtrl.playGameOver();

    // Check High Score
    const isNewHigh = this.score > this.highScore;
    if (isNewHigh) {
      this.highScore = this.score;
      localStorage.setItem('kana_bubble_highscore', this.highScore.toString());
      this.updateHighScoreDisplay();
    }

    const accuracy = this.totalAttempts > 0
      ? Math.round((this.correctCount / this.totalAttempts) * 100)
      : 0;

    if (this.finalScoreEl) this.finalScoreEl.textContent = this.score;
    if (this.finalHighScoreEl) {
      this.finalHighScoreEl.textContent = isNewHigh
        ? `${this.highScore} (🎉 สถิติใหม่!)`
        : this.highScore;
    }
    if (this.finalAccuracyEl) this.finalAccuracyEl.textContent = `${accuracy}%`;
    if (this.finalMaxComboEl) this.finalMaxComboEl.textContent = `${this.maxCombo}x`;

    // Render missed characters review list
    if (this.missedReviewList) {
      if (this.missedItems.size === 0) {
        this.missedReviewList.innerHTML = '<span class="text-sm text-green-500">ยอดเยี่ยมมาก! ไม่มีตัวอักษรที่ตอบผิดเลย</span>';
      } else {
        const items = Array.from(this.missedItems);
        this.missedReviewList.innerHTML = items.map(item => `
          <div class="review-chip" data-char="${item.hiragana}">
            <span class="chip-kana">${item.hiragana} / ${item.katakana}</span>
            <span class="chip-romaji">${item.romaji}</span>
          </div>
        `).join('');

        // Make chips clickable to hear sound
        this.missedReviewList.querySelectorAll('.review-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            soundCtrl.speak(chip.dataset.char);
          });
        });
      }
    }

    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('hidden');
    }
  }

  gameLoop(currentTime) {
    if (!this.isPlaying || this.isPaused) return;

    // Spawn bubbles periodically
    const spawnInterval = Math.max(1400 - (this.score / 1000) * 150, 750);
    if (currentTime - this.lastSpawnTime > spawnInterval && this.bubbles.length < 6) {
      this.spawnBubble();
      this.lastSpawnTime = currentTime;
    }

    // Always ensure at least one target bubble is on screen
    if (!this.bubbles.some(b => b.isTarget)) {
      this.spawnBubble(true);
    }

    // Move bubbles up
    const arenaRect = this.arena.getBoundingClientRect();
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];

      // Update vertical position
      bubble.y -= bubble.speed;

      // Update horizontal wobble
      const wobbleX = Math.sin(currentTime * bubble.wobbleSpeed + bubble.wobbleOffset) * (bubble.wobbleAmp / 60);
      bubble.x += wobbleX;

      // Keep within arena bounds
      bubble.x = Math.max(5, Math.min(arenaRect.width - bubble.size - 5, bubble.x));

      // Apply transform for butter smooth 60fps
      bubble.element.style.transform = `translate3d(${bubble.x}px, ${bubble.y}px, 0)`;

      // If bubble escaped through top of arena
      if (bubble.y + bubble.size < -10) {
        if (bubble.isTarget) {
          // MISSED TARGET! Lose a life!
          this.lives--;
          this.combo = 0;
          this.updateHearts();
          this.updateComboUI();
          this.missedItems.add(this.currentTarget.data);
          soundCtrl.playWrong();
          this.showFloatingText('หลุดจอ! -1❤️', bubble.x, 30, 'wrong');

          if (this.lives <= 0) {
            this.removeBubble(i);
            this.handleGameOver();
            return;
          }
          // Change to next target so player isn't stuck
          this.nextTarget();
        }

        this.removeBubble(i);
      }
    }

    this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
  }
}
