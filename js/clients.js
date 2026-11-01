(() => {
  const $ = window.jQuery;
  const form = $('#clientForm');
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('clientModal'));
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('appToast'), { delay: 2800 });
  let editingRow = null;

  const showToast = (message) => {
    $('#toastMessage').text(message);
    toast.show();
  };
  const clearValidation = () => {
    form.data('validator')?.resetForm();
    form.find('.input-validation-error').removeClass('input-validation-error');
    form.find('[data-valmsg-for]').removeClass('field-validation-error').addClass('field-validation-valid').empty();
  };
  const resetForm = () => {
    form[0].reset();
    $('#clientCategory').val('').trigger('change');
    clearValidation();
  };
  const setMode = (isEdit) => {
    $('#clientModalTitle').text(isEdit ? 'Alterar cadastro' : 'Novo cadastro');
    $('#saveClientButton').html(isEdit ? '<i class="bi bi-check2 me-1"></i>Salvar alterações' : '<i class="bi bi-check2 me-1"></i>Salvar cliente');
  };
  const safe = (value) => $('<span>').text(value).html();
  const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
  const statusClass = (status) => status === 'Ativo' ? 'status-active' : 'status-pending';

  $('#clientCategory').select2({ placeholder: 'Selecione uma categoria', allowClear: true, width: '100%', dropdownParent: $('#clientModal') });
  $('#clientPhone').inputmask('(99) 99999-9999');

  $('[data-bs-target="#clientModal"]').on('click', () => {
    editingRow = null;
    resetForm();
    setMode(false);
  });

  $(document).on('click', '.edit-client', function () {
    editingRow = $(this).closest('tr');
    resetForm();
    setMode(true);
    $('#clientName').val(editingRow.find('.client-cell strong').text());
    $('#clientEmail').val(editingRow.find('.client-cell small').text());
    $('#clientPhone').val(editingRow.data('phone') || '');
    $('#clientCategory').val(editingRow.data('category') || '').trigger('change');
    $('#clientStatus').val(editingRow.find('.status-badge').text().trim());
    modal.show();
  });

  form.on('submit', function (event) {
    event.preventDefault();
    if (!form.valid()) return;

    const values = new FormData(this);
    const name = String(values.get('name')).trim();
    const email = String(values.get('email')).trim();
    const phone = String(values.get('phone')).trim();
    const category = String(values.get('category'));
    const status = String(values.get('status'));
    const initialsValue = initials(name);
    const initialsText = safe(initialsValue);
    const statusMarkup = `<span class="status-badge ${statusClass(status)}"><i></i>${safe(status)}</span>`;

    if (editingRow) {
      editingRow.data({ phone, category });
      editingRow.find('.client-avatar').text(initialsValue);
      editingRow.find('.client-cell strong').text(name);
      editingRow.find('.client-cell small').text(email);
      editingRow.find('.status-badge').replaceWith(statusMarkup);
      editingRow.find('.edit-client').attr('aria-label', `Alterar cadastro de ${safe(name)}`);
      showToast(`${name}: cadastro atualizado.`);
    } else {
      const today = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).replace('.', '');
      const row = `<tr data-phone="${safe(phone)}" data-category="${safe(category)}"><td><div class="client-cell"><span class="client-avatar avatar-violet">${initialsText}</span><span><strong>${safe(name)}</strong><small>${safe(email)}</small></span></div></td><td>${statusMarkup}</td><td>${safe(today)}</td><td class="amount-cell">R$ 0,00</td><td><button class="edit-client" type="button" aria-label="Alterar cadastro de ${safe(name)}"><i class="bi bi-pencil-square"></i></button></td></tr>`;
      $('.records-table tbody').prepend(row);
      $('#visibleClients').text(Number($('#visibleClients').text()) + 1);
      $('#totalClients').text(Number($('#totalClients').text()) + 1);
      showToast(`${name}: cadastro adicionado.`);
    }

    modal.hide();
  });

  $('#clientModal').on('hidden.bs.modal', () => {
    resetForm();
    editingRow = null;
    setMode(false);
  });
})();
