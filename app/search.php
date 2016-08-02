<?php

$query = $_GET['input'];

$results = array();

$data = array(
  array(
    'title' => 'Cara Belanja Di Bukalapak',
    'url' => 'http://bukalapak.co.us/url/cara-belanja-di-bukalapak'
  ),
  array(
    'title' => 'Cara Bayar Di Bukalapak',
    'url' => 'http://bukalapak.co.us/url/cara-bayar-di-bukalapak'
  ),
  array(
    'title' => 'Apa Itu BukaDompet',
    'url' => 'http://bukalapak.co.us/url/apa-itu-bukadompet'
  ),
  array(
    'title' => 'Cara Mencairkan uang di BukaDompet',
    'url' => 'http://bukalapak.co.us/url/cara-mencairkan-uang-di-bukadompet'
  ),
  array(
    'title' => 'Cara Bayar Tagihan di Indomaret',
    'url' => 'http://bukalapak.co.us/url/cara-bayar-tagihan-di-indomaret'
  ),
  array(
    'title' => 'Buat Account Menggunakan Facebook',
    'url' => 'http://bukalapak.co.us/url/buat-account-menggunakan-facebook'
  ),
  array(
    'title' => 'Buat Account Menggunakan Twitter',
    'url' => 'http://bukalapak.co.us/url/buat-account-menggunakan-twitter'
  ),
  array(
    'title' => 'Buat Account Menggunakan Google Plus',
    'url' => 'http://bukalapak.co.us/url/buat-account-menggunakan-google'
  )
);


if (!empty($query)) {

  for ($i=0; $i < count($data); $i++) {
    $title = $data[$i]['title'];

    $lowercase_title = strtolower($title);
    $lowercase_query = strtolower($query);

    if (strpos($lowercase_title, $lowercase_query) !== false) {

      // var_dump($data[$i]);

      $results['results'][] = $data[$i];

    }

  }

  if (count($results['results']) > 0) {
    $results['status'] = 200;
  } else {
    $results['status'] = 400;
  }

}

// print_r($results);
echo json_encode($results);
exit();
