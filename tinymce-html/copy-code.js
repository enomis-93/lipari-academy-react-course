(function () {
  if (window.lipariBankCopyHandlerInstalled) return;
  window.lipariBankCopyHandlerInstalled = true;

  document.addEventListener('click', async function (event) {
    var button = event.target.closest('.copy-code-btn');
    if (!button) return;

    event.preventDefault();

    var panel = button.closest('[data-copy-panel]');
    if (!panel) panel = button.parentElement.parentElement;

    var code = panel.querySelector('pre code');
    if (!code) return;

    var value = code.textContent;
    var originalContent = button.innerHTML;
    var originalLabel = button.getAttribute('aria-label') || 'Copy code';

    function showSuccess() {
      button.textContent = 'Copied!';
      button.setAttribute('aria-label', 'Code copied');
      window.setTimeout(function () {
        button.innerHTML = originalContent;
        button.setAttribute('aria-label', originalLabel);
      }, 1500);
    }

    function fallbackCopy() {
      var textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      var copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        copied = false;
      }

      document.body.removeChild(textarea);

      if (copied) showSuccess();
      else button.textContent = 'Copy failed';
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        showSuccess();
      } else {
        fallbackCopy();
      }
    } catch (error) {
      fallbackCopy();
    }
  });
})();
