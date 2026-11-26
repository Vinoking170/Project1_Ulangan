let keranjang = [];

function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

function tambahPesanan(namaMenu, harga, idSelectPedas) {
    let keterangan = "";
    
    if (idSelectPedas) {
        const level = document.getElementById(idSelectPedas).value;
        keterangan = ` (${level})`;
    }

    const namaLengkap = namaMenu + keterangan;

    const itemAda = keranjang.find(item => item.nama === namaLengkap);
    if (itemAda) {
        itemAda.jumlah += 1;
    } else {
        keranjang.push({
            nama: namaLengkap,
            harga: harga,
            jumlah: 1
        });
    }

    tampilkanKeranjang();
}

function hapusItem(index) {
    keranjang.splice(index, 1);
    tampilkanKeranjang();
}

function tampilkanKeranjang() {
    const daftarEl = document.getElementById('daftar-keranjang');
    const totalEl = document.getElementById('total-harga');
    
    daftarEl.innerHTML = '';
    let totalHarga = 0;

    if (keranjang.length === 0) {
        daftarEl.innerHTML = '<li class="empty-msg">Belum ada menu yang dipilih.</li>';
        totalEl.textContent = 'Rp 0';
        return;
    }

    keranjang.forEach((item, index) => {
        const subtotal = item.harga * item.jumlah;
        totalHarga += subtotal;

        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${item.jumlah}x</strong> ${item.nama} - ${formatRupiah(subtotal)}</span>
            <button class="btn-hapus" onclick="hapusItem(${index})">Hapus</button>
        `;
        daftarEl.appendChild(li);
    });

    totalEl.textContent = formatRupiah(totalHarga);
}

function kirimWhatsApp() {
    if (keranjang.length === 0) {
        alert("Silakan pilih minimal 1 menu terlebih dahulu!");
        return;
    }

    const namaPemesan = document.getElementById('nama-pemesan').value.trim();
    const alamatPemesan = document.getElementById('alamat-pemesan').value.trim();

    if (!namaPemesan) {
        alert("Mohon isi nama Anda terlebih dahulu.");
        return;
    }

    const nomorWA = "6281234567890";

    let pesan = `Halo *Waroeng Nasi Goreng*, saya mau pesan:\n\n`;
    let totalHarga = 0;

    keranjang.forEach(item => {
        const subtotal = item.harga * item.jumlah;
        totalHarga += subtotal;
        pesan += `• ${item.jumlah}x ${item.nama} (${formatRupiah(subtotal)})\n`;
    });

    pesan += `\n*Total: ${formatRupiah(totalHarga)}*\n`;
    pesan += `----------------------------\n`;
    pesan += `Nama: ${namaPemesan}\n`;
    pesan += `Alamat/Meja: ${alamatPemesan || '-'}\n`;

    const urlWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWA, '_blank');
}
