document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('main section'); // Ambil semua section utama
    const navLinks = document.querySelectorAll('nav ul li a');

    // Fungsi untuk mengubah header saat scroll
    const handleScroll = () => {
        if (window.scrollY > 50) { // Jika scroll lebih dari 50px
            header.classList.add('solid-header');
            header.classList.remove('transparent-header');
        } else {
            header.classList.remove('solid-header');
            header.classList.add('transparent-header');
        }

        // Untuk menandai link aktif berdasarkan posisi scroll (hanya di halaman index.html)
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            let currentActiveSection = null;
            sections.forEach(section => {
                // Sesuaikan offset agar link aktif saat section masuk ke viewport, sedikit di bawah header
                const sectionTop = section.offsetTop - header.offsetHeight - 50;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    currentActiveSection = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active'); // Hapus class active dari semua link
                // Cek jika link mengarah ke halaman yang sama dan memiliki ID yang cocok
                if (link.getAttribute('href').includes('#' + currentActiveSection)) {
                    link.classList.add('active');
                } else if (link.getAttribute('href') === 'index.html' && currentActiveSection === null) {
                    // Menangani 'Beranda' jika di paling atas halaman utama
                    link.classList.add('active');
                }
            });
        } else if (window.location.pathname.endsWith('products.html')) {
            // Menangani 'Produk Kami' jika di halaman produk
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === 'products.html') {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Panggil sekali saat DOMContentLoaded untuk memastikan state awal yang benar
    handleScroll();

    // Smooth scroll for internal links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Hanya berlaku untuk link internal (yang diawali dengan #)
            if (href.startsWith('#')) {
                e.preventDefault(); // Mencegah perilaku default browser (loncat langsung)
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Hitung posisi scroll agar section muncul tepat di bawah header
                    const offsetTop = targetElement.offsetTop - header.offsetHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth' // Efek gulir halus
                    });
                }
            }
            // Untuk link ke halaman lain (misal: products.html atau index.html#section), biarkan default
            // Browser akan menangani navigasi antar halaman secara otomatis
        });
    });
});