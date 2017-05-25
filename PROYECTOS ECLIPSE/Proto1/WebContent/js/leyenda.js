
$('.box').each(function(){
	$(this).after('<span class="checkbox">');
});
$('.box').on('click',function(){
	$(this).toggleClass('icon-checkbox-unchecked icon-checkbox-checked');
})
$('input').click(function(){
  $('input:not(:checked)').children().toggleClass('icon-radio-unchecked icon-radio-checked2');
  $('input:checked').children().toggleClass('icon-radio-unchecked icon-radio-checked2');
});
