const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static('.'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_waroeng'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke MySQL:', err);
        return;
    }
    console.log('Berhasil terhubung ke database MySQL (db_waroeng)!');
});

app.post('/simpan-pesanan', (req, res) => {
    const { nama, alamat, total, items } = req.body;

    db.query('INSERT INTO pelanggan (nama_pelanggan, alamat) VALUES (?, ?)', [nama, alamat], (err, resultPelanggan) => {
        if (err) return res.status(500).json({ status: 'error', pesan: err.message });

        const idPelanggan = resultPelanggan.insertId;

        db.query('INSERT INTO penjualan (id_pelanggan, total_bayar) VALUES (?, ?)', [idPelanggan, total], (err, resultPenjualan) => {
            if (err) return res.status(500).json({ status: 'error', pesan: err.message });

            const idPenjualan = resultPenjualan.insertId;
            const values = items.map(item => [
                idPenjualan,
                item.nama,
                item.jumlah,
                item.harga * item.jumlah
            ]);

            db.query('INSERT INTO detail_penjualan (id_penjualan, nama_menu, jumlah, subtotal) VALUES ?', [values], (err) => {
                if (err) return res.status(500).json({ status: 'error', pesan: err.message });

                res.json({ status: 'sukses' });
            });
        });
    });
});

app.listen(3000, () => {
    console.log('Website berjalan di http://localhost:3000');
});
