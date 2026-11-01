(() => {
  const $ = window.jQuery;
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('appToast'), { delay: 2800 });
  const showToast = (message) => {
    $('#toastMessage').text(message);
    toast.show();
  };

  const today = new Date();
  $('#todayLabel').text(new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(today).toUpperCase());
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
    const href = $(this).attr('href');
    if (!href.startsWith('#')) return;
    event.preventDefault();
    $('.side-link').removeClass('active');
    $(this).addClass('active');
    const label = $(this).find('span').first().text();
    $('.breadcrumb-line strong').text(label);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.matchMedia('(max-width: 991px)').matches) closeSidebar();
  });

  $(document).on('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
  });

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
})();
