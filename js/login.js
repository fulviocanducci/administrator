(() => {
  const loginForm = $('#loginForm');
  const recoveryForm = $('#recoveryForm');

  $('#togglePassword').on('click', function () {
    const password = $('#loginPassword');
    const show = password.attr('type') === 'password';
    password.attr('type', show ? 'text' : 'password');
    $(this).attr('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    $(this).find('i').toggleClass('bi-eye bi-eye-slash');
    password.trigger('focus');
  });

  loginForm.on('submit', function (event) {
    event.preventDefault();
    if (!loginForm.valid()) return;
    const button = $('.login-submit');
    button.prop('disabled', true).html('<span>Entrando...</span><span class="spinner-border spinner-border-sm" aria-hidden="true"></span>');
    window.setTimeout(() => { window.location.href = './index.html'; }, 450);
  });

  recoveryForm.on('submit', function (event) {
    event.preventDefault();
    if (!recoveryForm.valid()) return;
    $('#recoveryFeedback').text('Solicitação de demonstração registrada. O envio real requer integração com o servidor.').css('color', '#279d79');
  });

  $('#recoveryModal').on('hidden.bs.modal', () => {
    recoveryForm[0].reset();
    recoveryForm.data('validator')?.resetForm();
    recoveryForm.find('.input-validation-error').removeClass('input-validation-error');
    recoveryForm.find('[data-valmsg-for]').removeClass('field-validation-error').addClass('field-validation-valid').empty();
    $('#recoveryFeedback').text('').css('color', '');
  });
})();
