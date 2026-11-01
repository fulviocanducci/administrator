(() => {
  $('.password-visibility').on('click', function () {
    const input = $(`#${$(this).data('target')}`);
    const visible = input.attr('type') === 'password';
    input.attr('type', visible ? 'text' : 'password');
    $(this).attr('aria-label', visible ? 'Ocultar senha' : 'Mostrar senha');
    $(this).find('i').toggleClass('bi-eye bi-eye-slash');
    input.trigger('focus');
  });

  $('#resetPasswordForm').on('submit', function (event) {
    event.preventDefault();
    if (!$(this).valid()) return;
    $('#resetFeedback').text('Os campos estão válidos. Conecte a API de recuperação para salvar a nova senha.');
  });
})();
