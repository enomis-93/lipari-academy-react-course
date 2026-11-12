// Script incluso in fondo a ogni pagina generata.
// TinyMCE toglie gli attributi onclick: il pulsante si riconosce dalla classe e il clic
// viene gestito per delegazione sul documento. La guardia evita la doppia installazione.
export const copyScript = `(function () {
  if (window.lipariBankCopyHandlerInstalled) return;
  window.lipariBankCopyHandlerInstalled = true;

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.copy-code-btn');
    if (!button) return;

    // Dentro un accordion il pulsante sta nel <summary>: senza questo il clic lo aprirebbe.
    event.preventDefault();

    var panel = button.closest('[data-copy-panel]');
    var code = panel && panel.querySelector('pre code');
    if (!code) return;

    var value = code.textContent;
    var original = button.innerHTML;

    function show(label) {
      button.innerHTML = label;
      window.setTimeout(function () { button.innerHTML = original; }, 1500);
    }

    function fallbackCopy() {
      var area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      var copied = false;
      try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
      document.body.removeChild(area);
      show(copied ? '✓ Copiato' : 'Copia non riuscita');
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(function () { show('✓ Copiato'); }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });
})();`;
