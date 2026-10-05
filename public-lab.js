(() => {
  const button = document.getElementById('copy-lab-code');
  const code = document.getElementById('lab-install-code');
  const status = document.getElementById('lab-copy-status');
  let feedbackTimer;
  button.addEventListener('click', async () => {
    clearTimeout(feedbackTimer);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.innerHTML = 'Copied <span aria-hidden="true">✓</span>';
      status.textContent = 'All installation commands copied.';
      feedbackTimer = setTimeout(() => {
        button.innerHTML = 'Copy <span aria-hidden="true">⧉</span>';
        status.textContent = '';
      }, 4000);
    } catch {
      const selection = getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Copy unavailable. Commands selected — press Ctrl+C or ⌘C.';
    }
  });
})();
