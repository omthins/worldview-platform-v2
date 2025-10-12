// 触屏设备检测和优化工具

// 检测是否为触屏设备
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

// 添加触屏设备类名到body
export const addTouchClass = () => {
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }
};

// 防止双击缩放
export const preventDoubleTapZoom = () => {
  if (isTouchDevice()) {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
};

// 优化滚动性能
export const optimizeScroll = () => {
  if (isTouchDevice()) {
    // 使用passive事件监听器提高滚动性能
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
  }
};

// 初始化触屏优化
export const initTouchOptimizations = () => {
  addTouchClass();
  preventDoubleTapZoom();
  optimizeScroll();
};

// 触摸波纹效果
export const createRippleEffect = (element, event) => {
  if (!isTouchDevice()) return;
  
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  // 添加波纹样式（如果尚未添加）
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// 为按钮添加触摸波纹效果
export const addRippleToButtons = () => {
  if (!isTouchDevice()) return;
  
  const buttons = document.querySelectorAll('button, .btn, .ripple-btn');
  buttons.forEach(button => {
    button.addEventListener('touchstart', (e) => {
      createRippleEffect(button, e.touches[0]);
    }, { passive: true });
  });
};

// 触摸滑动检测
export const addSwipeDetection = (element, callbacks) => {
  if (!isTouchDevice()) return null;
  
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  };
  
  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && callbacks.onSwipeRight) {
          callbacks.onSwipeRight();
        } else if (deltaX < 0 && callbacks.onSwipeLeft) {
          callbacks.onSwipeLeft();
        }
      }
    } else {
      // 垂直滑动
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0 && callbacks.onSwipeDown) {
          callbacks.onSwipeDown();
        } else if (deltaY < 0 && callbacks.onSwipeUp) {
          callbacks.onSwipeUp();
        }
      }
    }
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // 返回清理函数
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};