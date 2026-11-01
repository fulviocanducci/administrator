(() => {
  const $ = window.jQuery;
  const root = document.documentElement;
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('appToast'), { delay: 2800 });
  const showToast = (message) => {
    $('#toastMessage').text(message);
    toast.show();
  };

  const today = new Date();
  $('#todayLabel').text(new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(today).toUpperCase());
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const formatDate = (date) => new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(date).replace('.', '');
  $('#weekLabel').text(`${formatDate(monday)} — ${formatDate(sunday)}, ${sunday.getFullYear()}`);

  $('#themeToggle').on('click', function () {
    const nextTheme = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-bs-theme', nextTheme);
    $(this).find('i').toggleClass('bi-moon bi-sun');
    localStorage.setItem('nexo-theme', nextTheme);
  });
  const savedTheme = localStorage.getItem('nexo-theme');
  if (savedTheme === 'dark') {
    root.setAttribute('data-bs-theme', 'dark');
    $('#themeToggle i').removeClass('bi-moon').addClass('bi-sun');
  }

  const closeSidebar = () => {
    $('#sidebar').removeClass('is-open');
    $('#sidebarBackdrop').removeClass('is-visible');
    $('body').removeClass('sidebar-open');
  };
  $('#menuToggle').on('click', () => {
    $('#sidebar').addClass('is-open');
    $('#sidebarBackdrop').addClass('is-visible');
    $('body').addClass('sidebar-open');
  });
  $('#sidebarBackdrop').on('click', closeSidebar);
  $('.side-link').on('click', function (event) {
    event.preventDefault();
    $('.side-link').removeClass('active');
    $(this).addClass('active');
    const label = $(this).find('span').first().text();
    $('.breadcrumb-line strong').text(label);
    if (window.matchMedia('(max-width: 991px)').matches) closeSidebar();
  });

  $('.search-box input').on('focus', () => $('.search-box').addClass('is-open'));
  $('.search-box input').on('blur', () => $('.search-box').removeClass('is-open'));
  $(document).on('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      $('#globalSearch').trigger('focus');
    }
    if (event.key === 'Escape') closeSidebar();
  });

  $('.notification-button').on('click', () => showToast('Você está em dia! Nenhuma notificação nova.'));
  $('.profile-button').on('click', () => showToast('Perfil de Fulvio Costa'));
  $('.more-button, .row-more').on('click', function () {
    const name = $(this).closest('tr').find('.client-cell strong').text();
    showToast(name ? `Opções de ${name}` : 'Mais opções em breve');
  });
  $('.period-option').on('click', function () {
    $('.period-select').text($(this).text());
    showToast(`Período atualizado: ${$(this).text()}`);
  });
  $('.table-footer nav button:not(:disabled)').on('click', function () {
    $('.table-footer nav button').removeClass('current-page');
    $(this).addClass('current-page');
    showToast('Paginação de demonstração');
  });

  $('#newRecordForm').on('submit', function (event) {
    event.preventDefault();
    if (!this.reportValidity()) return;
    const form = new FormData(this);
    const name = String(form.get('name')).trim();
    const email = String(form.get('email')).trim();
    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    const status = String(form.get('status'));
    const safe = (value) => $('<span>').text(value).html();
    const statusClass = status === 'Ativo' ? 'status-active' : 'status-pending';
    const row = `<tr><td><div class="client-cell"><span class="client-avatar avatar-violet">${safe(initials)}</span><span><strong>${safe(name)}</strong><small>${safe(email)}</small></span></div></td><td><span class="status-badge ${statusClass}"><i></i>${safe(status)}</span></td><td>Hoje</td><td class="amount-cell">R$ 0,00</td><td><button class="row-more" aria-label="Opções para ${safe(name)}"><i class="bi bi-three-dots"></i></button></td></tr>`;
    $('.records-table tbody').prepend(row);
    $('#newRecordModal').modal('hide');
    this.reset();
    showToast(`${name} foi adicionado aos cadastros.`);
  });
})();
