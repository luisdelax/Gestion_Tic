if (typeof window !== 'undefined') {
  window.showToast = function(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = '<span>' + (icons[type] || icons.info) + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    
    setTimeout(function() {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(function() { toast.remove(); }, 300);
    }, 4000);
  }
}
