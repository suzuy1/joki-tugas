export const EXPENSE_CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Tempat Tinggal",
  "Belanja",
  "Hiburan",
  "Kesehatan",
  "Tagihan & Utilitas",
  "Pendidikan",
  "Lainnya"
];

export const INCOME_CATEGORIES = [
  "Gaji",
  "Bonus",
  "Investasi",
  "Paruh Waktu",
  "Hadiah",
  "Lainnya"
];

export const MOCK_TRANSACTIONS = [
  {
    id: '1',
    date: new Date().toISOString(),
    description: 'Gaji Bulanan',
    amount: 15000000,
    type: 'INCOME',
    category: 'Gaji'
  },
  {
    id: '2',
    date: new Date().toISOString(),
    description: 'Belanja Mingguan',
    amount: 500000,
    type: 'EXPENSE',
    category: 'Makanan & Minuman'
  }
];