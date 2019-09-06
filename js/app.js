var arregloPosiciones = new Array(9);
posInicial = null;
posFinal = null;
posImagenInicial = null;
posImagenFin = null;
continuaDraggable = 0;
direccionAnterior = "";
direccionActual = "";
valorPuntuacion = 5;
imagenActual = null;
arregloBusqueda = [];
/*
Funcion llenarTablaInicial permite limpiar el tableto e inicializar las variables para, posteriormente,
llenar el tablero para un nuevo juego.
También contiene el llamado a la función draggable de Jquery para poder que las imágenes se arrastren y la función droppable
para validar si la jugada es válida.

*/
function llenarTablaInicial(){
  $(".panel-tablero").html("");
  $("#movimientos-text").text("");
  $("#score-text").text("Juega rojo");
  var imagen = "";
  numeroCol = 0;
  id = "";
  continua = true;

   $( "img" ).draggable(
     {
       start: function() {
         var zInd = $(this).css("z-index") + 50;
         $(this).css("z-index",zInd);
         posInicial = $(this).offset();
         continuaDraggable = 0;
         posImagenInicial = $(this).offset();
         imagenActual = this;
       },
       drag: function() {
//         validarMoviento(this);
       },
       stop: function() {

         $(this).css("z-index",10);

        posImagenInicial = null;
        posImagenCambio = null;
        posInicial = null;
        posFinal = null;
        continuaDraggable = 0;

      }

     });

     $( ".blanco" ).droppable(
       {
         drop:function( event, ui ) {
            let xNueva = parseInt(this.id[0]);
            let yNueva = parseInt(this.id[2]);

            let color = imagenActual.id[0]
            let xAntigua = parseInt(imagenActual.id[1]);
            let yAntigua = parseInt(imagenActual.id[2]);
            let validacion1 = true;
            let validacion2 = true;

            arregloBusqueda = [];
            if(validarMovimiento(xAntigua,yAntigua,xNueva,yNueva,true,"UNA LINEA") == 0){
                volverPosicionOriginal(imagenActual,posInicial.left,posInicial.top);
                $("#movimientos-text").text("Movimiento inválido");
                validacion1 = false;
            }
            arregloBusqueda = [];
            let valor = validarMovimiento(xAntigua,yAntigua,xNueva,yNueva,false,"PRINCIPAL");
            if(valor == 0){
                volverPosicionOriginal(imagenActual,posInicial.left,posInicial.top);
                $("#movimientos-text").text("Movimiento inválido");
                validacion2 = false;
            }

            if(validacion1 || validacion2){
              $("#movimientos-text").text("");
              $(imagenActual).position({
                my: "center",
                at: "center",
                of: this
              });
              if(color == "r"){
                arregloPosiciones[xNueva][yNueva] = 1;
                $("img[id*=r]").draggable( "option", "disabled", true );
                $("img[id*=n]").draggable( "option", "disabled", false );
                $("#score-text").text("Juega negro");
              }else{
                arregloPosiciones[xNueva][yNueva] = 2;
                $("img[id*=n]").draggable( "option", "disabled", true );
                $("img[id*=r]").draggable( "option", "disabled", false );
                $("#score-text").text("Juega rojo");
              }
              arregloPosiciones[xAntigua][yAntigua] = 0;
              $(imagenActual).attr("id",color+xNueva+yNueva);

              if(validarGanador(0,2)){
                $("#movimientos-text").text("Gana jugador negro");
                $("img[id*=n]").draggable( "option", "disabled", true );
                $("img[id*=r]").draggable( "option", "disabled", true );
              }else if(validarGanador(6,1)){
                $("#movimientos-text").text("Gana jugador rojo");
                $("img[id*=n]").draggable( "option", "disabled", true );
                $("img[id*=r]").draggable( "option", "disabled", true );
              }
            }
          }
       }

     );

     $( ".negro" ).droppable(
       {
         drop:function( event, ui ) {
           volverPosicionOriginal(imagenActual,posInicial.left,posInicial.top);
           $("#movimientos-text").text("Movimiento inválido");
         }
       }
    );
}

/*
La función validarMovimiento verifica si el movimiento realizado por el jugador es válido o incorrecto.
*/
function validarMovimiento(posXInicial,posYInicial,posXFinal,posYFinal,buscaUnaLinea){
  let valorRetorno = 0
  if(posXInicial < 0 || posXInicial > 8){
   valorRetorno = 0;
 }else if(posYInicial < 0 || posYInicial > 7){
    valorRetorno = 0;
  }else if(arregloBusqueda.includes( posXInicial+"-"+posYInicial ) == false){
    arregloBusqueda.push(posXInicial+"-"+posYInicial);
    if(arregloPosiciones[posXFinal][posYFinal] > 0){
      valorRetorno = 0;
    }else if(posXInicial == posXFinal && posYInicial == posYFinal){
      valorRetorno = 1;
    }else{
      if(buscaUnaLinea == true){
        if(Math.abs(posXFinal - posXInicial) == 1){
          if(Math.abs(posYFinal - posYInicial) <= 1){
            valorRetorno = 1;
          }else {
            valorRetorno = 0;
          }
        }else{
          valorRetorno = 0;
        }
      }else{
        //Busca salto

        let sumatoria = 0;
        for(let i= 0;i < 8; i++){
          if(i == 0){
            if(validarSalto(posXInicial-1,posYInicial,posXInicial-2,posYInicial-1)){
              sumatoria += validarMovimiento(posXInicial-2,posYInicial-1,posXFinal,posYFinal,false);
            }
          }else if(i == 1){
            if(validarSalto(posXInicial-1,posYInicial-1,posXInicial-2,posYInicial-1)){
              sumatoria += validarMovimiento(posXInicial-2,posYInicial-1,posXFinal,posYFinal,false);
            }
          }else if(i == 2){
            if(validarSalto(posXInicial-1,posYInicial,posXInicial-2,posYInicial+1)){
              sumatoria += validarMovimiento(posXInicial-2,posYInicial+1,posXFinal,posYFinal,false);
            }
          }else if(i == 3){
            if(validarSalto(posXInicial-1,posYInicial+1,posXInicial-2,posYInicial+1)){
              sumatoria += validarMovimiento(posXInicial-2,posYInicial+1,posXFinal,posYFinal,false);
            }
          }else if(i == 4){
            if(validarSalto(posXInicial+1,posYInicial,posXInicial+2,posYInicial-1)){
              sumatoria += validarMovimiento(posXInicial+2,posYInicial-1,posXFinal,posYFinal,false);
            }
          }else if(i == 5){
            if(validarSalto(posXInicial+1,posYInicial-1,posXInicial+2,posYInicial-1)){
              sumatoria += validarMovimiento(posXInicial-2,posYInicial-1,posXFinal,posYFinal,false);
            }
          }else if(i == 6){
            if(validarSalto(posXInicial+1,posYInicial,posXInicial+2,posYInicial+1)){
              sumatoria += validarMovimiento(posXInicial+2,posYInicial+1,posXFinal,posYFinal,false);
            }
          }else if(i == 7){
            if(validarSalto(posXInicial+1,posYInicial+1,posXInicial+2,posYInicial+1)){
              sumatoria += validarMovimiento(posXInicial+2,posYInicial+1,posXFinal,posYFinal,false);
            }
          }
        }

        if(sumatoria >= 1){
          valorRetorno = 1;
        }
      }
    }
  }else{
    valorRetorno = 0;
  }

  return valorRetorno;
}


/*
La función validarSalto verifica si la jugada de saltar es correcta o inválida
*/
function validarSalto(x1,y1,x2,y2){
  if(x1 < 0 || x1 > 8 || x2 < 0 || x2 > 8){
    return 0;
  }
  if(y1 < 0 || y1 > 7 || y2 < 0 || y2 > 7){
    return 0;
  }
  if(arregloPosiciones[x1][y1]>0 && arregloPosiciones[x2][y2]==0){
    return 1;
  }
  return 0;
}

/*
Funcion validarGanador establece si después de una jugada hay un validarGanador
Valida las primeras 3 líneas o las últimas 3, dependiendo de la posición y el valor ingresado
*/
function validarGanador(posicion,valor){
  let contador = 0;
  for(let i=posicion;i<(posicion+3);i++){
    for (let j = 0; j < 4; j++) {
      if(arregloPosiciones[i][j] == valor){
        contador++;
      }
    }
  }
  if(contador == 12){
    return true;
  }
  return false;
}

/*
Funcion inicializarArregloPosiciones permite crear la matriz de imágenes para jugar
*/
function inicializarArregloPosiciones(){
  for (let i = 0; i < arregloPosiciones.length; i++) {
    arregloPosiciones[i] = new Array(4);
  }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 4; j++) {
      id = i+"-"+j;
      if(i <= 2){
          arregloPosiciones[i][j] = 1;
      }else if(i >=6){
        arregloPosiciones[i][j] = 2;

      }else{
        arregloPosiciones[i][j] = 0;
      }
    }
  }
}


/*
Funcion volverPosicionOriginal devuelve la imagen a la posición inicial en caso de que la jugada sea invalida
*/
function volverPosicionOriginal(imagen,posicionX,posicionY){
  $(imagen).offset({left:posicionX,top:posicionY});
}





/*
Funcion iniciar establece los valores iniciales para jugar
*/
function iniciar(){
  inicializarArregloPosiciones();
  llenarTablaInicial();
  $(".btn-reinicio").text("Reiniciar");
  $(".panel-tablero").css("border-width","10px");
  $(".panel-tablero").animate({width: '70%'},500);
  $(".panel-score").animate({width: '25%'}, 500 );
  $("img[id*=n]").draggable( "option", "disabled", true );
}

/*
Funcion que se ejecuta al terminar de cargar la página
*/
$(document).ready(function(){
  iniciar();
  $(".btn-reinicio").click(iniciar);

});
