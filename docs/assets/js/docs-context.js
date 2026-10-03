(function () {
  'use strict';
  var form = document.getElementById('docsContextForm');
  if (!form) return;
  var section = form.closest('[data-baseurl]');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var code = document.getElementById('docsCode').value;
    var provider = document.getElementById('docsProvider').value;
    window.location.assign(section.dataset.baseurl + '/' + code + '/' + provider + '/guides/vector-search/' + window.location.hash);
  });
})();
