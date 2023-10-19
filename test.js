document.querySelector('.menu-icon').addEventListener('click', function() {
   document.querySelectorAll('nav a').forEach(function(el) {
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
   });
});