(() => {
  const $ = window.jQuery;
  const form = $('#clientForm');
  const recordsKey = 'nexo-client-records';
  const editKey = 'nexo-client-edit';
  const savedKey = 'nexo-client-saved';
  const params = new URLSearchParams(window.location.search);
  let draft = null;
  try { draft = JSON.parse(sessionStorage.getItem(editKey) || 'null'); } catch { draft = null; }
  const editing = params.get('mode') === 'edit' && draft;

  if (editing) {
    $('#pageTitle').text('Alterar cliente');
    $('#breadcrumbTitle').text('Alterar cadastro');
    $('#saveClient').html('<i class="bi bi-check2"></i> Salvar alterações');
    $('title').text('Alterar cliente · Nexo Admin');
    ['name', 'email', 'cpf', 'cnpj', 'birthDate', 'rg', 'city', 'state', 'address'].forEach((key) => {
      const field = form.find(`[name="${key}"]`);
      if (field.length && draft[key]) field.val(draft[key]);
    });
  }

  if (window.Inputmask) {
    Inputmask({ mask: '999.999.999-99', clearIncomplete: false }).mask(document.getElementById('clientCpf'));
    Inputmask({ mask: '99.999.999/9999-99', clearIncomplete: false }).mask(document.getElementById('clientCnpj'));
    Inputmask({ mask: '99/99/9999', clearIncomplete: false }).mask(document.getElementById('clientBirthDate'));
  }

  form.on('submit', function (event) {
    event.preventDefault();
    if (!form.valid()) return;

    const values = Object.fromEntries(new FormData(this).entries());
    const id = editing ? draft.id : `client-${Date.now()}`;
    const record = {
      ...(editing ? draft : {}),
      ...values,
      id,
      phone: editing ? draft.phone || '' : '',
      category: editing ? draft.category || 'Cliente' : 'Cliente',
      status: editing ? draft.status || 'Ativo' : 'Ativo',
      registrationDate: editing ? draft.registrationDate || '' : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()),
      amount: editing ? draft.amount || 'R$ 0,00' : 'R$ 0,00',
      isNew: editing ? Boolean(draft.isNew) : true
    };
    let records = {};
    try { records = JSON.parse(sessionStorage.getItem(recordsKey) || '{}'); } catch { records = {}; }
    records[id] = record;
    sessionStorage.setItem(recordsKey, JSON.stringify(records));
    sessionStorage.setItem(savedKey, JSON.stringify({ ...record, action: editing ? 'updated' : 'created' }));
    sessionStorage.removeItem(editKey);
    window.location.href = './clientes.html';
  });
})();
