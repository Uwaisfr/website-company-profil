// JavaScript for header scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero-section');
    const currentPath = window.location.pathname;

    // Determine if it's the homepage or other pages
    if (heroSection) { // If heroSection exists, it's index.html
        // Initial check for transparent header on homepage
        if (window.scrollY === 0) {
            header.classList.add('transparent-header');
            header.classList.remove('solid-header');
        } else {
            header.classList.add('solid-header');
            header.classList.remove('transparent-header');
        }

        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Adjust scroll threshold as needed
                header.classList.add('solid-header');
                header.classList.remove('transparent-header');
            } else {
                header.classList.add('transparent-header');
                header.classList.remove('solid-header');
            }
        });
    } else { // Not homepage, so default to solid-header
        header.classList.add('solid-header');
        header.classList.remove('transparent-header');
    }

    // --- Order Form Page Logic (for order-form.html) ---
    // Check if the current page is order-form.html
    // Use includes to check if the path contains 'order-form.html'
    if (currentPath.includes('order-form.html')) {
        const orderForm = document.getElementById('orderForm');
        const productNameInput = document.getElementById('productName');
        const productPriceDisplayInput = document.getElementById('productPriceDisplay');
        const productPriceHiddenInput = document.getElementById('productPrice');
        const quantityInput = document.getElementById('quantity');
        const totalPriceDisplayInput = document.getElementById('totalPriceDisplay');

        let currentProductPrice = 0; // To store the base price of the selected product

        // Function to parse URL parameters
        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        // Populate form fields from URL parameters
        const selectedProductName = getUrlParameter('product');
        const selectedProductPrice = getUrlParameter('price');

        if (selectedProductName && selectedProductPrice) {
            productNameInput.value = selectedProductName;
            currentProductPrice = parseInt(selectedProductPrice);
            productPriceHiddenInput.value = currentProductPrice;
            productPriceDisplayInput.value = formatRupiah(currentProductPrice);
            
            // Calculate initial total price
            let initialQuantity = parseInt(quantityInput.value);
            if (isNaN(initialQuantity) || initialQuantity < 1) {
                initialQuantity = 1;
                quantityInput.value = 1;
            }
            totalPriceDisplayInput.value = formatRupiah(currentProductPrice * initialQuantity);
        } else {
            // Handle case where no product data is in URL (e.g., direct access)
            productNameInput.value = 'Produk tidak ditemukan';
            productPriceDisplayInput.value = formatRupiah(0);
            totalPriceDisplayInput.value = formatRupiah(0);
            quantityInput.value = 0;
            // Optionally, disable form or show a message
        }

        // Update total price when quantity changes
        quantityInput.addEventListener('input', function() {
            let quantity = parseInt(this.value);
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1; // Ensure quantity is at least 1
                this.value = 1;
            }
            const totalPrice = currentProductPrice * quantity;
            totalPriceDisplayInput.value = formatRupiah(totalPrice);
        });

        // Handle form submission
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah form dari submit default

            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const quantity = document.getElementById('quantity').value;

            // Construct WhatsApp message
            const whatsappNumber = '6281234567890'; // Ganti dengan nomor WhatsApp UD WJM
            const message = `Halo UD WJM, saya ingin memesan produk berikut:%0A%0A` +
                            `*Produk:* ${productNameInput.value}%0A` +
                            `*Harga Satuan:* ${productPriceDisplayInput.value}%0A` +
                            `*Jumlah:* ${quantity} item%0A` +
                            `*Total Harga:* ${totalPriceDisplayInput.value}%0A%0A` +
                            `*Nama Pemesan:* ${customerName}%0A` +
                            `*Nomor HP:* ${customerPhone}%0A%0A` +
                            `Mohon konfirmasi pesanan saya. Terima kasih!`;

            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            // Open WhatsApp link
            window.open(whatsappLink, '_blank');
        });
    }

    // Helper function to format price to Rupiah
    function formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }
});