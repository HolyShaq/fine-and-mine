const sidebar = document.getElementById('Details-menu-drawer-container');

sidebar.addEventListener('toggle', () => {
  const lockStyles = {
    overflow: 'hidden',
    height: '100vh',
  };

  const unlockStyles = {
    overflow: '',
    height: '',
  };

  if (sidebar.open) {
    Object.assign(document.body.style, lockStyles);
    Object.assign(document.documentElement.style, lockStyles); // <html>
  } else {
    Object.assign(document.body.style, unlockStyles);
    Object.assign(document.documentElement.style, unlockStyles);
  }
});
