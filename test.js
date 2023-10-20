
    window.onload = function() {
        var links = document.querySelectorAll('ul li a');
        var checkbox = document.getElementById('check');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function() {
                checkbox.checked = false;
            });
        }
    }

