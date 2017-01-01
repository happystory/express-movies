$(function() {
    $('.del').click(function(e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE',
            url: '/admin/list?id=' + id
        })
        .done(function(result) {
            if (result.errno === 0) {
                if (tr.length > 0) {
                    tr.remove();
                }
            }
        });
    });

    $('#douban').blur(function() {
        var douban = $(this);
        var id = douban.val();

        if (id) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/subject/' + id,
                cache: true,
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success: function(data) {
                    $('#inputTitle').val(data.title);
                    $('#inputDirector').val(data.directors[0].name);
                    $('#inputPoster').val(data.images.large);
                    $('#inputCountry').val(data.countries[0]);
                    $('#inputLanguage').val(data.countries[0].substring(0, 1));
                    $('#inputFlash').val(data.share_url);
                    $('#inputYear').val(data.year);
                    $('#inputSummary').val(data.summary);
                }
            });
        }
    });
});
