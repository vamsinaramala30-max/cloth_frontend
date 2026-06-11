document.addEventListener('DOMContentLoaded', () => {
  initPremiumCursor();
  initCanvasFluidEngine();
  initParallaxScroll();
  syncGlobalBagCount();
  triggerCSSAnimations();
});

function initPremiumCursor() {
  const dot = document.getElementById('fluid-cursor');
  const aura = document.getElementById('fluid-cursor-aura');
  if (!dot || !aura) return;

  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.transform = `translate3d(${targetX - 6}px, ${targetY - 6}px, 0)`;
  });

  // Smooth operational aura damping logic loop
  function tick() {
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;
    aura.style.transform = `translate3d(${currentX - 16}px, ${currentY - 16}px, 0)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Hover expansion behaviors
  document.querySelectorAll('a, button, select').forEach(element => {
    element.addEventListener('mouseenter', () => {
      dot.style.transform += ' scale(2)';
      aura.style.transform += ' scale(1.5)';
      aura.style.borderColor = 'rgba(255,255,255,1)';
    });
    element.addEventListener('mouseleave', () => {
      dot.style.transform = dot.style.transform.replace(' scale(2)', '');
      aura.style.transform = aura.style.transform.replace(' scale(1.5)', '');
      aura.style.borderColor = 'rgba(255,255,255,0.2)';
    });
  });
}

function initCanvasFluidEngine() {
  const canvas = document.getElementById('luxury-gl-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  const stars = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    stars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0 || s.x > width) s.vx *= -1;
      if (s.y < 0 || s.y > height) s.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

function initParallaxScroll() {
  const layer = document.getElementById('hero-parallax-bg');
  if (!layer) return;
  window.addEventListener('scroll', () => {
    const depth = window.scrollY;
    layer.style.transform = `translate3d(0, ${depth * 0.35}px, 0) scale(1.1)`;
  });
}

function syncGlobalBagCount() {
  const cart = JSON.parse(localStorage.getItem('rare_rabbit_cart')) || [];
  const total = cart.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const target = document.getElementById('nav-bag-count');
  if (target) target.textContent = total;
}

function triggerCSSAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    .animate-slide-up { animation: up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 1 !important; }
    .animate-slide-up-delayed { animation: up 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 1 !important; }
    @keyframes up { from { transform: translate3d(0, 40px, 0); opacity: 0; } to { transform: translate3d(0, 0, 0); opacity: 1; } }
  `;
  document.head.appendChild(style);
}