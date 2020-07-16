$(document).ready(function () {
  let images = [];
  function preload() {
    for (let i = 0; i < arguments.length; i++) {
      images[i] = new Image();
      images[i].src = preload.arguments[i];
    }
  }

  //-- usage --//
  preload(
    "img/wire_covers/wire_asgs.svg",
    "img/wire_covers/wire_asgs_mobile.svg",
    "img/wire_covers/wire_birch.svg",
    "img/wire_covers/wire_birch_mobile.svg",
    "img/wire_covers/wire_d4sd.svg",
    "img/wire_covers/wire_d4sd_mobile.svg",
    "img/wire_covers/wire_eqr.svg",
    "img/wire_covers/wire_eqr_mobile.svg",
    "img/wire_covers/wire_intuit.svg",
    "img/wire_covers/wire_intuit_mobile.svg",
    "img/wire_covers/wire_nanome.svg",
    "img/wire_covers/wire_nanome_mobile.svg",
    "img/wire_covers/wire_workday.svg",
    "img/wire_covers/wire_workday_mobile.svg",

    "img/wire_covers/asgs.png",
    "img/wire_covers/asgs_mobile.png",
    "img/wire_covers/birch.png",
    "img/wire_covers/birch_mobile.png",
    "img/wire_covers/d4sd.png",
    "img/wire_covers/d4sd_mobile.png",
    "img/wire_covers/eqr.png",
    "img/wire_covers/eqr_mobile.png",
    "img/wire_covers/intuit.png",
    "img/wire_covers/intuit_mobile.png",
    "img/wire_covers/nanome.png",
    "img/wire_covers/nanome_mobile.png",
    "img/wire_covers/workday.png",
    "img/wire_covers/workday_mobile.png"
  );
});
