const dropList = document.querySelectorAll('.drop-list select'),
  fromCurrency = document.querySelector('.from select'),
  toCurrency = document.querySelector('.to select'),
  getButton = document.querySelector('form button');

for (let i = 0; i < dropList.length; i++) {
  for (currency_code in country_list) {
    // menetapkan USD secara default sebagai mata uang dan IDR sebagai tujuan konversi mata uang
    let selected;
    if (i == 0) {
      selected = currency_code == 'USD' ? 'selected' : '';
    } else if (i == 1) {
      selected = currency_code == 'IDR' ? 'selected' : '';
    }

    // membuat tag opsi dengan meneruskan kode mata uang sebagai teks dan nilai
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;

    // memasukkan tag opsi ke dalam tag pilih
    dropList[i].insertAdjacentHTML('beforeend', optionTag);
  }
  dropList[i].addEventListener('change', (e) => {
    loadFlag(e.target); // memanggil loadflag dengan meneruskan elemen target sebagai argumen
  });
}

function loadFlag(element) {
  for (code in country_list) {
    if (code == element.value) {
      // jika kode mata uang daftar negara sama dengan nilai opsi
      let imgTag = element.parentElement.querySelector('img'); //memilih tag img dari daftar drop tertentu
      // menyambungkan kode negara dari kode mata uang yang dipilih dengan API
      imgTag.src = `https://flagsapi.com/${country_list[code]}/flat/64.png`;
    }
  }
}

window.addEventListener('load', () => {
  getExchangeRate();
});

getButton.addEventListener('click', (e) => {
  e.preventDefault(); // mencegah formulir dikirimkan
  getExchangeRate();
});

const exchangeIcon = document.querySelector('.drop-list .icon');
exchangeIcon.addEventListener('click', () => {
  let tempCode = fromCurrency.value; // kode mata uang sementara dari daftar droplist
  fromCurrency.value = toCurrency.value; // meneruskan ke kode mata uang KE dari kode mata uang
  toCurrency.value = tempCode; // meneruskan kode mata uang sementara ke kode mata uang KE
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector('.amount input');
  exchangeRateTxt = document.querySelector('.exchange-rate');
  let amountVal = amount.value;
  // default akan menampilkan angka 1
  if (amountVal == '' || amountVal == '0') {
    amount.value = '1';
    amountVal = 1;
  }

  exchangeRateTxt.innerText = 'Getting exchange rate...';
  let url = `https://v6.exchangerate-api.com/v6/fc4befd1872c365c2034e37f/latest/USD`;
  // mengambil respons api dan mengembalikannya dengan penguraian ke objek js dan metode lain yang diperlukan
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      // jika pengguna offline atau ada kesalahan lain yang terjadi saat mengambil data,,maka saat inilah fungsi catch akan berjalan
      exchangeRateTxt.innerText = 'Terdapat Kesalahan!';
    });
}
