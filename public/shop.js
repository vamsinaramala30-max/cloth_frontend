document.addEventListener('DOMContentLoaded', () => {
  const CONFIG = { endpoint: 'http://localhost:5000/api/products' };
  const container = document.getElementById('catalog-grid');
  const metric = document.getElementById('total-metric');
  const categorySelector = document.getElementById('filter-category');
  const sortSelector = document.getElementById('sort-engine');

  let activeProductCollection = [];

  function compileLiveQuery() {
    container.innerHTML = Array.from({ length: 4 }).map(() => `<div class="w-full aspect-[3/4] shimmer-bg"></div>`).join('');
    
    const category = categorySelector.value;
    const sort = sortSelector.value;
    const targetUrl = `${CONFIG.endpoint}?category=${category}&sort=${sort}`;

    fetch(targetUrl)
      .then(res => res.json())
      .then(payload => {
        if (!payload.success || !payload.data.length) {
          container.innerHTML = `<p class="col-span-full font-mono text-xs tracking-widest text-zinc-600 text-center py-24">NO PATTERNS MATCH THE REQUISITE SELECTION.</p>`;
          metric.textContent = "0 CURATED DESIGNS";
          return;
        }

        activeProductCollection = payload.data;
        metric.textContent = `${activeProductCollection.length} CURATED DESIGNS`;
        renderGrid();
      })
      .catch(() => {
        container.innerHTML = `<p class="col-span-full font-mono text-xs tracking-widest text-red-500 text-center py-24">CATALOG SYNCHRONIZATION FAULT.</p>`;
      });
  }

  function renderGrid() {
    container.innerHTML = '';
    activeProductCollection.forEach(product => {
      const primaryImg = product.variants?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000';
      const secondaryImg = product.variants?.[0]?.images?.[1] || primaryImg;
      const displayPrice = (Number(product.salePrice) || Number(product.basePrice) || 0).toFixed(2);
      
      const cardHtml = `
        <div class="group relative block w-full bg-transparent overflow-hidden opacity-0" style="animation: revealCard 0.8s ease forwards;" onclick="window.location.href='product.html?slug=${product.slug}'">
          <div class="relative aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a]">
            <img src="${primaryImg}" alt="${product.name}" class="absolute inset-0 object-cover w-full h-full transition-all duration-[1500ms] ease-[0.16,1,0.3,1] group-hover:opacity-0 group-hover:scale-102" />
            <img src="${secondaryImg}" alt="${product.name}" class="absolute inset-0 object-cover w-full h-full opacity-0 transition-all duration-[1500ms] ease-[0.16,1,0.3,1] group-hover:opacity-100 group-hover:scale-105" />
            <div class="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/[0.04] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <p class="text-[9px] font-mono tracking-widest text-white uppercase">Quick View</p>
            </div>
          </div>
          <div class="pt-6 flex justify-between items-start text-xs font-light">
            <div class="flex flex-col gap-1">
              <h3 class="text-zinc-200 tracking-widest uppercase transition-colors group-hover:text-white">${product.name}</h3>
              <span class="text-[9px] font-mono text-zinc-500 tracking-wider">${product.category}</span>
            </div>
            <p class="text-white font-medium tracking-widest">$${displayPrice}</p>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHtml);
    });

    if (!document.getElementById('card-animation-style')) {
      const style = document.createElement('style');
      style.id = 'card-animation-style';
      style.textContent = `@keyframes revealCard { from { opacity:0; transform:translate3d(0,25px,0); } to { opacity:1; transform:translate3d(0,0,0); } }`;
      document.head.appendChild(style);
    }
  }

  categorySelector.addEventListener('change', compileLiveQuery);
  sortSelector.addEventListener('change', compileLiveQuery);
  compileLiveQuery();
});