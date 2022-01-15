$(document).ready(function(){

    $('#search').focus();

    $('#search').on('click', function(){
        $('#search').val('')
    });

    // Searching
    $('#search').keypress(delay(function(){
        $('.results').html('');
        $('.single-result').html('');
        var search = $(this).val().toLowerCase();
        // Search through json
        $.getJSON('https://pokeapi.co/api/v2/pokemon?limit=1000').done(function(data){
            const results = data.results.filter(function(pokemon){
                return pokemon.name.toLowerCase().indexOf(search) !== -1;
            });

            const pokemon = results.map(function(pokemon){
                const url = pokemon.url.substring(0, pokemon.url.length - 1);
                const id = url.substring(url.lastIndexOf('/') + 1)
                return {name: pokemon.name, id: id};
            });

            $.each(pokemon, function(index, value) {
                $('.results').append("<div id='result' data-id='"+ value.id +"'>"+ value.name +"</div>");
            });
        });
    }, 1000));

    // Selection
    $('.results').on('click', $('#result'), function(event){
        $('.results').html('');
        $.getJSON('https://pokeapi.co/api/v2/pokemon/'+ $(event.target).data('id')).done(function(data){
            const pokemon = {
                'name': data.name,
                'id': data.id,
                'sprite': data.sprites.other.dream_world.front_default, // front_default
                'types': data.types
            };

            $('.single-result').append("<div id='pokemon-result' data-id='"+ pokemon.id +"'><img class='pokemon-sprite' src='"+ pokemon.sprite +"'/><h1>"+ pokemon.name +"</h1></div><div class='pokemon-types'></div><div class='pokemon-type-info flex'></div>");

            $.each(pokemon.types, function(index, value){
                $('.pokemon-types').append('<div class="type '+ value.type.name.toLowerCase() +'">'+ value.type.name +'</div>');

                // Getting strengths and wekness
                $.getJSON('https://raw.githubusercontent.com/filipekiss/pokemon-type-chart/master/types.json').done(function(data){
                    const results = data.filter(function(types){
                        return types.name.toLowerCase().indexOf(value.type.name) !== -1;
                    });

                    const types = results.map(function(type){
                        return type;
                    });

                    $('.pokemon-type-info').append('<div class="type-breakdown pk-type-'+ value.type.name +'"><h2 class="'+ value.type.name.toLowerCase() +'">'+ value.type.name.toUpperCase() +'</h2><div class="flex"><div class="type-strength strengths-'+ value.type.name +'"><h3>Strengths</h3></div><div class="type-weakness weakness-'+ value.type.name +'"><h3>Weaknesses</h3></div></div></div>');

                    $.each(types[0].strengths, function(index, strength) {
                        $('.strengths-'+ value.type.name).append('<h4 class="type-strength '+ strength.toLowerCase() +'">'+ strength +'</h4>')
                    });

                    $.each(types[0].weaknesses, function(index, weakness) {
                        $('.weakness-'+ value.type.name).append('<h4 class="type-weakness '+ weakness.toLowerCase() +'">'+ weakness +'</h4>')
                    });
                });
            });
        });
    });

    function delay(fn, ms) {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }
});