var id = -1

$(function(){
  $.get('http://localhost:7709/paras', function(data){
    data.forEach(p => {

      var botaoedit = $(`<input id="editar" type="button" value="Editar"/>`)
      $(botaoedit).click(function() {
        id = p._id;
        $("#botaoins").val("Editar Parágrafo"); 
        $("#para").val(p.para);
      })

      var botaorem = $(`<input id="remover" type="button" value="Remover"/>`);
      $(botaorem).click(function() {
        $.ajax({
          url: 'http://localhost:7709/paras/remover/'+p._id,
          type: 'DELETE',
          success: function(response) {
              alert("Parágrafo removido com sucesso!")
              location.reload()
          }
        });
      })
      var elem = $("<li><b>"+ p.data +":</b> " + p.para + "</li>")
      elem.append(botaoedit).append(botaorem)
      $("#paras").append(elem);
    })
  })

  $("#botaoins").click(function(){
    if (id == -1){
      $.post('http://localhost:7709/paras',$("#paraForm").serialize())
      alert('Parágrafo inserido: ' + ($("#para").val()))
      $("#para").val("")
      location.reload()
    }
    else{
      $.ajax({
        url: 'http://localhost:7709/paras/editar/'+id,
        type: 'PUT',
        data:$("#paraForm").serialize(),
        success: function(response) {
            alert('Parágrafo editado: ' + ($("#para").val()));
            $("#para").val("");
            id = -1;
            location.reload();
        }
      });
    }
  })
});
