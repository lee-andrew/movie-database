$(document).ready(function(){
    $("#sort-order").click(function(){
       let order = $("#sort-order span").attr("id");
       if ( order === "sort-desc" ) {
           $("#sort-order span").attr("id", "sort-asc");
        
           $("#sort-imdb a").attr("href", "/?sortOrder=rating_asc");
           
           $("#sort-rt a").attr("href", "/?sortOrder=rating_asc_rt");
           $('#sort-order span').attr("class",'glyphicon glyphicon-sort-by-order');
       }
       else {
           $("#sort-order span").attr("id", "sort-desc");
          
           $("#sort-imdb a").attr("href", "/?sortOrder=rating_desc");
          
           $("#sort-rt a").attr("href", "/?sortOrder=rating_desc_rt");
           $('#sort-order span').attr("class", 'glyphicon glyphicon-sort-by-order-alt');
       }
    });
});