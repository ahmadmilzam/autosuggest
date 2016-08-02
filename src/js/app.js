;(function() {
  'use strict';

  console.log('app run');

  var formatSuggestionJson = [
    {
      title: 'Cara Belanja di Bukalapak',
      url: 'url/cara-belanja'
    },
    {
      title: 'Cara Berjualan di Bukalapak',
      url: 'url/cara-berjualan'
    },
    {
      title: 'Bagaimakan Proses Pencairan Uang',
      url: 'url/proses/pencairan/uang'
    },
    {
      title: 'Apa Itu BukaDompet',
      url: 'url/apa/itu/bukadompet'
    },
    {
      title: 'Membayar Tagihan Lewat Indomaret',
      url: 'url/membayar/tagihan/lewat/Indomaret'
    },
  ];

  AutoSuggest.init({
    delay: 250,
    ajaxSettings: {
      serviceURL: './search.php',
      type: 'GET',
      paramName: 'input'
    }
    // isLocal: true,
    // localData: formatSuggestionJson
  });

}());
