(function(){

  if(
    document.getElementById(
      "sigvic-modal-styles"
    )
  ){
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "sigvic-modal-styles";

  style.innerHTML = `

    #sigvic-modal-overlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.65);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:20000;
    }

    #sigvic-modal{
      background:#111827;
      color:white;
      width:90%;
      max-width:420px;
      border-radius:16px;
      padding:24px;
      box-shadow:
        0 10px 40px rgba(0,0,0,.6);
    }

    #sigvic-modal-titulo{
      font-size:22px;
      font-weight:bold;
      margin-bottom:12px;
    }

    #sigvic-modal-mensaje{
      color:#d1d5db;
      margin-bottom:20px;
      line-height:1.5;
    }

    #sigvic-modal-botones{
      display:flex;
      justify-content:flex-end;
      gap:10px;
    }

    .sigvic-btn{
      border:none;
      border-radius:10px;
      padding:10px 18px;
      color:white;
      cursor:pointer;
      font-weight:600;
      font-size:14px;
    }

    .sigvic-btn-gris{
      background:#6b7280;
    }

    .sigvic-btn-verde{
      background:#16a34a;
    }

    .sigvic-btn-azul{
      background:#2563eb;
    }

  `;

  document.head.appendChild(
    style
  );

})();

function crearModalBase(){

  let overlay =
    document.getElementById(
      "sigvic-modal-overlay"
    );

  if(overlay){
    overlay.remove();
  }

  overlay =
    document.createElement(
      "div"
    );

  overlay.id =
    "sigvic-modal-overlay";

  overlay.innerHTML = `

    <div id="sigvic-modal">

      <div id="sigvic-modal-titulo"></div>

      <div id="sigvic-modal-mensaje"></div>

      <div id="sigvic-modal-botones"></div>

    </div>

  `;

  document.body.appendChild(
    overlay
  );

  return overlay;

}

function cerrarModal(){

  const overlay =
    document.getElementById(
      "sigvic-modal-overlay"
    );

  if(overlay){
    overlay.remove();
  }

}

function mostrarAlerta({
  titulo = "SIGVIC",
  mensaje = ""
}){

  return new Promise(resolve => {

    crearModalBase();

    document.getElementById(
      "sigvic-modal-titulo"
    ).innerHTML =
      titulo;

    document.getElementById(
      "sigvic-modal-mensaje"
    ).innerHTML =
      mensaje;

    document.getElementById(
      "sigvic-modal-botones"
    ).innerHTML = `

      <button
        class="sigvic-btn sigvic-btn-azul"
        id="sigvic-btn-ok">

        Aceptar

      </button>

    `;

    document.getElementById(
      "sigvic-btn-ok"
    ).onclick = ()=>{

      cerrarModal();

      resolve(true);

    };

  });

}

function mostrarConfirmacion({
  titulo = "Confirmación",
  mensaje = ""
}){

  return new Promise(resolve => {

    crearModalBase();

    document.getElementById(
      "sigvic-modal-titulo"
    ).innerHTML =
      titulo;

    document.getElementById(
      "sigvic-modal-mensaje"
    ).innerHTML =
      mensaje;

    document.getElementById(
      "sigvic-modal-botones"
    ).innerHTML = `

      <button
        class="sigvic-btn sigvic-btn-gris"
        id="sigvic-btn-cancelar">

        Cancelar

      </button>

      <button
        class="sigvic-btn sigvic-btn-verde"
        id="sigvic-btn-confirmar">

        Confirmar

      </button>

    `;

    document.getElementById(
      "sigvic-btn-cancelar"
    ).onclick = ()=>{

      cerrarModal();

      resolve(false);

    };

    document.getElementById(
      "sigvic-btn-confirmar"
    ).onclick = ()=>{

      cerrarModal();

      resolve(true);

    };

  });

}

function mostrarSolicitudPin({
  titulo = "Validación",
  mensaje = "Ingrese NIP del vigilante"
}){

  return new Promise(resolve => {

    crearModalBase();

    document.getElementById(
      "sigvic-modal-titulo"
    ).innerHTML =
      titulo;

    document.getElementById(
      "sigvic-modal-mensaje"
    ).innerHTML = `

      <div style="margin-bottom:12px;">
        ${mensaje}
      </div>

      <input
        id="sigvic-pin"
        type="password"
        autocomplete="off"
        style="
          width:100%;
          height:48px;
          border-radius:10px;
          border:none;
          padding:0 12px;
          box-sizing:border-box;
          font-size:18px;
          background:#1f2937;
          color:white;
        "
      >

    `;

    document.getElementById(
      "sigvic-modal-botones"
    ).innerHTML = `

      <button
        class="sigvic-btn sigvic-btn-gris"
        id="sigvic-btn-cancelar">

        Cancelar

      </button>

      <button
        class="sigvic-btn sigvic-btn-verde"
        id="sigvic-btn-confirmar">

        Confirmar

      </button>

    `;

    document.getElementById(
      "sigvic-pin"
    ).focus();

    document.getElementById(
      "sigvic-btn-cancelar"
    ).onclick = ()=>{

      cerrarModal();

      resolve(null);

    };

    document.getElementById(
      "sigvic-btn-confirmar"
    ).onclick = ()=>{

      const valor =
        document.getElementById(
          "sigvic-pin"
        ).value.trim();

      cerrarModal();

      resolve(valor);

    };

  });

}
