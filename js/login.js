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

  loginForm.validate({
    errorClass: 'error',
    errorElement: 'span',
    rules: {
      email: { required: true, email: true },
      password: { required: true, minlength: 6 }
    },
    messages: {
      email: { required: 'Informe seu e-mail.', email: 'Digite um e-mail válido.' },
      password: { required: 'Informe sua senha.', minlength: 'A senha deve ter pelo menos 6 caracteres.' }
    },
    submitHandler() {
      const button = $('.login-submit');
      button.prop('disabled', true).html('<span>Entrando...</span><span class="spinner-border spinner-border-sm" aria-hidden="true"></span>');
      window.setTimeout(() => { window.location.href = './index.html'; }, 450);
      return false;
    }
  });

  recoveryForm.validate({
    errorClass: 'error',
    errorElement: 'span',
    rules: { email: { required: true, email: true } },
    messages: { email: { required: 'Informe seu e-mail.', email: 'Digite um e-mail válido.' } },
    errorPlacement(error, element) { error.insertAfter(element); },
    submitHandler() {
      $('#recoveryFeedback').text('Solicitação de demonstração registrada. O envio real requer integração com o servidor.').css('color', '#279d79');
      return false;
    }
  });

  $('#recoveryModal').on('hidden.bs.modal', () => {
    recoveryForm[0].reset();
    recoveryForm.validate().resetForm();
    $('#recoveryFeedback').text('').css('color', '');
    recoveryForm.find('.error').removeClass('error');
  });
})();
