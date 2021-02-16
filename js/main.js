var globalData = "";
var globalResults = "";
let apiUrl = "https://betwill.com/api/game/getgametemplates/1/1/1"

async function getJson(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

async function main(size, step) {

    $('.loader').show()

    globalData = await getJson(apiUrl)

    data = globalData
    
    var gamesLength = data.GameTemplates.length

    $('.top-filter ul li span').html(`( ${gamesLength} )`)

    var GameTemplates = data.GameTemplates.sort((a, b) => {
        return (a.DefaultOrdering > b.DefaultOrdering) ? 1 : -1
    })

    var GameTemplateImages = data.GameTemplateImages
    var GameTemplateNames = data.GameTemplateNameTranslations

    let languageId = GameTemplateNames.filter(function (e) {
        return e.LanguageId == 1;
    });

    let result = GameTemplates.map(games => {
        const name = languageId.find(u => u.GameTemplateId === games.ID) || {};
        const photo = GameTemplateImages.find(s => s.GameTemplateId === name.GameTemplateId) || {};
        return { ...name, ...photo };
    });

    const sliceFrom = (size*step)-size

    globalResults = result

    var double = result.slice(sliceFrom, size*step)

    double.map(i => {

        $('.games-container ul').append(`
            <li category="">
                <div class="fav"><img src="../images/fav.png"  alt=""></div>
                <img src="https://static.inpcdn.com/${i.CdnUrl}"  alt="">
                <h1 languageid=${i.LanguageId}>${i.Value}</h1>
            </li>
        `)

        $('.loader').hide()
        $('.load-more').addClass('active')
    })


    $("#search").on('keyup', function(e) {
        
        $('.games-container ul').html('')
    
        var value = $('#search').val();
        var expression = new RegExp(value, "i")

        globalResults.map(i => {

            if(i.Value != undefined && i.CdnUrl != undefined && i.Value.search(expression) != -1) {

                $('.games-container ul').append(`
                    <li category="">
                        <div class="fav"><img src="../images/fav.png"  alt=""></div>
                        <img src="https://static.inpcdn.com/${i.CdnUrl}"  alt="">
                        <h1 languageid=${i.LanguageId}>${i.Value}</h1>
                    </li>
                `)
            } 
    
        })
    
    });
    
    var fnum = 0;

    $('.fav').click(function() {

        if($(this).parent('li').attr("category") == "fav") {

            $(this).parent('li').attr("category", "")

            $('.counter.active').html(`
                <span>${fnum-- - 1}</span>
            `)

            if($('.filter-category ul li[categorytype="fav"]').hasClass('active')) {
                $('.filter-category ul li[categorytype="fav"]').trigger( "click" );
            }

        } else if($(this).parent('li').attr("category") == ""){

            $('.counter').html(`
                <span>${fnum++ + 1}</span>
            `)

            $(".counter").addClass('active')

            $(this).parent('li').attr("category", 'fav');

        }

    })

}

function loadmore(size, step) {
    const sliceFrom = (size*step)-size

    var double = globalResults.slice(sliceFrom, size*step)

    gamesLength = globalResults.length

    if(gamesLength < size*step) $('.load-more').remove();

    double.map(i => {

        $('.games-container ul').append(`
            <li category="">
                <div class="fav"><img src="../images/fav.png"  alt=""></div>
                <img src="https://static.inpcdn.com/${i.CdnUrl}"  alt="">
                <h1 languageid=${i.LanguageId}>${i.Value}</h1>
            </li>
        `)

        $('.loader').hide()
        $('.load-more').addClass('active')
    })
}


let dataMax = 60
let step = 1
main(dataMax,step);

$('.load-more').on('click', function(e){
    e.preventDefault();
    step++
    loadmore(dataMax, step)
})

$('.switch-mode').click(function() {
    $('body').toggleClass('white-body')
    $(this).toggleClass('white')
})

$('.filter-category ul li').click(function() {

    $('.filter-category ul li').removeClass('active')
    $(this).addClass('active')

    if($(this).attr('categoryType') == "fav") {
        $(".load-more").removeClass('active');
        $('.games-container ul li:not([category="fav"])').hide()
    } else if($(this).attr('categoryType') == "all") {
        $(".load-more").addClass('active');
        $('.games-container ul').html('')
        $('.counter').removeClass('active')
        main(dataMax,step);
    }

})

var swiper = new Swiper('.swiper-container', {
    slidesPerView: 2,
    spaceBetween: 50,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        1024: {
            slidesPerView: 2,
            spaceBetween: 25,
        },
    }
});