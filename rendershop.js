const UI = {
    async renderShop() {
        try {
            const response = await fetch('http://127.0.0.1:5002/api/products');
            const products = await response.json();
            
            const grid = document.getElementById('product-grid');
            grid.innerHTML = products.map(p => `
                <div class="col-md-4 col-lg-3">
                    <div class="product-card">
                        <div class="img-container" onclick="UI.viewDetails('${p._id}')">
                            <img src="${p.image}">
                        </div>
                        <button class="btn btn-luxury add-quick" onclick="Cart.add('${p._id}')">Add to Bag</button>
                        <div class="text-center mt-3">
                            <h6 class="text-uppercase small mb-1">${p.name}</h6>
                            <p class="text-muted small">$${p.price.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            console.error("Connection to backend failed.");
        }
    }
};