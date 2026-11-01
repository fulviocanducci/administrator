(() => {
  const $ = window.jQuery;
  const recordsKey = 'nexo-client-records';
  const savedKey = 'nexo-client-saved';
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('appToast'), { delay: 2800 });
  const safe = (value) => $('<span>').text(value || '').html();
  const getRecords = () => {
    try { return JSON.parse(sessionStorage.getItem(recordsKey) || '{}'); }
    catch { return {}; }
  };
  const showToast = (message) => {
    $('#toastMessage').text(message);
    toast.show();
  };
  const initials = (name) => String(name || '').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
  const statusClass = (status) => status === 'Ativo' ? 'status-active' : 'status-pending';
  const findRow = (id) => $('.records-table tbody tr').filter(function () { return $(this).attr('data-client-id') === id; });

  const renderRow = (record) => `<tr data-client-id="${safe(record.id)}" data-phone="${safe(record.phone)}" data-category="${safe(record.category)}"><td><div class="client-cell"><span class="client-avatar avatar-violet">${safe(initials(record.name))}</span><span><strong>${safe(record.name)}</strong><small>${safe(record.email)}</small></span></div></td><td><span class="status-badge ${statusClass(record.status)}"><i></i>${safe(record.status)}</span></td><td>${safe(record.registrationDate)}</td><td class="amount-cell">${safe(record.amount || 'R$ 0,00')}</td><td><button class="edit-client" type="button" aria-label="Alterar cadastro de ${safe(record.name)}"><i class="bi bi-pencil-square"></i></button></td></tr>`;
  const applyRecord = (record) => {
    let row = findRow(record.id);
    if (!row.length) {
      $('.records-table tbody').prepend(renderRow(record));
      return;
    }
    row.attr({ 'data-phone': record.phone || '', 'data-category': record.category || '' });
    row.find('.client-avatar').text(initials(record.name));
    row.find('.client-cell strong').text(record.name);
    row.find('.client-cell small').text(record.email);
    row.find('.status-badge').replaceWith(`<span class="status-badge ${statusClass(record.status)}"><i></i>${safe(record.status)}</span>`);
    if (record.registrationDate) row.children('td').eq(2).text(record.registrationDate);
    row.find('.amount-cell').text(record.amount || 'R$ 0,00');
    row.find('.edit-client').attr('aria-label', `Alterar cadastro de ${record.name}`);
  };

  const records = getRecords();
  Object.values(records).forEach(applyRecord);
  $('#totalClients').text(2486 + Object.values(records).filter((record) => record.isNew).length);
  const saved = sessionStorage.getItem(savedKey);
  if (saved) {
    try {
      const record = JSON.parse(saved);
      applyRecord(record);
      if (record.action === 'created') {
        showToast(`${record.name}: cadastro adicionado.`);
      } else if (record.action === 'updated') {
        showToast(`${record.name}: cadastro atualizado.`);
      }
    } catch { /* Ignore an invalid one-time draft. */ }
    sessionStorage.removeItem(savedKey);
  }
  $('#visibleClients').text($('.records-table tbody tr').length);

  $(document).on('click', '.edit-client', function () {
    const row = $(this).closest('tr');
    const id = row.attr('data-client-id');
    const records = getRecords();
    const record = records[id] || {
      id,
      name: row.find('.client-cell strong').text(),
      email: row.find('.client-cell small').text(),
      phone: row.attr('data-phone') || '',
      category: row.attr('data-category') || '',
      status: row.find('.status-badge').text().trim(),
      registrationDate: row.children('td').eq(2).text(),
      amount: row.find('.amount-cell').text(),
      isNew: false
    };
    sessionStorage.setItem('nexo-client-edit', JSON.stringify(record));
    window.location.href = './cliente-cadastro.html?mode=edit';
  });
})();
