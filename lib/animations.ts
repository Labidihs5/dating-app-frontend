/**
 * Animation utilities for the dating app
 */

export const cardAnimations = {
  swipeRight: 'animate-out slide-out-to-right-1/2 fade-out duration-300',
  swipeLeft: 'animate-out slide-out-to-left-1/2 fade-out duration-300',
  swipeUp: 'animate-out slide-out-to-top fade-out duration-300',
};

export const buttonAnimations = {
  hover: 'hover:scale-105 transition-transform',
  click: 'active:scale-95 transition-transform',
  pulse: 'animate-pulse',
};

export const notificationAnimations = {
  enter: 'animate-in fade-in zoom-in-95 duration-200',
  exit: 'animate-out fade-out zoom-out-95 duration-200',
  bounce: 'animate-bounce',
};

export const pageAnimations = {
  enter: 'animate-in fade-in duration-300',
  exit: 'animate-out fade-out duration-300',
};

/**
 * Trigger confetti animation
 */
export function triggerConfetti() {
  const particles = 50;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';

  for (let i = 0; i < particles; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '50%';
    confetti.style.animation = `fall ${2 + Math.random()}s linear forwards`;

    container.appendChild(confetti);
  }

  document.body.appendChild(container);

  setTimeout(() => container.remove(), 3000);
}

/**
 * Trigger vibration feedback (haptic)
 */
export function triggerVibration(duration: number = 50) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

/**
 * Trigger success notification style
 */
export function triggerSuccessAnimation() {
  triggerConfetti();
  triggerVibration(100);
}
